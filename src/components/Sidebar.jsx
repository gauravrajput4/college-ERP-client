import { memo, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { preloadRouteChunk } from "../router/lazyRoutes";

const Sidebar = ({ title, links, settingsTo, onLogout, isOpen = false, onClose }) => {
  const handleRouteHover = useCallback((to) => {
    preloadRouteChunk(to);
  }, []);

  const shellClassName = [
    "fixed inset-y-0 left-0 z-50 flex w-[18rem] max-w-[85vw] flex-col border-r border-primary-light bg-primary shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:w-72 lg:translate-x-0 lg:rounded-2xl lg:shadow-sm text-white",
    isOpen ? "translate-x-0" : "-translate-x-full",
  ].join(" ");

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/35 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside id="dashboard-sidebar" className={shellClassName} aria-label={`${title} navigation`}>
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">ERP Navigation</p>
            <h2 className="font-heading text-xl text-white font-bold">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              onMouseEnter={() => handleRouteHover(link.to)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white/10 text-accent shadow-lg"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {(settingsTo || onLogout) && (
          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              className="mb-3 w-full rounded-xl border border-accent/30 px-4 py-3 text-left text-sm font-bold text-accent transition hover:bg-accent/10"
            >
              Support Desk
            </button>

            {settingsTo && (
              <Link
                to={settingsTo}
                onClick={onClose}
                onMouseEnter={() => handleRouteHover(settingsTo)}
                className="mb-2 block rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                Settings
              </Link>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default memo(Sidebar);
