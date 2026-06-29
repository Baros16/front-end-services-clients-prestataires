// src/pages/admin/GestionUtilisateurs.jsx

import { useState, useEffect, useCallback }  from 'react'
import { PageHeader, SearchInput, SkeletonLoader, EmptyState, AlertBanner } from '../../components/commons'; 
import { Users } from '../../components/commons/Icons';
import { Search } from '../../components/commons/Icons';
import { getManagedUsers, suspendUser, reactivateUser } from '../../services/adminService';
import UserFilterTabs from '../../components/admin/users/UserFilterTabs';
import UserTableRow from '../../components/admin/users/UserTableRow';
import  mockUsersJson  from '../../data/admin/mock_users.json';

const TABLE_COLUMNS = [
{ key: 'user', label: 'UTILISATEUR', align: 'left' },
{ key: 'role', label: 'RÔLE', align: 'left' },
{ key: 'phone', label: 'TÉLÉPHONE', align: 'left' },
{ key: 'missions', label: 'MISSIONS', align: 'center' },
{ key: 'rating', label: 'NOTE', align: 'left' },
{ key: 'status', label: 'STATUT', align: 'left' },
{ key: 'actions', label: 'ACTIONS', align: 'left' },
];

export default function GestionUtilisateurs() {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState('all');
const [search, setSearch] = useState('');
const [actionLoad, setActionLoad] = useState(null);
// ── Fetch ──────────────────────────────────────────────
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
// ── Filtrage local ──────────────────────────────────────────
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
// ── Actions ─────────────────────────────────────────────
const handleSuspend = async (user) => {
setActionLoad(user.id);
try {
await suspendUser(user.id, 'Suspension manuelle admin');
setUsers(prev =>
prev.map(u => u.id === user.id
? { ...u, status: 'suspended', suspendedByRole: 'admin', suspensionReason: 'Suspension manuelle admin' }
: u
 )
);
} catch {
setError('Échec de la suspension. Veuillez réessayer.');
} finally {
setActionLoad(null);
}
};
const handleReactivate = async (user) => {
setActionLoad(user.id);
try {await reactivateUser(user.id);
setUsers(prev =>
prev.map(u => u.id === user.id
? { ...u, status: 'active', suspendedBy: null, suspendedByRole: null, suspensionReason:
null }
: u
)
);
} catch {
setError('Échec de la réactivation. Veuillez réessayer.');
} finally {
setActionLoad(null);
}
};
const handleView = (user) => {
// TODO S3 : navigate(`/admin/users/${user.id}`)
console.info('[UserManagement] Voir profil :', user.id);
};
// ── Render ─────────────────────────────────────────────
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
alignItems: 'center',
marginBottom: 20,
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
margin: '4px 0 0',
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
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    color: 'var(--color-sl-700)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    width: '200px',
    background: 'white',
}}
/>
</div>
</div>
{/* Onglets */}
<div style={{ marginBottom: 20 }}>
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
{loading ? (
<div style={{ padding: 24 }}>
<SkeletonLoader variant="row" count={5} />
</div>
) : filtered.length === 0 ? (
<EmptyState
icon={<Users size={32} />}
title="Aucun utilisateur trouvé"
description={
search
? `Aucun résultat pour "${search}".`
: 'Aucun utilisateur dans cette catégorie.'
}
/>
) : (
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
<thead>
<tr style={{ borderBottom: '1px solid var(--color-sl-100)' }}>
{TABLE_COLUMNS.map(col => (
<th
key={col.key}style={{
padding: '12px 16px',
textAlign: col.align,
fontSize: '11px',
fontWeight: 700,
color: 'var(--color-sl-400)',
letterSpacing: '0.8px',
fontFamily: 'var(--font-body)',
background: 'white',
}}
>
{col.label}
</th>
))}
</tr>
</thead>
<tbody>
{filtered.map(user => (
<UserTableRow
key={user.id}
user={user}
isLoading={actionLoad === user.id}
onSuspend={handleSuspend}
onReactivate={handleReactivate}
onView={handleView}
/>
))}
</tbody>
</table>
)}
</div>
</div>
);
}
