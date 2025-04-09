
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface FloatingActionButtonProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  maxSteps: number;
}

export default function FloatingActionButton({
  onNext,
  onPrevious,
  currentStep,
  maxSteps
}: FloatingActionButtonProps) {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {currentStep > 1 && (
        <Button
          onClick={onPrevious}
          className="rounded-full w-12 h-12 bg-gray-700"
          aria-label="Previous step"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
      )}
      {currentStep < maxSteps && (
        <Button
          onClick={onNext}
          className="rounded-full w-12 h-12 bg-blue-600"
          aria-label="Next step"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
