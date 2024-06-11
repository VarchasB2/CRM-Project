"use client";
import * as React from "react";
// import { cookies } from "next/headers";
import Cookies from "js-cookie";

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
import Link from "next/link";
import { DatePickerWithRange } from "./date-picker-with-range";
import { set } from "date-fns";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	firstDate: Date;
	lastDate: Date;
}

function getDropDownValues<T>(data: T[], selector: string) {
	const uniqueArray = [
		...new Set(
			data.map((item: any) => {
				return selector === "lead_owner_name"
					? item["lead_owner"].name
					: item[selector];
			}),
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
export function DataTable<TData, TValue>({
	columns,
	data,
	firstDate,
	lastDate,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [columnOrder, setColumnOrder] = React.useState<string[]>(
		columns.map((c) => c.id!),
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

	React.useEffect(() => {
		async function fetchCookie() {
			const cookieValue = Cookies.get("columnOrder");
			console.log(typeof cookieValue, "hello");

			const ans = await fetch("http://localhost:3000/api/cookies", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					columnOrder: columnOrder,
					columnVisibility: columnVisibility,
				}),
			});
			const data = await ans.json();
			window.localStorage.setItem("UserCookies", data.body);
		}
		fetchCookie();
	}, [columnOrder, columnVisibility]);

	React.useEffect(() => {
		const cookieColOrder = Cookies.get("columnOrder");
		const cookieColVisibility = Cookies.get("columnVisibility");

		if (cookieColOrder) {
			setColumnOrder(JSON.parse(cookieColOrder));
			setColumnVisibility(JSON.parse(cookieColVisibility));
		} else {
			setColumnOrder(columns.map((c) => c.id!));
			setColumnVisibility(JSON.parse(cookieColVisibility));
		}
	}, []);

	const currentColOrder = React.useRef<any>();
	return (
		<Tabs defaultValue="all">
			<TabsContent value="all">
				<Card>
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
								<DatePickerWithRange
									firstDate={firstDate}
									lastDate={lastDate}
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

								<Button
									variant="outline"
									size="sm"
									className="h-8  p-2"
									onClick={() => table.resetColumnFilters()}>
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
														}>
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
										key={headerGroup.id}>
										<Droppable droppableId="droppable" direction="horizontal">
											{(provided) => (
												<TableRow
													key={headerGroup.id}
													ref={provided.innerRef}
													{...provided.droppableProps}>
													{headerGroup.headers.map((header) => {
														return (
															<Draggable
																key={header.id}
																draggableId={header.id}
																index={header.index}>
																{(provided) => (
																	<TableHead
																		key={header.id}
																		className="md:table-cell text-center"
																		ref={provided.innerRef}
																		{...provided.dragHandleProps}
																		{...provided.draggableProps}
																		style={{
																			...getStyleHorizontalLock(
																				provided.draggableProps.style,
																			),
																		}}>
																		{header.isPlaceholder ||
																		header.id === "image"
																			? null
																			: flexRender(
																					header.column.columnDef.header,
																					header.getContext(),
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
											data-state={row.getIsSelected() && "selected"}>
											{row.getVisibleCells().map((cell) => {
												return (
													<TableCell key={cell.id} className="text-center">
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
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
											className="h-24 text-center">
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

	function handleDragEnd(event) {
		const active = event.source.index;
		const over = event.destination?.index;

		console.log(active, over);

		if (active !== over && over !== undefined) {
			setColumnOrder((items) => {
				const b = [...items];
				const c = b[active];
				b[active] = b[over];
				b[over] = c;
				console.log(b);
				return b;
			});
		}
	}
}
