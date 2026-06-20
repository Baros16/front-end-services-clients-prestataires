// src/data/admin/mockDashboard.js
// Fallback mock — réponse de GET /admin/dashboard
// Format exact : API_CONTRACT §8

export const mockAdminDashboard = {
  success: true,
  data: {
    metrics: {
      activeDemands:    { value: 47,      trend: "+12%" },
      ongoingMissions:  { value: 23,      trend: "+5%"  },
      monthlyRevenue:   { value: 8400000, trend: "+31%" },
      commissionEarned: { value: 672000,  trend: "+31%" }
    },
    pendingValidations: [
      {
        id: "usr_jcm456",
        role: "provider",
        firstName: "Jean-Claude",
        lastName: "Mbarga",
        fullName: "Jean-Claude Mbarga",
        phone: "+237699234567",
        email: "jcm@email.cm",
        avatarInitial: "J",
        status: "pending_verification",
        specialty: "Plomberie",
        rating: 0,
        completedMissions: 0,
        isAvailable: false,
        hourlyRat: 4000,
        serviceZone: { city: "Bafoussam", radiusKm: 20 },
        availability: {
          monday:    { "start": "08:00", "end": "18:00", "available": true },
          tuesday:   { "start": "08:00", "end": "18:00", "available": true },
          wednesday: { "start": "08:00", "end": "18:00", "available": true },
          thursday:  { "start": "08:00", "end": "18:00", "available": true },
          friday:    { "start": "08:00", "end": "18:00", "available": true },
          saturday:  { "start": "08:00", "end": "13:00", "available": true },
          sunday:    { "start": null,    "end": null,    "available": false }
        },
        "monthlyEarnings": 0,
        "certifications": ["Artisan certifié"],
        "estCertifie": true,
        "createdAt": "2026-05-20T08:00:00+01:00"
      },
      {
        "id": "usr_elec789",
        "role": "provider",
        "firstName": "Thomas",
        "lastName": "Essama",
        "fullName": "Thomas Essama",
        "phone": "+237677100200",
        "email": "t.essama@email.cm",
        "avatarInitial": "T",
        "status": "pending_verification",
        "specialty": "Électricité",
        "rating": 0,
        "completedMissions": 0,
        "isAvailable": false,
        "hourlyRate": 5000,
        "serviceZone": { "city": "Bafoussam", "radiusKm": 15 },
        "availability": {
          "monday":    { "start": "07:00", "end": "17:00", "available": true },
          "tuesday":   { "start": "07:00", "end": "17:00", "available": true },
          "wednesday": { "start": "07:00", "end": "17:00", "available": true },
          "thursday":  { "start": "07:00", "end": "17:00", "available": true },
          "friday":    { "start": "07:00", "end": "17:00", "available": true },
          "saturday":  { "start": null,    "end": null,    "available": false },
          "sunday":    { "start": null,    "end": null,    "available": false }
        },
        "monthlyEarnings": 0,
        "certifications": ["Électricien agréé ARSEL"],
        "estCertifie": true,
        "createdAt": "2026-05-18T10:00:00+01:00"
      }
    ],
    "activeLitiges": [
      {
        "id": "lit_042",
        "reference": "LIT-2026-0042",
        "demandId": "dem_xyz789",
        "missionId": "msn_001",
        "transactionId": "txn_892",
        "clientId": "usr_abc123",
        "providerId": "usr_jcm456",
        "agentId": "usr_agent01",
        "motif": {
          "id": "motif_incomplete",
          "title": "Prestation incomplète",
          "description": "Les travaux prévus n'ont pas été entièrement réalisés"
        },
        "description": "Le plombier n'a pas remplacé le siphon comme prévu dans le devis.",
        "evidences": [
          { "id": "ev_001", "url": "https://cdn.serviloc.cm/litiges/photo_sous_evier.jpg", "name": "photo_sous_evier.jpg" }
        ],
        "amount": 23000,
        "status": "en_traitement",
        "resolution": null,
        "timeline": [
          { "event": "Litige ouvert",      "at": "2026-05-21T11:00:00+01:00" },
          { "event": "Assigné à l'agent", "at": "2026-05-21T11:30:00+01:00" }
        ],
        "createdAt": "2026-05-21T11:00:00+01:00",
        "assignedAt": "2026-05-21T11:30:00+01:00",
        "resolvedAt": null
      }
    ],
    "popularCategories": [
      { "id": "cat_plomberie",   "label": "Plomberie",   "iconKey": "wrench", "color": "#dbeafe", "demandCount": 84,  "percentageShare": 34 },
      { "id": "cat_electricite", "label": "Électricité", "iconKey": "bolt",   "color": "#fef9c3", "demandCount": 62,  "percentageShare": 25 },
      { "id": "cat_nettoyage",   "label": "Nettoyage",   "iconKey": "broom",  "color": "#dcfce7", "demandCount": 47,  "percentageShare": 19 },
      { "id": "cat_serrurerie",  "label": "Serrurerie",  "iconKey": "key",    "color": "#f3e8ff", "demandCount": 31,  "percentageShare": 12 },
      { "id": "cat_peinture",    "label": "Peinture",    "iconKey": "brush",  "color": "#ffe4e6", "demandCount": 15,  "percentageShare": 6  },
      { "id": "cat_autre",       "label": "Autre",       "iconKey": "plus",   "color": "#f1f5f9", "demandCount": 9,   "percentageShare": 4  }
    ],
    "recentTransactions": [
      {
        "id": "txn_892",
        "reference": "#T-892",
        "demandId": "dem_xyz789",
        "missionId": "msn_001",
        "clientId": "usr_abc123",
        "clientName": "Madeleine K.",
        "providerId": "usr_jcm456",
        "providerName": "Jean-Claude M.",
        "category": "Plomberie",
        "amount": 25000,
        "commission": 2000,
        "providerPayout": 23000,
        "paymentMethod": "orange_money",
        "status": "sequestre",
        "createdAt": "2026-05-21T08:45:00+01:00"
      },
      {
        "id": "txn_891",
        "reference": "#T-891",
        "demandId": "dem_prv010",
        "missionId": "msn_010",
        "clientId": "usr_client02",
        "clientName": "Pierre F.",
        "providerId": "usr_jcm456",
        "providerName": "Jean-Claude M.",
        "category": "Plomberie",
        "amount": 19500,
        "commission": 1500,
        "providerPayout": 18000,
        "paymentMethod": "mtn_momo",
        "status": "libere",
        "createdAt": "2026-05-19T09:00:00+01:00"
      }
    ]
  }
};
