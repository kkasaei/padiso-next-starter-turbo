'use client';

import * as React from 'react';

// ============================================================
// MEDIA UPLOAD CONTEXT
// Provides projectId to the upload hook for editor media uploads
// ============================================================

interface MediaUploadContextValue {
  projectId: string | null;
}

const MediaUploadContext = React.createContext<MediaUploadContextValue>({
  projectId: null,
});

export interface MediaUploadProviderProps {
  children: React.ReactNode;
  projectId: string;
}

export function MediaUploadProvider({
  children,
  projectId,
}: MediaUploadProviderProps) {
  const value = React.useMemo(
    () => ({
      projectId,
    }),
    [projectId]
  );

  return (
    <MediaUploadContext.Provider value={value}>
      {children}
    </MediaUploadContext.Provider>
  );
}

export function useMediaUploadContext() {
  const context = React.useContext(MediaUploadContext);
  return context;
}
