"use client";
import { Button } from "@/components/ui/button";
import LogDetails from "@/components/logs/logDetails";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "@/components/ui/DateRangepicker";

import React from "react";

export default function Page() {
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: new Date(2022, 0, 20),
		to: addDays(new Date(2022, 0, 20), 20),
	});

	return (
		<Tabs defaultValue="Create" className=" ">
			<TabsList className=" m-10 ">
				<TabsTrigger defaultChecked={true} value="Create">
					Created
				</TabsTrigger>
				<TabsTrigger value="Delete">Deleted</TabsTrigger>
				<TabsTrigger value="Update">Updated</TabsTrigger>
				<TabsTrigger value="All">All</TabsTrigger>

				<div className={cn("grid gap-2 m-5")}>
					<DateRangePicker
						onUpdate={(a) => {
							setDate(a.range);
							console.log(a, "Date ange picker");
						}}
						initialDateFrom={date.from}
						initialDateTo={date.to}
						align="start"
						locale="en-In"
						showCompare={false}
					/>
				</div>
			</TabsList>
			<TabsContent value="Create" className=" mx-10  border">
				<Card>
					<LogDetails date={date} />
				</Card>
			</TabsContent>
			<TabsContent value="Delete"></TabsContent>
			<TabsContent value="all">
				<Card>
					<LogDetails date={date} />
				</Card>
			</TabsContent>
		</Tabs>
	);
}
