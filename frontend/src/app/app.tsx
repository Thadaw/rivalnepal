import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AccountPage } from "@/features/account/pages/account-page";
import {
  AdminAnalyticsPage,
  AdminCustomersPage,
  AdminDashboardPage,
  AdminDesignsPage,
  AdminInventoryPage,
  AdminLayout,
  AdminLoginPage,
  AdminNewsletterPage,
  AdminOrdersPage,
  AdminProductFormPage,
  AdminProductsPage,
  AdminProfilePage,
  AdminSettingsPage,
} from "@/app/lazy-admin";
import { AuthPage } from "@/features/auth/pages/auth-page";
import { CartPage } from "@/features/cart/pages/cart-page";
import { CategoriesPage } from "@/features/catalog/pages/categories-page";
import { HomePage } from "@/features/catalog/pages/home-page";
import { ProductDetailsPage } from "@/features/catalog/pages/product-details-page";
import { ShopPage } from "@/features/catalog/pages/shop-page";
import { CheckoutPage } from "@/features/checkout/pages/checkout-page";
import { OrderConfirmationPage } from "@/features/checkout/pages/order-confirmation-page";
import { BrandStoryPage } from "@/features/content/pages/brand-story-page";
import { LookbookPage } from "@/features/content/pages/lookbook-page";
import { PolicyPage } from "@/features/content/pages/policy-page";
import { TrackOrderPage } from "@/features/orders/pages/track-order-page";
import { MainLayout } from "@/shared/components/layout/MainLayout";

function AdminFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <p className="text-[10px] uppercase tracking-[.24em] text-black/30">Loading workspace…</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderConfirmationPage />} />
        <Route path="/track" element={<TrackOrderPage />} />
        <Route path="/story" element={<BrandStoryPage />} />
        <Route path="/lookbook" element={<LookbookPage />} />
        <Route path="/policies/:slug" element={<PolicyPage />} />
      </Route>
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="designs" element={<AdminDesignsPage />} />
        <Route path="newsletter" element={<AdminNewsletterPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
