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

// Validation schemas for agent finder
export const agentInterestSchema = z.array(
  z.enum([
    "buy_investment_property",
    "sell_investment_property",
    "primary_residence"
  ])
).min(1, "Please select at least one option");

export const agentStrategySchema = z.array(
  z.enum([
    "buy_and_hold",
    "fix_and_flip",
    "brrrr",
    "short_term_rental",
    "multifamily",
    "commercial",
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
  interest: agentInterestSchema,
  location: z.string().min(1, "Please enter a location"),
  multiple_locations: z.boolean().optional(),
  strategy: agentStrategySchema,
  timeline: agentTimelineSchema,
  contact: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" })
  }),
});

// Validation schemas for lender finder
export const lenderLoanPurposeSchema = z.enum([
  "purchase",
  "refinance",
  "heloc",
  "construction",
  "not_sure"
], {
  required_error: "Please select a loan purpose",
});

export const lenderPropertyTypeSchema = z.enum([
  "single_family",
  "multi_family_2_4",
  "multi_family_5plus",
  "commercial",
  "land"
], {
  required_error: "Please select a property type",
});

export const lenderCreditScoreSchema = z.enum([
  "excellent_740plus",
  "good_700_739",
  "fair_650_699",
  "below_650",
  "not_sure"
], {
  required_error: "Please select a credit score range",
});

export const lenderFinderSchema = z.object({
  loan_purpose: lenderLoanPurposeSchema,
  property_type: lenderPropertyTypeSchema,
  location: z.string().min(1, "Please enter a location"),
  credit_score: lenderCreditScoreSchema,
  contact: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" })
  }),
});

export const finderSubmissionSchema = z.object({
  finderType: z.enum(["agent", "lender"]),
  data: z.discriminatedUnion("finderType", [
    z.object({
      finderType: z.literal("agent"),
      formData: agentFinderSchema
    }),
    z.object({
      finderType: z.literal("lender"),
      formData: lenderFinderSchema
    })
  ])
});

export const insertFinderSubmissionSchema = createInsertSchema(finderSubmissions).pick({
  finderType: true,
  submissionData: true,
  name: true,
  email: true,
  phone: true,
  submittedAt: true,
});

export type InsertFinderSubmission = z.infer<typeof insertFinderSubmissionSchema>;
export type FinderSubmission = typeof finderSubmissions.$inferSelect;
export type AgentFinderData = z.infer<typeof agentFinderSchema>;
export type LenderFinderData = z.infer<typeof lenderFinderSchema>;
export type FinderSubmissionData = z.infer<typeof finderSubmissionSchema>;
