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
    const obj = await req.json();
    const owner = await db.user.findUnique({
      where: { name: obj.lead_owner },
    });
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
        lead_owner: {
          select: {
            name: true,
          },
        },
      },
    });
    // ('updated contacts',updatedContacts)
    let account;
    if (obj.opportunities.length > 0) {
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
                    // ('OBJECT E',e)
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
              notes: true,
            },
          },
        },
      });
    }
    await db.history.create({
      data: {
        lead_id: lead.id,
        crud: "Create",
        changes: leadToString(lead),
        user: obj.user,
        // account_data: account ? account : undefined,
      },
    });
    if (obj.opportunities.length > 0) {
      for(const opportunity of account!.opportunities){
        const changeString = opportunityToString(opportunity);
        await db.history.create({
          data: {
            lead_id: lead.id,
            crud: "Create",
            changes: changeString,
            user: obj.user,
          },
        });
      }
      
    }

    return Response.json(lead);
  } catch (error) {
    console.log("error", error);
  }
}

export async function PUT(req: Request) {
  try {
    console.log("PUT");

    const obj = await req.json();
    // console.log('IN PUT',obj);
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
    obj.contacts.map(async (contact: any) => {
      await db.allContacts.update({
        where: {
          email: contact.email,
        },
        data: {
          first_name: contact.first_name,
          last_name: contact.last_name,
          designation: contact.designation,
          phone_number: contact.phone_number,
        },
      });
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
    console.log(obj);
    if (obj.opportunities.length === 0) {
      if (obj.original.account === null) {
      } else {
        await db.notes.deleteMany({
          where: {
            opportunity_id: {
              in: obj.original.account.opportunities.map(
                (opportunity: any) => opportunity.id
              ),
            },
          },
        });
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
      console.log("HREE?");
      if (obj.original.account !== null) {
        await db.notes.deleteMany({
          where: {
            opportunity_id: {
              in: obj.original.account.opportunities.map(
                (opportunity: any) => opportunity.id
              ),
            },
          },
        });
      }
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
          contacts: true,
          opportunities: {
            include: {
              contact: true,
              notes: true,
            },
          }, // Include associated contacts in the response
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
    const originalLead: any = {
      id: obj.original.id,
      owner_id: obj.original.owner_id,
      date: new Date(obj.original.date),
      type_of_company: obj.original.type_of_company,
      funnel_stage: obj.original.funnel_stage,
      company_name: obj.original.company_name,
      region: obj.original.region,
      country: obj.original.country,
      deletedAt: obj.original.deletedAt,
      contacts: obj.original.contacts,
    };

    const finalUpdatedlead = await db.leads.findUnique({
      where: { id: updatedLead.id },
      include: {
        contacts: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });
    logChangedLeads(originalLead, finalUpdatedlead, obj.user);
    console.log("original acc", obj.original.account);
    console.log("updated acc", account_data);
    if (obj.original.account !== null && account_data === undefined) {
      const opportunities = obj.original.account.opportunities.map(
        (opportunity: any) => opportunityToString(opportunity)
      );
      console.log("opportunity deleted", opportunities);
      // await db.history.create({
      //   data: {
      //     lead_id: obj.original.id,
      //     crud: "Delete",
      //     changes: obj.original.account.opportunities.map((opportunity: any) =>
      //       opportunityToString(opportunity)
      //     ), //MAKE CHANGES HERE AND IN THE CONSOLE.LOG BELOW
      //     user: obj.user,
      //   },
      // });
      for (const opportunity of obj.original.account.opportunities) {
        const changeString = opportunityToString(opportunity);
        await db.history.create({
          data: {
            lead_id: obj.original.id,
            crud: "Delete",
            changes: changeString,
            user: obj.user,
          },
        });
      }
    } else if (account_data !== undefined && obj.original.account === null) {
      const opportunities = account_data.opportunities.map((opportunity: any) =>
        opportunityToString(opportunity)
      );
      console.log("new opportunity added", opportunities);
      // await db.history.create({
      //   data: {
      //     lead_id: obj.original.id,
      //     crud: "Create",
      //     changes: account_data.opportunities.map((opportunity:any)=>opportunityToString(opportunity)),
      //     // obj.original.account.opportunities.map(
      //     //   (opportunity: any) =>
      //     //     opportunityToString(opportunity)
      //     // ),
      //     user: obj.user,
      //   },
      // });
      for (const opportunity of account_data.opportunities) {
        const changeString = opportunityToString(opportunity);
        await db.history.create({
          data: {
            lead_id: obj.original.id,
            crud: "Create",
            changes: changeString,
            user: obj.user,
          },
        });
      }
    } else {
      const originalOpportunities = obj.original.account.opportunities;
      const updatedOpportunities = account_data?.opportunities.map(
        (opportunity: any) => {
          return { ...opportunity, revenue: parseFloat(opportunity.revenue) };
        }
      );
      logChangedOpportunities(
        originalOpportunities,
        updatedOpportunities,
        obj.user,
        obj.original.id
      );
      // await db.history.create({
      //   data: {
      //     lead_id: updatedLead.id,
      //     crud: "update",
      //     lead_data: updatedLead,
      //     account_data: account_data ? account_data : undefined,
      //   },
      // });
    }

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
const _ = require("lodash");
async function logChangedLeads(original: any, updated: any, user: any) {
  console.log("USER", user);
  const omittedProps = ["id", "owner_id", "date", "contacts", "deletedAt"]; // Properties to omit
  const originalWithoutOmitted = _.omit(original, omittedProps);
  const updatedWithoutOmitted = _.omit(updated, omittedProps);
  const historyEntries = [];
  const leadChanges: any = [];
  const updatedContactChanges: any = [];
  const contactOmittedProps = ["id", "deletedAt"];
  // const originalContacts = _.omit(original.contacts,contactOmittedProps)
  // const updatedContacts = _.omit(updated.contacts,contactOmittedProps)
  const originalContacts = original.contacts.map((contact: any) =>
    _.omit(contact, contactOmittedProps)
  );
  const updatedContacts = updated.contacts.map((contact: any) =>
    _.omit(contact, contactOmittedProps)
  );
  // console.log(originalContacts)
  // console.log(updatedContacts)
  // console.log(originalContacts)
  // Iterate through updated object and compare with original
  Object.keys(updatedWithoutOmitted).forEach((key) => {
    if (!_.isEqual(originalWithoutOmitted[key], updatedWithoutOmitted[key])) {
      leadChanges.push(
        `'${capitalizeFirstLetter(key)}' changed from '${
          originalWithoutOmitted[key]
        }' to '${updatedWithoutOmitted[key]}'`
      );
    }
  });
  if (leadChanges.length > 0) {
    historyEntries.push({
      lead_id: original.id, // Assuming original.id is the lead_id
      crud: "Update",
      changes: leadChanges.join("\n"),
      user: user, // Assuming user is the name or identifier of the user making changes
    });
  }
  originalContacts.forEach((originalContact: any, index: any) => {
    const updatedContact = updatedContacts[index];
    if (updatedContact) {
      Object.keys(updatedContact).forEach((key) => {
        if (!_.isEqual(originalContact[key], updatedContact[key])) {
          updatedContactChanges.push(
            `Contact ${index + 1}, field '${capitalizeFirstLetter(
              key
            )}' changed from '${originalContact[key]}' to '${
              updatedContact[key]
            }'`
          );
        }
      });
    }
  });
  if (originalContacts.length !== updatedContacts.length) {
    const removedContacts = originalContacts.filter((oContact: any) => {
      return !updatedContacts.some((uContact: any) =>
        _.isEqual(oContact, uContact)
      );
    });
    const addedContacts = updatedContacts.filter((uContact: any) => {
      return !originalContacts.some((oContact: any) =>
        _.isEqual(oContact, uContact)
      );
    });
    removedContacts.forEach((contact: any) => {
      historyEntries.push({
        lead_id: original.id, // Assuming original.id is the lead_id
        crud: "Delete",
        changes: `Contact removed:\n${contactToString(contact)}`,
        user: user, // Assuming user is the name or identifier of the user making changes
      });
    });

    addedContacts.forEach((contact: any) => {
      historyEntries.push({
        lead_id: original.id, // Assuming original.id is the lead_id
        crud: "Create",
        changes: `New contact added:\n${contactToString(contact)}`,
        user: user, // Assuming user is the name or identifier of the user making changes
      });
    });
  }

  // Log removed contacts

  // Add contact changes to history entries

  updatedContactChanges.forEach((change: any) => {
    historyEntries.push({
      lead_id: original.id, // Assuming original.id is the lead_id
      crud: "Update",
      changes: change,
      user: user, // Assuming user is the name or identifier of the user making changes
    });
  });

  // Save history entries to database
  try {
    const createdEntries = await db.history.createMany({
      data: historyEntries.map((entry) => ({
        ...entry,
        date: new Date(),
      })),
    });
    console.log("History entries created:", createdEntries);
  } catch (error) {
    console.error("Error creating history entries:", error);
  }
}

async function logChangedOpportunities(
  original: any,
  updated: any,
  user: any,
  leadId: any
) {
  console.log("USER", user);

  const omittedProps = ["deletedAt", "date", "id", "account_id"]; // Properties to omit from comparison
  const contactOmittedProps = ["id", "deletedAt"];

  const historyEntries = [];

  const originalWithoutOmitted = original.map((opportunity: any) =>
    _.omit(opportunity, omittedProps)
  );
  const updatedWithoutOmitted = updated.map((opportunity: any) =>
    _.omit(opportunity, omittedProps)
  );

  const maxOpportunitiesLength = Math.max(
    originalWithoutOmitted.length,
    updatedWithoutOmitted.length
  );

  for (let i = 0; i < maxOpportunitiesLength; i++) {
    const originalOpportunity = originalWithoutOmitted[i];
    const updatedOpportunity = updatedWithoutOmitted[i];

    if (!originalOpportunity && updatedOpportunity) {
      // New opportunity added
      historyEntries.push({
        crud: "Create",
        changes: `New opportunity added:\n${JSON.stringify(
          {
            ...updatedOpportunity,
            contact: updatedOpportunity.contact.map(
              (contact: any) => contact.email
            ),
          },
          null,
          2
        )}`,
        user: user,
      });
      continue;
    }

    if (originalOpportunity && !updatedOpportunity) {
      // Opportunity removed
      historyEntries.push({
        crud: "Delete",
        changes: `Opportunity removed:\n${JSON.stringify(
          {
            ...originalOpportunity,
            contact: originalOpportunity.contact.map(
              (contact: any) => contact.email
            ),
          },
          null,
          2
        )}`,
        user: user,
      });
      continue;
    }

    if (originalOpportunity && updatedOpportunity) {
      if (!_.isEqual(originalOpportunity.revenue, updatedOpportunity.revenue)) {
        console.log("originalOpportunity.revenue", originalOpportunity.revenue);
        console.log("updatedOpportunity.revenue", updatedOpportunity.revenue);
        historyEntries.push({
          crud: "Update",
          changes: `'Revenue' changed from '${originalOpportunity.revenue}' to '${updatedOpportunity.revenue}'`,
          user: user,
        });
      }
    }

    const originalContacts = originalOpportunity.contact.map((contact: any) =>
      _.omit(contact, contactOmittedProps)
    );
    const updatedContacts = updatedOpportunity.contact.map((contact: any) =>
      _.omit(contact, contactOmittedProps)
    );
    const removedContacts = originalContacts.filter((oContact: any) => {
      return !updatedContacts.some((uContact: any) =>
        _.isEqual(oContact, uContact)
      );
    });

    const addedContacts = updatedContacts.filter((uContact: any) => {
      return !originalContacts.some((oContact: any) =>
        _.isEqual(oContact, uContact)
      );
    });

    const originalNotes = originalOpportunity.notes.map((note: any) => ({
      description: note.description,
      date: new Date(note.date),
    }));
    const updatedNotes = updatedOpportunity.notes.map((note: any) => ({
      description: note.description,
      date: new Date(note.date),
    }));

    if (originalNotes.length !== updatedNotes.length) {
      const removedNotes = originalNotes.filter((oNote: any) => {
        return !updatedNotes.some((uNote: any) => _.isEqual(oNote, uNote));
      });

      const addedNotes = updatedNotes.filter((uNote: any) => {
        return !originalNotes.some((oNote: any) => _.isEqual(oNote, uNote));
      });

      removedNotes.forEach((note: any) => {
        historyEntries.push({
          crud: "Delete",
          changes: `Note removed:\n${noteToString(note)}`,
          user: user,
        });
      });

      addedNotes.forEach((note: any) => {
        historyEntries.push({
          crud: "Create",
          changes: `New note added:\n${noteToString(note)}`,
          user: user,
        });
      });
    } else {
      const updatedNoteChanges: any = [];
      originalNotes.forEach((originalNote: any, noteIndex: any) => {
        const updatedNote = updatedNotes[noteIndex];
        if (updatedNote) {
          Object.keys(updatedNote).forEach((key) => {
            if (!_.isEqual(originalNote[key], updatedNote[key])) {
              console.log("key", key);
              updatedNoteChanges.push(
                `Note ${noteIndex + 1}, field '${
                  key === "date" ? "Due date" : capitalizeFirstLetter(key)
                }' changed from '${
                  key === "date"
                    ? originalNote[key].toLocaleDateString("en-In")
                    : originalNote[key]
                }' to '${
                  key === "date"
                    ? updatedNote[key].toLocaleDateString("en-In")
                    : updatedNote[key]
                }'`
              );
            }
          });
        }
      });

      updatedNoteChanges.forEach((change: any) => {
        historyEntries.push({
          crud: "Update",
          changes: change,
          user: user,
        });
      });
    }

    removedContacts.forEach((contact: any) => {
      historyEntries.push({
        crud: "Delete",
        changes: `Point of contact removed: ${contact.email}`,
        user: user,
      });
    });

    addedContacts.forEach((contact: any) => {
      historyEntries.push({
        crud: "Create",
        changes: `Point of contact added: ${contact.email}`,
        user: user,
      });
    });
  }
  // console.log(historyEntries);
  // Save history entries to database
  try {
    const createdEntries = await db.history.createMany({
      data: historyEntries.map((entry) => ({
        ...entry,
        date: new Date(),
        lead_id: leadId,
      })),
    });
    console.log("History entries created:", createdEntries);
  } catch (error) {
    console.error("Error creating history entries:", error);
  }
}
// Utility functions
function noteToString(note: any) {
  console.log(typeof note.date);
  return `Description: ${note.description}, Date: ${
    typeof note.date === "string"
      ? new Date(note.date).toLocaleDateString("en-In")
      : note.date.toLocaleDateString("en-In")
  }`;
}
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function contactToString(contact: any) {
  return `Name: ${contact.first_name} ${contact.last_name}\nDesignation: ${contact.designation}\nEmail: ${contact.email}\nPhone number: ${contact.phone_number}`;
}
// add to history, add opportunities, hook up form,display history page
function opportunityToString(opportunity: any) {
  console.log("OPP", opportunity);
  return `Opportunity:\nRevenue: $${
    opportunity.revenue
  }\nPoint of contact(s): ${opportunity.contact
    .map((contact: any) => {
      console.log("Contact", contact);
      return contact.email;
    })
    .join(", ")}\nNotes: ${opportunity.notes.map((note: any) => {
    console.log(note);
    return noteToString(note);
  })}`;
}
function leadToString(lead: any) {
  return `Lead:\nLead Owner: ${
    lead.lead_owner.name
  }\nCreated on: ${lead.date.toLocaleDateString("en-In")}\nType of company: ${
    lead.type_of_company
  }\nCompany name: ${lead.company_name}\nFunnel stage: ${
    lead.funnel_stage
  }\nRegion: ${lead.region}\nCountry: ${
    lead.country
  }\nContacts:\n${lead.contacts.map(
    (contact: any) => `${contactToString(contact)}\n`
  )}`;
}
