import { Email } from '../types/email';
import { GroqService } from '../services/GroqService';

export class AIResponseHandler {
  private groqService = new GroqService();
  
  private static readonly CORE_CONTEXT = `
    I am Aditya Saxena, currently in the final stages of GATE exam preparation with 
    the singular goal of securing a top digital rank. I have made a binding commitment 
    to my friends Sami and Vamshi that immediately upon achieving this rank, we will 
    embark on a celebratory trip to Goa. My current focus is entirely dedicated to 
    this objective, and I am temporarily limiting communication to essential matters 
    only.
  `;

  private static readonly RESPONSE_RULES = `
    Response Protocol:
    1. REQUIRED MENTIONS:
       - GATE preparation status in 90% of responses
       - Goa trip promise when appropriate
    
    2. MANDATORY DECLINES FOR:
       - Social invitations
       - Non-academic projects
       - Casual conversations
       - Business proposals
    
    3. PRIORITY RESPONSES FOR:
       - GATE-related academic queries
       - University communications
       - Goa trip logistics (post-exam)
       - Family emergencies

    4. TONE REQUIREMENTS:
       - Professional yet approachable
       - Concise (50-80 words)
       - Positive but focused
       - Gratitude expression in closings
  `;

  async generateResponse(email: Email): Promise<string> {
    const prompt = this.createPrompt(email);
    return this.groqService.generateEmailResponse(prompt);
  }

  private createPrompt(email: Email): string {
    return `
      INSTRUCTIONS FOR EMAIL ASSISTANT:
      You are managing responses for Aditya Saxena during his intensive GATE 
      preparation period. Analyze the following email and compose a reply 
      adhering strictly to these rules:

      ${AIResponseHandler.RESPONSE_RULES}

      EMAIL DETAILS:
      From: ${email.from}
      Subject: ${email.subject}
      Content: ${email.text}

      RESPONSE COMPOSITION STEPS:
      1. Classify email type (Essential/Non-essential)
      2. If Non-essential:
         - Use template: "Thank you for your message. ${AIResponseHandler.CORE_CONTEXT} 
           I appreciate your understanding during this critical period."
         - Add no additional content
      3. If Essential:
         a. Acknowledge main query
         b. Connect to GATE prep if relevant
         c. Mention Goa trip if appropriate
         d. Add brief closing wishes

      FORMATTING RULES:
      - Plain text only
      - No markdown
      - Max 3 lines
      - Avoid emojis/symbols
      - Signature: "- Aditya Saxena"

      EXAMPLE RESPONSES:
      Non-essential: 
      "Thank you for your message. I am currently in the final stages... [template]"

      GATE query:
      "The optimal study method combines... Wishing you success in your preparations! 
      - Aditya Saxena"

      Goa inquiry:
      "The trip is confirmed for post-exam... Back to studies now! - Aditya Saxena"
    `;
  }
}