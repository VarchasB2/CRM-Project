"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "../ui/avatar";
const AccountDropDown = () => {
  const { data: session } = useSession();

  return (
    
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex flex-row gap-5 hover:bg-muted/50 rounded-lg p-2">
        <div className="flex items-center text-sm">{session?.user.username} {`(${session?.user.role})`}</div>
          
            {/* <Image
              src={session ? session?.user.userimage : "/img/placeholder.jpg"}
              width={36}
              height={36}
              
              alt="Avatar"
              className="overflow-hidden rounded-full"
            /> */}
            <Avatar>
              <AvatarImage src={session ? session?.user.userimage : "/img/placeholder.jpg"}></AvatarImage>
            </Avatar>
          
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{session?.user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Support
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
