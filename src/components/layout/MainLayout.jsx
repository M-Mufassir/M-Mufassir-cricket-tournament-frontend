import { NavLink, Outlet } from "react-router-dom";

const navigationLinks = [
  { label: "Tournament", to: "/" },
  { label: "Instructions", to: "/instructions" },
  { label: "Register", to: "/register" },
  { label: "Approved Teams", to: "/teams" },
  { label: "Admin", to: "/admin/login" },
];

function MainLayout() {
  return (
    <div className="min-h-screen">
      <header className="section-shell pt-6">
        <div className="glass-panel flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-field-700">
              Cricket Tournament System
            </p>
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Community Cup Registration Hub
            </h1>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-ink text-white"
                      : "bg-white text-slate-700 hover:bg-slate-100"
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
    </div>
  );
}

export default MainLayout;
