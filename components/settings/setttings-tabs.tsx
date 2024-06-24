'use client'
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

export const formSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
  email: z
    .string()
    .min(1, {
      message: "Required",
    })
    .email("Enter a vaild email"),
  image: z.string().min(1, {
    message: "Required",
  }),
})
const SettingsTabs = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
        name: "",
        email: "",
        image: ""
    }
  });
  return (
    <Tabs defaultValue="account" className="w-full 2xl:w-1/2">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="p-4 w-full">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription className="pb-4">
              Manage your account settings
            </CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            <Form {...form}>
                <form className="space-y-8 flex-1" onSubmit={()=>{console.log(form)}}>
                    <div className='flex flex-row gap-10 flex-wrap'>
                        <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} className="min-w-80"/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="email" render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} className="min-w-80"/>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
