import React, { useState } from 'react';
import { RotateCcw, Loader2 } from 'lucide-react';
import { 
  Verification, 
  VerificationFile, 
  StatusBadge, 
  ResultsPanel
} from '../verification';

const DocumentVerificationSystem = () => {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'processing' | 'verified' | 'failed'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean | null>>({
    docMatch: null,
    liveness: null,
    deviceFingerprint: null
  });

  const handleFileUpload = (type: string, file: File) => {
    console.log(`File uploaded: ${type} - ${file.name}`);
    // Handle file upload logic here
  };

  const triggerVerificationProcess = () => {
    setIsProcessing(true);
    setVerificationStatus('processing');
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationResults({
        docMatch: true,
        liveness: true,
        deviceFingerprint: true
      });
      setVerificationStatus('verified');
      setIsProcessing(false);
    }, 3000);
  };

  const resetVerification = () => {
    setVerificationResults({
      docMatch: null,
      liveness: null,
      deviceFingerprint: null
    });
    setVerificationStatus('pending');
    setIsProcessing(false);
  };

  const results = [
    {
      key: 'docMatch',
      label: 'Document Match',
      value: verificationResults.docMatch,
      description: {
        success: 'Face matched between documents and selfie',
        failure: 'Face did not match between documents',
        pending: 'Pending verification'
      }
    },
    {
      key: 'liveness',
      label: 'Liveness Check',
      value: verificationResults.liveness,
      description: {
        success: 'Verified as live person (not photo)',
        failure: 'Failed liveness check',
        pending: 'Pending verification'
      }
    },
    {
      key: 'deviceFingerprint',
      label: 'Device Security',
      value: verificationResults.deviceFingerprint,
      description: {
        success: 'Device verified as secure',
        failure: 'Security concerns detected',
        pending: 'Pending verification'
      }
    }
  ];

  return (
    <Verification onFileUpload={handleFileUpload}>
      <Verification.Header>
        <Verification.Title>Document Verification</Verification.Title>
        <Verification.Description>Upload your documents to verify your identity</Verification.Description>
        <div className="mt-4">
          <StatusBadge status={verificationStatus} />
        </div>
      </Verification.Header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <VerificationFile>
          {(file: File | null) => (
            <VerificationFile.Card
              file={file}
              label="Aadhaar Card"
              description="Upload front and back of your Aadhaar card"
              onRemove={() => console.log('Remove Aadhaar')}
            />
          )}
        </VerificationFile>

        <VerificationFile>
          {(file: File | null) => (
            <VerificationFile.Card
              file={file}
              label="PAN Card"
              description="Upload your PAN card"
              onRemove={() => console.log('Remove PAN')}
            />
          )}
        </VerificationFile>

        <VerificationFile>
          {(file: File | null) => (
            <VerificationFile.Card
              file={file}
              label="Skill Proof"
              description="Upload certificates or proof of skills (optional)"
              onRemove={() => console.log('Remove Skill Proof')}
            />
          )}
        </VerificationFile>

        <VerificationFile>
          {(file: File | null) => (
            <VerificationFile.Card
              file={file}
              label="Live Selfie"
              description="Take a live photo for identity verification"
              onRemove={() => console.log('Remove Selfie')}
            />
          )}
        </VerificationFile>
      </div>

      <ResultsPanel results={results} className="mb-6" />

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={triggerVerificationProcess}
          disabled={isProcessing || verificationStatus === 'verified'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Start Verification'
          )}
        </button>

        <button
          onClick={resetVerification}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </Verification>
  );
};

export default DocumentVerificationSystem;