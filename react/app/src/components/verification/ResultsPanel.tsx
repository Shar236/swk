import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface VerificationResult {
  key: string;
  label: string;
  description: {
    success: string;
    failure: string;
    pending: string;
  };
  value: boolean | null;
}

interface ResultsPanelProps {
  results: VerificationResult[];
  className?: string;
}

export const ResultsPanel = ({ results, className = '' }: ResultsPanelProps) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((result) => {
          const getStatusIcon = () => {
            if (result.value === true) {
              return <CheckCircle className="h-5 w-5 text-green-500" />;
            } else if (result.value === false) {
              return <XCircle className="h-5 w-5 text-red-500" />;
            }
            return <AlertCircle className="h-5 w-5 text-gray-400" />;
          };

          const getDescription = () => {
            if (result.value === true) return result.description.success;
            if (result.value === false) return result.description.failure;
            return result.description.pending;
          };

          return (
            <div key={result.key} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon()}
                <h3 className="font-medium">{result.label}</h3>
              </div>
              <p className="text-sm text-gray-600">
                {getDescription()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};