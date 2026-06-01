# ServiLoc — Découpage détaillé des interfaces en composants React

> **Méthodologie appliquée**
> - **Composition over props booleans** : chaque variant est un composant explicite plutôt qu'un prop `isAdmin`, `isUrgent`, etc.
> - **State lifting** : les états partagés entre composants frères remontent dans un Provider dédié.
> - **Leaf components isolés** : les animations perpetuelles (urgence, timer, pulse statut) sont isolées en micro-composants `"use client"`.
> - **Nomenclature** : `PascalCase` pour les composants, `camelCase` pour les props.

---

## Table des matières

1. [Composants COMMUNS](#1-composants-communs)
2. [Espace AUTH — Inscription / Connexion](#2-espace-auth)
3. [Espace CLIENT](#3-espace-client)
4. [Espace PRESTATAIRE](#4-espace-prestataire)
5. [Espace ADMIN](#5-espace-admin)
6. [Espace SERVICE CLIENT](#6-espace-service-client)
7. [Arbre de composition global](#7-arbre-de-composition-global)

---

## 1. Composants COMMUNS

> Ces composants apparaissent dans au moins deux espaces différents. Ils sont placés dans `src/components/common/`.

---

### 1.1 `AppShell`

**Description**
Composant de mise en page racine. Fournit la structure globale : `Sidebar` à gauche + zone `main` à droite. Adapte le fond et les couleurs selon le rôle actif. Trois variants existent : `ClientShell`, `ProviderShell`, `AdminShell` — ils utilisent `AppShell` en interne via des Context Providers distincts.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `children` | `ReactNode` | ✅ | Contenu principal (zone droite) |
| `sidebar` | `ReactNode` | ✅ | Composant `Sidebar` injecté |
| `role` | `'client' \| 'provider' \| 'admin' \| 'service_client'` | ✅ | Détermine le thème et l'identité visuelle |

**State**
Aucun état interne. Les données d'identité et de navigation sont fournies par le `AuthContext` parent.

---

### 1.2 `Sidebar`

**Description**
Navigation latérale verticale fixe. Affiche le logo ServiLoc, un `RoleTag`, les liens de navigation avec état actif, et un `UserAvatarFooter` en bas. Le badge numérique (ex: "Messages · 2") est alimenté par un prop `count`.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `items` | `NavItem[]` | ✅ | Liste des liens de navigation |
| `activeItemId` | `string` | ✅ | ID de l'item actuellement sélectionné |
| `role` | `'client' \| 'provider' \| 'admin' \| 'service_client'` | ✅ | Contrôle le thème (blanc, sombre, etc.) |
| `user` | `{ name: string; subtitle: string; avatarInitial: string }` | ✅ | Données du footer utilisateur |
| `onNavigate` | `(itemId: string) => void` | ✅ | Callback de navigation |

**Type `NavItem`**
```ts
type NavItem = {
  id: string;
  label: string;
  icon: ReactNode;
  count?: number; // badge numérique optionnel
  href: string;
}
```

**State**
Aucun état interne. Entièrement contrôlé via props.

---

### 1.3 `PageHeader`

**Description**
Barre de titre horizontale en haut du contenu principal. Affiche le titre de la page, un sous-titre optionnel, un `StatusBadge` optionnel (ex: "EN COURS"), et des actions à droite (boutons, exports).

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `title` | `string` | ✅ | Titre principal de la page |
| `subtitle` | `string` | ❌ | Sous-titre contextuel (ex: "21 mai 2026") |
| `badge` | `{ label: string; variant: BadgeVariant }` | ❌ | Badge de statut affiché à droite du titre |
| `actions` | `ReactNode` | ❌ | Slot pour boutons d'action (droite) |

**State**
Aucun.

---

### 1.4 `StatusBadge`

**Description**
Pastille de statut colorée, réutilisée dans toutes les interfaces pour indiquer l'état d'une entité (demande, mission, dossier, litige, paiement). Chaque variant correspond à une couleur sémantique définie dans le design system.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `label` | `string` | ✅ | Texte affiché dans le badge |
| `variant` | `StatusVariant` | ✅ | Contrôle la couleur de fond et de texte |
| `withDot` | `boolean` | ❌ | Affiche un point pulsant animé (urgence, disponibilité) |
| `size` | `'sm' \| 'md'` | ❌ | Taille du badge (défaut: `md`) |

**Type `StatusVariant`**
```ts
type StatusVariant =
  | 'en_cours'      // bleu clair
  | 'terminee'      // vert clair
  | 'annulee'       // rouge clair
  | 'en_attente'    // orange/ambre
  | 'ouvert'        // rouge
  | 'traitement'    // ambre
  | 'resolu'        // vert
  | 'disponible'    // vert
  | 'indisponible'  // rouge
  | 'urgent'        // rouge foncé
  | 'sequestre'     // ambre
  | 'libere'        // vert
  | 'litige'        // rouge
  | 'dossier_ok'    // vert
  | 'manquant'      // rouge
  | 'actif'         // vert
  | 'suspendu'      // rouge clair
  | 'paye_sequestre'; // ambre
```

**State**
Le point pulsant (`withDot`) est une animation CSS `@keyframes pulse` isolée, sans état React.

---

### 1.5 `RoleTag`

**Description**
Petite capsule affichée sous le logo ServiLoc dans la Sidebar pour identifier le type d'espace courant.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `role` | `'CLIENT' \| 'PRESTATAIRE' \| 'ADMIN' \| 'SERVICE CLIENT'` | ✅ | Texte et couleur de fond |

**State**
Aucun.

---

### 1.6 `UserAvatarFooter`

**Description**
Bloc en bas de la Sidebar affichant l'avatar (initiale dans un cercle), le nom complet et le rôle/sous-titre de l'utilisateur connecté.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `initial` | `string` | ✅ | Lettre initiale à afficher dans le cercle |
| `name` | `string` | ✅ | Nom complet de l'utilisateur |
| `subtitle` | `string` | ✅ | Rôle ou information secondaire (ex: "Plombier · 4.8") |
| `avatarColor` | `string` | ❌ | Couleur de fond de l'avatar (défaut: `#e5e7eb`) |

**State**
Aucun.

---

### 1.7 `MetricCard`

**Description**
Carte de KPI standardisée, affichant un titre de métrique, une valeur principale en gros et une tendance (variation par rapport à la période précédente). Utilisée dans les dashboards Client, Prestataire, Admin, et la page Statistiques.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `label` | `string` | ✅ | Libellé de la métrique (ex: "MISSIONS CE MOIS") |
| `value` | `string \| number` | ✅ | Valeur principale (ex: "18", "185k XAF") |
| `trend` | `{ value: string; direction: 'up' \| 'down' \| 'neutral' }` | ❌ | Variation avec flèche directionnelle |
| `trendSubtext` | `string` | ❌ | Contexte de comparaison (ex: "+3 vs avril") |
| `className` | `string` | ❌ | Classes Tailwind additionnelles |

**State**
Aucun.

---

### 1.8 `SectionCard`

**Description**
Conteneur blanc à coins arrondis avec bordure subtile. Sert d'enveloppe visuelle pour les grandes zones de contenu (formulaires, listes, tableaux) dans toutes les interfaces. Accepte un `title` et un slot `actions` optionnel.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `title` | `string` | ❌ | Titre de section en uppercase letter-spaced |
| `actions` | `ReactNode` | ❌ | Slot pour boutons/liens (aligné à droite du titre) |
| `children` | `ReactNode` | ✅ | Contenu de la carte |
| `className` | `string` | ❌ | Classes Tailwind additionnelles |
| `noPadding` | `boolean` | ❌ | Désactive le padding interne (pour les tableaux bord-à-bord) |

**State**
Aucun.

---

### 1.9 `FormField`

**Description**
Composant d'input standardisé : label au-dessus, input, helper text optionnel en dessous et message d'erreur. Respecte le pattern "label above input" du design system.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `label` | `string` | ✅ | Texte du label (affiché au-dessus) |
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'number' \| 'textarea'` | ❌ | Type d'input (défaut: `text`) |
| `placeholder` | `string` | ❌ | Texte fantôme |
| `value` | `string` | ✅ | Valeur contrôlée |
| `onChange` | `(value: string) => void` | ✅ | Callback de changement |
| `error` | `string` | ❌ | Message d'erreur affiché en rouge sous l'input |
| `helperText` | `string` | ❌ | Texte d'aide neutre sous l'input |
| `required` | `boolean` | ❌ | Ajoute l'astérisque `*` au label |
| `disabled` | `boolean` | ❌ | Désactive l'input |

**State**
Aucun état interne (composant contrôlé).

---

### 1.10 `PrimaryButton`

**Description**
Bouton d'action principale, fond noir, texte blanc. Utilisé pour les CTAs principaux (soumettre, valider, publier, envoyer). Inclut un état de chargement avec spinner.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `label` | `string` | ✅ | Texte du bouton |
| `onClick` | `() => void` | ✅ | Handler de clic |
| `isLoading` | `boolean` | ❌ | Affiche un spinner et désactive le bouton |
| `disabled` | `boolean` | ❌ | Désactive le bouton sans spinner |
| `type` | `'button' \| 'submit'` | ❌ | Attribut HTML type (défaut: `button`) |
| `fullWidth` | `boolean` | ❌ | Étend le bouton en pleine largeur (défaut: `false`) |
| `icon` | `ReactNode` | ❌ | Icône affichée avant le label |

**State**
Aucun état interne.

---

### 1.11 `SecondaryButton`

**Description**
Bouton d'action secondaire, contour visible, fond transparent ou clair. Utilisé pour "Annuler", "Refuser", "Exporter". Partage la même structure que `PrimaryButton`.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `label` | `string` | ✅ | Texte du bouton |
| `onClick` | `() => void` | ✅ | Handler de clic |
| `variant` | `'outline' \| 'ghost' \| 'danger'` | ❌ | Style visuel (défaut: `outline`) |
| `disabled` | `boolean` | ❌ | Désactive le bouton |
| `fullWidth` | `boolean` | ❌ | Pleine largeur |
| `icon` | `ReactNode` | ❌ | Icône optionnelle |

**State**
Aucun état interne.

---

### 1.12 `AlertBanner`

**Description**
Bandeau d'alerte inline contextuel. Utilisé pour les messages d'erreur (OTP erroné, identifiants incorrects), d'information (code SMS envoyé, accès limité) et d'avertissement (document manquant). Variante `error` a fond rose, `info` fond bleu clair, `warning` fond ambre clair.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `message` | `string` | ✅ | Texte du message |
| `variant` | `'error' \| 'info' \| 'warning' \| 'success'` | ✅ | Type d'alerte |
| `icon` | `ReactNode` | ❌ | Icône préfixe (défaut selon variant) |
| `onDismiss` | `() => void` | ❌ | Si défini, affiche un bouton de fermeture |

**State**
Aucun état interne (contrôlé par le parent qui gère l'affichage).

---

### 1.13 `StarRating`

**Description**
Affichage d'une note étoilée. Deux modes : `readonly` (affichage seul avec note chiffrée) et `interactive` (sélection par clic). Utilisé dans les cards prestataires, les dashboards et les écrans de notation.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `value` | `number` | ✅ | Note courante (0-5) |
| `maxStars` | `number` | ❌ | Nombre max d'étoiles (défaut: 5) |
| `readonly` | `boolean` | ❌ | Mode lecture seule (défaut: `false`) |
| `onChange` | `(value: number) => void` | ❌ | Callback (requis si `readonly: false`) |
| `showValue` | `boolean` | ❌ | Affiche la valeur numérique à côté |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ | Taille des étoiles (défaut: `md`) |

**State**
- `hoveredStar: number | null` — étoile survolée (mode interactif uniquement)

---

### 1.14 `UserAvatarCircle`

**Description**
Cercle avatar avec initiale centré. Composant léger utilisé dans les listes de missions, les cards prestataires, les panels "parties concernées". Différent de `UserAvatarFooter` qui est une unité complète avec nom et subtitle.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `initial` | `string` | ✅ | Lettre initiale |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ | Taille du cercle (défaut: `md`) |
| `color` | `string` | ❌ | Couleur de fond (défaut: `#e5e7eb`) |
| `imageUrl` | `string` | ❌ | URL image (remplace l'initiale si fournie) |

**State**
Aucun.

---

### 1.15 `TabBar`

**Description**
Barre d'onglets horizontale avec indicateur actif souligné. Utilisée pour filtrer des listes (ex: Tous / Clients / Prestataires / Suspendus, ou Zone prioritaire / Zones éloignées). Supporte les badges numériques sur chaque onglet.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `tabs` | `Tab[]` | ✅ | Liste des onglets |
| `activeTabId` | `string` | ✅ | ID de l'onglet actif |
| `onChange` | `(tabId: string) => void` | ✅ | Callback de changement |

**Type `Tab`**
```ts
type Tab = {
  id: string;
  label: string;
  count?: number;
}
```

**State**
Aucun état interne (composant contrôlé).

---

### 1.16 `DataTable`

**Description**
Tableau de données générique avec colonnes configurables, lignes clickables et slots de rendu custom par cellule. Utilisé dans la gestion des utilisateurs, litiges, transactions admin et historique des missions.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `columns` | `Column<T>[]` | ✅ | Définitions des colonnes |
| `data` | `T[]` | ✅ | Tableau de données |
| `onRowClick` | `(row: T) => void` | ❌ | Handler de clic sur une ligne |
| `isLoading` | `boolean` | ❌ | Affiche un skeleton loader |
| `emptyState` | `ReactNode` | ❌ | Contenu affiché si `data` est vide |
| `keyExtractor` | `(row: T) => string` | ✅ | Fonction de clé unique par ligne |

**Type `Column<T>`**
```ts
type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
}
```

**State**
Aucun.

---

### 1.17 `MapEmbed`

**Description**
Zone carte interactive placeholder (ou carte réelle via Leaflet/Mapbox). Affiche une zone bleue claire avec un texte d'adresse centré et un marqueur. Utilisé dans la localisation de mission (formulaire demande, suivi mission, profil prestataire).

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `address` | `string` | ❌ | Adresse affichée sous la carte |
| `label` | `string` | ❌ | Label affiché au centre de la zone carte |
| `interactive` | `boolean` | ❌ | Active la sélection de position (défaut: `false`) |
| `onLocationChange` | `(coords: { lat: number; lng: number }) => void` | ❌ | Callback si `interactive: true` |
| `height` | `string` | ❌ | Hauteur CSS (défaut: `200px`) |

**State**
- `selectedCoords: { lat: number; lng: number } | null` — seulement si `interactive: true`

---

### 1.18 `PhotoUploader`

**Description**
Zone de dépôt photo avec miniatures. Supporte jusqu'à N photos (configurable). Affiche un état "photo ajoutée" (vert) ou un slot "+" pour ajouter. Utilisé dans la création de demande et le signalement de litige.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `maxPhotos` | `number` | ❌ | Nombre max de photos (défaut: 4) |
| `photos` | `UploadedPhoto[]` | ✅ | Photos déjà ajoutées |
| `onAdd` | `(file: File) => void` | ✅ | Callback ajout de fichier |
| `onRemove` | `(id: string) => void` | ✅ | Callback suppression |
| `label` | `string` | ❌ | Label de section (ex: "PHOTOS (OPTIONNEL)") |

**Type `UploadedPhoto`**
```ts
type UploadedPhoto = {
  id: string;
  url: string;
  name: string;
}
```

**State**
Aucun état interne (composant contrôlé).

---

### 1.19 `ProgressBar`

**Description**
Barre de progression horizontale avec un pourcentage texte optionnel. Utilisée dans le suivi de mission (% d'avancement) et la page statistiques (répartition par service, prestataires actifs).

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `value` | `number` | ✅ | Valeur actuelle (0-100) |
| `max` | `number` | ❌ | Valeur maximale (défaut: 100) |
| `color` | `string` | ❌ | Couleur de la barre (défaut: `#1d4ed8`) |
| `showLabel` | `boolean` | ❌ | Affiche le pourcentage (défaut: `false`) |
| `size` | `'sm' \| 'md'` | ❌ | Épaisseur de la barre (défaut: `sm`) |

**State**
Aucun.

---

### 1.20 `ServiceCategoryCard`

**Description**
Tuile de catégorie de service avec icône colorée et libellé. Utilisée dans le dashboard client (grille de 6 catégories) et dans le formulaire de nouvelle demande. Supporte un état `selected` (bordure noire active).

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `category` | `ServiceCategory` | ✅ | Objet catégorie (id, label, icon, color) |
| `selected` | `boolean` | ❌ | Affiche la sélection active |
| `onClick` | `(id: string) => void` | ❌ | Callback de clic |
| `size` | `'sm' \| 'md'` | ❌ | Taille de la tuile (défaut: `md`) |

**Type `ServiceCategory`**
```ts
type ServiceCategory = {
  id: string;
  label: string;
  icon: ReactNode;
  color: string; // couleur de fond de la tuile
}
```

**State**
Aucun état interne.

---

### 1.21 `SearchInput`

**Description**
Champ de recherche avec icône loupe en préfixe. Utilisé dans la gestion des utilisateurs (Admin) et le filtre des demandes disponibles (Prestataire).

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `value` | `string` | ✅ | Valeur contrôlée |
| `onChange` | `(value: string) => void` | ✅ | Callback |
| `placeholder` | `string` | ❌ | Texte placeholder (défaut: "Rechercher...") |
| `onClear` | `() => void` | ❌ | Affiche un bouton × si défini |

**State**
Aucun état interne.

---

### 1.22 `FileAttachment`

**Description**
Capsule représentant un fichier joint (pièce jointe, justificatif). Affiche une icône document + le nom du fichier. Cliquable pour prévisualiser ou télécharger.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `fileName` | `string` | ✅ | Nom du fichier affiché |
| `fileUrl` | `string` | ❌ | URL de téléchargement |
| `onRemove` | `() => void` | ❌ | Affiche un bouton de suppression si défini |
| `onClick` | `() => void` | ❌ | Handler de clic (prévisualisation) |

**State**
Aucun.

---

### 1.23 `AmountDisplay`

**Description**
Affichage standardisé d'un montant monétaire en XAF. Gère le formatage (séparateurs de milliers) et les variantes de taille. Utilisé dans les devis, tableaux de transactions, cards de gains.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `amount` | `number` | ✅ | Montant en valeur numérique |
| `currency` | `string` | ❌ | Devise (défaut: `"XAF"`) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | ❌ | Taille typographique (défaut: `md`) |
| `variant` | `'default' \| 'positive' \| 'negative' \| 'muted'` | ❌ | Couleur sémantique |
| `showSign` | `boolean` | ❌ | Affiche + ou - devant le montant |

**State**
Aucun.

---

### 1.24 `EmptyState`

**Description**
Illustration et message affiché quand une liste est vide (aucun litige, aucune demande, etc.). Peut inclure un bouton CTA pour créer un premier élément.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `icon` | `ReactNode` | ❌ | Icône illustrative |
| `title` | `string` | ✅ | Titre de l'état vide |
| `description` | `string` | ❌ | Description secondaire |
| `action` | `{ label: string; onClick: () => void }` | ❌ | Bouton CTA optionnel |

**State**
Aucun.

---

### 1.25 `SkeletonLoader`

**Description**
Placeholder animé (shimmer) en forme de carte ou de ligne, affiché pendant le chargement des données. Composant générique acceptant une forme et des dimensions.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `variant` | `'card' \| 'row' \| 'metric' \| 'text'` | ✅ | Forme du skeleton |
| `count` | `number` | ❌ | Nombre de répétitions (défaut: 1) |
| `className` | `string` | ❌ | Classes additionnelles |

**State**
Aucun. L'animation shimmer est gérée en CSS pur.

---

## 2. Espace AUTH

> Interfaces : `01_UC1_Inscription_Connexion`, `02_UC1_Verification_OTP`, `03_UC29_Connexion_Admin`, `04_UC35_Connexion_ServiceClient`

---

### 2.1 `AuthSplitLayout`

**Description**
Mise en page split-screen spécifique aux écrans d'inscription/connexion Client & Prestataire. Panneau gauche sombre (branding + stats) et panneau droit clair (formulaire). Non utilisé pour Admin (full-dark) ni Service Client (card centrée).

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `leftPanel` | `ReactNode` | ✅ | Contenu du panneau sombre (branding) |
| `rightPanel` | `ReactNode` | ✅ | Contenu du panneau clair (formulaire) |

**State**
Aucun.

---

### 2.2 `BrandingPanel`

**Description**
Panneau gauche de `AuthSplitLayout`. Affiche le logo, le tagline, la description de la plateforme et les statistiques clés (312+ prestataires, 4.7 note, 1800+ missions). Composant purement statique.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `stats` | `{ value: string; label: string }[]` | ✅ | Tableau des stats affichées |
| `headline` | `string` | ✅ | Titre principal |
| `subline` | `string` | ✅ | Description secondaire |

**State**
Aucun.

---

### 2.3 `RegistrationForm`

**Description**
Formulaire de création de compte. Inclut un `RoleSwitcher` (Client / Prestataire), les champs Prénom, Nom, Téléphone, Email, Mot de passe, le bouton de soumission et le lien "Se connecter". Affiche une `AlertBanner` info en bas ("Un code SMS vous sera envoyé").

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `onSubmit` | `(data: RegistrationData) => Promise<void>` | ✅ | Handler de soumission |
| `onSwitchToLogin` | `() => void` | ✅ | Navigue vers la connexion |
| `defaultRole` | `'client' \| 'provider'` | ❌ | Rôle pré-sélectionné (défaut: `client`) |

**Type `RegistrationData`**
```ts
type RegistrationData = {
  role: 'client' | 'provider';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}
```

**State**
- `formData: RegistrationData` — valeurs du formulaire
- `isSubmitting: boolean` — état de chargement
- `errors: Partial<Record<keyof RegistrationData, string>>` — erreurs par champ

---

### 2.4 `RoleSwitcher`

**Description**
Sélecteur à deux options (Client / Prestataire) sous forme de toggle avec un fond blanc sur l'option active. Utilisé dans `RegistrationForm`.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `value` | `'client' \| 'provider'` | ✅ | Option sélectionnée |
| `onChange` | `(role: 'client' \| 'provider') => void` | ✅ | Callback de changement |

**State**
Aucun (composant contrôlé).

---

### 2.5 `LoginForm`

**Description**
Formulaire de connexion simplifié (Email + Mot de passe + bouton). Variante du formulaire d'inscription réutilisable. Composant générique paramétré par les labels.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `emailLabel` | `string` | ❌ | Label du champ email (défaut: "EMAIL") |
| `emailPlaceholder` | `string` | ❌ | Placeholder email |
| `submitLabel` | `string` | ✅ | Texte du bouton de soumission |
| `onSubmit` | `(data: LoginData) => Promise<void>` | ✅ | Handler |
| `error` | `string` | ❌ | Message d'erreur global (mauvais identifiants) |
| `infoMessage` | `string` | ❌ | Message informatif affiché en bas |
| `infoVariant` | `'info' \| 'warning'` | ❌ | Style du message info |

**Type `LoginData`**
```ts
type LoginData = {
  email: string;
  password: string;
}
```

**State**
- `formData: LoginData`
- `isSubmitting: boolean`

---

### 2.6 `AdminLoginPage`

**Description**
Page de connexion admin. Full-dark background. Contient le logo centré, un `LoginForm` dans une `SectionCard` sombre, avec le libellé "Connexion sécurisée — Accès réservé aux administrateurs".

**Props**
Aucune prop (composant de page, données récupérées depuis le `AuthContext` ou React Router).

**State**
Délégué à `LoginForm` interne.

---

### 2.7 `ServiceClientLoginPage`

**Description**
Page de connexion Service Client. Fond gris très clair, `SectionCard` blanche centrée avec icône casque, titre "Espace Service Client", `LoginForm` et un `AlertBanner info` indiquant les droits limités.

**Props**
Aucune prop (composant de page).

**State**
Délégué à `LoginForm` interne.

---

### 2.8 `OTPVerificationCard`

**Description**
Carte centrée de vérification OTP. Affiche une icône enveloppe/SMS, le titre "Vérification du téléphone", le numéro masqué, les 4 inputs de chiffres, le bouton de validation, le countdown de renvoi, et une `AlertBanner error` en cas de code erroné.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `phone` | `string` | ✅ | Numéro de téléphone (masqué) vers lequel le SMS est envoyé |
| `onSubmit` | `(code: string) => Promise<void>` | ✅ | Handler de validation |
| `onResend` | `() => Promise<void>` | ✅ | Handler de renvoi du code |
| `resendCooldown` | `number` | ✅ | Délai en secondes avant renvoi possible |
| `error` | `string` | ❌ | Message d'erreur (code erroné, tentatives restantes) |

**State**
- `digits: string[]` — tableau des 4 chiffres saisis
- `countdown: number` — secondes restantes avant renvoi (géré par `useEffect` avec `setInterval`)
- `isSubmitting: boolean`

---

### 2.9 `OTPDigitInput`

**Description**
Input individuel d'un chiffre OTP. Gère le focus automatique vers le prochain input au saisie, et le focus arrière à la suppression. Composant atomique utilisé dans `OTPVerificationCard`.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `value` | `string` | ✅ | Valeur du chiffre (vide ou un caractère) |
| `onChange` | `(value: string) => void` | ✅ | Callback de changement |
| `onFocus` | `() => void` | ❌ | Handler de focus |
| `inputRef` | `RefObject<HTMLInputElement>` | ✅ | Ref pour gérer le focus programmatique |
| `hasError` | `boolean` | ❌ | Bordure rouge si erreur |

**State**
Aucun état interne.

---

## 3. Espace CLIENT

> Interfaces : `05` Dashboard, `06` Nouvelle demande, `07` Chat, `08` Devis, `09` Suivi mission, `10` Notation, `11` Litige, `12` Mode urgence, `13` Contact urgence

---

### 3.1 `ClientShell`

**Description**
Variant de `AppShell` pour l'espace client. Configure le `Sidebar` avec les items de navigation client (Tableau de bord, Mes demandes, Messages, Mode urgence, Historique, Mon profil) et le `RoleTag` "CLIENT" bleu.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `children` | `ReactNode` | ✅ | Contenu de la page active |
| `activeNavItem` | `string` | ✅ | ID de l'item de nav actif |
| `user` | `ClientUser` | ✅ | Données de l'utilisateur connecté |
| `unreadMessagesCount` | `number` | ❌ | Badge sur "Messages" |

**State**
Aucun.

---

### 3.2 `ClientDashboardPage`

**Description**
Page principale du tableau de bord client. Orchestre les composants : `WelcomeBanner`, `CategoryGrid`, `RecentDemandsList`, `FinancialSummaryPanel`.

**Props**
Aucune prop (composant de page, données via `useClientDashboard` hook).

**State**
- `dashboardData: DashboardData | null` — données chargées (ou skeleton en attente)

---

### 3.3 `WelcomeBanner`

**Description**
Bandeau de bienvenue noir en pleine largeur sur le dashboard client. Affiche le prénom de l'utilisateur, le CTA "Trouver un prestataire maintenant →" et la localisation détectée à droite.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `firstName` | `string` | ✅ | Prénom de l'utilisateur |
| `location` | `string` | ✅ | Ville/quartier détecté |
| `onFindProvider` | `() => void` | ✅ | Handler du CTA |

**State**
Aucun.

---

### 3.4 `CategoryGrid`

**Description**
Grille horizontale de 6 `ServiceCategoryCard`. Sert de raccourci vers la création d'une demande filtrée par catégorie. Titre "CATÉGORIES DE SERVICES" au-dessus.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `categories` | `ServiceCategory[]` | ✅ | Liste des catégories à afficher |
| `onCategoryClick` | `(categoryId: string) => void` | ✅ | Handler de clic sur une tuile |

**State**
Aucun.

---

### 3.5 `RecentDemandsList`

**Description**
`SectionCard` listant les 4 dernières demandes du client. Chaque ligne est un `DemandListItem`. Un bouton "Tout voir" en haut à droite navigue vers "Mes demandes".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `demands` | `ClientDemand[]` | ✅ | Liste des demandes récentes |
| `onViewAll` | `() => void` | ✅ | Handler du lien "Tout voir" |
| `onDemandClick` | `(demandId: string) => void` | ✅ | Handler de clic sur une ligne |

**State**
Aucun.

---

### 3.6 `DemandListItem`

**Description**
Ligne d'une demande dans `RecentDemandsList`. Affiche l'icône de catégorie, la catégorie + nom du prestataire, la description courte, le `StatusBadge` et la date.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `demand` | `ClientDemand` | ✅ | Données de la demande |
| `onClick` | `() => void` | ✅ | Handler de clic |

**Type `ClientDemand`**
```ts
type ClientDemand = {
  id: string;
  category: ServiceCategory;
  providerName: string | null;
  description: string;
  status: StatusVariant;
  date: string;
}
```

**State**
Aucun.

---

### 3.7 `FinancialSummaryPanel`

**Description**
Colonne droite du dashboard client. Contient deux `MetricCard` spécialisées : montant total dépensé (fond bleu clair) et paiement en attente/séquestre (fond ambre clair).

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `totalSpent` | `{ amount: number; missionsCount: number }` | ✅ | Total dépensé |
| `pendingPayment` | `{ amount: number; missionLabel: string } \| null` | ❌ | Paiement séquestré en cours |

**State**
Aucun.

---

### 3.8 `NewDemandePage`

**Description**
Page de création d'une nouvelle demande de service. Orchestre le stepper multi-étapes et les composants de chaque étape. Gère l'état global de la demande en construction.

**Props**
Aucune prop (composant de page).

**State**
- `currentStep: number` — étape courante (1 à 5)
- `demandDraft: DemandDraft` — objet demande en cours de construction
- `isSubmitting: boolean`

**Type `DemandDraft`**
```ts
type DemandDraft = {
  categoryId: string | null;
  description: string;
  photos: UploadedPhoto[];
  location: { address: string; coords?: { lat: number; lng: number } } | null;
}
```

---

### 3.9 `StepIndicator`

**Description**
Indicateur de progression à 5 étapes horizontales en haut de la page de nouvelle demande. Chaque étape a un numéro, un libellé et un état (complété ✓, actif, à venir grisé). Reliées par une ligne de connexion.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `steps` | `Step[]` | ✅ | Liste des étapes avec label |
| `currentStep` | `number` | ✅ | Index de l'étape active (1-based) |

**Type `Step`**
```ts
type Step = {
  number: number;
  label: string;
}
```

**State**
Aucun.

---

### 3.10 `CategorySelector`

**Description**
Grille de `ServiceCategoryCard` en mode sélection unique utilisée dans le formulaire de nouvelle demande (étape Catégorie). Idem que `CategoryGrid` mais avec état de sélection géré.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `categories` | `ServiceCategory[]` | ✅ | Options disponibles |
| `selectedId` | `string \| null` | ✅ | ID sélectionné |
| `onSelect` | `(id: string) => void` | ✅ | Callback |

**State**
Aucun (contrôlé par `NewDemandePage`).

---

### 3.11 `DemandDescriptionField`

**Description**
Textarea pour la description détaillée de la demande. Label "DESCRIPTION DÉTAILLÉE *" au-dessus avec compteur de caractères min recommandé. Gère les états vide/rempli et l'erreur de validation.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `value` | `string` | ✅ | Valeur du textarea |
| `onChange` | `(value: string) => void` | ✅ | Callback |
| `error` | `string` | ❌ | Message d'erreur |
| `minLength` | `number` | ❌ | Longueur min recommandée |

**State**
Aucun.

---

### 3.12 `LocationSidePanel`

**Description**
Panneau latéral droit du formulaire de nouvelle demande. Contient la `MapEmbed` interactive et l'adresse détectée avec un bouton "Modifier".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `address` | `string` | ✅ | Adresse courante |
| `onModify` | `() => void` | ✅ | Ouvre la sélection de localisation |

**State**
Aucun.

---

### 3.13 `RecapSidePanel`

**Description**
Panneau récapitulatif côté droit du formulaire de nouvelle demande. Affiche un tableau `label / valeur` pour Catégorie, Localisation, Photos, Statut. Inclut les boutons "Annuler" et "Publier la demande →".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `recap` | `DemandRecap` | ✅ | Données récapitulatives |
| `onCancel` | `() => void` | ✅ | Annulation |
| `onSubmit` | `() => void` | ✅ | Publication |
| `isSubmitting` | `boolean` | ❌ | Désactive le bouton pendant envoi |

**Type `DemandRecap`**
```ts
type DemandRecap = {
  category: string;
  location: string;
  photoCount: number;
  status: string;
}
```

**State**
Aucun.

---

### 3.14 `ChatPage`

**Description**
Page de messagerie entre le client et le prestataire. Orchestre `ChatHeader`, `MessageThread`, `ChatInputBar` (colonne gauche) et `MissionSidePanel` + `ProviderMiniCard` (colonne droite).

**Props**
Aucune prop (composant de page, données via `useChatSession(missionId)` hook).

**State**
- `messages: Message[]` — liste des messages chargés
- `inputValue: string` — texte en cours de saisie
- `isSending: boolean`

---

### 3.15 `ChatHeader`

**Description**
En-tête de la fenêtre de chat. Affiche `UserAvatarCircle`, nom du prestataire, statut en ligne + spécialité, et les boutons "Appeler" et `StatusBadge` "MISSION EN COURS" à droite.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `provider` | `{ name: string; specialty: string; isOnline: boolean }` | ✅ | Infos du prestataire |
| `missionStatus` | `StatusVariant` | ✅ | Statut de la mission associée |
| `onCall` | `() => void` | ✅ | Handler bouton "Appeler" |

**State**
Aucun.

---

### 3.16 `MessageThread`

**Description**
Zone de défilement des messages. Affiche les `MessageBubble` en distinguant les messages envoyés (droite, fond sombre) et reçus (gauche, fond blanc). Les timestamps sont affichés sous chaque bulle.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `messages` | `Message[]` | ✅ | Liste des messages à afficher |
| `currentUserId` | `string` | ✅ | ID de l'utilisateur courant (pour distinguer envoyé/reçu) |

**Type `Message`**
```ts
type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}
```

**State**
- Auto-scroll en bas au montage et à chaque nouveau message via `useEffect` + `scrollIntoView`.

---

### 3.17 `MessageBubble`

**Description**
Bulle de message individuelle. Variant `sent` (fond noir, texte blanc, aligné droite) et `received` (fond blanc, bordure, aligné gauche). Affiche le texte et le timestamp.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `content` | `string` | ✅ | Texte du message |
| `timestamp` | `string` | ✅ | Heure d'envoi |
| `variant` | `'sent' \| 'received'` | ✅ | Côté et style |

**State**
Aucun.

---

### 3.18 `ChatInputBar`

**Description**
Barre de saisie de message en bas du chat. Input texte + bouton upload fichier + bouton "Envoyer →".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `value` | `string` | ✅ | Valeur contrôlée |
| `onChange` | `(value: string) => void` | ✅ | Callback input |
| `onSend` | `() => void` | ✅ | Envoi du message |
| `onAttach` | `() => void` | ✅ | Ouverture du picker fichier |
| `isSending` | `boolean` | ❌ | Désactive l'envoi |

**State**
Aucun.

---

### 3.19 `MissionSidePanel`

**Description**
Panneau latéral dans le chat affichant la mission associée : catégorie + titre, localisation, date, montant du devis, statut de paiement. Composant de lecture seule.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `mission` | `MissionSummary` | ✅ | Données de la mission |

**Type `MissionSummary`**
```ts
type MissionSummary = {
  id: string;
  category: string;
  title: string;
  location: string;
  date: string;
  quoteAmount: number;
  paymentStatus: StatusVariant;
}
```

**State**
Aucun.

---

### 3.20 `ProviderMiniCard`

**Description**
Mini-carte affichant le profil du prestataire : avatar, nom, `StarRating`, nombre de missions, certification. Utilisé dans le chat et les vues devis/suivi mission.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `provider` | `ProviderSummary` | ✅ | Données du prestataire |

**Type `ProviderSummary`**
```ts
type ProviderSummary = {
  id: string;
  name: string;
  avatarInitial: string;
  rating: number;
  missionsCount: number;
  specialty: string;
  isCertified: boolean;
}
```

**State**
Aucun.

---

### 3.21 `QuoteDetailPage`

**Description**
Page de consultation et d'acceptation/refus d'un devis. Orchestre `QuoteTable`, `QuoteMetaInfo`, `PaymentMethodSelector`, `SecurePaymentInfo` (colonne droite) et les boutons d'action.

**Props**
Aucune prop (composant de page).

**State**
- `selectedPaymentMethod: string | null`
- `isAccepting: boolean`
- `isRejecting: boolean`

---

### 3.22 `QuoteTable`

**Description**
Tableau du devis détaillé. En-têtes : Désignation, Qté, Prix unitaire, Sous-total. Ligne de total en gras. Suivie de deux cellules d'info : Délai estimé et Validité devis. Affiche un `StatusBadge` en haut à droite.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `quote` | `QuoteData` | ✅ | Données complètes du devis |

**Type `QuoteData`**
```ts
type QuoteData = {
  reference: string;
  title: string;
  status: StatusVariant;
  lines: QuoteLine[];
  estimatedDuration: string;
  validityDuration: string;
}

type QuoteLine = {
  designation: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
```

**State**
Aucun.

---

### 3.23 `PaymentMethodSelector`

**Description**
Groupe de radio-buttons stylisés pour sélectionner le mode de paiement mobile money (Orange Money, MTN Mobile Money). L'option sélectionnée a une bordure noire active.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `methods` | `PaymentMethod[]` | ✅ | Options disponibles |
| `selectedId` | `string \| null` | ✅ | Méthode sélectionnée |
| `onChange` | `(id: string) => void` | ✅ | Callback |

**Type `PaymentMethod`**
```ts
type PaymentMethod = {
  id: string;
  label: string;
  icon: ReactNode;
}
```

**State**
Aucun (contrôlé).

---

### 3.24 `SecurePaymentInfo`

**Description**
Encart informatif bleu clair expliquant le mécanisme de séquestre ("Votre paiement est séquestré sur la plateforme et libéré uniquement après validation de la mission"). Composant statique.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `message` | `string` | ❌ | Message personnalisable (défaut: texte séquestre) |

**State**
Aucun.

---

### 3.25 `MissionTrackingPage`

**Description**
Page de suivi de mission en temps réel. Orchestre `MissionProgressHeader`, `MissionStepList`, `MapEmbed` temps réel (colonne gauche), et `MissionProviderPanel`, `SequestredAmountCard`, `LitigeAlertPanel` (colonne droite).

**Props**
Aucune prop (données via `useMissionTracking(missionId)` hook).

**State**
- `missionData: MissionTrackingData | null`

---

### 3.26 `MissionProgressHeader`

**Description**
En-tête de la section d'avancement : trois cellules affichant "Démarré à", "Durée écoulée" et "Durée estimée".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `startedAt` | `string` | ✅ | Heure de démarrage |
| `elapsed` | `string` | ✅ | Durée écoulée (ex: "1h 45min") |
| `estimated` | `string` | ✅ | Durée estimée (ex: "2h") |

**State**
Aucun.

---

### 3.27 `MissionStepList`

**Description**
Liste des étapes de la mission avec cases à cocher. Étapes cochées = ligne barrée + fond vert. Étapes non cochées = fond blanc. Le prestataire coche les étapes; le client les visualise.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `steps` | `MissionStep[]` | ✅ | Liste des étapes |
| `readonly` | `boolean` | ❌ | Mode lecture seule (client) ou éditable (prestataire) |
| `onToggle` | `(stepId: string) => void` | ❌ | Handler (si `readonly: false`) |

**Type `MissionStep`**
```ts
type MissionStep = {
  id: string;
  label: string;
  completed: boolean;
}
```

**State**
Aucun (contrôlé).

---

### 3.28 `SequestredAmountCard`

**Description**
Carte latérale affichant le montant séquestré, le texte "Libéré après double validation" et une `ProgressBar` représentant l'avancement de la mission.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `amount` | `number` | ✅ | Montant séquestré en XAF |
| `progressPercent` | `number` | ✅ | % d'avancement (0-100) |

**State**
Aucun.

---

### 3.29 `LitigeAlertPanel`

**Description**
Encart ambre "Signaler un problème" avec le bouton "Ouvrir un litige". Affiché en bas du panel latéral du suivi de mission.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `onOpenLitige` | `() => void` | ✅ | Handler de navigation vers le formulaire de litige |

**State**
Aucun.

---

### 3.30 `RatingPage`

**Description**
Page de notation du prestataire après mission terminée. Affiche d'abord un `MissionCompletedBanner`, puis le formulaire de notation avec `StarRating`, `RatingCriteriaGroup` et zone de commentaire.

**Props**
Aucune prop (composant de page).

**State**
- `rating: number` — note globale
- `criteria: Record<string, string>` — critères sélectionnés (Ponctualité, Qualité, Propreté)
- `comment: string`
- `isSubmitting: boolean`

---

### 3.31 `MissionCompletedBanner`

**Description**
Carte de confirmation de fin de mission. Icône fête + titre "Mission terminée !" + sous-titre mission/lieu + bloc vert "Paiement libéré" avec le montant.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `missionTitle` | `string` | ✅ | Nom/catégorie de la mission |
| `location` | `string` | ✅ | Lieu de la mission |
| `releasedAmount` | `number` | ✅ | Montant libéré en XAF |

**State**
Aucun.

---

### 3.32 `RatingCriteriaGroup`

**Description**
Groupe de chips de notation pour un critère donné (Ponctualité, Qualité du travail, Propreté). Chaque option est un chip cliquable, fond noir si sélectionné.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `label` | `string` | ✅ | Nom du critère |
| `options` | `string[]` | ✅ | Options disponibles |
| `selected` | `string \| null` | ✅ | Option sélectionnée |
| `onChange` | `(value: string) => void` | ✅ | Callback |

**State**
Aucun (contrôlé).

---

### 3.33 `LitigePage`

**Description**
Page de signalement d'un litige. Orchestre `LitigeMotifSelector`, `DemandDescriptionField` (pré-rempli), `PhotoUploader` (preuves) et `AmountDisplay` du montant concerné.

**Props**
Aucune prop (composant de page).

**State**
- `selectedMotif: string | null`
- `description: string`
- `evidences: UploadedPhoto[]`
- `isSubmitting: boolean`

---

### 3.34 `LitigeMotifSelector`

**Description**
Liste de motifs de litige sélectionnables (cards avec titre + description). Un seul motif actif à la fois, affiché avec bordure noire.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `motifs` | `LitigeMotif[]` | ✅ | Liste des motifs disponibles |
| `selectedId` | `string \| null` | ✅ | Motif sélectionné |
| `onChange` | `(id: string) => void` | ✅ | Callback |

**Type `LitigeMotif`**
```ts
type LitigeMotif = {
  id: string;
  title: string;
  description: string;
}
```

**State**
Aucun.

---

### 3.35 `UrgencyPage`

**Description**
Page de mode urgence. Orchestre `UrgencyBanner` (en-tête rouge avec countdown) et la grille de `NearbyProviderCard`. Badge "URGENCE ACTIVE" en haut à droite via `PageHeader`.

**Props**
Aucune prop (données via `useUrgencyMode` hook).

**State**
- `providers: NearbyProvider[]`
- `countdown: number` — secondes du timer

---

### 3.36 `UrgencyBanner`

**Description**
Bandeau d'alerte rouge affichant la catégorie + type d'urgence, la localisation "Recherche en cours..." et le `CountdownTimer`. Composant isolé `"use client"` pour l'animation du timer.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `category` | `string` | ✅ | Catégorie de service |
| `description` | `string` | ✅ | Description de l'urgence |
| `location` | `string` | ✅ | Adresse |
| `countdownSeconds` | `number` | ✅ | Secondes initiales du countdown |

**State**
- `secondsLeft: number` — animé par `useEffect` + `setInterval`

---

### 3.37 `CountdownTimer`

**Description**
Affichage du countdown en format `MM:SS`. Micro-composant `"use client"` isolé pour éviter les re-renders du parent. Couleur rouge vif, typographie large.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `seconds` | `number` | ✅ | Valeur courante en secondes |

**State**
Aucun (contrôlé par le parent `UrgencyBanner`).

---

### 3.38 `NearbyProviderCard`

**Description**
Carte d'un prestataire disponible à proximité en mode urgence. Affiche : avatar+nom+spécialité+note, distance, tarif horaire, `StatusBadge` disponibilité, bouton "Contacter →".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `provider` | `NearbyProvider` | ✅ | Données du prestataire |
| `onContact` | `(id: string) => void` | ✅ | Handler de contact |

**Type `NearbyProvider`**
```ts
type NearbyProvider = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distanceKm: number;
  hourlyRate: number;
  availability: 'available' | 'soon'; // "DISPONIBLE" ou "SOUS 30 MIN"
}
```

**State**
Aucun.

---

## 4. Espace PRESTATAIRE

> Interfaces : `14` Dashboard, `15` Profil, `16` Demandes dispo, `17` Créer devis, `18` Démarrer mission, `19` Tâche terminée, `20` Noter client, `21` Historique gains

---

### 4.1 `ProviderShell`

**Description**
Variant de `AppShell` pour l'espace prestataire. Configure le `Sidebar` avec les items (Tableau de bord, Demandes dispo [avec badge count], Mes missions, Mes devis, Gains & historique, Mon profil), le `RoleTag` "PRESTATAIRE" vert, et le toggle "Disponible" en haut à droite du header.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `children` | `ReactNode` | ✅ | Contenu de la page active |
| `activeNavItem` | `string` | ✅ | ID de l'item actif |
| `user` | `ProviderUser` | ✅ | Données de l'utilisateur |
| `availableDemandsCount` | `number` | ❌ | Badge sur "Demandes dispo" |
| `isAvailable` | `boolean` | ✅ | État de disponibilité courant |
| `onToggleAvailability` | `(value: boolean) => void` | ✅ | Callback toggle |

**State**
Aucun.

---

### 4.2 `AvailabilityToggle`

**Description**
Bouton toggle affiché en haut à droite du header des pages prestataire. Affiche un `StatusBadge` vert "Disponible" ou rouge "Indisponible" avec un point pulsant. Permet de basculer rapidement sa disponibilité.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `isAvailable` | `boolean` | ✅ | État courant |
| `onToggle` | `(value: boolean) => void` | ✅ | Callback |

**State**
Aucun (contrôlé).

---

### 4.3 `ProviderDashboardPage`

**Description**
Tableau de bord du prestataire. Orchestre une grille de 4 `MetricCard`, `RecentMissionsList` + `AvailabilitySchedule` (colonne gauche), et `MonthlyEarningsCard` (colonne droite).

**Props**
Aucune prop (données via `useProviderDashboard` hook).

**State**
- `dashboardData: ProviderDashboardData | null`

---

### 4.4 `RecentMissionsList`

**Description**
Liste des missions récentes du prestataire dans une `SectionCard`. Chaque ligne : avatar client, nom client + catégorie, `StarRating` client, montant en vert, date. Bouton "Tout voir" en haut à droite.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `missions` | `CompletedMission[]` | ✅ | Missions récentes |
| `onViewAll` | `() => void` | ✅ | Lien "Tout voir" |
| `onMissionClick` | `(id: string) => void` | ✅ | Handler de clic |

**Type `CompletedMission`**
```ts
type CompletedMission = {
  id: string;
  clientName: string;
  clientAvatarInitial: string;
  category: string;
  clientRating: number;
  amount: number;
  date: string;
}
```

**State**
Aucun.

---

### 4.5 `AvailabilitySchedule`

**Description**
Carte de planning affichant les créneaux de disponibilité par jour (Lundi-Vendredi, Samedi, Dimanche). Chaque ligne : nom du jour + `StatusBadge` horaire (vert) ou `StatusBadge` "INDISPONIBLE" (rouge).

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `schedule` | `DaySchedule[]` | ✅ | Planning par jour |
| `editable` | `boolean` | ❌ | Active les inputs d'édition (défaut: `false`) |
| `onChange` | `(schedule: DaySchedule[]) => void` | ❌ | Callback si `editable: true` |

**Type `DaySchedule`**
```ts
type DaySchedule = {
  day: string;
  startTime: string | null;
  endTime: string | null;
  isAvailable: boolean;
}
```

**State**
Aucun (contrôlé).

---

### 4.6 `MonthlyEarningsCard`

**Description**
Carte bleue clair affichant le total des gains du mois en grand. Positionnée sous `AvailabilitySchedule` dans la colonne droite du dashboard prestataire.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `amount` | `number` | ✅ | Montant des gains du mois |
| `period` | `string` | ✅ | Libellé de période (ex: "GAINS DU MOIS") |

**State**
Aucun.

---

### 4.7 `ProviderProfilePage`

**Description**
Page de création/modification du profil prestataire. Orchestre trois `SectionCard` : Informations personnelles, Compétences & spécialités, Zone d'intervention. Et un panneau droit : Photo de profil, Justificatifs, Statut de validation.

**Props**
Aucune prop (données via `useProviderProfile` hook).

**State**
- `profileData: ProviderProfileData`
- `isSubmitting: boolean`
- `uploadingPhoto: boolean`

---

### 4.8 `SkillTagInput`

**Description**
Zone de saisie de compétences/spécialités sous forme de tags. Tags existants affichés avec un `×` pour supprimer. Bouton "+ Ajouter" pour saisir une nouvelle compétence.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `tags` | `string[]` | ✅ | Tags actuels |
| `onAdd` | `(tag: string) => void` | ✅ | Callback ajout |
| `onRemove` | `(tag: string) => void` | ✅ | Callback suppression |
| `suggestions` | `string[]` | ❌ | Suggestions d'autocomplétion |

**State**
- `inputValue: string` — texte saisi dans l'input d'ajout
- `showSuggestions: boolean`

---

### 4.9 `DocumentChecklist`

**Description**
Liste des justificatifs requis (Carte professionnelle, Casier judiciaire, Pièce d'identité) avec leur statut : "FOURNI" (vert), "+ Ajouter" (lien), "MANQUANT" (rouge). Un encart ambre "En attente de validation" est affiché en dessous.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `documents` | `DocumentItem[]` | ✅ | Liste des documents |
| `onUpload` | `(docId: string, file: File) => void` | ✅ | Callback upload |
| `validationStatus` | `'pending' \| 'validated' \| 'rejected'` | ✅ | Statut global de validation admin |

**Type `DocumentItem`**
```ts
type DocumentItem = {
  id: string;
  label: string;
  status: 'provided' | 'missing' | 'pending';
}
```

**State**
Aucun (contrôlé).

---

### 4.10 `AvailableDemandsPage`

**Description**
Page des demandes disponibles pour le prestataire. Orchestre un `TabBar` (Zone prioritaire / Zones éloignées), un bouton "Filtrer", le toggle `AvailabilityToggle` et la grille de `DemandCard`.

**Props**
Aucune prop (données via `useAvailableDemands` hook).

**State**
- `activeZone: 'priority' | 'extended'`
- `demands: AvailableDemand[]`
- `isLoading: boolean`

---

### 4.11 `DemandCard`

**Description**
Carte d'une demande disponible pour le prestataire. Affiche : catégorie + badges URGENT/OUVERTE, description, budget estimé, distance, rating moyen du client, ancienneté de la demande, boutons "Voir détails" et "Postuler →".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `demand` | `AvailableDemand` | ✅ | Données de la demande |
| `onViewDetails` | `(id: string) => void` | ✅ | Handler "Voir détails" |
| `onApply` | `(id: string) => void` | ✅ | Handler "Postuler" |

**Type `AvailableDemand`**
```ts
type AvailableDemand = {
  id: string;
  category: ServiceCategory;
  description: string;
  budgetMin: number;
  budgetMax: number;
  distanceKm: number;
  clientRating: number;
  postedAgo: string;
  isUrgent: boolean;
  status: 'open';
}
```

**State**
Aucun.

---

### 4.12 `CreateQuotePage`

**Description**
Page de création d'un devis par le prestataire. Orchestre : `QuoteMainOeuvreSection`, `QuoteMaterialsTable`, `QuoteDeadlineSelector` (colonne gauche) et `QuoteTotalPreview`, `ClientMiniCard` (colonne droite). Boutons "Annuler" + "Envoyer le devis au client →".

**Props**
Aucune prop (données via `useCreateQuote(demandId)` hook).

**State**
- `mainOeuvre: { description: string; amount: number }`
- `materials: MaterialLine[]`
- `estimatedDuration: string`
- `isSubmitting: boolean`

---

### 4.13 `QuoteMaterialsTable`

**Description**
Tableau éditable des matériaux nécessaires pour le devis. Colonnes : Désignation, Quantité, Prix unitaire, Sous-total, Supprimer. Bouton "+ Ajouter une ligne" en haut à droite. Calcul automatique des sous-totaux.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `lines` | `MaterialLine[]` | ✅ | Lignes actuelles |
| `onAddLine` | `() => void` | ✅ | Ajouter une ligne vide |
| `onUpdateLine` | `(id: string, field: string, value: string \| number) => void` | ✅ | Mise à jour d'une cellule |
| `onRemoveLine` | `(id: string) => void` | ✅ | Supprimer une ligne |

**Type `MaterialLine`**
```ts
type MaterialLine = {
  id: string;
  designation: string;
  quantity: number;
  unitPrice: number;
}
```

**State**
Aucun (contrôlé).

---

### 4.14 `QuoteTotalPreview`

**Description**
Carte sombre (fond noir) affichant l'aperçu du total du devis : ligne Main d'œuvre, ligne Matériaux, Sous-total, ligne TOTAL en grand. Mise à jour en temps réel.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `labourAmount` | `number` | ✅ | Montant main d'œuvre |
| `materialsAmount` | `number` | ✅ | Total matériaux |

**State**
Aucun (valeurs calculées dans le composant parent).

---

### 4.15 `StartMissionPage`

**Description**
Page "Missions en attente" du prestataire. Affiche les détails de la mission confirmée et payée : titre, statut PAYÉE & SÉQUESTRÉE, triplet client/montant/durée, `MapEmbed`, bouton CTA "Démarrer la mission maintenant". Panneau droit : `ClientMiniCard`, `PreDepartChecklist`, `SequestredReminderCard`.

**Props**
Aucune prop (données via `useMissionDetail(missionId)` hook).

**State**
- `missionData: PendingMission | null`
- `checklistItems: ChecklistItem[]`
- `isStarting: boolean`

---

### 4.16 `PreDepartChecklist`

**Description**
Checklist avant départ pour le prestataire. Items cochables (Matériaux préparés, Outils chargés, Adresse confirmée, Téléphone chargé). Items cochés ont fond vert + texte barré.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `items` | `ChecklistItem[]` | ✅ | Items de la checklist |
| `onToggle` | `(itemId: string) => void` | ✅ | Callback de cochage |

**Type `ChecklistItem`**
```ts
type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
}
```

**State**
Aucun (contrôlé).

---

### 4.17 `EarningsHistoryPage`

**Description**
Page historique des gains du prestataire. Orchestre 4 `MetricCard` en haut, puis `MissionsFilteredList` (colonne gauche) avec `TabBar` Tout/Ce mois/Payées, et `MonthlyEarningsChart` (colonne droite). Bouton "Exporter CSV" en haut à droite.

**Props**
Aucune prop (données via `useEarningsHistory` hook).

**State**
- `activeFilter: 'all' | 'this_month' | 'paid'`
- `earningsData: EarningsData | null`

---

### 4.18 `MonthlyEarningsChart`

**Description**
Graphique simple des gains mensuels. Chaque mois = une ligne avec nom du mois, barre de progression horizontale verte et montant aligné à droite. Composant de visualisation sans dépendance à une lib de charting externe.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `months` | `MonthlyEarning[]` | ✅ | Données mensuelles |

**Type `MonthlyEarning`**
```ts
type MonthlyEarning = {
  month: string;
  amount: number;
  maxAmount: number; // pour calculer la largeur relative de la barre
}
```

**State**
Aucun.

---

## 5. Espace ADMIN

> Interfaces : `22` Dashboard, `23` Validation prestataire, `24` Gestion utilisateurs, `25` Litiges, `26` Statistiques, `27` Commissions & Paramètres, `28` Paiements système

---

### 5.1 `AdminShell`

**Description**
Variant de `AppShell` pour l'espace admin. Sidebar foncée (fond noir #1a1a1a), `RoleTag` "ADMIN", navigation : Tableau de bord, Prestataires [badge 3], Clients, Litiges [badge 3], Statistiques, Paramètres.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `children` | `ReactNode` | ✅ | Contenu de la page |
| `activeNavItem` | `string` | ✅ | ID de l'item actif |
| `user` | `AdminUser` | ✅ | Données de l'admin connecté |
| `pendingProvidersCount` | `number` | ❌ | Badge "Prestataires" |
| `openLitigesCount` | `number` | ❌ | Badge "Litiges" |

**State**
Aucun.

---

### 5.2 `AdminDashboardPage`

**Description**
Tableau de bord admin. Orchestre : 4 `MetricCard` (Demandes actives, Missions en cours, CA du mois, Commission perçue), `PendingValidationPanel`, `ActiveLitigesPanel`, `PopularCategoriesPanel` (rangée du milieu), `RecentTransactionsTable` (rangée du bas).

**Props**
Aucune prop (données via `useAdminDashboard` hook).

**State**
- `dashboardData: AdminDashboardData | null`

---

### 5.3 `PendingValidationPanel`

**Description**
Section "Prestataires en attente de validation". Affiche un badge "3 DOSSIERS" et une liste de `ValidationListItem`. Chaque item a des boutons ✓ / × inline.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `pendingProviders` | `PendingProvider[]` | ✅ | Liste des prestataires en attente |
| `onApprove` | `(id: string) => void` | ✅ | Valider un prestataire |
| `onReject` | `(id: string) => void` | ✅ | Refuser un dossier |

**Type `PendingProvider`**
```ts
type PendingProvider = {
  id: string;
  name: string;
  specialty: string;
  submittedAt: string;
  dossierStatus: 'ok' | 'missing_docs';
}
```

**State**
Aucun.

---

### 5.4 `ValidationListItem`

**Description**
Ligne d'un prestataire en attente dans `PendingValidationPanel`. Affiche : avatar+nom+spécialité+date, `StatusBadge` dossier (DOSSIER OK ou DOCS MANQUANTS), boutons ✓ et × avec confirmation.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `provider` | `PendingProvider` | ✅ | Données du prestataire |
| `onApprove` | `() => void` | ✅ | Callback approbation |
| `onReject` | `() => void` | ✅ | Callback refus |

**State**
Aucun.

---

### 5.5 `ActiveLitigesPanel`

**Description**
Section "Litiges en cours" dans le dashboard admin. Liste compacte de litiges avec référence, motif, montant et `StatusBadge`. Composant de lecture seule avec liens de navigation vers le détail.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `litiges` | `LitigeSummary[]` | ✅ | Litiges actifs |
| `onLitigeClick` | `(id: string) => void` | ✅ | Navigation vers le détail |

**Type `LitigeSummary`**
```ts
type LitigeSummary = {
  id: string;
  reference: string;
  motif: string;
  amount: number;
  status: StatusVariant;
}
```

**State**
Aucun.

---

### 5.6 `PopularCategoriesPanel`

**Description**
Panneau "Catégories populaires" avec une liste de catégories + `ProgressBar` horizontale colorée + pourcentage. Utilisé dans le dashboard admin et la page statistiques.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `categories` | `CategoryStat[]` | ✅ | Distribution par catégorie |

**Type `CategoryStat`**
```ts
type CategoryStat = {
  name: string;
  percentage: number;
  color: string;
}
```

**State**
Aucun.

---

### 5.7 `RecentTransactionsTable`

**Description**
Tableau des dernières transactions de la plateforme. Colonnes : ID, Client, Prestataire, Service, Montant, Commission (en vert), Statut (`StatusBadge`). Lien "Tout voir →" en haut à droite.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `transactions` | `Transaction[]` | ✅ | Données des transactions |
| `onViewAll` | `() => void` | ✅ | Lien "Tout voir" |

**Type `Transaction`**
```ts
type Transaction = {
  id: string;
  clientName: string;
  providerName: string;
  service: string;
  amount: number;
  commission: number;
  status: StatusVariant;
}
```

**State**
Aucun.

---

### 5.8 `ProviderValidationPage`

**Description**
Page de détail d'un dossier prestataire à valider. Orchestre : `ProviderInfoTable`, `DocumentValidationList`, `ProviderValidationActions` (colonne droite avec avatar + boutons + alerte manque document).

**Props**
Aucune prop (données via `useProviderValidation(providerId)` hook).

**State**
- `providerData: ProviderDossier | null`
- `isApproving: boolean`
- `isRejecting: boolean`

---

### 5.9 `ProviderInfoTable`

**Description**
Tableau de données personnelles du prestataire en lecture seule. Lignes label/valeur pour Nom, Téléphone, Email, Spécialité, Tarif horaire, Zone, Date d'inscription.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `data` | `ProviderInfo` | ✅ | Données personnelles |

**State**
Aucun.

---

### 5.10 `DocumentValidationList`

**Description**
Liste des justificatifs fournis par le prestataire avec leur statut de validation. Chaque item : nom du document, sous-titre (numéro/date), `StatusBadge` VALIDE/MANQUANT/EN COURS DE VÉRIF.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `documents` | `ValidationDocument[]` | ✅ | Documents à valider |

**Type `ValidationDocument`**
```ts
type ValidationDocument = {
  id: string;
  label: string;
  subtitle: string;
  status: 'valid' | 'missing' | 'verifying';
}
```

**State**
Aucun.

---

### 5.11 `ProviderValidationActions`

**Description**
Panel droit de la page validation prestataire. Contient : `UserAvatarCircle` (grand, avec note et label "Nouveau prestataire"), bouton "Valider le prestataire" (vert plein), bouton "Refuser le dossier" (rouge contour), `AlertBanner warning` "Document manquant" avec bouton "Envoyer un rappel SMS".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `provider` | `{ id: string; initial: string }` | ✅ | Identification du prestataire |
| `missingDocLabel` | `string \| null` | ❌ | Libellé du document manquant |
| `onApprove` | `() => void` | ✅ | Valider |
| `onReject` | `() => void` | ✅ | Refuser |
| `onSendReminder` | `() => void` | ✅ | Envoyer rappel SMS |
| `isLoading` | `boolean` | ❌ | Désactive les boutons |

**State**
Aucun.

---

### 5.12 `UserManagementPage`

**Description**
Page de gestion des utilisateurs (Clients & Prestataires). Orchestre un `SearchInput`, un `TabBar` (Tous / Clients / Prestataires / Suspendus), et un `DataTable` de `UserTableRow`.

**Props**
Aucune prop (données via `useUserManagement` hook).

**State**
- `search: string`
- `activeTab: string`
- `users: User[]`
- `isLoading: boolean`

---

### 5.13 `UserTableRow`

**Description**
Ligne de la table de gestion des utilisateurs. Colonnes : Avatar+nom+email, `StatusBadge` rôle, téléphone, nombre de missions, `StarRating`, `StatusBadge` statut (ACTIF/SUSPENDU), boutons "Voir" et "Susp." ou "Réactiver".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `user` | `ManagedUser` | ✅ | Données de l'utilisateur |
| `onView` | `(id: string) => void` | ✅ | Voir le détail |
| `onSuspend` | `(id: string) => void` | ✅ | Suspendre |
| `onReactivate` | `(id: string) => void` | ✅ | Réactiver |

**Type `ManagedUser`**
```ts
type ManagedUser = {
  id: string;
  name: string;
  email: string;
  avatarInitial: string;
  role: 'client' | 'provider';
  phone: string;
  missionsCount: number;
  rating: number;
  status: 'active' | 'suspended';
}
```

**State**
Aucun.

---

### 5.14 `LitigesManagementPage`

**Description**
Page de gestion des litiges admin. 4 `MetricCard` (Ouverts, En traitement, Résolus ce mois, Montants bloqués), puis `DataTable` des litiges avec colonnes Réf., Date, Client, Prestataire, Motif, Montant, Statut, Agent, Actions. Bouton "Exporter".

**Props**
Aucune prop (données via `useLitigesManagement` hook).

**State**
- `litiges: AdminLitige[]`
- `isLoading: boolean`

---

### 5.15 `LitigeTableRow`

**Description**
Ligne de la table des litiges admin. Affiche la référence, date, noms client/prestataire, motif, montant, `StatusBadge`, agent assigné et bouton "Assigner →".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `litige` | `AdminLitige` | ✅ | Données du litige |
| `onAssign` | `(id: string) => void` | ✅ | Assigner à un agent |

**Type `AdminLitige`**
```ts
type AdminLitige = {
  id: string;
  reference: string;
  date: string;
  clientName: string;
  providerName: string;
  motif: string;
  amount: number;
  status: StatusVariant;
  agentName: string | null;
}
```

**State**
Aucun.

---

### 5.16 `StatisticsPage`

**Description**
Page de statistiques & reporting. Orchestre : 4 `MetricCard`, `MissionsLineChart`, `PopularCategoriesPanel` (rangée du haut), et 3 `MetricCard` secondaires (Prestataires actifs, Taux de litige, Délai moyen résolution). Boutons "Exporter PDF" et "Exporter CSV".

**Props**
Aucune prop (données via `useStatistics` hook).

**State**
- `statsData: StatsData | null`
- `period: string`

---

### 5.17 `MissionsLineChart`

**Description**
Graphique linéaire de l'évolution des missions sur le mois courant. Axe X : jours du mois, axe Y : nombre de missions. Utilise une implémentation SVG légère ou Recharts selon les dépendances du projet.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `data` | `ChartDataPoint[]` | ✅ | Points de données |
| `period` | `string` | ✅ | Label de la période affichée en titre |

**Type `ChartDataPoint`**
```ts
type ChartDataPoint = {
  day: number;
  value: number;
}
```

**State**
Aucun.

---

### 5.18 `CommissionsPage`

**Description**
Page Commissions & Paramètres. Orchestre : `CommissionRatesEditor` (taux par catégorie), `SequestredParamsEditor` (délai libération, délai clôture litige), `CommissionRevenuePanel` (revenus par catégorie), `MobileMoneyDistribution` (parts Orange Money / MTN).

**Props**
Aucune prop (données via `useCommissionsParams` hook).

**State**
- `rates: CommissionRate[]`
- `escrowReleaseHours: number`
- `disputeClosureDays: number`
- `isSaving: boolean`

---

### 5.19 `CommissionRatesEditor`

**Description**
Section d'édition des taux de commission par catégorie. Chaque ligne : icône + nom catégorie + input numérique + label "%". Bouton "Sauvegarder les taux" en bas.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `rates` | `CommissionRate[]` | ✅ | Taux par catégorie |
| `onChange` | `(categoryId: string, rate: number) => void` | ✅ | Callback modification |
| `onSave` | `() => void` | ✅ | Sauvegarde |
| `isSaving` | `boolean` | ❌ | État de sauvegarde |

**Type `CommissionRate`**
```ts
type CommissionRate = {
  categoryId: string;
  categoryLabel: string;
  categoryIcon: ReactNode;
  rate: number;
}
```

**State**
Aucun (contrôlé).

---

### 5.20 `CommissionRevenuePanel`

**Description**
Panneau droit des commissions. Liste les revenus de commission par catégorie (label + montant coloré en vert) + ligne TOTAL en gras.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `revenues` | `{ category: string; amount: number }[]` | ✅ | Revenus par catégorie |
| `period` | `string` | ✅ | Libellé de la période |

**State**
Aucun.

---

### 5.21 `MobileMoneyDistribution`

**Description**
Section sous `CommissionRevenuePanel`. Affiche la répartition des opérateurs Mobile Money (Orange Money, MTN Momo) avec une `ProgressBar` colorée et pourcentage pour chaque opérateur.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `distribution` | `{ operator: string; percentage: number; color: string }[]` | ✅ | Distribution par opérateur |

**State**
Aucun.

---

## 6. Espace SERVICE CLIENT

> Interfaces : `29` Traitement d'un litige

---

### 6.1 `ServiceClientShell`

**Description**
Variant de `AppShell` pour l'espace Service Client. Sidebar minimaliste avec `RoleTag` "SERVICE CLIENT" violet, navigation : Mes litiges [badge count], Historique.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `children` | `ReactNode` | ✅ | Contenu de la page |
| `activeNavItem` | `string` | ✅ | Item actif |
| `user` | `AgentUser` | ✅ | Données de l'agent |
| `openLitigesCount` | `number` | ❌ | Badge "Mes litiges" |

**State**
Aucun.

---

### 6.2 `LitigeDetailPage`

**Description**
Page de traitement d'un litige par l'agent Service Client. Mise en page 3 colonnes : `LitigeDetailsPanel` (gauche), `MediationChatPanel` (centre), `ResolutionPanel` (droite).

**Props**
Aucune prop (données via `useLitigeDetail(litigeId)` hook).

**State**
- `litigeData: LitigeFullData | null`
- `activeParty: 'client' | 'provider'` — onglet actif dans le chat de médiation
- `selectedResolution: string | null`
- `refundAmount: number | string`
- `isSubmitting: boolean`

---

### 6.3 `LitigeDetailsPanel`

**Description**
Panneau gauche du traitement de litige. Affiche : `StatusBadge` motif (PRESTATION INCOMPLÈTE), description du client en bloc citation, pièces jointes (`FileAttachment`), tableau récapitulatif du devis original (Main d'œuvre, Matériaux, Total payé).

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `litige` | `LitigeFullData` | ✅ | Toutes les données du litige |

**Type `LitigeFullData`**
```ts
type LitigeFullData = {
  id: string;
  reference: string;
  motif: string;
  clientDescription: string;
  attachments: { id: string; name: string; url: string }[];
  originalQuote: {
    labour: number;
    materials: number;
    total: number;
  };
  status: StatusVariant;
}
```

**State**
Aucun.

---

### 6.4 `MediationChatPanel`

**Description**
Panneau central de médiation. Contient un `TabBar` à 2 onglets (Client / Prestataire) permettant à l'agent de changer de conversation. Chaque onglet affiche un `MessageThread` + `ChatInputBar` pour envoyer des messages à la partie sélectionnée.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `clientMessages` | `Message[]` | ✅ | Messages avec le client |
| `providerMessages` | `Message[]` | ✅ | Messages avec le prestataire |
| `activeParty` | `'client' \| 'provider'` | ✅ | Onglet actif |
| `onPartyChange` | `(party: 'client' \| 'provider') => void` | ✅ | Callback changement d'onglet |
| `onSend` | `(message: string) => void` | ✅ | Envoi du message |
| `agentId` | `string` | ✅ | ID de l'agent (pour `MessageThread`) |

**State**
- `inputValue: string` — texte saisi

---

### 6.5 `ResolutionPanel`

**Description**
Panneau droit de résolution du litige. Contient : `PartiesConcerneesPanel`, `ResolutionOptionSelector` (Remboursement partiel / Annulation complète / Dédommagement avoir), `FormField` pour montant remboursé, boutons "Soumettre la résolution →" et "Clôturer le litige".

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `parties` | `{ client: PartySummary; provider: PartySummary }` | ✅ | Parties concernées |
| `selectedResolution` | `string \| null` | ✅ | Option sélectionnée |
| `refundAmount` | `string` | ✅ | Montant saisi |
| `onResolutionChange` | `(option: string) => void` | ✅ | Callback sélection |
| `onRefundAmountChange` | `(amount: string) => void` | ✅ | Callback montant |
| `onSubmit` | `() => void` | ✅ | Soumettre la résolution |
| `onClose` | `() => void` | ✅ | Clôturer sans résolution |
| `isSubmitting` | `boolean` | ❌ | État de chargement |

**State**
Aucun (contrôlé par `LitigeDetailPage`).

---

### 6.6 `PartiesConcerneesPanel`

**Description**
Bloc affichant les deux parties d'un litige (Client + Prestataire) avec leur avatar, nom, `StarRating`. Section "PARTIES CONCERNÉES" en titre uppercase.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `client` | `PartySummary` | ✅ | Données du client |
| `provider` | `PartySummary` | ✅ | Données du prestataire |

**Type `PartySummary`**
```ts
type PartySummary = {
  id: string;
  name: string;
  avatarInitial: string;
  rating: number;
  role: 'client' | 'provider';
}
```

**State**
Aucun.

---

### 6.7 `ResolutionOptionSelector`

**Description**
Liste de 3 options de résolution sélectionnables (Remboursement partiel, Annulation complète, Dédommagement / avoir). Option active : bordure noire. Pattern identique à `LitigeMotifSelector`.

**Props**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `options` | `ResolutionOption[]` | ✅ | Options disponibles |
| `selectedId` | `string \| null` | ✅ | Option sélectionnée |
| `onChange` | `(id: string) => void` | ✅ | Callback |

**Type `ResolutionOption`**
```ts
type ResolutionOption = {
  id: string;
  label: string;
}
```

**State**
Aucun.

---

## 7. Arbre de composition global

```
src/
├── components/
│   ├── common/                         # § 1 — Composants partagés
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── RoleTag.tsx
│   │   ├── UserAvatarFooter.tsx
│   │   ├── UserAvatarCircle.tsx
│   │   ├── MetricCard.tsx
│   │   ├── SectionCard.tsx
│   │   ├── FormField.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── SecondaryButton.tsx
│   │   ├── AlertBanner.tsx
│   │   ├── StarRating.tsx
│   │   ├── TabBar.tsx
│   │   ├── DataTable.tsx
│   │   ├── MapEmbed.tsx
│   │   ├── PhotoUploader.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ServiceCategoryCard.tsx
│   │   ├── SearchInput.tsx
│   │   ├── FileAttachment.tsx
│   │   ├── AmountDisplay.tsx
│   │   ├── EmptyState.tsx
│   │   └── SkeletonLoader.tsx
│   │
│   ├── auth/                           # § 2 — Auth
│   │   ├── AuthSplitLayout.tsx
│   │   ├── BrandingPanel.tsx
│   │   ├── RegistrationForm.tsx
│   │   ├── RoleSwitcher.tsx
│   │   ├── LoginForm.tsx
│   │   ├── AdminLoginPage.tsx
│   │   ├── ServiceClientLoginPage.tsx
│   │   ├── OTPVerificationCard.tsx
│   │   └── OTPDigitInput.tsx
│   │
│   ├── client/                         # § 3 — Espace Client
│   │   ├── ClientShell.tsx
│   │   ├── dashboard/
│   │   │   ├── ClientDashboardPage.tsx
│   │   │   ├── WelcomeBanner.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── RecentDemandsList.tsx
│   │   │   ├── DemandListItem.tsx
│   │   │   └── FinancialSummaryPanel.tsx
│   │   ├── demand/
│   │   │   ├── NewDemandePage.tsx
│   │   │   ├── StepIndicator.tsx
│   │   │   ├── CategorySelector.tsx
│   │   │   ├── DemandDescriptionField.tsx
│   │   │   ├── LocationSidePanel.tsx
│   │   │   └── RecapSidePanel.tsx
│   │   ├── chat/
│   │   │   ├── ChatPage.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── MessageThread.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── ChatInputBar.tsx
│   │   │   ├── MissionSidePanel.tsx
│   │   │   └── ProviderMiniCard.tsx
│   │   ├── quote/
│   │   │   ├── QuoteDetailPage.tsx
│   │   │   ├── QuoteTable.tsx
│   │   │   ├── PaymentMethodSelector.tsx
│   │   │   └── SecurePaymentInfo.tsx
│   │   ├── mission/
│   │   │   ├── MissionTrackingPage.tsx
│   │   │   ├── MissionProgressHeader.tsx
│   │   │   ├── MissionStepList.tsx
│   │   │   ├── SequestredAmountCard.tsx
│   │   │   └── LitigeAlertPanel.tsx
│   │   ├── rating/
│   │   │   ├── RatingPage.tsx
│   │   │   ├── MissionCompletedBanner.tsx
│   │   │   └── RatingCriteriaGroup.tsx
│   │   ├── litige/
│   │   │   ├── LitigePage.tsx
│   │   │   └── LitigeMotifSelector.tsx
│   │   └── urgency/
│   │       ├── UrgencyPage.tsx
│   │       ├── UrgencyBanner.tsx          # "use client" — animation timer
│   │       ├── CountdownTimer.tsx          # "use client" — micro-composant isolé
│   │       └── NearbyProviderCard.tsx
│   │
│   ├── provider/                       # § 4 — Espace Prestataire
│   │   ├── ProviderShell.tsx
│   │   ├── AvailabilityToggle.tsx
│   │   ├── dashboard/
│   │   │   ├── ProviderDashboardPage.tsx
│   │   │   ├── RecentMissionsList.tsx
│   │   │   ├── AvailabilitySchedule.tsx
│   │   │   └── MonthlyEarningsCard.tsx
│   │   ├── profile/
│   │   │   ├── ProviderProfilePage.tsx
│   │   │   ├── SkillTagInput.tsx
│   │   │   └── DocumentChecklist.tsx
│   │   ├── demands/
│   │   │   ├── AvailableDemandsPage.tsx
│   │   │   └── DemandCard.tsx
│   │   ├── quote/
│   │   │   ├── CreateQuotePage.tsx
│   │   │   ├── QuoteMaterialsTable.tsx
│   │   │   └── QuoteTotalPreview.tsx
│   │   ├── mission/
│   │   │   ├── StartMissionPage.tsx
│   │   │   └── PreDepartChecklist.tsx
│   │   └── earnings/
│   │       ├── EarningsHistoryPage.tsx
│   │       └── MonthlyEarningsChart.tsx
│   │
│   ├── admin/                          # § 5 — Espace Admin
│   │   ├── AdminShell.tsx
│   │   ├── dashboard/
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   ├── PendingValidationPanel.tsx
│   │   │   ├── ValidationListItem.tsx
│   │   │   ├── ActiveLitigesPanel.tsx
│   │   │   ├── PopularCategoriesPanel.tsx
│   │   │   └── RecentTransactionsTable.tsx
│   │   ├── providers/
│   │   │   ├── ProviderValidationPage.tsx
│   │   │   ├── ProviderInfoTable.tsx
│   │   │   ├── DocumentValidationList.tsx
│   │   │   └── ProviderValidationActions.tsx
│   │   ├── users/
│   │   │   ├── UserManagementPage.tsx
│   │   │   └── UserTableRow.tsx
│   │   ├── litiges/
│   │   │   ├── LitigesManagementPage.tsx
│   │   │   └── LitigeTableRow.tsx
│   │   ├── stats/
│   │   │   ├── StatisticsPage.tsx
│   │   │   └── MissionsLineChart.tsx
│   │   └── commissions/
│   │       ├── CommissionsPage.tsx
│   │       ├── CommissionRatesEditor.tsx
│   │       ├── CommissionRevenuePanel.tsx
│   │       └── MobileMoneyDistribution.tsx
│   │
│   └── service-client/                 # § 6 — Espace Service Client
│       ├── ServiceClientShell.tsx
│       └── litige/
│           ├── LitigeDetailPage.tsx
│           ├── LitigeDetailsPanel.tsx
│           ├── MediationChatPanel.tsx
│           ├── ResolutionPanel.tsx
│           ├── PartiesConcerneesPanel.tsx
│           └── ResolutionOptionSelector.tsx
│
└── types/
    ├── common.ts        # StatusVariant, ServiceCategory, Message, etc.
    ├── client.ts        # ClientDemand, DemandDraft, etc.
    ├── provider.ts      # AvailableDemand, CompletedMission, etc.
    ├── admin.ts         # AdminLitige, Transaction, ManagedUser, etc.
    └── auth.ts          # RegistrationData, LoginData, etc.
```

---

## Récapitulatif des totaux

| Espace | Composants de page | Composants UI |
|--------|-------------------|---------------|
| **Common** | — | 25 |
| **Auth** | 2 pages + 2 cards | 7 |
| **Client** | 9 pages | 33 |
| **Prestataire** | 7 pages | 18 |
| **Admin** | 6 pages | 20 |
| **Service Client** | 1 page | 6 |
| **TOTAL** | **25 pages** | **109 composants** |

---

> **Note d'architecture**
> Les composants `LitigeMotifSelector` (Client) et `ResolutionOptionSelector` (Service Client) partagent la même logique de sélection. Ils peuvent être refactorisés en un composant générique `SingleSelectList` dans `common/` avec des props `options: { id, label, description? }[]`. La même logique s'applique à `CategorySelector` et `CategoryGrid` qui peuvent être unifiés via un prop `selectable: boolean`.
