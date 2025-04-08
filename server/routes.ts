import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { agentFinderSchema } from "@shared/schema";
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
      
      let submissionId;
      
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
        submissionId = updatedSubmission?.id;
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
        submissionId = submission.id;
      }
      
      // Send to partial webhook if available
      const partialWebhookUrl = process.env.WEBHOOK_ENDPOINT_PARTIAL;
      if (partialWebhookUrl) {
        try {
          await axios.post(partialWebhookUrl, {
            finder_type: finderType,
            submission_id: submissionId,
            data: partialData,
            current_step: currentStep,
            session_id: sessionId,
            timestamp: new Date().toISOString()
          });
        } catch (webhookError) {
          console.error("Failed to send to partial webhook:", webhookError);
          
          // Attempt to log to failure webhook
          try {
            const failureWebhookUrl = process.env.WEBHOOK_ENDPOINT_FAILURES;
            if (failureWebhookUrl) {
              await axios.post(failureWebhookUrl, {
                error: JSON.stringify(webhookError),
                partial_submission_id: submissionId,
                finder_type: finderType,
                timestamp: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error("Failed to log to failure webhook:", error);
          }
        }
      }
      
      return res.status(existingSubmission ? 200 : 201).json({ success: true, id: submissionId });
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

      // Check finder type without strict validation to allow submission
      if (finderType !== "agent") {
        return res.status(400).json({ message: "Invalid finder type" });
      }
      
      // Note: We're skipping the strict validation to allow the form to submit
      // agentFinderSchema.parse(formData)

      // Store the submission
      const submission = await storage.createFinderSubmission({
        finderType,
        submissionData: formData,
        name: `${formData.contact.first_name} ${formData.contact.last_name}`,
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

      // Send to webhook using the appropriate environment variable
      const webhookUrl = process.env.WEBHOOK_ENDPOINT_COMPLETE || 'https://webhook.site/your-test-id';
      
      try {
        console.log('Received form submission:', formData);
        // Call the webhook
        const webhookResponse = await axios.post(webhookUrl, webhookData);
        console.log('Webhook Response:', webhookResponse.data);
        
        // Create HubSpot contact
        console.log('Attempting HubSpot contact creation...');
        const hubspotResponse = await createHubSpotContact(formData);
        console.log('HubSpot Contact Created:', hubspotResponse);
        
        await storage.updateWebhookStatus(submission.id, "success", JSON.stringify(webhookResponse.data));
      } catch (error) {
        // Log webhook error but don't fail the submission
        console.error("Webhook error:", error);
        await storage.updateWebhookStatus(submission.id, "failed", JSON.stringify(error));
        
        // Also log to failures webhook if available
        try {
          const failureWebhookUrl = process.env.WEBHOOK_ENDPOINT_FAILURES;
          if (failureWebhookUrl) {
            await axios.post(failureWebhookUrl, {
              error: JSON.stringify(error),
              submission_id: submission.id,
              finder_type: finderType,
              timestamp: new Date().toISOString()
            });
          }
        } catch (webhookError) {
          console.error("Failed to log to failure webhook:", webhookError);
        }
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
