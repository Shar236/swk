import { ReactNode } from 'react';
import { MinimalChat } from '@/components/MinimalChat';

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 md:pb-0">{children}</main>
      
      {/* Minimal Chat Test */}
      <MinimalChat />
    </div>
  );
}