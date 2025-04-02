import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Finder submissions table
export const finderSubmissions = pgTable("finder_submissions", {
  id: serial("id").primaryKey(),
  finderType: text("finder_type").notNull(), // 'agent' or 'lender'
  submissionData: json("submission_data").notNull(), // Will store the structured form data
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  submittedAt: text("submitted_at").notNull(),
  webhookStatus: text("webhook_status").default("pending"),
  webhookResponse: text("webhook_response"),
});

// Partial form submissions table (for tracking incomplete submissions)
export const partialFinderSubmissions = pgTable("partial_finder_submissions", {
  id: serial("id").primaryKey(),
  finderType: text("finder_type").notNull(), // 'agent' or 'lender'
  partialData: json("partial_data").notNull(), // Will store the form data as it's being filled
  currentStep: integer("current_step").notNull(),
  sessionId: text("session_id").notNull(), // To identify unique user sessions
  lastUpdated: text("last_updated").notNull(),
  isCompleted: boolean("is_completed").default(false), // Flag when the user completes the form
});

// Validation schemas for agent finder
export const agentTransactionTypeSchema = z.enum([
  "buy",
  "sell"
], {
  required_error: "Please select a transaction type",
});

export const agentStrategySchema = z.array(
  z.enum([
    "buy_and_hold_brrrr",
    "short_term_rental",
    "not_sure"
  ])
).min(1, "Please select at least one option");

export const agentTimelineSchema = z.enum([
  "asap",
  "1_3_months",
  "3_6_months",
  "6_12_months",
  "just_researching"
], {
  required_error: "Please select a timeline",
});

export const agentFinderSchema = z.object({
  transaction_type: agentTransactionTypeSchema,
  location: z.string().min(1, "Please enter a location"),
  property_type: z.string().min(1, "Please specify property type"),
  purchase_timeline: agentTimelineSchema,
  property_address: z.string().optional(),
  price_min: z.string().min(1, "Please specify minimum price"),
  price_max: z.string().min(1, "Please specify maximum price"),
  loan_started: z.boolean().optional(),
  owner_occupied: z.boolean().optional(), // Added for step 8
  investment_properties_count: z.string().optional(), // Made optional as per form design
  strategy: agentStrategySchema,
  timeline: agentTimelineSchema,
  contact: z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(1, "Phone number is required"),
    state: z.string().min(1, "State is required"),
  }),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" })
  }),
  loan_assistance: z.boolean().optional(), // Added for optional loan assistance checkbox
});

// Lender finder schemas have been removed since application only supports Agent Finder

export const finderSubmissionSchema = z.object({
  finderType: z.literal("agent"),
  data: z.object({
    finderType: z.literal("agent"),
    formData: agentFinderSchema
  })
});

export const insertFinderSubmissionSchema = createInsertSchema(finderSubmissions).pick({
  finderType: true,
  submissionData: true,
  name: true,
  email: true,
  phone: true,
  submittedAt: true,
});

export const insertPartialFinderSubmissionSchema = createInsertSchema(partialFinderSubmissions).pick({
  finderType: true,
  partialData: true,
  currentStep: true,
  sessionId: true,
  lastUpdated: true,
  isCompleted: true,
});

export type InsertFinderSubmission = z.infer<typeof insertFinderSubmissionSchema>;
export type InsertPartialFinderSubmission = z.infer<typeof insertPartialFinderSubmissionSchema>;
export type FinderSubmission = typeof finderSubmissions.$inferSelect;
export type PartialFinderSubmission = typeof partialFinderSubmissions.$inferSelect;
export type AgentFinderData = z.infer<typeof agentFinderSchema>;
export type FinderSubmissionData = z.infer<typeof finderSubmissionSchema>;
