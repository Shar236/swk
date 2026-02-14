import { v4 as uuidv4 } from 'uuid';
import { ChatContext } from './context-provider';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  messages: ChatMessage[];
}

export class AiApi {
  private chatHistory: ChatHistory = { messages: [] };
  private apiProvider: 'gemini' | 'mock' = 'mock';

  constructor() {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (geminiKey) {
      this.apiProvider = 'gemini';
      console.log('✅ Gemini API ready');
    } else {
      console.warn('⚠️ No Gemini API key found. Chatbot will use mock responses.');
      this.apiProvider = 'mock';
    }
  }

  async sendMessage(
    message: string,
    context: ChatContext,
    onStream?: (chunk: string) => void
  ): Promise<string> {
    const messageId = uuidv4();

    // Add user message to history
    this.addMessage({
      id: messageId,
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    try {
      // Find relevant content from PDFs
      const { pdfLoader } = await import('./pdf-loader');
      await pdfLoader.loadAllPdfs();
      const relevantChunks = pdfLoader.findRelevantContent(message);
      const pdfContext = relevantChunks.join('\n\n');

      if (this.apiProvider === 'gemini') {
        return this.sendToGemini(message, context, pdfContext);
      } else {
        return this.getMockResponse(message, context);
      }
    } catch (error) {
      console.error('AI API error:', error);
      return this.getMockResponse(message, context);
    }
  }

  private async sendToGemini(
    message: string,
    context: ChatContext,
    pdfContext: string
  ): Promise<string> {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiKey) throw new Error('Gemini key missing');

    const systemPrompt = `
      You are RAHI's intelligent assistant. Help users navigate the RAHI platform.
      
      Context:
      - Page: ${context.currentPage}
      - User: ${context.userStatus} (${context.userRole})
      - Location: ${context.location}
      - Services: ${context.availableServices.join(', ')}
      
      ${pdfContext ? `Relevant Info from Documentation:\n${pdfContext}\n` : ''}
      
      Guidelines:
      - Be helpful, concise, and professional.
      - Refer to the Documentation Context above if relevant.
      - Guide users to sections like /services, /login, or /tracking.
      - Keep responses under 100 words.
    `.trim();

    try {
      const requestBody = {
        contents: [{
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          responseMimeType: 'text/plain',
        }
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error response:', errorData);
        // If it's a 4xx error (like invalid key), fall back to mock without showing "brain" error
        if (response.status >= 400 && response.status < 500) {
          return this.getMockResponse(message, context);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error('Gemini API error:', data.error);
        return this.getMockResponse(message, context);
      }

      if (!data.candidates || data.candidates.length === 0) {
        return this.getMockResponse(message, context);
      }

      const firstCandidate = data.candidates[0];
      if (!firstCandidate.content || !firstCandidate.content.parts || firstCandidate.content.parts.length === 0) {
        return this.getMockResponse(message, context);
      }

      const assistantMessage = firstCandidate.content.parts[0].text || 'I apologize, I could not generate a response.';

      this.addMessage({
        id: uuidv4(),
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      });

      return assistantMessage;
    } catch (error) {
      console.error('Gemini fetch error:', error);
      // Fallback to mock instead of the scary "trouble connecting to my brain" message
      return this.getMockResponse(message, context);
    }
  }

  private getMockResponse(message: string, context: ChatContext): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('book') || lowerMessage.includes('hire') || lowerMessage.includes('electrician') || lowerMessage.includes('plumber') || lowerMessage.includes('carpenter')) {
      return "I can help you with that! To book a professional like an electrician, please go to our Services page at [/services](/services). You can select your location and choose from various experts!";
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('charge') || lowerMessage.includes('cost')) {
      return "Once you select a service and a worker from the [/services](/services) page, you will be guided to the booking summary where you can confirm details and proceed to secure payment.";
    }

    if (lowerMessage.includes('track') || lowerMessage.includes('where is my worker')) {
      return "You can track your active bookings in the [/tracking](/tracking) section. It will show you the real-time location of your assigned professional.";
    }

    if (lowerMessage.includes('login') || lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
      return "To access all features, please [/login](/login) or [/register](/register) for a new account. You can join as a Customer, Worker, or Partner!";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return "Namaste! I'm your RAHI Assistant. I can help you book services, track orders, or answer questions about our ethical platform. How can I guide you today? 🇮🇳";
    }

    if (lowerMessage.includes('about') || lowerMessage.includes('mission') || lowerMessage.includes('rahi')) {
      return "RAHI is an ethical gig-economy platform focused on worker dignity. We offer same-day payouts, low commissions (8-12%), and no penalties for workers. We're currently serving Tier-2 and Tier-3 cities.";
    }

    if (lowerMessage.includes('assist') || lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('what can you do')) {
      return "I can assist you with:\n1. Finding local professionals (Plumbers, Electricians, etc.)\n2. Tracking your active bookings\n3. Registering as a worker or customer\n\nSimply tell me what you need, like 'I need a plumber' or 'Where is my worker?'";
    }

    return "I'm here to help you navigate RAHI. You can find services at [/services](/services), track orders at [/tracking](/tracking), or log in at [/login](/login). What would you like to do?";
  }

  private addMessage(message: ChatMessage): void {
    this.chatHistory.messages.push(message);
    if (this.chatHistory.messages.length > 20) {
      this.chatHistory.messages = this.chatHistory.messages.slice(-20);
    }
  }

  getChatHistory(): ChatHistory {
    return { ...this.chatHistory };
  }

  getApiProvider() {
    return this.apiProvider;
  }
}

export const aiApi = new AiApi();