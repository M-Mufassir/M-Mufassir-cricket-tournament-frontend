import { NavLink, Outlet } from "react-router-dom";

import FloatingAdminHelp from "../common/FloatingAdminHelp";
import { SITE_BRAND } from "../../utils/constants";

const navigationLinks = [
  { label: "Tournament", to: "/" },
  { label: "Instructions", to: "/instructions" },
  { label: "Register", to: "/register" },
  { label: "Approved Teams", to: "/teams" },
  { label: "Admin", to: "/admin/login" },
];

function MainLayout() {
  return (
    <div className="min-h-screen pb-10">
      <header className="section-shell pt-6">
        <div className="hero-frame flex flex-col gap-6 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-kicker">{SITE_BRAND.location}</p>
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              {SITE_BRAND.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {SITE_BRAND.subtitle} with a faster, more polished team registration experience.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-ink text-white shadow-lg shadow-ink/20"
                      : "bg-white/85 text-slate-700 hover:bg-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="section-shell py-8">
        <Outlet />
      </main>

      <footer className="section-shell">
        <div className="rounded-[2rem] border border-white/60 bg-white/70 px-6 py-5 text-sm text-slate-600 backdrop-blur">
          <span className="font-semibold text-ink">{SITE_BRAND.title}</span> | Tournament
          registrations for Negombo.
        </div>
      </footer>

      <FloatingAdminHelp />
    </div>
  );
}

export default MainLayout;
