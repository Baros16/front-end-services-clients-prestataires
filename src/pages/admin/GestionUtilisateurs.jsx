// src/pages/admin/GestionUtilisateurs.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  PageHeader, SearchInput, AlertBanner, EmptyState,
  DataTable, RoleTag, StatusBadge, RatingStars,
} from '../../components/commons';
import { Users } from '../../components/commons/Icons';
import { getManagedUsers, suspendUser, reactivateUser } from '../../services/adminService';
import UserFilterTabs from '../../components/admin/users/UserFilterTabs';
import UserTableRow from '../../components/admin/users/UserTableRow';

export default function GestionUtilisateurs() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoad, setActionLoad] = useState(null);

  // ── Fetch ──────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getManagedUsers();
      setUsers(result.data ?? []);
    } catch {
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Filtrage ─────────────────────────────────────────────
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch =
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(search);
    switch (activeTab) {
      case 'client':    return matchSearch && u.role === 'client';
      case 'provider':  return matchSearch && u.role === 'provider';
      case 'suspended': return matchSearch && u.status === 'suspended';
      default:          return matchSearch;
    }
  });

  // ── Actions ─────────────────────────────────────────────
  const handleSuspend = async (user) => {
    setActionLoad(user.id);
    setError(null);
    try {
      await suspendUser(user.id, 'Suspension manuelle admin');
      setUsers(prev => prev.map(u => u.id === user.id
        ? { ...u, status: 'suspended', suspendedByRole: 'admin', suspensionReason: 'Suspension manuelle admin' }
        : u
      ));
    } catch {
      setError("Impossible de suspendre cet utilisateur. Veuillez réessayer.");
    } finally {
      setActionLoad(null);
    }
  };

  const handleReactivate = async (user) => {
    setActionLoad(user.id);
    setError(null);
    try {
      await reactivateUser(user.id);
      setUsers(prev => prev.map(u => u.id === user.id
        ? { ...u, status: 'active', suspendedBy: null, suspendedByRole: null, suspensionReason: null }
        : u
      ));
    } catch {
      setError("Impossible de réactiver cet utilisateur. Veuillez réessayer.");
    } finally {
      setActionLoad(null);
    }
  };

  const handleView = (user) => {
    console.info('[UserManagement] Voir profil :', user.id);
  };

  // ── Colonnes DataTable ──────────────────────────────────────
  const columns = [
    {
      key: 'user', header: 'UTILISATEUR',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sl-100 flex items-center justify-center font-bold text-[13px] text-sl-700 shrink-0">
            {row.avatarInitial}
          </div>
          <div>
            <p className="m-0 text-[14px] font-semibold text-sl-900">{row.fullName}</p>
            <p className="m-0 text-[12px] text-sl-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', header: 'RÔLE',
      render: (row) => <RoleTag role={row.role === 'provider' ? 'PRESTATAIRE' : 'CLIENT'} />,
    },
    {
      key: 'phone', header: 'TÉLÉPHONE',
      render: (row) => <span className="text-[13px] text-sl-600">{row.phone}</span>,
    },
    {
      key: 'missionsCount', header: 'MISSIONS',
      render: (row) => <span className="text-[14px] font-bold text-sl-900">{row.missionsCount}</span>,
    },
    {
      key: 'rating', header: 'NOTE',
      render: (row) => <RatingStars value={row.rating ?? 0} size="sm" />,
    },
    {
      key: 'status', header: 'STATUT',
      render: (row) => <StatusBadge variant={row.status === 'active' ? 'actif' : 'suspendu'} size="sm" />,
    },
    {
      key: 'actions', header: 'ACTIONS',
      render: (row) => (
        <UserTableRow
          user={row}
          isLoading={actionLoad === row.id}
          onSuspend={handleSuspend}
          onReactivate={handleReactivate}
          onView={handleView}
        />
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="p-8 min-h-[100dvh] bg-sl-50">
      <PageHeader
        title="Gestion des utilisateurs"
        subtitle="Clients & Prestataires"
        actions={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Rechercher..."
            onClear={() => setSearch('')}
          />
        }
        className="mb-5"
      />

      {error && (
        <div className="mb-4">
          <AlertBanner message={error} variant="error" onDismiss={() => setError(null)} />
        </div>
      )}
      <div className="mb-5">
        <UserFilterTabs activeTabId={activeTab} onChange={setActiveTab} users={users} />
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-sl-200 shadow-[var(--shadow-card)] overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          isLoading={loading}
          emptyState={
            <EmptyState
              icon={<Users size={32} />}
              title="Aucun utilisateur trouvé"
              description={search ? `Aucun résultat pour "${search}".` : 'Aucun utilisateur dans cette catégorie.'}
            />
          }
        />
      </div>
    </div>
  );
}