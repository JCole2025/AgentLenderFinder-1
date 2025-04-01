export type FinderType = "agent" | "lender";

export interface FormStepProps {
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
  formData: any;
  updateFormData: (data: any) => void;
  stepNumber: number;
  finderType: FinderType;
  isValid: boolean;
  errors: Record<string, any>;
}

// Agent Finder Types
export type AgentTransactionType = "buy" | "sell";

export type AgentStrategy = 
  | "buy_and_hold" 
  | "fix_and_flip" 
  | "brrrr" 
  | "short_term_rental"
  | "multifamily"
  | "commercial"
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
  multiple_locations: boolean;
  property_type: string;
  purchase_timeline: AgentTimeline;
  property_address?: string; // For sell option
  price_min: string;
  price_max: string;
  loan_started: boolean;
  investment_properties_count: string;
  strategy: AgentStrategy[];
  timeline: AgentTimeline;
  contact: {
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    zip: string;
  };
  terms_accepted: boolean;
}

// Lender Finder Types
export type LenderLoanPurpose = 
  | "purchase" 
  | "refinance" 
  | "heloc" 
  | "construction"
  | "not_sure";

export type LenderPropertyType = 
  | "single_family" 
  | "multi_family_2_4" 
  | "multi_family_5plus" 
  | "commercial"
  | "land";

export type LenderCreditScore = 
  | "excellent_740plus" 
  | "good_700_739" 
  | "fair_650_699" 
  | "below_650"
  | "not_sure";

export interface LenderFormData {
  loan_purpose: LenderLoanPurpose;
  property_type: LenderPropertyType;
  location: string;
  credit_score: LenderCreditScore;
  contact: {
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    zip: string;
    message?: string;
  };
  terms_accepted: boolean;
}

export interface FinderFormProps {
  finderType: FinderType;
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
  "buy_and_hold": "Buy and hold",
  "fix_and_flip": "Fix and flip",
  "brrrr": "BRRRR",
  "short_term_rental": "Short-term rental",
  "multifamily": "Multi-family",
  "commercial": "Commercial",
  "not_sure": "Not sure yet"
};

export const agentStrategyDescriptions: Record<AgentStrategy, string> = {
  "buy_and_hold": "Long-term rental investment",
  "fix_and_flip": "Renovate and sell for profit",
  "brrrr": "Buy, Rehab, Rent, Refinance, Repeat",
  "short_term_rental": "Airbnb or vacation rentals",
  "multifamily": "Duplexes, apartment buildings, etc.",
  "commercial": "Office, retail, industrial, etc.",
  "not_sure": "I'd like to explore my options"
};

export const agentTimelineLabels: Record<AgentTimeline, string> = {
  "asap": "As soon as possible",
  "1_3_months": "1-3 months",
  "3_6_months": "3-6 months",
  "6_12_months": "6-12 months",
  "just_researching": "Just researching"
};

export const lenderLoanPurposeLabels: Record<LenderLoanPurpose, string> = {
  "purchase": "Purchase a property",
  "refinance": "Refinance a property",
  "heloc": "Home Equity Line of Credit (HELOC)",
  "construction": "Construction loan",
  "not_sure": "Not sure yet"
};

export const lenderLoanPurposeDescriptions: Record<LenderLoanPurpose, string> = {
  "purchase": "Get financing to buy a new investment property",
  "refinance": "Get a new loan on a property you already own",
  "heloc": "Access equity in your property",
  "construction": "Finance new construction or major renovations",
  "not_sure": "I'd like to explore my options"
};

export const lenderPropertyTypeLabels: Record<LenderPropertyType, string> = {
  "single_family": "Single-family home",
  "multi_family_2_4": "Small multi-family (2-4 units)",
  "multi_family_5plus": "Large multi-family (5+ units)",
  "commercial": "Commercial property",
  "land": "Land"
};

export const lenderPropertyTypeDescriptions: Record<LenderPropertyType, string> = {
  "single_family": "Detached house with one unit",
  "multi_family_2_4": "Duplex, triplex, or fourplex",
  "multi_family_5plus": "Apartment buildings",
  "commercial": "Office, retail, industrial, etc.",
  "land": "Vacant lot or undeveloped land"
};

export const lenderCreditScoreLabels: Record<LenderCreditScore, string> = {
  "excellent_740plus": "Excellent (740+)",
  "good_700_739": "Good (700-739)",
  "fair_650_699": "Fair (650-699)",
  "below_650": "Below 650",
  "not_sure": "Not sure"
};
