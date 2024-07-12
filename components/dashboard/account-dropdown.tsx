"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import React from "react";
import { Skeleton } from "../ui/skeleton";
const AccountDropDown = () => {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  const { data: session,status } = useSession();
  if(status==='loading'){
   return(<div className="flex flex-row gap-5 items-center p-2">
    <Skeleton className="h-4 w-10"/>
    <Skeleton className= 'h-10 w-10 rounded-full'/>
   </div>)     
  }
  return (
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex flex-row gap-5 hover:bg-muted/50 rounded-lg p-2">
        <div className="flex items-center text-sm">{session?.user.username}</div>
            <Avatar>
              <AvatarImage src={session ? session?.user.userimage : "/img/placeholder.jpg"}></AvatarImage>
            </Avatar>
          
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{capitalizeFirstLetter(session!.user.role)}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={'/dashboard/settings?tab=account'}>Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut()}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    
  );
};

export default AccountDropDown;
