import { useState, useEffect } from 'react';
import { MessageCircle, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AiChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
  isVoiceEnabled?: boolean;
  onVoiceToggle?: () => void;
  isVoiceActive?: boolean;
}

export function AiChatButton({
  isOpen,
  onToggle,
  unreadCount = 0,
  isVoiceEnabled = false,
  onVoiceToggle,
  isVoiceActive = false
}: AiChatButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (unreadCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Voice toggle button */}
      {isVoiceEnabled && (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/80 backdrop-blur border border-border shadow-lg hover:bg-accent transition-all"
          onClick={onVoiceToggle}
          aria-label={isVoiceActive ? "Disable voice" : "Enable voice"}
        >
          {isVoiceActive ? (
            <Volume2 className="h-4 w-4 text-primary" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      )}

      {/* Main chat button */}
      <Button
        variant="default"
        size="lg"
        className={cn(
          "relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group",
          isAnimating && "animate-bounce"
        )}
        onClick={onToggle}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center font-medium animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </Button>
    </div>
  );
}