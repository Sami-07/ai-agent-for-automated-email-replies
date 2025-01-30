import dotenv from 'dotenv';

dotenv.config();

export const config = {
  email: {
    user: process.env.EMAIL_USER!,
    password: process.env.EMAIL_PASSWORD!,
    pollInterval: parseInt(process.env.EMAIL_POLL_INTERVAL || '3000')
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY!,
    model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768'
  },
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  }
};