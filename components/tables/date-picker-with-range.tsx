"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Column } from "@tanstack/react-table";
import { DateInput } from "./date-input";

interface DatePickerWithRangeProps<TData, TValue> {
  firstDate?: Date;
  lastDate?: Date;
  column?: Column<TData, TValue>;
}
export function DatePickerWithRange<TData, TValue>({
  firstDate,
  lastDate,
  column,
}: DatePickerWithRangeProps<TData, TValue>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: firstDate,
    to: lastDate,
  });
  React.useLayoutEffect(() => {
    // console.log(date)
    column?.setFilterValue(date);
  
    if(date?.from!>date?.to!)
      {
        setDate({...date,from:date!.to})
      }
  }, [column, date]);
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className=" justify-start text-left font-normal border-dashed h-8"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col gap-2 items-center pt-2">
            <div className="flex gap-2">
              <DateInput
                value={date?.from}
                onChange={(e) => {
                  setDate({...date!,from:e})
                  // if(date===undefined || date.from===undefined || date.to===undefined){

                  // }
                  // else
                  // if(date.from>date.to)
                  // {
                  //   setDate({...date,from:date.to})
                  // }
                }}
              />
              <div className="py-1">-</div>
              <DateInput
                value={date?.to}
                onChange={(e) => {
                  setDate({...date!,to:e})
                }}
              />
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
