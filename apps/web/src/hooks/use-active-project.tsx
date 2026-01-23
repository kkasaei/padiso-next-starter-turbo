'use client';

import * as React from 'react';
import type { ProjectDto } from '@/lib/shcmea/types/dtos/project-dto';

// ============================================================
// ACTIVE PROJECT CONTEXT
// Provides the current project to all child components under
// /dashboard/projects/[projectId]/* routes
// ============================================================

const ProjectContext = React.createContext<ProjectDto | undefined>(undefined);

export function ActiveProjectProvider({
  project,
  children,
}: React.PropsWithChildren<{ project: ProjectDto }>) {
  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useActiveProject() {
  const context = React.useContext(ProjectContext);
  if (context === undefined) {
    throw new Error(
      'useActiveProject must be used within an ActiveProjectProvider'
    );
  }
  return context;
}

// Optional: use this when you want to check if project exists without throwing
export function useActiveProjectOptional() {
  return React.useContext(ProjectContext);
}

