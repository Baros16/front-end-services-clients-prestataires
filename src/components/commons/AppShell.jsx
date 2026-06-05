
const ROLE_THEMES = {
  client:         { bg: "bg-sl-50",   mainBg: "bg-sl-50" },
  provider:       { bg: "bg-sl-50",   mainBg: "bg-sl-50" },
  admin:          { bg: "bg-sl-900",  mainBg: "bg-sl-100" },
  service_client: { bg: "bg-sl-800",  mainBg: "bg-sl-100" },
};

export function AppShell({ children, sidebar, role = "client" }) {
  const theme = ROLE_THEMES[role] ?? ROLE_THEMES.client;

  return (
    <div className={`flex h-screen overflow-hidden ${theme.bg}`}>
      {/* Sidebar fixe */}
      <aside className="shrink-0 h-full overflow-y-auto">
        {sidebar}
      </aside>

      {/* Zone de contenu principale */}
      <main
        className={`
          flex-1 overflow-y-auto ${theme.mainBg}
          font-[family-name:var(--font-body)]
        `}
      >
        {children}
      </main>
    </div>
  );
}
