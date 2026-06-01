// src/data/client/mockDashboard.js
// Fallback mock — réponse de GET /client/dashboard
// Format exact : API_CONTRACT §6 + schémas §4.2 et §4.4

import { mockUserClient } from "../auth/mockUsers.js";

export const mockClientDashboard = {
  success: true,
  data: {
    profile: mockUserClient,

    recentDemands: [
      {
        id: "dem_xyz789",
        clientId: "usr_abc123",
        category: {
          id: "cat_plomberie",
          label: "Plomberie",
          iconKey: "wrench",
        },
        description: "Fuite sous l'évier de la cuisine, eau qui s'écoule en permanence",
        photos: [
          {
            id: "photo_001",
            url: "https://cdn.serviloc.cm/demands/photo_001.jpg",
            name: "photo_sous_evier.jpg",
          },
        ],
        location: {
          address: "Bafoussam, Quartier Commercial",
          lat: 5.4764,
          lng: 10.4207,
        },
        status: "en_cours",
        isUrgent: false,
        estimatedBudget: { min: 20000, max: 30000 },
        providerId: "usr_jcm456",
        providerName: "Jean-Claude M.",
        quoteId: "quote_001",
        missionId: "msn_001",
        createdAt: "2026-05-21T08:00:00+01:00",
        updatedAt: "2026-05-21T09:32:00+01:00",
      },
      {
        id: "dem_abc456",
        clientId: "usr_abc123",
        category: {
          id: "cat_electricite",
          label: "Électricité",
          iconKey: "bolt",
        },
        description: "Prise de courant défectueuse dans le salon, câblage à vérifier",
        photos: [],
        location: {
          address: "Bafoussam, Ngouache",
          lat: 5.4801,
          lng: 10.4180,
        },
        status: "terminee",
        isUrgent: false,
        estimatedBudget: { min: 15000, max: 25000 },
        providerId: "usr_prs789",
        providerName: "Pascal R.",
        quoteId: "quote_002",
        missionId: "msn_002",
        createdAt: "2026-05-10T10:00:00+01:00",
        updatedAt: "2026-05-12T16:00:00+01:00",
      },
      {
        id: "dem_def012",
        clientId: "usr_abc123",
        category: {
          id: "cat_menage",
          label: "Ménage",
          iconKey: "broom",
        },
        description: "Grand ménage d'un appartement F3, nettoyage complet après déménagement",
        photos: [],
        location: {
          address: "Bafoussam, Tougang Vilage",
          lat: 5.4720,
          lng: 10.4250,
        },
        status: "ouverte",
        isUrgent: false,
        estimatedBudget: { min: 10000, max: 15000 },
        providerId: null,
        providerName: null,
        quoteId: null,
        missionId: null,
        createdAt: "2026-05-29T14:00:00+01:00",
        updatedAt: "2026-05-29T14:00:00+01:00",
      },
    ],

    financialSummary: {
      totalSpent: 55000,
      completedMissions: 3,
      pendingPayment: {
        amount: 25000,
        missionLabel: "Mission Plomberie en cours",
      },
    },

    unreadMessages: 2,
  },
};
