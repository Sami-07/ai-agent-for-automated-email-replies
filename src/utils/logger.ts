import { config } from '../config';

export const logger = {
  info: (message: string, ...args: any[]) => 
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args),
  
  error: (message: string, ...args: any[]) => 
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args),
  
  debug: (message: string, ...args: any[]) => {
    if (config.app.env === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }
};