interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-neutral-darker">Progress</span>
        <span className="text-sm font-medium text-primary">
          Step <span>{currentStep}</span> of <span>{totalSteps}</span>
        </span>
      </div>
      <div className="w-full bg-neutral-medium rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
