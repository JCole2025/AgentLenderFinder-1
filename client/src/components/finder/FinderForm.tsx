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
    console.log('FinderForm - handleSubmit called');

    try {
      console.log('FinderForm - Calling submitForm');
      const success = await submitForm();
      console.log('FinderForm - submitForm result:', success);

      if (success) {
        console.log('FinderForm - Calling onSuccess to display success message');
        onSuccess();
      } else {
        console.error('FinderForm - Form submission was not successful');
      }
    } catch (error) {
      console.error('FinderForm - Error during form submission:', error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mx-auto max-w-[95%] md:max-w-3xl">
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
    </>
  );
}