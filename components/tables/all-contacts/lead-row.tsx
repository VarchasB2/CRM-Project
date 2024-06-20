import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AllContacts,  } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import React from "react";
import { Contact } from "./columns";
import { Leads } from "../Leads/columns";

const LeadRow = ({
  leads,
  field,

}: {
  leads: Leads[];
  field: any;

}) => {
  if (field === "date") {
//     const date = new Date(row!.getValue("lead_date"));
//     const formatted = date.toLocaleDateString("en-In");
    // return <div>formatted</div>;
    return (
        <div>
          {leads.map((lead: any) => {
            const date = lead.date.toLocaleDateString("en-In")
            return (
              <div key={lead.id} className="p-1">
                {date}
              </div>
            );
          })}
        </div>
      );
  }
  // console.log(leads)
  else if(field === 'lead_owner.name')
    {
      return  (
        <div>
          {leads.map((row: any) => {
            // console.log("ROW",row)
            // console.log(row['lead_owner'])
            return (
              <div key={row.id} className="p-1">
                {row['lead_owner'].name}
              </div>
            );
          })}
        </div>
      );
    }
  return (
    <div>
      {leads.map((row: any) => {
        // console.log("ROW",row)
        // console.log(row['lead_owner'])
        return (
          <div key={row.id} className="p-1">
            {row[field]}
          </div>
        );
      })}
    </div>
  );
};

export default LeadRow;
