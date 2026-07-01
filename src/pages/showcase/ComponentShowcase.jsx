// src/pages/showcase/ComponentShowcase.jsx
// Route: /showcase  —  à n'activer qu'en DEV
// Dans App.jsx / router : {import.meta.env.DEV && <Route path="/showcase" element={<ComponentShowcase />} />}

import { useState } from "react";

import {
  // Layout
  PageHeader,
  // Identité
  RoleTag, UserAvatarFooter, Avatar,
  // Boutons
  Button,
  // Formulaires
  Input, SearchInput,
  // Contenu
  Card, Modal, TabBar, DataTable, ServiceCategoryCard,
  // Données
  StatCard, AmountDisplay, PriceDisplay, ProgressBar, RatingStars,
  // Badges
  Badge, StatusBadge,
  // Feedback
  Spinner, AlertBanner, EmptyState, SkeletonLoader,
} from "../../components/commons";

/* ─────────────────────────────────────────────────────────────
   HELPERS SHOWCASE (internes — n'utilisent pas les tokens Tailwind)
   ───────────────────────────────────────────────────────────── */
function Section({ title, subtitle, children }) {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-[14px] font-bold text-sl-900 mb-1">{title}</h2>
        {subtitle && <p className="text-[12px] text-sl-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Row({ children, gap = "gap-3", wrap = true }) {
  return <div className={`flex ${wrap ? "flex-wrap" : ""} ${gap} items-center`}>{children}</div>;
}

function Chip({ label }) {
  return (
    <span className="text-[10px] font-bold text-sl-400 tracking-[0.06em] uppercase bg-sl-100 px-2 py-[3px] rounded">
      {label}
    </span>
  );
}

function PreviewBox({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-[var(--radius-md)] border border-sl-200 p-5 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-sl-100 my-2" />;
}

/* ─────────────────────────────────────────────────────────────
   DONNÉES D'EXEMPLE
   ───────────────────────────────────────────────────────────── */
const SAMPLE_USERS = [
  { id: 1, name: "Jean Mbarga",   role: "CLIENT",       status: "actif",         amount: 45000,  rating: 4 },
  { id: 2, name: "Fatima Nkolo",  role: "PRESTATAIRE",  status: "disponible",    amount: 120000, rating: 5 },
  { id: 3, name: "Paul Tchinda",  role: "PRESTATAIRE",  status: "indisponible",  amount: 89000,  rating: 3 },
  { id: 4, name: "Alice Fotso",   role: "CLIENT",       status: "suspendu",      amount: 12000,  rating: 2 },
];

const CATEGORIES = [
  { id: "plomb",    label: "Plomberie",   icon: "🔧", color: "#DBEAFE" },
  { id: "elec",     label: "Électricité", icon: "⚡", color: "#FEF3C7" },
  { id: "menage",   label: "Ménage",      icon: "🧹", color: "#D8F3DC" },
  { id: "jardinage",label: "Jardinage",   icon: "🌿", color: "#DCFCE7" },
  { id: "peinture", label: "Peinture",    icon: "🎨", color: "#FDE8D8" },
  { id: "securite", label: "Sécurité",    icon: "🔒", color: "#E9D5FF" },
];

const ALL_STATUSES = [
  "en_cours","terminee","annulee","en_attente","ouvert","traitement","resolu",
  "disponible","indisponible","urgent","sequestre","libere","litige",
  "dossier_ok","manquant","actif","suspendu","paye_sequestre",
];

const NAV_TABS = [
  { id: "foundations", label: "Foundations"  },
  { id: "forms",       label: "Formulaires"  },
  { id: "feedback",    label: "Feedback"     },
  { id: "data",        label: "Données"      },
  { id: "domain",      label: "Domaine"      },
  { id: "overlays",    label: "Overlays"     },
];

/* ─────────────────────────────────────────────────────────────
   PAGE PRINCIPALE
   ───────────────────────────────────────────────────────────── */
export default function ComponentShowcase() {
  const [activeTab,       setActiveTab]       = useState("foundations");
  const [modalOpen,       setModalOpen]       = useState(false);
  const [ratingVal,       setRatingVal]       = useState(3);
  const [searchVal,       setSearchVal]       = useState("");
  const [inputVal,        setInputVal]        = useState("");
  const [emailVal,        setEmailVal]        = useState("");
  const [selectedCat,     setSelectedCat]     = useState("plomb");
  const [progress,        setProgress]        = useState(65);
  const [tableLoading,    setTableLoading]    = useState(false);
  const [tableEmpty,      setTableEmpty]      = useState(false);
  const [alertVisible,    setAlertVisible]    = useState({ info:true, success:true, warning:true, danger:true });

  const toggleAlert = (type) => setAlertVisible((p) => ({ ...p, [type]: !p[type] }));

  const simulateLoading = () => {
    setTableLoading(true);
    setTimeout(() => setTableLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-sl-50 font-[family-name:var(--font-body)]">

      {/* ── Modal globale ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Exemple de Modal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={() => setModalOpen(false)}>Confirmer</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <AlertBanner type="info" message="Cliquez en dehors ou sur × pour fermer cette modal." />
          <Input
            label="Commentaire"
            type="textarea"
            placeholder="Entrez votre texte…"
            value={inputVal}
            onChange={setInputVal}
          />
        </div>
      </Modal>

      {/* ── Header ── */}
      <div className="bg-brand px-8 py-6 flex items-center justify-between shadow-[var(--shadow-md)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[22px] font-extrabold text-white tracking-[-0.02em]">
            🏗 Composant Showcase
          </h1>
          <p className="text-[12px] text-white/60 mt-1">
            MBOA SERVICES · Design System · {ALL_STATUSES.length + 18} composants
          </p>
        </div>
        <div className="flex gap-2">
          <Badge label="v1.0" variant="default" />
          <Badge label="Tailwind v4" variant="brand" />
          <Badge label="DEV ONLY" variant="warning" withDot />
        </div>
      </div>

      {/* ── Nav tabs ── */}
      <div className="bg-white border-b border-sl-200 px-8 flex items-center overflow-x-auto">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-5 py-[14px] text-[13px] font-semibold whitespace-nowrap
              border-b-[2.5px] transition-colors duration-150 bg-transparent
              font-[family-name:var(--font-body)] cursor-pointer
              ${activeTab === tab.id
                ? "border-brand text-brand"
                : "border-transparent text-sl-500 hover:text-sl-700"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1200px] mx-auto px-8 py-8 pb-20">

        {/* ══════════════════════════════════════════════
            FOUNDATIONS
        ══════════════════════════════════════════════ */}
        {activeTab === "foundations" && (
          <>
            <Section title="Button" subtitle="4 variants × 3 tailles + état désactivé">
              <PreviewBox>
                <div className="flex flex-col gap-5">
                  {(["primary", "secondary", "ghost", "danger"] ).map((v) => (
                    <div key={v} className="flex items-center gap-3 flex-wrap">
                      <Chip label={v} />
                      <Button variant={v} size="sm">Petit</Button>
                      <Button variant={v} size="md">Moyen</Button>
                      <Button variant={v} size="lg">Grand</Button>
                      <Button variant={v} disabled>Désactivé</Button>
                    </div>
                  ))}
                </div>
              </PreviewBox>
            </Section>

            <Section title="Badge" subtitle="7 variants, tailles sm/md, dot pulsant">
              <PreviewBox>
                <div className="flex flex-col gap-4">
                  <Row>
                    {(["default","success","warning","danger","info","accent","brand"]).map((v) => (
                      <Badge key={v} label={v} variant={v} />
                    ))}
                  </Row>
                  <Divider />
                  <Row>
                    {(["success","danger","info"]).map((v) => (
                      <Badge key={v} label={`${v} + dot`} variant={v} withDot />
                    ))}
                    <Badge label="sm size" variant="brand" size="sm" />
                    <Badge label="sm + dot" variant="warning" size="sm" withDot />
                  </Row>
                </div>
              </PreviewBox>
            </Section>

            <Section title="Avatar" subtitle="4 tailles, couleurs via bgClass Tailwind">
              <PreviewBox>
                <Row gap="gap-8">
                  {[
                    { size: "sm", bg: "bg-brand",   initial: "J", name: "Jean" },
                    { size: "md", bg: "bg-accent",  initial: "F", name: "Fatima" },
                    { size: "lg", bg: "bg-info",    initial: "P", name: "Paul" },
                    { size: "xl", bg: "bg-danger",  initial: "A", name: "Alice" },
                  ].map(({ size, bg, initial, name }) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <Avatar initial={initial} name={name} size={size} bgClass={bg} />
                      <Chip label={size} />
                    </div>
                  ))}
                </Row>
              </PreviewBox>
            </Section>

            <Section title="Spinner" subtitle="3 tailles">
              <PreviewBox>
                <Row gap="gap-10">
                  {(["sm", "md", "lg"]).map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <Spinner size={s} />
                      <Chip label={s} />
                    </div>
                  ))}
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="lg" colorClass="border-t-accent" />
                    <Chip label="accent" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="lg" colorClass="border-t-danger" />
                    <Chip label="danger" />
                  </div>
                </Row>
              </PreviewBox>
            </Section>

            <Section title="TabBar" subtitle="Navigation avec et sans compteurs">
              <PreviewBox>
                <div className="flex flex-col gap-5">
                  <TabBar
                    tabs={[
                      { id: "all",       label: "Tout",      count: 24 },
                      { id: "active",    label: "Actifs",    count: 12 },
                      { id: "done",      label: "Terminés",  count: 8  },
                      { id: "cancelled", label: "Annulés",   count: 4  },
                    ]}
                    activeId="all"
                    onChange={() => {}}
                  />
                  <TabBar
                    tabs={[
                      { id: "a", label: "Aperçu"     },
                      { id: "b", label: "Détails"    },
                      { id: "c", label: "Historique" },
                    ]}
                    activeId="b"
                    onChange={() => {}}
                  />
                </div>
              </PreviewBox>
            </Section>
          </>
        )}

        {/* ══════════════════════════════════════════════
            FORMULAIRES
        ══════════════════════════════════════════════ */}
        {activeTab === "forms" && (
          <>
            <Section title="Input" subtitle="Tous les types et états">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <Card title="États de base">
                  <div className="flex flex-col gap-4">
                    <Input label="Texte" placeholder="Entrez du texte…" value={inputVal} onChange={setInputVal} />
                    <Input label="Email" type="email" placeholder="email@exemple.com" value={emailVal} onChange={setEmailVal} helperText="Jamais partagé" />
                    <Input label="Obligatoire" placeholder="Requis" required value="" onChange={() => {}} />
                  </div>
                </Card>
                <Card title="États spéciaux">
                  <div className="flex flex-col gap-4">
                    <Input label="Avec erreur" value="valeur invalide" onChange={() => {}} error="Ce champ est incorrect" />
                    <Input label="Désactivé" value="Lecture seule" disabled onChange={() => {}} />
                    <Input label="Mot de passe" type="password" placeholder="••••••••" value="" onChange={() => {}} />
                  </div>
                </Card>
                <Card title="Textarea">
                  <Input
                    label="Description"
                    type="textarea"
                    placeholder="Décrivez votre demande…"
                    value={inputVal}
                    onChange={setInputVal}
                    helperText={`${inputVal.length} / 500 caractères`}
                  />
                </Card>
              </div>
            </Section>

            <Section title="SearchInput" subtitle="Avec reset intégré">
              <PreviewBox>
                <div className="max-w-md">
                  <SearchInput
                    value={searchVal}
                    onChange={setSearchVal}
                    onClear={() => setSearchVal("")}
                    placeholder="Rechercher un prestataire…"
                  />
                  {searchVal && (
                    <p className="mt-3 text-[13px] text-sl-500">
                      Recherche : « <strong>{searchVal}</strong> »
                    </p>
                  )}
                </div>
              </PreviewBox>
            </Section>
          </>
        )}

        {/* ══════════════════════════════════════════════
            FEEDBACK
        ══════════════════════════════════════════════ */}
        {activeTab === "feedback" && (
          <>
            <Section title="AlertBanner" subtitle="4 types, fermables et réaffichables">
              <div className="flex flex-col gap-3">
                {[
                  { type: "info",    title: "Information", message: "Votre demande a été transmise et sera traitée sous 24h." },
                  { type: "success", title: "Succès !",    message: "Le paiement de 45 000 XAF a bien été effectué." },
                  { type: "warning", title: "Attention",   message: "Votre session expire dans 5 minutes. Sauvegardez vos données." },
                  { type: "danger",  title: "Erreur",      message: "Impossible de joindre le prestataire. Réessayez plus tard." },
                ].map(({ type, title, message }) =>
                  alertVisible[type] ? (
                    <AlertBanner
                      key={type} type={type} title={title} message={message}
                      onClose={() => toggleAlert(type)}
                    />
                  ) : (
                    <div key={type} className="flex items-center gap-3">
                      <Chip label={`${type} (fermé)`} />
                      <Button size="sm" variant="ghost" onClick={() => toggleAlert(type)}>
                        Réafficher
                      </Button>
                    </div>
                  )
                )}
              </div>
            </Section>

            <Section title="EmptyState" subtitle="Différentes illustrations métier">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <EmptyState icon="📭" title="Aucune demande" subtitle="Vous n'avez pas encore créé de demande."
                    action={<Button size="sm">Nouvelle demande</Button>} />
                </Card>
                <Card>
                  <EmptyState icon="🔍" title="Aucun résultat" subtitle="Aucun prestataire ne correspond à votre recherche." />
                </Card>
                <Card>
                  <EmptyState icon="💰" title="Aucune transaction" subtitle="Votre historique de paiement est vide."
                    action={<Button size="sm" variant="ghost">Voir les tarifs</Button>} />
                </Card>
              </div>
            </Section>

            <Section title="ProgressBar" subtitle="Interactif — boutons +/−10%">
              <PreviewBox>
                <div className="flex flex-col gap-5">
                  <ProgressBar label="Complétion du profil" value={progress} />
                  <ProgressBar label="Dossier soumis" value={100} />
                  <ProgressBar label="Documents vérifiés (sans %)" value={30} showPercent={false} />
                  <ProgressBar value={75} />
                  <div className="flex gap-2 items-center mt-1">
                    <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.max(0, p - 10))}>−10%</Button>
                    <Button size="sm" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10%</Button>
                    <span className="text-[13px] text-sl-500 ml-1">Valeur : {progress}%</span>
                  </div>
                </div>
              </PreviewBox>
            </Section>

            <Section title="SkeletonLoader" subtitle="4 variants : card | row | metric | text">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {(["card", "row", "metric", "text"]).map((v) => (
                  <Card key={v} title={v}>
                    <SkeletonLoader variant={v} count={v === "row" ? 3 : 1} />
                  </Card>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ══════════════════════════════════════════════
            DONNÉES
        ══════════════════════════════════════════════ */}
        {activeTab === "data" && (
          <>
            <Section title="StatCard" subtitle="Métriques avec tendances haut/bas/neutre">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Demandes totales" value="1 247" trend={{ direction: "up",      value: "+12.4%" }} trendSubtext="vs mois dernier" />
                <StatCard label="Prestataires actifs" value="348" trend={{ direction: "up",     value: "+5"     }} trendSubtext="cette semaine"  accentColorClass="bg-success" />
                <StatCard label="Revenus (XAF)" value="4,2M"      trend={{ direction: "down",   value: "−3.1%"  }} trendSubtext="vs dernier mois" accentColorClass="bg-danger" />
                <StatCard label="Note moyenne" value="4.7 ★"      trend={{ direction: "neutral", value: "stable" }}                               accentColorClass="bg-accent" />
              </div>
            </Section>

            <Section title="DataTable" subtitle="Cliquer une ligne déclenche onRowClick — boutons de simulation">
              <Card noPadding>
                <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-sl-100">
                  <span className="font-[family-name:var(--font-display)] text-[11px] font-bold tracking-[0.1em] uppercase text-sl-500">
                    Utilisateurs
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant={tableLoading ? "primary" : "ghost"} onClick={simulateLoading}>
                      {tableLoading ? <><Spinner size="sm" colorClass="border-t-white" /> Chargement…</> : "Simuler chargement"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setTableEmpty((p) => !p)}>
                      {tableEmpty ? "Afficher données" : "Vider table"}
                    </Button>
                  </div>
                </div>
                <DataTable
                  isLoading={tableLoading}
                  data={tableEmpty ? [] : SAMPLE_USERS}
                  keyExtractor={(r) => r.id}
                  onRowClick={(r) => alert(`Clic sur : ${r.name}`)}
                  columns={[
                    {
                      key: "name", header: "Nom",
                      render: (r) => (
                        <div className="flex items-center gap-2">
                          <Avatar initial={r.name[0]} size="sm" bgClass={r.role === "CLIENT" ? "bg-brand" : "bg-accent"} />
                          <span className="font-medium">{r.name}</span>
                        </div>
                      ),
                    },
                    { key: "role",   header: "Rôle",   render: (r) => <RoleTag role={r.role} /> },
                    { key: "status", header: "Statut", render: (r) => <StatusBadge variant={r.status} withDot /> },
                    { key: "rating", header: "Note",   render: (r) => <RatingStars value={r.rating} size="sm" /> },
                    { key: "amount", header: "Montant",render: (r) => <AmountDisplay amount={r.amount} /> },
                  ]}
                />
              </Card>
            </Section>
          </>
        )}

        {/* ══════════════════════════════════════════════
            DOMAINE
        ══════════════════════════════════════════════ */}
        {activeTab === "domain" && (
          <>
            <Section title="StatusBadge" subtitle="17 variants métier ServiLoc">
              <PreviewBox>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map((v) => (
                    <StatusBadge key={v} variant={v} withDot={["en_cours", "traitement", "urgent"].includes(v)} />
                  ))}
                </div>
              </PreviewBox>
            </Section>

            <Section title="RoleTag" subtitle="4 rôles système">
              <PreviewBox>
                <Row>
                  {(["CLIENT", "PRESTATAIRE", "ADMIN", "SERVICE CLIENT"]).map((r) => (
                    <RoleTag key={r} role={r} />
                  ))}
                </Row>
              </PreviewBox>
            </Section>

            <Section title="ServiceCategoryCard" subtitle="Sélection interactive — cliquez une catégorie">
              <PreviewBox>
                <div className="flex flex-col gap-6">
                  <div>
                    <Chip label="md (défaut)" />
                    <div className="flex flex-wrap gap-3 mt-3">
                      {CATEGORIES.map((c) => (
                        <ServiceCategoryCard key={c.id} category={c} selected={selectedCat === c.id} onClick={setSelectedCat} size="md" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Chip label="sm" />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {CATEGORIES.map((c) => (
                        <ServiceCategoryCard key={c.id} category={c} selected={selectedCat === c.id} onClick={setSelectedCat} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </PreviewBox>
            </Section>

            <Section title="PriceDisplay & AmountDisplay" subtitle="Formatage XAF avec variantes sémantiques">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="PriceDisplay">
                  <div className="flex flex-col gap-3">
                    {(["sm", "md", "lg", "xl"]).map((s) => (
                      <div key={s} className="flex items-center justify-between">
                        <Chip label={s} />
                        <PriceDisplay amount={45000} size={s} />
                      </div>
                    ))}
                    <Divider />
                    <div className="flex items-center justify-between">
                      <Chip label="muted" />
                      <PriceDisplay amount={0} muted />
                    </div>
                  </div>
                </Card>
                <Card title="AmountDisplay">
                  <div className="flex flex-col gap-3">
                    {(["default", "positive", "negative", "muted"]).map((v) => (
                      <div key={v} className="flex items-center justify-between">
                        <Chip label={v} />
                        <AmountDisplay amount={v === "negative" ? -25000 : 25000} variant={v} showSign={v !== "default"} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Section>

            <Section title="RatingStars" subtitle="Mode lecture et mode éditable (interactif)">
              <PreviewBox>
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-[12px] text-sl-500 mb-3">Lecture seule</p>
                    <Row gap="gap-6">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <div key={v} className="flex flex-col items-center gap-2">
                          <RatingStars value={v} size="sm" />
                          <Chip label={`${v}/5`} />
                        </div>
                      ))}
                    </Row>
                  </div>
                  <div>
                    <p className="text-[12px] text-sl-500 mb-3">Éditable — cliquez pour noter</p>
                    <div className="flex items-center gap-4">
                      <RatingStars value={ratingVal} size="lg" onChange={setRatingVal} />
                      <span className="text-[14px] font-semibold text-sl-700">{ratingVal} / 5</span>
                    </div>
                  </div>
                </div>
              </PreviewBox>
            </Section>

            <Section title="UserAvatarFooter" subtitle="Bloc utilisateur (pied de sidebar)">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { initial: "J", name: "Jean Mbarga",   subtitle: "Client · Yaoundé",        color: "bg-brand"  },
                  { initial: "F", name: "Fatima Nkolo",  subtitle: "Plombier · ★ 4.8",        color: "bg-accent" },
                  { initial: "A", name: "Admin Système", subtitle: "Administrateur",           color: "bg-sl-800" },
                ].map((u) => (
                  <Card key={u.name} noPadding>
                    <UserAvatarFooter initial={u.initial} name={u.name} subtitle={u.subtitle} avatarColor={u.color} />
                  </Card>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ══════════════════════════════════════════════
            OVERLAYS
        ══════════════════════════════════════════════ */}
        {activeTab === "overlays" && (
          <>
            <Section title="Modal" subtitle="Ouvrir la modal — fermeture au clic overlay ou bouton ×">
              <PreviewBox>
                <Row>
                  <Button onClick={() => setModalOpen(true)}>Ouvrir Modal (md)</Button>
                  <Button variant="secondary">Modal sm</Button>
                  <Button variant="ghost">Modal lg</Button>
                </Row>
              </PreviewBox>
            </Section>

            <Section title="Card" subtitle="4 variantes de mise en page">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <p className="text-[14px] text-sl-700 leading-relaxed">Card sans titre, avec padding standard.</p>
                </Card>
                <Card title="Avec titre">
                  <p className="text-[14px] text-sl-700 leading-relaxed">En-tête avec font display et tracking élargi.</p>
                </Card>
                <Card title="Avec actions" actions={<Button size="sm">Action</Button>}>
                  <p className="text-[14px] text-sl-700 leading-relaxed">Slot d'actions à droite du titre.</p>
                </Card>
                <Card title="Sans padding" noPadding>
                  <div className="bg-sl-50 p-4 border-t border-sl-100">
                    <p className="text-[14px] text-sl-500">Contenu flush avec noPadding.</p>
                  </div>
                </Card>
              </div>
            </Section>

            <Section title="PageHeader" subtitle="En-tête de page principale avec badge et actions">
              <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] overflow-hidden border border-sl-200">
                <PageHeader
                  title="Gestion des demandes"
                  subtitle="245 demandes en cours · Mise à jour il y a 2 min"
                  badge={{ variant: "en_cours" }}
                  actions={
                    <>
                      <Button size="sm" variant="ghost">Exporter</Button>
                      <Button size="sm">Nouvelle demande</Button>
                    </>
                  }
                />
                <PageHeader title="Mon profil" subtitle="Prestataire vérifié" badge={{ variant: "actif" }} />
                <PageHeader title="Tableau de bord" />
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
