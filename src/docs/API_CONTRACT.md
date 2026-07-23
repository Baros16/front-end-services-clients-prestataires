# API Contract — ServiLoc Frontend

> **Version :** 2.1  
> **Base URL :** `http://localhost:8080` (configurable via `VITE_API_BASE_URL`)  
> **Format :** JSON  
> **Auth :** Bearer JWT (`serviloc_access` dans localStorage)  
> **Refresh :** `POST /users/refresh` avec `refreshToken`  

---

## Sommaire

1. [Auth — Authentification](#1-auth--authentification)
2. [Client — Demandes & Missions](#2-client--demandes--missions)
3. [Provider — Demandes, Missions & Profil](#3-provider--demandes-missions--profil)
4. [Admin — Dashboard, Validation, Utilisateurs, Litiges](#4-admin--dashboard-validation-utilisateurs-litiges)
5. [Service Client — Dashboard & Litiges](#5-service-client--dashboard--litiges)
6. [Chat — Conversations & Messages](#6-chat--conversations--messages)
7. [Shared — Catégories & Motifs de litige](#7-shared--catégories--motifs-de-litige)
8. [Upload — Photos & Documents](#8-upload--photos--documents)
9. [Stats — Commissions & Paiements](#9-stats--commissions--paiements)
10. [Modèles de données](#10-modèles-de-données)

---

## 1. Auth — Authentification

### POST /users/register
Création de compte client ou prestataire.

**Payload :**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "role": "client | provider"
}
```

**Response 201 :**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "string",
    "message": "Compte créé. OTP envoyé."
  }
}
```

---

### POST /users/verify-otp
Validation du code OTP.

**Payload :**
```json
{
  "email": "string",
  "code": "string"
}
```

**Response 200 :**
```json
{
  "success": true,
  "data": {
    "message": "Compte activé avec succès"
  }
}
```

> ⚠️ v2.1 : ne retourne PAS de tokens. Rediriger vers login.

---

### POST /users/resend-otp
Renvoi d'un nouveau code OTP.

**Payload :**
```json
{
  "email": "string"
}
```

---

### POST /users/login
Connexion.

**Payload :**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200 :**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "tokenType": "Bearer",
    "expiresIn": 3600000,
    "role": "client | provider | admin | service_client",
    "user": { "<User>": "..." }
  },
  "meta": null
}
```

---

### POST /users/refresh
Rafraîchissement du token JWT.

**Payload :**
```json
{
  "refreshToken": "jwt"
}
```

**Response 200 :**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "tokenType": "Bearer",
    "expiresIn": 3600000,
    "role": "string",
    "user": { "<User>": "..." }
  },
  "meta": null
}
```

---

### POST /users/forgot-password
Demande de réinitialisation de mot de passe.

**Payload :**
```json
{
  "email": "string"
}
```

---

### POST /users/reset-password
Réinitialisation du mot de passe.

**Payload :**
```json
{
  "email": "string",
  "code": "string",
  "newPassword": "string"
}
```

---

### POST /users/logout
Déconnexion.

**Payload :**
```json
{
  "refreshToken": "jwt"
}
```

---

### GET /users/:userId
Récupération d'un utilisateur public (nom, avatar).

**Response 200 :**
```json
{
  "data": {
    "id": "uuid",
    "fullName": "string",
    "avatarInitial": "string",
    "phone": "string|null",
    "rating": "number|null",
    "completedMissions": "number|null",
    "specialty": "string|null"
  }
}
```

---

## 2. Client — Demandes & Missions

### GET /client/dashboard
Tableau de bord client.

**Response 200 :**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "role": "client",
      "firstName": "string",
      "lastName": "string",
      "fullName": "string",
      "phone": "string",
      "email": "string",
      "avatarInitial": "string",
      "status": "active",
      "totalSpent": "number",
      "completedMissions": "number",
      "pendingPayment": { "amount": "number", "missionLabel": "string" },
      "location": { "city": "string", "district": "string" },
      "createdAt": "ISO8601"
    },
    "recentDemands": ["<Demand>"],
    "financialSummary": {
      "totalSpent": "number",
      "completedMissions": "number",
      "pendingPayment": { "amount": "number", "missionLabel": "string" }
    },
    "unreadMessages": "number"
  }
}
```

---

### GET /client/demands
Liste des demandes du client.

**Query params :** `page`, `limit`, `status`

**Response 200 :**
```json
{
  "success": true,
  "data": ["<Demand>"],
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

---

### POST /client/demands
Créer une nouvelle demande.

**Payload :**
```json
{
  "categoryId": "string",
  "description": "string",
  "location": { "address": "string", "lat": "number", "lng": "number" },
  "isUrgent": "boolean",
  "estimatedBudget": { "min": "number", "max": "number" },
  "photoIds": ["string"]
}
```

---

### GET /client/demands/:demandId
Détail d'une demande spécifique.

**Response 200 :** `<Demand>`

---

### GET /client/demands/:demandId/applications
Liste des prestataires ayant postulé à une demande.

**Response 200 :**
```json
["<Application>"]
```

---

### GET /client/devis/:quoteId
Détail d'un devis reçu.

**Response 200 :**
```json
{
  "data": {
    "<Quote>": "...",
    "provider": {
      "id": "uuid",
      "fullName": "string",
      "avatarInitial": "string",
      "rating": "number",
      "missionsCount": "number"
    },
    "demand": {
      "category": "string",
      "description": "string"
    }
  }
}
```

---

### POST /client/demands/:demandId/quote/accept
Accepter un devis et déclencher le paiement.

**Payload :**
```json
{
  "quoteId": "string",
  "paymentMethod": "string",
  "phoneNumber": "string"
}
```

---

### POST /client/demands/:demandId/quote/reject
Refuser un devis.

---

### GET /client/missions
Liste des missions du client.

**Response 200 :** `["<Mission>"]`

---

### GET /client/missions/:missionId
Détail d'une mission.

**Response 200 :** `<Mission>`

---

### POST /client/missions/:missionId/validate
Valider une mission terminée.

---

### POST /client/missions/:missionId/rate
Noter une mission (client note prestataire).

**Payload :**
```json
{
  "rating": 1,
  "comment": "string"
}
```

---

### POST /client/missions/:missionId/litige
Ouvrir un litige sur une mission.

**Payload :**
```json
{
  "motifId": "string",
  "description": "string",
  "evidencePhotoIds": ["string"]
}
```

---

## 3. Provider — Demandes, Missions & Profil

### GET /provider/dashboard
Tableau de bord prestataire.

**Response 200 :**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "role": "provider",
      "firstName": "string",
      "lastName": "string",
      "fullName": "string",
      "phone": "string",
      "email": "string",
      "avatarInitial": "string",
      "status": "string",
      "specialty": "string",
      "rating": "number",
      "completedMissions": "number",
      "isAvailable": "boolean",
      "hourlyRate": "number",
      "serviceZone": { "city": "string", "radiusKm": "number" },
      "availability": { "<day>": { "start": "HH:mm", "end": "HH:mm", "available": "boolean" } },
      "monthlyEarnings": "number",
      "certifications": ["string"],
      "estCertifie": "boolean",
      "createdAt": "ISO8601"
    },
    "metrics": {
      "missionsThisMonth": "number",
      "netEarnings": "number",
      "averageRating": "number",
      "availableDemandsCount": "number",
      "trends": {
        "missions": { "value": "string", "direction": "up|down|neutral", "subtext": "string" },
        "earnings": { "value": "string", "direction": "up|down|neutral", "subtext": "string" },
        "rating":   { "value": "string", "direction": "up|down|neutral", "subtext": "string" }
      }
    },
    "recentMissions": ["<Mission>"],
    "availability": { "<day>": { "start": "HH:mm", "end": "HH:mm", "available": "boolean" } }
  }
}
```

---

### GET /provider/demands
Liste des demandes disponibles pour postuler.

**Query params :** `categoryId`

**Response 200 :**
```json
["<AvailableDemand>"]
```

---

### POST /provider/demands/:demandId/apply
Postuler à une demande.

---

### POST /provider/demands/:demandId/quote
Soumettre un devis pour une demande.

**Payload :**
```json
{
  "laborDescription": "string",
  "laborAmount": "number",
  "materials": [{ "designation": "string", "quantity": "number", "unitPrice": "number" }],
  "estimatedDurationHours": "number",
  "validityDays": "number"
}
```

---

### GET /provider/quotes/:quoteId
Détail d'un devis.

---

### PATCH /provider/quotes/:quoteId
Mettre à jour un devis.

---

### GET /provider/missions
Liste des missions du prestataire.

**Query params :** `status`, `page`, `limit`

**Response 200 :** `["<Mission>"]`

---

### GET /provider/missions/:missionId
Détail d'une mission.

**Response 200 :** `<Mission>`

---

### POST /provider/missions/:missionId/start
Démarrer une mission.

---

### POST /provider/missions/:missionId/steps
Ajouter les étapes d'une mission.

**Payload :**
```json
{
  "steps": [{ "label": "string", "order": "number" }],
  "estimatedDurationHours": "number"
}
```

---

### PATCH /provider/missions/:missionId/steps/:stepId
Mettre à jour l'état d'une étape.

**Payload :**
```json
{
  "completed": "boolean"
}
```

---

### POST /provider/missions/:missionId/complete
Marquer une mission comme terminée.

---

### PATCH /provider/missions/:missionId/location
Mettre à jour la position GPS du prestataire pendant une mission.

**Payload :**
```json
{
  "lat": "number",
  "lng": "number"
}
```

---

### GET /provider/me
Profil du prestataire connecté.

**Response 200 :** `<ProviderProfile>`

---

### PATCH /provider/profile
Mettre à jour le profil professionnel.

**Payload :**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "specialty": "string",
  "hourlyRate": "number",
  "serviceZoneCity": "string",
  "latitude": "number",
  "longitude": "number",
  "radiusKm": "number",
  "estCertifie": "boolean",
  "certifications": ["string"],
  "documentIds": ["string"]
}
```

---

### PATCH /provider/availability
Basculer disponible / indisponible.

**Payload :**
```json
{
  "isAvailable": "boolean"
}
```

---

### PATCH /provider/schedule
Mettre à jour les horaires hebdomadaires.

**Payload (à plat) :**
```json
{
  "monday":    { "start": "HH:mm", "end": "HH:mm", "available": "boolean" },
  "tuesday":   { "start": "HH:mm", "end": "HH:mm", "available": "boolean" },
  "wednesday": { "start": "HH:mm", "end": "HH:mm", "available": "boolean" },
  "thursday":  { "start": "HH:mm", "end": "HH:mm", "available": "boolean" },
  "friday":    { "start": "HH:mm", "end": "HH:mm", "available": "boolean" },
  "saturday":  { "start": "HH:mm", "end": "HH:mm", "available": "boolean" },
  "sunday":    { "start": "HH:mm|null", "end": "HH:mm|null", "available": "boolean" }
}
```

---

### GET /provider/earnings
Historique des gains.

**Query params :** `page`, `month` (ex: `2026-05`)

**Response 200 :**
```json
{
  "monthlyTotal": "number",
  "payouts": [
    {
      "id": "string",
      "reference": "string",
      "missionId": "string",
      "category": "string",
      "amount": "number",
      "commission": "number",
      "netAmount": "number",
      "status": "libere|sequestre|en_attente",
      "paidAt": "ISO8601|null"
    }
  ]
}
```

---

## 4. Admin — Dashboard, Validation, Utilisateurs, Litiges

### GET /admin/dashboard
Tableau de bord administrateur.

**Response 200 :**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "activeDemands": { "value": "number", "trend": "string" },
      "ongoingMissions": { "value": "number", "trend": "string" },
      "monthlyRevenue": { "value": "number", "trend": "string" },
      "commissionEarned": { "value": "number", "trend": "string" }
    },
    "pendingValidations": ["<PendingProvider>"],
    "activeLitiges": [
      { "id": "string", "reference": "string", "motif": "string", "amount": "number", "status": "string" }
    ],
    "popularCategories": [
      { "name": "string", "percentage": "number", "color": "string" }
    ],
    "recentTransactions": [
      { "id": "string", "clientName": "string", "providerName": "string", "service": "string", "amount": "number", "commission": "number", "status": "string" }
    ]
  }
}
```

---

### GET /admin/providers
Liste des prestataires en attente.

**Query params :** `status` (ex: `pending`, `pending_verification`)

**Response 200 :**
```json
{
  "data": [
    { "id": "uuid", "name": "string", "specialty": "string", "submittedAt": "string", "dossierStatus": "ok|missing_docs" }
  ],
  "meta": { "page": 1, "limit": 20, "total": "number", "totalPages": "number" }
}
```

---

### GET /admin/providers/:providerId
Dossier complet d'un prestataire.

**Response 200 :** `<ProviderDossier>`

---

### POST /admin/providers/:providerId/validate
Valider un prestataire.

---

### POST /admin/providers/:providerId/reject
Refuser un dossier prestataire.

**Payload :**
```json
{
  "reason": "string"
}
```

---

### POST /admin/providers/:providerId/notify
Envoyer un SMS de rappel.

**Payload :**
```json
{
  "message": "string"
}
```

---

### GET /admin/users
Liste des utilisateurs gérés.

**Query params :** `page`, `limit`, `role`, `status`

**Response 200 :**
```json
{
  "data": ["<ManagedUser>"],
  "meta": { "page": 1, "limit": 20, "total": "number", "totalPages": "number" }
}
```

---

### PATCH /admin/users/:userId/suspend
Suspendre un utilisateur.

**Payload :**
```json
{
  "reason": "string"
}
```

---

### PATCH /admin/users/:userId/reactivate
Réactiver un utilisateur suspendu.

---

### GET /admin/litiges
Liste des litiges (admin).

**Query params :** `page`, `limit`, `status`

**Response 200 :**
```json
{
  "data": {
    "metrics": { "open": "number", "assigned": "number", "escalated": "number", "resolved": "number" },
    "litiges": ["<Litige>"]
  }
}
```

---

### POST /admin/litiges/:litigeId/resolve
Résoudre un litige.

**Payload :**
```json
{
  "decision": "string",
  "refundAmount": "number"
}
```

---

### POST /admin/litiges/:litigeId/assign
Assigner un litige à un agent.

**Payload :**
```json
{
  "agentId": "uuid"
}
```

---

### GET /admin/stats
Statistiques globales (commissions + paiements).

**Response 200 :**
```json
{
  "data": {
    "commissions": [
      { "id": "string", "reference": "string", "providerName": "string", "amount": "number", "commissionRate": "number", "commissionAmount": "number", "date": "YYYY-MM-DD" }
    ],
    "payments": [
      { "id": "string", "reference": "string", "type": "paiement|sequestre|remboursement", "clientName": "string", "providerName": "string", "amount": "number", "status": "debloque|sequestre|rembourse", "date": "YYYY-MM-DD" }
    ]
  }
}
```

---

## 5. Service Client — Dashboard & Litiges

### GET /service-client/dashboard
Tableau de bord agent service client.

**Response 200 :**
```json
{
  "data": {
    "metrics": {
      "assignedLitiges": "number",
      "openLitiges": "number",
      "resolvedThisMonth": "number",
      "totalAmountSequestred": "number"
    },
    "recentLitiges": [
      {
        "id": "string",
        "reference": "string",
        "clientName": "string",
        "providerName": "string",
        "motif": "string",
        "amount": "number",
        "status": "string"
      }
    ],
    "notifications": [
      { "id": "string", "message": "string", "read": "boolean", "createdAt": "ISO8601" }
    ]
  }
}
```

---

### GET /service-client/litiges
Liste des litiges assignés à l'agent.

**Response 200 :**
```json
{
  "data": ["<Litige>"]
}
```

---

### GET /service-client/litiges/:litigeId
Détail d'un litige.

**Response 200 :** `<LitigeDetail>`

---

### GET /service-client/litiges/:litigeId/messages
Messages de médiation d'un litige.

**Response 200 :** `["<LitigeMessage>"]`

---

### GET /service-client/litiges/:litigeId/history
Historique d'un litige.

**Response 200 :**
```json
["<LitigeHistoryEntry>"]
```

---

### POST /service-client/litiges/:litigeId/messages
Envoyer un message dans la médiation.

**Payload :**
```json
{
  "content": "string"
}
```

---

### POST /service-client/litiges/:litigeId/resolve
Résoudre un litige (décision finale).

**Payload :**
```json
{
  "decision": "string",
  "refundAmount": "number"
}
```

---

### POST /service-client/litiges/:litigeId/escalate
Escalader un litige vers l'admin.

**Payload :**
```json
{
  "reason": "string"
}
```

---

## 6. Chat — Conversations & Messages

### GET /client/conversations
Liste des conversations du client.

**Response 200 :**
```json
["<Conversation>"]
```

---

### GET /client/conversations/:conversationId/messages
Messages d'une conversation (client).

**Query params :** `limit`

**Response 200 :**
```json
{
  "data": {
    "messages": ["<Message>"],
    "meta": {}
  }
}
```

---

### POST /client/conversations/:conversationId/messages
Envoyer un message (client).

**Payload :**
```json
{
  "content": "string",
  "imageId": "string|null"
}
```

---

### POST /client/conversations
Créer une nouvelle conversation.

**Payload :**
```json
{
  "providerId": "uuid",
  "demandId": "uuid|null"
}
```

---

### DELETE /client/conversations/:conversationId/messages/:messageId
Supprimer un message.

---

### GET /client/user/:userId
Profil d'un utilisateur (utilisé par chat pour contexte).

**Response 200 :**
```json
{
  "data": {
    "id": "uuid",
    "fullName": "string",
    "avatarInitial": "string",
    "phone": "string|null",
    "rating": "number|null",
    "completedMissions": "number|null",
    "specialty": "string|null"
  }
}
```

---

### GET /provider/conversations
Liste des conversations du prestataire.

---

### GET /provider/conversations/:conversationId/messages
Messages d'une conversation (prestataire).

---

### POST /provider/conversations/:conversationId/messages
Envoyer un message (prestataire).

---

## 7. Shared — Catégories & Motifs de litige

### GET /client/categories
Liste des catégories de service.

**Response 200 :**
```json
[
  {
    "id": "string",
    "label": "string",
    "iconKey": "string",
    "description": "string",
    "color": "string",
    "budgetRange": { "min": "number", "max": "number" }
  }
]
```

---

### GET /shared/litige-motifs
Liste des motifs de litige.

**Response 200 :**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "client|provider|both"
  }
]
```

