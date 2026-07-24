// src/services/chatService.js
import { getMock, USE_MOCK } from './mockSwitch.js';
import mockConversations from '../data/client/mock_conversations.json';
import mockMessages      from '../data/client/mock_messages.json';
import apiClient         from './apiClient.js';

// ─── Stockage des conversations mockées créées dynamiquement ─────────────────
const dynamicMockConversations = new Map();

// ─── Mock context ─────────────────────────────────────────────────────────────
// Données enrichies non disponibles dans l'API v2.1 (isOnline, mission).
// En prod : getConversationContext() reconstruit depuis ConversationResponse
//           qui embarque déjà un ProviderSummary (id, fullName, avatarInitial,
//           rating, specialty, isOnline).
// phone + missionCount → null (non présents dans ProviderSummary v2.1).
// mission              → null (endpoint dédié à prévoir en v2.2).

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
 * NB : ne PAS extraire ici — getMock() se charge du unwrapping (response.data.data).
 */
async function apiFetchMessages(role, convId) {
  return apiClient.get(`/${role}/conversations/${convId}/messages`, { params: { limit: 50 } });
}

/**
 * Appel POST message — mutualisé client/provider.
 * v2.1 : la réponse est { data: Message }
 * NB : ne PAS extraire ici — getMock() se charge du unwrapping (response.data.data).
 *
 * FIX: `role` en premier — ordre cohérent avec apiFetchMessages et les
 *      appelants qui fournissent le rôle avant les paramètres de contenu.
 */
async function apiPostMessage(role, convId, content, imageId = null) {
  return apiClient.post(`/${role}/conversations/${convId}/messages`, { content, imageId });
}

// ─── CLIENT ───────────────────────────────────────────────────────────────────

export async function getConversations() {
  const result = await getMock(
    mockConversations,
    () => apiClient.get('/client/conversations'),
  );
  // Swagger ApiResponseListConversationResponse : data est ConversationResponse[]
  // directement (tableau plat, pas { conversations: [] }).
  // FIX: suppression du fallback result?.conversations (dead code).
  const list = Array.isArray(result) ? result : [];
  return sortDesc(list);
}

export async function getMessages(conversationId) {
  const mockFiltered = sortAsc(
    mockMessages.data.filter(m => m.conversationId === conversationId),
  );
  const result = await getMock(
    { data: mockFiltered },
    () => apiFetchMessages('client', conversationId),
  );
  // API retourne MessageListResponse : { messages: [], meta: {} }
  const list = Array.isArray(result) ? result : (result?.messages ?? []);
  return sortAsc(list);
}

/**
 * Envoyer un message côté client.
 *
 * @param {string}      conversationId
 * @param {string}      content
 * @param {string|null} imageId
 * @param {string|null} currentUserId — ID de l'utilisateur connecté.
 *   Requis en mode mock pour aligner l'affichage des bulles (côté gauche/droite).
 *   Le composant appelant le récupère depuis son store d'authentification.
 *   FIX: remplace l'UUID hardcodé 'b2adb724-…' qui causait un rendu inversé
 *        pour tout utilisateur autre que Yannick Ulrich.
 */
export async function sendMessage(conversationId, content, imageId = null, currentUserId = null) {
  return getMock(
    {
      id:             `msg_mock_${Date.now()}`,
      conversationId,
      senderId:       currentUserId,
      senderRole:     'client',
      content,
      imageId:        imageId ?? null,
      read:           false,
      sentAt:         new Date().toISOString(),
    },
    () => apiPostMessage('client', conversationId, content, imageId),
  );
}

/**
 * Vérifie si une conversation existe déjà entre ce client et ce prestataire
 * pour cette demande. Si oui, la retourne. Sinon, en crée une nouvelle.
 * Décision actée : pas de doublon de conversation pour un même (client, provider, demand).
 *
 * FIX: en mode prod (USE_MOCK = false) on ne cherche plus dans mockConversations.data —
 *      ce lookup retournait toujours undefined (IDs mock ≠ IDs base) et forçait
 *      la création d'une conversation à chaque appel, ignorant l'idempotence du backend.
 *      POST /client/conversations est déclaré idempotent dans le swagger — on délègue
 *      directement au backend qui gère le "get or create".
 */
