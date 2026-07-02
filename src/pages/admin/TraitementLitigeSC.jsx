// src/pages/admin/TraitementLitigeSC.jsx
import { useState } from 'react';
import { PageHeader } from '../../components/commons/PageHeader';
import LitigeDetailsPanel from '../../components/service-client/LitigeDetailsPanel';
import MediationChatPanel from '../../components/service-client/MediationChatPanel';
import PartiesConcerneesPanel from '../../components/service-client/PartiesConcerneesPanel';
import ResolutionPanel from '../../components/service-client/ResolutionPanel';
import { formatMotif } from '../../utils/formateurs';
import { StatusBadge } from '../../components/commons/StatusBadge';
import {
  mockLitigeDetail,
  mockParties,
  mockClientMessages,
  mockProviderMessages,
} from '../../data/service-client/mockLitigeDetail';

const CURRENT_AGENT_ID = 'usr_agent01';

export default function TraitementLitigeSC() {
  const litige = mockLitigeDetail;
  const parties = mockParties;

  const [status, setStatus] = useState('ouvert');
  const [activeParty, setActiveParty] = useState('client');
  const [clientMessages, setClientMessages] = useState(mockClientMessages);
  const [providerMessages, setProviderMessages] = useState(mockProviderMessages);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isLitigeClosed = status === 'resolu' || status === 'cloture';

  const handleSend = (message) => {
    const newMessage = {
      id: `lmsg_${Date.now()}`,
      litigeId: litige.id,
      senderId: CURRENT_AGENT_ID,
      senderRole: 'agent',
      senderName: 'Pauline F.',
      content: message,
      attachmentUrl: null,
      sentAt: new Date().toISOString(),
    };
    if (activeParty === 'client') {
      setClientMessages((prev) => [...prev, newMessage]);
    } else {
      setProviderMessages((prev) => [...prev, newMessage]);
    }
  };

  const handleSubmitResolution = () => {
    setFeedback(null);
    setIsSubmitting(true);
    // TODO: remplacer par POST /agent/litiges/:id/resolution
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus('resolu');
      setFeedback({ type: 'success', message: 'Proposition envoyée aux deux parties pour acceptation.' });
    }, 800);
  };

  const handleCloseLitige = () => {
    const confirmed = window.confirm('Voulez-vous vraiment clôturer ce litige ? Cette action est définitive.');
    if (!confirmed) return;
    // TODO: remplacer par POST /agent/litiges/:litigeId/close
    setStatus('cloture');
    setFeedback({ type: 'success', message: 'Litige clôturé.' });
  };

  return (
    <div>
      <PageHeader
        title={`Litige #${litige.reference}`}
        subtitle={`${formatMotif(litige.motif)} · ${litige.originalQuote.total.toLocaleString('fr-FR')} XAF séquestrés`}
        actions={<StatusBadge variant={status === 'ouvert' ? 'ouvert' : status === 'resolu' ? 'resolu' : 'annulee'} />}
      />

      {feedback && (
        <div className={`mx-4 mt-4 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium ${
          feedback.type === 'success'
            ? 'bg-success-light text-success border border-success'
            : 'bg-danger-light text-danger border border-danger'
        }`}>
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 p-4 min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
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
              Ce litige est {status === 'resolu' ? 'résolu' : 'clôturé'}. Aucune action supplémentaire n'est possible.
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
