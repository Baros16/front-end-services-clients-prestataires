// src/services/chatService.js

import { getMock }       from './mockSwitch.js';
import mockConversations from '../data/client/mock_conversations.json';
import mockMessages      from '../data/client/mock_messages.json';
import apiClient         from './apiClient.js';

/**
 * Contexte mission + prestataire par conversation.
 * En S2 : données statiques embarquées ici.
 * En S3 : remplacé par GET /client/conversations/:id/context
 */
const MOCK_CONVERSATION_CONTEXT = {
  conv_001: {
    mission: {
      id:            'msn_001',
      status:        'en_cours',
      category:      { label: 'Plomberie', subLabel: 'Fuite cuisine', iconKey: 'wrench' },
      location:      'Bafoussam',
      scheduledAt:   "Aujourd'hui 14h",
      totalAmount:   23_000,
      paymentStatus: 'sequestre',
    },
    provider: {
      id:            'usr_jcm456',
      fullName:      'Jean-Claude Mbarga',
      avatarInitial: 'J',
      rating:         4.8,
      missionCount:   47,
      specialty:     'Plombier certifié',
      isOnline:       true,
      category:      'Plombier',
    },
  },
  conv_002: {
    mission: null,
    provider: {
      id:            'usr_elec789',
      fullName:      'Thomas Essama',
      avatarInitial: 'T',
      rating:         4.5,
      missionCount:   23,
      specialty:     'Électricien certifié',
      isOnline:       false,
      category:      'Électricien',
    },
  },
  conv_003: {
    mission: null,
    provider: {
      id:            'usr_peint02',
      fullName:      'Rodrigue Atangana',
      avatarInitial: 'R',
      rating:         4.2,
      missionCount:   15,
      specialty:     'Peintre',
      isOnline:       true,
      category:      'Peintre',
    },
  },
};

/**
 * Liste des conversations du client connecté.
 * Triées par lastMessageAt décroissant (plus récent en haut).
 */
export async function getConversations() {
  return getMock(
    [...mockConversations.data].sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    ),
    () => apiClient.get('/client/conversations').then(r => r.data.data),
  );
}

/**
 * Messages d'une conversation, triés du plus ancien au plus récent.
 * Le mock filtre sur conversationId — seul conv_001 a des messages.
 */
export async function getMessages(conversationId) {
  const filtered = mockMessages.data
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

  return getMock(
    filtered,
    () => apiClient
      .get(`/client/conversations/${conversationId}/messages`)
      .then(r => r.data.data),
  );
}

/**
 * Contexte mission + prestataire pour le panneau droit.
 * Retourne null si la conversation n'existe pas dans le mock.
 */
export async function getConversationContext(conversationId) {
  return getMock(
    MOCK_CONVERSATION_CONTEXT[conversationId] ?? null,
    () => apiClient
      .get(`/client/conversations/${conversationId}/context`)
      .then(r => r.data.data),
  );
}