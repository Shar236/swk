export type VerificationType = 'aadhaar' | 'pan' | 'skill-proof' | 'selfie';

export type FileUploadStatus = 'pending' | 'uploaded' | 'verified' | 'failed';

export type VerificationStatus = 'pending' | 'processing' | 'verified' | 'failed';

export interface VerificationResult {
  docMatch: boolean | null;
  liveness: boolean | null;
  deviceFingerprint: boolean | null;
}

export interface VerificationState {
  status: Record<VerificationType, FileUploadStatus>;
  verificationResults: Record<string, boolean | null>;
  isProcessing: boolean;
}

export interface VerificationFile {
  type: VerificationType;
  label: string;
  description: string;
  required: boolean;
  verifyType: 'docMatch' | 'liveness' | 'device' | null;
}