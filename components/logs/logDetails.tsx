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

export default function LogDetails({ date }: { date: any }) {
	const [data, setData] = React.useState<FunnelData[]>([]);
	const [core, setCore] = React.useState<FunnelData[]>([]);

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
			{data.length > 0 ? (
				data?.map((lead: FunnelData) => {
					return (
						<div className=" rounded-lg   p-3  m-4 ">
							<h1 className=" font-mono  text-wrap "> {lead.Description}</h1>
						</div>
					);
				})
			) : (
				<div className="  h-[75vh] flex justify-center items-center">
					Loading..
				</div>
			)}
		</div>
	);
}
