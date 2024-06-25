import db from "@/app/modules/db";
import { columns } from "@/components/tables/Leads/columns";
import { LeadsTable } from "@/components/tables/Leads/leads-table";
import { authOptions } from "@/lib/auth";
import { intlFormat } from "date-fns";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { cookies } from "next/headers";

import React from "react";
// interface currencyFormatProps {
//   value: number;
//   currency: string;
//   decimal?: number;
// }
// export async function getLeads() {
//   const data = await db.leads.findMany({
//     relationLoadStrategy: "join",
//     include: {
//       lead_owner: true,
//       contacts: true,
//       account:{
//         select:{
//           opportunities:true
//         }
//       }
//     },
//     orderBy: {
//       id: "asc",
//     },
//   });
//   return data;
// }
// const currencyConversion = await fetch(
//   "https://www.revolut.com/api/quote/public/USDINR"
// ).then((res) => res.json());
// // console.log(currency
// function currencyFormat({ value, currency, decimal = 1 }: currencyFormatProps) {
//   return new Intl.NumberFormat("en-In", {
//     style: "currency",
//     currency,
//     maximumFractionDigits: decimal,
//     minimumFractionDigits: decimal,
//   }).format(value);
// }
// console.log(
//   currencyFormat({ value: currencyConversion.rate * 1000, currency: "INR" })
// );

const LeadsPage = async () => {
  // const data = await getLeads();
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
          opportunities:true
        }
      }
    },
    orderBy: {
      id: "asc",
    },
  });
  const today: Date = new Date();
  // console.log('LEAD',data[data.length-1].account)
  // console.log(session)
  // console.log(data)
  // console.log(data[0].date,data[data.length-1].date)
  // console.log(data)
  const colOrderCookie = cookies().get("lead_col_order");
  // console.log(JSON.parse(colOrderCookie!.value))
  const colVisCookie = cookies().get("lead_col_vis");
  // console.log(cookies().getAll())
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
