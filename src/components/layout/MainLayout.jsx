import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import FloatingAdminHelp from "../common/FloatingAdminHelp";
import SportsIcon from "../common/SportsIcon";
import { SITE_BRAND } from "../../utils/constants";

const navigationLinks = [
  { label: "Tournament", shortLabel: "Home", to: "/", icon: "home" },
  { label: "Instructions", shortLabel: "Guide", to: "/instructions", icon: "guide" },
  { label: "Register", shortLabel: "Register", to: "/register", icon: "bat" },
  { label: "Approved Teams", shortLabel: "Teams", to: "/teams", icon: "teams" },
];

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tickerItems = [
    `${SITE_BRAND.title} official tournament entry`,
    "Squad submissions and payment confirmation",
    "Approved teams and tournament notices",
    `${SITE_BRAND.location} cricket season`,
  ];

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className="min-h-screen pb-28 md:pb-10">
      <div className="section-shell sticky top-0 z-40 pt-3 sm:pt-4">
        <header className="stadium-panel overflow-hidden px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <Link className="min-w-0" to="/" onClick={closeMenu}>
              <span className="brand-chip">{SITE_BRAND.location} League</span>
              <div className="brand-lockup mt-3">
                <span className="brand-emblem">
                  <SportsIcon icon="trophy" className="h-6 w-6" />
                </span>
                <h1 className="headline-glow font-display text-2xl font-bold text-ink sm:text-3xl">
                  {SITE_BRAND.title}
                </h1>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Official tournament information, team entry, and approved squad listings.
              </p>
            </Link>

            <div className="hidden md:flex md:flex-wrap md:items-center md:justify-end md:gap-2">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-pill ${isActive ? "nav-pill-active" : ""}`.trim()
                  }
                >
                  <NavIcon icon={link.icon} />
                  <span>{link.label}</span>
                </NavLink>
              ))}

              <Link className="primary-button ml-1" to="/register">
                Register Squad
              </Link>
            </div>

            <button
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              className="nav-pill px-3 md:hidden"
              type="button"
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            >
              <span className="flex flex-col gap-1">
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="match-ticker">
              <div className="match-ticker__track">
                {[...tickerItems, ...tickerItems].map((item, index) => (
                  <span key={`${item}-${index}`}>{item}</span>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-2">
              <span className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                Official Entry
              </span>
              <span className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                Approved Squads
              </span>
            </div>
          </div>

          {isMenuOpen ? (
            <nav className="mobile-sheet mt-4 grid gap-2 md:hidden">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-pill justify-between ${isActive ? "nav-pill-active" : ""}`.trim()
                  }
                  onClick={closeMenu}
                >
                  <span className="flex items-center gap-2">
                    <NavIcon icon={link.icon} />
                    <span>{link.label}</span>
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] opacity-70">Open</span>
                </NavLink>
              ))}

              <Link className="primary-button mt-2 w-full" to="/register" onClick={closeMenu}>
                Register Your Team
              </Link>
            </nav>
          ) : null}
        </header>
      </div>

      <main className="section-shell py-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="section-shell">
        <div className="stadium-panel px-6 py-6 text-sm text-slate-600">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="section-kicker">Ground Control</p>
              <p className="mt-2 max-w-2xl leading-7">
                <span className="font-semibold text-ink">{SITE_BRAND.title}</span> brings team
                entry, tournament notices, and approved squads together for the competition in{" "}
                {SITE_BRAND.location}.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {navigationLinks.map((link) => (
                <NavLink
                  key={`footer-${link.to}`}
                  to={link.to}
                  className="rounded-full border border-white/60 bg-white/70 px-4 py-2 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white"
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <nav aria-label="Mobile navigation" className="mobile-dock">
        <div className="grid grid-cols-4 gap-2">
          {navigationLinks.map((link) => (
            <NavLink
              key={`mobile-${link.to}`}
              to={link.to}
              className={({ isActive }) =>
                `mobile-dock-link ${isActive ? "mobile-dock-link-active" : ""}`.trim()
              }
              onClick={closeMenu}
            >
              <NavIcon icon={link.icon} />
              <span>{link.shortLabel}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <FloatingAdminHelp />
    </div>
  );
}

function NavIcon({ icon }) {
  return <SportsIcon icon={icon} className="h-4 w-4" />;
}

export default MainLayout;
