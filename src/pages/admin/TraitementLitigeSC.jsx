// src/pages/admin/TraitementLitigeSC.jsx
import { useState, useEffect } from "react";
import { PageHeader, StatusBadge, SkeletonLoader, AlertBanner, EmptyState } from "../../components/commons";
import LitigeDetailsPanel from "../../components/service-client/LitigeDetailsPanel";
import MediationChatPanel from "../../components/service-client/MediationChatPanel";
import PartiesConcerneesPanel from "../../components/service-client/PartiesConcerneesPanel";
import ResolutionPanel from "../../components/service-client/ResolutionPanel";
import { submitResolution, closeLitige } from "../../services/agentService";
import { formatMotif } from "../../utils/formatters";
import {
  mockLitigeDetail,
  mockParties,
  mockClientMessages,
  mockProviderMessages,
} from "../../data/service-client/mockLitigeDetail";

const CURRENT_AGENT_ID = "usr_agent01";

export default function TraitementLitigeSC() {
  const [litige] = useState(mockLitigeDetail);
  const [parties] = useState(mockParties);
  const [loading] = useState(false);
  const [error] = useState(null);

  const [status, setStatus] = useState("ouvert");
  const [activeParty, setActiveParty] = useState("client");
  const [clientMessages, setClientMessages] = useState(mockClientMessages);
  const [providerMessages, setProviderMessages] = useState(mockProviderMessages);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isLitigeClosed = status === "resolu" || status === "cloture";

  const handleSend = (message) => {
    const newMessage = {
      id: `lmsg_${Date.now()}`,
      litigeId: litige.id,
      senderId: CURRENT_AGENT_ID,
      senderRole: "agent",
      senderName: "Pauline F.",
      content: message,
      attachmentUrl: null,
      sentAt: new Date().toISOString(),
    };
    if (activeParty === "client") {
      setClientMessages((prev) => [...prev, newMessage]);
    } else {
      setProviderMessages((prev) => [...prev, newMessage]);
    }
  };

  const handleSubmitResolution = async () => {
    setFeedback(null);
    setIsSubmitting(true);
    try {
      await submitResolution(litige.id, {
        type: selectedResolution,
        refundAmount: Number(refundAmount),
      });
      setStatus("resolu");
      setFeedback({ type: "success", message: "Proposition envoyee aux deux parties pour acceptation." });
    } catch (err) {
      setFeedback({ type: "error", message: "Une erreur est survenue." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseLitige = async () => {
    const confirmed = window.confirm("Voulez-vous vraiment cloтurer ce litige ? Cette action est definitive.");
    if (!confirmed) return;
    try {
      await closeLitige(litige.id);
      setStatus("cloture");
      setFeedback({ type: "success", message: "Litige cloture." });
    } catch (err) {
      setFeedback({ type: "error", message: "Une erreur est survenue." });
    }
  };

  if (loading) return <SkeletonLoader variant="card" count={3} />;
  if (error) return <AlertBanner variant="error" message={error} />;
  if (!litige) return <EmptyState title="Litige introuvable" description="Ce litige n'existe pas." />;

  return (
    <div>
      <PageHeader
        title={`Litige #${litige.reference}`}
        subtitle={`${litige.originalQuote.total.toLocaleString("fr-FR")} XAF sequestres`}
        actions={
          <StatusBadge
            variant={status === "ouvert" ? "ouvert" : status === "resolu" ? "resolu" : "annulee"}
          />
        }
      />

      {feedback && (
        <div className={`mx-4 mt-4 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium ${
          feedback.type === "success"
            ? "bg-success-light text-success border border-success"
            : "bg-danger-light text-danger border border-danger"
        }`}>
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <LitigeDetailsPanel litige={litige} />

        <MediationChatPanel
          clientMessages={clientMessages}
          providerMessages={providerMessages}
          activeParty={activeParty}
          onPartyChange={setActiveParty}
          onSend={handleSend}
          agentId={CURRENT_AGENT_ID}
          clientName={parties.client.name}
          providerName={parties.provider.name}
        />

        <div className="flex flex-col gap-4">
          <PartiesConcerneesPanel client={parties.client} provider={parties.provider} />

          {isLitigeClosed ? (
            <div className="border border-sl-200 rounded-[var(--radius-lg)] p-4 bg-sl-50 text-sm text-sl-500">
              Ce litige est {status === "resolu" ? "resolu" : "cloture"}. Aucune action supplementaire n'est possible.
            </div>
          ) : (
            <ResolutionPanel
              selectedResolution={selectedResolution}
              refundAmount={refundAmount}
              maxAmount={litige.originalQuote.total}
              onResolutionChange={setSelectedResolution}
              onRefundAmountChange={setRefundAmount}
              onSubmit={handleSubmitResolution}
              onClose={handleCloseLitige}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
