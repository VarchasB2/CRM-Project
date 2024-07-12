"use client";
import FormComboBox from "@/components/tables/Leads/forms/form-combo-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  first_name: z.string().min(1, {
    message: "Required",
  }),
  last_name: z.string().min(1, {
    message: "Required",
  }),
  email: z
    .string()
    .min(1, {
      message: "Required",
    })
    .email("Enter a vaild email"),
  role: z.string().min(1, { message: "Required" }),
  password: z.string().min(8, { message: "Minumum 8 characters" }),
  confirm_password: z
    .string()
    .min(8, { message: "Minumum 8 characters" })
    .refine(
      (data: any) => {
        console.log(data);
        return data.password === data.confirm_password;
      },
      {
        message: "Passwords do not match",
        path: ["confirm_password"],
      }
    ),
  image: z.any()
});

const UserForm = ({ obj }: { obj?: any }) => {
  const [preview, setPreview] = React.useState(obj===undefined?"/img/Profile_avatar_placeholder_large.png ":obj.image);
  console.log(obj)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: obj === undefined ? "" : obj.name.split(" ")[0],
      last_name: obj === undefined ? "" : obj.name.split(" ")[1],
      email: obj === undefined ? "" : obj.email,
      role: obj === undefined ? "" : obj.role,
      password: obj === undefined ? "" : obj.pwd,
      confirm_password: obj === undefined ? "" : obj.pwd,
      image: obj === undefined ? "/img/Profile_avatar_placeholder_large.png" : obj.image,
    },
  });
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // Set image preview
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit= async (values: z.infer<typeof formSchema>) =>{
    console.log('values',values)
    console.log(typeof values.image==='string')
    try {
      const response = await fetch('/api/users', {
        method: obj===undefined?'POST':'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: typeof values.image==='string'?JSON.stringify(values):JSON.stringify({...values,image:values.image['0'].name}),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      // Assuming successful submission clears form or performs redirect
      // Clear form or handle success scenario as needed
    } catch (error:any) {
      // Display error as toast message
      // Example: Replace with your toast implementation
      toast({
        title:'User with email already exists',
        variant:'destructive'
      })
    }
  }
  const width = "w-full";
  // console.log(form.getValues('image'))
  return (
    <Card className="p-4 w-3/5 2xl:w-1/3">
      <CardHeader className="flex flex-col">
        <CardTitle>
          {obj === undefined ? "Add new user" : "Edit user"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
            <div className="flex flex-row  gap-10 justify-between">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        {...field}
                        // className={width}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        {...field}
                        // className={width}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-10">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} 
                      // className={width} 
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormComboBox
                    field={field}
                    list={[
                      { label: "User", value: "user" },
                      { label: "Admin", value: "admin" },
                    ]}
                    form={form}
                    form_value="role"
                    form_label="Role"
                    text="Select Role"
                    placeholder="Search role..."
                    command_empty="No role found."
                    className=""
                    formItemClassName='w-1/2'
                  />
                )}
              />
            </div>
            <div className="flex flex-row gap-10">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Password"
                        {...field}
                        // className={width}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Comfirm Password"
                        {...field}
                        // className={width}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-row gap-10'>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...form.register("image")}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <div className="w-1/2">
              <Avatar className="w-24 h-24">
                <AvatarImage src={preview || form.getValues('image')} />
              </Avatar>
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <Button type="submit" className="px-6">
                {obj ? "Save Changes" : "Add User"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
