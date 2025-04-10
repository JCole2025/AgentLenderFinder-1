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
    // Default next step (increment by 1)
    let nextStep = currentStep + 1;
    
    if (formData.transaction_type === 'sell') {
      // Sell transaction flow has special skip logic
      switch (currentStep) {
        case FormStep.TRANSACTION_TYPE:
          // Skip property type and owner occupied
          return FormStep.LOCATION_PRICE;
        case FormStep.LOCATION_PRICE:
          // Go to property address
          return FormStep.PROPERTY_ADDRESS;
        case FormStep.PROPERTY_ADDRESS:
          // Skip timeline and investment strategy
          return FormStep.CONTACT_INFO;
        default:
          break;
      }
    }
    
    // Ensure we don't exceed max steps
    return Math.min(nextStep, MAX_FORM_STEPS);
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
    // Set standard fields for both transaction types
    const updatedFormData: Partial<AgentFormData> = {
      transaction_type: newType,
      timeline: "asap",
      purchase_timeline: "asap"
    };
    
    // Apply the updates
    updateFormData(updatedFormData);
    
    // For sell transaction, jump directly to contact info
    if (newType === 'sell') {
      // Give time for state update to apply
      setTimeout(() => {
        // For sell transactions, we jump directly to the contact form (step 7)
        jumpToStep(FormStep.CONTACT_INFO, setStep);
      }, 50);
    }
    // For buy transactions, normal flow continues
  };
  
  /**
   * Advance multiple steps at once
   */
  const advanceMultipleSteps = (stepsCount: number, setStep: (step: number) => void, currentStep: number): void => {
    // Calculate target step
    const targetStep = Math.min(currentStep + stepsCount, MAX_FORM_STEPS);
    
    // Set the step directly
    setStep(targetStep);
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