import { Button } from '@/components/ui/button';
import { useLanguage, languageOptions, Language } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'pills' | 'dropdown';
  className?: string;
}

export function LanguageSelector({ variant = 'pills', className }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap gap-2 justify-center', className)}>
        {languageOptions.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage(lang.code as Language)}
            className={cn(
              'rounded-full px-4 transition-all duration-200',
              language === lang.code && 'scale-105'
            )}
          >
            {lang.nativeName}
          </Button>
        ))}
      </div>
    );
  }

  return null;
}
