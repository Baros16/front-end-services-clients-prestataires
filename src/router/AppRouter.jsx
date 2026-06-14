// src/router/AppRouter.jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthGuard } from "./AuthGuard";
import { ProviderLayout } from "../components/layouts/ProviderLayout";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { ClientLayout } from "../components/layouts/ClientLayout";
import { Spinner } from "../components/commons/Spinner";

/**
 * AppRouter
 * Toutes les routes de l'application ServiLoc.
 *
 * Lazy loading : chaque page est chargée à la demande.
 * Le Suspense affiche un spinner pendant le chargement du chunk.
 *
 * Structure :
 *  /                    → SmartRedirect (redirige selon le rôle)
 *  /auth/*              → pages publiques (pas de layout)
 *  /client/*            → ClientLayout + AuthGuard CLIENT
 *  /provider/*          → ProviderLayout + AuthGuard PROVIDER
 *  /admin/*             → AdminLayout + AuthGuard ADMIN | SERVICE_CLIENT
 *  *                    → page 404
 */

// ─── Lazy imports — Auth ─────────────────────────────────────────────────────
const RegisterPage    = lazy(() => import("../pages/auth/RegisterPage"));
const LoginPage       = lazy(() => import("../pages/auth/LoginPage"));
const AdminLoginPage  = lazy(() => import("../pages/auth/AdminLoginPage"));
const OtpPage         = lazy(() => import("../pages/auth/OtpPage"));

// ─── Lazy imports — Client ───────────────────────────────────────────────────
const ClientDashboard    = lazy(() => import("../pages/client/ClientDashboard"));
const NouvelleDemande    = lazy(() => import("../pages/client/NouvelleDemande"));
const SuiviMission       = lazy(() => import("../pages/client/SuiviMission"));
const NotationPrestataire = lazy(() => import("../pages/client/NotationPrestataire"));

// ─── Lazy imports — Provider ─────────────────────────────────────────────────
const ProviderDashboard  = lazy(() => import("../pages/provider/ProviderDashboard"));
const DemandesDisponibles = lazy(() => import("../pages/provider/DemandesDisponibles"));
const CreerDevis         = lazy(() => import("../pages/provider/CreerDevis"));
const DemarrerMission    = lazy(() => import("../pages/provider/DemarrerMission"));
const SignalerLitige     = lazy(() => import("../pages/provider/SignalerLitige"));

// ─── Lazy imports — Admin ────────────────────────────────────────────────────
const AdminDashboard     = lazy(() => import("../pages/admin/AdminDashboard"));
const ValidationPrestataire = lazy(() => import("../pages/admin/ValidationPrestataire"));
const GestionUtilisateurs   = lazy(() => import("../pages/admin/GestionUtilisateurs"));
const LitigesAdmin       = lazy(() => import("../pages/admin/LitigesAdmin"));

// ─── Lazy imports — Misc ─────────────────────────────────────────────────────
const ShowcasePage       = lazy(() => import("../pages/showcase/ComponentShowcase"));
const NotFoundPage       = lazy(() => import("../pages/NotFoundPage"));

// ─── SmartRedirect ───────────────────────────────────────────────────────────
// Lit le rôle du mock token et redirige vers le bon dashboard.
// En S3 : même logique, juste avec un vrai token JWT.
function SmartRedirect() {
  try {
    const raw = localStorage.getItem("sl_mock_user");
    if (!raw) return <Navigate to="/auth/register" replace />;
    const { role } = JSON.parse(raw);
    if (role === "CLIENT")   return <Navigate to="/client/dashboard" replace />;
    if (role === "PROVIDER") return <Navigate to="/provider/dashboard" replace />;
    if (role === "ADMIN" || role === "SERVICE_CLIENT")
                             return <Navigate to="/admin/dashboard" replace />;
  } catch {
    // ignore
  }
  return <Navigate to="/auth/register" replace />;
}

// ─── Fallback spinner centré ─────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-sl-50, #F8FAFC)",
      }}
    >
      <Spinner size="lg" />
    </div>
  );
}

// ─── AppRouter ───────────────────────────────────────────────────────────────
export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ── Racine ── */}
          <Route path="/" element={<SmartRedirect />} />

          {/* ── Auth (public) ── */}
          <Route path="/auth">
            <Route index      element={<Navigate to="/auth/register" replace />} />
            <Route path="register"    element={<RegisterPage/>} />
            <Route path="login"       element={<LoginPage />} />
            <Route path="login/admin" element={<AdminLoginPage />} />
            <Route path="otp"         element={<OtpPage />} />
          </Route>
          {/* ── Espace Client ── */}
          <Route
            path="/client"
            element={
              <AuthGuard allowedRoles={["CLIENT"]}>
                <ClientLayout />
              </AuthGuard>
            }
          >
            <Route index                element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"     element={<ClientDashboard />} />
            <Route path="nouvelle-demande" element={<NouvelleDemande />} />
            <Route path="missions/:id"  element={<SuiviMission />} />
            <Route path="notation/:missionId" element={<NotationPrestataire />} />
          </Route>

          {/* ── Espace Prestataire ── */}
          <Route
            path="/provider"
            element={
              <AuthGuard allowedRoles={["PROVIDER"]}>
                <ProviderLayout />
              </AuthGuard>
            }
          >
            <Route index                    element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"         element={<ProviderDashboard />} />
            <Route path="demandes"          element={<DemandesDisponibles />} />
            <Route path="devis/nouveau/:demandeId" element={<CreerDevis />} />
            <Route path="missions/:id"      element={<DemarrerMission />} />
            <Route path="litige/:missionId" element={<SignalerLitige />} />
          </Route>

          {/* ── Espace Admin ── */}
          <Route
            path="/admin"
            element={
              <AuthGuard allowedRoles={["ADMIN", "SERVICE_CLIENT"]}>
                <AdminLayout />
              </AuthGuard>
            }
          >
            <Route index                   element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"        element={<AdminDashboard />} />
            <Route path="validation"       element={<ValidationPrestataire />} />
            <Route path="utilisateurs"     element={<GestionUtilisateurs />} />
            <Route path="litiges"          element={<LitigesAdmin />} />
            <Route path="litiges/:id"      element={<LitigesAdmin />} />
          </Route>

          {/* ── Showcase (S1 uniquement) ── */}
          <Route path="/showcase" element={<ShowcasePage />} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
