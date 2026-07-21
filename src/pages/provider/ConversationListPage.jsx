// src/pages/provider/ConversationsListPage.jsx
import {
  PageHeader,
  Card,
  AlertBanner,
  SkeletonLoader,
  EmptyState,
  Button,
  MessageCircle,
} from "../../components/commons";
import { ConversationListItem } from "../../components/commons/ConversationListItem";
import { useConversationsList } from "../../hooks/useConversationsList";

export default function ConversationsListPage() {
  const { conversations, loading, error, reload, openConversation } = useConversationsList("provider");

  return (
    <>
      <PageHeader title="Messages" subtitle="Vos conversations avec les clients" />

      <div className="p-4 sm:p-6">
        {loading && <SkeletonLoader variant="row" count={4} />}

        {!loading && error && (
          <div className="flex flex-col gap-3">
            <AlertBanner type="danger" message={error} />
            <Button variant="secondary" onClick={reload}>Réessayer</Button>
          </div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <EmptyState
            icon={<MessageCircle size={40} strokeWidth={1.5} />}
            title="Aucune conversation"
            subtitle="Vos échanges avec les clients apparaîtront ici."
          />
        )}

        {!loading && !error && conversations.length > 0 && (
          <Card noPadding>
            <div className="flex flex-col divide-y divide-sl-100">
              {conversations.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conversation={conv}
                  role="provider"
                  onClick={() => openConversation(conv.id)}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}