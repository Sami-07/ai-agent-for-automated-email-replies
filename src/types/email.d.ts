export interface Email {
    id: string;
    from: string;
    to: string;
    subject: string;
    text: string;
    date: Date;
    headers?: Record<string, string>;
  }