import db from "@/app/modules/db";
import { columns } from "@/components/tables/opportunity-lookup/columns";
import { OpportunityDataTable } from "@/components/tables/opportunity-lookup/opportunity-data-table";

import React from "react";

const OpportunityLookup = async () => {
  const data = await db.opportunity.findMany({
    include:{
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
      contact:true
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
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">
      <OpportunityDataTable columns={columns} data={data} firstDate={data.length===0?today:data[0].account.date} lastDate={data.length===0?today:data[data.length-1].account.date}/>
      
    </div>
  );
};

export default OpportunityLookup;
