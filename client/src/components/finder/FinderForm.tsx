import { useFinderForm } from "@/hooks/useFinderForm";
import { useFormNavigation } from "@/hooks/useFormNavigation";
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

  // Use our navigation hook for all navigation logic
  const {
    findNextValidStep,
    findPrevValidStep,
  } = useFormNavigation();

  const handleNext = () => {
    // The form has 7 steps - some conditional based on transaction type
    const maxSteps = 7; // Total steps for the form

    console.log('FinderForm - handleNext called');
    console.log('FinderForm - Current step:', currentStep);
    console.log('FinderForm - Max steps:', maxSteps);

    if (currentStep < maxSteps) {
      // Find the next valid step based on the form data
      const nextStep = findNextValidStep(currentStep, formData);
      console.log('FinderForm - Advancing to next valid step:', nextStep);
      setCurrentStep(nextStep);
    } else {
      console.log('FinderForm - Already at max step, not advancing');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Find the previous valid step based on the form data
      const prevStep = findPrevValidStep(currentStep, formData);
      console.log('FinderForm - Going back to previous valid step:', prevStep);
      setCurrentStep(prevStep);
    }
  };

  // Method to advance multiple steps (used for sell flow)
  const advanceMultipleSteps = (stepsCount: number) => {
    for (let i = 0; i < stepsCount; i++) {
      setTimeout(() => handleNext(), i * 50);
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
          advanceMultipleSteps={advanceMultipleSteps}
          errors={errors}
          isValid={isValid}
        />
      </div>
    </>
  );
}