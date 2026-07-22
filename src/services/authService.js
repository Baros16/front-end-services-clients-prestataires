// src/services/authService.js
// Auth API v2.1 — flow : register → verify-otp (sans token) → login séparé
import axios from "axios";
import { getMock } from "./mockSwitch.js";
import mockUsers from "../data/auth/mock_user.json";
import mockPublicUsers from "../data/auth/mock_public_user.json"
import { buildDevToken } from "../router/AuthGuard.jsx";
import apiClient from "./apiClient.js";


const BASE = "/auth"; // préfixe commun à toutes les routes auth (login, register, refresh, etc.)
const ACCESS_KEY = "serviloc_access";
const REFRESH_KEY = "serviloc_refresh";
const USER_KEY = "serviloc_user";

// ── Persistance de session (partagée par login/refresh) ─────────────────────
function persistSession({ accessToken, refreshToken, user }) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

// Retrouve le profil mock correspondant à l'email saisi (client/provider/admin/agent).
// Fallback sur "client" si l'email ne correspond à aucun profil connu, pour que
// n'importe quel email de test fonctionne quand même en mock.
function findMockUserByEmail(email) {
  const match = Object.values(mockUsers).find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  return match ?? mockUsers.client;
}

export async function register(payload) {
  // payload : { firstName, lastName, email, password, phone, role }
  // role : "client" | "provider" uniquement — admin/agent non auto-inscriptibles
  return getMock(
    {
      success: true,
      data: {
        userId: "b2adb724-8bd7-46b3-b527-b564f5c05a59",
        email: payload.email,
        message: "Compte créé. OTP de test : 123456",
      },
    },
    () => axios.post(`${BASE}/register`, payload)
  );
}

export async function verifyOtp(email, code) {
  // ⚠️ v2.1 : ne retourne PLUS de tokens, juste un message de confirmation.
  // L'écran OTP doit rediriger vers /auth/login après succès (pas d'auto-login).
  return getMock(
    { success: true, data: { message: "Compte activé avec succès" } },
    () => axios.post(`${BASE}/verify-otp`, { email, code })
  );
}

export async function resendOtp(email) {
  return getMock(
    { success: true, data: { message: "OTP renvoyé. Code de test : 123456" } },
    () => axios.post(`${BASE}/resend-otp`, { email })
  );
}

export async function login(email, password) {
  const mockUser = findMockUserByEmail(email);

  const response = await getMock(
    {
      success: true,
      data: {
        accessToken: buildDevToken(mockUser.id, mockUser.role.toUpperCase()),
        refreshToken: "mock.jwt.refresh",
        tokenType: "Bearer",
        expiresIn: 3600000, // ⚠️ en millisecondes (1h), pas en secondes
        role: mockUser.role,
        user: mockUser,
      },
      meta: null,
    },
    () => apiClient.post(`${BASE}/login`, { email, password })
  );

  persistSession(response);
  return response;
}

export async function refreshToken() {
  const storedRefreshToken = localStorage.getItem(REFRESH_KEY);
  const storedUser = JSON.parse(localStorage.getItem(USER_KEY) ?? "null");

  const response = await getMock(
    {
      success: true,
      data: {
        accessToken: buildDevToken(storedUser.id, storedUser.role.toUpperCase()),
        refreshToken: storedRefreshToken,
        tokenType: "Bearer",
        expiresIn: 3600000,
        role: storedUser?.role ?? "client",
        user: storedUser ?? mockUsers.client,
      },
      meta: null,
    },
    () => apiClient.post(`${BASE}/refresh`, { refreshToken: storedRefreshToken })
  );

  persistSession(response);
  return response;
}

export async function forgotPassword(email) {
  return getMock(
    {
      success: true,
      data: { message: "Si un compte existe avec cet email, un code de réinitialisation a été envoyé." },
      meta: null,
    },
    () => apiClient.post(`${BASE}/forgot-password`, { email })
  );
}

export async function resetPassword(email, code, newPassword) {
  return getMock(
    { success: true, data: { message: "Mot de passe réinitialisé avec succès" }, meta: null },
    () => apiClient.post(`${BASE}/reset-password`, { email, code, newPassword })
  );
}

export async function logout() {
  const storedRefreshToken = localStorage.getItem(REFRESH_KEY);
  clearSession();
  return getMock(
    { success: true, data: { message: "Déconnexion réussie" }, meta: null },
    () => apiClient.post(`${BASE}/logout`, { refreshToken: storedRefreshToken })
  );
}
export async function getUserById(userId) {
  const mockEntry = mockPublicUsers[userId] ?? Object.values(mockPublicUsers)[0];
  return getMock(
    { data: mockEntry },
    () => apiClient.get(`/user/${userId}`)
  );
}