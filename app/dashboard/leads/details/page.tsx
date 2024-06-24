import db from "@/app/modules/db";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lightbulb } from "lucide-react";

const Details = async ({ searchParams }: { searchParams: any }) => {
  const lead = await db.leads.findUnique({
    where: {
      id: Number(searchParams.id),
    },
    include: {
      lead_owner: {
        select: {
          name: true,
        },
      },
      contacts: true,
      account: {
        include: {
          opportunities: {
            include: {
              contact: true,
            },
          },
        },
      },
    },
  });
  console.log(lead);
  return (
    <div className=" flex items-center gap-4 p-4 sm:py-20 md:gap-8  justify-center h-full ">
      <Card className="w-full h-full 2xl:w-1/2">
        <CardHeader className="gap-2">
          <CardTitle className="flex flex-row">Details</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="whitespace-pre-line leading-loose">
          <div className="pb-6">
            <p className="text-xl">Lead</p>
            <br />
            ID: {lead?.id}
            <br />
            Lead Owner: {lead?.lead_owner.name}
            <br />
            Date: {lead?.date.toLocaleString("en-In")}
            <br />
            Type of Company: {lead?.type_of_company}
            <br />
            Company Name: {lead?.company_name}
            <br />
            Region: {lead?.region}
            <br />
            Country: {lead?.country}
            <br />
          </div>

          <Separator />
          <div className="py-6">
            <p className="text-xl">Contacts</p>
            <br />
            <div className="flex flex-row flex-wrap justify-between">
              {lead?.contacts.map((contact, index) => {
                // console.log(index)
                // console.log(lead.contacts.length)
                // console.log(index-1===lead.contacts.length)
                return (
                  <div key={contact.id} className="pr-6 flex-wrap">
                    Name: {contact.first_name} {contact.last_name}
                    <br />
                    Designation: {contact.designation}
                    <br />
                    Email: {contact.email}
                    <br />
                    Phone number: {contact.phone_number}
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
          {lead?.account && (
            <>
              <Separator />
              <div className="py-6">
                <p className="text-xl">Opportunities</p>
                <br />
                <div className="flex flex-row flex-wrap justify-between">
                  {lead.account.opportunities.map(opportunity=>{
                    return <div key={opportunity.id} className="pr-6 flex-wrap">
                      Contact email{`(s)`}: {opportunity.contact.map(c=>c.email).join(', ')}<br/>
                      Description: {opportunity.description}<br/>
                      Revenue: {opportunity.revenue.toString()}<br/>
                    </div>
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Details;
