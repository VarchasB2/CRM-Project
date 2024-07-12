import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

import { ListFilter, Square, SquareCheck } from "lucide-react";

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  isArray?: boolean;
  options: {
    label: string;
    value: string;
  }[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column, //Passed as props
  title,
  options,
  isArray = false,
}: DataTableFacetedFilter<TData, TValue>) {
  console.log("column", column);
  console.log('facets',column?.getFacetedUniqueValues())

  let facets = column?.getFacetedUniqueValues();
  // console.log(facets);
  const convertedMap: Map<any, number>|undefined= new Map()
  if (facets) {
    facets.forEach((value, key) => {
      const names = key.split(",").map((name:any) => name.trim());
      const newName = names.length === 1 ? names[0] : names[0];
      convertedMap.set(newName, value || 0); // Handle undefined case by providing a default value, e.g., 0
    });
  }
  
  facets = convertedMap
  // Iterate through the originalMap entries
  if (isArray) {
    const transformedMap = new Map();
    facets?.forEach((value, key) => {
      // If key is an array, iterate through its elements
      if (Array.isArray(key)) {
        key.forEach((element) => {
          // Check if the element already exists in the transformedMap
          if (transformedMap.has(element)) {
            // Increment the count if the element exists
            transformedMap.set(element, transformedMap.get(element) + value);
          } else {
            // Initialize the count if the element does not exist
            transformedMap.set(element, value);
          }
        });
      }
    });
    facets = transformedMap;
  }

  const selectedValues = new Set(column?.getFilterValue() as string[]);
  // console.log(options)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <ListFilter className="w-4 h-4 mr-2" />
          {title}
          {/* {selectedValues?.size > 0 && 
              <div className="space-x-1 lg:flex">
                {(
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="px-1 font-normal rounded-sm"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )  }
              </div>
          } */}
        </Button>
      </PopoverTrigger>
      {selectedValues?.size > 0 && (
        <div className="space-x-1 lg:flex pt-2">
          {options
            .filter((option) => selectedValues.has(option.value))
            .map((option) => {
              // console.log("OPTION VALUE",option.value)
              return (
                <Badge
                  variant="secondary"
                  key={option.value}
                  className="px-1 font-normal rounded-sm"
                >
                  {option.label}
                </Badge>
              );
            })}
        </div>
      )}
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    className="cursor-pointer"
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      // console.log(filterValues);
                      // console.log(column?.getFilterFn());
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div className="mr-6 text-lg">
                      {isSelected ? <SquareCheck /> : <Square />}
                    </div>

                    <span>{option.label}</span>
                    {/* This part adds a number at the end of dropdown row */}
                    {facets?.get(option.value) && (
                      <span className="flex items-center justify-center w-4 h-4 ml-auto font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
  return <div></div>;
}
