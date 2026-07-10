// src/data/service-client/mockLitigeDetail.js

export const mockLitigeDetail = {
  id: "lit_042",
  reference: "LIT-2026-0042",
  motif: "PRESTATION_INCOMPLETE",
  clientDescription:
    "Le plombier n'a pas remplacé le siphon comme prévu dans le devis. Il est parti après avoir changé le joint uniquement.",
  attachments: [
    {
      id: "att_001",
      name: "photo_sous_evier.jpg",
      url: "https://cdn.serviloc.cm/litiges/photo_sous_evier.jpg",
    },
    {
      id: "att_002",
      name: "siphon_intact.jpg",
      url: "https://cdn.serviloc.cm/litiges/siphon_intact.jpg",
    },
  ],
  originalQuote: {
    labour: 15000,
    materials: 10000,
    total: 25000,
  },
  status: "ouvert",
};

export const mockParties = {
  client: {
    id: "usr_abc123",
    name: "Madeleine K.",
    avatarInitial: "M",
    rating: 4.3,
    role: "client",
  },
  provider: {
    id: "usr_prov456",
    name: "Jean-Claude T.",
    avatarInitial: "J",
    rating: 4.8,
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
      "Bonjour, j'ai remplacé le joint comme convenu. Le siphon ne nécessitait pas de remplacement. Je joins à ceci une photo.",
    attachmentUrl: "https://cdn.serviloc.cm/litiges/joint_remplace.jpg",
    sentAt: "2026-05-21T16:00:00+01:00",
  },
];


