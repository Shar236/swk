import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { FileUploadStatus, VerificationType, VerificationResult } from './types';

// Context for shared state
interface VerificationContextType {
  status: Record<VerificationType, FileUploadStatus>;
  setStatus: (type: VerificationType, status: FileUploadStatus) => void;
  verificationResults: Record<string, boolean | null>;
  setVerificationResult: (key: string, value: boolean | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  onFileUpload: (type: VerificationType, file: File) => void;
}

const VerificationContext = createContext<VerificationContextType | null>(null);

const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('Verification components must be used within Verification.Provider');
  }
  return context;
};

// Main Compound Component
export const Verification = ({ 
  children, 
  onFileUpload 
}: { 
  children: ReactNode;
  onFileUpload?: (type: VerificationType, file: File) => void;
}) => {
  const [status, setStatus] = useState<Record<VerificationType, FileUploadStatus>>({
    aadhaar: 'pending',
    pan: 'pending',
    'skill-proof': 'pending',
    selfie: 'pending'
  });

  // Provide a controlled API for updating an individual verification status
  const updateStatus = (type: VerificationType, s: FileUploadStatus) => {
    setStatus(prev => ({ ...prev, [type]: s }));
  };
  
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean | null>>({
    docMatch: null,
    liveness: null,
    deviceFingerprint: null
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (type: VerificationType, file: File) => {
    setStatus(prev => ({ ...prev, [type]: 'uploaded' }));
    if (onFileUpload) onFileUpload(type, file);
  };

  const setVerificationResult = (key: string, value: boolean | null) => {
    setVerificationResults(prev => ({ ...prev, [key]: value }));
  };

  return (
    <VerificationContext.Provider value={{
      status,
      setStatus: updateStatus,
      verificationResults,
      setVerificationResult,
      isProcessing,
      setIsProcessing,
      onFileUpload: handleFileUpload
    }}>
      <div className="max-w-4xl mx-auto p-6">
        {children}
      </div>
    </VerificationContext.Provider>
  );
};

// Attach child components
Verification.Header = ({ children }: { children: ReactNode }) => (
  <div className="text-center mb-8">{children}</div>
);

Verification.Title = ({ children }: { children: ReactNode }) => (
  <h1 className="text-2xl font-bold text-gray-900 mb-2">{children}</h1>
);

Verification.Description = ({ children }: { children: ReactNode }) => (
  <p className="text-gray-600">{children}</p>
);

Verification.Status = ({ status }: { status: 'pending' | 'processing' | 'verified' | 'failed' }) => {
  // ... render appropriate status badge
  return null;
};

export default Verification;