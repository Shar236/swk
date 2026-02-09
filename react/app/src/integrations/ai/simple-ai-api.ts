import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  messages: ChatMessage[];
}

export interface ChatContext {
  currentPage: string;
  userStatus: 'authenticated' | 'unauthenticated';
  userRole: 'customer' | 'worker' | 'guest';
  availableServices: string[];
  location: string;
  language: string;
}

export class SimpleAiApi {
  private chatHistory: ChatHistory = { messages: [] };

  constructor() {
    console.log('✅ Simple AI API initialized (no external APIs)');
  }

  async sendMessage(
    message: string,
    context: ChatContext
  ): Promise<string> {
    const messageId = uuidv4();
    
    // Add user message to history
    this.addMessage({
      id: messageId,
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Simple keyword-based responses
    const response = this.getMockResponse(message, context);
    
    // Add assistant message to history
    this.addMessage({
      id: uuidv4(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    return response;
  }

  private getMockResponse(message: string, context: ChatContext): string {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm RAHI's assistant. How can I help you today? You can ask me about our services, how to book a professional, or learn more about RAHI.";
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('book')) {
      return "RAHI offers various services including Plumbing, Electrical work, Carpentry, Cleaning, Beauty services, and Tutoring. You can browse our services page to find the right professional for your needs. Would you like me to help you navigate to the services section?";
    }
    
    if (lowerMessage.includes('login') || lowerMessage.includes('account')) {
      return "You can access your account by clicking the login button in the top right corner. If you don't have an account yet, you can register for free. Having an account allows you to book services, track your bookings, and manage your preferences.";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "RAHI ensures transparent pricing. Each service provider displays their rates clearly. You can compare prices and choose the professional that fits your budget. All payments are secure and processed through our platform.";
    }
    
    if (lowerMessage.includes('worker') || lowerMessage.includes('professional')) {
      return "All RAHI professionals are verified through ID checks, skill assessments, and background verification. We ensure quality service delivery and maintain high standards for our network of service providers.";
    }
    
    if (lowerMessage.includes('track') || lowerMessage.includes('location')) {
      return "Once you book a service, you can track your service provider's location in real-time through our mobile app. This feature helps you know exactly when they'll arrive and plan accordingly.";
    }
    
    // Default response
    return "I'm here to help you with any questions about RAHI services. You can ask me about booking services, finding professionals, or learning more about our platform. What would you like to know?";
  }

  private addMessage(message: ChatMessage): void {
    this.chatHistory.messages.push(message);
    
    // Keep history to reasonable size
    if (this.chatHistory.messages.length > 20) {
      this.chatHistory.messages = this.chatHistory.messages.slice(-20);
    }
  }

  getChatHistory(): ChatHistory {
    return { ...this.chatHistory };
  }

  clearChatHistory(): void {
    this.chatHistory.messages = [];
  }

  getApiProvider(): string {
    return 'simple';
  }

  isApiEnabled(): boolean {
    return true;
  }
}

// Export singleton instance
export const simpleAiApi = new SimpleAiApi();