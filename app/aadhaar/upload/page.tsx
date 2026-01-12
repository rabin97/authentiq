"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { IdCard, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAadhaarUpload } from "@/lib/api/hooks/use-aadhaar-upload";
import type { AadhaarUploadResponse } from "@/lib/api/types/aadhar";

export default function AadhaarUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] =
    useState<AadhaarUploadResponse | null>(null);

  const uploadMutation = useAadhaarUpload();

  useEffect(() => {
    // Reset success message after 5 seconds
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleFileError = (error: string) => {
    setUploadError(error);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploadError(null);
    setUploadSuccess(null);

    try {
      const response = await uploadMutation.mutateAsync({
        file: selectedFile,
      });

      if (response.success) {
        setUploadSuccess(response);
        // Optionally reset the file after successful upload
        // setSelectedFile(null);
      } else {
        setUploadError(response.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during upload. Please try again.";
      setUploadError(errorMessage);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const isLoading = uploadMutation.isPending;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Aadhaar Upload</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col gap-6">
            {/* Page Title */}
            <div className="flex items-center gap-3">
              <IdCard className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Aadhaar Verification</h1>
            </div>

            {/* Upload Section */}
            <div className="bg-muted/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Upload Aadhaar Document
              </h2>
              <p className="text-muted-foreground mb-6">
                Upload your Aadhaar document for verification and processing.
                Supported formats: PNG, JPG, JPEG (Max 5 MB)
              </p>

              {/* File Upload Component */}
              <FileUpload
                accept="image/png,image/jpeg,image/jpg"
                maxSize={5 * 1024 * 1024} // 5 MB
                onFileSelect={handleFileSelect}
                onError={handleFileError}
                preview={true}
                value={selectedFile}
                disabled={isLoading}
              />

              {/* Success Message */}
              {uploadSuccess && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Upload Successful!
                    </p>
                    {uploadSuccess.data?.message && (
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {uploadSuccess.data.message}
                      </p>
                    )}
                    {uploadSuccess.data?.status && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Status: {uploadSuccess.data.status}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      {uploadError}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile || isLoading}
                  className="min-w-35"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Verify Aadhaar"
                  )}
                </Button>
                {(selectedFile || uploadSuccess) && !isLoading && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
