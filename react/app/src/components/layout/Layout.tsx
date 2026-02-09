import React, { ReactNode, Suspense } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';


// Dynamically import ChatAssistant to prevent it from breaking the entire app
const ChatAssistant = React.lazy(() => import('../chat/ChatAssistant').then(module => ({ default: module.ChatAssistant })));

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
          Wrapped in Suspense to prevent errors from breaking the entire app */}
      <Suspense fallback={null}>
        <ChatAssistant />
      </Suspense>

    </div>
  );
}