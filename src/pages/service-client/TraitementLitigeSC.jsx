// src/pages/service-client/TraitementLitigeSC.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageHeader,
  Card,
  StatusBadge,
  Button,
  AlertBanner,
  SkeletonLoader,
  EmptyState,
  Avatar,
  AmountDisplay,
  Badge,
} from '../../components/commons';
import {
  ArrowLeft,
  Send,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  Clock,
  User,
  Shield,
  FileText,
} from '../../components/commons';
import {
  getLitigeDetail,
  getLitigeMessages,
  getLitigeHistory,
  sendMediationMessage,
  resolveLitige,
  escalateLitige,
} from '../../services/serviceClientService';

export default function TraitementLitigeSC() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [litige, setLitige] = useState(null);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getLitigeDetail(id),
      getLitigeMessages(id),
      getLitigeHistory(id),
    ])
      .then(([litigeData, messagesData, historyData]) => {
        setLitige(litigeData);
        setMessages(messagesData?.data ?? messagesData ?? []);
        setHistory(historyData?.data ?? historyData ?? []);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Erreur lors du chargement du litige');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const result = await sendMediationMessage(id, newMessage.trim());
      setMessages(prev => [...prev, result.data ?? result]);
      setNewMessage('');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleResolve = async (decision) => {
    setActionLoading(true);
    try {
      await resolveLitige(id, decision);
      setLitige(prev => ({ ...prev, status: 'resolu' }));
    } catch (err) {
      setError(err.message || 'Erreur lors de la résolution');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async () => {
    const reason = prompt('Motif de l\'escalade :');
    if (!reason) return;
    setActionLoading(true);
    try {
      await escalateLitige(id, reason);
      setLitige(prev => ({ ...prev, status: 'escalade' }));
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'escalade');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertBanner type="danger" message={error} />
        <Button variant="ghost" onClick={() => navigate('/service-client/litiges')} className="mt-4">
          ← Retour aux litiges
        </Button>
      </div>
    );
  }

  if (!litige) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<AlertTriangle size={48} />}
          title="Litige introuvable"
          description="Ce litige n'existe pas ou a été supprimé."
          action={<Button variant="primary" onClick={() => navigate('/service-client/litiges')}>Retour aux litiges</Button>}
        />
      </div>
    );
  }

  const isResolved = litige.status === 'resolu' || litige.status === 'cloture';

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/service-client/litiges')}
          className="p-2 rounded-lg hover:bg-sl-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <PageHeader
            title={litige.reference ?? `Litige #${id}`}
            subtitle={litige.motif?.title ?? litige.motif ?? 'Litige'}
            badge={<StatusBadge label={litige.status} variant={litige.status} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale : Messages + Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Timeline / Historique */}
          <Card title="Historique">
            {history.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--color-sl-500)' }}>Aucun historique disponible</p>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ background: 'var(--color-brand)' }}
                      />
                      {idx < history.length - 1 && (
                        <div className="w-px flex-1" style={{ background: 'var(--color-sl-200)' }} />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 pb-4">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-sl-700)' }}>
                        {entry.action ?? entry.event}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
                        {new Date(entry.createdAt ?? entry.date).toLocaleString('fr-FR')}
                      </span>
                      {entry.comment && (
                        <span className="text-xs" style={{ color: 'var(--color-sl-500)' }}>
                          {entry.comment}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Messages de médiation */}
          <Card title="Messages de médiation">
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto mb-4">
              {messages.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--color-sl-500)' }}>
                  Aucun message pour le moment. Utilisez le champ ci-dessous pour contacter les parties.
                </p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={msg.id ?? idx}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{
                      background: msg.senderId === 'agent' ? 'var(--color-brand-xlight)' : 'var(--color-surface-subtle)',
                    }}
                  >
                    <Avatar
                      initial={msg.senderId === 'agent' ? 'SC' : msg.senderName?.[0] ?? '?'}
                      size="sm"
                    />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: 'var(--color-sl-700)' }}>
                          {msg.senderName ?? (msg.senderId === 'agent' ? 'Service Client' : 'Partie')}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
                          {new Date(msg.createdAt).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-sl-600)' }}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!isResolved && (
              <div className="flex items-center gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Écrire un message..."
                  className="flex-1 px-4 py-2 rounded-lg text-sm outline-none"
                  style={{ border: '1px solid var(--color-sl-300)', background: 'var(--color-surface)' }}
                  disabled={sending}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                >
                  <Send size={16} />
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Colonne latérale : Infos + Actions */}
        <div className="flex flex-col gap-4">
          {/* Informations */}
          <Card title="Informations">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-sl-500)' }}>Client</span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-sl-700)' }}>
                  {litige.clientName ?? litige.client?.name ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-sl-500)' }}>Prestataire</span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-sl-700)' }}>
                  {litige.providerName ?? litige.provider?.name ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-sl-500)' }}>Motif</span>
                <span className="text-sm" style={{ color: 'var(--color-sl-700)' }}>
                  {litige.motif?.title ?? litige.motif ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-sl-500)' }}>Montant</span>
                <AmountDisplay amount={litige.amount ?? 0} size="sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-sl-500)' }}>Statut</span>
                <StatusBadge label={litige.status} variant={litige.status} size="sm" />
              </div>
              {litige.description && (
                <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--color-sl-200)' }}>
                  <span className="text-xs" style={{ color: 'var(--color-sl-500)' }}>Description</span>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-sl-600)' }}>
                    {litige.description}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Preuves */}
          {litige.evidences?.length > 0 && (
            <Card title="Preuves">
              <div className="flex flex-col gap-2">
                {litige.evidences.map((ev, idx) => (
                  <a
                    key={ev.id ?? idx}
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg text-sm"
                    style={{ background: 'var(--color-surface-subtle)' }}
                  >
                    <FileText size={16} />
                    <span className="truncate">{ev.name}</span>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Actions */}
          {!isResolved && (
            <Card title="Actions">
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => handleResolve({ decision: 'favor_client', comment: 'Résolution en faveur du client' })}
                  disabled={actionLoading}
                >
                  <CheckCircle size={16} />
                  Résoudre — Faveur client
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => handleResolve({ decision: 'favor_provider', comment: 'Résolution en faveur du prestataire' })}
                  disabled={actionLoading}
                >
                  <CheckCircle size={16} />
                  Résoudre — Faveur prestataire
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  className="w-full"
                  onClick={handleEscalate}
                  disabled={actionLoading}
                >
                  <AlertTriangle size={16} />
                  Escalader à l'admin
                </Button>
              </div>
            </Card>
          )}

          {isResolved && (
            <Card title="Litige résolu">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>
                  Ce litige a été clôturé
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}