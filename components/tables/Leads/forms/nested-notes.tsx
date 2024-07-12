import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { emptyNote } from "./create-lead";
const NestedNotes = ({ oppIndex, form }: { oppIndex: any; form: any }) => {
  const { fields, remove, append } = useFieldArray({
    ...form,
    name: `opportunities.${oppIndex}.notes`,
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-8 pb-5">
          <FormField
            name={`opportunities.${oppIndex}.notes.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex flex-row items-end justify-between">
                    Description
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-fit w-fit items-end gap-1"
                      onClick={() => {
                        append(emptyNote);
                      }}
                    >
                      Add note
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="min-w-80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-between">
            <FormField
              name={`opportunities.${oppIndex}.notes.${index}.date`}
              render={({ field }) => {
                // console.log('field',field)
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          // disabled={(date) => date < today}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {index !== 0 && (
              <Button type="button" variant='ghost' onClick={() => remove(index)} className='gap-1'>
                Delete note
                <Trash2 className='h-5 w-5'/>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NestedNotes;
