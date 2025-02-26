import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

const Taskdetails = ({
  openDetailsDialog,
  setOpenDetailsDialog,
  task,
}: DetailsDialogProps) => {
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
            <h3 className="text-base font-medium italic capitalize">
              {task.title}
            </h3>
          </section>
          <section>
            <p className="text-sm font-bold">Description</p>
            <h3 className="text-base font-medium italic capitalize">
              {task.description}
            </h3>
          </section>
          <section>
            <p className="text-sm font-bold">Due date</p>
            <h3 className="text-base font-medium italic capitalize">
              {formatDate(task.due_date)}
            </h3>
          </section>
          <section>
            <p className="text-sm font-bold">Priority</p>
            <h3 className="text-base font-medium italic capitalize">
              {task.priority}
            </h3>
          </section>
          <section>
            <p className="text-sm font-bold">Status</p>
            <h3 className="text-base font-medium italic capitalize">
              {task.status}
            </h3>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default Taskdetails;
