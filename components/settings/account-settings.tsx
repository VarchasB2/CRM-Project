'use client'
import React from "react";
import { TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { Session } from 'next-auth';
import { User } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useToast } from "../ui/use-toast";
interface AccountSettingsProps {
  session: Session | null;
  user: any;
}
export const formSchema= z.object({password:z.string().min(8, { message: "Minumum 8 characters" })})
const AccountSettings =  ({ session, user }:AccountSettingsProps) => {
  const {toast} = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      password:user.pwd
    }
  })
  const resetPassword = async (values: z.infer<typeof formSchema>) =>{
    const result = await fetch('/api/password',{method:'PUT', headers:{
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body:JSON.stringify({...values,user:user})
  })
  toast({title: 'Password updated successfully'})
  console.log('RESULT',result)
  }

  return (
    <TabsContent value="account">
      <Card className="p-4 w-full">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription className="pb-4">
            Manage your account settings
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(resetPassword)}>
            <div className="flex flex-row gap-5 items-end">
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Password"
                        {...field}
                        className="w-60"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="px-6">
                Reset Password
              </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
export default AccountSettings;
