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

export function useFinderForm(finderType: FinderType) {
  const { toast } = useToast();
  
  // Initial form state for agent finder
  const initialAgentFormData: AgentFormData = {
    interest: [],
    location: "",
    multiple_locations: false,
    property_type: "",
    purchase_timeline: "" as any,
    price_min: "",
    price_max: "",
    loan_started: false,
    investment_properties_count: "",
    strategy: [],
    timeline: "" as any,
    contact: {
      name: "",
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
      name: "",
      email: "",
      phone: ""
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
        return { ...agentPrev, ...data };
      });
    } else {
      setFormData(prev => {
        const lenderPrev = prev as LenderFormData;
        return { ...lenderPrev, ...data };
      });
    }
    
    // Validate the updated data
    validateForm({ ...formData, ...data } as AgentFormData | LenderFormData);
  };

  // Validate form data using Zod schemas
  const validateForm = (data: AgentFormData | LenderFormData) => {
    try {
      if (finderType === "agent") {
        agentFinderSchema.parse(data);
        setIsValid(true);
        setErrors({});
      } else {
        lenderFinderSchema.parse(data);
        setIsValid(true);
        setErrors({});
      }
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
      // Validate form before submission
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
