import db from "@/app/modules/db";
import { columns } from "@/components/tables/all-contacts/columns";
import { ContactLookupTable } from "@/components/tables/all-contacts/contact-lookup-table";
import { cookies } from "next/headers";
import React from "react";

const ContactLookup = async () => {
  const data = await db.allContacts.findMany({
    relationLoadStrategy: "join",
    include: {
      lead: {
        include: {
          lead_owner: true,
        },
        orderBy: {
          date: "asc",
        },
      },
    },
  });
  const today: Date = new Date();

  // console.log(data[0].lead[0].date.toLocaleDateString('en-In'))
  // console.log(data[data.length-1].lead[0].date.toLocaleDateString('en-In'))
  console.log(data[data.length - 1]);
  const colOrderCookie = cookies().get("contact_col_order");
  const colVisCookie = cookies().get("contact_col_vis");
  return (
    <div className="flex-1 items-start gap-4 p-4 sm:px-6  md:gap-8">
      <ContactLookupTable
        data={data}
        columns={columns}
        firstDate={data.length === 0 ? today : data[0].lead[0].date}
        lastDate={
          data.length === 0
            ? today
            : data[data.length - 1].lead[data[data.length - 1].lead.length - 1]
                .date
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

export default ContactLookup;
