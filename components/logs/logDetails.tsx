"use client";
import React from "react";
import { date } from "zod";

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
interface FunnelData {
	Description: string;
	date: Date;
}

import { DatePickerWithRange } from "@/components/logs/DatePickerWithRange";

export default function LogDetails() {
	const [data, setData] = React.useState<FunnelData[]>([]);
	const [core, setCore] = React.useState<FunnelData[]>([]);
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});

	React.useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:3000/api/log", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: "hithesh",
					}),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				setData(data.data);
				setCore(data.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData(); // Call the function on component mount
	}, []);

	React.useEffect(() => {
		const start = new Date(date.from);
		const end = new Date(date.to);
		const filteredData = core?.filter((lead: FunnelData) => {
			const leadDate = new Date(lead.date);
			return leadDate >= start && leadDate <= end;
		});
		setData(filteredData);
	}, [date]);

	return (
		<div className=" w-full ">
			<div className={cn("grid gap-2 m-5")}>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							id="date"
							variant={"outline"}
							className={cn(
								"w-[300px] justify-start text-left font-normal",
								!date && "text-muted-foreground",
							)}>
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
			{data?.map((lead: FunnelData) => {
				return (
					<div className=" rounded-lg  border p-3  m-4 ">
						<h1 className=" font-mono  text-wrap "> {lead.Description}</h1>
					</div>
				);
			})}
		</div>
	);
}
