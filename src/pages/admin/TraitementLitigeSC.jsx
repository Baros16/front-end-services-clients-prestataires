// src/pages/admin/TraitementLitigeSC.jsx
import { useState } from 'react';
import { PageHeader } from '../../components/commons/PageHeader';
import LitigeDetailsPanel from '../../components/service-client/LitigeDetailsPanel';
import MediationChatPanel from '../../components/service-client/MediationChatPanel';
import PartiesConcerneesPanel from '../../components/service-client/PartiesConcerneesPanel';
import ResolutionPanel from '../../components/service-client/ResolutionPanel';
import {
  mockLitigeDetail,
  mockParties,
  mockClientMessages,
  mockProviderMessages,
} from '../../data/service-client/mockLitigeDetail';

const CURRENT_AGENT_ID = 'usr_agent01';

function formatMotif(motif) {
  if (!motif) return '';
  return motif
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function TraitementLitigeSC() {
  const litige = mockLitigeDetail;
  const parties = mockParties;

  const [activeParty, setActiveParty] = useState('client');
  const [clientMessages, setClientMessages] = useState(mockClientMessages);
  const [providerMessages, setProviderMessages] = useState(mockProviderMessages);

  const [selectedResolution, setSelectedResolution] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('Résolution soumise :', { selectedResolution, refundAmount });
    }, 800);
  };

  const handleCloseLitige = () => {
    console.log('Litige clôturé sans résolution');
  };

  return (
    <div>
      <PageHeader
        title={`Litige #${litige.reference}`}
        subtitle={`${formatMotif(litige.motif)} · ${litige.originalQuote.total.toLocaleString('fr-FR')} XAF séquestrés`}
      />

      <div className="grid grid-cols-3 gap-4 p-4">
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

          <ResolutionPanel
            selectedResolution={selectedResolution}
            refundAmount={refundAmount}
            onResolutionChange={setSelectedResolution}
            onRefundAmountChange={setRefundAmount}
            onSubmit={handleSubmitResolution}
            onClose={handleCloseLitige}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
