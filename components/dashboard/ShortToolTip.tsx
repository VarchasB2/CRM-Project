"use client"
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";


const ShortToolTip = ({href,children}: {href:string,children:React.ReactNode}) => {
  const pathname = usePathname();
  const paths = href.split('/')
  const IconToBe = paths[paths.length - 1] as keyof typeof Icons
  const Icon = Icons[IconToBe]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
              href={href}
              className={cn("flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8", pathname === href?"text-accent-foreground bg-accent":"text-muted-foreground")}
            >


        <Icon className="h-5 w-5" />

        <span className="sr-only">{children}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{children}</TooltipContent>
    </Tooltip>
  );
};

export default ShortToolTip;
