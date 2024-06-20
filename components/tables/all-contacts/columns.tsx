"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Account, User } from "@prisma/client";
import { closureDueDates, funnelProgress } from "@/lib/funnel-lookup/funnel-lookup-constants";
import { addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import LeadRow from "./lead-row";
import { Leads } from "../Leads/columns";


export type Contact = {
  id: number;
  first_name : string;
  last_name: string;
  designation: string;
  email: string;
  phone_number: string;
  lead: Leads[]
};


export const columns: ColumnDef<Contact>[] = [
  {
    id: "SI",
    header: "SI",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    id:"lead_owner",
    accessorFn: (row)=>{
      // console.log("ROW",row.lead)
      // row.lead.map(lead=>{
      //   console.log(lead.lead_owner.name)
      //   return lead.lead_owner.name
      // })
      const lead_owners = row.lead.map(lead=>{
        // console.log(lead.lead_owner.name)
        return lead.lead_owner.name
      }).join(', ')
      // console.log("lead_owners",lead_owners)
      return lead_owners
    },
    header: "Lead Owner",
    cell:({row})=>{
      return(<LeadRow leads={row.original.lead} field={'lead_owner.name'}/>)
    },
    filterFn: (row, id, value) => {
      const leadOwners = row.original.lead.map(lead => lead.lead_owner.name);
    return leadOwners.some(owner => value.includes(owner));
    },
  },
  {
    id: "lead_date",
    header: "Date",
    cell: ({ row }) => {
      return(<LeadRow leads={row.original.lead} field={'date'}/>)
      
    },
    filterFn: (row, id, value) => {

      let filterVal=false
      if(value.from === undefined && value.to!== undefined)
        value.from = value.to
      else
      if(value.from !== undefined && value.to=== undefined)
        value.to = value.from
      value.from.setHours(0,0,0,0)
      value.to.setHours(0,0,0,0)
      row.original.lead.map(lead=>{
        lead.date.setHours(0,0,0,0)
        if(value.from<=lead.date && value.to>=lead.date)
          filterVal = true
      })
      return filterVal
    },
  },
  {
    id: "first_name",
    accessorKey: "first_name",
    header: "First Name",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "last_name",
    accessorKey: "last_name",
    header: "Last Name",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  
  {
    id: "lead_company_name",
    header: "Company",
    cell: ({ row }) => {
      return(<LeadRow leads={row.original.lead} field={'company_name'}/>)
      
    },
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
];
