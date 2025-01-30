import { Email } from '../types/email';
import { GroqService } from '../services/GroqService';

export class AIResponseHandler {
  private groqService = new GroqService();

  async generateResponse(email: Email): Promise<string> {
    const prompt = this.createPrompt(email);
    return this.groqService.generateEmailResponse(prompt);
  }

  private createPrompt(email: Email): string {
    return `
      Respond to this email from ${email.from} with subject "${email.subject}".
      Maintain a professional tone and keep the response under 150 words.
      
      Email content:
      ${email.text}
    `;
  }
}