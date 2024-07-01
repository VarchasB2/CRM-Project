import db from "@/app/modules/db";
import { AllContacts, Contact, Opportunity } from "@prisma/client";
import { NavigationMenuIndicator } from "@radix-ui/react-navigation-menu";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import countryList from "react-select-country-list";
import { formSchema } from "./../../../components/tables/Leads/forms/create-lead";

type Params = {
  name: string;
};
export async function POST(req: Request) {
  try {
    console.log("POST");
    const obj = await req.json();
    const owner = await db.user.findUnique({
      where: { name: obj.lead_owner },
    });
    // const updatedAllContacts = [];

    // // Check and update deletedAt for each contact
    // for (const contact of obj.contacts) {
    //   let existingContact = await db.allContacts.findUnique({
    //     where: {
    //       email: contact.email,
    //     },
    //   });

    //   if (existingContact && existingContact.deletedAt !== null) {
    //     existingContact = await db.allContacts.update({
    //       where: {
    //         id: existingContact.id,
    //       },
    //       data: {
    //         deletedAt: null,
    //       },
    //     });
    //     updatedAllContacts.push(existingContact); // Track updated contacts
    //   } else {
    //     updatedAllContacts.push(existingContact || contact); // Track original or newly created contacts
    //   }
    // }
    const updatedAllContacts = await Promise.all(
      obj.contacts.map(async (contact: AllContacts) => {
        let existingContact = await db.allContacts.findUnique({
          where: {
            email: contact.email,
          },
        });

        if (existingContact && existingContact.deletedAt !== null) {
          existingContact = await db.allContacts.update({
            where: {
              id: existingContact.id,
            },
            data: {
              deletedAt: null,
              phone_number: contact.phone_number, // Update phone_number
              designation: contact.designation, // Update designation
            },
          });
          return existingContact; // Return updated contact
        } else {
          return db.allContacts.upsert({
            where: { email: contact.email }, // Use email as unique identifier
            create: {
              ...contact, // Create the contact with all fields from the request
            },
            update: {
              phone_number: contact.phone_number, // Update phone_number
              designation: contact.designation, // Update designation
            },
          });
        }
      })
    );
    const lead = await db.leads.create({
      data: {
        owner_id: owner!.id,
        type_of_company: obj.type_of_company,
        funnel_stage: obj.funnel_stage,
        company_name: obj.company_name,
        region: obj.region,
        country: countryList().getLabel(obj.country),

        contacts: {
          connectOrCreate: updatedAllContacts.map((contact: AllContacts) => {
            return {
              where: { email: contact.email },
              create: contact,
            };
          }),
        },
      },
      include: {
        contacts: true,
      },
    });
    // console.log('updated contacts',updatedContacts)
    let account;
    if (obj.opportunities.length > 0) {
      // const updatedContacts = [];

      // // Check and update deletedAt for each contact
      // for (const contact of obj.contacts) {
      //   let existingContact = await db.contact.findUnique({
      //     where: {
      //       email: contact.email,
      //     },
      //   });

      //   if (existingContact && existingContact.deletedAt !== null) {
      //     existingContact = await db.contact.update({
      //       where: {
      //         id: existingContact.id,
      //       },
      //       data: {
      //         deletedAt: null,
      //       },
      //     });
      //     updatedContacts.push(existingContact); // Track updated contacts
      //   } else {
      //     updatedContacts.push(existingContact || contact); // Track original or newly created contacts
      //   }
      // }
      const updatedContacts = await Promise.all(
        obj.contacts.map(async (contact: Contact) => {
          let existingContact = await db.contact.findUnique({
            where: {
              email: contact.email,
            },
          });

          if (existingContact && existingContact.deletedAt !== null) {
            existingContact = await db.contact.update({
              where: {
                id: existingContact.id,
              },
              data: {
                deletedAt: null,
                phone_number: contact.phone_number, // Update phone_number
                designation: contact.designation, // Update designation
              },
            });
            return existingContact; // Return updated contact
          } else {
            return db.contact.upsert({
              where: { email: contact.email }, // Use email as unique identifier
              create: {
                ...contact, // Create the contact with all fields from the request
              },
              update: {
                phone_number: contact.phone_number, // Update phone_number
                designation: contact.designation, // Update designation
              },
            });
          }
        })
      );

      account = await db.account.create({
        data: {
          lead_id: lead.id,
          date: lead.date,
          type_of_company: lead.type_of_company,
          funnel_stage: lead.funnel_stage,
          company_name: lead.company_name,
          region: lead.region,
          country: lead.country,
          contacts: {
            connectOrCreate: updatedContacts.map((contact: Contact) => {
              return {
                where: { email: contact.email },
                create: contact,
              };
            }),
          },
          opportunities: {
            create: obj.opportunities.map((opportunity: any) => {
              return {
                revenue: opportunity.revenue,
                contact: {
                  // connect:{
                  //   email: opportunity.contact_email
                  // }
                  connect: opportunity.contact_email.map((e: any) => {
                    // console.log('OBJECT E',e)
                    return { email: e };
                  }),
                },
                notes: {
                  create: opportunity.notes.map((note: any) => ({
                    description: note.description,
                    date: note.date,
                  })),
                },
              };
            }),
          },
        },
        include: {
          opportunities: {
            include: {
              contact: true,
            },
          },
        },
      });
    }

    await db.history.create({
      data: {
        lead_id: lead.id,
        crud: "create",
        lead_data: lead,
        account_data: account ? account : undefined,
      },
    });

    return Response.json(lead);
  } catch (error) {
    console.log("error", error);
  }
}

