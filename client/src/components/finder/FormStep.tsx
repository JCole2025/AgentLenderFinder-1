import { Button } from "@/components/ui/button";
import { FormStepProps } from "@/types/finder";

interface Props extends FormStepProps {
  title: string;
  subtitle?: string;
  showNext?: boolean;
  showPrevious?: boolean;
  showSubmit?: boolean;
  nextLabel?: string;
  children: React.ReactNode;
}

export default function FormStep({
  isActive,
  title,
  subtitle,
  children,
  onNext,
  onPrevious,
  showNext = true,
  showPrevious = true,
  showSubmit = false,
  nextLabel = "Next",
  isValid
}: Props) {
  if (!isActive) return null;

  return (
    <div className="form-step">
      <div className="p-6 border-b border-neutral-medium">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        {subtitle && <p className="text-neutral-dark">{subtitle}</p>}
      </div>
      
      <div className="p-6">
        {children}
      </div>
      
      <div className="p-6 bg-neutral-light flex justify-between">
        {showPrevious ? (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="text-neutral-darker hover:bg-neutral-medium"
          >
            Back
          </Button>
        ) : (
          <div></div> // Empty div to maintain flex spacing
        )}
        
        {showNext && (
          <Button 
            disabled={!isValid}
            onClick={onNext}
          >
            {nextLabel}
          </Button>
        )}
        
        {showSubmit && (
          <Button 
            disabled={!isValid}
            onClick={onNext}
            className="bg-accent text-white hover:bg-accent/90"
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
