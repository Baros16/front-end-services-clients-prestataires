// src/pages/admin/GestionUtilisateurs.jsx
import { useState, useEffect, useCallback } from 'react';
import {AlertBanner,EmptyState,DataTable,RoleTag,StatusBadge,RatingStars,Button,} from '../../components/commons';
import { Search, Users } from '../../components/commons/Icons';
import mockUsersJson from '../../data/admin/mock_users.json';
import UserFilterTabs from '../../components/admin/users/UserFilterTabs';

const TABLE_COLUMNS = (actionLoad, handleSuspend, handleReactivate, handleView) => [
{
key: 'user',
header: 'UTILISATEUR',
render: (row) => (
<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
<div style={{
width: 34, height: 34, borderRadius: '50%',
background: 'var(--color-sl-200)',
display: 'flex', alignItems: 'center', justifyContent: 'center',
fontWeight: 700, fontSize: 13,
color: 'var(--color-sl-700)',
flexShrink: 0,
}}>
{row.avatarInitial}
</div>
<div>
<p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-sl-900)',
fontFamily: 'var(--font-body)' }}>
{row.fullName}
</p>
<p style={{ margin: 0, fontSize: '12px', color: 'var(--color-sl-400)', fontFamily:
'var(--font-body)' }}>
{row.email}
</p>
</div>
</div>
),
},{
key: 'role',
header: 'RÔLE',
render: (row) => (
<RoleTag role={row.role === 'provider' ? 'PRESTATAIRE' : 'CLIENT'} />
),
},
{
key: 'phone',
header: 'TÉLÉPHONE',
},
{
key: 'missionsCount',
header: 'MISSIONS',
},
{
key: 'rating',
header: 'NOTE',
render: (row) => (
<RatingStars value={row.rating ?? 0} size="sm" />
),
},
{
key: 'status',
header: 'STATUT',
render: (row) => {
const isActive = row.status === 'active';
return (
<div>
<StatusBadge
variant={isActive ? 'actif' : 'suspendu'}
size="sm"
/>
{!isActive && row.suspensionReason && (
<p style={{
margin: '4px 0 0',
fontSize: '11px',
color: 'var(--color-danger)',
fontFamily: 'var(--font-body)',
fontStyle: 'italic',
maxWidth: 180,
whiteSpace: 'nowrap',
overflow: 'hidden',
textOverflow: 'ellipsis',}}>
{row.suspendedByRole === 'agent' ? 'Agent' : 'Admin'} —
{row.suspensionReason}
</p>
)}
</div>
);
},
},
{
key: 'actions',
header: 'ACTIONS',
render: (row) => {
const isActive = row.status === 'active';
return (
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
<Button
variant="ghost"
size="sm"
onClick={() => handleView(row)}
className="!border !border-gray-300 !text-gray-900 !bg-white"
>
Voir
</Button>
{isActive ? (
<Button
variant="ghost"
size="sm"
onClick={() => handleSuspend(row)}
className="!border !border-red-400 !text-red-600 !bg-red-50"
>
Susp.
</Button>
) : (
<Button
variant="ghost"
size="sm"
onClick={() => handleReactivate(row)}
className="!border !border-green-500 !text-green-600 !bg-green-50"
>
Réactiver
</Button>
)}
</div>);
},
},
];
export default function GestionUtilisateurs() {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState('all');
const [search, setSearch] = useState('');
const [actionLoad, setActionLoad] = useState(null);
const fetchUsers = useCallback(() => {
setLoading(true);
setError(null);
try {
const list = mockUsersJson.data ?? [];
setUsers(list);
} catch {
setError('Impossible de charger les utilisateurs.');
} finally {
setLoading(false);
}
}, []);
useEffect(() => { fetchUsers(); }, [fetchUsers]);
const filtered = users.filter(u => {
const q = search.toLowerCase();
const matchSearch =
u.fullName.toLowerCase().includes(q) ||
u.email.toLowerCase().includes(q) ||
u.phone.includes(search);
switch (activeTab) {
case 'client': return matchSearch && u.role === 'client';
case 'provider': return matchSearch && u.role === 'provider';
case 'suspended': return matchSearch && u.status === 'suspended';
default: return matchSearch;
}
});
const handleSuspend = (user) => {
setActionLoad(user.id);setUsers(prev =>
prev.map(u => u.id === user.id
? { ...u, status: 'suspended', suspendedByRole: 'admin',suspensionReason: 'Suspension manuelle admin'  }
: u
)
);
setActionLoad(null);
};
const handleReactivate = (user) => {
setActionLoad(user.id);
setUsers(prev =>
prev.map(u => u.id === user.id
? { ...u, status: 'active', suspendedBy: null, suspendedByRole: null, suspensionReason:
null }
: u
)
);
setActionLoad(null);
};
const handleView = (user) => {
console.info('[UserManagement] Voir profil :', user.id);
};
return (
<div style={{
padding: '32px 36px',
minHeight: '100dvh',
background: 'var(--color-sl-50)',
fontFamily: 'var(--font-body)',
}}>
{/* En-tête + Recherche */}
<div style={{
background: 'white',
borderRadius: 'var(--radius-lg)',
border: '1px solid var(--color-sl-200)',
boxShadow: 'var(--shadow-card)',
padding: '16px 24px',
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',marginBottom: 20,
}}>
<div>
<h1 style={{
fontSize: '22px',
fontWeight: 700,
color: 'var(--color-sl-900)',
margin: 0,
fontFamily: 'var(--font-display)',
}}>
Gestion des utilisateurs
</h1>
<p style={{
fontSize: '13px',
color: 'var(--color-sl-500)',
margin: '4px 00',
fontFamily: 'var(--font-body)',
}}>
Clients & Prestataires
</p>
</div>
<div style={{ position: 'relative' }}>
<span style={{
position: 'absolute',
left: 10,
top: '50%',
transform: 'translateY(-50%)',
color: 'var(--color-sl-400)',
pointerEvents: 'none',
display: 'flex',
alignItems: 'center',
}}>
<Search size={14} />
</span>
<input
type="text"
value={search}
onChange={e => setSearch(e.target.value)}
placeholder="Rechercher..."
style={{
padding: '8px 14px 8px 32px',
border: '1px solid var(--color-sl-200)',
borderRadius: 'var(--radius-md)',fontSize: '13px',
color: 'var(--color-sl-700)',
fontFamily: 'var(--font-body)',
outline: 'none',
width: '200px',
background: 'white',
}}
/>
</div>
</div>
{/* Erreur */}
{error && (
<div style={{ marginBottom: 16}}>
<AlertBanner
message={error}
variant="error"
onDismiss={() => setError(null)}
/>
</div>
)}
{/* Onglets */}
<div style={{ marginBottom: 20}}>
<UserFilterTabs activeTabId={activeTab} onChange={setActiveTab} />
</div>
{/* Tableau */}
<div style={{
background: 'white',
borderRadius: 'var(--radius-lg)',
border: '1px solid var(--color-sl-200)',
boxShadow: 'var(--shadow-card)',
overflow: 'hidden',
}}>
<DataTable
columns={TABLE_COLUMNS(actionLoad, handleSuspend, handleReactivate, handleView)}
data={filtered}
keyExtractor={(row) => row.id}
isLoading={loading}
emptyState={
<EmptyState
title="Aucun utilisateur trouvé"description={
search
? `Aucun résultat pour "${search}".`
: 'Aucun utilisateur dans cette catégorie.'
}
/>
}
/>
</div>
</div>
);
}