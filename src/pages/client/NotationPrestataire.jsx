import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMission, rateMission } from "../../services/clientService";
import mockProviderDashboard from "../../data/provider/mock_dashboard.json";
import {
  PageHeader,
  Card,
  Button,
  Input,
  AlertBanner,
  RatingStars,
  Avatar,
  AmountDisplay,
} from "../../components/commons";

export default function NotationPrestataire() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [criteria, setCriteria] = useState({
    punctuality: "",
    quality: "",
    cleanliness: "",
  });
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadMission = async () => {
      try {
        setLoading(true);

        const data = await getMission(missionId);
        setMission(data);
      } catch (err) {
        console.error("Erreur chargement mission:", err);
        setError("Impossible de charger les données de la mission.");
      } finally {
        setLoading(false);
      }
    };

    if (missionId) {
      loadMission();
    }
  }, [missionId]);

  const getProviderInfo = () => {
    const providerData = mockProviderDashboard.data.profile;
    return {
      fullName: providerData.fullName,
      avatarInitial: providerData.avatarInitial,
      specialty: providerData.specialty,
      rating: providerData.rating,
    };
  };

  const handleCriteriaChange = (field, value) => {
    setCriteria((prev) => ({ ...prev, [field]: value }));
  };

  const punctualityOptions = [
    { value: "tres_ponctuel", label: "Très ponctuel" },
    { value: "legerement_en_retard", label: "Légèrement en retard" },
    { value: "en_retard", label: "En retard" },
  ];

  const qualityOptions = [
    { value: "excellent", label: "Excellent" },
    { value: "bien", label: "Bien" },
    { value: "correct", label: "Correct" },
  ];

  const cleanlinessOptions = [
    { value: "tres_propre", label: "Très propre" },
    { value: "propre", label: "Propre" },
    { value: "a_ameliorer", label: "À améliorer" },
  ];

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Veuillez attribuer une note au prestataire");
      return;
    }

    if (!criteria.punctuality || !criteria.quality || !criteria.cleanliness) {
      setError("Veuillez évaluer tous les critères");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await rateMission(missionId, {
        rating,
        criteria,
        comment,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/client/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const provider = getProviderInfo();

  return (
    <div className="mx-auto">
      <PageHeader
        title="Noter le prestataire"
        subtitle={`Mission ${mission?.category} terminée`}
        className="mb-6"
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Banner Mission terminée */}
        <Card className="mb-6 bg-success-light border border-success/20">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="text-4xl" role="img" aria-label="Confettis">
              🎉
            </span>
            <h2 className="text-lg font-bold text-sl-900">
              Mission terminée !
            </h2>
            <p className="text-sl-600">
              {mission?.category}
              {mission?.location?.address}
            </p>
            <div className="bg-success-light/80 border border-success/30 rounded-lg px-6 py-3 mt-1 mx-6 w-full">
              <p className="text-sm text-success-dark">Paiement libéré</p>
              <AmountDisplay
                amount={mission?.totalAmount}
                size="lg"
                variant="positive"
              />
            </div>
          </div>
        </Card>

        {/* Card Notation */}
        <Card className="mb-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-sl-400 uppercase tracking-wider mb-3">
              NOTEZ {provider.fullName.toUpperCase()}
            </h3>
            <div className="flex items-center gap-3 mb-5">
              <Avatar initial={provider.avatarInitial} size="lg" />
              <div>
                <h4 className="text-lg font-semibold text-sl-900">
                  {provider.fullName}
                </h4>
                <div className="flex items-center gap-2">
                  <RatingStars
                    value={provider.rating}
                    size="sm"
                    showValue={true}
                    readonly
                  />
                  <span className="ml-2 text-sm font-medium text-sl-600 self-center">
                    {provider.rating}
                  </span>
                </div>
                <p className="text-sm text-sl-500">{provider.specialty}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <RatingStars
                value={rating}
                onChange={setRating}
                size="lg"
                showValue={false}
                readonly={false}
              />
            </div>
          </div>

          {/* Critères */}
          <div className="space-y-6 mb-6">
            <CriteriaGroup
              label="Ponctualité"
              options={punctualityOptions}
              selected={criteria.punctuality}
              onChange={(value) => handleCriteriaChange("punctuality", value)}
            />

            <CriteriaGroup
              label="Qualité du travail"
              options={qualityOptions}
              selected={criteria.quality}
              onChange={(value) => handleCriteriaChange("quality", value)}
            />

            <CriteriaGroup
              label="Propreté"
              options={cleanlinessOptions}
              selected={criteria.cleanliness}
              onChange={(value) => handleCriteriaChange("cleanliness", value)}
            />
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm font-semibold text-sl-400 uppercase tracking-wider mb-2">
              Commentaire (optionnel)
            </label>
            <Input
              type="textarea"
              placeholder="Partagez votre expérience avec le prestataire..."
              value={comment}
              onChange={setComment}
              rows={4}
            />
          </div>
        </Card>

        {error && (
          <div className="mb-4">
            <AlertBanner variant="error" message={error} />
          </div>
        )}
        {success && (
          <div className="mb-4">
            <AlertBanner
              variant="success"
              message="Note envoyée avec succès !"
            />
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer la note"}
        </Button>
      </div>
    </div>
  );
}

// ─── Composant pour les critères ──────────────────────────────────────────

function CriteriaGroup({ label, options, selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-sl-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all
              ${
                selected === opt.value
                  ? "bg-brand text-white shadow-md"
                  : "bg-sl-100 text-sl-700 hover:bg-sl-200"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
