import { useNavigate } from 'react-router-dom';
import { Users, Home, Briefcase, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const roles = [
  {
    id: 'worker',
    icon: Users,
    color: 'bg-amber-500',
    borderColor: 'hover:border-amber-500',
  },
  {
    id: 'customer',
    icon: Home,
    color: 'bg-primary',
    borderColor: 'hover:border-primary',
  },
  {
    id: 'thekedar',
    icon: Briefcase,
    color: 'bg-emerald-500',
    borderColor: 'hover:border-emerald-500',
  },
  {
    id: 'partner',
    icon: Building2,
    color: 'bg-purple-500',
    borderColor: 'hover:border-purple-500',
  },
];

export function RoleSelection() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleRoleSelect = (role: string) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <section className="py-16 px-4">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {language === 'hi' ? 'आप कौन हैं?' : 'Who are you?'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'hi' ? 'अपनी भूमिका चुनें और शुरू करें' : 'Choose your role to get started'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {roles.map((role, index) => (
            <Card
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={cn(
                'group cursor-pointer border-2 transition-all duration-300',
                'hover:shadow-lg hover:-translate-y-1',
                role.borderColor,
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className={cn(
                  'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110',
                  role.color
                )}>
                  <role.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {t(`role.${role.id}`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`role.${role.id}.desc`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-12 py-6 text-lg rounded-xl"
          >
            {t('auth.login')}
          </Button>
        </div>
      </div>
    </section>
  );
}
