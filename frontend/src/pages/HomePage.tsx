import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer, SectionLabel, globalStyles } from "../components/shared";
import api from "../services/api";
import { FavoriteButton } from "../context/FavoritesContext";

// ─── Data ─────────────────────────────────────────────────────────────────────

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1773745060497-4cc1df774c72?w=600&h=800&fit=crop&auto=format",
    alt: "Elegant wedding venue with chandeliers and floral arrangements",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1536392706976-e486e2ba97af?w=600&h=400&fit=crop&auto=format",
    alt: "Long dining table set for a dinner party with flowers and candles",
  },
  {
    src: "https://images.unsplash.com/photo-1608027790251-5e0c80d043d9?w=600&h=400&fit=crop&auto=format",
    alt: "Pink rose bouquet on white table",
  },
  {
    src: "https://images.unsplash.com/photo-1653821355168-144695e5c0e6?w=600&h=800&fit=crop&auto=format",
    alt: "Vase filled with purple flowers on a table",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1602468690798-0820b3ec6ee7?w=600&h=500&fit=crop&auto=format",
    alt: "White flowers in clear glass vase on wooden table",
  },
];

const BENEFITS = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "Personalized Experiences",
    description:
      "Every detail is tailored to reflect your personality, preferences, and the people you love. No two events are ever the same.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "Beautiful Details",
    description:
      "From florals to finishing touches, we obsess over the small things — because beauty lives in the details you'll remember forever.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Professional Planning",
    description:
      "With years of experience and an eye for elegance, our team handles every logistic so you can be fully present in your moment.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Made for Your Moment",
    description:
      "We don't do generic. Every NOVA event is created with intention — built around your timeline, your story, your celebration.",
  },
];

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" className="relative w-full overflow-hidden" style={{ minHeight: "100svh" }}>
      <div className="absolute inset-0 bg-stone-300">
        <img
          src="https://images.unsplash.com/photo-1773745060497-4cc1df774c72?w=1600&h=1000&fit=crop&auto=format"
          alt="Elegant event venue with chandeliers and floral arrangements"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(42,33,24,0.72) 0%, rgba(42,33,24,0.35) 55%, rgba(42,33,24,0.1) 100%)",
          }}
        />
      </div>

      <div
        className="relative mx-auto flex flex-col justify-end px-6 pb-20 md:pb-28 pt-32"
        style={{ maxWidth: 1440, minHeight: "100svh" }}
      >
        <div className="max-w-xl">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-4 font-medium"
            style={{ color: "var(--color-accent)" }}
          >
            Event Planning & Decoration
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-serif)", color: "#F8F5F1" }}
          >
            Celebrate your moments.
            <span className="italic block" style={{ color: "var(--color-accent)" }}>
              We create the details.
            </span>
          </h1>
          <p
            className="text-base md:text-lg leading-relaxed mb-10 font-light max-w-md"
            style={{ color: "rgba(248,245,241,0.78)" }}
          >
            NOVA is a boutique event planning and decoration studio bringing warmth, beauty,
            and intention to birthdays, graduations, engagements, and every small occasion
            worth celebrating.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contact" className="btn-primary">
              Request a Quote
            </a>
            <a href="#services" className="btn-ghost-light">
              Explore Services
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(248,245,241,0.5)" }}>
          Scroll
        </span>
        <div
          className="w-px h-10 animate-pulse"
          style={{ background: "linear-gradient(to bottom, rgba(248,245,241,0.5), transparent)" }}
        />
      </div>
    </section>
  );
}

