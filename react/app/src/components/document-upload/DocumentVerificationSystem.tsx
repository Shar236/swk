import React, { useState, useRef } from 'react';
import { Camera, CheckCircle, XCircle, AlertCircle, Loader2, Eye, RotateCcw } from 'lucide-react';
import DocumentUpload from '@/components/document-upload/DocumentUpload';

interface VerificationResult {
  docMatch: boolean | null; // Face match between doc and selfie
  liveness: boolean | null; // Liveness check result
  deviceFingerprint: boolean | null; // Device fingerprinting result
}

const DocumentVerificationSystem = () => {
  const [verificationResults, setVerificationResults] = useState<VerificationResult>({
    docMatch: null,
    liveness: null,
    deviceFingerprint: null
  });
  
  const [uploadedDocuments, setUploadedDocuments] = useState({
    aadhaar: null as File | null,
    pan: null as File | null,
    skillProof: null as File | null,
    selfie: null as File | null
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

  const handleDocumentUpload = (type: keyof typeof uploadedDocuments, file: File) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleVerification = (type: keyof typeof verificationResults, result: boolean) => {
    setVerificationResults(prev => ({
      ...prev,
      [type]: result
    }));
  };

  const triggerVerificationProcess = () => {
    if (!uploadedDocuments.selfie) {
      alert('Please upload a selfie first');
      return;
    }

    setIsProcessing(true);

    // Simulate verification process
    setTimeout(() => {
      // In a real app, this would be server-side verification
      setVerificationResults({
        docMatch: true, // Simulated successful verification
        liveness: true,
        deviceFingerprint: true
      });

      // Overall status
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
  };

  const getStatusBadge = () => {
    if (isProcessing) {
      return (
        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Verifying...</span>
        </div>
      );
    }

    if (verificationStatus === 'verified') {
      return (
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Fully Verified</span>
        </div>
      );
    }

    if (verificationStatus === 'failed') {
      return (
        <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
          <XCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Verification Failed</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Partially Verified</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Verification</h1>
        <p className="text-gray-600">Upload your documents to verify your identity</p>
        <div className="mt-4">
          {getStatusBadge()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DocumentUpload
          type="aadhaar"
          label="Aadhaar Card"
          description="Upload front and back of your Aadhaar card"
          onUpload={(file) => handleDocumentUpload('aadhaar', file)}
          onVerify={(result) => handleVerification('docMatch', result)}
          isVerified={verificationResults.docMatch ?? undefined}
          isLoading={isProcessing && uploadedDocuments.aadhaar !== null}
        />

        <DocumentUpload
          type="pan"
          label="PAN Card"
          description="Upload your PAN card"
          onUpload={(file) => handleDocumentUpload('pan', file)}
          onVerify={(result) => handleVerification('docMatch', result)}
          isVerified={verificationResults.docMatch ?? undefined}
          isLoading={isProcessing && uploadedDocuments.pan !== null}
        />

        <DocumentUpload
          type="skill-proof"
          label="Skill Proof"
          description="Upload certificates or proof of skills (optional)"
          onUpload={(file) => handleDocumentUpload('skillProof', file)}
          onVerify={(result) => {}}
          isVerified={undefined}
          isLoading={false}
        />

        <DocumentUpload
          type="selfie"
          label="Live Selfie"
          description="Take a live photo for identity verification"
          onUpload={(file) => handleDocumentUpload('selfie', file)}
          onVerify={(result) => handleVerification('liveness', result)}
          isVerified={verificationResults.liveness ?? undefined}
          isLoading={isProcessing && uploadedDocuments.selfie !== null}
        />
      </div>

      {/* Verification Results Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {verificationResults.docMatch === true ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : verificationResults.docMatch === false ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
              <h3 className="font-medium">Document Match</h3>
            </div>
            <p className="text-sm text-gray-600">
              {verificationResults.docMatch === true 
                ? 'Face matched between documents and selfie' 
                : verificationResults.docMatch === false 
                ? 'Face did not match between documents' 
                : 'Pending verification'}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {verificationResults.liveness === true ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : verificationResults.liveness === false ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
              <h3 className="font-medium">Liveness Check</h3>
            </div>
            <p className="text-sm text-gray-600">
              {verificationResults.liveness === true 
                ? 'Verified as live person (not photo)' 
                : verificationResults.liveness === false 
                ? 'Failed liveness check' 
                : 'Pending verification'}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {verificationResults.deviceFingerprint === true ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : verificationResults.deviceFingerprint === false ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
              <h3 className="font-medium">Device Security</h3>
            </div>
            <p className="text-sm text-gray-600">
              {verificationResults.deviceFingerprint === true 
                ? 'Device verified as secure' 
                : verificationResults.deviceFingerprint === false 
                ? 'Security concerns detected' 
                : 'Pending verification'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={triggerVerificationProcess}
          disabled={
            isProcessing || 
            !uploadedDocuments.aadhaar || 
            !uploadedDocuments.pan || 
            !uploadedDocuments.selfie ||
            verificationStatus === 'verified'
          }
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
    </div>
  );
};

export default DocumentVerificationSystem;