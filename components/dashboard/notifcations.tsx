"use client";
import db from "@/app/modules/db";
import { Bell } from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { Separator } from "../ui/separator";
import Cookies from "js-cookie";
const Notifications = () => {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [clickedIds, setClickedIds] = React.useState<any[]>([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  // console.log(Cookies.get());

  React.useEffect(() => {
    // console.log("fetched notfications");
    fetchNotifications();
  }, []);
  React.useEffect(() => {
    // Load clickedIds from cookies when component mounts
    const savedClickedIds =
      Cookies.get("clickedIds") === undefined
        ? undefined
        : JSON.parse(Cookies.get("clickedIds")!);
    if (savedClickedIds) {
      setClickedIds(savedClickedIds);
    }
  }, []);
  React.useEffect(() => {
    // Save clickedIds to cookies whenever it changes
    if (clickedIds.length > 0)
      Cookies.set("clickedIds", JSON.stringify(clickedIds));
  }, [clickedIds]);

  // React.useEffect(()=>{
  //   console.log(clickedIds)
  //   // Cookies.set('clickedIds',JSON.stringify(clickedIds))
  // },[clickedIds])
  const fetchNotifications = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    // console.log("Cookies", Cookies.get());
    try {
      const result = await fetch("/api/notes", { method: "GET" });
      // console.log('Result',result)
      const jsonResult = await result.json();
      // console.log('jsonResult',jsonResult)
      setNotifications(jsonResult);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  const markAsRead = (id: number) => {
    // Add the clicked notification id to the clickedIds state
    if (!clickedIds.includes(id))
      setClickedIds((prevClickedIds: any) => [...prevClickedIds, id]);
  };
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <Bell />
            <Badge
              variant="destructive"
              className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 "
            >
              {notifications.length - clickedIds.length}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="flex flex-col cursor-pointer"
        >
          {notifications.map((note: any) => (
            <Link
              href={`/dashboard/leads/details?id=${note.opportunity.account.lead_id}`}
              key={note.id}
            >
              <div
                
                className={`hover:bg-accent p-2 ${
                  clickedIds.includes(note.id) ? "opacity-50" : ""
                }`}
                onClick={() => markAsRead(note.id)}
              >
                {/* <Link
                href={`/dashboard/leads/details?id=${note.opportunity.account.lead_id}`}
              >
                {note.opportunity.account.company_name} : Note due today
              </Link> */}
                {note.opportunity.account.company_name} : Note due today
              </div>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Notifications;
