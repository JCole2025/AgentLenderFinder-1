import { useFinderForm } from "@/hooks/useFinderForm";
import { FinderFormProps } from "@/types/finder";
import AgentFinderSteps from "./AgentFinderSteps";
import LenderFinderSteps from "./LenderFinderSteps";

export default function FinderForm({ 
  finderType, 
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
  } = useFinderForm(finderType);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
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
      {finderType === 'agent' ? (
        <AgentFinderSteps
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          errors={errors}
          isValid={isValid}
        />
      ) : (
        <LenderFinderSteps
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          errors={errors}
          isValid={isValid}
        />
      )}
    </div>
  );
}
