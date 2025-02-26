import { saveTask } from "@/lib/helper";
import { formatDate } from "@/lib/utils";
import { TaskPriority, TaskStatus } from "@/types/enum";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

export const useTaskTable = () => {
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

  const handleTaskDetailUpdate = (task: Task) => {
    const updatedTaskData = taskData.map((data) =>
      data.id === task.id ? task : data
    );

    setTaskData(updatedTaskData);
    saveTask(updatedTaskData);
  };

  const handleFilter = (value: string) => {
    setSelectedFilter(() => (value === "all" ? undefined : value));
    if (value === "all") {
      setColumnFilters([]);
    } else if (Object.values(TaskPriority).includes(value as TaskPriority)) {
      setColumnFilters([
        {
          id: "priority",
          value: value,
        },
      ]);
    } else if (Object.values(TaskStatus).includes(value as TaskStatus)) {
      setColumnFilters([
        {
          id: "status",
          value: value,
        },
      ]);
    }
  };

  const priorityOrder = {
    low: 1,
    medium: 2,
    high: 3,
  };

  const columns: ColumnDef<Task>[] = [
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

  return {
    columns,
    selectedFilter,
    setSelectedFilter,
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
    setTaskDetail,
    handleDeleteTask,
    handleEditTask,
    handleOpenTaskdetailsModal,
    handleTaskDetailUpdate,
    handleFilter
  };
};
