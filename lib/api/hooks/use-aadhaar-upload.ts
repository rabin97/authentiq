"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../client";
import { queryKeys } from "../query-keys";
import type {
  AadhaarUploadRequest,
  AadhaarUploadResponse,
} from "../types/aadhar";

export function useAadhaarUpload() {
  return useMutation<AadhaarUploadResponse, Error, AadhaarUploadRequest>({
    mutationKey: queryKeys.aadhaar.upload(),
    mutationFn: async (request: AadhaarUploadRequest) => {
      const formData = new FormData();
      formData.append("file", request.file);

      const response = await apiClient.uploadFile<AadhaarUploadResponse>(
        "/aadhaar/upload",
        formData
      );

      return response;
    },
  });
}
