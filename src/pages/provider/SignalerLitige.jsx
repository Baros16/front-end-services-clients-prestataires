import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  PhotoUploader,
  AmountDisplay,
  AlertBanner,
  Send,
} from "../../components/commons";
import { getProviderDashboard } from "../../services/providerService";
import { getLitigeMotifs } from "../../services/sharedService";

export default function SignalerLitige() {
  const navigate = useNavigate();
  const [mission,     setMission]     = useState(null);
  const [motifs,      setMotifs]      = useState([]);
  const [motifId,     setMotifId]     = useState(null);
  const [description, setDescription] = useState("");
  const [photos,      setPhotos]      = useState([]);
  const [erreur,      setErreur]      = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [envoye,      setEnvoye]      = useState(false);

  useEffect(() => {
    Promise.all([
      getProviderDashboard(),
      getLitigeMotifs(),
    ])
      .then(([dashboard, motifsData]) => {
        setMission(dashboard.recentMissions[0]);
        setMotifs(motifsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd    = (file) =>
    setPhotos([...photos, { id: "p-" + Date.now(), url: URL.createObjectURL(file), name: file.name }]);
  const handleRemove = (id) => setPhotos(photos.filter((p) => p.id !== id));

  const handleSoumettre = async () => {
    if (!motifId) { setErreur("Veuillez sélectionner un motif."); return; }
    if (description.trim().length < 10) { setErreur("La description doit contenir au moins 10 caractères."); return; }
    setErreur(null);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setEnvoye(true);
    setSubmitting(false);
  };

  if (loading || !mission) return null;

  if (envoye) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Send size={52} strokeWidth={1.5} style={{ color: "var(--color-brand)" }} />
        <h2 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
          Litige signalé
        </h2>
        <p className="text-[14px] text-sl-500 text-center max-w-sm m-0">
          Votre signalement a été transmis. Notre équipe vous répondra sous 24h.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-sl-50">

      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-sl-200 bg-sl-0">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
            Signaler un litige
          </h1>
          <p className="text-[13px] text-sl-500 m-0 mt-1">
            Mission {mission.category} · Madeleine Kamdem
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-6 max-w-2xl">

        {erreur && <AlertBanner type="danger" title="Attention" message={erreur} />}

        <Card title="Motif du litige">
          <div className="flex flex-col gap-2">
            {motifs.map((motif) => (
              <div
                key={motif.id}
                onClick={() => setMotifId(motif.id)}
                className={`flex flex-col gap-[2px] p-4 rounded-[var(--radius-md)] cursor-pointer border-[1.5px] transition-all duration-150
                  ${motifId === motif.id
                    ? "border-brand bg-brand-xlight"
                    : "border-sl-200 bg-sl-0 hover:border-sl-300"}`}
              >
                <span className={`text-[14px] font-semibold ${motifId === motif.id ? "text-brand" : "text-sl-900"}`}>
                  {motif.title}
                </span>
                <span className="text-[12px] text-sl-400">{motif.description}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Description détaillée">
          <div className="flex flex-col gap-5">
            <Input
              label="Décrivez la situation"
              type="textarea"
              placeholder="Expliquez ce qui s'est passé en détail..."
              value={description}
              onChange={setDescription}
              helperText="Minimum 10 caractères."
              required
            />
            <PhotoUploader
              label="Photos (optionnel)"
              photos={photos}
              onAdd={handleAdd}
              onRemove={handleRemove}
              maxPhotos={4}
            />
          </div>
        </Card>

        <Card title="Montant concerné">
          <AmountDisplay amount={mission.totalAmount} size="xl" />
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="md" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button variant="danger" size="md" onClick={handleSoumettre} disabled={submitting}>
            {submitting ? "Envoi en cours..." : "Envoyer le signalement"}
          </Button>
        </div>

      </div>
    </div>
  );
}
