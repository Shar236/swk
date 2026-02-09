import React, { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DocumentUploadProps {
  type: 'aadhaar' | 'pan' | 'skill-proof' | 'selfie';
  onUpload: (file: File) => void;
  onVerify: (result: boolean) => void;
  isVerified?: boolean;
  isLoading?: boolean;
  label: string;
  description: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  type,
  onUpload,
  onVerify,
  isVerified,
  isLoading = false,
  label,
  description
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        alert('Please upload an image or PDF file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }

      // Set file info
      setFileName(file.name);
      onUpload(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Auto-verify for demo purposes (in real app, this would be server-side)
      setTimeout(() => {
        onVerify(true);
      }, 1000);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment'; // Use camera
      fileInputRef.current.click();
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    if (isVerified === true) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (isVerified === false) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Verifying...';
    if (isVerified === true) return 'Verified';
    if (isVerified === false) return 'Verification failed';
    return 'Pending verification';
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium text-gray-900">{label}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isLoading ? 'bg-blue-100 text-blue-800' :
          isVerified === true ? 'bg-green-100 text-green-800' :
          isVerified === false ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {getStatusText()}
        </span>
      </div>

      <div className="space-y-3">
        {previewUrl && (
          <div className="relative">
            {type === 'selfie' ? (
              <img 
                src={previewUrl} 
                alt="Selfie preview" 
                className="w-full h-48 object-cover rounded-lg border"
              />
            ) : (
              <img 
                src={previewUrl} 
                alt={`${type} preview`} 
                className="w-full h-48 object-contain rounded-lg border"
              />
            )}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={type === 'selfie' ? 'image/*' : 'image/*,.pdf'}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>

          {type === 'selfie' && (
            <button
              onClick={handleCameraClick}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <Camera className="h-4 w-4" />
              Camera
            </button>
          )}
        </div>

        {fileName && (
          <p className="text-xs text-gray-500 truncate">
            Uploaded: {fileName}
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;