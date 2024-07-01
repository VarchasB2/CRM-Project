import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormComboBoxProps {
  field: any;
  list: any;
  form: any;
  form_value: string;
  form_label: string;
  text: string;
  placeholder: string;
  command_empty: string;
  className: string;
  multiSelect?: boolean;
}

const FormComboBox = ({
  field,
  list,
  form,
  form_value,
  form_label,
  text,
  placeholder,
  command_empty,
  className,
  multiSelect = false,
}: FormComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    form.getValues(form_value)
    
  );
  // console.log('FORM VALUE',selectedValues)
  if(form_label==='Currency')
    console.log(field)
  const toggleSelectedValues = (item: any) => {
    // console.log('TYPEOF ITEM',typeof item)

    const itemValue = item.value.toString();
    let updatedValues: string[];
    // console.log(selectedValues)
    if (selectedValues.includes(itemValue)) {
      // Item is already selected, so remove it
      updatedValues = selectedValues.filter((value) => value !== itemValue);
    } else {
      // Item is not selected, so add it
      updatedValues = [...selectedValues, itemValue];
    }

    setSelectedValues(updatedValues);
    // console.log("selectedValues", selectedValues);
    form.setValue(form_value, multiSelect ? updatedValues : itemValue);
    setOpen(false);
  };
  
  const isSelected = (item: any) => {
    const itemValue = item.value.toString();
    if (multiSelect) {
      return selectedValues.includes(itemValue);
    } else {
      return itemValue === field.value.toString();
    }
  };

  // Display selected label(s)
  const selectedLabels = multiSelect
    ? list
        .filter((item: any) => {
          return selectedValues.includes(item.value);
        })
        .map((item: any) => item.label)
        .join(", ") || text
    : list.find((item: any) => {
        return item.value === field.value;
      })?.label || text;

  return (
    <FormItem className="flex flex-col mt-auto gap-1 min-w-full sm:min-w-80">
      <FormLabel>{form_label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "justify-between",
                className,
                !field.value && "text-muted-foreground"
              )}
            >
              {selectedLabels}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="popover-content-width-full">
          <Command>
            <CommandList>
              <CommandInput placeholder={placeholder} />
              <CommandEmpty>{command_empty}</CommandEmpty>
              <CommandGroup>
                {list.map((item: any, index: number) => {
                  return (
                    <CommandItem
                      value={item.label}
                      key={`${item.value} ${index}`}
                      onSelect={() => toggleSelectedValues(item)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected(item) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};

export default FormComboBox;