export async function getOrCreateConversation(providerId, demandId) {
  if (USE_MOCK) {
    const existing = mockConversations.data.find(
      c => c.provider.id === providerId && c.demandId === demandId,
    );
    if (existing) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));
      return existing;
    }
    return openConversation(providerId, demandId);
  }

  // Prod : POST /client/conversations est idempotent (déclaré dans le swagger).
  // Le backend retourne la conversation existante s'il en trouve une, sinon en crée une.
  return apiClient
    .post('/client/conversations', { providerId, demandId })
    .then(r => r.data?.data ?? r.data);
}

export async function openConversation(providerId, demandId = null) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));
    const existing = mockConversations.data.find(
      c => c.provider.id === providerId && (!demandId || c.demandId === demandId),
    );
    if (existing) return existing;

    const newConv = {
      id:          `conv_mock_${Date.now()}`,
      demandId:    demandId ?? null,
      client: {
        id:            'usr_abc123',
        fullName:      'Madeleine Kamdem',
        avatarInitial: 'M',
      },
      provider: {
        id:            providerId,
        fullName:      providerId,
        avatarInitial: providerId.charAt(0).toUpperCase(),
      },
      lastMessage:  null,
      unreadCount:  0,
      hasQuote:     false,
      quoteStatus:  null,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    };
    dynamicMockConversations.set(newConv.id, newConv);
    return newConv;
  }

  return apiClient
    .post('/client/conversations', { providerId, demandId })
    .then(r => r.data?.data ?? r.data);
}

/**
 * Retourne le contexte d'une conversation côté client :
 * informations sur le prestataire + mission associée.
 *
 * Cas particulier : compose des données depuis un appel API (GET /client/conversations)
 * sans second appel réseau. Ne rentre pas dans le contrat générique getMock(mockData, apiFn)
 * car la logique de composition reste nécessaire — on gère USE_MOCK manuellement.
 *
 * FIX 1 : r.data.data.conversations → r.data.data
 *   GET /client/conversations retourne ApiResponseListConversationResponse où `data`
 *   est ConversationResponse[] directement (tableau). Appeler .conversations dessus
 *   retournait undefined → conv toujours null → fonction toujours null en prod.
 *
 * FIX 2 : suppression de l'appel GET /user/:id (endpoint inexistant dans le contrat).
 *   ConversationResponse embarque déjà un ProviderSummary avec tous les champs
 *   disponibles (id, fullName, avatarInitial, rating, specialty, isOnline).
 *   phone et missionCount ne sont pas dans ProviderSummary — ils restent null
 *   jusqu'à l'exposition d'un endpoint public dédié (v2.2 ou à contractualiser).
 */
export async function getConversationContext(conversationId) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    const known = MOCK_CONTEXT[conversationId];
    if (known) return known;

    const dynamicConv = dynamicMockConversations.get(conversationId);
    if (dynamicConv) {
      return {
        provider: {
          id:            dynamicConv.provider.id,
          fullName:      dynamicConv.provider.fullName,
          avatarInitial: dynamicConv.provider.avatarInitial,
          phone:         null,
          rating:        null,
          missionCount:  null,
          specialty:     null,
          isOnline:      null,
          category:      null,
        },
        mission: null,
      };
    }

    return null;
  }

  try {
    // FIX 1 : .data.data est ConversationResponse[] — pas besoin de .conversations
    const convs = await apiClient
      .get('/client/conversations')
      .then(r => r.data.data);

    const conv = Array.isArray(convs) ? convs.find(c => c.id === conversationId) : null;
    if (!conv) return null;

    // FIX 2 : ProviderSummary déjà embarqué dans ConversationResponse.
    // Champs disponibles : id, fullName, avatarInitial, rating, specialty, isOnline.
    const p = conv.provider;
    return {
      provider: {
        id:            p.id,
        fullName:      p.fullName,
        avatarInitial: p.avatarInitial,
        phone:         null,                // non exposé dans ProviderSummary v2.1
        rating:        p.rating    ?? null,
        missionCount:  null,                // non exposé dans ProviderSummary v2.1
        specialty:     p.specialty ?? null,
        isOnline:      p.isOnline  ?? null,
        category:      p.specialty ?? null,
      },
      mission: null, // endpoint dédié à prévoir — v2.2
    };
  } catch (error) {
    console.error('[ServiLoc API Error] getConversationContext:', error);
    throw error;
  }
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────

