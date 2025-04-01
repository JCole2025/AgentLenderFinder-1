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
    <div className="form-step rounded-lg overflow-hidden bg-white shadow">
      <div className="p-8 border-b border-neutral-100">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-600 max-w-3xl">{subtitle}</p>}
      </div>
      
      <div className="p-8">
        {children}
      </div>
      
      <div className="p-6 bg-gray-50 flex justify-between">
        {showPrevious ? (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="text-gray-700 hover:bg-gray-100 border-gray-300"
            size="lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </Button>
        ) : (
          <div></div> // Empty div to maintain flex spacing
        )}
        
        {showNext && (
          <Button 
            disabled={!isValid}
            onClick={onNext}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {nextLabel}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        )}
        
        {showSubmit && (
          <Button 
            disabled={!isValid}
            onClick={onNext}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {nextLabel}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
