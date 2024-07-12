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
  const today: Date = new Date();
  const colOrderCookie = cookies().get("revenue_col_order");
  const colVisCookie = cookies().get("revenue_col_vis");
  const formattedOpportunities = data.map(opportunity=>({...opportunity, revenue:Number(opportunity.revenue)}))
  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">
      <RevenueDataTable
        columns={columns}
        data={formattedOpportunities}
        firstDate={formattedOpportunities.length === 0 ? today : formattedOpportunities[0].account.date}
        lastDate={
          formattedOpportunities.length === 0 ? today : formattedOpportunities[formattedOpportunities.length - 1].account.date
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
