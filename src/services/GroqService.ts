import Groq from 'groq-sdk';
import { config } from '../config';
import { logger } from '../utils/logger';

export class GroqService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: config.groq.apiKey });
  }

  async generateEmailResponse(emailContent: string): Promise<string> {
    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a professional email assistant. Generate concise and appropriate responses.'
          },
          {
            role: 'user',
            content: `Respond to this email: ${emailContent}`
          }
        ],
        model: config.groq.model
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Groq API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}