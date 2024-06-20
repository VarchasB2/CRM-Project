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
  const [selectedValues, setSelectedValues] = useState<string[]>(form.getValues(form_value));
  // console.log(list)
  // console.log('form obj in combo',form.getValues(form_value))
  // Effect to synchronize form value with selectedValues on mount and update
  // useEffect(() => {
  //   if (!multiSelect && field.value !== selectedValues[0]) {
  //     setSelectedValues([field.value]);
  //   }
  //   else if (multiSelect && !selectedValues.includes(field.value)) {
  //     setSelectedValues([...selectedValues, field.value]);
  //   }
  // }, [field.value, multiSelect,selectedValues]);
  // useEffect(() => {
  //   if (!multiSelect && field.value !== selectedValues[0]) {
  //     setSelectedValues([field.value.toString()]);
  //   } else if (
  //     multiSelect &&
  //     !selectedValues.includes(field.value.toString())
  //   ) {
  //     // console.log('selectedValues.includes(field.value.toString()',selectedValues.includes(field.value.toString()))
  //     setSelectedValues((prevValues) => {
  //       // console.log('USE EFFECT PREV VALUES',prevValues)
  //       return [...prevValues.filter((n: any) => n), field.value.toString()];
  //     });
  //   }
  // }, [field.value, multiSelect, selectedValues]);

  // Function to toggle selected values
  // const toggleSelectedValues = (item: any) => {
  //   const newValue = item.value;
  //   let updatedValues: string[];

  //   if (multiSelect) {
  //     if (selectedValues.includes(newValue)) {
  //       updatedValues = selectedValues.filter((value) => value !== newValue);
  //     } else {
  //       updatedValues = [...selectedValues, newValue];
  //     }
  //   } else {
  //     updatedValues = [newValue];
  //   }

  //   setSelectedValues(updatedValues);
  //   form.setValue(form_value, multiSelect ? updatedValues : newValue);
  //   setOpen(false);
  // };
  // console.log('FORM VALUE',form_label)
  const toggleSelectedValues = (item: any) => {
    const itemValue = item.value.toString();
    let updatedValues: string[];

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

  // Function to determine if an item is selected
  // const isSelected = (item: any) => {
  //   const itemValue = item.value.toString(); // Ensure item.value is treated as a string
  //   if (multiSelect) {
  //     return selectedValues.includes(itemValue);
  //   } else {
  //     return itemValue === field.value;
  //   }
  // };
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
          // console.log('ITEM',item)
          // console.log('selectedValues.includes(item.value)',selectedValues.includes(item.value))
          // console.log('selectedValues',selectedValues)
          return selectedValues.includes(item.value)})
        .map((item: any) => item.label)
        .join(", ") || text
    : list.find((item: any) => {
      return item.value === field.value;
    })?.label || text;
  // console.log('selectedLabels',selectedLabels)
  // let selectedLabels = ''
  // let selectedLabelList = []
  // if (multiSelect) {

  //    selectedLabelList =
  //     list
  //       .filter((item: any) => {
  //         console.log("FILTER ITEM", item,selectedValues.includes(item.value));
  //         return selectedValues.includes(item.value);
  //       })
  //       .map((item: any) => {
  //         return item.label;
  //       })
  //     selectedLabels = selectedLabelList.join(", ") || text;
  //     console.log(selectedLabels, selectedLabelList)
  // } else {
  //    selectedLabels =
  //     list.find((item: any) => {
  //       return item.value === field.value;
  //     })?.label || text;
  // }
  return (
    <FormItem className="flex flex-col mt-auto gap-1">
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
                {list.map((item: any, index: number) => (
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
                ))}
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
