# API_CONTRACT.md — ServiLoc

> **Document fondateur — à maintenir par les deux équipes (frontend + backend)**
> Toute modification d'un endpoint, d'un format de réponse ou d'un schéma doit être notifiée 48h à l'avance avec un diff explicite dans ce fichier.
> Dernière mise à jour : 31 mai 2026 · Version 1.0

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
9. [Upload de fichiers](#9-upload-de-fichiers)
10. [Calendrier de livraison backend](#10-calendrier-de-livraison-backend)
11. [Données mock frontend (fallback)](#11-données-mock-frontend-fallback)
12. [Règles de coordination](#12-règles-de-coordination)

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

### 2.2 Payload JWT décodé

```json
{
  "sub": "usr_abc123",
  "role": "client",
  "phone": "+237695000000",
  "iat": 1748736000,
  "exp": 1748739600
}
```

| Champ | Valeurs possibles | Usage frontend |
|-------|-------------------|----------------|
| `sub` | UUID utilisateur | ID courant |
| `role` | `"client"` \| `"provider"` \| `"admin"` \| `"service_client"` | Routing et affichage |

### 2.3 Rafraîchissement automatique

Le frontend appelle `/auth/refresh` automatiquement quand l'API retourne `401 UNAUTHORIZED`. Si le refresh échoue, l'utilisateur est redirigé vers `/login`.

```javascript
// src/services/authService.ts — logique de rafraîchissement
const response = await fetch('/v1/auth/refresh', {
  method: 'POST',
  body: JSON.stringify({ refreshToken: localStorage.getItem('serviloc_refresh') })
});
```

### 2.4 Rôles et accès

| Rôle | Espaces accessibles | Espace interdit |
|------|--------------------|-----------------| 
| `client` | `/client/*` | Tout le reste |
| `provider` | `/provider/*` | Tout le reste |
| `admin` | `/admin/*` | Tout le reste |
| `service_client` | `/admin/litiges/*` (lecture seule + médiation) | Tout le reste |

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

> `meta` est présent uniquement sur les endpoints paginés. Il est absent des réponses d'entité unique.

### 3.2 Erreur

**Format unique pour TOUTES les erreurs, tous les endpoints.**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "Code OTP erroné — 2 tentatives restantes avant blocage temporaire",
    "field": "otpCode"
  }
}
```

| Champ | Type | Présence | Description |
|-------|------|----------|-------------|
| `code` | `string` | Toujours | Code machine lisible côté frontend |
| `message` | `string` | Toujours | Message en français pour l'affichage |
| `field` | `string` | Optionnel | Champ concerné (validation de formulaire) |

### 3.3 Codes d'erreur standardisés

| Code HTTP | `error.code` | Signification |
|-----------|-------------|---------------|
| 400 | `VALIDATION_ERROR` | Données de formulaire invalides |
| 400 | `INVALID_OTP` | Code OTP incorrect |
| 400 | `OTP_EXPIRED` | Code OTP expiré (renvoyer) |
| 400 | `OTP_MAX_ATTEMPTS` | Trop de tentatives — compte bloqué |
| 401 | `UNAUTHORIZED` | Token absent ou invalide |
| 401 | `TOKEN_EXPIRED` | Access token expiré |
| 401 | `INVALID_CREDENTIALS` | Email/mot de passe incorrects |
| 403 | `FORBIDDEN` | Rôle insuffisant pour cette ressource |
| 404 | `NOT_FOUND` | Ressource introuvable |
| 409 | `ALREADY_EXISTS` | Conflit (ex: email déjà utilisé) |
| 422 | `UNPROCESSABLE` | Logique métier impossible (ex: mission déjà démarrée) |
| 429 | `RATE_LIMITED` | Trop de requêtes |
| 500 | `SERVER_ERROR` | Erreur serveur — contacter le backend |

---

## 4. Schémas des objets métier

> Ces schémas définissent la structure **exacte** des objets retournés par l'API. Le frontend ne doit pas inférer des champs non listés ici.

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

> `status` : `"active"` | `"suspended"` | `"pending_verification"`

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
  "createdAt": "2025-11-10T08:00:00+01:00"
}
```

### 4.4 `ServiceDemand` (demande de service)

```json
{
  "id": "dem_xyz789",
  "clientId": "usr_abc123",
  "category": {
    "id": "cat_plomberie",
    "label": "Plomberie",
    "iconKey": "wrench"
  },
  "description": "Fuite sous l'évier de la cuisine, eau qui s'écoule en permanence",
  "photos": [
    {
      "id": "photo_001",
      "url": "https://cdn.serviloc.cm/demands/photo_001.jpg",
      "name": "photo_sous_evier.jpg"
    }
  ],
  "location": {
    "address": "Bafoussam, Quartier Commercial",
    "lat": 5.4764,
    "lng": 10.4207
  },
  "status": "en_cours",
  "isUrgent": false,
  "estimatedBudget": {
    "min": 20000,
    "max": 30000
  },
  "providerId": "usr_jcm456",
  "providerName": "Jean-Claude M.",
  "quoteId": "quote_001",
  "missionId": "msn_001",
  "createdAt": "2026-05-21T08:00:00+01:00",
  "updatedAt": "2026-05-21T09:32:00+01:00"
}
```

> `status` : `"ouverte"` | `"en_cours"` | `"terminee"` | `"annulee"` | `"litige"`

### 4.5 `Quote` (devis)

```json
{
  "id": "quote_001",
  "demandId": "dem_xyz789",
  "providerId": "usr_jcm456",
  "clientId": "usr_abc123",
  "reference": "DEV-2026-001",
  "status": "en_attente",
  "laborDescription": "Remplacement joint + siphon évier cuisine",
  "laborAmount": 15000,
  "materials": [
    {
      "id": "mat_001",
      "designation": "Joint silicone cuisine",
      "quantity": 2,
      "unitPrice": 1500,
      "subtotal": 3000
    },
    {
      "id": "mat_002",
      "designation": "Siphon PVC universel",
      "quantity": 1,
      "unitPrice": 4500,
      "subtotal": 4500
    },
    {
      "id": "mat_003",
      "designation": "Visserie + colliers",
      "quantity": 1,
      "unitPrice": 500,
      "subtotal": 500
    }
  ],
  "materialsTotal": 8000,
  "totalAmount": 23000,
  "estimatedDurationHours": 2,
  "validityDays": 5,
  "createdAt": "2026-05-20T14:00:00+01:00",
  "expiresAt": "2026-05-25T14:00:00+01:00"
}
```

> `status` : `"en_attente"` | `"accepte"` | `"refuse"` | `"expire"`

### 4.6 `Mission`

```json
{
  "id": "msn_001",
  "demandId": "dem_xyz789",
  "quoteId": "quote_001",
  "clientId": "usr_abc123",
  "providerId": "usr_jcm456",
  "category": "Plomberie",
  "title": "Fuite cuisine — Madeleine K.",
  "status": "en_cours",
  "totalAmount": 23000,
  "sequesteredAmount": 23000,
  "paymentStatus": "sequestre",
  "startedAt": "2026-05-21T09:32:00+01:00",
  "estimatedDurationHours": 2,
  "completedAt": null,
  "steps": [
    { "id": "step_001", "label": "Coupure eau principale vérifiée",    "completed": true,  "order": 1 },
    { "id": "step_002", "label": "Démontage siphon fissuré",           "completed": true,  "order": 2 },
    { "id": "step_003", "label": "Remplacement joint silicone ×2",     "completed": true,  "order": 3 },
    { "id": "step_004", "label": "Installation siphon PVC neuf",       "completed": true,  "order": 4 },
    { "id": "step_005", "label": "Test d'étanchéité (5 min eau courante)", "completed": false, "order": 5 },
    { "id": "step_006", "label": "Nettoyage zone d'intervention",     "completed": false, "order": 6 }
  ],
  "providerLocation": {
    "lat": 5.4764,
    "lng": 10.4207,
    "label": "Jean-Claude est arrivé",
    "sublabel": "Quartier Commercial, Bafoussam"
  },
  "location": {
    "address": "Bafoussam, Quartier Commercial",
    "lat": 5.4764,
    "lng": 10.4207
  }
}
```

> `status` : `"en_attente"` | `"en_cours"` | `"terminee"` | `"litige"`
> `paymentStatus` : `"sequestre"` | `"libere"` | `"litige"` | `"rembourse"`

### 4.7 `Litige`

```json
{
  "id": "lit_042",
  "reference": "#L-042",
  "demandId": "dem_xyz789",
  "missionId": "msn_001",
  "clientId": "usr_abc123",
  "providerId": "usr_jcm456",
  "agentId": null,
  "motif": {
    "id": "motif_incomplete",
    "title": "Prestation incomplète",
    "description": "Les travaux prévus n'ont pas été entièrement réalisés"
  },
  "description": "Le plombier n'a pas remplacé le siphon comme prévu dans le devis.",
  "evidences": [
    {
      "id": "ev_001",
      "url": "https://cdn.serviloc.cm/litiges/photo_sous_evier.jpg",
      "name": "photo_sous_evier.jpg"
    }
  ],
  "amount": 23000,
  "status": "ouvert",
  "resolution": null,
  "createdAt": "2026-05-21T11:00:00+01:00",
  "updatedAt": "2026-05-21T11:00:00+01:00"
}
```

> `status` : `"ouvert"` | `"traitement"` | `"resolu"` | `"annule"`
> `resolution` : `null` | `"remboursement_partiel"` | `"annulation_complete"` | `"dedommagement"`

### 4.8 `Transaction`

```json
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
}
```

> `paymentMethod` : `"orange_money"` | `"mtn_momo"`
> `status` : `"sequestre"` | `"libere"` | `"litige"` | `"rembourse"`

### 4.9 `ManagedUser` (vue admin)

```json
{
  "id": "usr_abc123",
  "fullName": "Madeleine Kamdem",
  "email": "mk@email.cm",
  "phone": "+237695123",
  "role": "client",
  "avatarInitial": "M",
  "missionsCount": 3,
  "rating": 4.2,
  "status": "active",
  "createdAt": "2026-02-10T00:00:00+01:00"
}
```

> `role` : `"client"` | `"provider"`
> `status` : `"active"` | `"suspended"`

### 4.10 `ServiceCategory`

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

> `iconKey` : `"wrench"` | `"bolt"` | `"broom"` | `"key"` | `"brush"` | `"plus"` — le frontend résout l'icône depuis cette clé.

---

## 5. Endpoints — Auth

### `POST /auth/register`

Inscription d'un nouvel utilisateur (client ou prestataire).

**Request body**

```json
{
  "role": "client",
  "firstName": "Madeleine",
  "lastName": "Kamdem",
  "phone": "+237695123456",
  "email": "mk@email.cm",
  "password": "motdepasse123"
}
```

**Response 201**

```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "phone": "+237695123456",
    "otpSent": true,
    "message": "Un code SMS a été envoyé au +237 695 XXX XXX"
  }
}
```

**Erreurs possibles**

| Code | `error.code` |
|------|-------------|
| 409 | `ALREADY_EXISTS` — email ou téléphone déjà enregistré |
| 400 | `VALIDATION_ERROR` — champ manquant ou format invalide |

---

### `POST /auth/verify-otp`

Vérification du code OTP reçu par SMS.

**Request body**

```json
{
  "userId": "usr_abc123",
  "otpCode": "4782"
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": { ...ClientProfile }
  }
}
```

**Erreurs possibles**

| Code | `error.code` |
|------|-------------|
| 400 | `INVALID_OTP` — code incorrect, avec `attemptsRemaining` dans `error` |
| 400 | `OTP_EXPIRED` — code expiré |
| 400 | `OTP_MAX_ATTEMPTS` — compte bloqué |

---

### `POST /auth/resend-otp`

Renvoi du code OTP (soumis après expiration du countdown de 45s).

**Request body**

```json
{
  "userId": "usr_abc123"
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "otpSent": true,
    "cooldownSeconds": 45
  }
}
```

---

### `POST /auth/login`

Connexion (Client, Prestataire, Admin, Service Client).

**Request body**

```json
{
  "email": "admin@serviloc.cm",
  "password": "••••••••"
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": { ...User }
  }
}
```

**Erreurs possibles**

| Code | `error.code` |
|------|-------------|
| 401 | `INVALID_CREDENTIALS` — email/mot de passe incorrects, avec `attemptsRemaining` |
| 401 | `ACCOUNT_BLOCKED` — compte bloqué après 5 tentatives |
| 403 | `ACCOUNT_SUSPENDED` — compte suspendu par un admin |

---

### `POST /auth/refresh`

Rafraîchissement du token (appelé automatiquement par le frontend).

**Request body**

```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

---

### `POST /auth/logout`

Révocation du refresh token.

**Request body** : `{ "refreshToken": "..." }`

**Response 200** : `{ "success": true }`

---

## 6. Endpoints — Client

> Tous ces endpoints nécessitent `Authorization: Bearer <token>` avec `role: "client"`.

### `GET /client/me`

Profil complet du client connecté (dashboard, welcome banner, financial summary).

**Response 200** → `{ "data": { ...ClientProfile } }`

---

### `GET /client/dashboard`

Données agrégées du tableau de bord client.

**Response 200**

```json
{
  "success": true,
  "data": {
    "profile": { ...ClientProfile },
    "recentDemands": [ ...ServiceDemand[] ],
    "financialSummary": {
      "totalSpent": 55000,
      "completedMissions": 3,
      "pendingPayment": {
        "amount": 25000,
        "missionLabel": "Mission Plomberie en cours"
      }
    },
    "unreadMessages": 2
  }
}
```

---

### `GET /client/demands`

Liste paginée de toutes les demandes du client.

**Query params** : `?page=1&limit=20&status=en_cours`

**Response 200** → `{ "data": ServiceDemand[], "meta": { pagination } }`

---

### `POST /client/demands`

Création d'une nouvelle demande de service.

**Request body**

```json
{
  "categoryId": "cat_plomberie",
  "description": "Fuite sous l'évier de la cuisine",
  "photoIds": ["photo_001"],
  "location": {
    "address": "Bafoussam, Quartier Commercial",
    "lat": 5.4764,
    "lng": 10.4207
  },
  "isUrgent": false
}
```

**Response 201** → `{ "data": { ...ServiceDemand } }`

---

### `GET /client/demands/:demandId`

Détail d'une demande.

**Response 200** → `{ "data": { ...ServiceDemand } }`

---

### `GET /client/demands/:demandId/quote`

Devis associé à une demande.

**Response 200** → `{ "data": { ...Quote } }`

---

### `POST /client/demands/:demandId/quote/accept`

Acceptation d'un devis et paiement.

**Request body**

```json
{
  "paymentMethod": "orange_money",
  "phoneNumber": "+237695123456"
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "quoteId": "quote_001",
    "missionId": "msn_001",
    "paymentStatus": "sequestre",
    "message": "Paiement séquestré. La mission peut démarrer."
  }
}
```

---

### `POST /client/demands/:demandId/quote/reject`

Refus d'un devis.

**Response 200** → `{ "data": { "quoteId": "quote_001", "status": "refuse" } }`

---

### `GET /client/missions/:missionId`

Suivi d'une mission en cours (steps, localisation prestataire, montant séquestré).

**Response 200** → `{ "data": { ...Mission } }`

---

### `POST /client/missions/:missionId/validate`

Validation de fin de mission par le client (libère le séquestre).

**Response 200**

```json
{
  "success": true,
  "data": {
    "missionId": "msn_001",
    "paymentStatus": "libere",
    "releasedAmount": 23000
  }
}
```

---

### `POST /client/missions/:missionId/rate`

Notation du prestataire après mission terminée.

**Request body**

```json
{
  "rating": 5,
  "criteria": {
    "punctuality": "tres_ponctuel",
    "quality":     "excellent",
    "cleanliness": "tres_propre"
  },
  "comment": "Excellent travail, très professionnel."
}
```

**Response 201** → `{ "data": { "ratingId": "rat_001", "providerId": "usr_jcm456" } }`

---

### `POST /client/missions/:missionId/litige`

Signalement d'un litige sur une mission.

**Request body**

```json
{
  "motifId": "motif_incomplete",
  "description": "Le plombier n'a pas remplacé le siphon comme prévu.",
  "evidenceIds": ["photo_001"]
}
```

**Response 201** → `{ "data": { ...Litige } }`

---

### `GET /client/categories`

Liste des catégories de services disponibles.

**Response 200** → `{ "data": ServiceCategory[] }`

---

## 7. Endpoints — Prestataire

> Tous ces endpoints nécessitent `Authorization: Bearer <token>` avec `role: "provider"`.

### `GET /provider/me`

Profil complet du prestataire connecté.

**Response 200** → `{ "data": { ...ProviderProfile } }`

---

### `GET /provider/dashboard`

Données agrégées du tableau de bord prestataire.

**Response 200**

```json
{
  "success": true,
  "data": {
    "profile": { ...ProviderProfile },
    "metrics": {
      "missionsThisMonth": 18,
      "netEarnings": 185000,
      "averageRating": 4.8,
      "availableDemandsCount": 11,
      "trends": {
        "missions": { "value": "+3", "direction": "up",     "subtext": "+3 vs avril" },
        "earnings": { "value": "+22%", "direction": "up",   "subtext": "+22%" },
        "rating":   { "value": "+0.1", "direction": "up",   "subtext": "+0.1" }
      }
    },
    "recentMissions": [ ...Mission[] ],
    "availability": { ...scheduleObject }
  }
}
```

---

### `PATCH /provider/availability`

Mise à jour du statut de disponibilité en temps réel (toggle "Disponible / Indisponible").

**Request body**

```json
{
  "isAvailable": true
}
```

**Response 200** → `{ "data": { "isAvailable": true } }`

---

### `PATCH /provider/schedule`

Mise à jour du planning hebdomadaire.

**Request body**

```json
{
  "schedule": {
    "monday":    { "start": "08:00", "end": "18:00", "available": true },
    "saturday":  { "start": "08:00", "end": "13:00", "available": true },
    "sunday":    { "start": null,    "end": null,    "available": false }
  }
}
```

**Response 200** → `{ "data": { "schedule": { ...updatedSchedule } } }`

---

### `GET /provider/demands/available`

Liste des demandes disponibles correspondant aux compétences et à la zone du prestataire.

**Query params** : `?page=1&limit=20&zone=priority&category=cat_plomberie`

> `zone` : `"priority"` (zone prioritaire, défaut) | `"extended"` (zones éloignées)

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "dem_xyz789",
      "category": { "id": "cat_plomberie", "label": "Plomberie", "iconKey": "wrench" },
      "description": "Fuite sous l'évier de la cuisine",
      "isUrgent": true,
      "status": "ouverte",
      "estimatedBudget": { "min": 20000, "max": 30000 },
      "distanceKm": 0.8,
      "clientRating": 4.2,
      "postedMinutesAgo": 5,
      "location": { "address": "Bafoussam, Quartier Commercial" }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 11, "totalPages": 1 }
}
```

---

### `POST /provider/demands/:demandId/apply`

Postuler à une demande (indique l'intention de créer un devis).

**Response 201**

```json
{
  "success": true,
  "data": {
    "demandId": "dem_xyz789",
    "status": "applied",
    "message": "Vous pouvez maintenant créer votre devis."
  }
}
```

---

### `POST /provider/demands/:demandId/quote`

Création d'un devis pour une demande.

**Request body**

```json
{
  "laborDescription": "Remplacement joint + siphon évier cuisine",
  "laborAmount": 15000,
  "materials": [
    { "designation": "Joint silicone cuisine", "quantity": 2, "unitPrice": 1500 },
    { "designation": "Siphon PVC universel",   "quantity": 1, "unitPrice": 4500 },
    { "designation": "Visserie + colliers",    "quantity": 1, "unitPrice": 500 }
  ],
  "estimatedDurationHours": 2
}
```

**Response 201** → `{ "data": { ...Quote } }`

---

### `GET /provider/missions`

Liste des missions du prestataire.

**Query params** : `?status=en_cours&page=1`

**Response 200** → `{ "data": Mission[], "meta": { pagination } }`

---

### `GET /provider/missions/:missionId`

Détail d'une mission.

**Response 200** → `{ "data": { ...Mission } }`

---

### `POST /provider/missions/:missionId/start`

Démarrage d'une mission (notifie le client, enregistre l'heure de début).

**Response 200**

```json
{
  "success": true,
  "data": {
    "missionId": "msn_001",
    "status": "en_cours",
    "startedAt": "2026-05-21T09:32:00+01:00"
  }
}
```

---

### `PATCH /provider/missions/:missionId/steps/:stepId`

Mise à jour d'une étape de mission (cocher/décocher).

**Request body** : `{ "completed": true }`

**Response 200** → `{ "data": { "stepId": "step_001", "completed": true, "missionProgress": 67 } }`

---

### `POST /provider/missions/:missionId/complete`

Déclaration de fin de mission (attend validation client).

**Response 200** → `{ "data": { "missionId": "msn_001", "status": "terminee" } }`

---

### `GET /provider/earnings`

Historique des gains et paiements.

**Query params** : `?page=1&month=2026-05`

**Response 200**

```json
{
  "success": true,
  "data": {
    "monthlyTotal": 185000,
    "missions": [ ...Mission[] ],
    "payouts": [
      {
        "id": "pay_001",
        "amount": 22500,
        "missionId": "msn_001",
        "method": "orange_money",
        "paidAt": "2026-05-21T14:00:00+01:00"
      }
    ]
  },
  "meta": { "page": 1, "limit": 20, "total": 18 }
}
```

---

## 8. Endpoints — Admin

> Tous ces endpoints nécessitent `Authorization: Bearer <token>` avec `role: "admin"` ou `role: "service_client"` (pour les litiges uniquement).

### `GET /admin/dashboard`

Tableau de bord administrateur complet.

**Response 200**

```json
{
  "success": true,
  "data": {
    "metrics": {
      "activeDemands":    { "value": 47, "trend": "+12%" },
      "ongoingMissions":  { "value": 23, "trend": "+5%" },
      "monthlyRevenue":   { "value": 8400000, "trend": "+31%" },
      "commissionEarned": { "value": 672000, "trend": "+31%" }
    },
    "pendingValidations": [ ...ProviderProfile[] ],
    "activeLitiges": [ ...Litige[] ],
    "popularCategories": [ ...ServiceCategory[] ],
    "recentTransactions": [ ...Transaction[] ]
  }
}
```

---

### `GET /admin/providers`

Liste des prestataires avec filtre et pagination.

**Query params** : `?status=pending_verification&page=1`

> `status` : `"active"` | `"pending_verification"` | `"suspended"`

**Response 200** → `{ "data": ProviderProfile[], "meta": { pagination } }`

---

### `GET /admin/providers/:providerId`

Dossier complet d'un prestataire (informations + documents fournis).

**Response 200**

```json
{
  "success": true,
  "data": {
    "provider": { ...ProviderProfile },
    "documents": [
      {
        "id": "doc_001",
        "type": "carte_professionnelle",
        "label": "Carte professionnelle",
        "reference": "Artisan électricien N°EL-2023-089",
        "status": "valide",
        "fileUrl": "https://cdn.serviloc.cm/docs/doc_001.pdf"
      },
      {
        "id": "doc_002",
        "type": "cni",
        "label": "Pièce d'identité nationale",
        "reference": "CNI N°12345678 · Exp. 2028",
        "status": "valide",
        "fileUrl": "https://cdn.serviloc.cm/docs/doc_002.pdf"
      },
      {
        "id": "doc_003",
        "type": "casier_judiciaire",
        "label": "Casier judiciaire < 3 mois",
        "reference": null,
        "status": "manquant",
        "fileUrl": null
      },
      {
        "id": "doc_004",
        "type": "assurance",
        "label": "Assurance responsabilité",
        "reference": "Doc fourni · En cours de vérif.",
        "status": "valide",
        "fileUrl": "https://cdn.serviloc.cm/docs/doc_004.pdf"
      }
    ]
  }
}
```

> `document.status` : `"valide"` | `"manquant"` | `"en_verification"` | `"refuse"`

---

### `POST /admin/providers/:providerId/validate`

Validation d'un dossier prestataire.

**Response 200** → `{ "data": { "providerId": "...", "status": "active" } }`

---

### `POST /admin/providers/:providerId/reject`

Refus d'un dossier prestataire.

**Request body** : `{ "reason": "Casier judiciaire manquant" }`

**Response 200** → `{ "data": { "providerId": "...", "status": "rejected" } }`

---

### `POST /admin/providers/:providerId/notify`

Envoi d'un SMS de rappel pour document manquant.

**Response 200** → `{ "data": { "smsSent": true } }`

---

### `GET /admin/users`

Liste paginée de tous les utilisateurs (clients + prestataires).

**Query params** : `?role=client&status=active&search=Madeleine&page=1`

**Response 200** → `{ "data": ManagedUser[], "meta": { pagination } }`

---

### `PATCH /admin/users/:userId/suspend`

Suspension d'un compte utilisateur.

**Request body** : `{ "reason": "Comportement frauduleux" }`

**Response 200** → `{ "data": { "userId": "...", "status": "suspended" } }`

---

### `PATCH /admin/users/:userId/reactivate`

Réactivation d'un compte suspendu.

**Response 200** → `{ "data": { "userId": "...", "status": "active" } }`

---

### `GET /admin/litiges`

Liste paginée de tous les litiges.

**Query params** : `?status=ouvert&page=1`

**Response 200**

```json
{
  "success": true,
  "data": {
    "metrics": {
      "open": 7,
      "inProgress": 4,
      "resolvedThisMonth": 12,
      "totalBlockedAmount": 287000
    },
    "litiges": [ ...Litige[] ]
  },
  "meta": { "page": 1, "limit": 20, "total": 23 }
}
```

---

### `GET /admin/litiges/:litigeId`

Détail complet d'un litige.

**Response 200** → `{ "data": { ...Litige, "client": ClientProfile, "provider": ProviderProfile } }`

---

### `POST /admin/litiges/:litigeId/assign`

Assignation d'un agent à un litige.

**Request body** : `{ "agentId": "usr_agent01" }`

**Response 200** → `{ "data": { "litigeId": "...", "agentId": "...", "status": "traitement" } }`

---

### `POST /admin/litiges/:litigeId/resolve`

Résolution d'un litige avec décision finale.

**Request body**

```json
{
  "resolution": "remboursement_partiel",
  "note": "Remboursement de 50% accordé — prestation partiellement réalisée."
}
```

**Response 200** → `{ "data": { ...Litige, "status": "resolu" } }`

---

### `GET /admin/transactions`

Liste paginée des transactions.

**Query params** : `?status=sequestre&page=1`

**Response 200** → `{ "data": Transaction[], "meta": { pagination } }`

---

### `GET /admin/categories`

Liste des catégories avec statistiques de popularité.

**Response 200** → `{ "data": ServiceCategory[] }`

---

## 9. Upload de fichiers

### `POST /uploads/photos`

Upload d'une ou plusieurs photos (demandes, litiges, profils).

**Request** : `multipart/form-data`

```
field: photos (fichier binaire, max 5 Mo par fichier, formats: jpg, png, webp)
field: context (string: "demand" | "litige" | "profile")
```

**Response 201**

```json
{
  "success": true,
  "data": {
    "uploads": [
      {
        "id": "photo_001",
        "url": "https://cdn.serviloc.cm/uploads/photo_001.jpg",
        "name": "photo_sous_evier.jpg",
        "sizeBytes": 245000
      }
    ]
  }
}
```

> Le frontend envoie d'abord ce endpoint, reçoit les `id` des photos, puis les inclut dans les appels métier (création de demande, signalement de litige, etc.).

---

### `POST /uploads/documents`

Upload d'un document officiel (dossier prestataire).

**Request** : `multipart/form-data`

```
field: document (fichier PDF ou image, max 10 Mo)
field: type (string: "carte_professionnelle" | "cni" | "casier_judiciaire" | "assurance")
```

**Response 201** → même format que `/uploads/photos`

---

## 10. Calendrier de livraison backend

> Ce tableau est la référence contractuelle. Le frontend utilise les mocks JSON correspondants tant que l'endpoint n'est pas livré.

| Semaine | Endpoints livrés | Statut |
|---------|-----------------|--------|
| **S1** | `POST /auth/register`, `POST /auth/verify-otp`, `POST /auth/resend-otp`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` | ⬜ À livrer |
| **S1** | `GET /client/categories`, `GET /admin/categories` | ⬜ À livrer |
| **S2** | `GET /client/me`, `GET /client/dashboard`, `GET /client/demands`, `POST /client/demands` | ⬜ À livrer |
| **S2** | `GET /provider/me`, `GET /provider/dashboard`, `PATCH /provider/availability`, `GET /provider/demands/available` | ⬜ À livrer |
| **S2** | `GET /admin/dashboard`, `GET /admin/providers`, `GET /admin/providers/:id` | ⬜ À livrer |
| **S3** | `POST /client/demands/:id/quote/accept`, `POST /client/demands/:id/quote/reject`, `GET /client/missions/:id`, `POST /client/missions/:id/validate` | ⬜ À livrer |
| **S3** | `POST /provider/demands/:id/apply`, `POST /provider/demands/:id/quote`, `POST /provider/missions/:id/start`, `PATCH /provider/missions/:id/steps/:stepId`, `POST /provider/missions/:id/complete` | ⬜ À livrer |
| **S3** | `POST /admin/providers/:id/validate`, `POST /admin/providers/:id/reject`, `GET /admin/users`, `PATCH /admin/users/:id/suspend` | ⬜ À livrer |
| **S3** | `POST /client/missions/:id/rate`, `POST /client/missions/:id/litige` | ⬜ À livrer |
| **S3** | `GET /admin/litiges`, `GET /admin/litiges/:id`, `POST /admin/litiges/:id/resolve` | ⬜ À livrer |
| **S4** | `GET /provider/earnings`, `POST /uploads/photos`, `POST /uploads/documents`, `GET /admin/transactions`, `POST /admin/providers/:id/notify`, `PATCH /admin/users/:id/reactivate` | ⬜ À livrer |

> **Convention de statut** : ⬜ À livrer · 🔄 En cours · ✅ Livré et testé · ❌ Bloqué (préciser la raison)

---

## 11. Données mock frontend (fallback)

> Ces fichiers JSON sont utilisés par le frontend quand un endpoint n'est pas encore disponible. Ils doivent correspondre exactement aux schémas définis en section 4.

```
src/data/
├── auth/
│   └── mock_user.json           # Un User pour chaque rôle
├── client/
│   ├── mock_dashboard.json      # Réponse de GET /client/dashboard
│   ├── mock_demands.json        # Tableau de 5 ServiceDemand
│   ├── mock_quote.json          # Un Quote complet
│   └── mock_mission.json        # Une Mission avec 6 étapes
├── provider/
│   ├── mock_dashboard.json      # Réponse de GET /provider/dashboard
│   └── mock_available_demands.json  # 6 AvailableDemand
├── admin/
│   ├── mock_dashboard.json      # Réponse de GET /admin/dashboard
│   ├── mock_provider_dossier.json   # ProviderProfile + documents
│   ├── mock_users.json          # 5 ManagedUser
│   └── mock_litiges.json        # 4 Litige avec metrics
└── shared/
    ├── mock_categories.json     # 6 ServiceCategory
    └── mock_litige_motifs.json  # 4 LitigeMotif
```

**Convention de switch mock/API dans les services :**

```typescript
// src/services/clientService.ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function getDashboard(): Promise<DashboardData> {
  if (USE_MOCK) {
    const data = await import('../data/client/mock_dashboard.json');
    return data.default;
  }
  const res = await axios.get('/client/dashboard');
  return res.data.data;
}
```

> Mettre `VITE_USE_MOCK=true` dans `.env.development` et `VITE_USE_MOCK=false` en `.env.production`.

---

## 12. Règles de coordination

### Processus de modification de contrat

1. **L'équipe backend** qui veut modifier un endpoint crée un PR dans le repo partagé avec le diff dans ce fichier.
2. **L'équipe frontend** doit approuver le PR avant merge (minimum 1 review).
3. **Délai minimum** : 48h entre la notification et la mise en prod de la modification.
4. **Urgence** : En cas de bug critique nécessitant un changement immédiat, notification Slack #api-contract + appel direct au référent frontend.

### Points de synchronisation hebdomadaires

```
Chaque lundi — 30 minutes — Format standup

