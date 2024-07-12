import React from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AccountDropDown from "@/components/dashboard/account-dropdown";
import NavSheet from "@/components/dashboard/nav-sheet";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import BreadCrumb from "@/components/dashboard/breadcrumb";
import Notifications from "@/components/dashboard/notifcations";
import CurrencyDropdown from "@/components/dashboard/currency-dropdown";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1  min-h-full flex-col bg-muted/10">
      <DashboardNav />
      <div className="flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14 min-h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 ">
          <NavSheet />
          <BreadCrumb />
          <div className="relative flex flex-row items-center ml-auto md:grow-0 gap-5">
            <CurrencyDropdown/>
            <Notifications/>
            <AccountDropDown />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
