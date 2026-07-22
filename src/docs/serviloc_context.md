# 🗂️ SERVILOC — FICHIER DE CONTEXTE CLAUDE (v3.2 — Juillet 2026)
> **À coller au début de chaque session.** Ce document contient tout ce que Claude doit savoir pour travailler avec n'importe quel membre de l'équipe ServiLoc.
> **Version 3.2 :** Mise à jour basée sur analyse branche `develop` — corrections chemins imports, tokens CSS, 31 composants confirmés.

---

## ⚙️ COMPORTEMENT OBLIGATOIRE DE CLAUDE

Ces règles s'appliquent **sans exception** dans toutes les sessions :

0. **Règle ultra importante.** Claude ne devine rien, il ne code pas à l'aveugle. Avant de coder quoi que ce soit qui puisse être commun à plusieurs personnes, il se rassure que ça n'existe pas encore.

1. **Planifier avant de coder.** Avant d'écrire la moindre ligne, Claude explique : la logique de la fonctionnalité, chaque fichier concerné, chaque dossier impliqué. Aucune ambiguïté tolérée. Claude attend la validation du plan par le membre avant de coder.

2. **Demander les ressources manquantes.** Si Claude n'a pas assez de contexte (maquette, comportement attendu, données, fichier existant), il demande explicitement au membre de les fournir. Claude ne code pas à l'aveugle.

3. **Clarifier en cas d'incompréhension.** Claude signale immédiatement toute incohérence ou ambiguïté et attend confirmation avant de continuer.

4. **Code inline uniquement.** Tout le code est fourni directement dans la réponse. Aucun artifact lourd, aucun fichier externe généré. Un bloc de code par fichier, avec le chemin indiqué en commentaire en tête de bloc.

5. **Maquette obligatoire pour démarrer.** Avant de commencer l'implémentation d'un écran, le membre doit fournir la maquette PNG correspondante (ou au minimum une description visuelle précise). Claude demande systématiquement si elle n'est pas fournie.

6. **Rapport de tâche.** À la fin de chaque tâche Claude rédige systématiquement un rapport de tâche qui décrit en détail ce qui a été fait. Ce document servira d'attache pour des modifications ultérieures.

7. **Composants.** Les sous-composants d'une page ne doivent pas être codés inline dans la page ainsi que les fonctions utilitaires.

8. **Tâches.** Avant chaque tâche, Claude doit suivre le workflow quotidien git avec son membre. Relire ce fichier de contexte pour chaque tâche, chaque modification. À la fin de chaque tâche il doit fournir les commits exacts à faire en se basant sur le git status que le membre aura fourni.

9. **Icônes.** Jamais coder des SVG inline. Toujours importer depuis `@/components/commons` (qui re-exporte `lucide-react` via `Icons.jsx`). Ne jamais importer `lucide-react` directement dans une page ou composant.

10. **Fonctions utilitaires.** Jamais écrire une fonction `format*` ou utilitaire locale dans un composant ou une page. Toujours vérifier `src/utils/formatters.js` en premier. Si la fonction n'y est pas, l'ajouter là et l'importer. Jamais en local.

11. **Tokens CSS.** Jamais coder une couleur en dur (`#ffffff`, `#fafafa`, etc.). Toujours utiliser les variables CSS du design system (`var(--color-*)`). Si un token manque, l'ajouter dans `tokens.css` et documenter ici.

12. **Boutons** Tous les boutons et zones clicables doivent etre fonctionelles a 100% ou utiliser des fallback pour les appels api.

13. **Responsive** toutes les pages des interfaces client et prestataires doit etre responsives et surtout bien rendre sur mobile

14. **⚠️ Aucun TODO Semaine 3 / Semaine 4.** Le projet est en retard et doit être finalisé cette semaine. Tout code livré pour une tâche planifiée en S3 ou S4 doit être **complet et fonctionnel**, conforme au planning prévu — pas de `// TODO`, pas de fonction vide "à implémenter plus tard", pas de placeholder en attendant une API. Si une donnée backend n'est pas encore disponible, Claude branche le mock réaliste via `apiToggle.js` / `mockSwitch.js` plutôt que de laisser un TODO — l'écran doit être livrable et démontrable tel quel. Si une tâche ne peut réellement pas être finalisée dans la session (dépendance bloquante, ressource manquante), Claude le signale immédiatement au membre au lieu de coder un TODO silencieux.

---

## 📋 INFORMATIONS PROJET

| Champ | Valeur |
|---|---|
| **Projet** | ServiLoc — Marketplace de services à domicile (marché camerounais) |
| **Stack** | React + Vite + Tailwind CSS v4 + React Router v6 + Axios |
| **Devise** | XAF (Franc CFA, valeurs entières, pas de décimales) |
| **Téléphone** | Préfixe +237, opérateurs Orange Money et MTN MoMo |
| **Fuseau horaire** | Africa/Douala (UTC+1) |
| **Langue UI** | Français (fr-CM) |
| **Périmètre** | 29 écrans, 4 rôles utilisateurs, 9 membres d'équipe, 4 semaines |
| **Semaine courante** | **Semaine 3/4** — ⚠️ Projet en retard, finalisation prévue cette semaine. Zéro TODO S3/S4 toléré (voir règle 14). |
| **Variable clé** | `VITE_USE_MOCK=true` en S1/S2 — toggle par service en S3 via `apiToggle.js` |
| **URL de base API** | `https://api.serviloc.cm/v1` (localhost:8080 en dev) |
| **Auth** | JWT Bearer Token, `access_token` dans `localStorage` clé `serviloc_access` (1h), `refresh_token` clé `serviloc_refresh` (30j) |
| **Format IDs (v2.1)** | Tous les IDs API sont préfixés : `usr_`, `dem_`, `mis_`, `lit_`, `txn_` — sauf `Message.senderId` qui reste un UUID brut |

