import {
  Package2
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../modeToggle/page";
import {
  TooltipProvider,
} from "../ui/tooltip";
import ShortToolTip from "./ShortToolTip";



const DashboardNav = () => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <TooltipProvider delayDuration={0}>
            <ShortToolTip href={"/dashboard"}>Dashboard</ShortToolTip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <ShortToolTip href={"/dashboard/leads"}>Leads</ShortToolTip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <ShortToolTip href={"/dashboard/contact-lookup"}>Contact Lookup</ShortToolTip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <ShortToolTip href={"/dashboard/funnel"}>Funnel Lookup</ShortToolTip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <ShortToolTip href={"/dashboard/opportunity-lookup"}>Opportunity Lookup</ShortToolTip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <ShortToolTip href={"/dashboard/revenue-lookup"}>Revenue Lookup</ShortToolTip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <ShortToolTip href={"/dashboard/customer-lookup"}>Customer Lookup</ShortToolTip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <ModeToggle/>
          <TooltipProvider delayDuration={0}>
            <ShortToolTip href={"/settings"}>Settings</ShortToolTip>
          </TooltipProvider>
        </nav>
      </aside>
    </>
  );
};

export default DashboardNav;
