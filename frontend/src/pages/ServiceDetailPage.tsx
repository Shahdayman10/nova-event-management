import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar, Footer, SectionLabel, globalStyles } from "../components/shared";
import { FavoriteButton } from "../context/FavoritesContext";
import api from "../services/api";

// ─── Data ─────────────────────────────────────────────────────────────────────

const INCLUSIONS = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "Event Styling",
    desc: "Full scene composition from concept to final arrangement.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: "Table Setup",
    desc: "Curated table arrangements including linens, centrepieces, and place settings.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "Floral Arrangements",
    desc: "Fresh premium florals selected to match your palette and vision.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: "Lighting & Details",
    desc: "Ambient candles, fairy lights, and atmospheric details that set the mood.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    title: "Personalized Decorations",
    desc: "Custom signage, name cards, and décor touches unique to your story.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Setup & Coordination",
    desc: "Our team arrives early, sets everything up, and stays through the moment.",
  },
];

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1761963503451-e064fea6a2b5?w=700&h=520&fit=crop&auto=format",
    alt: "Heart-shaped floral arch proposal",
  },
  {
    src: "https://images.unsplash.com/photo-1518370265276-f22b706aeac8?w=700&h=520&fit=crop&auto=format",
    alt: "Engagement ring on roses",
  },
  {
    src: "https://images.unsplash.com/photo-1548428938-b1063c60f386?w=700&h=520&fit=crop&auto=format",
    alt: "Wine glasses and candles",
  },
  {
    src: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=700&h=520&fit=crop&auto=format",
    alt: "Couple by city lights candles",
  },
  {
    src: "https://images.unsplash.com/photo-1656437093582-22e3b1ac3604?w=700&h=520&fit=crop&auto=format",
    alt: "Candles on table romantic",
  },
  {
    src: "https://images.unsplash.com/photo-1676579447794-2d4e339b9f06?w=700&h=520&fit=crop&auto=format",
    alt: "Floor candles romantic setup",
  },
];

