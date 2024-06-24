import db from "@/app/modules/db";
import { columns } from "@/components/tables/funnel-lookup/columns";
import { FunnelLookupTable } from "@/components/tables/funnel-lookup/funnel-lookup-table";
import { cookies } from "next/headers";

import React from "react";

const FunnelLookup = async () => {
  const data = await db.leads.findMany({
    include: {

          lead_owner: {
            select:{
              name:true
            }
          },
 
    },
    orderBy:{
      date:'asc'
    }
  });
  const today: Date = new Date();
  const colOrderCookie = cookies().get("funnel_col_order");
  const colVisCookie = cookies().get("funnel_col_vis");
  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">
      {/* <DataTable columns={columns} data={data} colOrder={['SI','lead_owner','date','type_of_company','funnel_stage','company_name','progress','closure_due_date','days_overdue']}/> */}
      <FunnelLookupTable
        columns={columns}
        data={data}
        firstDate={data.length === 0 ? today : data[0].date}
        lastDate={data.length === 0 ? today : data[data.length - 1].date}
        colOrder={
          colOrderCookie === undefined
            ? undefined
            : JSON.parse(colOrderCookie!.value)
        }
        colVis={
          colOrderCookie === undefined
            ? undefined
            : JSON.parse(colVisCookie!.value)
        }
      />
    </div>
  );
};

export default FunnelLookup;
