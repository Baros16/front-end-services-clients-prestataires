// src/pages/client/UrgenceContact.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader, Card, Button, Input, AlertBanner, EmptyState,
} from '../../components/commons';
import { Phone, UserPlus, Trash2, ArrowLeft } from '../../components/commons';

export default function UrgenceContact() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Paul Kamga', phone: '691234567' },
    { id: '2', name: 'Marie Tagne', phone: '698765432' },
  ]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const addContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      setError('Nom et téléphone requis');
      return;
    }
    setContacts(prev => [...prev, { id: Date.now().toString(), name: newName.trim(), phone: newPhone.trim() }]);
    setNewName('');
    setNewPhone('');
    setError(null);
  };

  const removeContact = (id) => setContacts(prev => prev.filter(c => c.id !== id));

  const sendAlert = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    alert(`Alerte envoyée à ${contacts.length} contact(s)`);
    setSending(false);
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/client/urgence')} className="p-2 rounded-lg hover:bg-sl-100">
          <ArrowLeft size={20} />
        </button>
        <PageHeader title="Contacts d'urgence" subtitle="Personnes à prévenir en cas d'urgence" />
      </div>

      <Card title="Ajouter un contact">
        <div className="flex flex-col gap-3">
          <Input label="Nom complet" value={newName} onChange={setNewName} placeholder="Ex: Paul Kamga" />
          <Input label="Téléphone" value={newPhone} onChange={setNewPhone} placeholder="6XXXXXXXX" />
          {error && <AlertBanner type="danger" message={error} />}
          <Button variant="secondary" size="sm" onClick={addContact} disabled={!newName || !newPhone}>
            <UserPlus size={16} /> Ajouter
          </Button>
        </div>
      </Card>

      <Card title="Mes contacts">
        {contacts.length === 0 ? (
          <EmptyState icon={<Phone size={32} />} title="Aucun contact" description="Ajoutez des contacts d'urgence." />
        ) : (
          <div className="flex flex-col gap-2">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--color-surface-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-brand-xlight)' }}>
                    <Phone size={16} style={{ color: 'var(--color-brand)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-sl-700)' }}>{c.name}</p>
                    <p className="text-xs" style={{ color: 'var(--color-sl-400)' }}>+237 {c.phone}</p>
                  </div>
                </div>
                <button onClick={() => removeContact(c.id)} className="p-2 rounded-lg hover:bg-danger-light transition-colors">
                  <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {contacts.length > 0 && (
        <Button variant="danger" size="lg" className="w-full" onClick={sendAlert} disabled={sending}>
          {sending ? 'Envoi des alertes SMS...' : `Envoyer une alerte à ${contacts.length} contact(s)`}
        </Button>
      )}
    </div>
  );
}