import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PropertyNotSupportedDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PropertyNotSupportedDialog({ 
  open, 
  onClose 
}: PropertyNotSupportedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Property Type Not Supported</DialogTitle>
          <DialogDescription className="py-4">
            We apologize, but our agent network is not currently able to assist with land, commercial, 
            or other specialty property types at this time. We're focused on residential properties 
            to ensure we provide you with the best service possible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Return to Property Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}