"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { number, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Plus, Trash2 } from "lucide-react";
import FormComboBox from "./form-combo-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import countryList from "react-select-country-list";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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
  opportunities: z.array(
    z.object({
      description: z.string({

      }).min(1, {
        message: "Required",
      }),
      revenue: z.coerce.number({message: "Enter numerical values only"}).min(1, {
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
const emptyOpportunity: any = {
  description: "",
  revenue: "",
};

export default function CreateLeadForm() {
  const {toast} = useToast()
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
      opportunities: [],
    },
  });
  const {
    fields: contactFields,
    append: contactAppend,
    remove: contactRemove,
  } = useFieldArray({
    ...form,
    name: "contacts",
  });
  const {
    fields: opportunityFields,
    append: opportunityAppend,
    remove: opportunityRemove,
  } = useFieldArray({
    ...form,
    name: "opportunities",
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const leadResponse = await fetch("http://localhost:3000/api/lead-owners", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    toast({
      title:"Lead created"
    })
    // form.reset();
  }

  //   console.log(lead_owners.map((lead_owner:any) => lead_owner.value))
  countryList().getLabels();
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
                  onClick={() => contactAppend(emptyContact)}
                >
                  <Plus />
                </Button>
              </div>
            </CardTitle>
            {contactFields.map((field, index) => (
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

                <div key={field.id} className="flex flex-row justify-between">
                  <div className="flex flex-row gap-40">
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
                  {index !== 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => contactRemove(index)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>

                <Separator />
              </div>
            ))}
            <CardTitle>
              <div className="flex flex-row justify-between">
                Opportunity
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => opportunityAppend(emptyOpportunity)}
                >
                  <Plus />
                </Button>
              </div>
            </CardTitle>
            {opportunityFields.map((field, index) => (
              <div key={field.id} className="space-y-8">
                <FormField
                  name={`opportunities.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-between">
                  <FormField
                    name={`opportunities.${index}.revenue`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Revenue"
                            className="w-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => opportunityRemove(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>

                <Separator />
              </div>
            ))}

            <div className="flex flex-row justify-center">
              <Button type="submit" className="px-6">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
