// Main compound component
export { default as Verification } from './Verification';

// Sub-components
export { VerificationFile } from './VerificationFile';
export { StatusBadge } from './StatusBadge';
export { ResultsPanel } from './ResultsPanel';

// Types
export type {
  VerificationType,
  FileUploadStatus,
  VerificationStatus,
  VerificationResult,
  VerificationState,
  VerificationFile as VerificationFileType
} from './types';