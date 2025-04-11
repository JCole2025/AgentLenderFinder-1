import { useState, useCallback } from "react";
import { AgentFormData, AgentTransactionType, AgentTimeline } from "@/types/finder";
import { apiRequest } from "@/lib/queryClient";
import { agentFinderSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { validateLocationInput } from "@/lib/locationValidator";
import { validatePrice, validatePriceRange, getDefaultMinPrice } from "@/lib/priceValidator";
import { getAllStateNames, isValidStateName } from "@/lib/stateValidator";

export function useFinderForm() {
  const { toast } = useToast();

  // Function to get user's location
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://api.biggerpockets.com/geocode?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
          );
          const data = await response.json();
          if (data.city && data.state) {
            setFormData(prev => ({
              ...prev,
              location: `${data.city}, ${data.state}`,
              contact: {
                ...prev.contact,
                city: data.city,
                state: data.state,
                zip: data.zip || prev.contact.zip
              }
            }));
          }
        } catch (error) {
          console.error('Error getting location details:', error);
        }
      });
    }
  };

  // Initial form state for agent finder
  const initialAgentFormData: AgentFormData = {
    transaction_type: "buy", // Default to buy
    location: "",
    property_type: "", // Empty string
    purchase_timeline: "asap", // Default to ASAP
    property_address: "",
    price_min: "",
    price_max: "",
    loan_started: false,
    owner_occupied: false, // Set default to false to avoid undefined type error
    investment_properties_count: "",
    strategy: [],
    timeline: "asap", // Default to ASAP
    contact: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      zip: "",
      notes: ""
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

  // Function to update form data with optimized validation
  const updateFormData = useCallback((data: Partial<AgentFormData>) => {
    setFormData(prev => {
      const updatedData = { ...prev, ...data };
      // Validate inline to prevent unnecessary re-renders
      validateForm(updatedData);
      return updatedData;
    });
  }, []);

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

      // State validation removed as it's no longer required

      // Only validate buy-specific fields if transaction type is 'buy'
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
        
        // Owner occupied validation only applies to buy transactions
        if (data.owner_occupied === undefined) {
          customErrors.owner_occupied = "Please select if this will be your primary residence";
          isFormValid = false;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (): Promise<boolean> => {
    console.log('useFinderForm - submitForm called');
    console.log('useFinderForm - Form data to submit:', formData);
    setIsSubmitting(true);
    try {
      // Send data directly to API without validation on the final review step
      // This allows submissions to proceed even if there are non-critical issues

      console.log('useFinderForm - Sending API request to /api/submit-finder');
      // Send data to API
      const response = await apiRequest("POST", "/api/submit-finder", {
        finderType: "agent",
        formData
      });

      console.log('useFinderForm - API response received:', response.status);
      const data = await response.json();
      console.log('useFinderForm - API response data:', data);

      if (!response.ok) {
        console.error('useFinderForm - API request failed:', data.message || 'Unknown error');
        toast({
          title: "Error",
          description: data.message || "Failed to submit form",
          variant: "destructive"
        });
        return false;
      }

      console.log('useFinderForm - Form submission successful');
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateFormData,
    errors,
    isValid,
    resetForm,
    submitForm,
    isSubmitting
  };
}