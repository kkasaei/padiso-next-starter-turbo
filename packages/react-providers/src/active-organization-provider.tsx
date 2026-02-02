'use client';

import * as React from 'react';

// Generic organization type - apps can extend this with their own types
export interface Organization {
  id: string;
  name: string;
  [key: string]: any;
}

const OrganizationContext = React.createContext<Organization | undefined>(
  undefined
);

export function ActiveOrganizationProvider({
  organization,
  children
}: React.PropsWithChildren<{ organization: Organization }>) {
  return (
    <OrganizationContext.Provider value={organization}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useActiveOrganization() {
  const context = React.useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useActiveOrganization must be used within an ActiveOrganizationProvider'
    );
  }
  return context;
}

export function useActiveOrganizationOptional() {
  return React.useContext(OrganizationContext);
}
