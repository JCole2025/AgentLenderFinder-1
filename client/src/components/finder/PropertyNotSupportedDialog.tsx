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
            We're sorry, our agents cannot help with this property type at the moment. 
            Please select a different property type or check back later.
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