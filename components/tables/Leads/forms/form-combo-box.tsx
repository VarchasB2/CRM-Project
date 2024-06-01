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
import React from "react";

interface FormComboBoxProps {
  field: any;
  list: any;
  form: any;
  form_value: string;
  form_label: string;
  text: string;
  placeholder: string;
  command_empty: string;
  width: string;
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
  width,
}: FormComboBoxProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{form_label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                `w-[${width}] justify-between`,
                // "w-[375px] justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? list.find((item: any) => item.value === field.value)?.label
                : text}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className={cn(`w-[${width}] p-0`)}>
          {/* <PopoverContent className="w-[375px] p-0"> */}
          <Command>
            <CommandList>
              <CommandInput placeholder={placeholder} />
              <CommandEmpty>{command_empty}</CommandEmpty>
              <CommandGroup>
                {list.map((item: any) => (
                  <CommandItem
                    value={item.label}
                    key={item.value}
                    onSelect={() => {
                      form.setValue(form_value, item.value);
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        item.value === field.value ? "opacity-100" : "opacity-0"
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
