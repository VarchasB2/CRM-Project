"use client";
import { ColumnDef } from "@tanstack/react-table";

export type history = {
  id: number;
  date: Date
  crud: string
  changes: string
  user: string
};

export const columns: ColumnDef<history>[] = [
  {
    id: "SI",
    header: "SI",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleDateString("en-In");
      return formatted;
    },
    filterFn: (row, id, value) => {
      if (value.from === undefined && value.to !== undefined)
        value.from = value.to;
      else if (value.from !== undefined && value.to === undefined)
        value.to = value.from;
      const rowVal: Date = row.getValue(id);
      value.from.setHours(0, 0, 0, 0);
      rowVal.setHours(0, 0, 0, 0);
      value.to.setHours(0, 0, 0, 0);
      const filterVal = value.from <= rowVal && value.to >= rowVal;
      return filterVal;
    },
  },
  {
    id: "user",
    accessorKey:'user',
    header: "Changed by",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "crud",
    accessorKey:'crud',
    header: "CRUD action",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "changes",
    accessorKey:'changes',
    header: "Changes",
    cell: ({row})=>{
        return <div className="whitespace-pre leading-loose">{row.original.changes}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  
];
