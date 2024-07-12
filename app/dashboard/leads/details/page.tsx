import db from "@/app/modules/db";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CurrrencyDisplay from "./currency-display";

const Details = async ({ searchParams }: { searchParams: any }) => {
  const lead = await db.leads.findUnique({
    where: {
      id: Number(searchParams.id),
      deletedAt: null,
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
              notes: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className=" flex items-center gap-4 p-4 sm:py-20 md:gap-8  justify-center h-full flex-col">
      <Card className="w-full h-full testxl:w-2/3 2xl:w-1/2">
        <CardHeader className="gap-2">
          <CardTitle className="flex flex-row">Lead details</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="pb-6 flex flex-row gap-20">
            <div className="flex flex-col leading-loose">
              <p>ID: {lead?.id}</p>
              <p>Lead Owner: {lead?.lead_owner.name}</p>
              <p>Date: {lead?.date.toLocaleString("en-In")}</p>
            </div>
            <div className="flex flex-col leading-loose">
              <p>Type of Company: {lead?.type_of_company}</p>
              <p>Company Name: {lead?.company_name}</p>
              <p>Funnel Stage: {lead?.funnel_stage}</p>
            </div>
            <div className="flex flex-col leading-loose">
              <p>Region: {lead?.region}</p>
              <p>Country: {lead?.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full testxl:w-2/3 2xl:w-1/2">
        <CardHeader className="gap-2">
          <CardTitle className="flex flex-row">Contact details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-20 flex-wrap">
            {lead?.contacts.map((contact) => (
              <div key={contact.id} className="pb-6 flex flex-row gap-20">
                <div className="flex flex-col leading-loose">
                  <p>
                    Name: {contact.first_name} {contact.last_name}
                  </p>
                  <p>Designation: {contact.designation}</p>
                  <p>Email: {contact.email}</p>
                  <p>Phone number: {contact.phone_number}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full testxl:w-2/3 2xl:w-1/2">
        <CardHeader className="gap-2">
          <CardTitle className="flex flex-row">Opportnuity details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-20 flex-wrap">
            {lead?.account?.opportunities.map((opportunity) => (
              <div key={opportunity.id} className="pb-6 flex flex-row gap-20">
                <div className="flex flex-col leading-loose">
                  <p>
                    Point of contact{`(s)`}:{" "}
                    {opportunity.contact.map((c) => c.email).join(", ")}
                  </p>
                  <CurrrencyDisplay revenue={Number(opportunity.revenue)} />
                  <p className='text-xl pb-2 pt-4'>Notes</p>
                  <div className='flex flex-col gap-5'>
                  {opportunity.notes.map((note) => (
                    <div key={note.id} className="flex flex-col leading-loose">
                      <p>Note description: {note.description}</p>
                      <p>Note due date: {note.date.toLocaleDateString('en-In')}</p>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Details;
