
import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Common validation constants
const PHONE_REGEX = /^1?\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper to format phone number to E.164 format
const formatPhoneToE164 = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Ensure it starts with 1
  return cleaned.startsWith('1') ? cleaned : `1${cleaned}`;
};

// Enums for better type safety
export const TransactionType = {
  BUY: 'buy',
  SELL: 'sell',
} as const;

export const Timeline = {
  ASAP: 'asap',
  ONE_TO_THREE_MONTHS: '1_3_months',
  THREE_TO_SIX_MONTHS: '3_6_months',
  SIX_TO_TWELVE_MONTHS: '6_12_months',
  JUST_RESEARCHING: 'just_researching',
} as const;

export const InvestmentStrategy = {
  BUY_AND_HOLD: 'buy_and_hold_brrrr',
  SHORT_TERM_RENTAL: 'short_term_rental',
  MID_TERM_RENTAL: 'mid_term_rental',
  NOT_SURE: 'not_sure',
} as const;

// Database schema
export const finderSubmissions = pgTable("finder_submissions", {
  id: serial("id").primaryKey(),
  finderType: text("finder_type").notNull(),
  submissionData: json("submission_data").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  webhookStatus: text("webhook_status").default("pending"),
  webhookResponse: text("webhook_response"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const partialFinderSubmissions = pgTable("partial_finder_submissions", {
  id: serial("id").primaryKey(),
  finderType: text("finder_type").notNull(),
  partialData: json("partial_data").notNull(),
  currentStep: integer("current_step").notNull(),
  sessionId: text("session_id").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Zod validation schemas
export const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Please enter a valid email").regex(EMAIL_REGEX),
  phone: z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Please enter a valid phone number")
    .transform(formatPhoneToE164),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const agentFinderSchema = z.object({
  lead_partner: z.string().optional(),
  transaction_type: z.enum([TransactionType.BUY, TransactionType.SELL], {
    required_error: "Please select a transaction type",
  }),
  location: z.string().min(1, "Please enter a location").max(100),
  property_type: z.string().min(1, "Please specify property type"),
  purchase_timeline: z.enum(Object.values(Timeline) as [string, ...string[]], {
    required_error: "Please select a timeline",
  }),
  property_address: z.string().optional(),
  price_min: z.string().min(1, "Please specify minimum price"),
  price_max: z.string().min(1, "Please specify maximum price"),
  loan_started: z.boolean().optional(),
  owner_occupied: z.boolean().optional(),
  investment_properties_count: z.string().optional(),
  strategy: z.array(z.enum(Object.values(InvestmentStrategy) as [string, ...string[]]))
    .min(1, "Please select at least one option"),
  timeline: z.enum(Object.values(Timeline) as [string, ...string[]], {
    required_error: "Please select a timeline",
  }),
  contact: contactSchema,
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" }),
  }),
  loan_assistance: z.boolean().optional(),
}).refine(
  (data) => parseInt(data.price_max) > parseInt(data.price_min),
  { message: "Maximum price must be greater than minimum price" }
);

export const finderSubmissionSchema = z.object({
  finderType: z.literal("agent"),
  data: z.object({
    finderType: z.literal("agent"),
    formData: agentFinderSchema,
  }),
});

// Export types and insert schemas
export type ContactData = z.infer<typeof contactSchema>;
export type AgentFinderData = z.infer<typeof agentFinderSchema>;
export type FinderSubmissionData = z.infer<typeof finderSubmissionSchema>;

export const insertFinderSubmissionSchema = createInsertSchema(finderSubmissions);
export const insertPartialFinderSubmissionSchema = createInsertSchema(partialFinderSubmissions);

export type InsertFinderSubmission = z.infer<typeof insertFinderSubmissionSchema>;
export type InsertPartialFinderSubmission = z.infer<typeof insertPartialFinderSubmissionSchema>;
export type FinderSubmission = typeof finderSubmissions.$inferSelect;
export type PartialFinderSubmission = typeof partialFinderSubmissions.$inferSelect;
