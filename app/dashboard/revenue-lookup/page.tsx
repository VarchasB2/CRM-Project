import db from "@/app/modules/db";
import { columns } from "@/components/tables/revenue-lookup/columns";
import { RevenueDataTable } from "@/components/tables/revenue-lookup/revenue-data-table";
import React from "react";

const RevenueLookup = async () => {
  const data = await db.opportunity.findMany({
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
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">
      <RevenueDataTable
        columns={columns}
        data={data}
        firstDate={data.length === 0 ? today : data[0].account.date}
        lastDate={
          data.length === 0 ? today : data[data.length - 1].account.date
        }
      />
    </div>
  );
};

export default RevenueLookup;
