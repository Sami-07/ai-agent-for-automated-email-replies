import { EmailService } from './services/EmailService';
import { EmailHandler } from './handlers/EmailHandler';
import { config } from './config';
import { logger } from './utils/logger';

function bootstrap() {
  const emailService = new EmailService();
  new EmailHandler(emailService);

  logger.info(`Email agent started in ${config.app.env} mode`);
  logger.info(`Polling interval: ${config.email.pollInterval}ms`);
}

bootstrap();