// src/data/service-client/mockLitigeDetail.js

export const mockLitigeDetail = {
  id: "lit_042",
  reference: "LIT-2026-0042",
  motif: "PRESTATION_INCOMPLETE",
  clientDescription:
    "L'ancien siphon n'a pas été remplacé comme prévu dans le devis. Le prestataire a seulement nettoyé l'installation existante.",
  attachments: [
    {
      id: "att_001",
      name: "photo_siphon_ancien.jpg",
      url: "https://cdn.serviloc.cm/litiges/photo_siphon_ancien.jpg",
    },
  ],
  originalQuote: {
    labour: 15000,
    materials: 8000,
    total: 23000,
  },
  status: "EN_COURS",
};

export const mockParties = {
  client: {
    id: "usr_abc123",
    name: "Madeleine K.",
    avatarInitial: "M",
    rating: 4.2,
    role: "client",
  },
  provider: {
    id: "usr_prov456",
    name: "Jean-Claude T.",
    avatarInitial: "J",
    rating: 4.7,
    role: "provider",
  },
};

export const mockClientMessages = [
  {
    id: "lmsg_001",
    litigeId: "lit_042",
    senderId: "usr_agent01",
    senderRole: "agent",
    senderName: "Pauline F.",
    content:
      "Bonjour Madeleine, j'ai bien pris en charge votre dossier. Pouvez-vous m'envoyer des photos supplémentaires montrant l'état actuel de votre installation ?",
    attachmentUrl: null,
    sentAt: "2026-05-21T14:00:00+01:00",
  },
  {
    id: "lmsg_004",
    litigeId: "lit_042",
    senderId: "usr_agent01",
    senderRole: "agent",
    senderName: "Pauline F.",
    content:
      "Merci pour ces informations. Pouvez-vous me transmettre des photos du siphon actuel pour confirmer qu'il n'a pas été changé ?",
    attachmentUrl: null,
    sentAt: "2026-05-22T09:15:00+01:00",
  },
  {
    id: "lmsg_005",
    litigeId: "lit_042",
    senderId: "usr_abc123",
    senderRole: "client",
    senderName: "Madeleine K.",
    content:
      "Voici les photos supplémentaires que vous m'avez demandées. On voit clairement que c'est l'ancien siphon.",
    attachmentUrl: "https://cdn.serviloc.cm/litiges/photo_siphon_ancien.jpg",
    sentAt: "2026-05-22T10:30:00+01:00",
  },
];

export const mockProviderMessages = [
  {
    id: "lmsg_002",
    litigeId: "lit_042",
    senderId: "usr_agent01",
    senderRole: "agent",
    senderName: "Pauline F.",
    content:
      "Bonjour Jean-Claude, j'ai aussi pris en charge votre dossier dans le cadre du litige LIT-2026-0042. Pouvez-vous me donner votre version des faits ?",
    attachmentUrl: null,
    sentAt: "2026-05-21T14:30:00+01:00",
  },
  {
    id: "lmsg_003",
    litigeId: "lit_042",
    senderId: "usr_prov456",
    senderRole: "provider",
    senderName: "Jean-Claude T.",
    content:
      "Bonjour Pauline, j'ai bien remplacé le siphon comme convenu dans le devis. Je peux fournir une photo si nécessaire.",
    attachmentUrl: null,
    sentAt: "2026-05-21T16:00:00+01:00",
  },
];


