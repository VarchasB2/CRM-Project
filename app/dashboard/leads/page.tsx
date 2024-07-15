import db from "@/app/modules/db";
import { columns } from "@/components/tables/Leads/columns";
import { LeadsTable } from "@/components/tables/Leads/leads-table";
import { cookies } from "next/headers";

import React from "react";
const LeadsPage = async () => {
  const data = await db.leads.findMany({
    relationLoadStrategy: "join",
    where:{
      deletedAt:null
    },
    include: {
      lead_owner: true,
      contacts: true,
      account:{
        select:{
          opportunities:{
            select:{
              id:true
            }
          }
        }
      }
    },
    orderBy: {
      date: "asc",
    },
  });
  const today: Date = new Date();
  const colOrderCookie = cookies().get("lead_col_order");
  const colVisCookie = cookies().get("lead_col_vis");
  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8">
      <LeadsTable
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

export default LeadsPage;
