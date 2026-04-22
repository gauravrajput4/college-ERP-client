import { Link, NavLink } from "react-router-dom";

const Sidebar = ({ title, links, settingsTo, onLogout, isOpen = false, onClose }) => {
  const shellClassName = [
    "fixed inset-y-0 left-0 z-50 flex w-[18rem] max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:w-72 lg:translate-x-0 lg:rounded-2xl lg:shadow-sm",
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
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">ERP Navigation</p>
            <h2 className="font-heading text-xl text-primary">{title}</h2>
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
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-700 hover:bg-slate-100 hover:text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {(settingsTo || onLogout) && (
          <div className="border-t border-slate-200 p-3">
            <button
              type="button"
              className="mb-3 w-full rounded-xl bg-accent/20 px-4 py-3 text-left text-sm font-bold text-primary transition hover:bg-accent/30"
            >
              Support Desk
            </button>

            {settingsTo && (
              <Link
                to={settingsTo}
                onClick={onClose}
                className="mb-2 block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-primary"
              >
                Settings
              </Link>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
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

export default Sidebar;
