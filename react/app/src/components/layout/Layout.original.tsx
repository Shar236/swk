import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ChatAssistant } from '../chat/ChatAssistant';

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
}

export function Layout({ children, hideHeader, hideBottomNav }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && <Header />}
      <main className="pb-20 md:pb-0">{children}</main>
      {!hideBottomNav && <BottomNav />}
      
      {/* 
          This is the specialized RAHI Conversational Assistant.
          It uses ElevenLabs for Voice and Gemini for Brain.
      */}
      <ChatAssistant />
    </div>
  );
}
