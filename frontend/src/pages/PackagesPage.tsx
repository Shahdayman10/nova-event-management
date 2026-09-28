import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer, SectionLabel, globalStyles } from "../components/shared";
import api from "../services/api";
import { FavoriteButton } from "../context/FavoritesContext";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Pkg {
  id: number;
  serviceId: number;
  level: string;
  category: string;
  tagline: string;
  price: string;
  features: string[];
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ApiPackage {
  id: number;
  service_id: number;
  name: string;
  description?: string | null;
  price?: number | string | null;
  features?: string[] | null;
  service?: { name?: string };
  is_active?: boolean;
}

export default function PackagesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState<string>("All");
  const [packages, setPackages] = useState<ApiPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get("/packages");
        setPackages(data.packages ?? []);
      } catch (err: unknown) {
        const message = err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response
          ? (err.response as { data?: { message?: string } }).data?.message || "Unable to load packages."
          : "Unable to load packages.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchPackages();
  }, []);

  const apiPackages: Pkg[] = packages.map((pkg) => ({
    level: pkg.name,
    category: pkg.service?.name || "Custom",
    tagline: pkg.description || "Thoughtfully designed for your celebration.",
    id: pkg.id,
    serviceId: pkg.service_id,
    price: pkg.price == null ? "Price on request" : String(pkg.price),
    features: Array.isArray(pkg.features) ? pkg.features : [],
  }));

  const levels = ["All", ...new Set(apiPackages.map((pkg) => pkg.level))];
  const categories = ["All", ...new Set(apiPackages.map((pkg) => pkg.category))];
  const displayPackages = apiPackages.filter((pkg) =>
    (activeCategory === "All" || pkg.category === activeCategory) &&
    (activeLevel === "All" || pkg.level === activeLevel),
  );

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
        <Navbar />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            backgroundColor: "var(--color-secondary)",
          }}
        >
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div>
                <SectionLabel>Our Packages</SectionLabel>
                <h1
                  className="mb-5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
                    lineHeight: 1.1,
                    color: "var(--color-foreground)",
                  }}
                >
                  Choose the Perfect Package{" "}
                  <span className="italic" style={{ color: "var(--color-primary)" }}>
                    for Your Moment
                  </span>
                </h1>
                <p className="text-base leading-relaxed max-w-md" style={{ color: "var(--color-muted-foreground)" }}>
                  Thoughtfully designed packages with the flexibility to make your celebration
                  truly yours — from intimate moments to full luxury experiences.
                </p>
              </div>
              <div
                className="hidden lg:block overflow-hidden bg-stone-200"
                style={{ borderRadius: "var(--radius)", aspectRatio: "16/9" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1780337092627-341f99bf2bc5?w=900&h=500&fit=crop&auto=format"
                  alt="Elegant dining table set with flowers, glasses, and plates"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Level selector + Category filter ──────────────────────────────── */}
        <div
          className="sticky top-[69px] z-30"
          style={{
            backgroundColor: "rgba(248,245,241,0.97)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div className="container-wide">
            {/* Level tabs */}
            <div
              className="flex items-center gap-0 pt-4 pb-0"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className="px-6 py-3 text-sm font-medium transition-all duration-200 relative"
                  style={{
                    color: activeLevel === level ? "var(--color-foreground)" : "var(--color-muted-foreground)",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    borderBottom: activeLevel === level ? "2px solid var(--color-primary)" : "2px solid transparent",
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
            {/* Category pills */}
            <div className="flex items-center gap-2 py-3 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 text-sm font-medium px-4 py-1.5 transition-all duration-200"
                  style={{
                    borderRadius: "999px",
                    border: "1px solid",
                    borderColor: activeCategory === cat ? "var(--color-primary)" : "var(--color-border)",
                    backgroundColor: activeCategory === cat ? "var(--color-primary)" : "transparent",
                    color: activeCategory === cat ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Package Cards ─────────────────────────────────────────────────── */}
        <section className="section-pad">
          <div className="container-wide">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? <p role="status" className="col-span-full py-12 text-center">Loading packages…</p> : error ? <p role="alert" className="col-span-full py-12 text-center" style={{ color: "#a33" }}>{error}</p> : displayPackages.length === 0 ? <p className="col-span-full py-12 text-center" style={{ color: "var(--color-muted-foreground)" }}>No packages are available in this category.</p> : displayPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>

        {/* ── What's Included ───────────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ backgroundColor: "var(--color-foreground)" }}
        >
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel>
                  <span style={{ color: "var(--color-accent)" }}>Across All Packages</span>
                </SectionLabel>
                <h2
                  className="mb-5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                    lineHeight: 1.2,
                    color: "var(--color-primary-foreground)",
                  }}
                >
                  What's{" "}
                  <span className="italic" style={{ color: "var(--color-accent)" }}>
                    Included?
                  </span>
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(248,245,241,0.58)" }}>
                  Every NOVA package is built around a core set of services, then elevated based
                  on the tier you choose. Here's what we typically include across our work.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INCLUSIONS.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 py-3 px-4"
                      style={{
                        backgroundColor: "rgba(248,245,241,0.05)",
                        border: "1px solid rgba(248,245,241,0.08)",
                        borderRadius: "var(--radius)",
                      }}
                    >
                      <span style={{ color: "var(--color-accent)", fontSize: "0.6rem" }}>✦</span>
                      <span className="text-sm" style={{ color: "rgba(248,245,241,0.78)" }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="overflow-hidden bg-stone-400"
                style={{ borderRadius: "var(--radius)", aspectRatio: "4/5" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1553705426-c702161740bb?w=700&h=875&fit=crop&auto=format"
                  alt="Flower centrepieces and candles on an elegant table"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          <div className="container-wide text-center">
            <SectionLabel>Get Started</SectionLabel>
            <h2
              className="mb-4 mx-auto max-w-xl"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.2,
                color: "var(--color-foreground)",
              }}
            >
              Let's Create Something{" "}
              <span className="italic" style={{ color: "var(--color-primary)" }}>
                Beautiful
              </span>
            </h2>
            <p className="text-sm max-w-md mx-auto mb-10 leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
              Tell us about your occasion and we'll help you find the right package —
              or build something entirely bespoke around your vision.
            </p>
            <Link to="/#contact" className="btn-primary">
              Request a Quote
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

// ─── Package Card ─────────────────────────────────────────────────────────────

function PackageCard({ pkg }: { pkg: Pkg }) {
  const isSig = pkg.level === "Signature";
  return (
    <div
      className="relative flex flex-col transition-shadow duration-200"
      style={{
        backgroundColor: isSig ? "var(--color-primary)" : "var(--color-card)",
        border: isSig ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        padding: "1.75rem",
        boxShadow: isSig ? "0 8px 40px rgba(139,110,90,0.18)" : "none",
      }}
    >
      {isSig && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 tracking-widest uppercase font-medium whitespace-nowrap"
          style={{ backgroundColor: "var(--color-accent)", color: "var(--color-foreground)", borderRadius: "999px" }}
        >
          Featured
        </span>
      )}
      <FavoriteButton type="packages" id={pkg.id} />

      {/* Category badge */}
      <span
        className="inline-block text-xs tracking-[0.2em] uppercase font-medium mb-3 px-2.5 py-1 self-start"
        style={{
          backgroundColor: isSig ? "rgba(248,245,241,0.12)" : "var(--color-muted)",
          color: isSig ? "rgba(248,245,241,0.7)" : "var(--color-primary)",
          borderRadius: "var(--radius)",
        }}
      >
        {pkg.category}
      </span>

      <p
        className="text-xs tracking-[0.2em] uppercase font-medium mb-1"
        style={{ color: isSig ? "rgba(248,245,241,0.55)" : "var(--color-muted-foreground)" }}
      >
        {pkg.level}
      </p>

      <p
        className="text-3xl font-light mb-1"
        style={{ fontFamily: "var(--font-serif)", color: isSig ? "var(--color-primary-foreground)" : "var(--color-foreground)" }}
      >
        {pkg.price}
      </p>

      <p
        className="text-sm mb-5 leading-snug"
        style={{ color: isSig ? "rgba(248,245,241,0.65)" : "var(--color-muted-foreground)" }}
      >
        {pkg.tagline}
      </p>

      <div className="h-px mb-5" style={{ backgroundColor: isSig ? "rgba(248,245,241,0.1)" : "var(--color-border)" }} />

      <ul className="flex flex-col gap-2.5 mb-7 flex-1">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <span style={{ color: isSig ? "var(--color-accent)" : "var(--color-primary)", fontSize: "0.6rem", marginTop: 4 }}>✦</span>
            <span style={{ color: isSig ? "rgba(248,245,241,0.82)" : "var(--color-foreground)" }}>{f}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 mt-auto">
        <Link
          to={`/services/${pkg.serviceId}`}
          className="block text-center text-sm font-medium py-2.5 px-4 transition-all duration-200"
          style={{
            backgroundColor: "transparent",
            color: isSig ? "rgba(248,245,241,0.7)" : "var(--color-muted-foreground)",
            border: isSig ? "1px solid rgba(248,245,241,0.18)" : "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          View Details
        </Link>
        <Link
          to="/contact"
          state={{ service_id: pkg.serviceId, package_id: pkg.id }}
          className="block text-center text-sm font-medium py-2.5 px-4 transition-all duration-200"
          style={{
            backgroundColor: isSig ? "var(--color-primary-foreground)" : "var(--color-primary)",
            color: isSig ? "var(--color-primary)" : "var(--color-primary-foreground)",
            border: "1px solid transparent",
            borderRadius: "var(--radius)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          Request a Quote
        </Link>
      </div>
    </div>
  );
}
