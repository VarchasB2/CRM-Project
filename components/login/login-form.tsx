"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast, useToast } from "../ui/use-toast";
import { PasswordInput } from "../ui/password-input";
import React from "react";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const [isLoading, setLoading] = React.useState(false)
  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true)
    const signInData = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false)
    if (signInData?.error) {
      console.log(typeof signInData.error);
      signInData.error === "blocked"?
        toast({
          title: "User is blocked",
          variant: "destructive",
        })
        :
      toast({
        title: "Email or password is incorrect",
        variant: "destructive",
      });
    } else {
      router.push("/dashboard");
    }
  };

  
  return (
    <div className="w-full lg:grid  lg:grid-cols-2  h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="johndoe@gmail.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            type="password"
                            placeholder="******"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading?<Loader2/>:'Login'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="/img/placeholder.jpg"
          alt="Image"
          fill
          priority
          sizes=""
          className="h-max w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginForm;
