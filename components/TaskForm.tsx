import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveTask } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { TaskPriority, TaskStatus } from "@/types/enum";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const TaskForm = ({
  taskId,
  setTaskId,
  taskData,
  setTaskData,
  openDialog,
  setOpenDialog,
}: TaskFormProps) => {
  const [formError, setFormError] = useState<boolean>(false);
  // 1. Define your form.
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      due_date: "",
      priority: "",
      status: "",
    },
  });

  // 2. Submit handler.
  interface FormValues {
    title: string;
    description: string;
    due_date: string;
    priority: string;
    status: string;
  }

  function onSubmit(values: FormValues): void {
    setFormError(false);
    const { title, description, due_date, priority, status } = values;

    if (!title || !description || !due_date || !priority || !status) {
      setFormError(true);
      return;
    }

    const id = taskId ? taskId : crypto.randomUUID();
    const task = {
      id,
      title,
      description,
      due_date,
      priority: priority as TaskPriority,
      status: status as TaskStatus,
    };

    const newTasks = taskId
      ? taskData.map((oldTask) => (oldTask.id === taskId ? task : oldTask))
      : [...taskData, task];

    saveTask(newTasks);
    setTaskData(newTasks);
    setOpenDialog(false);
  }

  // 3.
  // Get task data when editing
  const task = taskData.find((task) => task.id === taskId);

  useEffect(() => {
    if (taskId && task) {
      form.reset({
        title: task.title ?? "",
        description: task.description ?? "",
        due_date: task.due_date ?? "",
        priority: task.priority ?? "",
        status: task.status ?? "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        due_date: "",
        priority: "",
        status: "",
      });
    }
  }, [taskId, taskData, form, task]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-color_5"
          onClick={() => setTaskId(undefined)}
        >
          Add Task <Plus />{" "}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[450px] bg-color_1 max-h-[calc(100vh-1rem)]">
        <DialogHeader>
          <DialogTitle>{`${taskId ? "Edit" : "Add"} Task`}</DialogTitle>
        </DialogHeader>

        <section className="py-4 overflow-y-auto remove-scrollbar max-h-[500px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {formError && (
                <small className="text-red-500 text-base">
                  Incomplete form field(s)...
                </small>
              )}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        type="text"
                        {...field}
                        className="border-color_5 text-color_5 placeholder:text-color_7 focus:outline-0 active:outline-0 placeholder:italic"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Task description"
                        {...field}
                        className="border-color_5 text-color_5 placeholder:text-color_7 focus:outline-0 active:outline-0 resize-none placeholder:italic"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-color_5 text-color_5",
                              !field.value && "text-muted-foreground"
                            )}
                            {...field}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-color_5 italic">Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white border-0 dropdown-selector"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger className="border-color_5 text-color_5 placeholder:text-color_7 placeholder:italic capitalize">
                          <SelectValue
                            placeholder="Select"
                            className="placeholder:text-color_5 placeholder:italic"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-0 dropdown-selector">
                        {Object.values(TaskPriority).map((stat) => (
                          <SelectItem
                            value={stat}
                            key={stat}
                            className="capitalize"
                          >
                            {stat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger className="border-color_5 text-color_5 placeholder:text-color_7 placeholder:italic capitalize">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-0 dropdown-selector">
                        {Object.values(TaskStatus).map((stat) => (
                          <SelectItem
                            value={stat}
                            key={stat}
                            className="capitalize"
                          >
                            {stat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <section className="flex items-center justify-between mt-4">
                <Button
                  type="reset"
                  onClick={() => {
                    form.reset();
                  }}
                  className="border border-color_5 text-color_5 capitalize"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  className="border border-color_5 text-color_5 capitalize"
                >
                  {`${taskId ? "Edit" : "Add"} Task`}
                </Button>
              </section>
            </form>
          </Form>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
