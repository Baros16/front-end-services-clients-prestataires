// src/data/auth/mockUsers.js
// Fallback mock — un utilisateur par rôle
// Format exact : schéma User / ClientProfile / ProviderProfile (API_CONTRACT §4.1–4.3)

export const mockUserClient = {
  id: "usr_abc123",
  role: "client",
  firstName: "Madeleine",
  lastName: "Kamdem",
  fullName: "Madeleine Kamdem",
  phone: "+237695123456",
  email: "mk@email.cm",
  avatarInitial: "M",
  status: "active",
  totalSpent: 55000,
  completedMissions: 3,
  pendingPayment: {
    amount: 25000,
    missionLabel: "Mission Plomberie en cours",
  },
  location: {
    city: "Bafoussam",
    district: "Quartier Commercial",
  },
  createdAt: "2026-03-15T10:00:00+01:00",
};

export const mockUserProvider = {
  id: "usr_jcm456",
  role: "provider",
  firstName: "Jean-Claude",
  lastName: "Mbarga",
  fullName: "Jean-Claude Mbarga",
  phone: "+237699234567",
  email: "jcm@email.cm",
  avatarInitial: "J",
  status: "active",
  specialty: "Plomberie",
  rating: 4.8,
  completedMissions: 47,
  isAvailable: true,
  hourlyRate: 4000,
  serviceZone: {
    city: "Bafoussam",
    radiusKm: 20,
  },
  availability: {
    monday:    { start: "08:00", end: "18:00", available: true },
    tuesday:   { start: "08:00", end: "18:00", available: true },
    wednesday: { start: "08:00", end: "18:00", available: true },
    thursday:  { start: "08:00", end: "18:00", available: true },
    friday:    { start: "08:00", end: "18:00", available: true },
    saturday:  { start: "08:00", end: "13:00", available: true },
    sunday:    { start: null,    end: null,     available: false },
  },
  monthlyEarnings: 185000,
  certifications: ["Artisan certifié"],
  createdAt: "2025-11-10T08:00:00+01:00",
};

export const mockUserAdmin = {
  id: "usr_adm001",
  role: "admin",
  firstName: "Bertrand",
  lastName: "Nguemo",
  fullName: "Bertrand Nguemo",
  phone: "+237677000001",
  email: "admin@serviloc.cm",
  avatarInitial: "B",
  status: "active",
  createdAt: "2025-09-01T08:00:00+01:00",
};

export const mockUserServiceClient = {
  id: "usr_sc001",
  role: "service_client",
  firstName: "Arlette",
  lastName: "Fotso",
  fullName: "Arlette Fotso",
  phone: "+237677000002",
  email: "sc@serviloc.cm",
  avatarInitial: "A",
  status: "active",
  createdAt: "2025-10-05T08:00:00+01:00",
};

// Réponse simulée de POST /auth/login
export const mockLoginResponse = {
  success: true,
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_access_token",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_refresh_token",
    user: mockUserClient,
  },
};

// Réponse simulée de POST /auth/register
export const mockRegisterResponse = {
  success: true,
  data: {
    userId: "usr_abc123",
    phone: "+237695123456",
    otpSent: true,
    message: "Un code SMS a été envoyé au +237 695 XXX XXX",
  },
};

// Réponse simulée de POST /auth/verify-otp
export const mockVerifyOtpResponse = {
  success: true,
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_access_token",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_refresh_token",
    user: mockUserClient,
  },
};
