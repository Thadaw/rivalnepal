import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adjustInventory,
  createAdminDesign,
  deleteAdminDesign,
  deleteAdminSubscriber,
  setAdminOrderStatus,
  updateAdminDesign,
  type AdjustReason,
  type AdminDesignInput,
} from "@/features/admin/api/admin.api";
import {
  createAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
  type AdminProductPatch,
} from "@/features/admin/api/products.api";
import { adminKeys } from "@/features/admin/hooks/use-admin-queries";
import { productKeys } from "@/features/catalog/hooks/use-products";
import type { OrderStatus } from "@/features/orders/types";
import type { Product } from "@/features/catalog/types";

function messageOf(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

/** Admin writes touch several screens, so each one refreshes the affected caches. */
export function useSetOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, to }: { id: string; to: OrderStatus }) => setAdminOrderStatus(id, to),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.orders });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: adminKeys.analytics });
      queryClient.invalidateQueries({ queryKey: adminKeys.inventory });
      queryClient.invalidateQueries({ queryKey: adminKeys.movements });
      toast.success(`Order ${order.id} marked ${order.status}.`);
    },
    onError: (error) => toast.error(messageOf(error, "Could not update that order.")),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { variantId: string; delta: number; reason: AdjustReason; note?: string }) =>
      adjustInventory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.inventory });
      queryClient.invalidateQueries({ queryKey: adminKeys.movements });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: adminKeys.products });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Stock updated.");
    },
    onError: (error) => toast.error(messageOf(error, "Could not adjust that stock.")),
  });
}

export function useSaveAdminDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: AdminDesignInput }) =>
      id ? updateAdminDesign(id, input) : createAdminDesign(input),
    onSuccess: (design, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.designs });
      toast.success(`${design.name} ${id ? "updated" : "created"}.`);
    },
    onError: (error) => toast.error(messageOf(error, "Could not save that design.")),
  });
}

export function useDeleteAdminDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminDesign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.designs });
      toast.success("Design deleted.");
    },
    onError: (error) => toast.error(messageOf(error, "Could not delete that design.")),
  });
}

export function useDeleteAdminSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscribers });
      toast.success("Subscriber removed.");
    },
    onError: (error) => toast.error(messageOf(error, "Could not remove that subscriber.")),
  });
}

export function useDeleteAdminProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminProduct(id),
    onSuccess: (_void, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success(`Product ${id} was removed from the catalogue.`);
    },
    onError: (error) => toast.error(messageOf(error, "Could not delete that product.")),
  });
}

export function useUpdateAdminProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: AdminProductPatch }) => updateAdminProduct(id, patch),
    onSuccess: (_void, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products });
      queryClient.invalidateQueries({ queryKey: adminKeys.product(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product saved.");
    },
    onError: (error) => toast.error(messageOf(error, "Could not save that product.")),
  });
}

export function useCreateAdminProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Product) => createAdminProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => toast.error(messageOf(error, "Could not create that product.")),
  });
}
