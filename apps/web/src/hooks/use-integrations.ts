"use client";

import { trpc } from "@/lib/trpc/client";

/**
 * Hooks for managing integrations with tRPC
 */

export function useIntegrations(brandId: string) {
  return trpc.integrations.getByBrand.useQuery(
    { brandId },
    { enabled: !!brandId }
  );
}

export function useIntegration(id: string) {
  return trpc.integrations.getById.useQuery(
    { id },
    { enabled: !!id }
  );
}

export function useConnectIntegration() {
  const utils = trpc.useUtils();

  return trpc.integrations.connect.useMutation({
    onSuccess: (data) => {
      utils.integrations.getByBrand.invalidate({ brandId: data.brandId });
    },
  });
}

export function useDisconnectIntegration() {
  const utils = trpc.useUtils();

  return trpc.integrations.disconnect.useMutation({
    onSuccess: (_, variables) => {
      utils.integrations.getByBrand.invalidate({ brandId: variables.brandId });
    },
  });
}

export function useUpdateIntegration() {
  const utils = trpc.useUtils();

  return trpc.integrations.update.useMutation({
    onSuccess: (data) => {
      utils.integrations.getByBrand.invalidate({ brandId: data.brandId });
      utils.integrations.getById.invalidate({ id: data.id });
    },
  });
}

export function useDeleteIntegration() {
  const utils = trpc.useUtils();

  return trpc.integrations.delete.useMutation({
    onSuccess: () => {
      // Note: We don't have brandId in the response, so we invalidate all
      utils.integrations.getByBrand.invalidate();
    },
  });
}
