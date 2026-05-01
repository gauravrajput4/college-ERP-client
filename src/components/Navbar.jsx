import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { preloadRouteChunk } from "../router/lazyRoutes";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
  { label: "Admission", to: "/admission" },
  { label: "Tour", to: "/tour" },
];

const baseLinkClass =
  "rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-primary/5 hover:text-primary";

const Navbar = ({ showMenuButton = false, isMenuOpen = false, onMenuToggle }) => {
  const { isAuthenticated, logout, role } = useAuth();
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);
  const location = useLocation();

  const dashboardHome = role ? `/${role}/dashboard` : "/";

  const isDashboardRoute = useMemo(
    () => location.pathname.startsWith("/student") || location.pathname.startsWith("/teacher") || location.pathname.startsWith("/admin"),
    [location.pathname],
  );

  useEffect(() => {
    setPublicMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    setPublicMenuOpen(false);
    return undefined;
  }, [isAuthenticated]);

  const handlePreload = useCallback((to) => preloadRouteChunk(to), []);

  return (
    <header className="sticky top-0 z-[60] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to={isAuthenticated ? dashboardHome : "/"}
            className="flex min-w-0 items-center gap-3"
            aria-label="BJP Memorial Inter College"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg text-white shadow-lg shadow-primary/20">
              <img src="/college-logo.svg" alt="College logo" width={32} height={32} className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-xl text-primary sm:text-2xl">BJP Memorial Inter College</p>
              <p className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {isAuthenticated ? "ERP Dashboard" : "Academic Excellence Since 1988"}
              </p>
            </div>
          </Link>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={logout}
              className="hidden rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/30 lg:inline-flex"
              aria-label="Logout"
            >
              Logout
            </button>

            {showMenuButton && isDashboardRoute ? (
              <button
                type="button"
                onClick={onMenuToggle}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-primary transition hover:border-primary/30 hover:bg-slate-50 lg:hidden"
                aria-label={isMenuOpen ? "Close sidebar menu" : "Open sidebar menu"}
                aria-expanded={isMenuOpen}
                aria-controls="dashboard-sidebar"
              >
                <span className="sr-only">Toggle sidebar</span>
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`block h-0.5 w-5 rounded bg-current transition ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`}
                  />
                  <span
                    className={`block h-0.5 w-5 rounded bg-current transition ${isMenuOpen ? "opacity-0" : ""}`}
                  />
                  <span
                    className={`block h-0.5 w-5 rounded bg-current transition ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
                  />
                </div>
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Public navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onMouseEnter={() => handlePreload(item.to)}
                  className={({ isActive }) => `${baseLinkClass} ${isActive ? "bg-primary/10 text-primary" : ""}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                to="/login"
                onMouseEnter={() => handlePreload("/login")}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-primary transition hover:brightness-95"
              >
                Login
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setPublicMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-primary transition hover:bg-slate-50 lg:hidden"
              aria-label={publicMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={publicMenuOpen}
              aria-controls="public-mobile-nav"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`block h-0.5 w-5 rounded bg-current transition ${publicMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 rounded bg-current transition ${publicMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 rounded bg-current transition ${publicMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </div>
            </button>
          </>
        )}
      </div>

      {!isAuthenticated && (
        <div
          id="public-mobile-nav"
          className={`overflow-hidden border-t border-slate-200 bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
            publicMenuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-4 sm:px-5" aria-label="Mobile public navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onMouseEnter={() => handlePreload(item.to)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-primary text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <Link to="/login" className="mt-1 rounded-xl bg-accent px-4 py-3 text-center text-sm font-bold text-primary">
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default memo(Navbar);
