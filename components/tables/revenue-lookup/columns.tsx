"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Account, User } from "@prisma/client";
import {
  closureDueDates,
  funnelProgress,
} from "@/lib/funnel-lookup/funnel-lookup-constants";
import { addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";

export type revenue = {
  id: number;
  account: {
    lead: {
      lead_owner: {
        name: string;
      };
    };
    type_of_company: string;
    date: Date;
    company_name: string;
  };
  revenue: BigInt;
};

export const columns: ColumnDef<revenue>[] = [
  {
    id: "SI",
    header: "SI",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    id: "lead_owner",
    header: "Lead Owner",
    accessorFn:(row)=>{
      return row.account.lead.lead_owner.name
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.account.date
      const formatted = date.toLocaleDateString("en-In");
      return formatted
    },
    filterFn: (row, id, value) => {
      if(value.from === undefined && value.to!== undefined)
        value.from = value.to
      else
      if(value.from !== undefined && value.to=== undefined)
        value.to = value.from
      const rowVal:Date =  row.original.account.date
      value.to.setHours(0,0,0,0)
      value.from.setHours(0,0,0,0)
      rowVal.setHours(0,0,0,0)
      const filterVal =value.from<=rowVal&& value.to>=rowVal
      return (filterVal)
    },
  },
  {
    id: "type_of_company",
    accessorFn:(row)=>{
      return row.account.type_of_company
    },
    header: "Type of Company",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    
  },

  {
    id: "company_name",
    accessorFn:(row)=>{
      return row.account.company_name
    },
    header: "Company",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    accessorFn: (row) => {
      return row.revenue.toString();
    },
    filterFn: (row, id, value) => {
      console.log("value", value);
      console.log("row", row.getValue(id));
      console.log(value.includes(row.getValue(id)));

      return value.includes(row.getValue(id));
    },
  },
];
