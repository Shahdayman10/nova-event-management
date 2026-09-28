import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer, SectionLabel, globalStyles } from "../components/shared";
import api from "../services/api";
import { FavoriteButton } from "../context/FavoritesContext";

const CATEGORIES = [
  "All",
  "Birthdays",
  "Graduation",
  "Engagement",
  "Decorations",
  "Bouquets & Gifts",
  "Giveaways",
];

const SERVICES = [
  {
    id: "engagement",
    category: "Engagement",
    title: "Engagement Celebrations",
    description:
      "Create a romantic and memorable engagement experience with personalized styling, curated florals, and every intimate detail considered.",
    image:
      "https://images.unsplash.com/photo-1761963503451-e064fea6a2b5?w=700&h=480&fit=crop&auto=format",
    alt: "Heart-shaped floral arch with proposal sign at sunset",
    tag: "Most Requested",
  },
  {
    id: "birthdays",
    category: "Birthdays",
    title: "Birthday Celebrations",
    description:
      "Beautifully styled birthday celebrations designed around your special moment — from intimate dinners to milestone parties.",
    image:
      "https://images.unsplash.com/photo-1755704282977-340323fa52df?w=700&h=480&fit=crop&auto=format",
    alt: "Elegant birthday party setup with floral decorations",
    tag: null,
  },
  {
    id: "graduation",
    category: "Graduation",
    title: "Graduation Celebrations",
    description:
      "Celebrate your achievement with thoughtful details, elegant setups, and curated floral arrangements worthy of the moment.",
    image:
      "https://images.unsplash.com/photo-1623945352596-36d5d9f21f70?w=700&h=480&fit=crop&auto=format",
    alt: "Woman in graduation gown holding a bouquet of flowers",
    tag: null,
  },
  {
    id: "decorations",
    category: "Decorations",
    title: "Event Decorations & Tables",
    description:
      "Elegant decorations and beautifully styled tables designed to transform any space into something warm, refined, and memorable.",
    image:
      "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?w=700&h=480&fit=crop&auto=format",
    alt: "Table set up for a party with candles and flowers",
    tag: null,
  },
  {
    id: "bouquets",
    category: "Bouquets & Gifts",
    title: "Bouquets & Gifts",
    description:
      "Thoughtfully arranged bouquets and curated gift sets for every meaningful occasion — chosen with purpose, wrapped with love.",
    image:
      "https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=700&h=480&fit=crop&auto=format",
    alt: "Pink roses wrapped in elegant paper",
    tag: null,
  },
  {
    id: "giveaways",
    category: "Giveaways",
    title: "Giveaways",
    description:
      "Personalized giveaways and small details that make your celebration unforgettable — styled, packaged, and meaningful.",
    image:
      "https://images.unsplash.com/photo-1652346107876-58d7354ce9b8?w=700&h=480&fit=crop&auto=format",
    alt: "White cake with flowers elegant presentation",
    tag: null,
  },
];

interface ApiService {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  is_active?: boolean;
}

