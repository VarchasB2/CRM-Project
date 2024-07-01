import db from "@/app/modules/db";
import { columns } from "@/components/tables/opportunity-lookup/columns";
import { OpportunityDataTable } from "@/components/tables/opportunity-lookup/opportunity-data-table";
import { cookies } from "next/headers";
import React from "react";

const OpportunityLookup = async () => {
  const data = await db.opportunity.findMany({
    where:{
      deletedAt:null
    },
    include:{
      notes:true,
      account:{
        include:{
          lead:{
            select:{
              lead_owner:{
                select:{
                  name:true
                }
              }
            }
          }
        },

      },
      contact:{
        where:{
          deletedAt:null
        }
      }
    },
    orderBy:{
      account:{
        date:'asc'
      }
    }
  });
  const today:Date = new Date()
  // console.log(data[0])
  // console.log(data[0].account.lead.lead_owner.name)
  const colOrderCookie = cookies().get("opportunity_col_order");
  const colVisCookie = cookies().get("opportunity_col_vis");
  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">
      <OpportunityDataTable columns={columns} data={data} firstDate={data.length===0?today:data[0].account.date} lastDate={data.length===0?today:data[data.length-1].account.date} colOrder={
          colOrderCookie === undefined
            ? undefined
            : JSON.parse(colOrderCookie!.value)
        }
        colVis={
          colOrderCookie === undefined
            ? undefined
            : JSON.parse(colVisCookie!.value)
        }/>
      
    </div>
  );
};

export default OpportunityLookup;
