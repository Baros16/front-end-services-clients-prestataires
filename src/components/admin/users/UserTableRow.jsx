// src/components/admin/users/UserTableRow.jsx

import { RoleTag, StatutBadge, RatingStars, Button } from '../../commons';

function SuspensionTooltip({ reason, byRole }) {
if (!reason) return null;
return (
<p style={{
margin: '4px 0 0',
fontSize: '11px',
color: 'var(--color-danger)',
fontFamily: 'var(--font-body)',
fontStyle: 'italic',
maxWidth: 180,
whiteSpace: 'nowrap',
overflow: 'hidden',
textOverflow: 'ellipsis',
}}>
{byRole === 'agent' ? 'Agent' : 'Admin'} — {reason}
</p>
);
}
export default function UserTableRow({ user, isLoading, onSuspend, onReactivate, onView }) {
const isActive = user.status === 'active';
const role = user.role === 'provider'? 'PRESTATAIRE' : 'CLIENT';

return (
   <tr 
    style={{
      borderBottom: '1px solid var(--color-sl-100)',
      opacity: isLoading ? 0.5 : 1,
      transition: 'background 0.15s, opacity 0.2s',
      pointerEvents: isLoading ? 'none' : 'auto',
}}
onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-sl-50)')}
onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
>
{/* Utilisateur */}
<td style={{ padding: '14px 16px' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
<div style={{
width: 34, height: 34, borderRadius: '50%',
background: 'var(--color-sl-200)',
display: 'flex', alignItems: 'center', justifyContent: 'center',
fontWeight: 700, fontSize: 13,
color: 'var(--color-sl-700)',
fontFamily: 'var(--font-body)',
flexShrink: 0,
}}>
{user.avatarInitial}
</div>
<div>
<p style={{
margin: 0, fontSize: '14px', fontWeight: 600,
color: 'var(--color-sl-900)', fontFamily: 'var(--font-body)',
}}>
{user.fullName}
</p>
<p style={{
margin: 0, fontSize: '12px',
color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)',
}}>
{user.email}
</p>
</div>
</div>
</td>
{/* Rôle */}
<td style={{ padding: '14px 16px' }}>
<RoleCapsule role={user.role} /></td>
{/* Téléphone */}
<td style={{
padding: '14px 16px', fontSize: '13px',
color: 'var(--color-sl-600)', fontFamily: 'var(--font-body)',
}}>
{user.phone}
</td>
{/* Missions */}
<td style={{
padding: '14px 16px', fontSize: '14px', fontWeight: 700,
color: 'var(--color-sl-900)', textAlign: 'center',
fontFamily: 'var(--font-body)',
}}>
{user.missionsCount}
</td>
{/* Note */}
<td style={{ padding: '14px 16px' }}>
<StarRating value={user.rating} />
</td>
{/* Statut */}
<td style={{ padding: '14px 16px' }}>
<StatutBadge status={user.status} />
{!isActive && (
<SuspensionTooltip
byRole={user.suspendedByRole}
/>
)}
</td>
{/* Actions */}
<td style={{ padding: '14px 16px' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
<Button
variant='ghost'
size='sm'
onClick={() => onView(user)}
className="!border !border-gray-300 !text-gray-900 bg-white"
>
Voir
</Button>
{isActive ? (
<Button
variant='danger'
size='md'
onClick={() => onSuspend(user)}
className="!border !border-red-500 !text-red-600 !bg-red-50"
onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
>
Susp.
</Button>
) : (
<Button
variant='ghodt'
size='sm'
onClick={() => onReactivate(user)}
className="!border !border-green-500 !text-green-600 !bg-green-50"
onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
>
Réactiver
</Button>
)}
</div>
</td>
</tr>
);
}