function Services() {
  const [services, setServices] = useState<{ id: number; name: string; description?: string | null; image?: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/services").then(({ data }) => setServices(data.services ?? [])).catch(() => setServices([])).finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="section-pad" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="container-wide">
        <div className="text-center mb-14">
          <SectionLabel>What We Do</SectionLabel>
          <h2 className="display-heading mb-4">Our Services</h2>
          <p className="body-text max-w-lg mx-auto" style={{ color: "var(--color-muted-foreground)" }}>
            Each service is thoughtfully designed to bring beauty and intention to your most
            treasured celebrations.
          </p>
        </div>

        {loading ? <p role="status" className="py-8 text-center">Loading services…</p> : services.length === 0 ? <p className="py-8 text-center" style={{ color: "var(--color-muted-foreground)" }}>No services available.</p> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden cursor-pointer"
              style={{
                backgroundColor: "var(--color-card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="relative overflow-hidden h-52 bg-stone-200">
                <FavoriteButton type="services" id={service.id} />
                <img
                  src={service.image ?? ""}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3
                  className="text-xl mb-2"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-foreground)" }}
                >
                  {service.name}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-muted-foreground)" }}>
                  {service.description}
                </p>
                <Link
                  to={`/services/${service.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all duration-200"
                  style={{ color: "var(--color-primary)" }}
                >
                  Learn more
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </section>
  );
}

function Packages() {
  const [packages, setPackages] = useState<{ id: number; service_id: number; name: string; price: number | string | null; description?: string | null; features?: string[] | null; service?: { name?: string } }[]>([]);

  useEffect(() => {
    api.get("/packages").then(({ data }) => setPackages(data.packages ?? [])).catch(() => setPackages([]));
  }, []);

  return (
    <section id="packages" className="section-pad" style={{ backgroundColor: "var(--color-secondary)" }}>
      <div className="container-wide">
        <div className="text-center mb-16">
          <SectionLabel>Investment</SectionLabel>
          <h2 className="display-heading mb-4">Our Packages</h2>
          <p className="body-text max-w-lg mx-auto" style={{ color: "var(--color-muted-foreground)" }}>
            Three carefully curated collections designed to suit any occasion and any scale —
            each delivered with NOVA's signature touch.
          </p>
        </div>

        {packages.length === 0 ? <p className="py-8 text-center" style={{ color: "var(--color-muted-foreground)" }}>No packages available.</p> : <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-2 -mx-2">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative flex min-w-[min(86vw,360px)] max-w-[360px] shrink-0 snap-start flex-col md:min-w-[360px]"
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
                style={{ color: pkg.name.toLowerCase().includes("signature") ? "rgba(248,245,241,0.6)" : "var(--color-primary)" }}
              >
                {pkg.name}
              </p>

              <span
                className="text-4xl font-light mb-1 block"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: pkg.name.toLowerCase().includes("signature") ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                }}
              >
                {pkg.price == null ? "Price on request" : String(pkg.price)}
              </span>

              <p
                className="text-sm mb-6"
                style={{
                  color: pkg.name.toLowerCase().includes("signature") ? "rgba(248,245,241,0.7)" : "var(--color-muted-foreground)",
                }}
              >
                {pkg.service?.name ?? pkg.description ?? "Thoughtfully prepared for your event."}
              </p>

              <div
                className="mb-6 h-px"
                style={{
                  backgroundColor: pkg.name.toLowerCase().includes("signature") ? "rgba(248,245,241,0.15)" : "var(--color-border)",
                }}
              />

              <ul className="flex flex-col gap-3 mb-8">
                {(pkg.features ?? []).map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span style={{ color: pkg.name.toLowerCase().includes("signature") ? "var(--color-accent)" : "var(--color-primary)" }}>
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
                  state={{ service_id: pkg.service_id, package_id: pkg.id }}
                  className="block text-center text-sm font-medium py-3 px-6 transition-all duration-200"
                  style={{
                    backgroundColor: pkg.name.toLowerCase().includes("signature") ? "var(--color-primary-foreground)" : "transparent",
                    color: "var(--color-primary)",
                    border: pkg.name.toLowerCase().includes("signature") ? "1px solid transparent" : "1px solid var(--color-primary)",
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
                  Book This Package
                </Link>
              </div>
            </div>
          ))}
        </div>}

        <p className="text-center text-sm mt-8" style={{ color: "var(--color-muted-foreground)" }}>
          Need something bespoke? We offer fully custom planning — just reach out.
        </p>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="section-pad" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionLabel>Our Work</SectionLabel>
            <h2 className="display-heading">Gallery</h2>
          </div>
          <Link to="/services" className="text-sm font-medium self-start md:self-auto" style={{ color: "var(--color-primary)" }}>
            View all services →
          </Link>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="bg-stone-200 overflow-hidden group" style={{ gridRow: "span 2", borderRadius: "var(--radius)" }}>
            <img src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ minHeight: 380 }} />
          </div>
          <div className="bg-stone-200 overflow-hidden group" style={{ borderRadius: "var(--radius)" }}>
            <img src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ minHeight: 220 }} />
          </div>
          <div className="bg-stone-200 overflow-hidden group" style={{ borderRadius: "var(--radius)" }}>
            <img src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ minHeight: 220 }} />
          </div>
          <div className="bg-stone-200 overflow-hidden group" style={{ gridRow: "span 2", borderRadius: "var(--radius)" }}>
            <img src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ minHeight: 380 }} />
          </div>
          <div className="bg-stone-200 overflow-hidden group" style={{ borderRadius: "var(--radius)" }}>
            <img src={GALLERY_IMAGES[4].src} alt={GALLERY_IMAGES[4].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ minHeight: 220 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyNova() {
  return (
    <section className="section-pad" style={{ backgroundColor: "var(--color-foreground)" }}>
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="overflow-hidden bg-stone-400" style={{ borderRadius: "var(--radius)", aspectRatio: "4/5" }}>
              <img
                src="https://images.unsplash.com/photo-1785339677713-0c024517d645?w=700&h=900&fit=crop&auto=format"
                alt="White orchids in elegant arrangement"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-6 -right-4 md:right-8 py-4 px-6"
              style={{ backgroundColor: "var(--color-primary)", borderRadius: "var(--radius)" }}
            >
              <p className="text-3xl font-light" style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary-foreground)" }}>NOVA</p>
              <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "rgba(248,245,241,0.7)" }}>Event Planning</p>
            </div>
          </div>

          <div>
            <SectionLabel>Why Choose Us</SectionLabel>
            <h2 className="text-4xl md:text-5xl leading-tight mb-6" style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary-foreground)" }}>
              Why Choose{" "}
              <span className="italic" style={{ color: "var(--color-accent)" }}>NOVA</span>?
            </h2>
            <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(248,245,241,0.6)" }}>
              We believe every celebration — no matter the size — deserves to be treated like
              the most important event in the world. That's the NOVA standard.
            </p>

            <div className="flex flex-col gap-8">
              {BENEFITS.map((benefit) => (
                <div key={benefit.title} className="flex gap-5 items-start">
                  <div
                    className="shrink-0 flex items-center justify-center w-12 h-12 rounded-sm"
                    style={{ backgroundColor: "rgba(201,180,154,0.12)", color: "var(--color-accent)" }}
                  >
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-medium mb-1" style={{ color: "var(--color-primary-foreground)" }}>
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(248,245,241,0.55)" }}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [reviews, setReviews] = useState<{ id: number; rating: number; comment: string; user?: { name?: string }; service?: { name?: string }; created_at: string }[]>([]);

  useEffect(() => {
    api.get("/reviews").then(({ data }) => setReviews(data.reviews ?? [])).catch(() => setReviews([]));
  }, []);

  return (
    <section className="section-pad" style={{ backgroundColor: "var(--color-muted)" }}>
      <div className="container-wide">
        <div className="text-center mb-14">
          <SectionLabel>Client Reviews</SectionLabel>
          <h2 className="display-heading">Reviews</h2>
        </div>

        {reviews.length === 0 ? <p className="py-8 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>No reviews yet.</p> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-8 flex flex-col gap-5"
              style={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius)",
              }}
            >
              <span
                className="text-sm"
                aria-label={`${review.rating} out of 5 stars`}
                style={{ color: "var(--color-primary)" }}
              >
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </span>
              <p
                className="text-sm leading-loose flex-1"
                style={{ color: "var(--color-foreground)" }}
              >
                {review.comment}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{review.user?.name ?? "Customer"}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{review.service?.name ?? "NOVA service"} · {new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-background)", padding: "80px 0" }}
    >
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ backgroundColor: "var(--color-accent)" }} />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ backgroundColor: "var(--color-primary)" }} />

      <div className="container-wide relative text-center">
        <SectionLabel>Let's Create Together</SectionLabel>
        <h2
          className="text-4xl md:text-6xl leading-tight mb-4 mx-auto max-w-2xl"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-foreground)" }}
        >
          Ready to{" "}
          <span className="italic" style={{ color: "var(--color-primary)" }}>celebrate?</span>
        </h2>
        <p className="text-base mb-10 max-w-md mx-auto leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
          Tell us about your special moment and let NOVA bring it to life — beautifully,
          intentionally, and unforgettably.
        </p>
        <a href="#contact" className="btn-primary text-base px-10 py-4">
          Request a Quote
        </a>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section-pad" style={{ backgroundColor: "var(--color-secondary)" }}>
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <SectionLabel>Get in Touch</SectionLabel>
            <h2 className="display-heading mb-4">Request a Quote</h2>
            <p className="body-text mb-8" style={{ color: "var(--color-muted-foreground)" }}>
              Share your event details through your NOVA account and follow each request from My Requests.
            </p>
            <div className="flex flex-col gap-5">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
                  label: "Quote requests", value: "Submit event details through NOVA",
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />,
                  label: "Request status", value: "Track updates in My Requests",
                },
                {
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></>,
                  label: "Event location", value: "Enter your venue with each request",
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-sm" style={{ backgroundColor: "var(--color-muted)", color: "var(--color-primary)" }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
                  </div>
                  <div>
                    <p className="text-xs tracking-wider uppercase mb-0.5" style={{ color: "var(--color-muted-foreground)" }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-10" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius)" }}>
            <div className="flex h-full flex-col items-start justify-center py-8">
              <h3 className="text-xl mb-3" style={{ fontFamily: "var(--font-serif)", color: "var(--color-foreground)" }}>Plan your event</h3>
              <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>Choose a service, add an optional package, and tell us when and where your event will take place.</p>
              <Link to="/contact" className="btn-primary">Start a quote request</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)" }}>
        <Navbar />
        <Hero />
        <Services />
        <Packages />
        <Gallery />
        <WhyNova />
        <Testimonials />
        <CTA />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
