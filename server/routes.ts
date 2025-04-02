import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { agentFinderSchema, lenderFinderSchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for partial form submissions (saving progress)
  app.post("/api/save-progress", async (req, res) => {
    try {
      const { finderType, partialData, currentStep, sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      // Check if there's an existing submission for this session
      const existingSubmission = await storage.getPartialSubmissionBySession(sessionId);
      
      if (existingSubmission) {
        // Update existing submission
        const updatedSubmission = await storage.updatePartialSubmission(
          existingSubmission.id, 
          {
            partialData,
            currentStep,
            lastUpdated: new Date().toISOString()
          }
        );
        return res.status(200).json({ success: true, id: updatedSubmission?.id });
      } else {
        // Create new partial submission
        const submission = await storage.createPartialSubmission({
          finderType,
          partialData,
          currentStep,
          sessionId,
          lastUpdated: new Date().toISOString(),
          isCompleted: false
        });
        return res.status(201).json({ success: true, id: submission.id });
      }
    } catch (error) {
      console.error("Save progress error:", error);
      res.status(500).json({ message: "An error occurred saving your progress" });
    }
  });
  
  // API endpoint to retrieve saved progress
  app.get("/api/get-progress/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      const savedProgress = await storage.getPartialSubmissionBySession(sessionId);
      
      if (savedProgress) {
        return res.status(200).json({ 
          success: true, 
          data: {
            finderType: savedProgress.finderType,
            currentStep: savedProgress.currentStep,
            partialData: savedProgress.partialData
          }
        });
      } else {
        return res.status(404).json({ message: "No saved progress found" });
      }
    } catch (error) {
      console.error("Get progress error:", error);
      res.status(500).json({ message: "An error occurred retrieving your progress" });
    }
  });
  
  // API endpoint to mark a partial submission as complete
  app.post("/api/complete-progress/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: "Submission ID is required" });
      }
      
      await storage.markPartialSubmissionComplete(parseInt(id, 10));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Complete progress error:", error);
      res.status(500).json({ message: "An error occurred completing your submission" });
    }
  });

  // API endpoint to submit the complete finder form data
  app.post("/api/submit-finder", async (req, res) => {
    try {
      const { finderType, formData } = req.body;

      // Validate based on finderType
      if (finderType === "agent") {
        agentFinderSchema.parse(formData);
      } else if (finderType === "lender") {
        lenderFinderSchema.parse(formData);
      } else {
        return res.status(400).json({ message: "Invalid finder type" });
      }

      // Store the submission
      const submission = await storage.createFinderSubmission({
        finderType,
        submissionData: formData,
        name: formData.contact.name,
        email: formData.contact.email,
        phone: formData.contact.phone,
        submittedAt: new Date().toISOString(),
      });

      // Prepare webhook data
      const webhookData = {
        finder_type: finderType,
        timestamp: submission.submittedAt,
        data: formData
      };

      // Send to webhook - in a real app, this would use a proper webhook URL
      // For demo, we'll use a test webhook or log to console
      const webhookUrl = process.env.WEBHOOK_URL || 'https://webhook.site/your-test-id';
      
      try {
        // Would call a real webhook in production
        const webhookResponse = await axios.post(webhookUrl, webhookData);
        await storage.updateWebhookStatus(submission.id, "success", JSON.stringify(webhookResponse.data));
      } catch (error) {
        // Log webhook error but don't fail the submission
        console.error("Webhook error:", error);
        await storage.updateWebhookStatus(submission.id, "failed", JSON.stringify(error));
      }

      res.status(200).json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Submission error:", error);
      res.status(500).json({ message: "An error occurred processing your submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
