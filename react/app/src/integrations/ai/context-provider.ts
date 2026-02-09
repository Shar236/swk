import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { pdfLoader, KnowledgeBase } from './pdf-loader';

export interface ChatContext {
  currentPage: string;
  userStatus: 'authenticated' | 'unauthenticated';
  userRole: 'customer' | 'worker' | 'guest';
  availableServices: string[];
  location: string;
  language: string;
  knowledgeBase: KnowledgeBase | null;
}

export class ContextProvider {
  async getChatContext(): Promise<ChatContext> {
    // This would typically be called from a React component
    // For now, we'll return a default context
    const knowledgeBase = await pdfLoader.loadAllPdfs();

    return {
      currentPage: 'home', // This would come from useLocation()
      userStatus: 'unauthenticated', // This would come from useAuth()
      userRole: 'guest', // This would come from useAuth()
      availableServices: [
        'Plumbing',
        'Electrical',
        'Carpentry',
        'Cleaning',
        'Beauty Services',
        'Tutoring'
      ],
      location: 'Delhi-NCR', // This would come from location context
      language: 'en', // This would come from useLanguage()
      knowledgeBase
    };
  }

  generateSystemPrompt(context: ChatContext): string {
    const {
      currentPage,
      userStatus,
      userRole,
      availableServices,
      location,
      language,
      knowledgeBase
    } = context;

    const servicesList = availableServices.join(', ');
    const knowledgeSummary = knowledgeBase?.documents
      .map(doc => `- ${doc.title}: ${doc.content.substring(0, 100)}...`)
      .join('\n') || 'No knowledge base loaded';

    return `
      You are RAHI's intelligent assistant, here to help users navigate the RAHI platform and understand our services.
      
      Current Context:
      - Page: ${currentPage}
      - User Status: ${userStatus}
      - User Role: ${userRole}
      - Location: ${location}
      - Language: ${language}
      - Available Services: ${servicesList}

      RAHI Knowledge Base:
      ${knowledgeSummary}

      Your Role:
      1. Help users navigate the website and find relevant services
      2. Answer questions about RAHI's mission, services, and processes
      3. Guide users through booking services and using platform features
      4. Provide information about worker verification, pricing, and service quality
      5. Assist with account-related queries (login, registration, profile management)

      Response Guidelines:
      - Be friendly, helpful, and conversational
      - Use the knowledge base to provide accurate information about RAHI
      - Guide users to specific pages or actions when relevant
      - If you don't know something, suggest they contact support
      - Keep responses concise but informative
      - Always respect the user's language preference

      Platform Navigation:
      - Home: Main landing page with services overview
      - Services: Browse and search available services
      - Bookings: View and manage service bookings
      - Profile: User account and settings
      - Login/Register: Authentication pages

      Key Features to Highlight:
      - Verified professionals with quality assurance
      - Real-time tracking of service providers
      - Secure payment processing
      - Transparent pricing
      - 24/7 customer support
      - Rating and feedback system
    `.trim();
  }

  // This would be used in the React component
  useChatContext() {
    const location = useLocation();
    const { user, profile } = useAuth();
    const { language } = useLanguage();

    const currentPage = this.getCurrentPageName(location.pathname);
    const userStatus = user ? 'authenticated' : 'unauthenticated';
    const userRole = profile?.role || 'guest';

    return {
      currentPage,
      userStatus,
      userRole,
      location: 'Delhi-NCR', // In a real implementation, this would come from location context
      language,
      // knowledgeBase would be loaded asynchronously
    };
  }

  private getCurrentPageName(pathname: string): string {
    const pageMap: Record<string, string> = {
      '/': 'Home',
      '/services': 'Services',
      '/login': 'Login',
      '/register': 'Register',
      '/bookings': 'Bookings',
      '/profile': 'Profile'
    };

    return pageMap[pathname] || 'Unknown';
  }
}

// Export singleton instance
export const contextProvider = new ContextProvider();