import { Card, Avatar, Button, RatingStars, MessageCircle } from "../commons";

export default function ClientCard({ showContact = false, onContact }) {
  return (
    <Card title="Client">
      <div className="flex flex-col gap-3">

        <div className="flex items-center gap-3">
          <Avatar initial="M" size="lg" />

          <div>
            <p className="text-[14px] font-bold text-sl-900 m-0">
              Madeleine Kamdem
            </p>

            <p className="text-[12px] text-sl-400 m-0 mt-[2px]">
              Client vérifié
            </p>
          </div>
        </div>

        {showContact && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={onContact}
          >
            <MessageCircle size={16} />
            Contacter le client
          </Button>
        )}

      </div>
    </Card>
  );
}