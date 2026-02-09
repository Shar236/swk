import React, { type ReactNode, useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import type { FileUploadStatus, VerificationType } from './types';

interface FileComponentProps {
  type: VerificationType;
  label: string;
  description: string;
  required?: boolean;
  status: FileUploadStatus;
  onFileUpload: (file: File) => void;
  onVerify?: (result: boolean) => void;
  isLoading?: boolean;
  isVerified?: boolean | null;
}

// Sub-components using compound component pattern
export const VerificationFile = ({ 
  children 
}: { 
  children: (file: File | null) => ReactNode 
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setFile(file);
  };

  return <div>{children(file)}</div>;
};

// File card display
VerificationFile.Card = ({
  file,
  label,
  description,
  onRemove,
  className = ""
}: {
  file: File | null;
  label: string;
  description: string;
  onRemove: () => void;
  className?: string;
}) => {
  return (
    <div className={`border-2 border-dashed rounded-xl p-4 ${file ? 'border-blue-200' : 'border-gray-200'} hover:border-blue-300 transition-colors ${className}`}>
      {file ? (
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <h3 className="font-medium">{file.name}</h3>
          <button
            type="button"
            onClick={onRemove}
            className="mt-2 text-sm text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <h3 className="font-medium text-gray-700">{label}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          {description === 'Upload certificates or proof of skills (optional)' ? 
            <p className="text-xs text-yellow-500">(optional)</p> : 
            <p className="text-xs text-blue-500">(required)</p>
          }
        </div>
      )}
    </div>
  );
};