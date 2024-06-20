import db from "@/app/modules/db";
import { columns } from "@/components/tables/cusomter-lookup/columns";
import { CustomerLookupTable } from "@/components/tables/cusomter-lookup/customer-lookup-table";
import React from "react";

const CustomerLookup = async () => {
  const data = await db.contact.findMany({
    relationLoadStrategy: "join",
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
        orderBy: {
          date: "asc",
        },
      },
    },
  });
  const today: Date = new Date();
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">
      <CustomerLookupTable
        data={data}
        columns={columns}
        firstDate={data.length === 0 ? today : data[0].account[0].date}
        lastDate={
          data.length === 0
            ? today
            : data[data.length - 1].account[
                data[data.length - 1].account.length - 1
              ].date
        }
      />
    </div>
  );
};

export default CustomerLookup;
