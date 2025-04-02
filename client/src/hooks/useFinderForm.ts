import { useState } from "react";
import { AgentFormData } from "@/types/finder";
import { apiRequest } from "@/lib/queryClient";
import { agentFinderSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { validateLocationInput } from "@/lib/locationValidator";
import { validatePrice, validatePriceRange, getDefaultMinPrice } from "@/lib/priceValidator";

export function useFinderForm() {
  const { toast } = useToast();
  
  // Initial form state for agent finder
  const initialAgentFormData: AgentFormData = {
    transaction_type: undefined,
    location: "",
    property_type: undefined,
    purchase_timeline: undefined,
    property_address: "",
    price_min: "",
    price_max: "",
    loan_started: false,
    owner_occupied: undefined,
    investment_properties_count: undefined,
    strategy: [],
    timeline: undefined,
    contact: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      zip: ""
    },
    terms_accepted: false,
    loan_assistance: false // Field for loan assistance checkbox
  };

  // State for form data
  const [formData, setFormData] = useState<AgentFormData>(initialAgentFormData);

  // State for validation errors
  const [errors, setErrors] = useState<Record<string, any>>({});
  
  // State for form validity
  const [isValid, setIsValid] = useState(true);

  // Function to update form data
  const updateFormData = (data: Partial<AgentFormData>) => {
    setFormData(prev => {
      const updatedData = { ...prev, ...data };
      return updatedData;
    });
    
    // Validate the updated data
    validateForm({ ...formData, ...data });
  };

  // Validate form data using Zod schemas and custom validators
  const validateForm = (data: AgentFormData) => {
    try {
      let customErrors: Record<string, string> = {};
      let isFormValid = true;
      
      // Validate location
      if (data.location && !validateLocationInput(data.location)) {
        customErrors.location = "Please enter a valid city, state format (e.g., 'Austin, TX')";
        isFormValid = false;
      }
      
      // Only validate prices if transaction type is 'buy'
      if (data.transaction_type === 'buy') {
        // Validate min price
        if (data.price_min && !validatePrice(data.price_min)) {
          customErrors.price_min = "Minimum price must be at least $100,000";
          isFormValid = false;
        }
        
        // Validate max price
        if (data.price_max && !validatePrice(data.price_max)) {
          customErrors.price_max = "Please enter a valid price";
          isFormValid = false;
        }
        
        // Validate price range if both min and max are provided
        if (data.price_min && data.price_max) {
          if (!validatePriceRange(data.price_min, data.price_max)) {
            customErrors.price_max = "Maximum price must be greater than minimum price";
            isFormValid = false;
          }
        }
      }
      
      // Run Zod schema validation
      agentFinderSchema.parse(data);
      
      // If we have custom errors, set them even if Zod validation passes
      if (Object.keys(customErrors).length > 0) {
        setErrors(customErrors);
        setIsValid(false);
        return;
      }
      
      // If we made it here, form is valid
      setIsValid(true);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          formattedErrors[err.path.join('.')] = err.message;
        });
        setErrors(formattedErrors);
        setIsValid(false);
      }
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialAgentFormData);
    setErrors({});
    setIsValid(true);
  };

  // Submit form to API
  const submitForm = async (): Promise<boolean> => {
    try {
      // Send data directly to API without validation on the final review step
      // This allows submissions to proceed even if there are non-critical issues

      // Send data to API
      const response = await apiRequest("POST", "/api/submit-finder", {
        finderType: "agent",
        formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to submit form",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Your information has been submitted successfully!",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      let errorMessage = "Failed to submit form";
      
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          formattedErrors[err.path.join('.')] = err.message;
        });
        setErrors(formattedErrors);
        setIsValid(false);
        errorMessage = "Please fix the form errors and try again";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    }
  };

  return {
    formData,
    updateFormData,
    errors,
    isValid,
    resetForm,
    submitForm
  };
}
