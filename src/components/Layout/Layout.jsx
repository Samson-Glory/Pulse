import { useState } from "react";

export default function Layout({
  sidebar,
  main,
  onClearChat,
  hasSelectedUser,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 sm:w-72
          transform bg-gray-900 border-r border-gray-800
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0
        `}
      >
        <div className="h-full overflow-y-auto">{sidebar}</div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900/80 backdrop-blur px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              aria-label="Toggle sidebar"
              className="lg:hidden rounded-md p-2 hover:bg-white/10 active:bg-white/20 transition-colors"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Pulse
            </h1>
          </div>

          {hasSelectedUser && (
            <button
              onClick={onClearChat}
              className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors"
            >
              Clear Chat
            </button>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">{main}</main>
      </div>
    </div>
  );
}
