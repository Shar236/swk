import { ReactNode } from 'react';
import { Header } from './Header';
import { MinimalChat } from '@/components/MinimalChat';

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
}

export function Layout({ children, hideHeader }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && <Header />}
      <main className="pb-20 md:pb-0">{children}</main>
      
      {/* Minimal Chat Test */}
      <MinimalChat />
    </div>
  );
}