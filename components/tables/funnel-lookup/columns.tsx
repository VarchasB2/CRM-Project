"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@prisma/client";
import {
  closureDueDates,
  funnelProgress,
} from "@/lib/funnel-lookup/funnel-lookup-constants";
import { addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type funnelStages = {
  id: number;
  date: Date;
  type_of_company: string;
  funnel_stage: string;
  company_name: string;
  lead_owner: {
    name:string
  };
};

export const columns: ColumnDef<funnelStages>[] = [
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
    accessorFn: (row) => {
      return row.lead_owner.name;
    },
    filterFn: (row, id, value) => {
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
      return formatted;
    },
    filterFn: (row, id, value) => {
      if (value.from === undefined && value.to !== undefined)
        value.from = value.to;
      else if (value.from !== undefined && value.to === undefined)
        value.to = value.from;
      const rowVal: Date = row.getValue(id);
      const filterVal =
        value.from.setHours(0, 0, 0, 0) <= rowVal.setHours(0, 0, 0, 0) &&
        value.to.setHours(0, 0, 0, 0) >= rowVal.setHours(0, 0, 0, 0);
      return filterVal;
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
  },
  {
    id: "progress",
    accessorKey: "funnel_stage",
    header: "Progress",
    cell: ({ row }) => {
      const name = row.getValue("funnel_stage") as keyof typeof funnelProgress;
      const progress = funnelProgress[name];

      return (
        <div className='testxl:pr-10'>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Progress value={progress} className="min-w-28"/>
            </TooltipTrigger>
            <TooltipContent>{progress}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "closure_due_date",
    accessorKey: "type_of_company",
    header: "Closure Due Date",
    cell: ({ row }) => {
      const name = row.getValue(
        "type_of_company"
      ) as keyof typeof closureDueDates;
      const closureDueDate = closureDueDates[name];
      const date = new Date(row.getValue("date"));
      const formatted = addDays(date, closureDueDate).toLocaleDateString(
        "en-In"
      );
      // console.log(typeof date)

      return formatted;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "days_overdue",
    accessorKey: "type_of_company",
    header: "Days overdue",
    cell: ({ row }) => {
      const name = row.getValue(
        "type_of_company"
      ) as keyof typeof closureDueDates;
      const funnel_stage = row.getValue("funnel_stage");
      if (funnel_stage === "Won" || funnel_stage === "Lost") return 0;
      const closureDueDate = closureDueDates[name];
      const date = new Date(row.getValue("date"));
      const currentDate = new Date();
      date.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      const dueDate = Math.ceil(
        (currentDate.getTime() - addDays(date, closureDueDate).getTime()) /
          (1000 * 3600 * 24)
      );
      // console.log((currentDate.getTime()-addDays(date , closureDueDate).getTime() )/(1000*3600*24))

      if (dueDate < 0)
        return <div className="text-green-500">{Math.abs(dueDate)}</div>;
      else if (dueDate > 0)
        return <div className="text-destructive">{dueDate}</div>;
      return dueDate;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
