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

interface ContactLookupProps<TData, TValue> {
  columns: any;
  data: TData[];
  colOrder?: string[];
  facetedFilterCols?: string[];
  firstDate: Date;
  lastDate: Date;
}
function getDropDownValues<T>(data: T[], selector: string) {
  const uniqueArray = [
    ...new Set(
      data.map((item: any) => {
        return selector === "lead_owner"
          ? item["lead"][0].lead_owner.name
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

export function ContactLookupTable<TData, TValue>({
  columns,
  data,
  colOrder,
  firstDate,
  lastDate,
}: ContactLookupProps<TData, TValue>) {
  
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnOrder, setColumnOrder] = React.useState<string[]>(
    colOrder == undefined ? columns.map((c:any) => c.id!) : colOrder
    // ['SI','lead_owner','date','type_of_company','company_name','revenue']
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
  function handleDragEnd(event:any) {
    if (event.destination !== null){

      const active = event.source.index;
      const over = event.destination.index;
  
      if (active !== over && over!==null) {
        setColumnOrder((items) => {
          const b = [...items];
          const c = b[active];
          b[active] = b[over];
          b[over] = c;
          return b;
        });
    }
		}
	}
  const currentColOrder = React.useRef<any>();
  console.log(getDropDownValues(data, "lead_owner"))
  return (
    <Tabs defaultValue="all">
      <TabsContent value="all">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div>
              <CardTitle>Contact Lookup</CardTitle>
              <CardDescription className="py-2">
                All contacts
              </CardDescription>
            </div>

            <CardTitle className="flex flex-row">
              <div className="flex flex-row  justify-between gap-5 ">
                <div>
                  {table.getColumn("lead_owner") && (
                    <DataTableFacetedFilter
                      column={table.getColumn("lead_owner")}
                      title="Lead Owner"
                      options={getDropDownValues(data, "lead_owner")}
                      isArray={true}
                    />
                  )}
                </div>
                <DatePickerWithRange firstDate={firstDate} lastDate={lastDate} column={table.getColumn('lead_date')}/>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8  p-2"
                  onClick={() => table.resetColumnFilters()}
                >
                  Clear Filters
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto h-8">
                      Column Visibility
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize cursor-pointer"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardTitle>
            <CardTitle>
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
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <DragDropContext
                    onDragStart={() => {
                      // console.log(table.getAllFlatColumns().map((o) => o.id))
                      currentColOrder.current = table
                        .getAllFlatColumns()
                        .map((o) => o.id);
                    }}
                    onDragEnd={handleDragEnd} 
                    // onDragEnd={(result, provided) => {}}
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
      </TabsContent>
    </Tabs>
  );
}