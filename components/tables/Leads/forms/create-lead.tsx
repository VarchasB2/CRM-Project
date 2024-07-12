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
import { Check, ChevronsUpDown, Loader2, LoaderIcon, Plus, Trash2 } from "lucide-react";
import FormComboBox from "./form-combo-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import countryList from "react-select-country-list";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Dialog } from "@radix-ui/react-dialog";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ToastAction } from "@/components/ui/toast";
import React from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneInput } from "./phone-number-input";
import { User } from "@prisma/client";
import { useCurrency } from "@/Providers/currency-provider";
import NestedNotes from "./nested-notes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSession } from "next-auth/react";

export const formSchema = z.object({
  lead_owner: z.string().min(1, {
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
      email: z
        .string()
        .min(1, {
          message: "Required",
        })
        .email("Enter a vaild email"),
      phone_number: z
        .string()
        .min(1, {
          message: "Required",
        })
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    })
  ),
  opportunities: z.array(
    z.object({
      notes: z.array(
        z.object({
          description: z.string().min(1, {
            message: "Required",
          }),
          date: z.date(),
        })
      ),
      revenue: z.coerce
        .number({ message: "Enter numerical values only" })
        .min(1, {
          message: "Required",
        }),
      currency: z.string().min(1, {
        message: "Required",
      }),
      previousCurrency: z.string(),
      contact_email: z.array(
        z
          .string({})
          .min(1, {
            message: "Required",
          })
          .email("Enter a vaild email")
      ),
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
export const emptyNote: any = {
  description: "",
  date: new Date(),
};
const emptyOpportunity: any = {
  notes: [emptyNote],
  revenue: "",
  currency: "USD",
  contact_email: "",
};

export default function CreateLeadForm({
  obj,
  users,
  currentUser,
}: {
  obj?: any;
  users: any;
  currentUser: string;
}) {
  const { toast } = useToast();
  const { convertToUSD, convertFromUSD, currency, setCurrency } = useCurrency();
  const {data: session} = useSession()
  const [isLoading, setLoading] = React.useState(false)
  if (
    obj !== undefined &&
    obj.account !== null &&
    obj.account.opportunities.length > 0
  )
    obj.account.opportunities.map((opportunity: any) => {
      opportunity.revenue = Number(opportunity.revenue);
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lead_owner: obj === undefined ? currentUser : obj.lead_owner.name,
      type_of_company: obj === undefined ? "" : obj.type_of_company,
      funnel_stage: obj === undefined ? "" : obj.funnel_stage,
      company_name: obj === undefined ? "" : obj.company_name,
      region: obj === undefined ? "" : obj.region,
      country: obj === undefined ? "" : countryList().getValue(obj.country),
      contacts:
        obj === undefined
          ? [
              {
                first_name: "",
                last_name: "",
                designation: "",
                email: "",
                phone_number: "",
              },
            ]
          : obj.contacts,
      opportunities:
        obj === undefined ||
        obj.account === null ||
        obj.account.opportunities.length === 0
          ? []
          : obj.account.opportunities.map((opportunity: any) => {
              return {
                // description: opportunity.description,
                notes:
                  opportunity.notes.length === 0
                    ? [emptyNote]
                    : opportunity.notes,
                revenue:
                  currency === "USD"
                    ? opportunity.revenue
                    : convertFromUSD(opportunity.revenue),
                currency: currency,
                contact_email: opportunity.contact.map(
                  (contact: any) => contact.email
                ),
              };
            }),
    },
  });
  // console.log(form.getValues("opportunities"));
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
  const router = useRouter();
  
  const [isOpenAlert, setOpenAlert] = React.useState(false);
  React.useLayoutEffect(() => {
    opportunityFields.forEach((field, index) => {
      const currentCurrency = currency;
      const currentRevenue = form.getValues(`opportunities.${index}.revenue`);
      const previousCurrency = form.getValues(`opportunities.${index}.previousCurrency`);
      // Check if currency has changed
      if (previousCurrency !== currentCurrency) {
        if (previousCurrency === "INR" && currentCurrency === "USD") {
          console.log("INR TO USD");
          const convertedRevenue = convertToUSD(currentRevenue);
          form.setValue(`opportunities.${index}.revenue`, convertedRevenue);
        }
        if (previousCurrency === "USD" && currentCurrency === "INR") {
          console.log("USD TO INR");
          const convertedRevenue = convertFromUSD(currentRevenue);
          form.setValue(`opportunities.${index}.revenue`, convertedRevenue);
        }
  
        // Update previousCurrency in form values
        form.setValue(`opportunities.${index}.previousCurrency`, currentCurrency);
      }
    });
  }, [currency, convertFromUSD, convertToUSD, form, opportunityFields]);
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.opportunities.forEach((opportunity: any, index: number) => {
      if (currency === "INR") {
        console.log('CURRENCY IS INR')
        const convertedRevenue = convertToUSD(opportunity.revenue);
        console.log('converted revenue',convertedRevenue)
        values.opportunities[index].revenue = convertedRevenue;
      }
    });
    if (obj === undefined) {
      const ifExistResult = await fetch("/api/unique-leads", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      // console.log(await ifExistResult.json())
      const checkResults = await ifExistResult.json();
      if (checkResults[0].length !== 0 || checkResults[1].length !== 0) {
        setOpenAlert(true);
      } else {
        createLead(values);
      }
    } else createLead(values);
    console.log(values);
  }

  async function createLead(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      setOpenAlert(false);
      const method = obj === undefined ? "POST" : "PUT";
      const response = await fetch("/api/lead-owners", {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body:
          obj === undefined
            ? JSON.stringify({...values, user: session?.user.username})
            : JSON.stringify({ ...values, original: obj ,user:session?.user.username}),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${obj ? "update" : "create"} lead.`);
      }
      const data = await response.json();
      toast({
        title: `${obj ? "Lead updated" : "Lead created"} successfully`,
      });
      form.reset();
      router.refresh();

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: `Failed to ${obj ? "update" : "create"} lead.`,
        variant: "destructive",
      });
    } finally{
      setLoading(false)
    }
  }
  countryList().getLabels();
  const width = "min-w-full sm:min-w-80 ";
  const contactList = form.watch("contacts");
  // console.log("form",form.getValues('opportunities'))
  // if (obj) console.log("OBJECT", obj);
  return (
    <Card className="p-4">
      <CardHeader className="flex flex-col">
        <CardTitle>{obj ? "Edit lead" : "Add new lead"}</CardTitle>
        {/* <Separator /> */}
      </CardHeader>

      <CardContent className="flex flex-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex-1"
          >
            <div className="flex flex-row gap-10 flex-wrap">
              <FormField
                control={form.control}
                name="lead_owner"
                render={({ field }) => (
                  <FormComboBox
                    field={field}
                    list={users}
                    form={form}
                    form_value="lead_owner"
                    form_label="Lead Owner"
                    text="Select Lead Owner"
                    placeholder="Search lead owner..."
                    command_empty="No lead owners found."
                    // className={width}
                    className="w-full"
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
                    className={width}
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
                    className={width}
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
                    <Input
                      placeholder="Company Name"
                      {...field}
                      className={width}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-10 flex-wrap">
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
                    className={width}
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
                    className={width}
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
                  className="gap-1"
                  onClick={() => contactAppend(emptyContact)}
                >
                  Add Contact
                  <Plus />
                </Button>
              </div>
            </CardTitle>
            {contactFields.map((field, index) => (
              <div key={field.id} className="space-y-8">
                <div className="flex flex-row gap-10 flex-wrap ">
                  <FormField
                    name={`contacts.${index}.first_name`}
                    render={({ field }) => (
                      <FormItem className={width}>
                        <FormLabel>Contact First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contact First Name"
                            className={width}
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
                      <FormItem className={width}>
                        <FormLabel>Contact Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contact Last Name"
                            className={width}
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
                      <FormItem className={width}>
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Designation"
                            className={width}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div key={field.id} className="flex flex-row justify-between">
                  <div className="flex flex-row gap-10 flex-wrap">
                    <FormField
                      name={`contacts.${index}.email`}
                      render={({ field }) => (
                        <FormItem className={width}>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              className={width}
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
                        <FormItem className={width}>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            {/* <Input
                              placeholder="Phone number"
                              className={width}
                              {...field}
                            /> */}

                            <PhoneInput
                              placeholder="Phone number"
                              className={width}
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
                      className="gap-1"
                      onClick={() => contactRemove(index)}
                    >
                      Delete Contact
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
                  className="gap-1"
                  onClick={() => opportunityAppend(emptyOpportunity)}
                >
                  Add Opportunity
                  <Plus />
                </Button>
              </div>
            </CardTitle>
            {opportunityFields.map((field, index) => (
              <div key={field.id} className="space-y-8">
                <NestedNotes oppIndex={index} form={form} />

                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-10 flex-wrap">
                    <div className="flex flex-row items-end">
                      <FormField
                        name={`opportunities.${index}.currency`}
                        render={({ field }) => (
                          <FormItem>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="rounded-r-none justify-between w-20"
                                  >
                                    {field.value}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align="start" className="w-32">
                                <Command>
                                  <CommandList>
                                    <CommandGroup>
                                      {["USD", "INR"].map((item) => (
                                        <CommandItem
                                          key={item}
                                          value={item}
                                          className="cursor-pointer"
                                          onSelect={() => {
                                            form.setValue(
                                              `opportunities.${index}.currency`,
                                              item
                                            );
                                            setCurrency(item);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              item === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {item}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`opportunities.${index}.revenue`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Revenue</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Revenue"
                                className={cn("min-w-60", "rounded-l-none")}
                                {...field}
                                value={
                                  field.value !== ""
                                    ? parseFloat(field.value).toLocaleString(
                                        "en-IN"
                                      )
                                    : ""
                                }
                                onChange={(e) => {
                                  // Remove commas from the input value before setting the form value
                                  const strippedValue = e.target.value.replace(
                                    /,/g,
                                    ""
                                  );
                                  // Set the form value with the stripped value
                                  field.onChange(strippedValue);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`opportunities.${index}.contact_email`}
                      render={({ field }) => {
                        return (
                          <FormComboBox
                            field={field}
                            multiSelect={true}
                            list={contactList
                              .filter((contact) => contact.email !== "")
                              .map((contact) => ({
                                label: contact.email,
                                value: contact.email,
                              }))}
                            form={form}
                            form_value={`opportunities.${index}.contact_email`}
                            form_label="Contact Email"
                            text="Select contact"
                            placeholder="Search contact..."
                            command_empty="No contact found."
                            className={width}
                          />
                        );
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="gap-1"
                    onClick={() => opportunityRemove(index)}
                    disabled={isLoading}
                  >
                    Delete opportunity
                    <Trash2 />
                  </Button>
                </div>

                <Separator />
              </div>
            ))}

            <div className="flex flex-row justify-center">
              <Button type="submit" className="px-6">
                {isLoading? <Loader2/>:'Submit'}
              </Button>
            </div>
            <AlertDialog open={isOpenAlert}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Record exists</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`Record with company name: ${form.getValues(
                      "company_name"
                    )} or contact with email(s): ${form
                      .getValues("contacts")
                      .map(
                        (e) => e.email
                      )} already exist. Do you still want to add this lead?`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={form.handleSubmit(createLead)}>
                    Continue
                  </AlertDialogAction>
                  <AlertDialogCancel
                    onClick={() => {
                      setOpenAlert(false);
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