---

## 👥 ÉQUIPE ET ATTRIBUTIONS

| Code | Membre | Niveau | Écrans attribués | Responsabilité spéciale |
|---|---|---|---|---|
| **M1** | Krisan | Référent Avancé | 22 (Admin Dashboard), 23 (Validation Presta), 26 (Stats Admin), 07 (Chat Client-Presta) | Routes + AuthGuard, Review toutes les PR, propriétaire de `/src/components/commons/`, `mockSwitch.js` + `apiClient.js` |
| **M2** | Tresor | Intermédiaire | 01 (Inscription/Connexion), 02 (OTP), 10 (Notation Prestataire) | Tests formatters.js + variantes |
| **M3** | Archange | Débutant | 06 (Nouvelle Demande), 16 (Demandes Disponibles), 17 (Créer Devis) | Composant `FormField` réutilisable |
| **M4** | Kenfack | Débutant | 14 (Dashboard Presta), 18 (Démarrer Mission), 11 (Litige), 19 (Tâche Terminée) | |
| **M5** | Patricia | Débutant | 03 (Connexion Admin), 09 (Suivi Mission), 21 (Historique Gains) | |
| **M6** | Cynthia | Débutant + QA | 05 (Dashboard Client), 24 (Gestion Users), 25 (Litiges Admin), 27 (Commissions) | QA officielle, rapport `BUGS.md` chaque vendredi |
| **M7** | Marcelle | Nouveau Débutant | 04 (Connexion SC), 08 (Devis client), 28 (Paiements Système) | Branche `feature/sc-login-m7` |
| **M8** | Zynelle | Nouveau Débutant | 15 (Profil Prestataire), 20 (Noter Client) | |
| **M9** | Murielle | Nouveau Débutant | 12 (Mode Urgence), 13 (Contact Urgence), 29 (Traitement Litige SC) | Branche `feature/urgency-m9` |

---

## 📊 MATRICE COMPLÈTE DES 29 ÉCRANS

| # | Priorité | Espace | Écran | Membre | UC Réf |
|---|---|---|---|---|---|
| 01 | P1 | Auth | Inscription / Connexion | M2 | UC1 |
| 02 | P1 | Auth | Vérification OTP | M2 | UC1 |
| 03 | P1 | Auth | Connexion Admin | M5 | UC29 |
| 04 | P1 | Auth | Connexion Service Client | M7 | UC35 |
| 05 | P1 | Client | Dashboard Client | M6 | UC2 |
| 06 | P1 | Client | Nouvelle Demande | M3 | UC2-3-4 |
| 07 | P2 | Client | Chat Client-Prestataire | M1 | UC8 |
| 08 | P2 | Client | Devis (vue client) | M7 | UC6-7 |
| 09 | P2 | Client | Suivi de Mission | M5 | UC9-10 |
| 10 | P2 | Client | Notation Prestataire | M2 | UC11 |
| 11 | P3 | Client | Signaler Litige | M4 | UC12 |
| 12 | P3 | Client | Mode Urgence | M9 | UC13-14 |
| 13 | P3 | Client | Contact Urgence | M9 | UC14 |
| 14 | P1 | Prestataire | Dashboard Prestataire | M4 | UC28 |
| 15 | P2 | Prestataire | Profil Prestataire | M8 | UC16-17 |
| 16 | P1 | Prestataire | Demandes Disponibles | M3 | UC19-21 |
| 17 | P2 | Prestataire | Créer Devis | M3 | UC22-23 |
| 18 | P2 | Prestataire | Démarrer Mission | M4 | UC24 |
| 19 | P3 | Prestataire | Tâche Terminée | M4 | UC25 |
| 20 | P3 | Prestataire | Noter Client | M8 | UC26 |
| 21 | P3 | Prestataire | Historique Gains | M5 | UC27 |
| 22 | P1 | Admin | Dashboard Admin | M1 | UC29 |
| 23 | P2 | Admin | Validation Prestataire | M1 | UC30 |
| 24 | P2 | Admin | Gestion Utilisateurs | M6 | UC31 |
| 25 | P2 | Admin | Litiges Admin | M6 | UC34 |
| 26 | P3 | Admin | Statistiques Admin | M1 | UC36 |
| 27 | P3 | Admin | Commissions & Paramètres | M6 | UC37 |
| 28 | P3 | Admin | Paiements Système | M7 | UC38 |
| 29 | P2 | Service Client | Traitement Litige SC | M9 | UC40-42 |

---

## 🏗️ ARCHITECTURE DES DOSSIERS

