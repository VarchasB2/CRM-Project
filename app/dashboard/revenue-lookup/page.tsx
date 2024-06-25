import db from "@/app/modules/db";
import { columns } from "@/components/tables/revenue-lookup/columns";
import { RevenueDataTable } from "@/components/tables/revenue-lookup/revenue-data-table";
import { cookies } from "next/headers";
import React from "react";

const RevenueLookup = async () => {
  const data = await db.opportunity.findMany({
    where:{
      deletedAt:null
    },
    include: {
      account: {
        include: {
          lead: {
            select: {
              lead_owner: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      account: {
        date: "asc",
      },
    },
  });
  // console.log(data[0].account.lead);
  const today: Date = new Date();
  const colOrderCookie = cookies().get("revenue_col_order");
  const colVisCookie = cookies().get("revenue_col_vis");
  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">
      <RevenueDataTable
        columns={columns}
        data={data}
        firstDate={data.length === 0 ? today : data[0].account.date}
        lastDate={
          data.length === 0 ? today : data[data.length - 1].account.date
        }
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

export default RevenueLookup;
