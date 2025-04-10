import { AgentFormData } from '@/types/finder';

interface FormNavigationOptions {
  onNext: () => void;
  currentStep: number;
  formData: AgentFormData;
}

export function useFormNavigation() {
  /**
   * Find the next valid step based on the current state of the form
   * This handles conditional step logic, especially for sell vs buy
   */
  const findNextValidStep = (currentStep: number, formData: AgentFormData): number => {
    const maxSteps = 7;
    let nextStep = currentStep + 1;
    
    // Skip logic based on transaction type
    if (formData.transaction_type === 'sell') {
      // For sell flow:
      // Step 1: Transaction Type
      // Step 2: Hidden (Property Type) - Skip
      // Step 3: Hidden (Owner Occupied) - Skip
      // Step 4: Location and Price
      // Step 5: Property Address
      // Step 6: Hidden (Timeline) - Skip
      // Step 7: Contact Info
      
      // If at step 1, go to step 4 (skip 2, 3)
      if (currentStep === 1) {
        return 4;
      }
      
      // If at step 4, go to step 5
      if (currentStep === 4) {
        return 5;
      }
      
      // If at step 5 (property address), go directly to step 7 (contact form) - skip step 6
      if (currentStep === 5) {
        return 7;
      }
    }
    
    // Return the next step, but never exceed max steps
    return Math.min(nextStep, maxSteps);
  };
  
  /**
   * Find the previous valid step based on the current state of the form
   * This handles conditional step navigation, especially for the sell flow
   */
  const findPrevValidStep = (currentStep: number, formData: AgentFormData): number => {
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

  /**
   * Handle direct navigation to contact form for sell path
   * Uses multiple sequential calls with delays to ensure proper state updates
   */
  const navigateToContactForm = (onNext: () => void): void => {
    // Jump directly to contact information step (step 7)
    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      console.log("Jumping directly to contact information (step 7)");
      onNext(); // 1 → 2
      onNext(); // 2 → 3
      onNext(); // 3 → 4
      onNext(); // 4 → 5
      onNext(); // 5 → 6
      onNext(); // 6 → 7 (contact info)
    }, 50);
  };

  /**
   * Creates a handler function for advancing to the next step
   */
  const createNextHandler = ({ onNext, currentStep, formData }: FormNavigationOptions) => {
    return () => {
      const maxSteps = 7; // Total steps for the form
      
      console.log('Navigation - Next handler called');
      console.log('Navigation - Current step:', currentStep);
      console.log('Navigation - Max steps:', maxSteps);

      if (currentStep < maxSteps) {
        // Find the next valid step based on the form data
        const nextStep = findNextValidStep(currentStep, formData);
        console.log('Navigation - Advancing to next valid step:', nextStep);
        // Use onNext multiple times to advance to the correct step
        const stepsToAdvance = nextStep - currentStep;
        
        for (let i = 0; i < stepsToAdvance; i++) {
          setTimeout(() => {
            onNext();
          }, i * 50); // Small delay between steps
        }
      } else {
        console.log('Navigation - Already at max step, not advancing');
      }
    };
  };

  /**
   * Creates a handler function for going back to the previous step
   */
  const createPreviousHandler = ({ onNext, currentStep, formData }: FormNavigationOptions) => {
    return () => {
      if (currentStep > 1) {
        // Find the previous valid step based on the form data
        const prevStep = findPrevValidStep(currentStep, formData);
        console.log('Navigation - Going back to previous valid step:', prevStep);
        
        // Calculate how many steps we need to move back
        const stepsBack = currentStep - prevStep;
        
        // We need to go all the way back to step 1 and then forward to the target previous step
        // This is because we don't have a direct "onPrevious" function
        
        // First go back to step 1 (this would be handled by the component's onPrevious function)
        // Then go forward to the desired step
        
        // This logic would be implemented in the component that uses this hook
        return prevStep;
      }
      
      return currentStep; // Don't change if already at step 1
    };
  };

  /**
   * Handle transaction type selection and special navigation logic
   */
  const handleTransactionTypeChange = (
    value: string, 
    formData: AgentFormData,
    updateFormData: (data: Partial<AgentFormData>) => void,
    onNext: () => void
  ) => {
    // Set the transaction type and default values
    const newData: Partial<AgentFormData> = { 
      transaction_type: value as any,
      timeline: "asap", // Default to ASAP for all submission types
      purchase_timeline: "asap" // Default to ASAP for all submission types
    };
    
    // Handle the sell path differently
    if (value === 'sell') {
      // Apply transaction type update
      updateFormData(newData);
      
      // Navigate directly to contact information for sell path
      navigateToContactForm(onNext);
      
      return true; // Indicate special navigation was handled
    }
    
    // For buy path, just update the data
    updateFormData(newData);
    return false; // No special navigation needed
  };

  return {
    findNextValidStep,
    findPrevValidStep,
    createNextHandler,
    createPreviousHandler,
    handleTransactionTypeChange,
    navigateToContactForm
  };
}