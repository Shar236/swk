import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface OnlineToggleProps {
  isOnline: boolean;
  onToggle: (online: boolean) => Promise<void>;
  disabled?: boolean;
}

export function OnlineToggle({ isOnline, onToggle, disabled }: OnlineToggleProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await onToggle(!isOnline);
    setLoading(false);
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-xl transition-all duration-300',
        isOnline 
          ? 'bg-green-500/10 border border-green-500/30' 
          : 'bg-muted border border-border'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-3 h-3 rounded-full animate-pulse',
            isOnline ? 'bg-green-500' : 'bg-muted-foreground'
          )}
        />
        <div>
          <p className="font-medium">
            {isOnline ? t('worker.online') : t('worker.offline')}
          </p>
          <p className="text-sm text-muted-foreground">
            {isOnline 
              ? 'You are receiving job requests' 
              : 'Go online to receive jobs'}
          </p>
        </div>
      </div>
      
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <Switch
          checked={isOnline}
          onCheckedChange={handleToggle}
          disabled={disabled || loading}
          className="data-[state=checked]:bg-green-500"
        />
      )}
    </div>
  );
}
