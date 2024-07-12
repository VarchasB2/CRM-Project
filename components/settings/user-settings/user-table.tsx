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
import Link from "next/link";
import Cookies from "js-cookie";
import { DataTableFacetedFilter } from "@/components/tables/data-table-faceted-filter";
import DataPagination from "@/components/tables/data-paganiation";

interface UserDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
function getDropDownValues<T>(data: T[], selector: string) {
  const uniqueArray = [
    ...new Set(
      data.map((item: any) => {
        // if (selector === "lead_owner")
        //   return item["account"].lead.lead_owner.name;
        // else if (selector === "type_of_company")
        //   return item["account"].type_of_company;
        return item[selector];
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

export function UserDataTable<TData, TValue>({
  columns,
  data,
}: UserDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [globalFilter, setGlobalFilter] = React.useState("");
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
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });
//   console.log(table.getRowModel())
  return (
    <Tabs defaultValue="all">
      <TabsContent value="all">
        <Card>
          <CardHeader className="flex flex-col justify-between">
            <div className="flex flex-row justify-between">
              <div>
                <CardTitle>User</CardTitle>
                <CardDescription className="py-2">
                  List of users
                </CardDescription>
              </div>

              <CardTitle className="hidden flex-row justify-between gap-5 testxl:flex">
                <div>
                  {table.getColumn("status") && (
                    <DataTableFacetedFilter
                      column={table.getColumn("status")}
                      title="Status"
                      options={getDropDownValues(data, "status")}
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
              </CardTitle>
              <CardTitle className='py-3 sm:py-0 flex flex-row'>
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
                <div className="ml-auto flex gap-2 pl-2">
                  <Link href={"/dashboard/settings/new-user"}>
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add New User
                      </span>
                    </Button>
                  </Link>
                </div>
              </CardTitle>
            </div>
            <div className="flex flex-row gap-5 flex-wrap testxl:hidden ">
              <div>
                {table.getColumn("status") && (
                  <DataTableFacetedFilter
                    column={table.getColumn("status")}
                    title="Status"
                    options={getDropDownValues(data, "status")}
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
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="md:table-cell">
                          {header.isPlaceholder || header.id === "image"
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
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
