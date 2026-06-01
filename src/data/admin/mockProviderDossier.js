// src/data/admin/mockProviderDossier.js
// Fallback mock — dossier complet d'un prestataire pour validation admin
// Format exact : API_CONTRACT §4.3 + documents §9

export const mockProviderDossier = {
  success: true,
  data: {
    // Profil complet du prestataire (ProviderProfile)
    id: "usr_ger001",
    role: "provider",
    firstName: "Gérard",
    lastName: "Tchoumsi",
    fullName: "Gérard Tchoumsi",
    phone: "+237677551234",
    email: "ger.tchoumsi@email.cm",
    avatarInitial: "G",
    status: "pending_verification",
    specialty: "Électricité",
    rating: 0,
    completedMissions: 0,
    isAvailable: false,
    hourlyRate: 3500,
    serviceZone: {
      city: "Bafoussam",
      radiusKm: 15,
    },
    availability: {
      monday:    { start: "07:00", end: "17:00", available: true },
      tuesday:   { start: "07:00", end: "17:00", available: true },
      wednesday: { start: "07:00", end: "17:00", available: true },
      thursday:  { start: "07:00", end: "17:00", available: true },
      friday:    { start: "07:00", end: "17:00", available: true },
      saturday:  { start: "07:00", end: "12:00", available: true },
      sunday:    { start: null,    end: null,     available: false },
    },
    monthlyEarnings: 0,
    certifications: ["CAP Électricien", "Habilitation B2 basse tension"],
    description: "Électricien indépendant avec 8 ans d'expérience dans le résidentiel et le tertiaire. Spécialisé en installation, dépannage et mise aux normes.",
    createdAt: "2026-05-29T10:00:00+01:00",

    // Documents soumis pour validation
    documents: [
      {
        id: "doc_001",
        type: "cni",
        label: "Carte Nationale d'Identité",
        url: "https://cdn.serviloc.cm/documents/doc_001.pdf",
        fileName: "CNI_Tchoumsi.pdf",
        sizeBytes: 1240000,
        status: "pending",
        uploadedAt: "2026-05-29T10:05:00+01:00",
      },
      {
        id: "doc_002",
        type: "carte_professionnelle",
        label: "Carte professionnelle",
        url: "https://cdn.serviloc.cm/documents/doc_002.pdf",
        fileName: "carte_pro_electro.pdf",
        sizeBytes: 890000,
        status: "pending",
        uploadedAt: "2026-05-29T10:07:00+01:00",
      },
      {
        id: "doc_003",
        type: "casier_judiciaire",
        label: "Casier judiciaire",
        url: "https://cdn.serviloc.cm/documents/doc_003.pdf",
        fileName: "casier_judiciaire_vierge.pdf",
        sizeBytes: 650000,
        status: "pending",
        uploadedAt: "2026-05-29T10:09:00+01:00",
      },
    ],
  },
};