export default function ServicesPage() {
  const [active, setActive] = useState("All");
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get("/services");
        setServices(data.services ?? []);
      } catch (err: unknown) {
        const message = err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response
          ? (err.response as { data?: { message?: string } }).data?.message || "Unable to load services."
          : "Unable to load services.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchServices();
  }, []);

  const normalizedName = (value: string) => value.toLowerCase().replace(/\s*&\s*/g, "and").replace(/\s+/g, "");

  const filtered =
    active === "All"
      ? services
      : services.filter((s) => normalizedName(s.name) === normalizedName(active));

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
        <Navbar />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          className="relative"
          style={{ paddingTop: 140, paddingBottom: 80, backgroundColor: "var(--color-secondary)" }}
        >
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <div>
                <SectionLabel>What We Do</SectionLabel>
                <h1
                  className="mb-5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    lineHeight: 1.1,
                    color: "var(--color-foreground)",
                  }}
                >
                  Our{" "}
                  <span className="italic" style={{ color: "var(--color-primary)" }}>
                    Services
                  </span>
                </h1>
                <p
                  className="text-base leading-relaxed max-w-md"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  Thoughtfully designed services to make every celebration beautiful, personal,
                  and unforgettable — tailored around your moment and your people.
                </p>
              </div>

              {/* Decorative image collage */}
              <div className="hidden lg:grid grid-cols-2 gap-3" style={{ maxHeight: 320 }}>
                <div
                  className="overflow-hidden bg-stone-200"
                  style={{ borderRadius: "var(--radius)", gridRow: "span 2" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=380&fit=crop&auto=format"
                    alt="Elegant floral aisle decoration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden bg-stone-200" style={{ borderRadius: "var(--radius)" }}>
                  <img
                    src="https://images.unsplash.com/photo-1608027790251-5e0c80d043d9?w=400&h=180&fit=crop&auto=format"
                    alt="Pink roses bouquet"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden bg-stone-200" style={{ borderRadius: "var(--radius)" }}>
                  <img
                    src="https://images.unsplash.com/photo-1548428938-b1063c60f386?w=400&h=180&fit=crop&auto=format"
                    alt="Candles and wine glasses on table"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Category Filter ───────────────────────────────────────────────── */}
        <div
          className="sticky top-[69px] z-30"
          style={{
            backgroundColor: "rgba(248,245,241,0.97)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div className="container-wide">
            <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className="shrink-0 text-sm font-medium px-5 py-2 transition-all duration-200"
                  style={{
                    borderRadius: "999px",
                    border: "1px solid",
                    borderColor:
                      active === cat ? "var(--color-primary)" : "var(--color-border)",
                    backgroundColor:
                      active === cat ? "var(--color-primary)" : "transparent",
                    color:
                      active === cat
                        ? "var(--color-primary-foreground)"
                        : "var(--color-muted-foreground)",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Services Grid ─────────────────────────────────────────────────── */}
        <section className="section-pad">
          <div className="container-wide">
            {loading ? (
              <div className="text-center py-20" style={{ color: "var(--color-muted-foreground)" }}>
                Loading services…
              </div>
            ) : error ? (
              <div className="text-center py-20" style={{ color: "#b94040" }}>
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service) => (
                  <ServiceCard key={service.id} serviceId={service.id} service={{
                    id: String(service.id),
                    category: service.name,
                    title: service.name,
                    description: service.description || "Crafted to bring beauty and intention to your celebration.",
                    image: service.image || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=700&h=480&fit=crop&auto=format",
                    alt: service.name,
                    tag: null,
                  }} />
                ))}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-20">
                <p style={{ color: "var(--color-muted-foreground)" }}>No services found.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ backgroundColor: "var(--color-foreground)" }}
        >
          <div className="container-wide text-center">
            <SectionLabel>
              <span style={{ color: "var(--color-accent)" }}>Let's Begin</span>
            </SectionLabel>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "var(--color-primary-foreground)",
                lineHeight: 1.2,
              }}
            >
              Have something{" "}
              <span className="italic" style={{ color: "var(--color-accent)" }}>
                special
              </span>{" "}
              in mind?
            </h2>
            <p
              className="text-sm leading-relaxed max-w-md mx-auto mb-10"
              style={{ color: "rgba(248,245,241,0.58)" }}
            >
              Tell us about your occasion and let NOVA create something beautiful — tailored
              entirely around you.
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

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, serviceId }: { service: (typeof SERVICES)[0]; serviceId: number }) {
  return (
    <div
      className="group flex flex-col overflow-hidden transition-shadow duration-300"
      style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 32px rgba(42,33,24,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-200" style={{ height: 240 }}>
        <FavoriteButton type="services" id={serviceId} />
        <img
          src={service.image}
          alt={service.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {service.tag && (
          <span
            className="absolute top-4 left-4 text-xs px-3 py-1 tracking-wide font-medium"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
              borderRadius: "999px",
            }}
          >
            {service.tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <p
          className="text-xs tracking-[0.22em] uppercase font-medium mb-2"
          style={{ color: "var(--color-primary)" }}
        >
          {service.category}
        </p>
        <h3
          className="text-xl mb-3"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-foreground)" }}
        >
          {service.title}
        </h3>
        <p
          className="text-sm leading-relaxed flex-1 mb-5"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          {service.description}
        </p>

        <Link
          to={`/services/${service.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium transition-gap duration-200 group/link"
          style={{ color: "var(--color-primary)" }}
        >
          View Details
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="transition-transform duration-200 group-hover/link:translate-x-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
