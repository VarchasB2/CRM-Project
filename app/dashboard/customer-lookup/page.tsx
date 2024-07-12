import db from "@/app/modules/db";
import { columns } from "@/components/tables/cusomter-lookup/columns";
import { CustomerLookupTable } from "@/components/tables/cusomter-lookup/customer-lookup-table";
import { cookies } from "next/headers";
import React from "react";

const CustomerLookup = async () => {
  const data = await db.contact.findMany({
    relationLoadStrategy: "join",
    where:{
      deletedAt:null
    },
    include: {
      account: {
        where:{
          deletedAt:null
        },
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
  data.sort((a, b) => {
    const earliestDateA = getEarliestAccountDate(a);
    const earliestDateB = getEarliestAccountDate(b);
    
    if (earliestDateA < earliestDateB) return -1;
    if (earliestDateA > earliestDateB) return 1;
    return 0;
  });
  function getEarliestAccountDate(contact:any) {
    // Extract dates from all accounts and find the earliest one
    const accountDates = contact.account
      .filter((account:any) => !account.deletedAt) // Filter out deleted accounts if needed
      .map((account:any) => account.date);
  
    return new Date(Math.min(...accountDates));
  }
  const today: Date = new Date();
  const colOrderCookie = cookies().get("customer_col_order");
  const colVisCookie = cookies().get("customer_col_vis");
  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8 ">
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

export default CustomerLookup;
