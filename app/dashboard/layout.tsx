import React from 'react'
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import AccountDropDown from '@/components/dashboard/account-dropdown';
import NavSheet from '@/components/dashboard/nav-sheet';
import DashboardNav from '@/components/dashboard/dashboard-nav';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full flex-col bg-muted/10">
      <DashboardNav />
      <div className="flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 ">
          <NavSheet />
          <Breadcrumb />
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <AccountDropDown/>
        </header>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout