// src/data/admin/mockDashboard.js
// Fallback mock — réponse de GET /admin/dashboard
// Format exact : API_CONTRACT §8

export const mockAdminDashboard = {
  success: true,
  data: {
    kpis: {
      totalUsers: 248,
      totalProviders: 87,
      activeProviders: 61,
      totalClients: 161,
      pendingValidations: 5,
      totalMissions: 312,
      activeMissions: 14,
      completedMissions: 289,
      monthlyRevenue: 3850000,
      monthlyCommissions: 308000,
      openLitiges: 7,
    },

    recentActivity: [
      {
        type: "new_provider",
        label: "Nouveau prestataire inscrit",
        detail: "Gérard Tchoumsi — Électricité",
        time: "Il y a 23 min",
        actionRequired: true,
      },
      {
        type: "litige_opened",
        label: "Litige ouvert",
        detail: "#L-042 — Mission Plomberie",
        time: "Il y a 1h",
        actionRequired: true,
      },
      {
        type: "mission_completed",
        label: "Mission terminée",
        detail: "Prise électrique — Pascal R. / Madeleine K.",
        time: "Il y a 2h",
        actionRequired: false,
      },
      {
        type: "payment_confirmed",
        label: "Paiement confirmé",
        detail: "25 000 XAF — Orange Money #T-891",
        time: "Il y a 3h",
        actionRequired: false,
      },
      {
        type: "new_client",
        label: "Nouveau client inscrit",
        detail: "Berthe Kouam — Bafoussam",
        time: "Il y a 4h",
        actionRequired: false,
      },
    ],

    pendingProviders: [
      {
        id: "usr_ger001",
        fullName: "Gérard Tchoumsi",
        specialty: "Électricité",
        city: "Bafoussam",
        submittedAt: "2026-05-29T10:00:00+01:00",
      },
      {
        id: "usr_ali002",
        fullName: "Alioum Hamidou",
        specialty: "Menuiserie",
        city: "Bafoussam",
        submittedAt: "2026-05-28T14:00:00+01:00",
      },
      {
        id: "usr_cec003",
        fullName: "Cécile Wamba",
        specialty: "Ménage",
        city: "Bafoussam",
        submittedAt: "2026-05-28T09:00:00+01:00",
      },
      {
        id: "usr_emi004",
        fullName: "Emile Foning",
        specialty: "Peinture",
        city: "Bafoussam",
        submittedAt: "2026-05-27T16:00:00+01:00",
      },
      {
        id: "usr_gra005",
        fullName: "Grace Mbianda",
        specialty: "Plomberie",
        city: "Bafoussam",
        submittedAt: "2026-05-26T11:00:00+01:00",
      },
    ],
  },
};
