// src/services/chatService.js
import { getMock, USE_MOCK } from './mockSwitch.js';
import mockConversations from '../data/client/mock_conversations.json';
import mockMessages      from '../data/client/mock_messages.json';
import apiClient         from './apiClient.js';

// ─── Mock context ─────────────────────────────────────────────────────────────
// Données enrichies non disponibles dans l'API v2.1 (isOnline, mission).
// En prod : getConversationContext() reconstruit depuis GET /user/:id.
// isOnline → null (non contractualisé côté backend).
// mission  → null (endpoint dédié à prévoir en v2.2).

const MOCK_CONTEXT = {
  conv_001: {
    provider: {
      id:            'usr_jcm456',
      fullName:      'Jean-Claude Mbarga',
      avatarInitial: 'J',
      phone:         '+237699234567',
      rating:         4.8,
      missionCount:   47,
      specialty:     'Plombier certifié',
      isOnline:       true,
      category:      'Plombier',
    },
    mission: {
      id:            'msn_001',
      status:        'en_cours',
      category:      { label: 'Plomberie', subLabel: 'Fuite cuisine', iconKey: 'wrench' },
      location:      'Bafoussam',
      scheduledAt:   "Aujourd'hui 14h",
      totalAmount:    23_000,
      paymentStatus: 'sequestre',
    },
  },
  conv_002: {
    provider: {
      id:            'usr_elec789',
      fullName:      'Thomas Essama',
      avatarInitial: 'T',
      phone:         '+237677456789',
      rating:         4.5,
      missionCount:   23,
      specialty:     'Électricien certifié',
      isOnline:       false,
      category:      'Électricien',
    },
    mission: null,
  },
  conv_003: {
    provider: {
      id:            'usr_peint02',
      fullName:      'Rodrigue Atangana',
      avatarInitial: 'R',
      phone:         '+237655123456',
      rating:         4.2,
      missionCount:   15,
      specialty:     'Peintre',
      isOnline:       true,
      category:      'Peintre',
    },
    mission: null,
  },
};

const MOCK_CLIENT_CONTEXT = {
  conv_001: {
    client: {
      id:                'usr_abc123',
      fullName:          'Madeleine Kamdem',
      avatarInitial:     'M',
      phone:             '+237695123456',
      completedMissions:  3,
      isOnline:           true,
    },
    mission: {
      id:            'msn_001',
      status:        'en_cours',
      category:      { label: 'Plomberie', subLabel: 'Fuite cuisine', iconKey: 'wrench' },
      location:      'Bafoussam',
      scheduledAt:   "Aujourd'hui 14h",
      totalAmount:    23_000,
      paymentStatus: 'sequestre',
    },
  },
  conv_002: {
    client: {
      id:                'usr_abc123',
      fullName:          'Madeleine Kamdem',
      avatarInitial:     'M',
      phone:             '+237695123456',
      completedMissions:  3,
      isOnline:           false,
    },
    mission: null,
  },
  conv_003: {
    client: {
      id:                'usr_abc123',
      fullName:          'Madeleine Kamdem',
      avatarInitial:     'M',
      phone:             '+237695123456',
      completedMissions:  3,
      isOnline:           true,
    },
    mission: null,
  },
};

// ─── Helpers internes ─────────────────────────────────────────────────────────

/** Tri croissant par date (affichage fil de messages). */
function sortAsc(arr, key = 'sentAt') {
  return [...arr].sort((a, b) => new Date(a[key]) - new Date(b[key]));
}

/** Tri décroissant par date (liste de conversations). */
function sortDesc(arr, key = 'updatedAt') {
  return [...arr].sort((a, b) => new Date(b[key]) - new Date(a[key]));
}

/**
 * Appel GET messages — mutualisé client/provider.
 * v2.1 : la réponse est { data: { messages: [], meta: {} } }
 * NB: ne PAS extraire ici — getMock() se charge du unwrapping (response.data.data).
 */
async function apiFetchMessages(convId, role) {
  return apiClient.get(`/${role}/conversations/${convId}/messages`, { params: { limit: 50 } });
}

/**
 * Appel POST message — mutualisé client/provider.
 * v2.1 : la réponse est { data: Message }
 * NB: ne PAS extraire ici — getMock() se charge du unwrapping (response.data.data).
 */
async function apiPostMessage(convId, content, imageId = null, role) {
  return apiClient.post(`/${role}/conversations/${convId}/messages`, { content, imageId });
}

// ─── CLIENT ───────────────────────────────────────────────────────────────────

export async function getConversations() {
  const result = await getMock(
    mockConversations,
    () => apiClient.get('/client/conversations'),
  );
  // mock -> tableau direct ; API -> { conversations: [...] }
  const list = Array.isArray(result) ? result : (result?.conversations ?? []);
  return sortDesc(list);
}

export async function getMessages(conversationId) {
  const mockFiltered = sortAsc(
    mockMessages.data.filter(m => m.conversationId === conversationId),
  );
  const result = await getMock(
    { data: mockFiltered },
    () => apiFetchMessages(conversationId, 'client'),
  );
  const list = Array.isArray(result) ? result : (result?.messages ?? []);
  return sortAsc(list);
}

