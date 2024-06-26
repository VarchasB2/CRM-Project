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
      description: z.string({}).min(1, {
        message: "Required",
      }),
      revenue: z.coerce
        .number({ message: "Enter numerical values only" })
        .min(1, {
          message: "Required",
        }),
      currency: z.string().min(1, {
        message: "Required",
      }),
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
const emptyOpportunity: any = {
  description: "",
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
  const {convertToUSD,convertFromUSD} = useCurrency()
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
                description: opportunity.description,
                revenue: convertFromUSD(opportunity.revenue),
                currency: opportunity.currency==='INR'?'INR':'USD',
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

  // React.useEffect(() => {
  //   const currencyValues = form.watch('opportunities');
  //   currencyValues.forEach((opportunity:any, index:any) => {
  //     if (opportunity.currency === 'INR') {
  //       const convertedRevenue = convertFromUSD(opportunity.revenue);
  //       console.log('USD TO INR',convertedRevenue)
  //       form.setValue(`opportunities.${index}.revenue`, convertedRevenue);
  //       console.log(form.getValues(`opportunities.${index}.revenue`))
  //     }
  //     else{
  //       const convertedRevenue = convertToUSD(opportunity.revenue);
  //       console.log('INR TO USD',convertedRevenue)
  //       form.setValue(`opportunities.${index}.revenue`, convertedRevenue);
  //       console.log(form.getValues(`opportunities.${index}.revenue`))
  //     }
  //   });
  // }, [convertFromUSD, convertToUSD, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
  }

  async function createLead(values: z.infer<typeof formSchema>) {
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
            ? JSON.stringify(values)
            : JSON.stringify({ ...values, original: obj }),
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
    }
  }
  countryList().getLabels();
  const width = "min-w-full sm:min-w-80 ";
  const contactList = form.watch("contacts");
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
                  onClick={() => contactAppend(emptyContact)}
                >
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
                        <Textarea
                          placeholder="Description"
                          {...field}
                          className={width}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-10 flex-wrap">
                    <FormField
                    name={`opportunities.${index}.currency`}
                    render={({field})=>(
                      <FormComboBox
                      field={field}
                      list={[{label:'USD',value:'USD'},{label:'INR',value:'INR'}]}
                      form={form}
                      form_value={`opportunities.${index}.currency`}
                      form_label="Currency"
                      text="Select Currency"
                      placeholder="Search currency..."
                      command_empty="No currency found."
                      className={width}
                    />
                    )}
                    />
                    <FormField
                      name={`opportunities.${index}.revenue`}
                      render={({ field }) => (
                        <FormItem className={width}>
                          <FormLabel>Revenue</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Revenue"
                              className={width}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormComboBox/> */}
                    <FormField
                      control={form.control}
                      name={`opportunities.${index}.contact_email`}
                      render={({ field }) => {
                        // console.log("field in form", field.value);
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
