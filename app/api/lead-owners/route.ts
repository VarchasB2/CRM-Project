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
    const lead = await db.leads.create({
      data: {
        owner_id: owner!.id,
        type_of_company: obj.type_of_company,
        funnel_stage: obj.funnel_stage,
        company_name: obj.company_name,
        region: obj.region,
        country: countryList().getLabel(obj.country),

        contacts: {
          connectOrCreate: obj.contacts.map((contact: AllContacts) => {
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

    let account;
    if (obj.opportunities.length > 0) {
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
                description: opportunity.description,
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
        lead_data:lead,
        account_data: account ? account: undefined,
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
    console.log(obj.original);
    const leadId = obj.original.id;
    const updatedContacts = obj.contacts;
    const originalContacts = obj.original.contacts;
    console.log("updatedContacts", updatedContacts);
    console.log("originalContacts", originalContacts);
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
    console.log("contacts to disconnect", contactsToDisconnect);
    let account_data = undefined
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
    await db.allContacts.deleteMany({
      where: {
        lead: {
          none: {},
        },
      },
    });
    console.log("Updated Lead", updatedLead);
    if (obj.opportunities.length === 0) {
      if (obj.original.account === null) {
      } else {
        const test = await db.account.findFirst({
          where: {
            lead_id: updatedLead.id,
          },
        });
        console.log("TEST", test);
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
      const account =await db.account.upsert({
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
                description: opportunity.description,
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
              console.log("EMAIL ", contact.email);
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
              console.log("NEW OPPORTUNITY", newOpportunity);
              return {
                description: newOpportunity.description,
                revenue: newOpportunity.revenue,
                contact: {
                  connect: Array.isArray(newOpportunity.contact_email)
                    ? newOpportunity.contact_email.map((email: any) => {
                        console.log("NEW OPP CONTACT", email);
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
      account_data = account
    }

    await db.contact.deleteMany({
      where: {
        account: {
          none: {},
        },
      },
    });
    await db.history.create({
      data: {
        lead_id: updatedLead.id,
        crud: "update",
        lead_data:updatedLead,
        account_data: account_data ? account_data: undefined,
      },
    });

    return Response.json({ success: true }); // Ensure to return a response here
  } catch (error) {
    console.error("Failed to update lead:", error);
    return Response.json({ error: "Failed to update lead." }); // Ensure to return a response here
  }
}

export async function DELETE(req:Request) {
  console.log()
  try{
    const leadID = await req.json()
    await db.$transaction([
      db.history.deleteMany({
        where:{
          lead_id:leadID
        }
      }),
      db.opportunity.deleteMany({
        where:{
          account:{
            lead_id:leadID
          }
        }
      }),
      db.account.deleteMany({
        where:{
          lead_id:leadID
        }
      }),
      db.leads.delete({
        where:{
          id:leadID
        }
      })
    ])
    await db.allContacts.deleteMany({
      where:{
        lead:{
          none:{}
        }
      }
    })
    await db.contact.deleteMany({
      where:{
        account:{
          none:{}
        }
      }
    })
    return Response.json({sucess: true})
  }catch(e){
    console.log(e)
    return Response.json({data:e})
  }
}