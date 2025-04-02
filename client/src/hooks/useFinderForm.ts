import { useState, useEffect } from "react";
import { 
  FinderType, 
  AgentFormData, 
  LenderFormData 
} from "@/types/finder";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  agentFinderSchema, 
  lenderFinderSchema 
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { validateLocationInput } from "@/lib/locationValidator";
import { validatePrice, validatePriceRange, getDefaultMinPrice } from "@/lib/priceValidator";

export function useFinderForm(finderType: FinderType) {
  const { toast } = useToast();
  
  // Initial form state for agent finder
  const initialAgentFormData: AgentFormData = {
    transaction_type: "" as any,
    location: "",
    property_type: "",
    purchase_timeline: "" as any,
    property_address: "",
    price_min: getDefaultMinPrice(), // Start with $100,000 as minimum price
    price_max: "",
    loan_started: false,
    owner_occupied: false, // Added for step 8
    investment_properties_count: "",
    strategy: [],
    timeline: "" as any,
    contact: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      zip: ""
    },
    terms_accepted: false
  };

  // Initial form state for lender finder
  const initialLenderFormData: LenderFormData = {
    loan_purpose: "" as any,
    property_type: "" as any,
    location: "",
    credit_score: "" as any,
    contact: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      zip: "",
      message: ""
    },
    terms_accepted: false
  };

  // State for form data based on finder type
  const [formData, setFormData] = useState<AgentFormData | LenderFormData>(
    finderType === "agent" ? initialAgentFormData : initialLenderFormData
  );

  // State for validation errors
  const [errors, setErrors] = useState<Record<string, any>>({});
  
  // State for form validity
  const [isValid, setIsValid] = useState(true);

  // Update form data when finder type changes
  useEffect(() => {
    if (finderType === "agent") {
      setFormData(initialAgentFormData);
    } else {
      setFormData(initialLenderFormData);
    }
    setErrors({});
    setIsValid(true);
  }, [finderType]);

  // Function to update form data
  const updateFormData = (data: Partial<AgentFormData | LenderFormData>) => {
    if (finderType === "agent") {
      setFormData(prev => {
        const agentPrev = prev as AgentFormData;
        const updatedData = { ...agentPrev, ...data } as AgentFormData;
        return updatedData;
      });
    } else {
      setFormData(prev => {
        const lenderPrev = prev as LenderFormData;
        const updatedData = { ...lenderPrev, ...data } as LenderFormData;
        return updatedData;
      });
    }
    
    // Validate the updated data
    validateForm({ ...formData, ...data } as AgentFormData | LenderFormData);
  };

  // Validate form data using Zod schemas and custom validators
  const validateForm = (data: AgentFormData | LenderFormData) => {
    try {
      let customErrors: Record<string, string> = {};
      let isFormValid = true;
      
      // Validate location for both agent and lender forms
      if (data.location && !validateLocationInput(data.location)) {
        customErrors.location = "Please enter a valid city, state format (e.g., 'Austin, TX')";
        isFormValid = false;
      }
      
      // Validate price fields for agent form
      if (finderType === "agent") {
        const agentData = data as AgentFormData;
        
        // Only validate prices if transaction type is 'buy'
        if (agentData.transaction_type === 'buy') {
          // Validate min price
          if (agentData.price_min && !validatePrice(agentData.price_min)) {
            customErrors.price_min = "Minimum price must be at least $100,000";
            isFormValid = false;
          }
          
          // Validate max price
          if (agentData.price_max && !validatePrice(agentData.price_max)) {
            customErrors.price_max = "Please enter a valid price";
            isFormValid = false;
          }
          
          // Validate price range if both min and max are provided
          if (agentData.price_min && agentData.price_max) {
            if (!validatePriceRange(agentData.price_min, agentData.price_max)) {
              customErrors.price_max = "Maximum price must be greater than minimum price";
              isFormValid = false;
            }
          }
        }
      }
      
      // Run Zod schema validation
      if (finderType === "agent") {
        agentFinderSchema.parse(data);
      } else {
        lenderFinderSchema.parse(data);
      }
      
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
    if (finderType === "agent") {
      setFormData(initialAgentFormData);
    } else {
      setFormData(initialLenderFormData);
    }
    setErrors({});
    setIsValid(true);
  };

  // Submit form to API
  const submitForm = async (): Promise<boolean> => {
    try {
      // Run custom validation first
      let customErrors: Record<string, string> = {};
      let isFormValid = true;
      
      // Validate location for both agent and lender forms
      if (formData.location && !validateLocationInput(formData.location)) {
        customErrors.location = "Please enter a valid city, state format (e.g., 'Austin, TX')";
        isFormValid = false;
      }
      
      // Validate price fields for agent form
      if (finderType === "agent") {
        const agentData = formData as AgentFormData;
        
        // Only validate prices if transaction type is 'buy'
        if (agentData.transaction_type === 'buy') {
          // Validate min price
          if (agentData.price_min && !validatePrice(agentData.price_min)) {
            customErrors.price_min = "Minimum price must be at least $100,000";
            isFormValid = false;
          }
          
          // Validate max price
          if (agentData.price_max && !validatePrice(agentData.price_max)) {
            customErrors.price_max = "Please enter a valid price";
            isFormValid = false;
          }
          
          // Validate price range if both min and max are provided
          if (agentData.price_min && agentData.price_max) {
            if (!validatePriceRange(agentData.price_min, agentData.price_max)) {
              customErrors.price_max = "Maximum price must be greater than minimum price";
              isFormValid = false;
            }
          }
        }
      }
      
      // If we have custom validation errors, don't submit
      if (Object.keys(customErrors).length > 0) {
        setErrors(customErrors);
        setIsValid(false);
        toast({
          title: "Error",
          description: "Please fix the form errors and try again",
          variant: "destructive"
        });
        return false;
      }
      
      // Run Zod schema validation
      if (finderType === "agent") {
        agentFinderSchema.parse(formData);
      } else {
        lenderFinderSchema.parse(formData);
      }

      // Send data to API
      const response = await apiRequest("POST", "/api/submit-finder", {
        finderType,
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