const FAQS = [
  {
    q: "Can I customize the decoration?",
    a: "Absolutely. Every NOVA engagement setup is built around your preferences — color palette, floral choices, styling elements, and even the smallest details are tailored to reflect your unique story. We begin with a consultation to understand your vision before we design anything.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 3–4 weeks in advance, especially for weekend dates. For larger setups or peak seasons (December, Valentine's, etc.), 6–8 weeks ensures we have full availability to deliver the best experience.",
  },
  {
    q: "Can NOVA work with my own venue?",
    a: "Yes. We work across private homes, hotel suites, rooftops, gardens, and event spaces throughout Lagos and Abuja. We do a site assessment before the event to plan the setup precisely.",
  },
  {
    q: "Can I request a specific color theme?",
    a: "Yes — and we love when clients come with a vision. Whether it's a blush and champagne palette, deep burgundy, or neutral tones, we source florals, linens, and décor to match your chosen aesthetic as closely as possible.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServiceDetailPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { id } = useParams();
  const [service, setService] = useState<{ id: number; name: string; description?: string | null; image?: string | null } | null>(null);
  const [packages, setPackages] = useState<{ id: number; name: string; price: number | string | null; description?: string | null; features?: string[] | null; service_id: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/services"), api.get("/packages")]).then(([serviceResponse, packageResponse]) => {
      const services = serviceResponse.data.services ?? [];
      const selected = services.find((item: { id: number }) => String(item.id) === id);
      setService(selected ?? null);
      setPackages((packageResponse.data.packages ?? []).filter((item: { service_id: number }) => String(item.service_id) === id));
    }).catch(() => setService(null)).finally(() => setLoading(false));
  }, [id]);

  const serviceName = service?.name ?? "Service";

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
        <Navbar />

        {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
        <div
          style={{
            paddingTop: 88,
            backgroundColor: "var(--color-secondary)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div className="container-wide py-4">
            <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              <Link to="/" className="hover:underline" style={{ color: "var(--color-primary)" }}>
                Home
              </Link>
              <span>/</span>
              <Link to="/services" className="hover:underline" style={{ color: "var(--color-primary)" }}>
                Services
              </Link>
              <span>/</span>
              <span>{serviceName}</span>
            </nav>
          </div>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left */}
              <div>
                <SectionLabel>{serviceName}</SectionLabel>
                <h1
                  className="mb-6"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
                    lineHeight: 1.1,
                    color: "var(--color-foreground)",
                  }}
                >
                  Plan Your{" "}
                  <span className="italic" style={{ color: "var(--color-primary)" }}>
                    {serviceName}.
                  </span>
                </h1>
                <p
                  className="text-base leading-relaxed mb-8 max-w-md"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  {service?.description || "Explore this service and request a quote tailored to your event."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact" state={{ service_id: service?.id }} className="btn-primary">
                    Request a Quote
                  </Link>
                  <a href="#packages" className="btn-ghost">
                    View Packages
                  </a>
                </div>

                {service && <FavoriteButton type="services" id={service.id} />}
              </div>

              {/* Right: image */}
              <div className="relative">
                <div
                  className="overflow-hidden bg-stone-300"
                  style={{ borderRadius: "var(--radius)", aspectRatio: "4/5" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1761963503451-e064fea6a2b5?w=800&h=1000&fit=crop&auto=format"
                    alt="Heart-shaped floral arch at sunset engagement setup"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating card */}
                <div
                  className="absolute -bottom-5 -left-4 md:-left-8 py-4 px-5 hidden sm:block"
                  style={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 4px 20px rgba(42,33,24,0.1)",
                  }}
                >
                  <p className="text-xs tracking-wider uppercase mb-1" style={{ color: "var(--color-muted-foreground)" }}>Service details</p>
                  <p className="text-xl font-light" style={{ fontFamily: "var(--font-serif)", color: "var(--color-foreground)" }}>{serviceName}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Service Introduction ──────────────────────────────────────────── */}
        <section className="section-pad" style={{ backgroundColor: "var(--color-background)" }}>
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel>The NOVA Approach</SectionLabel>
                <h2 className="display-heading mb-5">Designed Around Your Moment</h2>
                <p className="text-sm leading-loose mb-4" style={{ color: "var(--color-muted-foreground)" }}>
                  {service?.description || "NOVA plans this service around your occasion, venue, and preferences."}
                </p>
                <p className="text-sm leading-loose" style={{ color: "var(--color-muted-foreground)" }}>
                  Share the details of your event in a quote request and the NOVA team can help plan the setup for your space and preferences.
                </p>
              </div>
              <div
                className="overflow-hidden bg-stone-200"
                style={{ borderRadius: "var(--radius)", aspectRatio: "16/10" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?w=800&h=500&fit=crop&auto=format"
                  alt="Elegant table setup with flowers and candles"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── What's Included ───────────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ backgroundColor: "var(--color-muted)" }}
        >
          <div className="container-wide">
            <div className="text-center mb-12">
              <SectionLabel>Every Setup Includes</SectionLabel>
              <h2 className="display-heading">What's Included</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {INCLUSIONS.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-6 transition-shadow duration-200"
                  style={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                >
                  <div
                    className="shrink-0 w-11 h-11 flex items-center justify-center rounded-sm"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Packages ──────────────────────────────────────────────────────── */}
        <section
          id="packages"
          className="section-pad"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          <div className="container-wide">
            <div className="text-center mb-14">
              <SectionLabel>Investment</SectionLabel>
              <h2 className="display-heading mb-3">Available Packages</h2>
              <p className="text-sm max-w-md mx-auto" style={{ color: "var(--color-muted-foreground)" }}>
                Explore the packages currently available for {serviceName}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {loading ? <p role="status" className="col-span-full py-8 text-center">Loading packages…</p> : packages.length === 0 ? <p className="col-span-full py-8 text-center" style={{ color: "var(--color-muted-foreground)" }}>No packages are available for this service yet.</p> : packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="relative flex flex-col"
                  style={{
                    backgroundColor: pkg.name.toLowerCase().includes("signature") ? "var(--color-primary)" : "var(--color-card)",
                    border: pkg.name.toLowerCase().includes("signature")
                      ? "1px solid var(--color-primary)"
                      : "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                    padding: "2rem",
                    boxShadow: pkg.name.toLowerCase().includes("signature") ? "0 8px 40px rgba(139,110,90,0.18)" : "none",
                  }}
                >
                  <FavoriteButton type="packages" id={pkg.id} />

                  <p
                    className="text-xs tracking-[0.25em] uppercase font-medium mb-2"
                    style={{
                      color: pkg.name.toLowerCase().includes("signature") ? "rgba(248,245,241,0.6)" : "var(--color-primary)",
                    }}
                  >
                    {pkg.name}
                  </p>

                  <p
                    className="text-3xl font-light mb-1"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: pkg.name.toLowerCase().includes("signature") ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                    }}
                  >
                    {pkg.price == null ? "Price on request" : String(pkg.price)}
                  </p>

                  <p
                    className="text-sm mb-5"
                    style={{
                      color: pkg.name.toLowerCase().includes("signature") ? "rgba(248,245,241,0.65)" : "var(--color-muted-foreground)",
                    }}
                  >
                    {pkg.description || serviceName}
                  </p>

                  <div
                    className="h-px mb-5"
                    style={{
                      backgroundColor: pkg.name.toLowerCase().includes("signature")
                        ? "rgba(248,245,241,0.12)"
                        : "var(--color-border)",
                    }}
                  />

                  <ul className="flex flex-col gap-3 mb-7">
                    {(pkg.features ?? []).map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span
                          style={{
                            color: pkg.name.toLowerCase().includes("signature") ? "var(--color-accent)" : "var(--color-primary)",
                          }}
                        >
                          ✦
                        </span>
                        <span
                          style={{
                            color: pkg.name.toLowerCase().includes("signature") ? "rgba(248,245,241,0.85)" : "var(--color-foreground)",
                          }}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Link
                      to="/contact"
                      state={{ service_id: service?.id, package_id: pkg.id }}
                      className="block text-center text-sm font-medium py-3 px-6 transition-all duration-200"
                      style={{
                        backgroundColor: pkg.name.toLowerCase().includes("signature") ? "var(--color-primary-foreground)" : "transparent",
                        color: "var(--color-primary)",
                        border: pkg.name.toLowerCase().includes("signature")
                          ? "1px solid transparent"
                          : "1px solid var(--color-primary)",
                        borderRadius: "var(--radius)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        if (!pkg.name.toLowerCase().includes("signature")) {
                          el.style.backgroundColor = "var(--color-primary)";
                          el.style.color = "var(--color-primary-foreground)";
                        } else {
                          el.style.opacity = "0.88";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        if (!pkg.name.toLowerCase().includes("signature")) {
                          el.style.backgroundColor = "transparent";
                          el.style.color = "var(--color-primary)";
                        } else {
                          el.style.opacity = "1";
                        }
                      }}
                    >
                      Choose {pkg.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Gallery ───────────────────────────────────────────────────────── */}
        <section className="section-pad" style={{ backgroundColor: "var(--color-background)" }}>
          <div className="container-wide">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <SectionLabel>Our Work</SectionLabel>
                <h2 className="display-heading">Engagement Gallery</h2>
              </div>
              <a
                href="#"
                className="text-sm font-medium self-start md:self-auto"
                style={{ color: "var(--color-primary)" }}
              >
                View Full Gallery →
              </a>
            </div>

            {/* 3-col grid masonry-style */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {GALLERY.map((img, i) => (
                <div
                  key={i}
                  className="group overflow-hidden bg-stone-200"
                  style={{
                    borderRadius: "var(--radius)",
                    aspectRatio: i === 0 || i === 3 ? "3/4" : "4/3",
                    gridRow: i === 0 || i === 3 ? "span 2" : "span 1",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
              <div>
                <SectionLabel>Common Questions</SectionLabel>
                <h2 className="display-heading mb-4">Frequently Asked</h2>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--color-muted-foreground)" }}>
                  Everything you need to know about booking an engagement celebration with NOVA.
                  Still have questions? Reach out — we're happy to help.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left p-5 transition-colors duration-150"
                      style={{
                        backgroundColor: openFaq === i ? "var(--color-muted)" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        {faq.q}
                      </span>
                      <span
                        className="shrink-0 transition-transform duration-200"
                        style={{
                          color: "var(--color-primary)",
                          transform: openFaq === i ? "rotate(45deg)" : "none",
                          display: "inline-block",
                        }}
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5">
                        <p className="text-sm leading-loose" style={{ color: "var(--color-muted-foreground)" }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: "var(--color-foreground)", padding: "80px 0" }}
        >
          <div
            className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 50%, rgba(201,180,154,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(139,110,90,0.12) 0%, transparent 60%)",
            }}
          />
          <div className="container-wide relative text-center">
            <SectionLabel>
              <span style={{ color: "var(--color-accent)" }}>Begin Here</span>
            </SectionLabel>
            <h2
              className="mb-4 mx-auto max-w-lg"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.2,
                color: "var(--color-primary-foreground)",
              }}
            >
              Let's create your{" "}
              <span className="italic" style={{ color: "var(--color-accent)" }}>
                perfect
              </span>{" "}
              celebration.
            </h2>
            <p
              className="text-sm mb-10 max-w-sm mx-auto leading-relaxed"
              style={{ color: "rgba(248,245,241,0.55)" }}
            >
              Tell us about your moment and let NOVA handle every beautiful detail — so you can
              simply show up and be present.
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
