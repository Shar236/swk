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
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('Gemini API error:', data.error);
        return "I'm having trouble processing your request. Please try again.";
      }
      
      if (!data.candidates || data.candidates.length === 0) {
        console.warn('No candidates in Gemini response:', data);
        return "I'm not sure how to respond to that. Could you rephrase your question?";
      }
      
      const firstCandidate = data.candidates[0];
      if (!firstCandidate.content || !firstCandidate.content.parts || firstCandidate.content.parts.length === 0) {
        console.warn('No content parts in Gemini response:', data);
        return "I understood your question but couldn't generate a response. Could you try asking differently?";
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
      return "I'm having trouble connecting to my brain right now. Can I help you with basic navigation?";
    }
  }

  private getMockResponse(message: string, context: ChatContext): string {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('service') || lowerMessage.includes('book') || lowerMessage.includes('electrician')) {
      return "I can help you book an electrician! Please visit our services page to browse professionals and make a booking.";
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return "Hello! I'm your RAHI Assistant. I can help you book services, track orders, or answer questions about our platform.";
    }
    return "I am the RAHI Assistant. How can I help you navigate our platform today?";
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