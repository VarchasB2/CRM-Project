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

import React from "react";

export default function Page() {
	return (
		<Tabs defaultValue="account" className=" ">
			<TabsList className=" m-10 ">
				<TabsTrigger value="Create">Create</TabsTrigger>
				<TabsTrigger value="Delete">Delete</TabsTrigger>
				<TabsTrigger value="Update">Update</TabsTrigger>
			</TabsList>
			<TabsContent value="Create" className=" mx-10  border">
				<Card>
					<LogDetails />
				</Card>
			</TabsContent>
			<TabsContent value="Delete"></TabsContent>
		</Tabs>
	);
}
