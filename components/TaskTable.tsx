"use client";

import Spinner from "@/components/Spinner";
import Taskdetails from "@/components/Taskdetails";
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
import { useTaskTable } from "@/hooks/useTaskTable";
import { getAllTasks } from "@/lib/helper";
import { TaskPriority, TaskStatus } from "@/types/enum";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useEffect } from "react";

const TaskTable = () => {
  const {
    columns,
    selectedFilter,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    taskData,
    setTaskData,
    taskId,
    setTaskId,
    loading,
    setLoading,
    openDialog,
    setOpenDialog,
    openDetailsDialog,
    setOpenDetailsDialog,
    taskDetail,
    handleDeleteTask,
    handleEditTask,
    handleOpenTaskdetailsModal,
    handleTaskDetailUpdate,
    handleFilter,
  } = useTaskTable();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tasks = getAllTasks();

      setTaskData(tasks);
      setLoading(false);
    }
  }, [setLoading, setTaskData]);

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
      {/* // Add Task form modal */}
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
              onValueChange={(value: string) => handleFilter(value)}
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

          {/* //////   Task details modal   //////  */}
          {taskDetail && (
            <Taskdetails
              openDetailsDialog={openDetailsDialog}
              setOpenDetailsDialog={setOpenDetailsDialog}
              task={taskDetail!}
              handleTaskDetailUpdate={handleTaskDetailUpdate}
            />
          )}
        </>
      )}
    </section>
  );
};

export default TaskTable;
