// src/services/authService.js
// Exemple complet d'utilisation du switch mock/API pour l'auth

import axios from "axios";
import { getMock } from "./mockSwitch.js";
import {
  mockLoginResponse,
  mockRegisterResponse,
  mockVerifyOtpResponse,
} from "../data/auth/mockUsers.js";

const BASE = "/auth";

export async function login(email, password) {
  return getMock(mockLoginResponse, () =>
    axios.post(`${BASE}/login`, { email, password })
  );
}

export async function register(payload) {
  // payload : { role, firstName, lastName, phone, email, password }
  return getMock(mockRegisterResponse, () =>
    axios.post(`${BASE}/register`, payload)
  );
}

export async function verifyOtp(userId, otpCode) {
  return getMock(mockVerifyOtpResponse, () =>
    axios.post(`${BASE}/verify-otp`, { userId, otpCode })
  );
}

export async function resendOtp(userId) {
  return getMock(
    { success: true, data: { otpSent: true, cooldownSeconds: 45 } },
    () => axios.post(`${BASE}/resend-otp`, { userId })
  );
}

export async function logout(refreshToken) {
  return getMock({ success: true }, () =>
    axios.post(`${BASE}/logout`, { refreshToken })
  );
}
