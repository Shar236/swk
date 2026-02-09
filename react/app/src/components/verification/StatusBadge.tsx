import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { VerificationStatus } from './types';

interface StatusBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium";
  
  switch (status) {
    case 'processing':
      return (
        <div className={`${baseClasses} bg-blue-100 text-blue-800 ${className}`}>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Verifying...</span>
        </div>
      );
    
    case 'verified':
      return (
        <div className={`${baseClasses} bg-green-100 text-green-800 ${className}`}>
          <CheckCircle className="h-4 w-4" />
          <span>Fully Verified</span>
        </div>
      );
    
    case 'failed':
      return (
        <div className={`${baseClasses} bg-red-100 text-red-800 ${className}`}>
          <XCircle className="h-4 w-4" />
          <span>Verification Failed</span>
        </div>
      );
    
    case 'pending':
    default:
      return (
        <div className={`${baseClasses} bg-yellow-100 text-yellow-800 ${className}`}>
          <AlertCircle className="h-4 w-4" />
          <span>Partially Verified</span>
        </div>
      );
  }
};