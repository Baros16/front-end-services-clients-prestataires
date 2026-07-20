// src/components/provider/mission-start/ClientContactCard.jsx
import { Card, UserAvatarCircle, Button, MessageCircle } from "../../commons";


export function ClientContactCard({ client, onContact, className = "" }) {
  return (
    <Card title="Client" className={className}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <UserAvatarCircle initial={client.avatarInitial} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-display)] font-bold text-[15px] text-sl-900 m-0 truncate">
              {client.fullName}
            </p>
            <p className="text-[12px] text-sl-400 m-0 mt-[2px]">
              {client.completedMissions ?? 0} mission{(client.completedMissions ?? 0) > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Button variant="secondary" onClick={onContact} className="w-full">
          <MessageCircle size={16} />
          Contacter le client
        </Button>
      </div>
    </Card>
  );
}