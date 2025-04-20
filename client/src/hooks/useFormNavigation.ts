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
    if (!formData) return currentStep;

    if (formData.transaction_type === 'sell') {
      // Sell path: A -> B2 -> D2 -> H2
      switch (currentStep) {
        case FormStep.TRANSACTION_TYPE: // Step 1 (A)
          return FormStep.PROPERTY_TYPE; // Go to property type (B2)
        case FormStep.PROPERTY_TYPE: // Step 2 (B2)
          return FormStep.LOCATION_PRICE; // Go to location/price (D2)
        case FormStep.LOCATION_PRICE: // Step 3 (D2)
          return FormStep.CONTACT_INFO; // Go to contact info (H2)
        case FormStep.CONTACT_INFO: // Step 4 (H2)
          return FormStep.CONTACT_INFO; // Stay on last step
        default:
          return FormStep.PROPERTY_TYPE; // Default to property type if unknown
      }
    } else {
      // Buy path has 7 steps
      switch (currentStep) {
        case FormStep.TRANSACTION_TYPE: // Step 1
          return FormStep.PROPERTY_TYPE; // Step 2
        case FormStep.PROPERTY_TYPE:
          return FormStep.OWNER_OCCUPIED; // Step 3
        case FormStep.OWNER_OCCUPIED:
          return FormStep.TIMELINE; // Step 4 (moved from 5)
        case FormStep.TIMELINE:
          return FormStep.INVESTMENT_STRATEGY; // Step 5
        case FormStep.INVESTMENT_STRATEGY:
          return FormStep.LOCATION_PRICE; // Step 6 (moved from 4)
        case FormStep.LOCATION_PRICE:
          return FormStep.CONTACT_INFO; // Step 7
        case FormStep.CONTACT_INFO:
          return FormStep.CONTACT_INFO; // Stay on last step
        default:
          return currentStep;
      }
    }
  };
  
  /**
   * Determine the previous step based on current step and form data
   */
  const getPreviousStep = (currentStep: number, formData: AgentFormData): number => {
    if (formData.transaction_type === 'buy') {
      switch (currentStep) {
        case FormStep.CONTACT_INFO:
          return FormStep.LOCATION_PRICE;
        case FormStep.LOCATION_PRICE:
          return FormStep.INVESTMENT_STRATEGY;
        case FormStep.INVESTMENT_STRATEGY:
          return FormStep.TIMELINE;
        case FormStep.TIMELINE:
          return FormStep.OWNER_OCCUPIED;
        case FormStep.OWNER_OCCUPIED:
          return FormStep.PROPERTY_TYPE;
        case FormStep.PROPERTY_TYPE:
          return FormStep.TRANSACTION_TYPE;
        default:
          return Math.max(currentStep - 1, 1);
      }
    }
    
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
        strategy: ["not_sure"], // Default selection
        // Clear any existing property address to force user input
        property_address: ""
      });
      
      // For sell transactions, go to property type step first
      console.log('Setting step to PROPERTY_TYPE (step 2) for sell flow');
      setStep(FormStep.PROPERTY_TYPE);
      
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