import { EventEmitter } from 'events';
import nodemailer from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { Email } from '../types/email';
import { logger } from '../utils/logger';
import { config } from '../config';

export class EmailService extends EventEmitter {
  private transporter: nodemailer.Transporter;
  private startTime: Date;

  constructor() {
    super();
    this.startTime = new Date();
    this.transporter = this.createTransporter();
    this.setupPolling();
  }

  private createTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  private setupPolling(): void {
    setInterval(async () => {
      try {
        const emails = await this.fetchEmails();
        emails.forEach(email => this.emit('email:received', email));
      } catch (error) {
        logger.error('Email polling failed:', error);
      }
    }, config.email.pollInterval);
  }

  private async fetchEmails(): Promise<Email[]> {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: config.email.user,
        password: config.email.password,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: {
          rejectUnauthorized: false,
          servername: 'imap.gmail.com'
        },
        authTimeout: 10000
      });

      const emails: Email[] = [];

      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err) => {
          if (err) return reject(err);

          const searchCriteria = [
            'UNSEEN',
            ['SENTSINCE', this.formatImapDate(this.startTime)]
          ];

          imap.search(searchCriteria, (err, results) => {
            if (err || !results?.length) {
              imap.end();
              return resolve([]);
            }

            const fetch = imap.fetch(results, {
              bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
              markSeen: true,
              modifiers: { uid: true }
            });

            fetch.on('message', (msg) => {
              let headers: any = {};
              let text = '';
              const uid = (msg as any).uid;

              msg.on('body', (stream, info) => {
                let buffer = '';
                stream.on('data', (chunk) => buffer += chunk.toString('utf8'));
                stream.on('end', () => {
                  if (info.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)') {
                    headers = Imap.parseHeader(buffer);
                  } else {
                    text = buffer;
                  }
                });
              });

              msg.once('end', async () => {
                try {
                  const parsed = await simpleParser(text);
                  
                  const emailData = {
                    id: uid?.toString() || Date.now().toString(),
                    from: headers.from?.[0] || 'unknown@example.com',
                    to: headers.to?.[0] || config.email.user,
                    subject: headers.subject?.[0] || 'No Subject',
                    text: parsed.text || '',
                    date: headers.date?.[0] ? new Date(headers.date[0]) : new Date()
                  };

                  if (!emailData.from || !emailData.text) {
                    logger.error('Invalid email structure', headers);
                    return;
                  }

                  emails.push(emailData);
                } catch (error) {
                  logger.error('Error parsing email:', error);
                }
              });
            });

            fetch.once('error', (err) => reject(err));
            fetch.once('end', () => {
              imap.end();
              resolve(emails);
            });
          });
        });
      });

      imap.once('error', (err: any) => reject(err));
      imap.connect();
    });
  }

  private formatImapDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3');
  }

  public async sendReply(originalEmail: Email, response: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.email.user,
        to: originalEmail.from,
        subject: `Re: ${originalEmail.subject}`,
        text: response
      });
      logger.info(`Replied to email from ${originalEmail.from}`);
    } catch (error) {
      logger.error('Failed to send reply:', error);
      throw error;
    }
  }
}