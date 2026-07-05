# API_CONTRACT.md — ServiLoc

> **Document fondateur — à maintenir par les deux équipes (frontend + backend)**
> Toute modification d'un endpoint, d'un format de réponse ou d'un schéma doit être notifiée 48h à l'avance avec un diff explicite dans ce fichier.
> Dernière mise à jour : Juillet 2026 · Version 2.1

**Changelog v2.1 :**
- `POST /auth/verify-otp` : accepte désormais `email` (pas `userId` ni numéro de téléphone) + `code` (pas `otpCode`)
- `POST /auth/resend-otp` : accepte désormais `email` (pas `userId`)
- `POST /auth/register` : réponse retourne `userId` (UUID brut) et `email`, plus de `phone` dans la réponse, `otpSent` retiré
- `POST /auth/verify-otp` : ne retourne plus de tokens — retourne uniquement un message de confirmation. Le login se fait ensuite via `POST /auth/login`
- `POST /auth/login` : réponse enrichie avec `role`, `tokenType`, `expiresIn` et `user` (objet complet selon le rôle)
- `POST /auth/refresh` : réponse enrichie avec `role`, `tokenType`, `expiresIn` et `user`
- Ajout `POST /auth/forgot-password` (nouveau)
- Ajout `POST /auth/reset-password` (nouveau)
- Format ID : tous les IDs retournés sont préfixés (`usr_`, `dem_`, `mis_`, `lit_`, `txn_`)
- JWT : `sub` contient l'email (pas l'UUID), `userId` est un claim séparé, `role` en majuscules dans le token
- `PATCH /provider/profile` : request body enrichi avec `latitude`, `longitude`, `serviceZoneCity`, `radiusKm`
- `PATCH /provider/availability` : réponse enrichie avec `providerId`, `isAvailable`, `message`
- `PATCH /provider/schedule` : request body direct (sans clé `schedule`)
- `GET /provider/earnings` : réponse simplifiée (`monthlyTotal` + `payouts[]` — sans `missions[]` pour l'instant)
- Events RabbitMQ : `user.registered` envoie `email` + `otpCode` (plus `phone`), `provider.validated/rejected` envoie `email` (plus `phone`), `user.suspended` envoie `email` (plus `phone`)
- Section 2.2 JWT mise à jour : payload réel documenté
- Calendrier S1–S4 mis à jour avec statuts réels

---

## Sommaire

1. [Configuration globale](#1-configuration-globale)
2. [Authentification](#2-authentification)
3. [Format des réponses](#3-format-des-réponses)
4. [Schémas des objets métier](#4-schémas-des-objets-métier)
5. [Endpoints — Auth](#5-endpoints--auth)
6. [Endpoints — Client](#6-endpoints--client)
7. [Endpoints — Prestataire](#7-endpoints--prestataire)
8. [Endpoints — Admin](#8-endpoints--admin)
9. [Endpoints — Agent Service Client](#9-endpoints--agent-service-client)
10. [Upload de fichiers](#10-upload-de-fichiers)
11. [Calendrier de livraison backend](#11-calendrier-de-livraison-backend)
12. [Données mock frontend (fallback)](#12-données-mock-frontend-fallback)
13. [Règles de coordination](#13-règles-de-coordination)

---

## 1. Configuration globale

```
URL de base           : https://api.serviloc.cm/v1
Content-Type          : application/json
Charset               : UTF-8
Devise                : XAF (Franc CFA — valeurs entières, pas de décimales)
Fuseau horaire        : Africa/Douala (UTC+1)
Format date           : ISO 8601 — "2026-05-21T09:32:00+01:00"
Format date courte    : "YYYY-MM-DD"
Langue des messages   : Français (fr-CM)
Pagination            : ?page=1&limit=20 (défaut: limit=20)
```

---

## 2. Authentification

### 2.1 Mécanisme

ServiLoc utilise **JWT Bearer Token** avec refresh token.

```
Authorization: Bearer <access_token>
```

| Token | Durée de validité | Stockage frontend |
|-------|-------------------|-------------------|
| `access_token` | 1 heure | `localStorage` (clé : `serviloc_access`) |
| `refresh_token` | 30 jours | `localStorage` (clé : `serviloc_refresh`) |

### 2.2 Payload JWT décodé (v2.1)

```json
{
  "userId": "b2adb724-8bd7-46b3-b527-b564f5c05a59",
  "role": "CLIENT",
  "type": "access",
  "sub": "user@email.cm",
  "iss": "serviloc",
  "iat": 1748736000,
  "exp": 1748739600
}
```

> ⚠️ **v2.1** : `sub` contient l'**email** (pas l'UUID). L'UUID utilisateur est dans le claim `userId`.
> Le Gateway extrait `userId` depuis le claim `userId` et l'injecte en header `X-User-Id` vers les services.
> Le Gateway extrait `role` et l'injecte en header `X-User-Role`.
> `role` est en **MAJUSCULES** dans le token JWT (`"CLIENT"`, `"PROVIDER"`, `"AGENT"`, `"ADMIN"`).

| Champ | Valeurs possibles | Usage frontend |
|-------|-------------------|----------------|
| `userId` | UUID utilisateur | ID courant (claim séparé de `sub`) |
| `role` | `"CLIENT"` \| `"PROVIDER"` \| `"ADMIN"` \| `"AGENT"` | Routing et affichage conditionnel |
| `sub` | Email de l'utilisateur | Identité Spring Security |

### 2.3 Rafraîchissement automatique

Le frontend appelle `/auth/refresh` automatiquement quand l'API retourne `401 UNAUTHORIZED`. Si le refresh échoue, l'utilisateur est redirigé vers `/login`.

### 2.4 Rôles et accès

| Rôle | Espaces accessibles | Espace interdit |
|------|--------------------|-----------------| 
| `client` | `/client/**`, `/auth/**` | Tout le reste |
| `provider` | `/provider/**`, `/auth/**` | Tout le reste |
| `admin` | `/admin/**`, `/auth/**` | Tout le reste |
| `agent` | `/agent/**`, `/auth/**` | Tout le reste |

> Les préfixes sont contrôlés par le Gateway (RoleAuthFilter). Un token `role=AGENT` ne peut jamais atteindre `/admin/**` → `403 FORBIDDEN`.

---

## 3. Format des réponses

### 3.1 Succès

```json
{
  "success": true,
  "data": { },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 248,
    "totalPages": 13
  }
}
```

> `meta` est présent uniquement sur les endpoints paginés. Il est `null` sur les réponses d'entité unique.

### 3.2 Erreur

**Format unique pour TOUTES les erreurs, tous les endpoints.**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "Code OTP erroné ou expiré",
    "field": "code"
  }
}
```

| Champ | Type | Présence | Description |
|-------|------|----------|-------------|
| `code` | `string` | Toujours | Code machine lisible côté frontend |
| `message` | `string` | Toujours | Message en français pour l'affichage |
| `field` | `string\|null` | Optionnel | Champ concerné (validation de formulaire) |

### 3.3 Codes d'erreur standardisés

| Code HTTP | `error.code` | Signification |
|-----------|-------------|---------------|
| 400 | `VALIDATION_ERROR` | Données de formulaire invalides |
| 400 | `INVALID_OTP` | Code OTP incorrect ou expiré |
| 400 | `INVALID_ARGUMENT` | Argument invalide |
| 401 | `UNAUTHORIZED` | Token absent ou invalide |
| 401 | `INVALID_CREDENTIALS` | Email/mot de passe incorrects |
| 401 | `ACCOUNT_NOT_ACTIVATED` | Compte non activé — vérifier l'OTP |
| 403 | `ACCESS_DENIED` | Rôle insuffisant ou ressource non autorisée |
| 404 | `USER_NOT_FOUND` | Utilisateur introuvable |
| 409 | `EMAIL_ALREADY_EXISTS` | Email déjà enregistré |
| 409 | `INVALID_STATE` | État métier impossible (ex: devis déjà accepté) |
| 429 | `RATE_LIMITED` | Trop de requêtes |
| 500 | `INTERNAL_ERROR` | Erreur serveur |

---

## 4. Schémas des objets métier

### 4.1 `User` (commun à tous les rôles)

```json
{
  "id": "usr_abc123",
  "role": "client",
  "firstName": "Madeleine",
  "lastName": "Kamdem",
  "fullName": "Madeleine Kamdem",
  "phone": "+237695123456",
  "email": "mk@email.cm",
  "avatarInitial": "M",
  "createdAt": "2026-03-15T10:00:00+01:00",
  "status": "active"
}
```

> `status` : `"active"` | `"suspended"` | `"pending"`
> `role` : `"client"` | `"provider"` | `"admin"` | `"agent"` (minuscules dans les réponses)
> `id` format : `usr_` + 8 premiers caractères de l'UUID sans tirets

### 4.2 `ClientProfile` (extension de User)

```json
{
  "id": "usr_abc123",
  "role": "client",
  "firstName": "Madeleine",
  "lastName": "Kamdem",
  "fullName": "Madeleine Kamdem",
  "phone": "+237695123456",
  "email": "mk@email.cm",
  "avatarInitial": "M",
  "status": "active",
  "totalSpent": 55000,
  "completedMissions": 3,
  "pendingPayment": {
    "amount": 25000,
    "missionLabel": "Mission Plomberie en cours"
  },
  "location": {
    "city": "Bafoussam",
    "district": "Quartier Commercial"
  },
  "createdAt": "2026-03-15T10:00:00+01:00"
}
```

> `pendingPayment` : `null` si aucun paiement en cours
> `location` : `null` si non renseigné

### 4.3 `ProviderProfile` (extension de User)

```json
{
  "id": "usr_jcm456",
  "role": "provider",
  "firstName": "Jean-Claude",
  "lastName": "Mbarga",
  "fullName": "Jean-Claude Mbarga",
  "phone": "+237699234567",
  "email": "jcm@email.cm",
  "avatarInitial": "J",
  "status": "active",
  "specialty": "Plomberie",
  "rating": 4.8,
  "completedMissions": 47,
  "isAvailable": true,
  "hourlyRate": 4000,
  "serviceZone": {
    "city": "Bafoussam",
    "radiusKm": 20
  },
  "availability": {
    "monday":    { "start": "08:00", "end": "18:00", "available": true },
    "tuesday":   { "start": "08:00", "end": "18:00", "available": true },
    "wednesday": { "start": "08:00", "end": "18:00", "available": true },
    "thursday":  { "start": "08:00", "end": "18:00", "available": true },
    "friday":    { "start": "08:00", "end": "18:00", "available": true },
    "saturday":  { "start": "08:00", "end": "13:00", "available": true },
    "sunday":    { "start": null,    "end": null,    "available": false }
  },
  "monthlyEarnings": 185000,
  "certifications": ["Artisan certifié"],
  "estCertifie": true,
  "createdAt": "2025-11-10T08:00:00+01:00"
}
```

### 4.4 `AgentProfile`

```json
{
  "id": "usr_agent01",
  "role": "agent",
  "firstName": "Pauline",
  "lastName": "Fotso",
  "fullName": "Pauline Fotso",
  "email": "p.fotso@serviloc.cm",
  "phone": "+237691000111",
  "avatarInitial": "P",
  "status": "active",
  "agentCode": "AGT-007",
  "department": "Service Client",
  "assignedLitigesCount": 4,
  "createdAt": "2026-01-10T08:00:00+01:00"
}
```

### 4.5 `ServiceDemand`

```json
{
  "id": "dem_xyz789",
  "clientId": "usr_abc123",
  "category": {
    "id": "cat_plomberie",
    "label": "Plomberie",
    "iconKey": "wrench"
  },
  "description": "Fuite sous l'évier de la cuisine",
  "photos": [
    { "id": "photo_001", "url": "https://cdn.serviloc.cm/demands/photo_001.jpg", "name": "photo_sous_evier.jpg" }
  ],
  "location": { "address": "Bafoussam, Quartier Commercial", "lat": 5.4764, "lng": 10.4207 },
  "status": "en_cours",
  "isUrgent": false,
  "estimatedBudget": { "min": 20000, "max": 30000 },
  "providerId": "usr_jcm456",
  "quoteId": "quote_001",
  "missionId": "msn_001",
  "createdAt": "2026-05-21T08:00:00+01:00",
  "updatedAt": "2026-05-21T09:32:00+01:00"
}
```

> `status` : `"ouverte"` | `"en_cours"` | `"terminee"` | `"annulee"` | `"litige"`

### 4.6 `Quote` (devis)

```json
{
  "id": "quote_001",
  "demandId": "dem_xyz789",
  "providerId": "usr_jcm456",
  "amount": 25000,
  "description": "Remplacement joint + siphon évier cuisine",
  "materials": [
    { "name": "Joint silicone cuisine", "quantity": 2, "unitPrice": 1500 },
    { "name": "Siphon PVC universel",   "quantity": 1, "unitPrice": 4500 }
  ],
  "estimatedDurationHours": 2,
  "status": "en_attente",
  "expiresAt": "2026-05-25T14:00:00+01:00",
  "createdAt": "2026-05-20T14:00:00+01:00"
}
```

> `status` : `"en_attente"` | `"accepte"` | `"refuse"` | `"expire"`

### 4.7 `Mission`

```json
{
  "id": "msn_001",
  "demandId": "dem_xyz789",
  "quoteId": "quote_001",
  "clientId": "usr_abc123",
  "providerId": "usr_jcm456",
  "status": "en_cours",
  "totalAmount": 23000,
  "paymentStatus": "sequestre",
  "startedAt": "2026-05-21T09:32:00+01:00",
  "estimatedDurationHours": 2,
  "completedAt": null,
  "steps": [
    { "id": "step_001", "label": "Coupure eau principale vérifiée", "completed": true,  "order": 1 },
    { "id": "step_002", "label": "Remplacement joint",              "completed": false, "order": 2 }
  ]
}
```

> `status` : `"en_attente"` | `"en_cours"` | `"terminee"` | `"litige"`
> `paymentStatus` : `"sequestre"` | `"libere"` | `"litige"` | `"rembourse"`

### 4.8 `Conversation`

```json
{
  "id": "conv_001",
  "demandId": "dem_xyz789",
  "client": {
    "id": "usr_abc123",
    "firstName": "Madeleine",
    "lastName": "Kamdem",
    "fullName": "Madeleine Kamdem",
    "avatarInitial": "M"
  },
  "provider": {
    "id": "usr_jcm456",
    "firstName": "Jean-Claude",
    "lastName": "Mbarga",
    "fullName": "Jean-Claude Mbarga",
    "avatarInitial": "J"
  },
  "status": "active",
  "unreadCount": 2,
  "lastMessage": null,
  "createdAt": "2026-05-20T13:00:00+01:00",
  "updatedAt": "2026-05-21T09:00:00+01:00"
}
```

> `status` : `"active"` | `"closed"`
> `lastMessage` : `null` si aucun message, sinon `{ content, sentAt, senderRole }`
> ⚠️ **v2.1** : `client` et `provider` ont `firstName` et `lastName` en plus de `fullName`

### 4.9 `Message`

```json
{
  "id": "msg_001",
  "conversationId": "conv_001",
  "senderId": "b2adb724-8bd7-46b3-b527-b564f5c05a59",
  "senderRole": "provider",
  "content": "Bonjour, je suis disponible demain à 8h.",
  "imageId": null,
  "read": true,
  "sentAt": "2026-05-20T14:30:00+01:00"
}
```

> `senderRole` : `"client"` | `"provider"` | `"agent"`
> ⚠️ **v2.1** : `senderId` est l'UUID brut (pas l'ID préfixé), `imageId` (pas `imageUrl`)

### 4.10 `Litige`

```json
{
  "id": "lit_042",
  "demandId": "dem_xyz789",
  "missionId": "msn_001",
  "transactionId": "txn_892",
  "clientId": "usr_abc123",
  "providerId": "usr_jcm456",
  "agentId": "usr_agent01",
  "motif": { "id": "motif_incomplete", "title": "Prestation incomplète" },
  "description": "Le plombier n'a pas remplacé le siphon comme prévu.",
  "amount": 23000,
  "status": "en_traitement",
  "resolution": null,
  "timeline": [
    { "event": "Litige ouvert",      "at": "2026-05-21T11:00:00+01:00" },
    { "event": "Assigné à l'agent", "at": "2026-05-21T11:30:00+01:00" }
  ],
  "createdAt": "2026-05-21T11:00:00+01:00"
}
```

> `status` : `"ouvert"` | `"assigne"` | `"en_traitement"` | `"resolu"` | `"cloture"`

### 4.11 `Resolution`

```json
{
  "id": "res_001",
  "litigeId": "lit_042",
  "agentId": "usr_agent01",
  "type": "remboursement_partiel",
  "refundAmount": 11500,
  "note": "Remboursement de 50% accordé.",
  "clientAccepted": false,
  "providerAccepted": false,
  "proposedAt": "2026-05-22T10:00:00+01:00",
  "closedAt": null
}
```

> `type` : `"remboursement_partiel"` | `"remboursement_total"` | `"en_faveur_prestataire"`

### 4.12 `LitigeMessage`

```json
{
  "id": "lmsg_001",
  "litigeId": "lit_042",
  "senderId": "usr_agent01",
  "senderRole": "agent",
  "senderName": "Pauline F.",
  "content": "Bonjour, j'ai bien pris en charge votre dossier.",
  "attachmentUrl": null,
  "sentAt": "2026-05-21T14:00:00+01:00"
}
```

### 4.13 `ProviderReview`

```json
{
  "id": "usr_e055411a",
  "agentId": "usr_201a92e4",
  "providerId": "usr_2f19902b",
  "verdict": "approved",
  "comment": "Dossier complet. Certifications vérifiées.",
  "reviewedAt": "2026-06-16T21:26:31+01:00",
  "message": "Instruction enregistrée. L'administrateur a été notifié."
}
```

> `verdict` : `"approved"` | `"rejected"` | `"needs_revision"`

### 4.14 `Transaction`

```json
{
  "id": "txn_892",
  "demandId": "00000000-0000-0000-0000-000000000001",
  "clientId": "b2adb724-8bd7-46b3-b527-b564f5c05a59",
  "providerId": "2f19902b-0770-49b9-9974-a92dbb44a77c",
  "amount": 25000,
  "commissionAmount": 2500,
  "netAmount": 22500,
  "status": "sequestre",
  "paymentMethod": "orange_money",
  "externalRef": "MM-9EC0FC92",
  "createdAt": "2026-05-21T08:45:00+01:00"
}
```

> `status` : `"pending"` | `"sequestre"` | `"libere"` | `"rembourse"` | `"litige"` | `"echec"`
> `paymentMethod` : `"orange_money"` | `"mtn_momo"`

### 4.15 `Payout`

```json
{
  "id": "pyt_5da5fc39",
  "transactionId": "txn_21d2602e",
  "amount": 16200,
  "commissionAmount": 1800,
  "status": "pending",
  "externalRef": null,
  "createdAt": "2026-06-19T08:46:28+01:00"
}
```

> `status` : `"pending"` | `"completed"` | `"failed"`

### 4.16 `ServiceCategory`

```json
{
  "id": "cat_plomberie",
  "label": "Plomberie",
  "iconKey": "wrench",
  "color": "#dbeafe",
  "demandCount": 47,
  "percentageShare": 34
}
```

### 4.17 `ProviderSearchResult`

```json
{
  "providerId": "usr_jcm456",
  "firstName": "Jean-Claude",
  "lastName": "Mbarga",
  "fullName": "Jean-Claude Mbarga",
  "phone": "+237699234567",
  "specialty": "Plomberie",
  "rating": 4.8,
  "hourlyRate": 4000,
  "serviceZone": { "city": "Bafoussam", "radiusKm": 20 },
  "isAvailable": true
}
```

---

## 5. Endpoints — Auth et user

> Ces endpoints sont accessibles sans token. `POST /auth/login` accepte tous les rôles.


### `POST /auth/register`

Inscription d'un nouvel utilisateur (client ou prestataire uniquement).

**Request body**

```json
{
  "firstName": "Madeleine",
  "lastName": "Kamdem",
  "email": "mk@email.cm",
  "password": "motdepasse123",
  "phone": "+237695123456",
  "role": "client"
}
```

> `role` : `"client"` | `"provider"` uniquement. Les rôles `"admin"` et `"agent"` ne sont pas auto-inscriptibles.

**Response 201**

```json
{
  "success": true,
  "data": {
    "userId": "b2adb724-8bd7-46b3-b527-b564f5c05a59",
    "email": "mk@email.cm",
    "message": "Compte créé. OTP de test : 123456"
  }
}
```

> ⚠️ **v2.1** : `userId` est l'UUID brut (non préfixé), `email` remplace `phone` dans la réponse.

**Erreurs possibles**

| Code | `error.code` | Détail |
|------|-------------|--------|
| 409 | `EMAIL_ALREADY_EXISTS` | Email déjà enregistré |
| 400 | `VALIDATION_ERROR` | Champ manquant ou format invalide |

---

### `POST /auth/verify-otp`

Vérification du code OTP et activation du compte.

> ⚠️ **v2.1** : accepte `email` (pas `userId` ni numéro de téléphone). Champ `code` (pas `otpCode`).
> Ne retourne **pas** de tokens — le compte est activé, l'utilisateur doit ensuite appeler `POST /auth/login`.

**Request body**

```json
{
  "email": "mk@email.cm",
  "code": "123456"
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "message": "Compte activé avec succès"
  }
}
```

**Erreurs possibles**

| Code | `error.code` | Détail |
|------|-------------|--------|
| 400 | `INVALID_OTP` | Code incorrect ou expiré |
| 404 | `USER_NOT_FOUND` | Email introuvable |

---

### `POST /auth/resend-otp`

Renvoi d'un nouvel OTP.

> ⚠️ **v2.1** : accepte `email` (pas `userId`).

**Request body**

```json
{
  "email": "mk@email.cm"
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "message": "OTP renvoyé. Code de test : 123456"
  }
}
```

---

### `POST /auth/login`

Connexion pour tous les rôles (Client, Prestataire, Admin, Agent).

**Request body**

```json
{
  "email": "mk@email.cm",
  "password": "motdepasse123"
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "tokenType": "Bearer",
    "expiresIn": 3600000,
    "role": "client",
    "user": {
      "id": "usr_abc123",
      "role": "client",
      "firstName": "Madeleine",
      "lastName": "Kamdem",
      "fullName": "Madeleine Kamdem",
      "phone": "+237695123456",
      "email": "mk@email.cm",
      "avatarInitial": "M",
      "status": "active",
      "createdAt": "2026-03-15T10:00:00+01:00"
    }
  },
  "meta": null
}
```

> ⚠️ **v2.1** : `role` en minuscules dans la réponse (`"client"`, pas `"CLIENT"`).
> `user` contient le profil complet selon le rôle (ClientProfile, ProviderProfile, etc.).

**Erreurs possibles**

| Code | `error.code` | Détail |
|------|-------------|--------|
| 401 | `INVALID_CREDENTIALS` | Email/mot de passe incorrects |
| 401 | `ACCOUNT_NOT_ACTIVATED` | Compte non activé — vérifier l'OTP |

---

### `POST /auth/refresh`

Rafraîchissement du token.

**Request body** : `{ "refreshToken": "eyJhbGci..." }`

**Response 200**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "tokenType": "Bearer",
    "expiresIn": 3600000,
    "role": "client",
    "user": { "...User selon le rôle" }
  },
  "meta": null
}
```

---

### `POST /auth/logout`

Révocation du refresh token.

**Request body** : `{ "refreshToken": "..." }`

**Response 200**

```json
{
  "success": true,
  "data": { "message": "Déconnexion réussie" },
  "meta": null
}
```

---

### `POST /auth/forgot-password` *(nouveau — v2.1)*

Demande de réinitialisation de mot de passe.

> Toujours `200` même si l'email n'existe pas (anti-énumération de comptes).

**Request body**

```json
{
  "email": "mk@email.cm"
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "message": "Si un compte existe avec cet email, un code de réinitialisation a été envoyé."
  },
  "meta": null
}
```

---

### `POST /auth/reset-password` *(nouveau — v2.1)*

Réinitialisation du mot de passe avec le code OTP reçu.

**Request body**

```json
{
  "email": "mk@email.cm",
  "code": "123456",
  "newPassword": "NouveauMotDePasse123!"
}
```

> `newPassword` : minimum 8 caractères.
> Après réinitialisation, tous les refresh tokens existants sont révoqués.

**Response 200**

```json
{
  "success": true,
  "data": { "message": "Mot de passe réinitialisé avec succès" },
  "meta": null
}
```

**Erreurs possibles**

| Code | `error.code` | Détail |
|------|-------------|--------|
| 400 | `INVALID_OTP` | Code incorrect ou expiré |
| 404 | `USER_NOT_FOUND` | Email introuvable |
| 400 | `VALIDATION_ERROR` | Mot de passe trop court |


### `GET /user/{id}`
informations public d'un utilisateur

**prestataire Response 200**

```json
{
    "success": true,
    "data": {
        "id": "2f19902b-0770-49b9-9974-a92dbb44a77c",
        "role": "provider",
        "firstName": "Jean-Claude",
        "lastName": "Mbarga",
        "fullName": "Jean-Claude Mbarga",
        "phone": "+237699234567",
        "email": "jcm@serviloc.cm",
        "avatarInitial": "J",
        "status": "active",
        "specialty": "Plomberie",
        "rating": 0.0,
        "completedMissions": 0,
        "isAvailable": true,
        "hourlyRate": 4000.0,
        "serviceZone": {
            "city": "Bafoussam",
            "radiusKm": 20.0
        },
        "availability": {
            "monday": {
                "start": "08:00",
                "end": "18:00",
                "available": true
            },
            "tuesday": {
                "start": "08:00",
                "end": "18:00",
                "available": true
            },
            "wednesday": {
                "start": "08:00",
                "end": "18:00",
                "available": true
            },
            "thursday": {
                "start": "08:00",
                "end": "18:00",
                "available": true
            },
            "friday": {
                "start": "08:00",
                "end": "18:00",
                "available": true
            },
            "saturday": {
                "start": "08:00",
                "end": "13:00",
                "available": true
            },
            "sunday": {
                "start": null,
                "end": null,
                "available": false
            }
        },
        "certifications": [
            "Artisan certifi\u00e9"
        ],
        "estCertifie": true,
        "createdAt": "2026-06-12T12:39:10+01:00"
    },
    "meta": null
}
```

**utilisateur Response 200**
```json
{
    "success": true,
    "data": {
        "id": "b2adb724-8bd7-46b3-b527-b564f5c05a59",
        "role": "client",
        "firstName": "Yannick",
        "lastName": "Ulrich",
        "fullName": "Yannick Ulrich",
        "phone": "+237612345678",
        "email": "yannick2@serviloc.cm",
        "avatarInitial": "Y",
        "status": "active",
        "completedMissions": 0,
        "location": null,
        "createdAt": "2026-06-08T21:15:28+01:00"
    },
    "meta": null
}
```
---

## 6. Endpoints — Client

> Tous ces endpoints nécessitent `Authorization: Bearer <token>` avec `role: "client"`.

### `GET /client/me`

Profil complet du client connecté.

**Response 200** → `{ "success": true, "data": { ...ClientProfile }, "meta": null }`

---

### `GET /client/dashboard`

Données agrégées du tableau de bord client.

**Response 200**

```json
{
  "success": true,
  "data": {
    "profile": { "...ClientProfile" },
    "recentDemands": [ "...ServiceDemand[]" ],
    "financialSummary": {
      "totalSpent": 55000,
      "completedMissions": 3,
      "pendingPayment": { "amount": 25000, "missionLabel": "Mission Plomberie en cours" }
    },
    "unreadMessages": 2
  }
}
```

---

### `GET /client/demands`

Liste paginée des demandes du client.

**Query params** : `?page=1&limit=20&status=en_cours`

**Response 200** → `{ "success": true, "data": ServiceDemand[], "meta": { pagination } }`

---

### `POST /client/demands`

Création d'une nouvelle demande.

**Request body**

```json
{
  "categoryId": "cat_plomberie",
  "description": "Fuite sous l'évier de la cuisine",
  "photoIds": ["photo_001"],
  "location": { "address": "Bafoussam, Quartier Commercial", "lat": 5.4764, "lng": 10.4207 },
  "isUrgent": false,
  "estimatedBudget": { "min": 20000, "max": 30000 }
}
```

**Response 201** → `{ "success": true, "data": { ...ServiceDemand }, "meta": null }`

---

### `GET /client/demands/:demandId`

Détail d'une demande.

**Response 200** → `{ "success": true, "data": { ...ServiceDemand }, "meta": null }`

---

### `GET /client/demands/:demandId/quote`

Devis associé à une demande.

**Response 200** → `{ "success": true, "data": { ...Quote }, "meta": null }`

---

### `POST /client/demands/:demandId/quote/accept`

Acceptation d'un devis et déclenchement du paiement (Saga 1).

**Request body**

```json
{
  "paymentMethod": "orange_money",
  "phoneNumber": "+237695123456"
}
```

> `paymentMethod` : `"orange_money"` | `"mtn_momo"`

**Response 200**

```json
{
  "success": true,
  "data": {
    "quoteId": "quote_001",
    "paymentStatus": "sequestre",
    "message": "Paiement séquestré. La mission peut démarrer."
  }
}
```

---

### `POST /client/demands/:demandId/quote/reject`

Refus d'un devis.

**Response 200** → `{ "success": true, "data": { "quoteId": "...", "status": "refuse" } }`

---

### `GET /client/missions/:missionId`

Suivi d'une mission.

**Response 200** → `{ "success": true, "data": { ...Mission }, "meta": null }`

---

### `POST /client/missions/:missionId/validate`

Validation de fin de mission.

**Response 200**

```json
{
  "success": true,
  "data": {
    "missionId": "msn_001",
    "validatedBy": "client",
    "bothValidated": true,
    "paymentStatus": "libere",
    "releasedAmount": 23000
  }
}
```

---

### `POST /client/missions/:missionId/rate`

Notation du prestataire.

**Request body**

```json
{
  "rating": 5,
  "criteria": { "punctuality": "tres_ponctuel", "quality": "excellent", "cleanliness": "tres_propre" },
  "comment": "Excellent travail."
}
```

**Response 201** → `{ "success": true, "data": { "ratingId": "...", "targetId": "...", "rating": 5 } }`

---

### `POST /client/missions/:missionId/litige`

Signalement d'un litige.

**Request body**

```json
{
  "motifId": "motif_incomplete",
  "description": "Le plombier n'a pas remplacé le siphon.",
  "evidenceIds": ["photo_001"]
}
```

**Response 201** → `{ "success": true, "data": { ...Litige }, "meta": null }`

---

### `PATCH /client/litiges/:litigeId/resolution/accept`

Acceptation de la résolution proposée par l'agent.

**Response 200**

```json
{
  "success": true,
  "data": { "litigeId": "lit_042", "clientAccepted": true, "providerAccepted": false, "status": "en_traitement" }
}
```

---

### `PATCH /client/litiges/:litigeId/resolution/reject`

Refus de la résolution.

**Request body** : `{ "reason": "Le remboursement proposé est insuffisant." }`

**Response 200** → `{ "success": true, "data": { "litigeId": "lit_042", "status": "en_traitement" } }`

---

### `GET /client/conversations`

Liste des conversations du client.

**Query params** : `?page=1&limit=20`

**Response 200**

```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "913520fa-087e-467e-85e1-5f03c447c833",
        "demandId": "00000000-0000-0000-0000-000000000001",
        "client": { "id": "usr_b2adb724", "firstName": "Yannick", "lastName": "Ulrich", "fullName": "Yannick Ulrich", "avatarInitial": "Y" },
        "provider": { "id": "usr_2f19902b", "firstName": "Jean-Claude", "lastName": "Mbarga", "fullName": "Jean-Claude Mbarga", "avatarInitial": "J" },
        "status": "active",
        "unreadCount": 0,
        "lastMessage": null,
        "createdAt": "2026-06-13T20:51:57+01:00",
        "updatedAt": "2026-06-13T20:54:39+01:00"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
  },
  "meta": null
}
```

---

### `POST /client/conversations`

Ouvrir une conversation (idempotente).

**Request body**

```json
{
  "providerId": "2f19902b-0770-49b9-9974-a92dbb44a77c",
  "demandId": "00000000-0000-0000-0000-000000000001"
}
```

> Si une conversation existe déjà pour `(clientId, providerId, demandId)`, l'existante est retournée.

**Response 201** → `{ "success": true, "data": { ...Conversation }, "meta": null }`

---

### `GET /client/conversations/:conversationId/messages`

Messages d'une conversation (du plus récent au plus ancien).

**Query params** : `?page=1&limit=30`

**Response 200**

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "74f946b0-0d69-4cbd-8b96-a85a62137f1d",
        "conversationId": "913520fa-087e-467e-85e1-5f03c447c833",
        "senderId": "b2adb724-8bd7-46b3-b527-b564f5c05a59",
        "senderRole": "client",
        "content": "Bonjour, êtes-vous disponible demain ?",
        "imageId": null,
        "read": false,
        "sentAt": "2026-06-13T20:54:39+01:00"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
  },
  "meta": null
}
```

---

### `POST /client/conversations/:conversationId/messages`

Envoyer un message.

**Request body**

```json
{
  "content": "Bonjour, êtes-vous disponible demain matin ?",
  "imageId": null
}
```

**Response 201** → `{ "success": true, "data": { ...Message }, "meta": null }`

---

### `GET /client/providers/search`

Recherche de prestataires disponibles.

**Query params**

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `specialty` | string | Oui | Ex: `"Plomberie"` |
| `lat` | float | Oui | Latitude client |
| `lng` | float | Oui | Longitude client |
| `radiusKm` | int | Non (défaut: 10) | Rayon de recherche |
| `minRating` | float | Non (défaut: 0) | Note minimale |
| `maxRate` | int | Non (défaut: 0 = illimité) | Tarif horaire max en XAF |

**Response 200** → `{ "success": true, "data": ProviderSearchResult[], "meta": { pagination } }`

---

### `GET /client/categories`

Liste des catégories disponibles.

**Response 200** → `{ "success": true, "data": ServiceCategory[], "meta": null }`

---

## 7. Endpoints — Prestataire

> Tous ces endpoints nécessitent `Authorization: Bearer <token>` avec `role: "provider"`.

### `GET /provider/me`

Profil complet du prestataire connecté.

**Response 200** → `{ "success": true, "data": { ...ProviderProfile }, "meta": null }`

---

### `PATCH /provider/profile`

Mise à jour du profil professionnel (UC18).

> ⚠️ **v2.1** : ajout des champs `latitude`, `longitude`, `serviceZoneCity`, `radiusKm` dans le request body.

**Request body**

```json
{
  "specialty": "Plomberie",
  "hourlyRate": 4000,
  "serviceZoneCity": "Bafoussam",
  "latitude": 5.4737,
  "longitude": 10.4179,
  "radiusKm": 20,
  "estCertifie": true,
  "certifications": ["Artisan certifié"],
  "documentIds": []
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "providerId": "usr_2f19902b",
    "message": "Profil mis à jour avec succès"
  },
  "meta": null
}
```

---

### `PATCH /provider/availability`

Mise à jour de la disponibilité.

**Request body** : `{ "isAvailable": true }`

**Response 200**

```json
{
  "success": true,
  "data": {
    "providerId": "usr_2f19902b",
    "isAvailable": true,
    "message": "Disponibilité mise à jour"
  },
  "meta": null
}
```

---

### `PATCH /provider/schedule`

Mise à jour des horaires hebdomadaires.

> ⚠️ **v2.1** : request body direct (sans clé `schedule`).

**Request body**

```json
{
  "monday":    { "start": "08:00", "end": "18:00", "available": true },
  "tuesday":   { "start": "08:00", "end": "18:00", "available": true },
  "wednesday": { "start": "08:00", "end": "18:00", "available": true },
  "thursday":  { "start": "08:00", "end": "18:00", "available": true },
  "friday":    { "start": "08:00", "end": "18:00", "available": true },
  "saturday":  { "start": "08:00", "end": "13:00", "available": true },
  "sunday":    { "start": null,    "end": null,    "available": false }
}
```

**Response 200**

```json
{
  "success": true,
  "data": { "providerId": "usr_2f19902b", "message": "Horaires mis à jour avec succès" },
  "meta": null
}
```

---

### `GET /provider/dashboard`

Tableau de bord prestataire.

**Response 200** → (voir v2.0 — inchangé)

---

### `GET /provider/demands/available`

Demandes disponibles dans la zone du prestataire.

**Response 200** → `{ "success": true, "data": ServiceDemand[], "meta": { pagination } }`

---

### `POST /provider/demands/:demandId/apply`

Postuler à une demande.

**Response 201**

```json
{
  "success": true,
  "data": { "demandId": "dem_xyz789", "status": "applied", "message": "Vous pouvez maintenant créer votre devis." }
}
```

---

### `POST /provider/demands/:demandId/quote`

Création d'un devis.

**Request body**

```json
{
  "demandId": "00000000-0000-0000-0000-000000000001",
  "providerId": "2f19902b-0770-49b9-9974-a92dbb44a77c",
  "amount": 25000,
  "description": "Remplacement joint + siphon évier cuisine",
  "materials": [
    { "name": "Joint silicone", "quantity": 2, "unitPrice": 1500 },
    { "name": "Siphon PVC",    "quantity": 1, "unitPrice": 4500 }
  ],
  "estimatedDurationHours": 2
}
```

**Response 201** → `{ "success": true, "data": { ...Quote }, "meta": null }`

---

### `GET /provider/missions`

Liste des missions.

**Query params** : `?status=en_cours&page=1`

**Response 200** → `{ "success": true, "data": Mission[], "meta": { pagination } }`

---

### `GET /provider/missions/:missionId`

Détail d'une mission.

**Response 200** → `{ "success": true, "data": { ...Mission }, "meta": null }`

---

### `POST /provider/missions/:missionId/start`

Démarrage d'une mission.

**Response 200** → `{ "success": true, "data": { "missionId": "...", "status": "en_cours", "startedAt": "..." } }`

---

### `PATCH /provider/missions/:missionId/steps/:stepId`

Mise à jour d'une étape.

**Request body** : `{ "completed": true }`

**Response 200** → `{ "success": true, "data": { "stepId": "...", "completed": true, "missionProgress": 67 } }`

---

### `POST /provider/missions/:missionId/complete`

Déclaration de fin de mission.

**Response 200** → `{ "success": true, "data": { "missionId": "...", "bothValidated": false, "status": "terminee" } }`

---

### `POST /provider/missions/:missionId/rate`

Notation du client (UC26).

**Request body** : `{ "rating": 4, "comment": "Client ponctuel." }`

**Response 201** → `{ "success": true, "data": { "ratingId": "...", "targetId": "...", "rating": 4 } }`

---

### `POST /provider/missions/:missionId/litige`

Signalement d'un litige par le prestataire.

**Request body** : même structure que `POST /client/missions/:id/litige`

**Response 201** → `{ "success": true, "data": { ...Litige }, "meta": null }`

---

### `PATCH /provider/litiges/:litigeId/resolution/accept`

Acceptation de la résolution.

**Response 200** → `{ "success": true, "data": { "litigeId": "...", "providerAccepted": true, "status": "..." } }`

---

### `PATCH /provider/litiges/:litigeId/resolution/reject`

Refus de la résolution.

**Request body** : `{ "reason": "..." }`

**Response 200** → `{ "success": true, "data": { "litigeId": "...", "status": "en_traitement" } }`

---

### `GET /provider/conversations`

Liste des conversations du prestataire.

**Response 200** — même structure que `GET /client/conversations`.

---

### `GET /provider/conversations/:conversationId/messages`

Messages d'une conversation.

**Response 200** — même structure que `GET /client/conversations/:id/messages`.

---

### `POST /provider/conversations/:conversationId/messages`

Envoyer un message.

**Request body** : `{ "content": "...", "imageId": null }`

**Response 201** → `{ "success": true, "data": { ...Message }, "meta": null }`

---

### `GET /provider/earnings`

Historique des gains.

**Query params** : `?page=1&month=2026-05`

**Response 200**

```json
{
  "success": true,
  "data": {
    "monthlyTotal": 18000,
    "payouts": [
      {
        "id": "pyt_5da5fc39",
        "transactionId": "txn_21d2602e",
        "amount": 16200,
        "commissionAmount": 1800,
        "status": "pending",
        "externalRef": null,
        "createdAt": "2026-06-19T08:46:28+01:00"
      }
    ]
  },
  "meta": null
}
```

> ⚠️ **v2.1** : `missions[]` non encore inclus (implémentation future). Seuls `monthlyTotal` et `payouts[]` sont retournés.

---

## 8. Endpoints — Admin

> Tous ces endpoints nécessitent `Authorization: Bearer <token>` avec `role: "admin"`.

### `GET /admin/dashboard`

Tableau de bord administrateur. *(voir v2.0 — inchangé)*

---

### `GET /admin/stats`

Statistiques complètes avec historique (UC33). *(voir v2.0 — inchangé)*

---

### `GET /admin/providers`

Liste des prestataires.

**Query params** : `?status=pending_verification&page=1`

**Response 200** → `{ "success": true, "data": { "providers": ProviderProfile[], "meta": { pagination } }, "meta": null }`

---

### `GET /admin/providers/:providerId`

Dossier complet d'un prestataire.

**Response 200**

```json
{
  "success": true,
  "data": {
    "id": "usr_2f19902b",
    "role": "provider",
    "...ProviderProfile",
    "agentReview": {
      "agentName": "Pauline F.",
      "verdict": "approved",
      "comment": "Dossier complet.",
      "reviewedAt": "2026-06-16T21:26:31+01:00"
    }
  },
  "meta": null
}
```

> `agentReview` est `null` si aucun agent n'a encore instruit le dossier.

---

### `POST /admin/providers/:providerId/validate`

Validation d'un dossier prestataire.

**Response 200**

```json
{
  "success": true,
  "data": { "providerId": "usr_2f19902b", "status": "validated", "message": "Dossier validé. Le prestataire a été notifié." },
  "meta": null
}
```

---

### `POST /admin/providers/:providerId/reject`

Rejet d'un dossier.

**Request body** : `{ "reason": "Casier judiciaire manquant." }`

**Response 200**

```json
{
  "success": true,
  "data": { "providerId": "usr_2f19902b", "status": "rejected", "message": "Dossier rejeté. Le prestataire a été notifié." },
  "meta": null
}
```

---

### `POST /admin/providers/:providerId/notify`

Envoi d'une notification de rappel au prestataire.

**Request body** : `{ "message": "Votre casier judiciaire est manquant." }`

**Response 200**

```json
{
  "success": true,
  "data": { "providerId": "usr_2f19902b", "status": "notified", "message": "Notification envoyée au prestataire." },
  "meta": null
}
```

---

### `GET /admin/users`

Liste paginée des utilisateurs.

**Query params** : `?role=client&status=active&search=Madeleine&page=1`

**Response 200**

```json
{
  "success": true,
  "data": {
    "users": [ { "...User" } ],
    "meta": { "page": 1, "limit": 20, "total": 4, "totalPages": 1 }
  },
  "meta": null
}
```

---

### `PATCH /admin/users/:userId/suspend`

Suspension d'un utilisateur.

**Request body**

```json
{
  "reason": "Comportement frauduleux",
  "duration": "7d"
}
```

> `duration` : `"24h"` | `"7d"` | `"indefinite"`

**Response 200**

```json
{
  "success": true,
  "data": { "userId": "usr_2f19902b", "status": "suspended", "duration": "7d", "reason": "Comportement frauduleux" },
  "meta": null
}
```

---

### `PATCH /admin/users/:userId/reactivate`

Réactivation d'un compte suspendu.

**Response 200** → `{ "success": true, "data": { ...User }, "meta": null }`

---

### `GET /admin/agents`

Liste des agents.

**Query params** : `?page=1&limit=20`

**Response 200** → `{ "success": true, "data": { "agents": AgentProfile[], "meta": { pagination } }, "meta": null }`

---

### `POST /admin/agents`

Création d'un compte agent.

**Request body**

```json
{
  "firstName": "Pauline",
  "lastName": "Fotso",
  "email": "p.fotso@serviloc.cm",
  "phone": "+237691000111",
  "department": "Service Client"
}
```

> Un mot de passe provisoire (`Serviloc@XXXX`) est généré et envoyé par email à l'agent.

**Response 201** → `{ "success": true, "data": { ...AgentProfile }, "meta": null }`

---

### `GET /admin/agents/:agentId`

Détail d'un agent.

**Response 200** → `{ "success": true, "data": { ...AgentProfile }, "meta": null }`

---

### `PATCH /admin/agents/:agentId/suspend`

Suspension d'un agent.

**Request body** : `{ "reason": "...", "duration": "7d" }`

**Response 200**

```json
{
  "success": true,
  "data": { "userId": "usr_201a92e4", "status": "suspended", "duration": "7d", "reason": "..." },
  "meta": null
}
```

---

### `DELETE /admin/agents/:agentId`

Suppression définitive d'un agent.

**Response 200**

```json
{
  "success": true,
  "data": { "agentId": "usr_201a92e4", "deleted": true },
  "meta": null
}
```

---

### `GET /admin/litiges`

Liste des litiges avec métriques. *(voir v2.0 — inchangé)*

---

### `GET /admin/litiges/:litigeId`

Détail d'un litige. *(voir v2.0 — inchangé)*

---

### `POST /admin/litiges/:litigeId/assign`

Assignation d'un agent.

**Request body** : `{ "agentId": "usr_agent01" }`

**Response 200** → `{ "success": true, "data": { "litigeId": "...", "agentId": "...", "status": "assigne" } }`

---

### `PUT /admin/litiges/:litigeId/assign`

Réassignation à un autre agent.

**Response 200** → `{ "success": true, "data": { "litigeId": "...", "agentId": "...", "status": "assigne" } }`

---

### `GET /admin/litiges/stats`

Statistiques de traitement des litiges. *(voir v2.0 — inchangé)*

---

### `GET /admin/transactions`

Liste des transactions.

**Query params** : `?status=sequestre&page=1`

**Response 200** → `{ "success": true, "data": { "transactions": Transaction[], "meta": { pagination } }, "meta": null }`

---

### `PATCH /admin/settings/commission`

Mise à jour des taux de commission.

**Request body** : `{ "standardRate": 10, "urgencyRate": 15 }`

**Response 200**

```json
{
  "success": true,
  "data": { "standardRate": 10, "urgencyRate": 15, "message": "Taux de commission mis à jour" },
  "meta": null
}
```

---

### `GET /admin/categories`, `POST /admin/categories`, `PUT /admin/categories/:id`, `DELETE /admin/categories/:id`

*(voir v2.0 — inchangés)*

---

## 9. Endpoints — Agent Service Client

> Tous ces endpoints nécessitent `Authorization: Bearer <token>` avec `role: "agent"`.

### `GET /agent/providers`

Liste des dossiers prestataires à instruire (UC30-agent).

**Query params** : `?page=1&limit=20`

**Response 200** → `{ "success": true, "data": { "providers": ProviderProfile[], "meta": { pagination } }, "meta": null }`

---

### `GET /agent/providers/:providerId`

Dossier complet d'un prestataire.

**Response 200** — même structure que `GET /admin/providers/:providerId`.

---

### `POST /agent/providers/:providerId/review`

Instruction du dossier (UC30-agent).

**Request body**

```json
{
  "verdict": "approved",
  "comment": "Dossier complet. Certifications vérifiées."
}
```

> `verdict` : `"approved"` | `"rejected"` | `"needs_revision"`

**Response 200**

```json
{
  "success": true,
  "data": {
    "id": "usr_e055411a",
    "agentId": "usr_201a92e4",
    "providerId": "usr_2f19902b",
    "verdict": "approved",
    "comment": "Dossier complet. Certifications vérifiées.",
    "reviewedAt": "2026-06-16T21:26:31+01:00",
    "message": "Instruction enregistrée. L'administrateur a été notifié."
  },
  "meta": null
}
```

---

### `GET /agent/litiges`

Litiges assignés à l'agent connecté (UC36).

**Response 200** *(voir v2.0 — inchangé)*

---

### `GET /agent/litiges/:litigeId`

Détail d'un litige assigné (UC36). *(voir v2.0)*

---

### `GET /agent/litiges/:litigeId/history`

Historique du chat client/prestataire (UC37). *(voir v2.0)*

---

### `GET /agent/litiges/:litigeId/messages`

Échanges agent/parties. *(voir v2.0)*

---

### `POST /agent/litiges/:litigeId/messages`

L'agent envoie un message. *(voir v2.0)*

---

### `POST /agent/litiges/:litigeId/resolution`

Proposition de résolution (UC38). *(voir v2.0)*

---

### `PUT /agent/litiges/:litigeId/resolution`

Modification de la résolution. *(voir v2.0)*

---

### `POST /agent/litiges/:litigeId/close`

Clôture définitive (UC38). *(voir v2.0)*

---

### `POST /agent/litiges/:litigeId/suspend-user`

Suspension contextuelle d'une partie (UC31-agent).

**Request body**

```json
{
  "userId": "usr_abc123",
  "reason": "Fraude confirmée.",
  "suspendedById": "201a92e4-cda4-4769-8b7b-57d89d409c27"
}
```

> ⚠️ **v2.1** : ajout du champ `suspendedById` (UUID de l'agent). La durée est fixée à **7 jours**.

**Response 200**

```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "status": "suspended",
    "duration": "7d",
    "litigeId": "lit_abc123"
  }
}
```

---

## 10. Upload de fichiers

> Ces endpoints sont accessibles à tous les rôles authentifiés.

### `POST /uploads/photos`

**Request** : `multipart/form-data` — champ `photos` (jpg/png/webp, max 5 Mo), champ `context`

**Response 201**

```json
{
  "success": true,
  "data": {
    "uploads": [
      { "id": "photo_001", "url": "https://cdn.serviloc.cm/uploads/photo_001.jpg", "name": "photo.jpg", "sizeBytes": 245000 }
    ]
  }
}
```

---

### `POST /uploads/documents`

**Request** : `multipart/form-data` — champ `document` (PDF/image, max 10 Mo), champ `type`

**Response 201** — même format que `POST /uploads/photos`.

---

## 11. Calendrier de livraison backend

| Semaine | Endpoints livrés | Statut |
|---------|-----------------|--------|
| **S1** | `POST /auth/register`, `POST /auth/verify-otp`, `POST /auth/resend-otp`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` | ✅ Livré et testé |
| **S1** | `GET /client/categories`, `GET/POST/PUT/DELETE /admin/categories/**` | ✅ Livré et testé (KKP) |
| **S1** | Eureka Server + API Gateway opérationnels | ✅ Livré et testé |
| **S2** | `GET /client/me`, `GET /provider/me` | ✅ Livré et testé |
| **S2** | `PATCH /provider/profile`, `PATCH /provider/availability`, `PATCH /provider/schedule` | ✅ Livré et testé |
| **S2** | `GET /admin/users`, `PATCH /admin/users/:id/suspend`, `PATCH /admin/users/:id/reactivate` | ✅ Livré et testé |
| **S2** | `GET /admin/providers`, `GET /admin/providers/:id` | ✅ Livré et testé |
| **S2** | `GET /admin/agents`, `POST /admin/agents`, `GET /admin/agents/:id` | ✅ Livré et testé |
| **S2** | `GET/POST /client/conversations`, `GET/POST /client\|provider/conversations/:id/messages` | ✅ Livré et testé |
| **S2** | `GET /client/providers/search` | ⏳ En attente Service Missions (TK) |
| **S2** | `GET /client/dashboard`, `GET /provider/dashboard`, `GET /admin/dashboard` | ⏳ En attente Service Missions (TK) |
| **S3** | `POST /admin/providers/:id/validate\|reject\|notify` | ✅ Livré et testé |
| **S3** | `GET /agent/providers`, `GET /agent/providers/:id`, `POST /agent/providers/:id/review` | ✅ Livré et testé |
| **S3** | `POST /client/demands`, `GET /client/demands`, `GET /client/demands/:id` | ⏳ En attente Service Missions (TK) |
| **S3** | `GET /client/demands/:id/quote`, `POST /client/demands/:id/quote/accept\|reject` | ⏳ En attente Service Missions (TK) |
| **S3** | `GET /client\|provider/missions/**`, `POST /provider/missions/:id/start\|complete` | ⏳ En attente Service Missions (TK) |
| **S3** | `GET /admin/litiges`, `GET /admin/litiges/:id`, `POST /admin/litiges/:id/assign` | ⏳ En attente Service Litiges (TK) |
| **S3** | `GET /agent/litiges/**`, `POST /agent/litiges/:id/messages` | ⏳ En attente Service Litiges (TK) |
| **S4** | `GET /provider/earnings` | ✅ Livré et testé |
| **S4** | `GET /admin/transactions`, `PATCH /admin/settings/commission` | ✅ Livré et testé |
| **S4** | `PATCH /admin/agents/:id/suspend`, `DELETE /admin/agents/:id` | ✅ Livré et testé |
| **S4** | `POST /auth/forgot-password`, `POST /auth/reset-password` | ✅ Livré et testé |
| **S4** | `POST /agent/litiges/:id/resolution`, `POST /agent/litiges/:id/close` | ⏳ En attente Service Litiges (TK) |
| **S4** | `PATCH /client\|provider/litiges/:id/resolution/accept\|reject` | ⏳ En attente Service Litiges (TK) |
| **S4** | `POST /uploads/photos`, `POST /uploads/documents` | ✅ Livré et testé (KKP) |
| **S4** | `GET /admin/stats` | ⏳ En attente Service Missions (TK) |

> **Convention de statut** : ⬜ À livrer · ⏳ En attente dépendance · 🔄 En cours · ✅ Livré et testé · ❌ Bloqué

---

## 12. Données mock frontend (fallback)

*(voir v2.0 — inchangé)*

---

## 13. Règles de coordination

*(voir v2.0 — inchangé)*

---

*Document ServiLoc — Frontend Team · Backend Team · Juillet 2026 · Version 2.1*
