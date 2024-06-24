"use client";
import * as React from "react";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import DataPagination from "../data-paganiation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from 'js-cookie'
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { File, ListFilter, PlusCircle, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTableFacetedFilter } from "../data-table-faceted-filter";
import Link from "next/link";
import { DatePickerWithRange } from "../date-picker-with-range";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import config from "@/tailwind.config";
interface LeadsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  firstDate: Date;
  lastDate: Date;
  colOrder?:string[]
  colVis?:any
}
function getDropDownValues<T>(data: T[], selector: string) {
  const uniqueArray = [
    ...new Set(
      data.map((item: any) => {
        return selector === "lead_owner_name"
          ? item["lead_owner"].name
          : item[selector];
      })
    ),
  ];
  const noEmptyValues = uniqueArray.filter((element) => element !== "").sort();
  const optionsArray = noEmptyValues.map((listItem) => {
    return {
      value: listItem,
      label: listItem,
    };
  });
  
  return optionsArray;
}

export const getStyleHorizontalLock = (style: any) =>
  style?.transform
    ? {
        ...style,
        transform: `translate(${style.transform
          .split(",")[0]
          .split("(")
          .pop()}, 0px)`,
      }
    : style;
export function LeadsTable<TData, TValue>({
  columns,
  data,
  firstDate,
  lastDate,
  colOrder,
  colVis
}: LeadsTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(colVis===undefined?{}:colVis);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnOrder, setColumnOrder] = React.useState<string[]>(
    colOrder===undefined?columns.map((c) => c.id!):colOrder
  );
  const [checked, setChecked] = React.useState(false);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedRowModel: getFacetedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnOrder,
    },
  });
  function handleDragEnd(event: any) {
    if (event.destination !== null) {
      const active = event.source.index;
      const over = event.destination.index;

      // console.log(active, over);

      if (active !== over && over !== null) {
        setColumnOrder((items) => {
          console.log(items)
          const b = [...items];
          const c = b[active];
          b[active] = b[over];
          b[over] = c;
          // console.log(b);
          
          
          return b;
        });
      }
    }
    
  }
  const currentColOrder = React.useRef<any>();
  React.useEffect(()=>{
    Cookies.set('lead_col_order',JSON.stringify(columnOrder),{expires:3650})
    console.log('col order in effect', columnOrder)
  },[columnOrder])
  React.useEffect(()=>{
    Cookies.set('lead_col_vis',JSON.stringify(columnVisibility),{expires:3650})
  },[columnVisibility])
  return (
        <Card>
          <CardHeader className="flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <CardTitle>Leads</CardTitle>
              <CardDescription className="py-2">
                List of all leads
              </CardDescription>
            </div>
            <div className="flex-row  testxl:justify-between 2xl:justify-center gap-5 flex-wrap hidden 2xl:flex">
                    <div>
                      {table.getColumn("lead_owner_name") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("lead_owner_name")}
                          title="Lead Owner"
                          options={getDropDownValues(data, "lead_owner_name")}
                        />
                      )}
                    </div>
                    <DatePickerWithRange
                      firstDate={firstDate}
                      lastDate={lastDate}
                      column={table.getColumn("date")}
                    />
                    <div className="flex flex-col">
                      {table.getColumn("funnel_stage") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("funnel_stage")}
                          title="Funnel Stage"
                          options={getDropDownValues(data, "funnel_stage")}
                        />
                      )}
                    </div>
                    <div>
                      {table.getColumn("type_of_company") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("type_of_company")}
                          title="Type of Company"
                          options={getDropDownValues(data, "type_of_company")}
                        />
                      )}
                    </div>
                    <div>
                      {table.getColumn("region") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("region")}
                          title="Region"
                          options={getDropDownValues(data, "region")}
                        />
                      )}
                    </div>
                    <div>
                      {table.getColumn("country") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("country")}
                          title="Country"
                          options={getDropDownValues(data, "country")}
                        />
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => table.resetColumnFilters()}
                    >
                      Clear Filters
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className=" h-8">
                          Column Visibility
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          {
                            columnOrder.map((colName:any)=>{
                              const column = table.getColumn(colName)
                              return(
                                <DropdownMenuCheckboxItem
                                  key={column!.id}
                                  className="capitalize cursor-pointer"
                                  checked={column!.getIsVisible()}
                                  onSelect={(event) => event.preventDefault()}
                                  onCheckedChange={(value) =>
                                    { 
                                      
                                      return column!.toggleVisibility(!!value);
                                    }
                                    
                                  }
                                >
                                  {column!.id}
                                </DropdownMenuCheckboxItem>
                              );
                            })
                          }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
            <CardTitle className='py-3 sm:py-0'>
              <div className="relative flex">
                <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground top-2" />
                <Input
                  placeholder="Search..."
                  value={globalFilter ?? ""}
                  onChange={(event) => {
                    setGlobalFilter(event.target.value);
                  }}
                  className="pl-8 h-8"
                />
                <div className="ml-auto flex gap-2 pl-2">
                  <Link href={"/dashboard/leads/new-lead"}>
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add New Lead
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardTitle>
            </div>
           

            <CardTitle className="2xl:hidden">
              <div className="flex flex-row  testxl:justify-between 2xl:justify-center gap-5 flex-wrap">
                    <div>
                      {table.getColumn("lead_owner_name") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("lead_owner_name")}
                          title="Lead Owner"
                          options={getDropDownValues(data, "lead_owner_name")}
                        />
                      )}
                    </div>
                    <DatePickerWithRange
                      firstDate={firstDate}
                      lastDate={lastDate}
                      column={table.getColumn("date")}
                    />
                    <div className="flex flex-col">
                      {table.getColumn("funnel_stage") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("funnel_stage")}
                          title="Funnel Stage"
                          options={getDropDownValues(data, "funnel_stage")}
                        />
                      )}
                    </div>
                    <div>
                      {table.getColumn("type_of_company") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("type_of_company")}
                          title="Type of Company"
                          options={getDropDownValues(data, "type_of_company")}
                        />
                      )}
                    </div>
                    <div>
                      {table.getColumn("region") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("region")}
                          title="Region"
                          options={getDropDownValues(data, "region")}
                        />
                      )}
                    </div>
                    <div>
                      {table.getColumn("country") && (
                        <DataTableFacetedFilter
                          column={table.getColumn("country")}
                          title="Country"
                          options={getDropDownValues(data, "country")}
                        />
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => table.resetColumnFilters()}
                    >
                      Clear Filters
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className=" h-8">
                          Column Visibility
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          {
                            columnOrder.map((colName:any)=>{
                              const column = table.getColumn(colName)
                              return(
                                <DropdownMenuCheckboxItem
                                  key={column!.id}
                                  className="capitalize cursor-pointer"
                                  checked={column!.getIsVisible()}
                                  onSelect={(event) => event.preventDefault()}
                                  onCheckedChange={(value) =>
                                    { 
                                      
                                      return column!.toggleVisibility(!!value);
                                    }
                                    
                                  }
                                >
                                  {column!.id}
                                </DropdownMenuCheckboxItem>
                              );
                            })
                          }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
            </CardTitle>
            
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <DragDropContext
                    onDragStart={() => {
                      console.log('HEADER GROUP',headerGroup)
                      currentColOrder.current = table
                        .getAllFlatColumns()
                        .map((o) => o.id);
                    }}
                    onDragEnd={handleDragEnd}
                    key={headerGroup.id}
                  >
                    <Droppable droppableId="droppable" direction="horizontal">
                      {(provided) => (
                        <TableRow
                          key={headerGroup.id}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {headerGroup.headers.map((header) => {
                            return (
                              <Draggable
                                key={header.id}
                                draggableId={header.id}
                                index={header.index}
                              >
                                {(provided) => (
                                  <TableHead
                                    key={header.id}
                                    className="md:table-cell"
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    style={{
                                      ...getStyleHorizontalLock(
                                        provided.draggableProps.style
                                      ),
                                    }}
                                  >
                                    {header.isPlaceholder ||
                                    header.id === "image"
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                  </TableHead>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </TableRow>
                      )}
                    </Droppable>
                  </DragDropContext>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id} className="md:table-cell">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <DataPagination table={table} />
          </CardContent>
        </Card>
  );
}
