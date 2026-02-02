'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

// ============================================================
// TYPES
// ============================================================

export interface UploadedFile {
  key: string;
  appUrl: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface UseUploadFileProps {
  /**
   * Project/brand/entity ID for upload context
   */
  projectId?: string | null;
  /**
   * Called when upload completes successfully
   */
  onUploadComplete?: (file: UploadedFile) => void;
  /**
   * Called when upload fails
   */
  onUploadError?: (error: unknown) => void;
  /**
   * Called when upload begins
   */
  onUploadBegin?: (fileName: string) => void;
  /**
   * Called during upload with progress updates
   */
  onUploadProgress?: (opts: { progress: number }) => void;
}

// ============================================================
// HOOK
// ============================================================

export function useUploadFile({
  projectId,
  onUploadComplete,
  onUploadError,
  onUploadBegin,
  onUploadProgress,
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const uploadFile = React.useCallback(
    async (file: File): Promise<UploadedFile | undefined> => {
      // Check if projectId is available if required
      if (!projectId) {
        console.warn('[useUploadFile] No projectId provided - upload may fail if required by backend');
      }

      setIsUploading(true);
      setUploadingFile(file);
      setProgress(0);

      onUploadBegin?.(file.name);

      try {
        // Simulate progress
        setProgress(25);
        onUploadProgress?.({ progress: 25 });

        await new Promise((resolve) => setTimeout(resolve, 300));
        
        setProgress(50);
        onUploadProgress?.({ progress: 50 });

        await new Promise((resolve) => setTimeout(resolve, 300));
        
        setProgress(75);
        onUploadProgress?.({ progress: 75 });

        await new Promise((resolve) => setTimeout(resolve, 200));

        // TODO: Replace with actual upload API call
        // Example implementation:
        // const formData = new FormData();
        // formData.append('file', file);
        // if (projectId) formData.append('projectId', projectId);
        // const response = await fetch('/api/upload', { method: 'POST', body: formData });
        // const data = await response.json();
        
        // Mock successful upload response
        const mockAssetId = `asset-${Date.now()}`;
        const mockCdnUrl = URL.createObjectURL(file);

        setProgress(100);
        onUploadProgress?.({ progress: 100 });

        const uploadedFileData: UploadedFile = {
          key: mockAssetId,
          appUrl: mockCdnUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          url: mockCdnUrl,
        };

        setUploadedFile(uploadedFileData);
        onUploadComplete?.(uploadedFileData);

        return uploadedFileData;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        const message =
          errorMessage.length > 0
            ? errorMessage
            : 'Something went wrong, please try again later.';

        toast.error(message);
        onUploadError?.(error);

        return undefined;
      } finally {
        setProgress(0);
        setIsUploading(false);
        setUploadingFile(undefined);
      }
    },
    [projectId, onUploadBegin, onUploadComplete, onUploadError, onUploadProgress]
  );

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile,
    uploadingFile,
  };
}

// ============================================================
// HELPERS
// ============================================================

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message);
    return errors.join('\n');
  }
  if (err instanceof Error) {
    return err.message;
  }
  return unknownError;
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}
