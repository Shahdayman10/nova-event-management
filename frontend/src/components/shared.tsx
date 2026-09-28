import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Shared global styles string (imported by pages) ─────────────────────────
export const globalStyles = `
  .section-pad { padding: 96px 0; }
  @media (max-width: 768px) { .section-pad { padding: 64px 0; } }

  .container-wide { max-width: 1320px; margin: 0 auto; padding: 0 24px; }
  @media (min-width: 1440px) { .container-wide { padding: 0 60px; } }

  .display-heading {
    font-family: var(--font-serif);
    font-size: clamp(2rem, 4vw, 3.25rem);
    line-height: 1.15;
    color: var(--color-foreground);
  }

  .body-text {
    font-size: 0.9375rem;
    line-height: 1.75;
    color: var(--color-foreground);
  }

  .btn-primary {
    display: inline-block;
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
    padding: 12px 28px;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    border-radius: var(--radius);
    border: 1px solid var(--color-primary);
    cursor: pointer;
    transition: opacity 0.2s, background-color 0.2s;
    text-decoration: none;
    white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.85; }

  .btn-ghost {
    display: inline-block;
    background-color: transparent;
    color: var(--color-primary);
    padding: 12px 28px;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    border-radius: var(--radius);
    border: 1px solid var(--color-primary);
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    text-decoration: none;
    white-space: nowrap;
  }
  .btn-ghost:hover { background-color: var(--color-primary); color: var(--color-primary-foreground); }

  .btn-ghost-light {
    display: inline-block;
    background-color: transparent;
    color: rgba(248,245,241,0.9);
    padding: 12px 28px;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    border-radius: var(--radius);
    border: 1px solid rgba(248,245,241,0.35);
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;
    text-decoration: none;
  }
  .btn-ghost-light:hover { border-color: rgba(248,245,241,0.7); background-color: rgba(248,245,241,0.08); }

  .form-input {
    width: 100%;
    padding: 10px 14px;
    font-size: 0.875rem;
    font-family: var(--font-sans);
    background-color: var(--color-background);
    color: var(--color-foreground);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    -webkit-appearance: none;
  }
  .form-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(139,110,90,0.12);
  }
  .form-input::placeholder { color: var(--color-border); }
`;

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs tracking-[0.3em] uppercase font-medium mb-3"
      style={{ color: "var(--color-primary)" }}
    >
      {children}
    </p>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const publicLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Packages", href: "/packages" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const alwaysOpaque = !isHome;
  const overlayMode = isHome && !scrolled && !menuOpen;
  const accountMenuBackground = overlayMode ? "rgba(42,33,24,0.96)" : "var(--color-card)";
  const accountMenuText = overlayMode ? "var(--color-primary-foreground)" : "var(--color-foreground)";
  const accountMenuBorder = overlayMode ? "rgba(248,245,241,0.22)" : "var(--color-border)";
  const accountMenuHover = overlayMode ? "rgba(248,245,241,0.12)" : "var(--color-secondary)";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor:
          alwaysOpaque || scrolled ? "rgba(248, 245, 241, 0.96)" : "transparent",
        backdropFilter: alwaysOpaque || scrolled ? "blur(12px)" : "none",
        borderBottom:
          alwaysOpaque || scrolled ? "1px solid var(--color-border)" : "none",
        color: overlayMode ? "var(--color-primary-foreground)" : "var(--color-foreground)",
      }}
    >
      <div
        className="relative mx-auto flex items-center justify-between px-6 py-4"
        style={{ maxWidth: 1440 }}
      >
        <Link to="/" className="flex items-center gap-2 group" aria-label="NOVA home">
          <span
            className="text-2xl tracking-[0.18em] font-medium transition-opacity group-hover:opacity-70"
            style={{
              fontFamily: "var(--font-serif)",
              color: overlayMode ? "var(--color-primary-foreground)" : "var(--color-primary)",
            }}
          >
            NOVA
          </span>
        </Link>

        {!isAdmin && <ul className="hidden md:flex items-center gap-8">
          {publicLinks.map((link) => {
            const active =
              link.href === location.pathname ||
              (link.href === "/services" && location.pathname.startsWith("/services")) ||
              (link.href !== "/" && location.pathname.startsWith(link.href));
            return (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-sm font-medium tracking-wide transition-colors duration-200"
                  style={{
                    color: overlayMode
                      ? active
                        ? "var(--color-primary-foreground)"
                        : "rgba(248,245,241,0.72)"
                      : active
                        ? "var(--color-foreground)"
                        : "var(--color-muted-foreground)",
                    borderBottom: active
                      ? `1px solid ${overlayMode ? "var(--color-accent)" : "var(--color-primary)"}`
                      : "none",
                    paddingBottom: active ? "2px" : "0",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>}

        <div className="hidden md:flex items-center gap-3">
          {isAdmin ? (
            <>
              <Link to="/admin" className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>Admin Dashboard</Link>
              <button type="button" onClick={() => void logout()} className="btn-ghost" style={{ padding: "10px 18px" }}>Logout</button>
            </>
          ) : isAuthenticated ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: overlayMode ? "var(--color-primary-foreground)" : "var(--color-foreground)" }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs" style={{ backgroundColor: overlayMode ? "rgba(248,245,241,0.18)" : "var(--color-secondary)" }}>
                    {(user?.name ?? "P").charAt(0).toUpperCase()}
                  </span>
                  <span>{user?.name ?? "Profile"}</span>
                  <span aria-hidden="true" style={{ fontSize: "0.65rem" }}>⌄</span>
                </button>
                {profileMenuOpen && (
                  <div role="menu" className="absolute right-0 top-full z-50 mt-3 grid w-56 gap-1 rounded-[var(--radius)] border p-2 shadow-lg" style={{ backgroundColor: accountMenuBackground, borderColor: accountMenuBorder }}>
                    <Link to="/quotes" role="menuitem" className="rounded-[var(--radius)] px-3 py-2 text-sm" style={{ color: accountMenuText }} onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = accountMenuHover; }} onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = "transparent"; }} onClick={() => setProfileMenuOpen(false)}>My Requests</Link>
                    <Link to="/favorites" role="menuitem" className="rounded-[var(--radius)] px-3 py-2 text-sm" style={{ color: accountMenuText }} onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = accountMenuHover; }} onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = "transparent"; }} onClick={() => setProfileMenuOpen(false)}>Favorites</Link>
                    <Link to="/notifications" role="menuitem" className="rounded-[var(--radius)] px-3 py-2 text-sm" style={{ color: accountMenuText }} onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = accountMenuHover; }} onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = "transparent"; }} onClick={() => setProfileMenuOpen(false)}>Notifications</Link>
                    <Link to="/profile" role="menuitem" className="rounded-[var(--radius)] px-3 py-2 text-sm" style={{ color: accountMenuText }} onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = accountMenuHover; }} onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = "transparent"; }} onClick={() => setProfileMenuOpen(false)}>Profile settings</Link>
                    <button type="button" role="menuitem" className="mt-1 border-t px-3 py-2 text-left text-sm" style={{ borderColor: accountMenuBorder, color: overlayMode ? "var(--color-accent)" : "var(--color-primary)" }} onClick={() => { setProfileMenuOpen(false); void logout(); }}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium" style={{ color: overlayMode ? "var(--color-primary-foreground)" : "var(--color-foreground)" }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}

          {!isAdmin && isAuthenticated && <Link to="/contact" className="btn-primary">Request a Quote</Link>}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-6 h-px transition-all duration-200"
              style={{
                backgroundColor: overlayMode
                  ? "var(--color-primary-foreground)"
                  : "var(--color-foreground)",
                transform:
                  i === 0 && menuOpen
                    ? "rotate(45deg) translateY(4px)"
                    : i === 2 && menuOpen
                      ? "rotate(-45deg) translateY(-4px)"
                      : "none",
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ backgroundColor: "var(--color-background)" }}
        >
          {!isAdmin && publicLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-medium py-1"
              style={{ color: "var(--color-foreground)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <>
              <Link to="/admin" className="text-sm font-medium py-1" style={{ color: "var(--color-foreground)" }} onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              <button type="button" className="btn-ghost text-center mt-2" onClick={() => { setMenuOpen(false); void logout(); }}>Logout</button>
            </>
          ) : isAuthenticated ? (
            <>
              <div className="border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
                <button type="button" className="flex w-full items-center justify-between py-1 text-sm font-medium" style={{ color: "var(--color-foreground)" }} onClick={() => setProfileMenuOpen((open) => !open)} aria-expanded={profileMenuOpen}>
                  <span className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full text-xs" style={{ backgroundColor: "var(--color-secondary)" }}>{(user?.name ?? "P").charAt(0).toUpperCase()}</span>{user?.name ?? "Profile"}</span>
                  <span aria-hidden="true">{profileMenuOpen ? "⌃" : "⌄"}</span>
                </button>
                {profileMenuOpen && (
                  <div className="mt-2 grid gap-1 pl-10">
                    <Link to="/quotes" className="py-1 text-sm" style={{ color: "var(--color-foreground)" }} onClick={() => setMenuOpen(false)}>My Requests</Link>
                    <Link to="/favorites" className="py-1 text-sm" style={{ color: "var(--color-foreground)" }} onClick={() => setMenuOpen(false)}>Favorites</Link>
                    <Link to="/notifications" className="py-1 text-sm" style={{ color: "var(--color-foreground)" }} onClick={() => setMenuOpen(false)}>Notifications</Link>
                    <Link to="/profile" className="py-1 text-sm" style={{ color: "var(--color-foreground)" }} onClick={() => setMenuOpen(false)}>Profile settings</Link>
                    <button type="button" className="mt-2 border-t pt-2 text-left text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-primary)" }} onClick={() => { setMenuOpen(false); setProfileMenuOpen(false); void logout(); }}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium py-1" style={{ color: "var(--color-foreground)" }} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium py-1" style={{ color: "var(--color-foreground)" }} onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
          {!isAdmin && isAuthenticated && <Link
            to="/contact"
            className="btn-primary text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Request a Quote
          </Link>}
        </div>
      )}
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function Footer() {
  const footerLinks = {
    Navigation: ["Home", "Services", "Gallery", "Packages", "About"],
    Services: ["Birthdays", "Graduation", "Engagement", "Decorations", "Bouquets & Gifts"],
    Connect: ["Instagram", "TikTok", "WhatsApp", "Pinterest"],
  };

  return (
    <footer
      id="about"
      style={{ backgroundColor: "var(--color-foreground)", color: "var(--color-primary-foreground)" }}
    >
      <div className="container-wide pb-16 pt-20 md:pb-20 md:pt-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2 lg:pr-8">
            <p
              className="text-3xl tracking-[0.18em] font-medium mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary-foreground)" }}
            >
              NOVA
            </p>
            <p
              className="text-sm leading-relaxed max-w-xs mb-6"
              style={{ color: "rgba(248,245,241,0.5)" }}
            >
              A boutique event planning and decoration studio dedicated to creating beautiful,
              intentional celebrations for life's most cherished moments.
            </p>
            <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(248,245,241,0.35)" }}>
              Lagos & Abuja, Nigeria
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p
                className="text-xs tracking-[0.2em] uppercase font-medium mb-5"
                style={{ color: "var(--color-accent)" }}
              >
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(248,245,241,0.5)" }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "rgba(248,245,241,0.9)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "rgba(248,245,241,0.5)")
                      }
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-center text-xs sm:mt-16 sm:flex-row sm:text-left"
          style={{
            borderTop: "1px solid rgba(248,245,241,0.08)",
            color: "rgba(248,245,241,0.3)",
          }}
        >
          <p>© 2026 NOVA Events Studio. All rights reserved.</p>
          <p>Crafted with love for life's beautiful moments.</p>
        </div>
      </div>
    </footer>
  );
}
