// src/components/common/ConversationListItem.jsx
import { Avatar } from "./Avatar";
import { formatRelativeTime } from "../../utils/formatters";


export function ConversationListItem({ conversation, role, onClick, className = "" }) {
  const counterpart = role === "client" ? conversation.provider : conversation.client;
  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full text-left px-4 py-3
        bg-transparent border-none cursor-pointer
        hover:bg-sl-50 transition-colors duration-150
        ${className}
      `}
    >
      <Avatar initial={counterpart?.avatarInitial} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-[14px] truncate m-0 font-[family-name:var(--font-body)] ${
              hasUnread ? "font-bold text-sl-900" : "font-medium text-sl-700"
            }`}
          >
            {counterpart?.fullName}
          </p>
          <span className="text-[11px] text-sl-400 shrink-0">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-[2px]">
          <p
            className={`text-[13px] truncate m-0 font-[family-name:var(--font-body)] ${
              hasUnread ? "text-sl-700" : "text-sl-400"
            }`}
          >
            {conversation.lastMessagePreview}
          </p>
          {hasUnread && (
            <span
              className="shrink-0 min-w-[18px] h-[18px] px-[5px] rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: "var(--color-brand)" }}
            >
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}