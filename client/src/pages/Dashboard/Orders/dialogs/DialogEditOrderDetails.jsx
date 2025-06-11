import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DialogEditOrderDetails = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Order</DialogTitle>
      </DialogHeader>
      <p>Form to edit the order will go here.</p>
      <input type="checkbox" />
      <button>Submit</button>
    </DialogContent>
  );
};

export default DialogEditOrderDetails;
