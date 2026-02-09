import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Clock, AlertTriangle, User, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

interface JobRequestCardProps {
  job: {
    id: string;
    address: string;
    city: string | null;
    description: string | null;
    base_price: number;
    worker_earning: number;
    is_emergency: boolean;
    is_instant: boolean;
    scheduled_at: string | null;
    created_at: string;
    customer?: {
      full_name: string;
      phone: string;
      avatar_url: string | null;
    };
    category?: {
      name: string;
      icon: string;
      color: string;
    };
  };
  onAccept: (jobId: string) => Promise<{ error: Error | null }>;
  onReject: (jobId: string) => Promise<{ error: Error | null }>;
  variant?: 'pending' | 'active';
}

export function JobRequestCard({ job, onAccept, onReject, variant = 'pending' }: JobRequestCardProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);
  
  const formattedTimeAgo = useMemo(() => {
    return formatDistanceToNow(new Date(job.created_at), { addSuffix: true });
  }, [job.created_at]);

  const handleAccept = async () => {
    setLoading('accept');
    try {
      await onAccept(job.id);
    } catch (error) {
      console.error('Error accepting job:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async () => {
    setLoading('reject');
    try {
      await onReject(job.id);
    } catch (error) {
      console.error('Error rejecting job:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
    >
      <Card className={job.is_emergency ? 'border-destructive/50 bg-destructive/5' : ''}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {job.category && (
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${job.category.color}20` }}
                >
                  {job.category.icon}
                </div>
              )}
              <div>
                <h3 className="font-semibold">{job.category?.name || 'Service'}</h3>
                <p className="text-sm text-muted-foreground">
                  {formattedTimeAgo}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-lg font-bold text-green-600">
                ₹{job.worker_earning}
              </span>
              {job.is_emergency && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Emergency
                </Badge>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 mb-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-muted-foreground line-clamp-2">
              {job.address}{job.city ? `, ${job.city}` : ''}
            </span>
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {job.description}
            </p>
          )}

          {/* Customer Info (for active jobs) */}
          {variant === 'active' && job.customer && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{job.customer.full_name}</p>
                <p className="text-sm text-muted-foreground">{job.customer.phone}</p>
              </div>
              <Button size="icon" variant="ghost" asChild>
                <a href={`tel:${encodeURIComponent(job.customer.phone)}`}>
                  <Phone className="w-4 h-4" />
                </a>
              </Button>
            </div>
          )}

          {/* Scheduled Time */}
          {job.scheduled_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Clock className="w-4 h-4" />
              <span>Scheduled: {new Date(job.scheduled_at).toLocaleString()}</span>
            </div>
          )}

          {/* Actions */}
          {variant === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleReject}
                disabled={loading !== null}
              >
                {loading === 'reject' ? 'Skipping...' : t('worker.reject')}
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleAccept}
                disabled={loading !== null}
              >
                {loading === 'accept' ? 'Accepting...' : t('worker.accept')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