export async function PUT(req: Request) {
  try {
    console.log("PUT");

    const obj = await req.json();
    console.log('IN PUT',obj);
    const leadId = obj.original.id;
    const updatedContacts = obj.contacts;
    const originalContacts = obj.original.contacts;
    // console.log("updatedContacts", updatedContacts);
    // console.log("originalContacts", originalContacts);
    const contactsToDisconnect = originalContacts
      .filter((originalContact: any) => {
        // Check if original contact email is not in updated contacts
        return !updatedContacts.some(
          (updatedContact: any) =>
            updatedContact.email === originalContact.email
        );
      })
      .map((contact: any) => contact.email); // Ensure contactsToDisconnect is an array of emails

    if (!leadId) {
      return Response.json({ error: "Invalid request. Missing lead_id." });
    }
    // console.log("contacts to disconnect", contactsToDisconnect);
    let account_data = undefined;
    const updatedLead = await db.leads.update({
      where: { id: leadId },
      data: {
        type_of_company: obj.type_of_company,
        funnel_stage: obj.funnel_stage,
        company_name: obj.company_name,
        region: obj.region,
        country: countryList().getLabel(obj.country),

        // Update contacts in the lead
        contacts: {
          connectOrCreate: obj.contacts.map((contact: any) => ({
            where: { email: contact.email },
            create: {
              first_name: contact.first_name,
              last_name: contact.last_name,
              designation: contact.designation,
              email: contact.email,
              phone_number: contact.phone_number,
            },
          })),
          disconnect: contactsToDisconnect.map((email: string) => ({
            email: email,
          })),
        },
      },
      include: {
        contacts: true, // Include associated contacts in the response
      },
    });
    await db.allContacts.updateMany({
      where: {
        lead: {
          none: {},
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });
    // console.log("Updated Lead", updatedLead);
    if (obj.opportunities.length === 0) {
      if (obj.original.account === null) {
      } else {
        await db.opportunity.deleteMany({
          where: {
            account_id: obj.original.account.id,
          },
        });
        await db.account.delete({
          where: {
            lead_id: updatedLead.id,
          },
        });
      }
    } else {
      await db.notes.deleteMany({
        where:{
          opportunity_id:{
            in:obj.original.account.opportunities.map((opportunity:any)=>opportunity.id)
          }
        }
      })
      const account = await db.account.upsert({
        where: { lead_id: leadId },
        create: {
          lead_id: updatedLead.id,
          date: updatedLead.date,
          type_of_company: updatedLead.type_of_company,
          funnel_stage: updatedLead.funnel_stage,
          company_name: updatedLead.company_name,
          region: updatedLead.region,
          country: updatedLead.country,
          contacts: {
            connectOrCreate: obj.contacts.map((contact: Contact) => {
              return {
                where: { email: contact.email },
                create: contact,
              };
            }),
          },
          opportunities: {
            create: obj.opportunities.map((opportunity: any) => {
              return {
                notes: {
                  create: opportunity.notes.map((note: any) => ({
                    description: note.description,
                    date: note.date,
                  })),
                },
                revenue: opportunity.revenue,
                contact: {
                  // connect:{
                  //   email: opportunity.contact_email
                  // }
                  connect: opportunity.contact_email.map((e: any) => {
                    // console.log('OBJECT E',e)
                    return { email: e };
                  }),
                },
              };
            }),
          },
        },
        update: {
          type_of_company: obj.type_of_company,
          funnel_stage: obj.funnel_stage,
          company_name: obj.company_name,
          region: obj.region,
          country: countryList().getLabel(obj.country),

          // Update contacts in the account
          contacts: {
            connectOrCreate: obj.contacts.map((contact: any) => {
              // console.log("EMAIL ", contact.email);
              return {
                where: { email: contact.email },
                create: {
                  first_name: contact.first_name,
                  last_name: contact.last_name,
                  designation: contact.designation,
                  email: contact.email,
                  phone_number: contact.phone_number,
                },
              };
            }),
            disconnect: contactsToDisconnect.map((email: string) => ({
              email: email,
            })),
          },

          // Handle opportunities
          opportunities: {
            // Delete all existing opportunities linked to the account
            deleteMany: {},
            // Create new opportunities from obj.opportunities
            create: obj.opportunities.map((newOpportunity: any) => {
              // console.log("NEW OPPORTUNITY", newOpportunity);
              return {
                notes: {
                  create: newOpportunity.notes.map((note: any) => ({
                    description: note.description,
                    date: note.date,
                  })),
                },
                revenue: newOpportunity.revenue,
                contact: {
                  connect: Array.isArray(newOpportunity.contact_email)
                    ? newOpportunity.contact_email.map((email: any) => {
                        // console.log("NEW OPP CONTACT", email);
                        return { email: email };
                      })
                    : [],
                },
              };
            }),
          },
        },

        include: {
          contacts: true, // Include associated contacts in the response
        },
      });
      account_data = account;
    }

    await db.contact.updateMany({
      where: {
        account: {
          none: {},
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });
    await db.history.create({
      data: {
        lead_id: updatedLead.id,
        crud: "update",
        lead_data: updatedLead,
        account_data: account_data ? account_data : undefined,
      },
    });

    return Response.json({ success: true }); // Ensure to return a response here
  } catch (error) {
    console.error("Failed to update lead:", error);
    return Response.json({ error: "Failed to update lead." }); // Ensure to return a response here
  }
}

export async function DELETE(req: Request) {
  console.log();
  try {
    const leadID = await req.json();
    await db.$transaction([
      db.history.updateMany({
        where: {
          lead_id: leadID,
        },
        data: {
          deletedAt: new Date(),
        },
      }),
      db.opportunity.updateMany({
        where: {
          account: {
            lead_id: leadID,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      }),
      db.account.updateMany({
        where: {
          lead_id: leadID,
        },
        data: {
          deletedAt: new Date(),
        },
      }),
      db.leads.update({
        where: {
          id: leadID,
        },
        data: {
          deletedAt: new Date(),
        },
      }),
    ]);
    const allContactsToUpdate = await db.allContacts.findMany({
      where: {
        lead: {
          every: {
            deletedAt: { not: null }, // Check if every related lead is deleted
          },
        },
      },
    });

    for (const contact of allContactsToUpdate) {
      await db.allContacts.update({
        where: {
          id: contact.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }

    // Soft delete Contacts if all related accounts are deleted
    const contactsToUpdate = await db.contact.findMany({
      where: {
        account: {
          every: {
            deletedAt: { not: null }, // Check if every related account is deleted
          },
        },
      },
    });

    for (const contact of contactsToUpdate) {
      await db.contact.update({
        where: {
          id: contact.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }
    return Response.json({ sucess: true });
  } catch (e) {
    console.log(e);
    return Response.json({ data: e });
  }
}
