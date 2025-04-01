import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  onStartOver: () => void;
}

export default function SuccessMessage({ onStartOver }: SuccessMessageProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="mb-4 flex justify-center">
        <CheckCircle className="h-16 w-16 text-accent" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
      <p className="text-neutral-dark mb-6">
        Your information has been submitted successfully. Qualified professionals will contact you soon.
      </p>
      <div>
        <Button onClick={onStartOver}>
          Start Over
        </Button>
      </div>
    </div>
  );
}