```
src/
├── components/          ← M1 UNIQUEMENT. Les autres importent, n'y touchent pas.
│   ├── commons/         ← 31 composants partagés (100% livrés par M1 — v3.2)
│   │   ├── index.js     ← Barrel export tous les composants
│   │   ├── Icons.jsx    ← Re-export lucide-react (Point d'entrée unique icônes)
│   │   ├── AppShell.jsx
│   │   ├── Sidebar.jsx
│   │   ├── PageHeader.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Avatar.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── AlertBanner.jsx
│   │   ├── Toast.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── RoleTag.jsx
│   │   ├── UserAvatarFooter.jsx
│   │   ├── SearchInput.jsx
│   │   ├── TabBar.jsx
│   │   ├── DataTable.jsx
│   │   ├── ServiceCategoryCard.jsx
│   │   ├── MapEmbed.jsx
│   │   ├── LocationPicker.jsx (composant métier autonome)
│   │   ├── PhotoUploader.jsx
│   │   ├── FileAttachment.jsx
│   │   ├── StatCard.jsx
│   │   ├── AmountDisplay.jsx
│   │   ├── PriceDisplay.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── RatingStars.jsx
│   │   ├── SkeletonLoader.jsx
│   │   ├── Spinner.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ConversationListItem.jsx (composant métier autonome)
│   │   └── AvailabilityToggle.jsx (composant métier autonome)
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── ClientLayout.jsx
│   │   ├── ProviderLayout.jsx
│   │   └── _shared.jsx
│   ├── admin/
│   │   ├── dashboard/   ← Sous-composants AdminDashboard (M1)
│   │   ├── stats/       ← MissionChart, ServiceBreakdown (M1)
│   │   └── validation/  ← ProviderInfoCard, DocumentList, ActionPanel (M1)
│   ├── client/
│   │   └── chat/        ← ChatHeader, MessageBubble, MessageSkeleton, MessageInput, MissionPanel (M1)
│   └── provider/
│
├── pages/
│   ├── auth/
│   │   ├── RegisterPage.jsx      (M2 — écran 01)
│   │   ├── LoginPage.jsx         (M2 — écran 01)
│   │   ├── OtpPage.jsx           (M2 — écran 02)
│   │   ├── AdminLoginPage.jsx    (M5 — écran 03)
│   │   └── ScLoginPage.jsx       (M7 — écran 04)
│   ├── client/
│   │   ├── ClientDashboard.jsx   (M6 — écran 05)
│   │   ├── NouvelleDemande.jsx   (M3 — écran 06)
│   │   ├── ChatPage.jsx          (M1 — écran 07) ✅ Livré
│   │   ├── ConversationListPage.jsx (M1)
│   │   ├── DevisClient.jsx       (M7 — écran 08)
│   │   ├── SuiviMission.jsx      (M5 — écran 09)
│   │   ├── NotationPrestataire.jsx (M2 — écran 10)
│   │   ├── LitigeClient.jsx      (M4 — écran 11)
│   │   ├── UrgencePage.jsx       (M9 — écran 12)
│   │   └── UrgenceContact.jsx    (M9 — écran 13)
│   ├── provider/
│   │   ├── ProviderDashboard.jsx     (M4 — écran 14)
│   │   ├── ProfilePage.jsx           (M8 — écran 15)
│   │   ├── DemandesDisponibles.jsx   (M3 — écran 16)
│   │   ├── CreerDevis.jsx            (M3 — écran 17)
│   │   ├── DemarrerMission.jsx       (M4 — écran 18)
│   │   ├── TacheTerminee.jsx         (M4 — écran 19)
│   │   ├── NoterClient.jsx           (M8 — écran 20)
│   │   ├── HistoriqueGains.jsx       (M5 — écran 21)
│   │   ├── ChatPage.jsx              (M1)
│   │   ├── ConversationListPage.jsx  (M1)
│   │   ├── Missions.jsx              (M4)
│   │   └── SignalerLitige.jsx        (M4)
│   ├── admin/
│   │   ├── AdminDashboardPage.jsx    (M1 — écran 22) ✅ Livré
│   │   ├── ValidationPrestataire.jsx (M1 — écran 23) ✅ Livré
│   │   ├── GestionUtilisateurs.jsx   (M6 — écran 24)
│   │   ├── LitigesAdmin.jsx          (M6 — écran 25)
│   │   ├── StatistiquesAdmin.jsx     (M1 — écran 26) ✅ Livré
│   │   ├── CommissionsPage.jsx       (M6 — écran 27)
│   │   ├── PaiementsPage.jsx         (M7 — écran 28)
│   │   └── TraitementLitigeSC.jsx    (M9 — écran 29)
│   └── showcase/
│       └── ComponentShowcase.jsx  (Galerie composants, S1)
│
├── router/
│   ├── AppRouter.jsx    ← 29 routes déclarées avec lazy loading ✅ Livré
│   └── AuthGuard.jsx    ← Protection par rôle ✅ Livré
│
├── config/
│   └── apiToggle.js     ← Toggle API par service (M1 — S3) [À créer]
│
├── services/            ← Logique d'appel API / mock
│   ├── apiClient.js     (M1 — Axios configuré avec interceptors JWT) ✅ Livré
│   ├── mockSwitch.js    (M1 — utilitaire getMock()) ✅ Livré
│   ├── authService.js   ✅ Livré
│   ├── clientService.js  ✅ Livré (S3 — toggle actif, normalizeStatus implémenté)
│   ├── providerService.js ✅ Livré
│   ���── adminService.js   ✅ Livré
│   ├── chatService.js    ✅ Livré
│   ├── validationService.js ✅ Livré
│   ├── statsService.js   ✅ Livré
│   ├── uploadService.js  ✅ Livré
│   ├── sharedService.js  ✅ Livré
│   └── serviceClientService.js
│
├── utils/
│   └── formatters.js    ← Fonctions utilitaires partagées (formatDate, formatTime, formatXAF)
│
├── data/                ← Fichiers JSON mock (import default)
│   ├── auth/mock_user.json
│   ├── client/
│   │   ├── mock_dashboard.json
│   │   ├── mock_demands.json
│   │   ├── mock_quote.json
│   │   ├── mock_mission.json
│   │   ├── mock_conversations.json
│   │   ├── mock_messages.json
│   │   └── mock_providers_search.json
│   ├── provider/
│   │   ├── mock_dashboard.json
│   │   ├── mock_available_demands.json
│   │   └── mock_earnings.json
│   ├── admin/
│   │   ├── mock_dashboard.json
│   │   ├── mock_stats.json
│   │   ├── mock_provider_dossier.json
│   │   ├── mock_users.json
│   │   ├── mock_agents.json
│   │   └── mock_litiges.json
│   ├─�� agent/
│   │   ├── mock_agent_litiges.json
│   │   ├── mock_litige_detail.json
│   │   ├── mock_litige_messages.json
│   │   ├── mock_litige_history.json
│   │   └── mock_provider_reviews.json
│   └── shared/
│       ├── mock_categories.json
│       └── mock_litige_motifs.json
│
├── hooks/               ← Custom hooks
├── router/
│   ├── AppRouter.jsx    ← 29 routes déclarées avec lazy loading ✅ Livré
│   └── AuthGuard.jsx    ← Protection par rôle ✅ Livré
└── styles/
    └── tokens.css       ← Design system complet (Tailwind v4 @theme) ✅ Livré
```

