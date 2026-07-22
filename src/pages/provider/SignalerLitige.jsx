import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  EmptyState,
  FileX,
  Input,
  SkeletonLoader,
  PhotoUploader,
  AmountDisplay,
  AlertBanner,
  PageHeader,
} from "../../components/commons";
import { getProviderDashboard } from "../../services/providerService";
import { getLitigeMotifs, signalerLitige } from "../../services/sharedService";

export default function SignalerLitige() {
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [motifs, setMotifs] = useState([]);
  const [motifId, setMotifId] = useState(null);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboard, motifsData] = await Promise.all([
          getProviderDashboard(),
          getLitigeMotifs(),
        ]);

        setMission(dashboard.recentMissions?.[0] || null);
        setMotifs(motifsData);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les informations.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdd = (file) =>
    setPhotos([
      ...photos,
      { id: "p-" + Date.now(), url: URL.createObjectURL(file), name: file.name },
    ]);
  const handleRemove = (id) => setPhotos(photos.filter((p) => p.id !== id));

  const handleSoumettre = async () => {
    if (!motifId) {
      setErreur("Veuillez sélectionner un motif.");
      return;
    }

    if (description.trim().length < 10) {
      setErreur("La description doit contenir au moins 10 caractères.");
      return;
    }

    setErreur(null);
    setSubmitting(true);

    try {
      await signalerLitige({
        missionId: mission.id,
        motifId,
        description,
        photos,
      });

      // ✅ Redirection vers le dashboard prestataire avec le message
      navigate("/provider/dashboard", {
        state: {
          successMessage:
            "Votre litige a été signalé avec succès. Notre équipe vous répondra sous 24h.",
        },
      });
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <SkeletonLoader variant="card" count={2} />;
  }

  if (error) {
    return <AlertBanner type="danger" title="Erreur" message={error} />;
  }

  if (!mission) {
    return (
      <EmptyState
        icon={<FileX size={40} />}
        title="Aucune mission"
        subtitle="Aucune mission à signaler."
      />
    );
  }

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-sl-50">
      <PageHeader
        title="Signaler un litige"
        subtitle={`Mission ${mission.category} · Madeleine Kamdem`}
      />

      <div className="flex flex-col gap-5 p-6 w-full">
        {erreur && <AlertBanner type="danger" title="Attention" message={erreur} />}

        <Card title="Motif du litige">
          <div className="flex flex-col gap-2">
            {motifs.map((motif) => (
              <div
                key={motif.id}
                onClick={() => setMotifId(motif.id)}
                className={`flex flex-col gap-[2px] p-4 rounded-[var(--radius-md)] cursor-pointer border-[1.5px] transition-all duration-150
                  ${
                    motifId === motif.id
                      ? "border-brand bg-brand-xlight"
                      : "border-sl-200 bg-sl-0 hover:border-sl-300"
                  }`}
              >
                <span
                  className={`text-[14px] font-semibold ${
                    motifId === motif.id ? "text-brand" : "text-sl-900"
                  }`}
                >
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
          <Button
            variant="danger"
            size="md"
            onClick={handleSoumettre}
            disabled={submitting}
          >
            {submitting ? "Envoi en cours..." : "Envoyer le signalement"}
          </Button>
        </div>
      </div>
    </div>
  );
}