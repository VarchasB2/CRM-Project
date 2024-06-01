"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  funnel_stages,
  lead_owners,
  regions,
  type_of_companies,
} from "@/lib/form/form-constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus, SquarePlus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import FormComboBox from "./form-combo-box";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import countryList from "react-select-country-list";
import db from "@/app/modules/db";
import { get } from "http";

export const formSchema = z.object({
  leadOwner: z.string().min(1, {
    message: "Required",
  }),
  type_of_company: z.string().min(1, {
    message: "Required",
  }),
  funnel_stage: z.string().min(1, {
    message: "Required",
  }),
  company_name: z.string().min(1, {
    message: "Required",
  }),
  region: z.string().min(1, {
    message: "Required",
  }),
  country: z.string().min(1, {
    message: "Required",
  }),
  contacts: z.array(
    z.object({
      first_name: z.string().min(1, {
        message: "Required",
      }),
      last_name: z.string().min(1, {
        message: "Required",
      }),
      designation: z.string().min(1, {
        message: "Required",
      }),
      email: z.string().min(1, {
        message: "Required",
      }),
      phone_number: z.string().min(1, {
        message: "Required",
      }),
    })
  ),
});
const emptyContact: any = {
  first_name: "",
  last_name: "",
  designation: "",
  email: "",
  phone_number: "",
};
export default function CreateLeadForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leadOwner: "",
      type_of_company: "",
      funnel_stage: "",
      company_name: "",
      region: "",
      country: "",
      contacts: [
        {
          first_name: "",
          last_name: "",
          designation: "",
          email: "",
          phone_number: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    ...form,
    name: "contacts",
  });
  //   console.log(fields);
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    // const owners = await (await fetch('http://localhost:3000/api/lead-owners')).json()
    // const owners = await fetch(`http://localhost:3000/api/lead-owners?name=${encodeURIComponent(values.leadOwner)}`)
    const leadResponse = await fetch('http://localhost:3000/api/lead-owners',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
  // if(leadResponse?.status){
  //   const contactResponse = await fetch('http://localhost:3000/api/all-contacts',{
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(values)
  //   })
  // }
    // console.log("values",values)
    // console.log("owners",owners)
    const res = await fetch('http://localhost:3000/api/leads',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values.leadOwner) 
    })
    // const lead = await db.leads.create({
      
    // })
    // form.reset();
  }

  //   console.log(lead_owners.map((lead_owner:any) => lead_owner.value))
  console.log(countryList().getLabels())
  return (
    <Card className="p-4">
      <CardHeader className="flex flex-col">
        <CardTitle>Add new lead</CardTitle>
        {/* <Separator /> */}
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-row gap-40">
              <FormField
                control={form.control}
                name="leadOwner"
                render={({ field }) => (
                  <FormComboBox
                    field={field}
                    list={lead_owners}
                    form={form}
                    form_value="leadOwner"
                    form_label="Lead Owner"
                    text="Select Lead Owner"
                    placeholder="Search lead owner..."
                    command_empty="No lead owners found."
                    width="200px"
                  />
                  //   <FormItem className="flex flex-col">
                  //     <FormLabel>Lead Owner</FormLabel>
                  //     <Popover>
                  //       <PopoverTrigger asChild>
                  //         <FormControl>
                  //           <Button
                  //             variant="outline"
                  //             role="combobox"
                  //             className={cn(
                  //               "w-[200px] justify-between",
                  //               !field.value && "text-muted-foreground"
                  //             )}
                  //           >
                  //             {
                  //             field.value
                  //               ? lead_owners.find(
                  //                   (lead_owner) => lead_owner.value === field.value
                  //                 )?.label
                  //               :
                  //               "Select lead owner"}
                  //             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  //           </Button>
                  //         </FormControl>
                  //       </PopoverTrigger>
                  //       <PopoverContent className="w-[200px] p-0">
                  //         <Command>
                  //           <CommandList>

                  //           <CommandInput placeholder="Search lead owner..." />
                  //           <CommandEmpty>No lead owners found.</CommandEmpty>
                  //           <CommandGroup>
                  //             {lead_owners.map((lead_owner:any) => (
                  //               <CommandItem
                  //                 value={lead_owner.label}
                  //                 key={lead_owner.value}
                  //                 onSelect={() => {
                  //                   form.setValue("leadOwner", lead_owner.value)
                  //                 }}
                  //               >
                  //                 <Check
                  //                   className={cn(
                  //                     "mr-2 h-4 w-4",
                  //                     lead_owner.value === field.value
                  //                       ? "opacity-100"
                  //                       : "opacity-0"
                  //                   )}
                  //                 />
                  //                 {lead_owner.label}
                  //               </CommandItem>

                  //             ))}
                  //           </CommandGroup>
                  //           </CommandList>
                  //         </Command>
                  //       </PopoverContent>
                  //     </Popover>
                  //     <FormMessage />
                  //   </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type_of_company"
                render={({ field }) => (
                  <FormComboBox
                    field={field}
                    list={type_of_companies}
                    form={form}
                    form_value="type_of_company"
                    form_label="Type of Company"
                    text="Select Type of Company"
                    placeholder="Search type of company..."
                    command_empty="No type of company found."
                    width="275px"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="funnel_stage"
                render={({ field }) => (
                  <FormComboBox
                    field={field}
                    list={funnel_stages}
                    form={form}
                    form_value="funnel_stage"
                    form_label="Funnel Stage"
                    text="Select Funnel Stage"
                    placeholder="Search funnel stage..."
                    command_empty="No funnel stage found."
                    width="250px"
                  />
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-40">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormComboBox
                    field={field}
                    list={regions}
                    form={form}
                    form_value="region"
                    form_label="Region"
                    text="Select Region"
                    placeholder="Search region..."
                    command_empty="No region found."
                    width="200px"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormComboBox
                    field={field}
                    list={countryList().getData()}
                    form={form}
                    form_value="country"
                    form_label="Country"
                    text="Select Country"
                    placeholder="Search country..."
                    command_empty="No country found."
                    width="375px"
                  />
                )}
              />
            </div>
            <Separator />
            <CardTitle>
              <div className="flex flex-row justify-between">
                Contacts
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => append(emptyContact)}
                >
                  <Plus />
                </Button>
              </div>
            </CardTitle>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-8">
                <div className="flex flex-row gap-40">
                  <FormField
                    name={`contacts.${index}.first_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contact First Name"
                            className="w-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`contacts.${index}.last_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contact Last Name"
                            className="w-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`contacts.${index}.designation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Designation"
                            className="w-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div key={field.id} className="flex flex-row gap-40">
                  <FormField
                    name={`contacts.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            className="w-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`contacts.${index}.phone_number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Phone number"
                            className="w-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
              </div>
            ))}

            {/* <div className="py-6">
              <Button type="button" onClick={() => append(emptyContact)}>
                Add new contact
              </Button>
            </div> */}
            <div className="flex flex-row justify-center">
              <Button type="submit" className="px-6">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
