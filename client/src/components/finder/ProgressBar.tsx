import { FinderType } from "@/types/finder";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  finderType?: FinderType;
}

// Define the steps for agent finder
const agentSteps = [
  { name: "Interest", completed: true },
  { name: "Property", completed: false },
  { name: "Timeline", completed: false },
  { name: "Price", completed: false },
  { name: "Loan", completed: false },
  { name: "Experience", completed: false },
  { name: "Contact", completed: false }
];

// Define the steps for lender finder
const lenderSteps = [
  { name: "Purpose", completed: true },
  { name: "Property", completed: false },
  { name: "Location", completed: false },
  { name: "Credit", completed: false },
  { name: "Contact", completed: false }
];

export default function ProgressBar({ currentStep, totalSteps, finderType = "agent" }: ProgressBarProps) {
  // Use the appropriate steps based on finderType
  const steps = finderType === "agent" ? agentSteps : lenderSteps;
  
  // Mark steps as completed based on current step
  const updatedSteps = steps.map((step, index) => ({
    ...step,
    completed: index < currentStep - 1,
    active: index === currentStep - 1
  }));
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {updatedSteps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step.completed ? 'bg-blue-500 text-white' : 
              step.active ? 'bg-blue-500 text-white' : 
              'bg-gray-200 text-gray-500'
            }`}>
              {step.completed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`mt-2 text-xs font-medium ${
              step.completed || step.active ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
      
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="h-0.5 w-full bg-gray-200"></div>
        </div>
        <div className="relative flex justify-between">
          {updatedSteps.map((step, index) => (
            <div 
              key={index}
              className={`h-0.5 ${
                step.completed ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              style={{ 
                width: index === updatedSteps.length - 1 ? '0' : `${100 / (updatedSteps.length - 1)}%` 
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
