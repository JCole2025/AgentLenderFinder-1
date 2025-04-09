import { useFinderForm } from "@/hooks/useFinderForm";
import { FinderFormProps } from "@/types/finder";
import AgentFinderSteps from "./AgentFinderSteps";
import { useEffect } from "react";

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

  // Listen for the custom event to directly set the step (especially for sell flow)
  useEffect(() => {
    // Event handler for directly setting step
    const handleSetStep = (event: any) => {
      console.log('FinderForm - Received setStep event:', event.detail);
      setCurrentStep(event.detail.step);
    };

    // Add event listener
    window.addEventListener('agentFinder:setStep', handleSetStep);

    // Clean up
    return () => {
      window.removeEventListener('agentFinder:setStep', handleSetStep);
    };
  }, [setCurrentStep]);

  // Helper function to find the next valid step based on form state
  const findNextValidStep = (currentStep: number, formData: any) => {
    const maxSteps = 7;
    let nextStep = currentStep + 1;

    // Skip logic based on transaction type
    if (formData.transaction_type === 'sell') {
      // For sell flow:
      // Step 1 -> Step 5 (Property Address)
      // Step 5 -> Step 7 (Contact Info)
      if (currentStep === 1) {
        return 5;
      } else if (currentStep === 5) {
        return 7;
      }
      // Stay on current step if at step 7
      return currentStep;
    }
    // For buy flow, proceed normally
    return nextStep;
  };

  // Helper function to find the previous valid step based on form state
  const findPrevValidStep = (currentStep: number, formData: any) => {
    let prevStep = currentStep - 1;

    // Skip logic based on transaction type
    if (formData.transaction_type === 'sell') {
      // For sell flow, when going backwards:
      // If at step 7, go to step 5 (skip 6)
      if (currentStep === 7) {
        return 5;
      }

      // If at step 5, go to step 4
      if (currentStep === 5) {
        return 4;
      }

      // If at step 4, go to step 1 (skip 2, 3)
      if (currentStep === 4) {
        return 1;
      }
    }

    // Return the previous step, never go below 1
    return Math.max(prevStep, 1);
  };

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