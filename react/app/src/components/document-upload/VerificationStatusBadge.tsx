import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';

interface VerificationStatusBadgeProps {
  status: 'verified' | 'pending' | 'failed' | 'processing';
  size?: 'sm' | 'md' | 'lg';
}

const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle className={`${iconSize[size]} text-green-600`} />,
          text: 'Verified',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'pending':
        return {
          icon: <AlertCircle className={`${iconSize[size]} text-yellow-600`} />,
          text: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'failed':
        return {
          icon: <XCircle className={`${iconSize[size]} text-red-600`} />,
          text: 'Failed',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'processing':
        return {
          icon: <Loader2 className={`${iconSize[size]} animate-spin text-blue-600`} />,
          text: 'Processing',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          icon: <AlertCircle className={`${iconSize[size]} text-gray-600`} />,
          text: 'Unknown',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`
      inline-flex items-center gap-1.5 rounded-full border font-medium
      ${sizeClasses[size]} ${config.bgColor} ${config.textColor} ${config.borderColor}
    `}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export default VerificationStatusBadge;