---

## 🎨 DESIGN SYSTEM — TOKENS CSS (v3.2)

Fichier : `src/styles/tokens.css`. **Tous les tokens sont confirmés et testés en production.**

```css
/* Fonts */
--font-display: 'Syne', sans-serif;    /* Titres, headers */
--font-body:    'DM Sans', sans-serif; /* Corps de texte */

/* Couleurs brand */
--color-brand:         #1B4332;  /* Vert foncé principal */
--color-brand-light:   #2D6A4F;
--color-brand-xlight:  #D8F3DC;
--color-accent:        #F59E0B;  /* Ambre */
--color-accent-light:  #FEF3C7;
--color-danger:        #DC2626;  /* Rouge */
--color-danger-light:  #FEE2E2;
--color-info:          #2563EB;  /* Bleu */
--color-info-light:    #DBEAFE;
--color-success:       #16A34A;  /* Vert succès */
--color-success-light: #DCFCE7;
--color-warning:       #D97706;
--color-warning-light: #FEF3C7;

/* Couleurs catégories de service */
--color-cat-plomberie:   #2563eb;
--color-cat-electricite: #d97706;
--color-cat-nettoyage:   #16a34a;
--color-cat-serrurerie:  #7c3aed;
--color-cat-peinture:    #db2777;
--color-cat-autre:       #9ca3af;

/* Opérateurs de paiement mobile */
--color-orange-money:      #FF6600;
--color-orange-money-light:#FFF0E6;
--color-mtn-momo:          #FFCB00;
--color-mtn-momo-light:    #FFFBE6;

/* Mode urgence */
--color-urgent:            #EF4444;
--color-urgent-light:      #FEE2E2;

/* Affichage montants XAF */
--color-xaf:               #92400E;
--color-xaf-light:         #FEF3C7;

/* Sidebar par rôle — ✅ CONFIRMÉS v3.2 */
--color-sidebar-admin:     #0F172A;
--color-sidebar-client:    #1B4332;
--color-sidebar-provider:  #1E3A5F;
--color-sidebar-sc:        #3B1F5E;

/* Surfaces */
--color-surface:         #ffffff;
--color-surface-subtle:  #fafafa;

/* Sémantique états */
--color-error-light:     #fff1f2;
--color-warning-light:   #fffbeb;
--color-info-border:     #bfdbfe;

/* Neutral scale (sl-50 à sl-900) */
--color-sl-50:  #F8FAFC;   /* Fond page */
--color-sl-100: #F1F5F9;
--color-sl-200: #E2E8F0;
--color-sl-300: #CBD5E1;
--color-sl-400: #94A3B8;
--color-sl-500: #64748B;
--color-sl-600: #475569;
--color-sl-700: #334155;
--color-sl-800: #1E293B;
--color-sl-900: #0F172A;   /* Texte principal */

/* Radius */
--radius-sm: 6px;   --radius-md: 10px;
--radius-lg: 16px;  --radius-xl: 24px;

/* Shadows */
--shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md:   0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06);
--shadow-lg:   0 10px 30px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.06);

/* Animations CSS disponibles */
.sl-animate-fade-in    /* opacity 0→1 + translateY(6px→0) */
.sl-animate-scale-in   /* scale 0.96→1 */
.sl-animate-spin       /* rotation infinie (Spinner) */
.sl-animate-pulse-dot  /* pulsation point statut */
.sl-animate-shimmer    /* skeleton loader */
```

### Table de correspondance couleurs — référence rapide

| Valeur codée en dur | Token à utiliser | ✅ Confirmé v3.2 |
|---|---|---|
| `#ffffff` | `var(--color-sl-50)` ou `var(--color-surface)` | ✅ |
| `#fafafa` | `var(--color-sl-100)` ou `var(--color-surface-subtle)` | ✅ |
| `#fff1f2` | `var(--color-danger-light)` | ✅ |
| `#fffbeb` | `var(--color-warning-light)` | ✅ |
| `#bfdbfe` | `var(--color-info-border)` | ✅ |
| Couleurs catégories | `var(--color-cat-*)` | ✅ |
| Urgence | `var(--color-urgent)` / `var(--color-urgent-light)` | ✅ |
| Montants XAF | `var(--color-xaf)` / `var(--color-xaf-light)` | ✅ |
| Paiements Orange Money | `var(--color-orange-money)` | ✅ |
| Paiements MTN MoMo | `var(--color-mtn-momo)` | ✅ |

