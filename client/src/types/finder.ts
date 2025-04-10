export type FinderType = "agent";

export interface FormStepProps {
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
  formData: any;
  updateFormData: (data: any) => void;
  stepNumber: number;
  isValid: boolean;
  errors: Record<string, any>;
}

// Agent Finder Types
export type AgentTransactionType = "buy" | "sell";

export type AgentStrategy = 
  | "buy_and_hold_brrrr" 
  | "short_term_rental"
  | "mid_term_rental"
  | "not_sure";

export type AgentTimeline = 
  | "asap" 
  | "1_3_months" 
  | "3_6_months" 
  | "6_12_months" 
  | "just_researching";

export interface AgentFormData {
  transaction_type: AgentTransactionType;
  location: string;
  property_type: string;
  purchase_timeline: AgentTimeline;
  property_address?: string; // For sell option
  price_min: string;
  price_max: string;
  loan_started: boolean;
  owner_occupied: boolean; // Added for step 8
  investment_properties_count: string;
  strategy: AgentStrategy[];
  timeline: AgentTimeline;
  contact: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    city: string;
    state: string; // Still keeping field but will be empty/unused
    zip: string;
    notes?: string; // Optional notes field
  };
  terms_accepted: boolean;
  loan_assistance: boolean; // Added for optional loan assistance checkbox
}

// Lender Finder Types have been removed since the application now only supports Agent Finder

export interface FinderFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSuccess: () => void;
}

// Mapping of values to display labels
export const agentTransactionTypeLabels: Record<AgentTransactionType, string> = {
  "buy": "Buy property",
  "sell": "Sell property"
};

export const agentTransactionTypeDescriptions: Record<AgentTransactionType, string> = {
  "buy": "I'm looking to purchase a property",
  "sell": "I'm looking to sell a property"
};

export const agentStrategyLabels: Record<AgentStrategy, string> = {
  "buy_and_hold_brrrr": "Buy and Hold or BRRRR",
  "short_term_rental": "Short-Term Rental (STR)",
  "mid_term_rental": "Mid-Term Rental (MTR)",
  "not_sure": "Not sure yet"
};

export const agentStrategyDescriptions: Record<AgentStrategy, string> = {
  "buy_and_hold_brrrr": "I plan to buy and rent out long-term",
  "short_term_rental": "I plan to list on platforms like Airbnb/VRBO (1-30 days)",
  "mid_term_rental": "I plan to rent for 1-12 months at a time",
  "not_sure": "I'm still exploring my options"
};

export const agentTimelineLabels: Record<AgentTimeline, string> = {
  "asap": "As soon as possible",
  "1_3_months": "1-3 months",
  "3_6_months": "3-6 months",
  "6_12_months": "6-12 months",
  "just_researching": "Just researching"
};

// All lender-related constants have been removed since the application now only supports Agent Finder