---

## 8. Upload — Photos & Documents

### POST /uploads/photos
Upload de photos.

**Payload :** `multipart/form-data`
- `photos[]` : fichiers images
- `context` : `demand|litige|profile|chat`

**Response 200 :**
```json
{
  "success": true,
  "data": {
    "uploads": [
      { "id": "string", "url": "string", "name": "string", "sizeBytes": "number" }
    ]
  }
}
```

---

### POST /uploads/documents
Upload de documents officiels.

**Payload :** `multipart/form-data`
- `document` : fichier
- `type` : `carte_professionnelle|cni|casier_judiciaire|assurance`

**Response 200 :**
```json
{
  "success": true,
  "data": {
    "uploads": [
      { "id": "string", "url": "string", "name": "string", "sizeBytes": "number" }
    ]
  }
}
```

---

## 9. Modèles de données

### User
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "role": "client|provider|admin|service_client",
  "avatarInitial": "string",
  "status": "active|suspended|pending",
  "createdAt": "ISO8601"
}
```

### Demand
```json
{
  "id": "string",
  "clientId": "string",
  "category": {
    "id": "string",
    "label": "string",
    "iconKey": "string"
  },
  "description": "string",
  "photos": [
    { "id": "string", "url": "string", "name": "string" }
  ],
  "location": {
    "address": "string",
    "lat": "number",
    "lng": "number"
  },
  "status": "ouverte|en_cours|terminee|annulee",
  "urgent": "boolean",
  "estimatedBudget": {
    "min": "number",
    "max": "number"
  },
  "providerId": "string|null",
  "providerName": "string|null",
  "quoteId": "string|null",
  "missionId": "string|null",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Quote
```json
{
  "id": "string",
  "demandId": "string",
  "providerId": "string",
  "clientId": "string",
  "reference": "string",
  "status": "en_attente|accepte|refuse|expire",
  "laborDescription": "string",
  "laborAmount": "number",
  "materials": [
    {
      "id": "string",
      "designation": "string",
      "quantity": "number",
      "unitPrice": "number",
      "subtotal": "number"
    }
  ],
  "materialsTotal": "number",
  "totalAmount": "number",
  "estimatedDurationHours": "number",
  "validityDays": "number",
  "createdAt": "ISO8601",
  "expiresAt": "ISO8601"
}
```

### Mission
```json
{
  "id": "string",
  "demandId": "string",
  "quoteId": "string",
  "clientId": "string",
  "providerId": "string",
  "category": "string",
  "status": "en_cours|terminee|annulee",
  "totalAmount": "number",
  "sequesteredAmount": "number",
  "paymentStatus": "sequestre|libere|rembourse",
  "startedAt": "ISO8601|null",
  "estimatedDurationHours": "number",
  "completedAt": "ISO8601|null",
  "steps": [
    {
      "id": "string",
      "label": "string",
      "completed": "boolean",
      "order": "number"
    }
  ],
  "location": {
    "address": "string",
    "lat": "number",
    "lng": "number"
  }
}
```

### Application
```json
{
  "id": "string",
  "demandId": "string",
  "providerId": "string",
  "providerName": "string",
  "avatarInitial": "string",
  "specialty": "string",
  "rating": "number",
  "missionsCompleted": "number",
  "hourlyRate": "number",
  "estimatedTotal": "number",
  "status": "en_attente|acceptee|refusee",
  "appliedAt": "ISO8601"
}
```

### Conversation
```json
{
  "id": "string",
  "demandId": "string|null",
  "provider": {
    "id": "string",
    "fullName": "string",
    "avatarInitial": "string",
    "rating": "number",
    "specialty": "string"
  },
  "client": {
    "id": "string",
    "fullName": "string",
    "avatarInitial": "string"
  },
  "lastMessage": {
    "content": "string",
    "senderRole": "client|provider",
    "sentAt": "ISO8601"
  },
  "unreadCount": "number",
  "updatedAt": "ISO8601"
}
```

### Message
```json
{
  "id": "string",
  "conversationId": "string",
  "senderId": "string",
  "senderRole": "client|provider",
  "content": "string",
  "imageId": "string|null",
  "read": "boolean",
  "sentAt": "ISO8601"
}
```

### Litige
```json
{
  "id": "string",
  "reference": "string",
  "missionId": "string",
  "demandId": "string",
  "clientId": "string",
  "providerId": "string",
  "clientName": "string",
  "providerName": "string",
  "motif": {
    "id": "string",
    "title": "string",
    "description": "string"
  },
  "description": "string",
  "amount": "number",
  "status": "ouvert|en_cours|resolu|escalade",
  "assignedTo": "string|null",
  "evidencePhotoIds": ["string"],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### LitigeDetail
```json
{
  "id": "string",
  "reference": "string",
  "mission": {
    "id": "string",
    "category": "string",
    "totalAmount": "number",
    "status": "string"
  },
  "client": {
    "id": "string",
    "fullName": "string",
    "phone": "string",
    "email": "string"
  },
  "provider": {
    "id": "string",
    "fullName": "string",
    "phone": "string",
    "email": "string"
  },
  "motif": { "id": "string", "title": "string", "description": "string" },
  "description": "string",
  "amount": "number",
  "sequesteredAmount": "number",
  "status": "string",
  "assignedTo": { "id": "string", "fullName": "string" } | null,
  "evidencePhotos": ["string"],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### LitigeMessage
```json
{
  "id": "string",
  "litigeId": "string",
  "senderId": "string",
  "senderRole": "agent|client|provider",
  "content": "string",
  "createdAt": "ISO8601"
}
```

### LitigeHistoryEntry
```json
{
  "id": "string",
  "litigeId": "string",
  "action": "string",
  "performedBy": "string",
  "description": "string",
  "createdAt": "ISO8601"
}
```

### ProviderProfile
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "fullName": "string",
  "phone": "string",
  "email": "string",
  "avatarInitial": "string",
  "specialty": "string",
  "rating": "number",
  "completedMissions": "number",
  "hourlyRate": "number",
  "serviceZoneCity": "string",
  "latitude": "number",
  "longitude": "number",
  "radiusKm": "number",
  "isAvailable": "boolean",
  "availability": {
    "monday":    { "start": "HH:mm|null", "end": "HH:mm|null", "available": "boolean" },
    "tuesday":   { "start": "HH:mm|null", "end": "HH:mm|null", "available": "boolean" },
    "wednesday": { "start": "HH:mm|null", "end": "HH:mm|null", "available": "boolean" },
    "thursday":  { "start": "HH:mm|null", "end": "HH:mm|null", "available": "boolean" },
    "friday":    { "start": "HH:mm|null", "end": "HH:mm|null", "available": "boolean" },
    "saturday":  { "start": "HH:mm|null", "end": "HH:mm|null", "available": "boolean" },
    "sunday":    { "start": "HH:mm|null", "end": "HH:mm|null", "available": "boolean" }
  },
  "certifications": ["string"],
  "estCertifie": "boolean",
  "documentIds": ["string"],
  "createdAt": "ISO8601"
}
```

### ProviderDossier
```json
{
  "provider": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "specialty": "string",
    "rating": "number",
    "completedMissions": "number"
  },
  "documents": [
    {
      "id": "string",
      "type": "carte_professionnelle|cni|casier_judiciaire|assurance",
      "label": "string",
      "status": "en_attente|valide|refuse",
      "url": "string",
      "uploadedAt": "ISO8601"
    }
  ],
  "verificationNotes": "string|null",
  "submittedAt": "ISO8601",
  "status": "pending|verified|rejected"
}
```

### AvailableDemand
```json
{
  "id": "string",
  "category": {
    "id": "string",
    "label": "string",
    "iconKey": "string"
  },
  "description": "string",
  "location": {
    "address": "string",
    "lat": "number",
    "lng": "number"
  },
  "urgent": "boolean",
  "estimatedBudget": {
    "min": "number",
    "max": "number"
  },
  "clientName": "string",
  "createdAt": "ISO8601",
  "distance": "number|null"
}
```

### ManagedUser
```json
{
  "id": "uuid",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "role": "client|provider|admin|service_client",
  "status": "active|suspended|pending",
  "createdAt": "ISO8601",
  "lastActive": "ISO8601|null",
  "totalMissions": "number",
  "totalSpent": "number"
}
```

### PendingProvider
```json
{
  "id": "uuid",
  "name": "string",
  "specialty": "string",
  "submittedAt": "string",
  "dossierStatus": "ok|missing_docs"
}
```

---

## Notes importantes

1. **Enveloppe de réponse** : Toutes les réponses OK sont enveloppées dans `{ success: true, data: ... }`. Le frontend utilise `getMock()` qui unwrappe automatiquement `response.data.data`.
2. **Pagination** : Les endpoints paginés retournent `meta: { page, limit, total, totalPages }`.
3. **Status normalisés** : Les status sont en minuscules (ex: `"en_cours"`, `"terminee"`, `"ouverte"`).
4. **Refresh token** : Géré automatiquement par l'intercepteur Axios dans `apiClient.js`.
5. **Upload** : Les IDs de photos uploadées sont réutilisés dans les payloads de création de demande, litige, etc.
6. **Zone de service** : Les champs `latitude`, `longitude`, `serviceZoneCity`, `radiusKm` sont à plat dans le payload de mise à jour du profil (pas de sous-objet `serviceZone`).
7. **Horaires** : Le body de `PATCH /provider/schedule` est à plat (les jours à la racine).
8. **Route manquante** : La route `/service-client/validation` est référencée dans la sidebar mais n'existe pas encore dans le routeur.