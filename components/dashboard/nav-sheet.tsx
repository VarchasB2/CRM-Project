'use client'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Filter, Home, Lightbulb, LineChart, Package, Package2, PanelLeft, Settings, ShoppingCart, TowerControl, User, Users, Users2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NavSheet = () => {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const toggleSheet = () => {
    setSheetOpen(!sheetOpen);
  };

  const closeSheet = () => {
    setSheetOpen(false);
  };
  return (
    <Sheet open={sheetOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="sm:hidden" onClick={toggleSheet}>
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent onInteractOutside={closeSheet} side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
               
                <Link
                  href="/dashboard"
                  onClick={closeSheet}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/leads"
                  onClick={closeSheet}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <TowerControl className="h-5 w-5" />
                  Leads
                </Link>
                <Link
                  href="/dashboard/contact-lookup"
                  onClick={closeSheet}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <User className="h-5 w-5" />
                  Contacts
                </Link>
                <Link
                  href="/dashboard/funnel"
                  onClick={closeSheet}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Filter className="h-5 w-5" />
                  Funnel
                </Link>
                <Link
                  href="/dashboard/opportunity-lookup"
                  onClick={closeSheet}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Lightbulb className="h-5 w-5" />
                  Opportunity
                </Link>
                <Link
                  href="/dashboard/revenue-lookup"
                  onClick={closeSheet}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Revenue
                </Link>
                <Link
                  href="/dashboard/customer-lookup"
                  onClick={closeSheet}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="/settings"
                  onClick={closeSheet}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
  )
}

export default NavSheet