export async function getProviderConversations() {
  const result = await getMock(
    mockConversations,
    () => apiClient.get('/provider/conversations'),
  );
  // FIX: même correction que getConversations — data est ConversationResponse[] direct.
  const list = Array.isArray(result) ? result : [];
  return sortDesc(list);
}

export async function getProviderMessages(conversationId) {
  const mockFiltered = sortAsc(
    mockMessages.data.filter(m => m.conversationId === conversationId),
  );
  const result = await getMock(
    { data: mockFiltered },
    () => apiFetchMessages('provider', conversationId),
  );
  const list = Array.isArray(result) ? result : (result?.messages ?? []);
  return sortAsc(list);
}

/**
 * Envoyer un message côté prestataire.
 *
 * @param {string}      conversationId
 * @param {string}      content
 * @param {string|null} imageId
 * @param {string|null} currentUserId — ID du prestataire connecté.
 *   FIX: remplace l'UUID hardcodé '2f19902b-…' (Jean-Claude Mbarga).
 */
export async function sendProviderMessage(conversationId, content, imageId = null, currentUserId = null) {
  return getMock(
    {
      id:             `msg_mock_${Date.now()}`,
      conversationId,
      senderId:       currentUserId,
      senderRole:     'provider',
      content,
      imageId:        imageId ?? null,
      read:           false,
      sentAt:         new Date().toISOString(),
    },
    () => apiPostMessage('provider', conversationId, content, imageId),
  );
}

/**
 * Retourne le contexte d'une conversation côté prestataire :
 * informations sur le client + mission associée.
 *
 * FIX 1 : r.data.data.conversations → r.data.data (même correction que client).
 * FIX 2 : suppression de GET /user/:id — ClientSummary déjà dans ConversationResponse.
 *   Champs disponibles : id, fullName, avatarInitial, isOnline.
 *   phone et completedMissions ne sont pas dans ClientSummary — restent null.
 */
export async function getProviderConversationContext(conversationId) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    return MOCK_CLIENT_CONTEXT[conversationId] ?? null;
  }

  try {
    // FIX 1 : .data.data est ConversationResponse[] directement
    const convs = await apiClient
      .get('/provider/conversations')
      .then(r => r.data.data);

    const conv = Array.isArray(convs) ? convs.find(c => c.id === conversationId) : null;
    if (!conv) return null;

    // FIX 2 : ClientSummary déjà embarqué dans ConversationResponse.
    // Champs disponibles : id, fullName, avatarInitial, isOnline.
    const c = conv.client;
    return {
      client: {
        id:                c.id,
        fullName:          c.fullName,
        avatarInitial:     c.avatarInitial,
        phone:             null,            // non exposé dans ClientSummary v2.1
        completedMissions: null,            // non exposé dans ClientSummary v2.1
        isOnline:          c.isOnline ?? null,
      },
      mission: null, // endpoint dédié à prévoir — v2.2
    };
  } catch (error) {
    console.error('[ServiLoc API Error] getProviderConversationContext:', error);
    throw error;
  }
}

// ─── SUPPRESSION DE MESSAGES ──────────────────────────────────────────────────

/**
 * Suppression (soft-delete) d'un message côté client.
 * DELETE /client/conversations/{id}/messages/{messageId}
 */
export async function deleteClientMessage(conversationId, messageId) {
  return getMock(
    { messageId, deleted: true },
    () => apiClient
      .delete(`/client/conversations/${conversationId}/messages/${messageId}`)
      .then(r => r.data?.data ?? r.data),
  );
}

/**
 * Suppression (soft-delete) d'un message côté prestataire.
 * DELETE /provider/conversations/{id}/messages/{messageId}
 *
 * FIX: fonction manquante — l'endpoint est déclaré dans le swagger 8083
 *      mais n'était pas exposé côté service.
 */
export async function deleteProviderMessage(conversationId, messageId) {
  return getMock(
    { messageId, deleted: true },
    () => apiClient
      .delete(`/provider/conversations/${conversationId}/messages/${messageId}`)
      .then(r => r.data?.data ?? r.data),
  );
}

/**
 * @deprecated Utiliser deleteClientMessage() ou deleteProviderMessage() selon le rôle.
 * Conservé pour rétrocompatibilité — pointe sur deleteClientMessage.
 */
export async function deleteMessage(conversationId, messageId) {
  return deleteClientMessage(conversationId, messageId);
}