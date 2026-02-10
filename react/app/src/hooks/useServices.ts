import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_SERVICES } from '@/data/mockServices';

export interface ServiceCategory {
  id: string;
  name: string;
  name_hi?: string;
  name_bn?: string;
  name_gu?: string;
  description?: string;
  icon: string;
  color: string;
  is_active: boolean;
  display_order: number;
  localizedName?: string;
}

export function useServices() {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['services', language],
    queryFn: async () => {
      let dbData: any[] = [];

      try {
        const { data, error } = await db
          .collection('service_categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (!error && data) {
          dbData = data;
        }
      } catch (e) {
        console.warn('DB fetch failed, using mocks only.');
      }

      const mappedDbData = dbData.map((service) => ({
        ...service,
        localizedName:
          language === 'hi' ? service.name_hi || service.name :
            language === 'bn' ? service.name_bn || service.name :
              language === 'gu' ? service.name_gu || service.name :
                service.name,
      }));

      // Merge with MOCK_SERVICES to ensure all categories are represented
      return [...mappedDbData, ...MOCK_SERVICES];
    },
  });
}

export function useServiceById(id: string) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {


      const { data, error } = await db
        .collection('service_categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as ServiceCategory | null;
    },
    enabled: !!id,
  });
}