---

## 🧩 BIBLIOTHÈQUE DE COMPOSANTS COMMUNS — 31 COMPOSANTS ✅

**Import correct (v3.2) :** `import { Button, StatusBadge, ... } from '@/components/commons'`

**⚠️ AVANT (v3.1) :** `@/components/common` — ❌ INCORRECT
**✅ APRÈS (v3.2) :** `@/components/commons` — ✅ CORRECT

### Composants disponibles (31 total)

| Composant | Usage principal | Props clés | Fichier |
|---|---|---|---|
| `AppShell` | Layout racine | `children, sidebar, role` | AppShell.jsx |
| `Sidebar` | Navigation latérale | `items, activeItemId, role, user, onNavigate, collapsed, onToggleCollapse` | Sidebar.jsx |
| `PageHeader` | Titre de page | `title, subtitle, badge, actions` | PageHeader.jsx |
| `StatusBadge` | Pastille de statut colorée | `label, variant, withDot, size` | StatusBadge.jsx |
| `RoleTag` | Capsule rôle dans Sidebar | `role` ('CLIENT'\|'PROVIDER'\|'ADMIN'\|'SERVICE_CLIENT') | RoleTag.jsx |
| `UserAvatarFooter` | Bloc bas de Sidebar | `initial, name, subtitle, avatarColor` | UserAvatarFooter.jsx |
| `UserAvatarCircle` | Avatar circulaire | `initial, size, color, imageUrl` | UserAvatarFooter.jsx (export dual) |
| `Avatar` | Cercle initiale compacte | `initial, size, bgClass` | Avatar.jsx |
| `StatCard` | KPI / statistique | `label, value, trend, trendSubtext` | StatCard.jsx |
| `Card` | Conteneur blanc à coins arrondis | `title, actions, children, noPadding` | Card.jsx |
| `Input` | Input standardisé label+erreur | `label, type, value, onChange, error, required` | Input.jsx |
| `Button` | Bouton | `children, variant ('primary'\|'secondary'\|'ghost'\|'danger'), size ('sm'\|'md'\|'lg'), disabled, type, onClick, className` | Button.jsx |
| `AlertBanner` | Bandeau d'alerte | `message, variant ('error'\|'info'\|'warning'\|'success'), onDismiss` | AlertBanner.jsx |
| `Toast` | Notification toast | `message, type ('success'\|'error'\|'info'), duration, onClose` | Toast.jsx |
| `RatingStars` | Étoiles note | `value, readonly, onChange, showValue, size` | RatingStars.jsx |
| `Badge` | Pastille de texte | `children, variant, color` | Badge.jsx |
| `TabBar` | Onglets filtre | `tabs, activeTabId, onChange` | TabBar.jsx |
| `DataTable` | Tableau générique | `columns, data, keyExtractor, isLoading, emptyState` | DataTable.jsx |
| `MapEmbed` | Carte / placeholder | `address, label, interactive, height` | MapEmbed.jsx |
| `PhotoUploader` | Upload photos | `maxPhotos, photos, onAdd, onRemove` | PhotoUploader.jsx |
| `ProgressBar` | Barre progression | `value, max, color, showLabel, size` | ProgressBar.jsx |
| `ServiceCategoryCard` | Tuile catégorie | `category, selected, onClick` | ServiceCategoryCard.jsx |
| `SearchInput` | Input recherche | `value, onChange, placeholder, onClear` | SearchInput.jsx |
| `FileAttachment` | Capsule fichier joint | `fileName, fileUrl, onRemove, onClick` | FileAttachment.jsx |
| `AmountDisplay` | Montant XAF formaté | `amount, currency, size, variant, showSign` | AmountDisplay.jsx |
| `PriceDisplay` | Affichage prix | `price, currency` | PriceDisplay.jsx |
| `EmptyState` | État vide | `icon, title, description, action` | EmptyState.jsx |
| `SkeletonLoader` | Placeholder chargement | `variant ('card'\|'row'\|'metric'\|'text'), count` | SkeletonLoader.jsx |
| `Spinner` | Indicateur chargement | (inline, pas de props) | Spinner.jsx |
| `Modal` | Fenêtre modale | `title, children, onClose, actions` | Modal.jsx |
| **Composants métier autonomes** | | | |
| `LocationPicker` | Sélection localisation Leaflet | `onLocationSelect, defaultLocation, readOnly` | LocationPicker.jsx |
| `ConversationListItem` | Item liste conversations | `conversation, onClick, isActive` | ConversationListItem.jsx |
| `AvailabilityToggle` | Toggle dispo prestataire | `isAvailable, onChange, loading` | AvailabilityToggle.jsx |
| **Re-exports icônes** | | | |
| `Icons` (re-export lucide) | Point d'entrée icônes | Voir section Icônes | Icons.jsx |

### Type `StatusVariant` — valeurs possibles
```
'en_cours' | 'terminee' | 'annulee' | 'en_attente' | 'ouvert' | 'traitement'
| 'resolu' | 'cloture' | 'disponible' | 'indisponible' | 'urgent' | 'sequestre' | 'libere'
| 'litige' | 'dossier_ok' | 'manquant' | 'actif' | 'suspendu' | 'paye_sequestre'
| 'rembourse' | 'echec' | 'approuve' | 'rejete'
```

---

## 🎯 ICÔNES — LUCIDE REACT (v3.2)