export async function sendMessage(conversationId, content, imageId = null) {
  return getMock(
    {
      id:             `msg_mock_${Date.now()}`,
      conversationId,
      // v2.1 : senderId = UUID brut (mock UUID Yannick Ulrich)
      senderId:       'b2adb724-8bd7-46b3-b527-b564f5c05a59',
      senderRole:     'client',
      content,
      imageId:        imageId ?? null,
      read:           false,
      sentAt:         new Date().toISOString(),
    },
    () => apiPostMessage(conversationId, content, imageId, 'client'),
  );
}

/**
 * Vérifie si une conversation existe déjà entre ce client et ce prestataire
 * pour cette demande. Si oui, la retourne. Sinon, en crée une nouvelle.
 * Décision actée : pas de doublon de conversation pour un même (client, provider, demand).
 */
export async function getOrCreateConversation(providerId, demandId) {
  // En mode mock : on filtre les conversations existantes
  const existing = mockConversations.data.find(
    (c) => c.provider.id === providerId && c.demandId === demandId
  );

  if (existing) {
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 200));
    return existing;
  }

  // Pas de conversation existante → on en crée une nouvelle
  return openConversation(providerId, demandId);
}

export async function openConversation(providerId, demandId = null) {
  return getMock(
    mockConversations.data[0] ?? null,
    () => apiClient.post('/client/conversations', { providerId, demandId }),
  );
}

/**
 * Cas particulier : compose des données depuis 2 appels API (conversations + user).
 * Ne rentre pas dans le contrat générique getMock(mockData, apiFn) — on gère
 * USE_MOCK manuellement ici plutôt que de forcer ce cas dans getMock.
 */
export async function getConversationContext(conversationId) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    return MOCK_CONTEXT[conversationId] ?? null;
  }

  try {
    // Étape 1 : retrouver la conversation dans la liste
    const convs = await apiClient
      .get('/client/conversations')
      .then(r => r.data.data.conversations);

    const conv = convs.find(c => c.id === conversationId);
    if (!conv) return null;

    // Étape 2 : profil complet du prestataire
    const provider = await apiClient
      .get(`/user/${conv.provider.id}`)
      .then(r => r.data.data);

    return {
      provider: {
        id:            provider.id,
        fullName:      provider.fullName,
        avatarInitial: provider.avatarInitial,
        phone:         provider.phone  ?? null,
        rating:        provider.rating ?? null,
        missionCount:  provider.completedMissions ?? null,
        specialty:     provider.specialty ?? null,
        isOnline:      null, // Non disponible API v2.1
        category:      provider.specialty ?? null,
      },
      mission: null, // Endpoint dédié à prévoir — v2.2
    };
  } catch (error) {
    console.error("[ServiLoc API Error]", error);
    throw error;
  }
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────

export async function getProviderConversations() {
  const result = await getMock(
    mockConversations,
    () => apiClient.get('/provider/conversations'),
  );
  const list = Array.isArray(result) ? result : (result?.conversations ?? []);
  return sortDesc(list);
}

export async function getProviderMessages(conversationId) {
  const mockFiltered = sortAsc(
    mockMessages.data.filter(m => m.conversationId === conversationId),
  );
  const result = await getMock(
    { data: mockFiltered },
    () => apiFetchMessages(conversationId, 'provider'),
  );
  const list = Array.isArray(result) ? result : (result?.messages ?? []);
  return sortAsc(list);
}

/**
 * Envoyer un message côté prestataire.
 */
export async function sendProviderMessage(conversationId, content, imageId = null) {
  return getMock(
    {
      id:             `msg_mock_${Date.now()}`,
      conversationId,
      // v2.1 : UUID brut Jean-Claude Mbarga
      senderId:       '2f19902b-0770-49b9-9974-a92dbb44a77c',
      senderRole:     'provider',
      content,
      imageId:        imageId ?? null,
      read:           false,
      sentAt:         new Date().toISOString(),
    },
    () => apiPostMessage(conversationId, content, imageId, 'provider'),
  );
}

/**
 * Cas particulier : compose des données depuis 2 appels API (conversations + user).
 * Même raison que getConversationContext — on sort du contrat générique getMock.
 */
export async function getProviderConversationContext(conversationId) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    return MOCK_CLIENT_CONTEXT[conversationId] ?? null;
  }

  try {
    const convs = await apiClient
      .get('/provider/conversations')
      .then(r => r.data.data.conversations);

    const conv = convs.find(c => c.id === conversationId);
    if (!conv) return null;

    const client = await apiClient
      .get(`/user/${conv.client.id}`)
      .then(r => r.data.data);

    return {
      client: {
        id:                client.id,
        fullName:          client.fullName,
        avatarInitial:     client.avatarInitial,
        phone:             client.phone ?? null,
        completedMissions: client.completedMissions ?? null,
        isOnline:          null, // Non disponible API v2.1
      },
      mission: null, // Endpoint dédié à prévoir — v2.2
    };
  } catch (error) {
    console.error("[ServiLoc API Error]", error);
    throw error;
  }
}

export async function deleteMessage(conversationId, messageId) {
  return getMock(
    { success: true },
    () => apiClient
      .delete(`/client/conversations/${conversationId}/messages/${messageId}`)
      .then(r => r.data),
  );
}