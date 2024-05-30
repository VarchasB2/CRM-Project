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
import DataPagination from "./data-paganiation";
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
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
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
export const getStyleHorizontalLock = (style:any) => style?.transform
  ? ({ ...style, transform: `translate(${style.transform.split(',')[0].split('(').pop()}, 0px)` })
  : style
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnOrder, setColumnOrder] = React.useState<string[]>(columns.map(c => c.id!));
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
    onColumnOrderChange:setColumnOrder,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnOrder
    },
  });
  const currentColOrder = React.useRef<any>();  
  return (
    <Tabs defaultValue="all">
      <TabsContent value="all">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader className="flex flex-row justify-between">
            <div>
              <CardTitle>Leads</CardTitle>
              <CardDescription className="py-2">
                List of all leads
              </CardDescription>
            </div>

            <CardTitle className="flex flex-row">
              <div className="flex flex-row  justify-between gap-5 ">
                <div>
                  {table.getColumn("lead_owner_name") && (
                    <DataTableFacetedFilter
                      column={table.getColumn("lead_owner_name")}
                      title="Lead Owner"
                      options={getDropDownValues(data, "lead_owner_name")}
                    />
                  )}
                </div>
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
                <div className="ml-auto flex gap-2 pl-2">
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Columns
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
                              className="capitalize"
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
                  </DropdownMenu> */}
                  {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                      <File className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Export
                      </span>
                    </Button> */}
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Product
                    </span>
                  </Button>
                </div>
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
                      currentColOrder.current = table.getAllFlatColumns().map((o) => o.id);
                    }}
                    onDragEnd={(dragEndObj, b) => {
                      // console.log("onDragUpdate", dragEndObj, b);
      
                      const colOrder = [...currentColOrder.current];
                      const sIndex = dragEndObj.source.index;
                      const dIndex =
                        dragEndObj.destination && dragEndObj.destination.index;
                      // console.log("sIndex",sIndex)
                      // console.log("dIndex",dIndex)
                      if (typeof sIndex === "number" && typeof dIndex === "number") {
                        const newColumnOrder = [...colOrder]
                        newColumnOrder.splice(sIndex, 1);
                        newColumnOrder.splice(dIndex, 0, dragEndObj.draggableId);
                        console.log("newColumnOrder",newColumnOrder)
                        setColumnOrder(newColumnOrder);
                        console.log(columnOrder)
                        
                        
                        // console.log(
                        //   "onDragUpdate",
                        //   dragEndObj.destination.index,
                        //   dragEndObj.source.index
                        // );
                        // console.log(temp);
                      }
                    }}
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
                                    className="md:table-cell text-center"
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    style={{...getStyleHorizontalLock(provided.draggableProps.style)}}
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
                          <TableCell key={cell.id} className="text-center">
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
