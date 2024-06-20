import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Account } from "@prisma/client";
import React from "react";

const AccountRow = ({
    accounts,
  field,

}: {
  accounts: any[];
  field: any;

}) => {
  if (field === "date") {
//     const date = new Date(row!.getValue("lead_date"));
//     const formatted = date.toLocaleDateString("en-In");
    // return <div>formatted</div>;
    return (
        <div>
          {accounts.map((account: any) => {
            const date = account.date.toLocaleDateString("en-In")
            return (
              <div key={account.id} className="p-1">
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
          {accounts.map((account: any) => {
            // console.log("ROW",row)
            // console.log(row['lead_owner'])
            return (
              <div key={account.id} className="p-1">
                {account['lead'].lead_owner.name}
              </div>
            );
          })}
        </div>
      );
    }
  return (
    <div>
      {accounts.map((account: any) => {
        // console.log("ROW",row)
        // console.log(row['lead_owner'])
        return (
          <div key={account.id} className="p-1">
            {account[field]}
          </div>
        );
      })}
    </div>
  );
};

export default AccountRow;
