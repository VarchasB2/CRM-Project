"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { AllContacts, User } from "@prisma/client";
import ContactRow from "../all-contacts/contact-row";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "url";

export type Leads = {
  id: number;
  owner_id: number;
  date: Date;
  type_of_company: string;
  funnel_stage: string;
  company_name: string;
  region: string;
  country: string;
  lead_owner: User;
  contacts: AllContacts[];
};
// export type AllContacts ={
//   id: number,
//   first_name: string,
//   last_name: string,
//   designation: string,
//   email: string,
//   phone_numbber: string,
//   lead_id: number
// }

export const columns: ColumnDef<Leads>[] = [
  {
    id: "SI",
    header: "SI",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    id:"lead_owner_name",
    accessorKey: "lead_owner.name",
    header: "Lead Owner",
    filterFn: (row, id, value) => {
      // console.log(value.includes(row.getValue(id)))
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleDateString("en-In");
      return formatted
    },
    filterFn: (row, id, value) => {
      if(value.from === undefined && value.to!== undefined)
        value.from = value.to
      else
      if(value.from !== undefined && value.to=== undefined)
        value.to = value.from
      const rowVal:Date = row.getValue(id)
      value.from.setHours(0,0,0,0)
      rowVal.setHours(0,0,0,0)
      value.to.setHours(0,0,0,0)
      const filterVal =value.from<=rowVal&& value.to>=rowVal
      return (filterVal)
    },
  },
  {
    id: "type_of_company",
    accessorKey: "type_of_company",
    header: "Type of Company",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "funnel_stage",
    accessorKey: "funnel_stage",
    header: "Funnel Stage",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "company_name",
    accessorKey: "company_name",
    header: "Company",
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
  },
  {
    id: "region",
    accessorKey: "region",
    header: "Region",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "country",
    accessorKey: "country",
    header: "Country",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // {
  //   accessorKey: "contacts",
  //   header: "Contacts",
  //   cell: ({ row }) => {
  //     return <ContactCell contacts={row.original.contacts} />;
  //   },
  // },
  {
    id: "first_name",
    header: "First Name",
    cell: ({ row }) => {
      return (
        <ContactRow contacts={row.original.contacts} field={"first_name"} />
      );
    },
  },
  {
    id: "last_name",
    header: "Last Name",
    cell: ({ row, column }) => {
      // console.log(column.id)
      return (
        <ContactRow contacts={row.original.contacts} field={"last_name"} />
      );
    },
  },
  {
    id: "designation",
    header: "Designation",
    cell: ({ row }) => {
      return (
        <ContactRow contacts={row.original.contacts} field={"designation"} />
      );
    },
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => {
      return <ContactRow contacts={row.original.contacts} field={"email"} />;
    },
  },
  {
    id: "phone_number",
    header: "Phone Number",
    cell: ({ row }) => {
      return (
        <ContactRow contacts={row.original.contacts} field={"phone_number"} />
      );
    },
  },
  {
    id: "actions",
    cell: function CellComponent({row}) {
      const router = useRouter()
      // const params = new URLSearchParams()
      // params.set("Row",JSON.stringify(row))
      // console.log('row',row)
      // console.log(typeof row)
      const url = format({
        pathname:'/dashboard/leads/edit-lead',
        query: {id:JSON.stringify(row.original.id)}
      })
      return (
        <DropdownMenu>
          
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Separator/>
            <DropdownMenuItem className="cursor-pointer" onClick={()=>router.push(url)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