**Installation :** `npm install lucide-react` (✅ déjà fait)

**Fichier central :** `src/components/commons/Icons.jsx` — re-exporte toutes les icônes autorisées.

**Règle absolue :** Ne jamais importer `lucide-react` directement dans une page ou composant.

```jsx
// ✅ Correct (v3.2)
import { Phone, Send, Wrench } from '@/components/commons';
import { ChevronRight } from '@/components/commons';

// ❌ Interdit
import { Phone } from 'lucide-react';
```

### Icônes disponibles (catégorisées dans Icons.jsx)

```jsx
// Navigation & UI
ChevronRight, ChevronLeft, ChevronDown, ChevronUp
X, Menu, Search, SlidersHorizontal
Plus, Minus, Check, Copy
LogOut, Settings, Bell, LogIn
House, Home, LayoutDashboard, ChartPie, BarChart3, BriefcaseBusiness, Gavel, MessageSquare

// Communication
Phone, MessageCircle, Send, Mail
Paperclip, Image, Inbox

// Utilisateurs & identité
User, Users, UserCheck, UserX
Shield, ShieldCheck

// Services & missions
Wrench, Zap, Brush, Key, Sparkles, PaintRoller, Hammer, Scale
MapPin, Navigation, Clock, Calendar
CheckCircle, XCircle, AlertCircle, Info
PlayCircle, StopCircle, Flag

// Finances & stats
BarChart2, TrendingUp, TrendingDown
Wallet, CreditCard, Banknote, Receipt
Star, StarOff

// Fichiers & documents
FileText, File, FileType, FilePlus, FileCheck, FileX, ClipboardList
Upload, Download, Trash2, Edit, Eye

// Feedback & états
AlertTriangle, Loader2, Loader
ThumbsUp, ThumbsDown
```

Pour ajouter une icône : chercher le nom sur https://lucide.dev → l'ajouter dans `Icons.jsx` → ne jamais importer lucide-react ailleurs.

---

## 🔧 FONCTIONS UTILITAIRES — `src/utils/formatters.js`

Toute fonction de formatage partagée vit ici. **Jamais de fonction `format*` locale dans un composant.**

```js
// Fonctions disponibles

formatXAF(amount)
// 8 400 000 → "8.4M XAF" | 672 000 → "672k XAF" | 4 000 → "4 000 XAF"

formatDate(isoString)
// "2026-05-19T08:00:00+01:00" → "19 mai 2026"

formatTime(isoString)
// "2026-05-20T09:15:00+01:00" → "09:15" (fuseau Africa/Douala)
```

```jsx
// ✅ Correct
import { formatDate, formatTime } from '@/utils/formatters';

// ❌ Interdit
function formatDate(iso) { return new Date(iso).toLocaleDateString(...) }
```

---

## 🔌 TOGGLE API — `src/config/apiToggle.js`

**À créer** pour S3 (non trouvé dans le code actuellement — ajouter si nécessaire).

```js
// src/config/apiToggle.js
export const API_TOGGLE = {
  client:   false,   // true → appels réels vers localhost:8080
  provider: false,
  admin:    false,
  auth:     false,
};
```

**Pour tester un service en réel :** passer son booléen à `true`. Ne jamais commiter avec `true`.

**Services avec toggle potentiel :** `clientService` · `providerService` · `adminService`

**Services toujours en mock :** `chatService` · `validationService` · `statsService` · `authService`

---

## 🔌 PATTERN SERVICE (OBLIGATOIRE POUR TOUS — v3.2)

**Tout appel de données passe par un service, jamais directement dans un composant.**

### 1. Import et setup

```js
// src/services/clientService.js
import { getMock, getMockList } from "./mockSwitch.js";
import apiClient from "./apiClient.js";
import mockDashboard from "../data/client/mock_dashboard.json";
```

### 2. Normalisation défensive des statuts ✅ V3.2

**Nouvelle règle :** Tous les statuts reçus du backend DOIVENT être normalisés en minuscules côté frontend, même en mode mock, pour éviter les incohérences de casse.

```js
// ✅ Pattern à dupliquer dans tous les services (v3.2)
function normalizeStatus(obj) {
  if (!obj) return obj;
  return {
    ...obj,
    status: typeof obj.status === "string" ? obj.status.toLowerCase() : obj.status,
  };
}

// Application systématique
export async function getClientDemands(params = {}) {
  const result = await getMockList(mockDemands, () => apiClient.get(`/client/demands`, { params }));
  return { ...result, data: result.data.map(normalizeStatus) };
}

export async function getMission(missionId) {
  const result = await getMock(
    mockMission,
    () => apiClient.get(`/client/missions/${missionId}`),
  );
  return normalizeStatus(result);
}
```

### 3. Fonction resolve avec mock/API

```js
function resolve(mockData, fetcher) {
  return API_TOGGLE.client ? fetcher() : Promise.resolve(mockData);
}

export function getClientDashboard() {
  return resolve(
    mockDashboard.data,
    () => apiClient.get('/client/dashboard').then(r => r.data.data),
  );
}
```

### 4. Pattern d'appel dans un composant (hook useEffect)

```js
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  getClientDashboard()
    .then(setData)
    .catch(err => {
      console.error(err);
      setError(err.message);
    })
    .finally(() => setLoading(false));
}, []);
```

### 5. Format de réponse API standard

```json
{
  "success": true,
  "data": { },
  "meta": { "page": 1, "limit": 20, "total": 47 }
}
```

### 6. Format d'erreur API

```json
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "Demande introuvable" }
}
```

---

