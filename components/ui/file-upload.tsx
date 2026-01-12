"use client";

import * as React from "react";
import { Upload, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import Image from "next/image";

export interface FileUploadProps {
  readonly accept?: string;
  readonly maxSize?: number;
  readonly onFileSelect?: (file: File | null) => void;
  readonly onError?: (error: string) => void;
  readonly preview?: boolean;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly value?: File | null;
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;
const DEFAULT_ACCEPT = "image/png,image/jpeg,image/jpg";

export function FileUpload({
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  onFileSelect,
  onError,
  preview = true,
  className,
  disabled = false,
  value,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(
    value || null
  );
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFilePreview = React.useCallback((file: File) => {
    setPreviewUrl((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return URL.createObjectURL(file);
    });
  }, []);

  React.useEffect(() => {
    if (value !== selectedFile) {
      setSelectedFile(value || null);
      if (value) {
        handleFilePreview(value);
      } else if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [value, selectedFile, previewUrl, handleFilePreview]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file: File): string | null => {
    const allowedTypes = accept.split(",").map((type) => type.trim());
    const isValidType = allowedTypes.some((type) => {
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      const regex = new RegExp(type.replace("*", ".*"));
      return file.type === type || regex.exec(file.type) !== null;
    });

    if (!isValidType) {
      return `Invalid file type. Please upload ${accept}`;
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      return `File size exceeds ${maxSizeMB} MB limit`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (onError) {
        onError(validationError);
      }
      return;
    }

    setSelectedFile(file);
    if (preview) {
      handleFilePreview(file);
    }
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            handleClick();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload area"
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragging && !disabled
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="space-y-4">
            {preview && previewUrl && (
              <div className="relative mx-auto max-w-md">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  height={100}
                  width={100}
                  className="max-h-64 w-full object-contain rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRemove(e as unknown as React.MouseEvent);
                    }
                  }}
                  className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-background rounded-full border shadow-sm"
                  aria-label="Remove file"
                  tabIndex={0}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <FileImage className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleRemove(e as unknown as React.MouseEvent);
                  }
                }}
                className="ml-2 p-1 hover:bg-muted rounded"
                aria-label="Remove file"
                tabIndex={0}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              disabled={disabled}
            >
              Change File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium mb-1">
                Drag and drop your file here
              </p>
              <p className="text-sm text-muted-foreground mb-2">or</p>
              <Button type="button" variant="outline" disabled={disabled}>
                Browse Files
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported: PNG, JPG, JPEG (Max {formatFileSize(maxSize)})
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
