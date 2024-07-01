"use client";
import { ColumnDef } from "@tanstack/react-table";
import AccountRow from "./account-row";

export type customer = {
  id: number;

  first_name: string;
  last_name: string;
  designation: string;
  email: string;
  phone_number: string;
  account: {
    lead:{
      lead_owner:{
        name:string
      }
    }
    date: Date;
    company_name:string
  }[];
};

export const columns: ColumnDef<customer>[] = [
  {
    id: "SI",
    header: "SI",
    cell: ({ row }) => {
      // console.log('Row',row.index,row)
      return row.index + 1;
    },
  },
  {
    id: "lead_owner",
    header: "Lead Owner",
    accessorFn:(row)=>{
      const lead_owners = row.account.map(account=>{
        return account.lead.lead_owner.name
      }).join(', ')
      return lead_owners
    },
    cell:({row})=>{
      // return(<LeadRow leads={row.original.lead} field={'lead_owner.name'}/>)
      return <AccountRow accounts={row.original.account} field={'lead_owner.name'}/>
    },
    filterFn: (row, id, value) => {
      const leadOwners = row.original.account.map(account => account.lead.lead_owner.name);
    return leadOwners.some(owner => value.includes(owner));
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
     return <AccountRow accounts={row.original.account} field={'date'}/>
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
      row.original.account.map(account=>{
        account.date.setHours(0,0,0,0)
        if(value.from<=account.date && value.to>=account.date)
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
    id: "company_name",
    header: "Company",
    accessorFn:(row)=>{
      const companies = row.account.map(account=>{
        return account.company_name
      }).join(', ')
      return companies
    },
    cell: ({ row }) => {
      return <AccountRow accounts={row.original.account} field={'company_name'}/>
     },
    filterFn: (row, id, value) => {
      const companies= row.original.account.map(account => account.company_name);
    return companies.some(company => value.includes(company));
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
