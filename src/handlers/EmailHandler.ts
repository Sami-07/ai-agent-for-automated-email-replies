import { EmailService } from '../services/EmailService';
import { SpamHandler } from './SpamHandler';
import { AIResponseHandler } from './AIResponseHandler';
import { logger } from '../utils/logger';

export class EmailHandler {
  constructor(
    private emailService: EmailService,
    private spamHandler = new SpamHandler(),
    private aiHandler = new AIResponseHandler()
  ) {
    this.registerListeners();
  }

  private registerListeners(): void {
    this.emailService.on('email:received', async (email) => {
      try {
        const isSpam = await this.spamHandler.isSpam(email);
        
        if (isSpam) {
          logger.info(`Marked email as spam from ${email.from}`);
          return;
        }

        const response = await this.aiHandler.generateResponse(email);
        await this.emailService.sendReply(email, response);
        
      } catch (error) {
        logger.error('Error processing email:', error);
      }
    });
  }
}