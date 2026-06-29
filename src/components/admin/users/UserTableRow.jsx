// src/components/admin/users/UserTableRow.jsx
import { Button } from '../../commons';
export default function UserTableRow({ user, onSuspend, onReactivate, onView }) {
const isActive = user.status === 'active';
return (
<div className="flex items-center gap-2">
<Button
variant="ghost"
size="sm"
onClick={() => onView(user)}
className="!border !border-gray-300 !text-gray-900 !bg-white"
>
Voir
</Button>
{isActive ? (
<Button
variant="ghost"
size="sm"
onClick={() => onSuspend(user)}
className="!border !border-red-400 !text-red-600 !bg-red-50"
>
Susp.
</Button>
) : (
<Button
variant="ghost"
size="sm"
onClick={() => onReactivate(user)}
className="!border !border-green-500 !text-green-600 !bg-green-50"
>
Réactiver
</Button>
)}
</div>
);
}