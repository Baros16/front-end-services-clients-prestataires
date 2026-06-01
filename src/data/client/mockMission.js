// src/data/client/mockMission.js
// Fallback mock — une Mission complète avec 6 étapes
// Format exact : API_CONTRACT §4.6

export const mockMission = {
  success: true,
  data: {
    id: "msn_001",
    demandId: "dem_xyz789",
    quoteId: "quote_001",
    clientId: "usr_abc123",
    providerId: "usr_jcm456",
    category: "Plomberie",
    title: "Fuite cuisine — Madeleine K.",
    status: "en_cours",
    totalAmount: 23000,
    sequesteredAmount: 23000,
    paymentStatus: "sequestre",
    startedAt: "2026-05-21T09:32:00+01:00",
    estimatedDurationHours: 2,
    completedAt: null,
    steps: [
      {
        id: "step_001",
        label: "Coupure eau principale vérifiée",
        completed: true,
        order: 1,
      },
      {
        id: "step_002",
        label: "Démontage siphon fissuré",
        completed: true,
        order: 2,
      },
      {
        id: "step_003",
        label: "Remplacement joint silicone ×2",
        completed: true,
        order: 3,
      },
      {
        id: "step_004",
        label: "Installation siphon PVC neuf",
        completed: true,
        order: 4,
      },
      {
        id: "step_005",
        label: "Test d'étanchéité (5 min eau courante)",
        completed: false,
        order: 5,
      },
      {
        id: "step_006",
        label: "Nettoyage zone d'intervention",
        completed: false,
        order: 6,
      },
    ],
    providerLocation: {
      lat: 5.4764,
      lng: 10.4207,
      label: "Jean-Claude est arrivé",
      sublabel: "Quartier Commercial, Bafoussam",
    },
    location: {
      address: "Bafoussam, Quartier Commercial",
      lat: 5.4764,
      lng: 10.4207,
    },
  },
};

// Mission terminée — pour tester l'état "terminee" et accès à la notation
export const mockMissionCompleted = {
  success: true,
  data: {
    id: "msn_002",
    demandId: "dem_abc456",
    quoteId: "quote_002",
    clientId: "usr_abc123",
    providerId: "usr_prs789",
    category: "Électricité",
    title: "Prise défectueuse — Madeleine K.",
    status: "terminee",
    totalAmount: 18800,
    sequesteredAmount: 18800,
    paymentStatus: "libere",
    startedAt: "2026-05-12T10:00:00+01:00",
    estimatedDurationHours: 1,
    completedAt: "2026-05-12T11:30:00+01:00",
    steps: [
      { id: "step_101", label: "Coupure disjoncteur vérifiée",              completed: true, order: 1 },
      { id: "step_102", label: "Démontage ancienne prise",                  completed: true, order: 2 },
      { id: "step_103", label: "Remplacement câble 2.5mm² (3m)",            completed: true, order: 3 },
      { id: "step_104", label: "Installation prises neuves ×2",             completed: true, order: 4 },
      { id: "step_105", label: "Test sous tension + vérification tableau",  completed: true, order: 5 },
    ],
    providerLocation: {
      lat: 5.4801,
      lng: 10.4180,
      label: "Mission terminée",
      sublabel: "Ngouache, Bafoussam",
    },
    location: {
      address: "Bafoussam, Ngouache",
      lat: 5.4801,
      lng: 10.4180,
    },
  },
};
