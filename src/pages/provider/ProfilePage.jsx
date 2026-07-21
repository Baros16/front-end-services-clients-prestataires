// src/pages/provider/ProfilePage.jsx
import { useRef, useState } from "react";
import {
  PageHeader, Card, Input, Button, Badge, UserAvatarCircle, AlertBanner, SkeletonLoader, FileAttachment,
} from "../../components/commons";
import { useProviderProfile } from "../../hooks/provider/useProviderProfile.js";


function SkillTag({ label, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[12px] font-semibold"
      style={{ background: "var(--color-brand-xlight)", color: "var(--color-brand)" }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Retirer ${label}`}
        className="bg-transparent border-none cursor-pointer leading-none"
        style={{ color: "var(--color-brand)" }}
      >
        ×
      </button>
    </span>
  );
}

export default function ProfilePage() {
  const {
    isLoading, isSaving, form, setField, addTag, removeTag,
    avatarUrl, handlePhotoChange, documents, handleDocumentUpload,
    handleDocumentRemove, error, save,
  } = useProviderProfile();

  const [newTag, setNewTag] = useState("");
  const photoInputRef = useRef(null);
  const docInputRefs = useRef({});

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  async function handleSave() {
    await save();
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader title="Créer / modifier profil" subtitle="Votre profil professionnel" />

      {error && <AlertBanner type="danger" message="Une erreur est survenue. Réessayez." />}

      <div className="grid grid-cols-12 gap-4">
        {/* ── Colonne gauche ── */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-4">

          <Card title="Informations personnelles">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Prénom" value={form.firstName} onChange={(v) => setField("firstName", v)} />
              <Input label="Nom" value={form.lastName} onChange={(v) => setField("lastName", v)} />
            </div>
            <div className="mt-4">
              <Input label="Téléphone" value={form.phone} onChange={(v) => setField("phone", v)} />
            </div>
            <div className="mt-4">
              <Input label="Email" type="email" value={form.email} onChange={(v) => setField("email", v)} />
            </div>
          </Card>

          <Card title="Compétences & spécialités">
            <div className="flex flex-wrap gap-2 items-center mb-4">
              {form.tags.map((tag) => (
                <SkillTag key={tag} label={tag} onRemove={() => removeTag(tag)} />
              ))}
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTag.trim()) {
                    addTag(newTag);
                    setNewTag("");
                  }
                }}
                placeholder="+ Ajouter"
                className="text-[12px] px-2 py-1 rounded-full outline-none"
                style={{ border: "1px dashed var(--color-sl-300)", width: 90 }}
              />
            </div>
            <Input
              label="Tarif horaire (XAF)"
              type="number"
              value={form.hourlyRate}
              onChange={(v) => setField("hourlyRate", v)}
            />
          </Card>

          <Card title="Zone d'intervention">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input label="Ville" value={form.serviceZoneCity} onChange={(v) => setField("serviceZoneCity", v)} />
              <Input
                label="Rayon (km)"
                type="number"
                value={form.serviceZoneRadiusKm}
                onChange={(v) => setField("serviceZoneRadiusKm", v)}
              />
            </div>
            <div
              className="w-full rounded-[var(--radius-lg)] flex items-center justify-center py-10"
              style={{ background: "var(--color-info-light)" }}
            >
              <span className="text-[14px] font-semibold" style={{ color: "var(--color-info)" }}>
                📍 Rayon de {form.serviceZoneRadiusKm || "—"} km autour de {form.serviceZoneCity || "—"}
              </span>
            </div>
          </Card>
        </div>

        {/* ── Colonne droite ── */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">

          <Card title="Photo de profil">
            <div className="flex flex-col items-center gap-4">
              <UserAvatarCircle
                initial={form.firstName?.[0] ?? "?"}
                size="lg"
                bgClass="bg-brand"
                imageUrl={avatarUrl}
                />
              <Button variant="secondary" size="md" className="w-full" onClick={() => photoInputRef.current?.click()}>
                Modifier la photo
              </Button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              />
            </div>
          </Card>

          <Card title="Justificatifs">
            <div className="flex flex-col gap-3">
                {documents.map((doc) => (
                <div key={doc.type} className="flex items-center justify-between gap-2">
                    <FileAttachment
                      fileName={doc.label}
                      fileUrl={doc.fileUrl}
                      onRemove={doc.status === "fourni" ? () => handleDocumentRemove(doc.type) : undefined}
                      className="flex-1 min-w-0"
                    />

                    {doc.status === "fourni" ? (
                    <Badge label="FOURNI" variant="success" size="sm" />
                    ) : (
                    <>
                        <button
                        type="button"
                        onClick={() => docInputRefs.current[doc.type]?.click()}
                        className="inline-flex items-center px-[10px] py-1 rounded-full text-[12px] font-semibold cursor-pointer shrink-0"
                        style={{ background: "transparent", border: "1.5px solid var(--color-brand)", color: "var(--color-brand)" }}
                        >
                        + 
                        </button>
                        <input
                        ref={(el) => (docInputRefs.current[doc.type] = el)}
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(doc.type, e.target.files?.[0])}
                        />
                    </>
                    )}
                </div>
                ))}
            </div>
          </Card>

          <AlertBanner
            type="warning"
            message="En attente de validation — l'administrateur vérifiera vos documents sous 24h."
          />

          <Button variant="primary" size="lg" className="w-full" disabled={isSaving} onClick={handleSave}>
            {isSaving ? "Enregistrement..." : "Enregistrer le profil →"}
          </Button>
        </div>
      </div>
    </div>
  );
}