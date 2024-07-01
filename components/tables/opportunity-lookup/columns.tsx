"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Account, Contact, User } from "@prisma/client";
import { closureDueDates, funnelProgress } from "@/lib/funnel-lookup/funnel-lookup-constants";
import { addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import ContactRow from "../all-contacts/contact-row";
import NotesRow from "./notes-row";


export type opportunity = {
  id: number;
  // lead_owner:string
  // date: Date;
  // type_of_company: string;
  // company_name: string;
  notes:{
    description: string,
    date: Date
  }[]
  account:{
    date:Date,
    type_of_company:string,
    funnel_stage:string,
    company_name:string,
    region:string,
    country:string,
    lead:{
      lead_owner:{
        name:string
      }
    }
  }
  // account:Account
  contact:Contact[]
};


export const columns: ColumnDef<opportunity>[] = [
  {
    id: "SI",
    header: "SI",
    cell: ({ row }) => {
      console.log(row.original)
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
    id: "description",
    header: "Description",
    cell:({ row }) => {
      return(<NotesRow notes={row.original.notes} field={'description'}/>)
      
    },
    filterFn: (row, id, value) => {
      console.log(value.includes(row.getValue(id)))

      return value.includes(row.getValue(id));
    },
  },
  {
    id: "dueDate",
    header: "Due date",
    cell:({ row }) => {
      return(<NotesRow notes={row.original.notes} field={'date'}/>)
      
    },
    filterFn: (row, id, value) => {
      console.log(value.includes(row.getValue(id)))

      return value.includes(row.getValue(id));
    },
  },
  {
    id: "contact_name",
    header: "Contact",
    accessorFn:(row)=>{
      const names = row.contact.map(contact=>{
        return `${contact.first_name} ${contact.last_name}`
      }).join(', ')
      console.log('names',names)
      return names
    },
    cell: ({ row }) => {
      return (
        <ContactRow contacts={row.original.contact} field={"full_name"} />
      );
    },
  },
  {
    id:'contact_email',
    header:'Email',
    accessorFn:(row)=>{
      const emails = row.contact.map(contact=>contact.email).join(', ')
      return emails
    },
    cell: ({ row }) => {
      return (
        <ContactRow contacts={row.original.contact} field={"email"} />
      );
    }
  },
  {
    id:'contact_phone_number',
    header:'Phone number',
    accessorFn:(row)=>{
      const phone_numbers = row.contact.map(contact=>contact.phone_number).join(', ')
      return phone_numbers
    },
    cell: ({ row }) => {
      return (
        <ContactRow contacts={row.original.contact} field={"phone_number"} />
      );
    }
  }
];
