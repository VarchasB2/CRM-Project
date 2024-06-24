import db from "@/app/modules/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Contact, Leads, Prisma } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import React from "react";

const History = async ({ searchParams }: { searchParams: any }) => {
  const history = await db.history.findMany({
    where: {
      lead_id: Number(searchParams.id),
    },
    include: {
      lead: {
        include: {
          lead_owner: true,
        },
      },
    },
  });
  console.log("history", history);
//   const lead:Leads = JSON.parse(JSON.stringify(history[0].lead_data))
//   console.log('LEAD',lead)
const created_lead =history[0].lead_data as Prisma.JsonObject
let converted = false
  return (
    <div className=" flex items-center gap-4 p-4 sm:py-20 md:gap-8  justify-center ">
      <Card className="p-10 w-2/3 2xl:w-2/4">
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col text-sm whitespace-pre leading-loose flex-wrap">
          {/* <div>{history.map((h)=><div className='whitespace-pre' key={h.id}><p>{h.description}</p></div>)}</div> */}
          {/* <Separator/>
          <div className="text-sm whitespace-pre-line leading-loose">
            Created by {history[0].lead.lead_owner.name} on {history[0].date.toLocaleString('en-In')}{'\n'}
            Company Name: {created_lead.company_name as string}{'\n'} 
            Type of Company : {created_lead.type_of_company as string}{'\n'}
            Funnel Stage: {created_lead.funnel_stage as string}{'\n'}
            Region: {created_lead.region as string}{'\n'}
            Country: {created_lead.country as string}{'\n'}
            Contacts: {(created_lead.contacts as []).map((c:any)=>{
                return<div key={c.id}>Name: {c.first_name} {c.last_name}</div>
            })}
          </div> */}
          {new Date(created_lead.date as string).toLocaleString('en-In')}: Lead created by {history[0].lead.lead_owner.name} with funnel stage: {created_lead.funnel_stage as string}{'\n'}
          {history[0].account_data?`${new Date((history[0].account_data as Prisma.JsonObject).date as string).toLocaleString('en-In')}: Converted to opportunity`: null}{'\n'}
          {history.filter(h=>h.crud==='update').map(h=>{
            if(h.account_data && converted === false && history[0].account_data === null)
            {   
                converted= true
                return `${new Date((h.account_data as Prisma.JsonObject).date as string).toLocaleString('en-In')}: Converted to Opportunity\n`
                
            }
            else if(!h.account_data){
                return `${h.date.toLocaleString('en-In')}: Lead updated\n`
            }
            else{
                return `${h.date.toLocaleString('en-In')}: Account updated\n`
            }
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
