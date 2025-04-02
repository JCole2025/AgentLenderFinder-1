import { 
  InsertFinderSubmission, 
  InsertPartialFinderSubmission,
  finderSubmissions,
  partialFinderSubmissions,
  type FinderSubmission,
  type PartialFinderSubmission
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // Complete form submissions
  createFinderSubmission(data: InsertFinderSubmission): Promise<FinderSubmission>;
  getFinderSubmission(id: number): Promise<FinderSubmission | undefined>;
  updateWebhookStatus(id: number, status: string, response?: string): Promise<void>;
  
  // Partial form submissions
  createPartialSubmission(data: InsertPartialFinderSubmission): Promise<PartialFinderSubmission>;
  updatePartialSubmission(id: number, data: Partial<InsertPartialFinderSubmission>): Promise<PartialFinderSubmission | undefined>;
  getPartialSubmissionBySession(sessionId: string): Promise<PartialFinderSubmission | undefined>;
  markPartialSubmissionComplete(id: number): Promise<void>;
}

// In-memory implementation of storage
export class MemStorage implements IStorage {
  private submissions: Map<number, FinderSubmission>;
  private partialSubmissions: Map<number, PartialFinderSubmission>;
  private currentId: number;
  private partialId: number;

  constructor() {
    this.submissions = new Map();
    this.partialSubmissions = new Map();
    this.currentId = 1;
    this.partialId = 1;
  }

  // Complete submission methods
  async createFinderSubmission(data: InsertFinderSubmission): Promise<FinderSubmission> {
    const id = this.currentId++;
    const submission: FinderSubmission = { 
      ...data, 
      id,
      webhookStatus: "pending",
      webhookResponse: null
    };
    
    this.submissions.set(id, submission);
    return submission;
  }

  async getFinderSubmission(id: number): Promise<FinderSubmission | undefined> {
    return this.submissions.get(id);
  }

  async updateWebhookStatus(id: number, status: string, response?: string): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission) {
      submission.webhookStatus = status;
      submission.webhookResponse = response || null;
      this.submissions.set(id, submission);
    }
  }

  // Partial submission methods
  async createPartialSubmission(data: InsertPartialFinderSubmission): Promise<PartialFinderSubmission> {
    const id = this.partialId++;
    const partialSubmission: PartialFinderSubmission = {
      ...data,
      id,
      isCompleted: data.isCompleted ?? false // Ensure isCompleted is always defined
    };
    
    this.partialSubmissions.set(id, partialSubmission);
    return partialSubmission;
  }

  async updatePartialSubmission(id: number, data: Partial<InsertPartialFinderSubmission>): Promise<PartialFinderSubmission | undefined> {
    const partialSubmission = this.partialSubmissions.get(id);
    if (partialSubmission) {
      const updatedSubmission = {
        ...partialSubmission,
        ...data,
        lastUpdated: new Date().toISOString() // Update timestamp
      };
      this.partialSubmissions.set(id, updatedSubmission);
      return updatedSubmission;
    }
    return undefined;
  }

  async getPartialSubmissionBySession(sessionId: string): Promise<PartialFinderSubmission | undefined> {
    // Find the submission by sessionId without using iterators
    let result: PartialFinderSubmission | undefined = undefined;
    
    this.partialSubmissions.forEach((submission) => {
      if (submission.sessionId === sessionId && !submission.isCompleted) {
        result = submission;
      }
    });
    
    return result;
  }

  async markPartialSubmissionComplete(id: number): Promise<void> {
    const partialSubmission = this.partialSubmissions.get(id);
    if (partialSubmission) {
      partialSubmission.isCompleted = true;
      this.partialSubmissions.set(id, partialSubmission);
    }
  }
}

// Export a singleton instance
export const storage = new MemStorage();
