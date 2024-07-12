import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import CurrencySettings from "./currency-settings";
import AccountSettings from "./account-settings";
import UserSettings from "./user-settings/users-settings";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/app/modules/db";


const SettingsTabs = async ({searchParams}:{searchParams:any}) => {
  const session = await getServerSession(authOptions)
  const activeTab = searchParams.tab || 'currency'
  const user = await db.user.findUnique({where:{email:session?.user.email!}})
  return (
    <Tabs defaultValue={activeTab} className="w-full 2xl:w-1/2">
      <TabsList>
        <TabsTrigger value="currency">Currency</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="users" className={cn(session?.user.role==='admin'?'':'hidden')}>Users</TabsTrigger>
      </TabsList>
      <CurrencySettings/>
      <AccountSettings session={session!} user={user}/>
      <UserSettings/>
    </Tabs>
  );
};

export default SettingsTabs;
