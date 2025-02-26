import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { TaskPriority, TaskStatus } from "@/types/enum";
import { Edit } from "lucide-react";
import { useState } from "react";

const Taskdetails = ({
  openDetailsDialog,
  setOpenDetailsDialog,
  task,
  handleTaskDetailUpdate,
}: DetailsDialogProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [priority, setPriority] = useState<TaskPriority>();
  const [status, setStatus] = useState<TaskStatus>();

  const handleUpdateTask = () => {
    const newTask = {
      ...task,
      ...(priority && { priority }),
      ...(status && { status }),
    };

    handleTaskDetailUpdate(newTask);

    setOpenDetailsDialog(false);
  };

  return (
    <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
      <DialogContent className="max-w-[450px] bg-color_1 max-h-[calc(100vh-1rem)]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <hr className="border-0 h-[1px] bg-color_5" />
        <section className="space-y-3 overflow-y-auto remove-scrollbar max-h-[500px]">
          <section>
            <p className="text-sm font-bold">Title</p>
            <h3 className="italic capitalize">{task.title}</h3>
          </section>
          <section>
            <p className="text-sm font-bold">Description</p>
            <h3 className="italic capitalize">{task.description}</h3>
          </section>
          <section>
            <p className="text-sm font-bold">Due date</p>
            <h3 className="italic capitalize">{formatDate(task.due_date)}</h3>
          </section>
          <section className="space-y-2">
            <p className="text-sm font-bold flex items-center gap-2">
              Priority{" "}
              <Edit
                size={18}
                className="cursor-pointer"
                onClick={() => setEdit(true)}
              />
            </p>

            {edit ? (
              <Select
                onValueChange={(value) => setPriority(value as TaskPriority)}
                defaultValue={task.priority}
              >
                <SelectTrigger className="border-color_5 text-color_5 placeholder:text-color_7 placeholder:italic capitalize">
                  <SelectValue placeholder={task.priority} />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 dropdown-selector">
                  {Object.values(TaskPriority).map((stat) => (
                    <SelectItem value={stat} key={stat} className="capitalize">
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <h3 className="italic capitalize">{task.priority}</h3>
            )}
          </section>

          <section className="space-y-2">
            <p className="text-sm font-bold  flex items-center gap-2">
              Status{" "}
              <Edit
                size={18}
                className="cursor-pointer"
                onClick={() => setEdit(true)}
              />
            </p>
            {edit ? (
              <Select
                onValueChange={(value) => setStatus(value as TaskStatus)}
                defaultValue={task.status}
              >
                <SelectTrigger className="border-color_5 text-color_5 placeholder:text-color_7 placeholder:italic capitalize">
                  <SelectValue placeholder={task.status} />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 dropdown-selector">
                  {Object.values(TaskStatus).map((stat) => (
                    <SelectItem value={stat} key={stat} className="capitalize">
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <h3 className="italic capitalize">{task.status}</h3>
            )}
          </section>

          {edit && (
            <section className="flex items-center justify-center gap-3">
              <Button
                onClick={() => setEdit(false)}
                className="border border-color_5 text-color_5 capitalize"
              >
                Cancel
              </Button>
              <Button
                className="border border-color_5 text-color_5 capitalize"
                onClick={handleUpdateTask}
              >
                Update
              </Button>
            </section>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default Taskdetails;