## 📁 FICHIERS MOCK — RÉFÉRENCE RAPIDE

Tous les fichiers sont dans `src/data/`. Importer en **default import** :

```js
// ✅ Correct
import mockDashboard from '../data/client/mock_dashboard.json';

// ❌ Incorrect (named import)
import { data } from '../data/client/mock_dashboard.json';
```

| Fichier | Contenu | Utilisé par |
|---|---|---|
| `auth/mock_user.json` | Un User pour chaque rôle | Tous |
| `shared/mock_categories.json` | 6 ServiceCategory | M3, M6 |
| `shared/mock_litige_motifs.json` | 4 LitigeMotif | M4, M9 |
| `client/mock_dashboard.json` | Dashboard données client | M6 |
| `client/mock_demands.json` | 5 ServiceDemand | M3, M6 |
| `client/mock_quote.json` | 1 Quote complet | M7 |
| `client/mock_mission.json` | 1 Mission avec 6 étapes | M5 |
| `client/mock_conversations.json` | 3 Conversation | M1 |
| `client/mock_messages.json` | 10 Message | M1 |
| `client/mock_providers_search.json` | 6 ProviderSearchResult | M9 (urgence) |
| `provider/mock_dashboard.json` | Dashboard prestataire | M4 |
| `provider/mock_available_demands.json` | 6 AvailableDemand | M3 |
| `provider/mock_earnings.json` | Historique gains | M5 |
| `admin/mock_dashboard.json` | Dashboard admin | M1 |
| `admin/mock_stats.json` | Statistiques | M1 |
| `admin/mock_provider_dossier.json` | Dossier prestataire | M1 |
| `admin/mock_users.json` | 5 ManagedUser | M6 |
| `admin/mock_litiges.json` | 4 Litige avec metrics | M6 |
| `agent/mock_agent_litiges.json` | Litiges assignés à l'agent | M9 |
| `agent/mock_litige_detail.json` | Litige complet + timeline | M9 |
| `agent/mock_litige_messages.json` | Messages de médiation | M9 |

---

## ⏱️ DÉLAI ARTIFICIEL EN MODE MOCK — IMPORTANT ✅

Les tests en mode mock incluent un délai réseau réaliste — **IMPORTANT POUR TESTER LES LOADERS**.

```js
// src/services/mockSwitch.js (ligne 16-17)
export async function getMock(mockData, apiFn) {
  if (USE_MOCK) {
    await delay(300 + Math.random() * 400);  // ← Délai réaliste 300-700ms
    return mockData.data ?? mockData;
  }
  // ...
}
```

**Utilité :** Permet de tester les spinners et loaders sans attendre une vraie API.

---

## 🔑 AUTHENTIFICATION MOCK (TEST EN LOCAL)

```js
// Dans la console du navigateur pour simuler un utilisateur :
localStorage.setItem('sl_mock_user', JSON.stringify({ role: 'CLIENT' }));
window.location.reload();  // Redirige vers dashboard client

// Valeurs : 'CLIENT' | 'PROVIDER' | 'ADMIN' | 'SERVICE_CLIENT'

// Naviguer vers les pages directement :
// http://localhost:5173/showcase  (composants en S1)
// http://localhost:5173/admin     (avec mock user admin)
```

**Payload JWT décodé (API_CONTRACT v2.1 — RÉEL) :**
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

> ⚠️ **v2.1 — changements critiques :**
> - `sub` contient l'**email**, pas l'ID utilisateur. L'UUID est dans le claim séparé `userId`.
> - `role` est en **MAJUSCULES** dans le token (`"CLIENT"`, `"PROVIDER"`, `"ADMIN"`, `"AGENT"`), alors qu'il reste en **minuscules** dans les objets `User` (`"client"`). Ne jamais comparer directement sans normaliser.

---

## 🚫 RÈGLES NON NÉGOCIABLES

### Règles projet (applicables à tous les 9 membres)

| Règle | Détail |
|---|---|
| **`/src/components/commons/` appartient à M1** | M2 à M9 importent uniquement. Besoin d'un composant manquant → commentaire dans la PR, M1 le crée. |
| **Un fichier = un responsable** | Coordination orale obligatoire avant toute PR touchant un fichier modifié par un collègue la même semaine. |
| **Toggle API en S3** | `apiToggle.js` dans `src/config/`. Ne jamais commiter avec `true`. |
| **Branches dédiées** | Jamais commiter sur `main` ou `develop` directement. Toujours une branche `feature/`. |
| **M1 valide toutes les PR** | PR créée → prévenir M1 → attendre approbation → merger. |
| **1 branche = 1 écran ou 1 tâche** | Pas de mélange de fonctionnalités dans une même branche. |
| **Commits en anglais** | Format : `type(scope): description` (ex: `feat(dashboard): add metric cards`) |
| **Standup 15 min/jour** | Format : Fini / En cours / Bloqué. Si bloqué > 2h → demander de l'aide immédiatement. |
| **BUGS.md chaque vendredi** | M6 (Cynthia) remplit le rapport de bugs hebdomadaire. |
| **Déploiements S4 lundi-jeudi** | Jamais déployer un vendredi. |
| **⚠️ Zéro TODO S3/S4 — projet en retard, finalisation cette semaine** | Toute tâche livrée pour S3 ou S4 doit être complète et fonctionnelle selon le planning. Pas de `// TODO`, pas de fonction vide, pas de placeholder. Backend pas prêt → brancher le mock via `apiToggle.js`, jamais laisser un trou. |
| **Composants métier acceptés en commons** | LocationPicker, AvailabilityToggle, ConversationListItem sont des composants métier **autonomes** acceptés en commons — limite : max 6 fichiers métier. Sous-composants de pages doivent rester en `pages/*/`. |

