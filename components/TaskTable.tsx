"use client";

import Spinner from "@/components/Spinner";
import TaskForm from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllTasks, saveTask } from "@/lib/helper";
import { formatDate } from "@/lib/utils";
import { TaskPriority, TaskStatus } from "@/types/enum";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Taskdetails from "@/components/Taskdetails";

const priorityOrder = {
  low: 1,
  medium: 2,
  high: 3,
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "",
    cell: "",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">
        {String(row.getValue("description")).length > 30
          ? `${String(row.getValue("description")).substring(0, 30)} . . .`
          : row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => {
      return (
        <section
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-4 cursor-pointer"
        >
          Due Date
          <ArrowUpDown size={18} />
        </section>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{formatDate(row.getValue("due_date"))}</div>
    ),
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.getValue("due_date"));
      const dateB = new Date(rowB.getValue("due_date"));
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <section
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-4 cursor-pointer"
        >
          Priority
          <ArrowUpDown size={18} />
        </section>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("priority")}</div>
    ),
    sortingFn: (rowA, rowB) => {
      const priorityA =
        priorityOrder[
          rowA.getValue("priority") as keyof typeof priorityOrder
        ] || 0;
      const priorityB =
        priorityOrder[
          rowB.getValue("priority") as keyof typeof priorityOrder
        ] || 0;
      return priorityA === priorityB ? 0 : priorityA > priorityB ? 1 : -1;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
];

const TaskTable = () => {
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [taskData, setTaskData] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [taskDetail, setTaskDetail] = useState<Task>();

  const handleDeleteTask = (id: string) => {
    const newTasks = taskData.filter((task) => task.id !== id);

    setTaskData(newTasks);
    saveTask(newTasks);
  };

  const handleEditTask = (id: string) => {
    const task = taskData.find((task) => task.id === id);

    setTaskId(id);
    setOpenDialog(true);
  };

  const handleOpenTaskdetailsModal = (id: string) => {
    const task = taskData.find((task) => task.id === id);

    setTaskDetail(task);

    setOpenDetailsDialog(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tasks = getAllTasks();

      setTaskData(tasks);
      setLoading(false);
    }
  }, []);

  const table = useReactTable({
    data: taskData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();

      // Get the values of the specific columns to filter
      const title = String(row.getValue("title") ?? "").toLowerCase();
      const description = String(
        row.getValue("description") ?? ""
      ).toLowerCase();

      // Return true if either column includes the search value
      return title.includes(searchValue) || description.includes(searchValue);
    },
  });

  return (
    <section className="px-1 md:px-4 w-full lg:w-[80%] mx-auto">
      <TaskForm
        taskId={taskId}
        setTaskId={setTaskId}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        taskData={taskData}
        setTaskData={setTaskData}
      />

      {loading ? (
        <Spinner />
      ) : taskData.length < 1 ? (
        <h2 className="text-xl font-medium text-center my-4">
          No tasks recorded yet. Kindly create a new task.
        </h2>
      ) : (
        <>
          <section className="flex items-center justify-between py-4 space-x-2">
            <Input
              placeholder="Search task..."
              value={(table.getState().globalFilter as string) ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="max-w-sm text-color_5 bg-transparent placeholder:text-color_5 border-color_5 outline-0"
            />

            <Select
              value={selectedFilter}
              onValueChange={(value: string) => {
                setSelectedFilter(() => (value === "all" ? undefined : value));
                if (value === "all") {
                  setColumnFilters([]);
                } else if (
                  Object.values(TaskPriority).includes(value as TaskPriority)
                ) {
                  setColumnFilters([
                    {
                      id: "priority",
                      value: value,
                    },
                  ]);
                } else if (
                  Object.values(TaskStatus).includes(value as TaskStatus)
                ) {
                  setColumnFilters([
                    {
                      id: "status",
                      value: value,
                    },
                  ]);
                }
              }}
            >
              <SelectTrigger className="ml-auto w-fit border border-color_5 text-color_5 capitalize">
                <SelectValue placeholder="Filter" className="text-color_5" />
              </SelectTrigger>
              <SelectContent className="bg-color_9" align="end">
                <SelectGroup>
                  <SelectItem
                    value="all"
                    className={`capitalize cursor-pointer hover:bg-color_2 ${
                      selectedFilter === "all" ? "bg-color_2" : ""
                    }`}
                  >
                    all
                  </SelectItem>
                  <SelectLabel>By Priority</SelectLabel>

                  {Object.values(TaskPriority).map((priority) => (
                    <SelectItem
                      value={priority}
                      key={priority}
                      className={`capitalize cursor-pointer hover:bg-color_2 ${
                        selectedFilter === priority ? "bg-color_2" : ""
                      }`}
                    >
                      {priority}
                    </SelectItem>
                  ))}
                  <SelectLabel>By Status</SelectLabel>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem
                      value={status}
                      key={status}
                      className={`capitalize cursor-pointer hover:bg-color_2 ${
                        selectedFilter === status ? "bg-color_2" : ""
                      }`}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </section>

          <section className="rounded-md border border-color_5">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
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
                      className="border-color_5 cursor-pointer hover:bg-color_8"
                      onClick={() => {
                        handleOpenTaskdetailsModal(row.getValue("id"));
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}

                      <section className="flex items-center gap-4 w-fit pt-2">
                        <Edit
                          size={18}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(row.getValue("id"));
                          }}
                        />

                        <Trash2
                          size={18}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(row.getValue("id"));
                          }}
                        />
                      </section>
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
          </section>

          <section className="flex items-center justify-end space-x-2 py-4">
            <section className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border border-color_5 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <section>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </section>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border border-color_5 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </section>
          </section>

          {taskDetail && (
            <Taskdetails
              openDetailsDialog={openDetailsDialog}
              setOpenDetailsDialog={setOpenDetailsDialog}
              task={taskDetail!}
            />
          )}
        </>
      )}
    </section>
  );
};

export default TaskTable;
