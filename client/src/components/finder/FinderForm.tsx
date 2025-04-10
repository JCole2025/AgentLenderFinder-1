import { useFinderForm } from "@/hooks/useFinderForm";
import { useFormNavigation, MAX_FORM_STEPS, FormStep } from "@/hooks/useFormNavigation";
import { FinderFormProps } from "@/types/finder";
import AgentFinderSteps from "./AgentFinderSteps";

/**
 * Main form container component that manages form state and navigation
 * Uses useFinderForm for form data and validation
 * Uses useFormNavigation for form flow control
 */
export default function FinderForm({ 
  currentStep, 
  setCurrentStep, 
  onSuccess 
}: FinderFormProps) {
  // Form data and validation
  const {
    formData,
    updateFormData,
    errors,
    isValid,
    resetForm,
    submitForm
  } = useFinderForm();

  // Navigation control
  const {
    goToNextStep,
    goToPreviousStep,
    advanceMultipleSteps,
    handleTransactionTypeChange
  } = useFormNavigation();

  /**
   * Handle advancing to the next step with proper navigation logic
   */
  const handleNext = () => {
    console.log('FinderForm - Next step from current step:', currentStep);
    
    goToNextStep({
      currentStep,
      formData,
      setStep: setCurrentStep
    });
  };

  /**
   * Handle going back to the previous step with proper navigation logic
   */
  const handlePrevious = () => {
    console.log('FinderForm - Previous step from current step:', currentStep);
    
    goToPreviousStep({
      currentStep,
      formData,
      setStep: setCurrentStep
    });
  };

  /**
   * Handle transaction type selection with special navigation for sell flow
   */
  const handleTypeChange = (value: string) => {
    handleTransactionTypeChange({
      newType: value as any,
      formData,
      updateFormData,
      setStep: setCurrentStep
    });
  };

  /**
   * Skip multiple steps at once - useful for complex navigation flows
   */
  const skipSteps = (stepsCount: number) => {
    console.log(`FinderForm - Skipping ${stepsCount} steps from step ${currentStep}`);
    // Use fixed step number - go directly to contact page for sell transactions
    if (formData.transaction_type === 'sell') {
      console.log('FinderForm - Sell flow detected, going directly to contact page (step 7)');
      setCurrentStep(FormStep.CONTACT_INFO);
    } else {
      // Normal step advancement for buy flow
      const targetStep = Math.min(currentStep + stepsCount, MAX_FORM_STEPS);
      console.log(`FinderForm - Target step: ${targetStep}`);
      setCurrentStep(targetStep);
    }
  };

  /**
   * Handle form submission with success/error handling
   */
  const handleSubmit = async () => {
    console.log('FinderForm - Submitting form data');

    try {
      const success = await submitForm();
      
      if (success) {
        console.log('FinderForm - Submission successful');
        onSuccess();
      } else {
        console.error('FinderForm - Submission failed');
      }
    } catch (error) {
      console.error('FinderForm - Error during form submission:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mx-auto max-w-[95%] md:max-w-3xl">
      <AgentFinderSteps
        currentStep={currentStep}
        formData={formData}
        updateFormData={updateFormData}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        advanceMultipleSteps={skipSteps}
        onTransactionTypeChange={handleTypeChange}
        errors={errors}
        isValid={isValid}
      />
    </div>
  );
}