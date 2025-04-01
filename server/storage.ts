import { 
  InsertFinderSubmission, 
  finderSubmissions, 
  type FinderSubmission
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  createFinderSubmission(data: InsertFinderSubmission): Promise<FinderSubmission>;
  getFinderSubmission(id: number): Promise<FinderSubmission | undefined>;
  updateWebhookStatus(id: number, status: string, response?: string): Promise<void>;
}

// In-memory implementation of storage
export class MemStorage implements IStorage {
  private submissions: Map<number, FinderSubmission>;
  private currentId: number;

  constructor() {
    this.submissions = new Map();
    this.currentId = 1;
  }

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
}

// Export a singleton instance
export const storage = new MemStorage();
