// src/services/authService.js
// Exemple complet d'utilisation du switch mock/API pour l'auth

import axios from "axios";
import { getMock } from "./mockSwitch.js";
import mockUser from "../data/auth/mock_user.json";
import mockLoginResponse from "../data/auth/mockLoginResponse.json"
import mockRegisterResponse from "../data/auth/mockRegisterResponse.json"
import mockVerifyOtpResponse from "../data/auth/mockVerifyOtpResponse.json"
import mockForgotPassword from  "../data/auth/mockForgotPassword.json"
import mockResetPassword from   "../data/auth/mockResetPassword.json"

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

export async function forgotPassword(email) {
  return getMock(mockForgotPassword, () => 
    axios.post(`${BASE}/forgot-password`, email)
  );
}

export async function resetPassword(email,code,newPassword) {
  return getMock(mockResetPassword, () =>
    axios.post(`${BASE}/reset-password`, {email, code, newPassword})
  )
}

export async function logout(refreshToken) {
  return getMock({ success: true }, () =>
    axios.post(`${BASE}/logout`, { refreshToken })
  );
}