Frontend → Backend :
  - Quels endpoints avons-nous testés cette semaine ?
  - Quels problèmes de format ou de données avons-nous rencontrés ?
  - Quels endpoints nous manquent pour la semaine ?

Backend → Frontend :
  - Quels endpoints seront livrés cette semaine ?
  - Y a-t-il des changements de format prévus ?
  - Des blocages côté infra ?
```

### Règle de non-blocage frontend

Le frontend ne s'arrête jamais à cause du backend. Toute intégration suit ce pattern :

```typescript
// Toujours prévoir un fallback
try {
  const data = await getDashboard();
  setState(data);
} catch (error) {
  if (USE_MOCK) {
    const mockData = await import('../data/client/mock_dashboard.json');
    setState(mockData.default);
  } else {
    setError('Impossible de charger les données. Veuillez réessayer.');
  }
}
```

### Versioning du contrat

Ce fichier est versionné dans le repo GitHub à la racine du projet frontend.

```
/
├── src/
├── API_CONTRACT.md   ← ce fichier
└── ...
```

Toute modification est tracée dans l'historique Git avec un message de commit explicite :
```
git commit -m "api-contract: ajout endpoint POST /provider/missions/:id/complete [S3]"
```

---

*Document ServiLoc — Frontend Team · Backend Team · Mai 2026*
