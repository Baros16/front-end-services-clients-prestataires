// src/services/chatService.js
import { getMock }       from './mockSwitch.js';
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
 */
async function apiFetchMessages(convId, role) {
  const r = await apiClient.get(
    `/${role}/conversations/${convId}/messages`,
    { params: { limit: 50 } },
  );
  return sortAsc(r.data.data.messages);
}

/**
 * Appel POST message — mutualisé client/provider.
 * v2.1 : la réponse est { data: Message }
 */
async function apiPostMessage(convId, content, imageId = null, role) {
  const r = await apiClient.post(
    `/${role}/conversations/${convId}/messages`,
    { content, imageId },
  );
  return r.data.data;
}

export async function getConversations() {
  return getMock(
    sortDesc(mockConversations.data, 'lastMessageAt'),
    () => apiClient.get('/client/conversations')
      .then(r => sortDesc(r.data.data.conversations, 'lastMessageAt')),
  );
}

export async function getMessages(conversationId) {
  const mockFiltered = sortAsc(
    mockMessages.data.filter(m => m.conversationId === conversationId),
  );
  return getMock(
    mockFiltered,
    () => apiFetchMessages(conversationId, 'client'),
  );
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

export async function openConversation(providerId, demandId = null) {
  return getMock(
    mockConversations.data[0] ?? null,
    () => apiClient
      .post('/client/conversations', { providerId, demandId })
      .then(r => r.data.data),
  );
}

export async function getConversationContext(conversationId) {
  return getMock(
    MOCK_CONTEXT[conversationId] ?? null,
    async () => {
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
    },
  );
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────

export async function getProviderConversations() {
  return getMock(
    sortDesc(mockConversations.data, 'lastMessageAt'),
    () => apiClient.get('/provider/conversations')
      .then(r => sortDesc(r.data.data.conversations, 'lastMessageAt')),
  );
}

export async function getProviderMessages(conversationId) {
  const mockFiltered = sortAsc(
    mockMessages.data.filter(m => m.conversationId === conversationId),
  );
  return getMock(
    mockFiltered,
    () => apiFetchMessages(conversationId, 'provider'),
  );
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


export async function getProviderConversationContext(conversationId) {
  return getMock(
    MOCK_CLIENT_CONTEXT[conversationId] ?? null,
    async () => {
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
    },
  );
}

export async function deleteMessage(conversationId, messageId) {
  // En mock : simule une latence réseau légère
  await new Promise(resolve => setTimeout(resolve, 120));
  return { success: true };
  // Quand chatService passera en toggle API :
  // return apiClient
  //   .delete(`/client/conversations/${conversationId}/messages/${messageId}`)
  //   .then(r => r.data);
}