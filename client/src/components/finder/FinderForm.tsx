import { useFinderForm } from "@/hooks/useFinderForm";
import { FinderFormProps } from "@/types/finder";
import AgentFinderSteps from "./AgentFinderSteps";

export default function FinderForm({ 
  currentStep, 
  setCurrentStep, 
  onSuccess 
}: FinderFormProps) {
  const {
    formData,
    updateFormData,
    errors,
    isValid,
    resetForm,
    submitForm
  } = useFinderForm();

  const handleNext = () => {
    // The form has 7 steps - some conditional based on transaction type
    const maxSteps = 7; // Total steps for the form
    
    console.log('FinderForm - handleNext called');
    console.log('FinderForm - Current step:', currentStep);
    console.log('FinderForm - Max steps:', maxSteps);
    
    if (currentStep < maxSteps) {
      console.log('FinderForm - Advancing to next step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log('FinderForm - Already at max step, not advancing');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <AgentFinderSteps
        currentStep={currentStep}
        formData={formData as any} // Use type assertion to avoid TS errors
        updateFormData={updateFormData}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        errors={errors}
        isValid={isValid}
      />
    </div>
  );
}
