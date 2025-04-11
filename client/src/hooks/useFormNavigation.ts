import { AgentFormData, AgentTransactionType } from '@/types/finder';

/**
 * Step configuration for the form flow
 */
export enum FormStep {
  TRANSACTION_TYPE = 1,
  PROPERTY_TYPE = 2,
  OWNER_OCCUPIED = 3,
  LOCATION_PRICE = 4,
  PROPERTY_ADDRESS = 5,
  TIMELINE = 5, // Same as property address (different path)
  INVESTMENT_STRATEGY = 6,
  CONTACT_INFO = 7
}

/**
 * Maximum number of steps in the form
 */
export const MAX_FORM_STEPS = 7;

/**
 * Options for navigation actions
 */
interface NavigationOptions {
  currentStep: number;
  formData: AgentFormData;
  setStep: (step: number) => void;
}

/**
 * Options for transaction type changes
 */
interface TransactionChangeOptions {
  newType: AgentTransactionType;
  formData: AgentFormData;
  updateFormData: (data: Partial<AgentFormData>) => void;
  setStep: (step: number) => void;
}

/**
 * Form navigation hook that provides functions for step navigation
 * Handles conditional logic for different transaction types
 */
export function useFormNavigation() {
  /**
   * Determine the next step based on current step and form data
   */
  const getNextStep = (currentStep: number, formData: AgentFormData): number => {
    if (formData.transaction_type === 'sell') {
      // Define explicit mapping for sell path steps
      switch (currentStep) {
        case FormStep.TRANSACTION_TYPE:
          return FormStep.LOCATION_PRICE;
        case FormStep.LOCATION_PRICE:
          return FormStep.PROPERTY_ADDRESS;
        case FormStep.PROPERTY_ADDRESS:
          return FormStep.CONTACT_INFO;
        case FormStep.CONTACT_INFO:
          return FormStep.CONTACT_INFO; // Stay on contact step
        default:
          return Math.min(currentStep + 1, MAX_FORM_STEPS);
      }
    }
    
    return Math.min(currentStep + 1, MAX_FORM_STEPS);
  };
  
  /**
   * Determine the previous step based on current step and form data
   */
  const getPreviousStep = (currentStep: number, formData: AgentFormData): number => {
    // Default previous step (decrement by 1)
    let prevStep = currentStep - 1;
    
    if (formData.transaction_type === 'sell') {
      // Sell transaction flow has special skip logic for going back
      switch (currentStep) {
        case FormStep.CONTACT_INFO:
          // Skip timeline and investment strategy
          return FormStep.PROPERTY_ADDRESS;
        case FormStep.PROPERTY_ADDRESS:
          // Go back to location/price
          return FormStep.LOCATION_PRICE;
        case FormStep.LOCATION_PRICE:
          // Skip property type and owner occupied
          return FormStep.TRANSACTION_TYPE;
        default:
          break;
      }
    }
    
    // Ensure we don't go below step 1
    return Math.max(prevStep, 1);
  };

  /**
   * Move to the next step with proper flow logic
   */
  const goToNextStep = ({ currentStep, formData, setStep }: NavigationOptions): void => {
    if (currentStep < MAX_FORM_STEPS) {
      const nextStep = getNextStep(currentStep, formData);
      setStep(nextStep);
    }
  };

  /**
   * Move to the previous step with proper flow logic
   */
  const goToPreviousStep = ({ currentStep, formData, setStep }: NavigationOptions): void => {
    if (currentStep > 1) {
      const prevStep = getPreviousStep(currentStep, formData);
      setStep(prevStep);
    }
  };

  /**
   * Jump directly to a specific step skipping all intermediate steps
   */
  const jumpToStep = (stepNumber: number, setStep: (step: number) => void): void => {
    setStep(Math.min(Math.max(1, stepNumber), MAX_FORM_STEPS));
  };

  /**
   * Handle transaction type changes with appropriate navigation
   */
  const handleTransactionTypeChange = ({ 
    newType, 
    formData, 
    updateFormData, 
    setStep 
  }: TransactionChangeOptions): void => {
    console.log('Transaction type changed to:', newType);
    
    // For sell transaction, set up a special flow
    if (newType === 'sell') {
      console.log('Sell transaction type selected, will follow specialized sell flow');
      
      // Update form data before navigation with basic fields for validation
      updateFormData({
        transaction_type: newType,
        timeline: "asap",
        purchase_timeline: "asap",
        // For sell path, we don't need owner_occupied, but set a default to avoid validation issues
        owner_occupied: false,
        // Default values for required fields that will be overridden by user
        property_type: "single_family", // Default to something valid
        strategy: ["not_sure"] // Default selection
      });
      
      // For sell transactions, go to location and price step first
      console.log('Setting step to LOCATION_PRICE (step 4)');
      setStep(FormStep.LOCATION_PRICE);
      
    } else {
      // For buy transaction, just update the form data and let normal flow continue
      console.log('Buy transaction type selected, continuing normal flow');
      updateFormData({
        transaction_type: newType,
        timeline: "asap",
        purchase_timeline: "asap"
      });
    }
  };
  
  /**
   * Advance multiple steps at once - This is not used directly anymore
   * We now use the skipSteps function in FinderForm.tsx which has better handling
   */
  const advanceMultipleSteps = (stepsCount: number): ((setStep: (step: number) => void, currentStep: number) => void) => {
    return (setStep, currentStep) => {
      // Calculate target step
      console.log(`[LEGACY] Advancing ${stepsCount} steps from ${currentStep}`);
      const targetStep = Math.min(currentStep + stepsCount, MAX_FORM_STEPS);
      console.log(`[LEGACY] Target step: ${targetStep}`);
      
      // Set the step directly
      setStep(targetStep);
    };
  };

  return {
    getNextStep,
    getPreviousStep,
    goToNextStep,
    goToPreviousStep,
    jumpToStep,
    handleTransactionTypeChange,
    advanceMultipleSteps
  };
}