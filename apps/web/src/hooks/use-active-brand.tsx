'use client';

import * as React from 'react';
import type { Brand } from '@workspace/db/schema';

// ============================================================
// ACTIVE BRAND CONTEXT
// Provides the current brand to all child components under
// /dashboard/brands/[brandId]/* routes
// ============================================================

const BrandContext = React.createContext<Brand | undefined>(undefined);

export function ActiveBrandProvider({
  brand,
  children,
}: React.PropsWithChildren<{ brand: Brand }>) {
  return (
    <BrandContext.Provider value={brand}>
      {children}
    </BrandContext.Provider>
  );
}

export function useActiveBrand() {
  const context = React.useContext(BrandContext);
  if (context === undefined) {
    throw new Error(
      'useActiveBrand must be used within an ActiveBrandProvider'
    );
  }
  return context;
}

// Optional: use this when you want to check if brand exists without throwing
export function useActiveBrandOptional() {
  return React.useContext(BrandContext);
}

