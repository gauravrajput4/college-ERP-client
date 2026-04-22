import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import useAuth from "../hooks/useAuth";
import useMediaQuery from "../hooks/useMediaQuery";

const DashboardLayout = ({ roleLabel, sidebarTitle, links, settingsTo, hidePageHeaderOn }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const breadcrumb = useMemo(
    () => location.pathname.split("/").filter(Boolean).join(" / "),
    [location.pathname],
  );

  const shouldHidePageHeader = hidePageHeaderOn?.includes(location.pathname);

  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        showMenuButton={!isDesktop}
        isMenuOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen((open) => !open)}
      />

      <div className="mx-auto flex max-w-[1600px] gap-4 px-4 py-4 sm:px-5 sm:py-6 lg:px-6">
        <Sidebar
          title={sidebarTitle}
          links={links}
          settingsTo={settingsTo}
          onLogout={logout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          {!shouldHidePageHeader && (
            <header className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user?.name || roleLabel}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-bold text-primary">
                    {user?.name?.charAt(0)?.toUpperCase() || roleLabel.charAt(0)}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold text-primary">{user?.name || roleLabel}</p>
                  <p className="truncate text-xs uppercase tracking-[0.18em] text-slate-500">
                    {roleLabel} · {breadcrumb}
                  </p>
                </div>
              </div>
            </header>
          )}

          <main className={shouldHidePageHeader ? "" : "mt-4"}>
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
