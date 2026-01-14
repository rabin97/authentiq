export interface IUploadAadharPayload {
  file: File;
  fileName: string;
  fileSize: number;
}

export interface IUploadAadharResponse {
  fileName: string;
  url: string;
  fileSize: string;
}

export type AadhaarVerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "processing";

export interface AadhaarUploadRequest {
  file: File;
}

export interface AadhaarUploadResponse {
  success: boolean;
  data: {
    fileName: string;
    url: string;
    fileSize: string;
    status: AadhaarVerificationStatus;
    message?: string;
  };
  message?: string;
}