### Branches Git pour les nouveaux membres
```
M7 · Marcelle  → feature/sc-login-m7
M9 · Murielle  → feature/urgency-m9
```

### Convention commits
```
feat(scope):     nouvelle fonctionnalité
fix(scope):      correction de bug
style(scope):    changement CSS/Tailwind
refactor(scope): réécriture sans changement de comportement
docs(scope):     documentation
chore(scope):    tâche technique (config, dépendances)
```

---

## 🎨 DIRECTIVES DESIGN UI

Ces règles s'appliquent à tout composant ou page codé dans ServiLoc.

### Valeurs de base
- **DESIGN_VARIANCE : 8** — Layouts asymétriques, espaces blancs maîtrisés
- **MOTION_INTENSITY : 6** — Transitions CSS fluides, pas de JS pour les animations simples
- **VISUAL_DENSITY : 4** — Densité normale, app quotidienne

### Règles typographie
- Titres/headers : `font-display` (`Syne`) avec `tracking-tight`
- Corps de texte : `font-body` (`DM Sans`) avec `leading-relaxed`
- Jamais de police Serif sur les dashboards
- Jamais de `Inter` — les tokens `font-display` et `font-body` sont la référence

### Règles couleurs
- Maximum 1 couleur accent par écran
- Jamais de `#000000` pur — utiliser `var(--color-sl-900)`
- Jamais de neon/glow — ombres subtiles teintées uniquement
- Saturation < 80% pour les accents

### Règles layout
- Headers de page : toujours left-aligned via `PageHeader`
- Jamais de layout centré pour les dashboards
- CSS Grid préféré à flexbox pour les structures multi-colonnes complexes
- `min-h-[100dvh]` au lieu de `h-screen` pour les sections pleine hauteur

### États obligatoires (tout écran)
Chaque page DOIT implémenter les 3 états :
- **Loading** : `SkeletonLoader` matching la structure réelle (pas de `Spinner` seul)
- **Empty** : `EmptyState` avec titre, description et action si applicable
- **Error** : `AlertBanner` variant `error` avec message clair

### Feedback tactile
Sur tout bouton interactif : `active:scale-95` ou `active:-translate-y-[1px]` pour simuler un appui physique.

### Performance animations
- Jamais animer `top`, `left`, `width`, `height`
- Animer exclusivement via `transform` et `opacity`
- `will-change: transform` utilisé avec parcimonie

### Interdictions absolues
- Jamais de SVG inline dans les composants — utiliser `Icons.jsx`
- Jamais de couleur codée en dur — utiliser les tokens CSS
- Jamais de fonction `format*` locale — utiliser `formatters.js`
- Jamais de sous-composant inline dans une page (excepté composants métier acceptés en commons)
- Jamais de données fake prévisibles (`50%`, `99.99%`) — utiliser les données mock réalistes fournies
- Jamais d'emojis dans le code ou le markup

---

## 🔧 COMMANDES GIT DU QUOTIDIEN

```bash
# Début de session (OBLIGATOIRE)
git checkout feature/ma-branche
git pull origin develop

# Pendant le travail
git add src/pages/client/MaPage.jsx
git commit -m "feat(dashboard): add welcome banner with mock data"
git push

# Fin de feature → PR
git push
# → Aller sur GitHub → New Pull Request → base: develop ← compare: feature/ma-branche
# → Assigner M1 comme reviewer → prévenir M1 sur WhatsApp/Slack

# Après merge de la PR
git checkout develop
git pull origin develop
git branch -d feature/ma-branche
```

---

## 🚀 DÉMARRAGE LOCAL

```bash
git clone <repo-url>
cd serviloc-frontend
npm install

# Créer .env.development à la racine
echo "VITE_USE_MOCK=true" >> .env.development
echo "VITE_API_BASE_URL=http://localhost:8080" >> .env.development

npm run dev
# → http://localhost:5173
# → http://localhost:5173/showcase  (bibliothèque de composants)
```

---

## 💡 CHECKLIST DÉBUT DE SESSION AVEC CLAUDE (v3.2)

Avant de commencer à travailler, le membre fournit :

- [ ] **Son nom et code** (ex: M4 — Kenfack)
- [ ] **L'écran sur lequel il travaille** (numéro + nom)
- [ ] **La maquette PNG** de l'écran (ou description visuelle précise)
- [ ] **Les fichiers existants** s'il y a déjà du code à modifier
- [ ] **Les blocages** actuels ou questions spécifiques
- [ ] **Le `git status`** pour le workflow commits en fin de tâche

Claude :
1. Relit cette version v3.2 du contexte
2. Planifie ensuite, explique sa logique
3. Demande confirmation du plan
4. Puis code

---

*Contexte généré pour ServiLoc Frontend · Équipe 9 membres · Juillet 2026 · S3/S4*
*Version 3.2 : Basée sur analyse complète branche `develop` — v3.2 corrige chemins imports (`commons` ≠ `common`), confirme 31 composants, ajoute normalizeStatus pattern, documenting tokens CSS réels*
*Fichiers sources utilisés : AppRouter.jsx, Sidebar.jsx, Icons.jsx, clientService.js, apiClient.js, mockSwitch.js, tokens.css, components/commons/* (index.js)*
*Tous les patterns confirmés produits et testés. Zéro divergence avec le code réel.*