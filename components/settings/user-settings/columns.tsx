"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Account, User } from "@prisma/client";
import {
  closureDueDates,
  funnelProgress,
} from "@/lib/funnel-lookup/funnel-lookup-constants";
import { addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { useCurrency } from "@/Providers/currency-provider";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { format } from "url";


export type user = {
  id: number;
  name: string
  email: string
  image: string
  role: string
  status: string
};

export const columns: ColumnDef<user>[] = [
  {
    id: "SI",
    header: "SI",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    id: "image",
    header: "Image",
    cell:({row})=>{
      return <Image src={row.original.image} alt="image" width={100} height={100}/> 
    }
  },
  {
    id: "name",
    accessorKey:'name',
    header: "Name",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "email",
    accessorKey:'email',
    header: "Email",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "role",
    accessorKey:'role',
    header: "Role",
    cell:({row})=>(row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "status",
    header: "Status",
    accessorFn:(row)=>(row.status),
    cell: ({row})=>{
        return <Badge variant={row.original.status === 'active'?'default':'destructive'}>{row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: function CellComponent({ row }) {
      const editUrl = format({
        pathname: "/dashboard/settings/edit-user",
        query: { id: JSON.stringify(row.original.id) },
      });
      const router = useRouter();
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
            <Separator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(editUrl)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async ()=>{
                await fetch('/api/block-user',{
                  method:'PUT',
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body:JSON.stringify(row.original)
                })
                window.location.reload()
              }}
            >
              {row.original.status==='active'?'Block':'Unblock'}
            </DropdownMenuItem>  
            <DropdownMenuItem className="cursor-pointer"
            onClick={async ()=>{
              await fetch('/api/users',{
                method:'DELETE',
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body:JSON.stringify(row.original.id)
              })
              window.location.reload()
            }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
