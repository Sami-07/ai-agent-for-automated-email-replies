import { Email } from '../types/email';

export class SpamHandler {
  private spamKeywords = [
    'lottery', 'free money', 'urgent', 'click here',
    'discount', 'offer', 'winner', 'credit card'
  ];

  async isSpam(email: Email): Promise<boolean> {
    const content = `${email.subject} ${email.text}`.toLowerCase();
    return this.spamKeywords.some(keyword => content.includes(keyword));
  }
}