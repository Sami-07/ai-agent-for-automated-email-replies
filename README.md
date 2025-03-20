# Email AI Agent

An automated email assistant that monitors an inbox, processes incoming emails, filters spam, and generates personalized AI-powered responses based on predefined rules and contexts.

## Overview

Email AI Agent is a Node.js application that connects to a Gmail inbox, continually polls for new messages, and automatically responds to them using an AI language model. The agent is specifically configured to respond on behalf of a user.

## Architecture

![Architecture](https://github.com/user-attachments/assets/b78471ac-7da6-4834-b716-e1482b248985)

## Features

- **Email Monitoring**: Continuously checks for new emails in a Gmail inbox
- **Spam Filtering**: Identifies and filters out potential spam messages
- **AI-Powered Responses**: Generates contextually appropriate responses using the Groq API
- **Personalized Context**: Maintains a consistent persona and response style
- **Automated Reply System**: Sends responses without requiring manual intervention

## System Architecture

The application follows a modular architecture with the following key components:

### Core Components

1. **Email Service**: Handles email polling, fetching, and sending replies
2. **Groq Service**: Integrates with the Groq AI API to generate responses
3. **Handlers**: Process emails and manage the response generation workflow

### Directory Structure

```
src/
├── config/         # Configuration settings
├── handlers/       # Email and AI response handlers
├── services/       # Core services (Email, Groq)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions and logging
└── index.ts        # Application entry point
```

## Core Components

### Email Service

Responsible for:
- Connecting to Gmail using IMAP protocol
- Polling for new emails at regular intervals
- Parsing email content
- Sending automated responses

### Groq Service

Manages interactions with the Groq API:
- Formats prompts for AI response generation
- Sends requests to the AI model
- Processes and returns generated responses

### Handlers

- **EmailHandler**: Main orchestrator that coordinates email processing workflow
- **SpamHandler**: Filters out spam based on keywords
- **AIResponseHandler**: Creates contextual prompts and manages the response generation

## Configuration

The application uses environment variables for configuration:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
GROQ_API_KEY=your-groq-api-key
EMAIL_POLL_INTERVAL=3000  # Optional, defaults to 3000ms
GROQ_MODEL=mixtral-8x7b-32768  # Optional
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the required configuration
4. Build the application:
   ```
   npm run build
   ```
5. Start the application:
   ```
   npm start
   ```

## Development

For development, you can use:
```
npm run dev
```

This will start the application using ts-node for quick iteration.



## Technical Stack

- **Node.js**: Runtime environment
- **TypeScript**: Programming language
- **IMAP**: Protocol for email retrieval
- **Nodemailer**: Library for sending emails
- **Groq API**: AI service for generating responses

## Security Considerations

- The application requires email credentials stored in environment variables
- It's recommended to use app-specific passwords rather than primary account passwords
- For production use, implement additional error handling and security measures
