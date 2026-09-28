import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer, SectionLabel, globalStyles } from "../components/shared";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All", "Birthdays", "Graduation", "Engagement",
  "Decorations", "Bouquets & Gifts", "Giveaways",
];

interface GalleryItem {
  id: number;
  src: string;
  thumb: string;
  alt: string;
  category: string;
  description: string;
  tall?: boolean;
}

const ITEMS: GalleryItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1755704282977-340323fa52df?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1755704282977-340323fa52df?w=700&h=500&fit=crop&auto=format",
    alt: "Elegant birthday party setup with floral decorations and balloons",
    category: "Birthdays",
    description: "A fully styled birthday setup with premium florals, balloon installation, and a curated dessert table.",
    tall: false,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1780586382191-bef9c740798e?w=1200&h=1600&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1780586382191-bef9c740798e?w=600&h=800&fit=crop&auto=format",
    alt: "Elegant white and clear balloon display for a celebration",
    category: "Birthdays",
    description: "Organic balloon installation in warm neutrals — minimal, editorial, unforgettable.",
    tall: true,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1761963503451-e064fea6a2b5?w=1200&h=1600&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1761963503451-e064fea6a2b5?w=600&h=800&fit=crop&auto=format",
    alt: "Heart-shaped floral arch with proposal sign at sunset",
    category: "Engagement",
    description: "A sunset proposal arch designed with fresh blooms and custom signage.",
    tall: true,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1536392706976-e486e2ba97af?w=1200&h=800&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1536392706976-e486e2ba97af?w=700&h=460&fit=crop&auto=format",
    alt: "Long dining table set for a dinner party with flowers and candles",
    category: "Decorations",
    description: "Full tablescape with linen runners, seasonal florals, and candlelight for an intimate dinner.",
    tall: false,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=1200&h=1600&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=600&h=800&fit=crop&auto=format",
    alt: "Pink roses wrapped in elegant paper",
    category: "Bouquets & Gifts",
    description: "Hand-tied rose bouquet in blush tones, wrapped in premium kraft and ribbon.",
    tall: true,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1623945352596-36d5d9f21f70?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1623945352596-36d5d9f21f70?w=700&h=500&fit=crop&auto=format",
    alt: "Woman in graduation gown holding a bouquet of flowers",
    category: "Graduation",
    description: "Graduation bouquet styled with white blooms and premium foliage — a gift as proud as the moment.",
    tall: false,
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1653821355226-6def361cc7ab?w=1200&h=800&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1653821355226-6def361cc7ab?w=700&h=460&fit=crop&auto=format",
    alt: "Formal dinner table set with flowers and candles",
    category: "Decorations",
    description: "A warm and elegant formal table setting for a milestone celebration.",
    tall: false,
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1518370265276-f22b706aeac8?w=1200&h=1600&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1518370265276-f22b706aeac8?w=600&h=800&fit=crop&auto=format",
    alt: "Silver engagement ring on red roses",
    category: "Engagement",
    description: "A classic romantic setup — red roses, candlelight, and a perfectly placed ring.",
    tall: true,
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1652346107876-58d7354ce9b8?w=1200&h=1600&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1652346107876-58d7354ce9b8?w=600&h=800&fit=crop&auto=format",
    alt: "White cake with fresh flowers on top",
    category: "Giveaways",
    description: "Artisan mini cakes styled and packaged as giveaway tokens for a floral-themed celebration.",
    tall: true,
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1775541398083-4e2ff8d50eab?w=1200&h=900&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1775541398083-4e2ff8d50eab?w=700&h=500&fit=crop&auto=format",
    alt: "Graduation bouquet with congratulatory banner",
    category: "Graduation",
    description: "Celebration banner and curated bouquet for a graduation surprise reveal.",
    tall: false,
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1557925923-6885735abfb1?w=1200&h=1600&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1557925923-6885735abfb1?w=600&h=800&fit=crop&auto=format",
    alt: "White and beige rose bouquet",
    category: "Bouquets & Gifts",
    description: "A soft, neutral bouquet of white and blush roses — timeless and elegant.",
    tall: true,
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1529516222410-a269d812f320?w=1200&h=800&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1529516222410-a269d812f320?w=700&h=460&fit=crop&auto=format",
    alt: "White rose bouquet in vase with tealight candles",
    category: "Decorations",
    description: "Intimate centrepiece styling with white roses and warm candlelight for a private celebration.",
    tall: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered =
    activeCategory === "All" ? ITEMS : ITEMS.filter((i) => i.category === activeCategory);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
        <Navbar />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          style={{
            paddingTop: 120,
            paddingBottom: 64,
            backgroundColor: "var(--color-secondary)",
          }}
        >
          <div className="container-wide text-center">
            <SectionLabel>Our Work</SectionLabel>
            <h1
              className="mb-4 mx-auto"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.1,
                color: "var(--color-foreground)",
                maxWidth: 640,
              }}
            >
              Moments We've Made{" "}
              <span className="italic" style={{ color: "var(--color-primary)" }}>Beautiful</span>
            </h1>
            <p className="text-base max-w-md mx-auto" style={{ color: "var(--color-muted-foreground)" }}>
              Explore a collection of celebrations, details, and designs created with care —
              each one a story in its own right.
            </p>
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
            <div className="flex items-center gap-2 py-4 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 text-sm font-medium px-5 py-2 transition-all duration-200"
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

        {/* ── Masonry Gallery ───────────────────────────────────────────────── */}
        <section className="section-pad">
          <div className="container-wide">
            {filtered.length === 0 ? (
              <p className="text-center py-20" style={{ color: "var(--color-muted-foreground)" }}>No items in this category yet.</p>
            ) : (
              <div
                style={{
                  columns: "3 280px",
                  columnGap: "12px",
                }}
              >
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden cursor-pointer"
                    style={{
                      breakInside: "avoid",
                      marginBottom: "12px",
                      borderRadius: "var(--radius)",
                      backgroundColor: "var(--color-border)",
                    }}
                    onClick={() => setLightbox(item)}
                  >
                    <img
                      src={item.thumb}
                      alt={item.alt}
                      className="w-full block transition-transform duration-700 group-hover:scale-105"
                      style={{ display: "block" }}
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: "linear-gradient(to top, rgba(42,33,24,0.75) 0%, transparent 60%)",
                      }}
                    >
                      <span
                        className="text-xs tracking-[0.2em] uppercase font-medium mb-1"
                        style={{ color: "var(--color-accent)" }}
                      >
                        {item.category}
                      </span>
                      <p className="text-sm font-light leading-snug" style={{ color: "rgba(248,245,241,0.9)" }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ backgroundColor: "var(--color-foreground)" }}
        >
          <div className="container-wide text-center">
            <SectionLabel>
              <span style={{ color: "var(--color-accent)" }}>Let's Begin</span>
            </SectionLabel>
            <h2
              className="mb-4 mx-auto"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.2,
                color: "var(--color-primary-foreground)",
                maxWidth: 560,
              }}
            >
              Have a Moment{" "}
              <span className="italic" style={{ color: "var(--color-accent)" }}>in Mind?</span>
            </h2>
            <p className="text-sm max-w-sm mx-auto mb-10 leading-relaxed" style={{ color: "rgba(248,245,241,0.55)" }}>
              Let's turn your idea into something beautiful. We'd love to hear about your occasion.
            </p>
            <Link to="/#contact" className="btn-primary">Request a Quote</Link>
          </div>
        </section>

        <Footer />
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          style={{ backgroundColor: "rgba(42,33,24,0.88)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative flex flex-col md:flex-row overflow-hidden w-full"
            style={{
              maxWidth: 960,
              maxHeight: "90vh",
              backgroundColor: "var(--color-card)",
              borderRadius: "var(--radius)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1 bg-stone-200 overflow-hidden" style={{ minHeight: 300 }}>
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="w-full h-full object-cover"
                style={{ maxHeight: "90vh" }}
              />
            </div>

            {/* Info panel */}
            <div
              className="flex flex-col justify-between p-7 md:p-9"
              style={{ minWidth: 260, maxWidth: 320 }}
            >
              <div>
                <span
                  className="text-xs tracking-[0.25em] uppercase font-medium mb-3 inline-block"
                  style={{ color: "var(--color-primary)" }}
                >
                  {lightbox.category}
                </span>
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {lightbox.description}
                </p>
                <Link to="/#contact" className="btn-primary block text-center" onClick={() => setLightbox(null)}>
                  Request a Quote
                </Link>
              </div>
              <p className="text-xs mt-6" style={{ color: "var(--color-muted-foreground)" }}>
                Press <kbd className="font-mono">Esc</kbd> or click outside to close
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center transition-opacity duration-200 hover:opacity-70"
              style={{
                backgroundColor: "rgba(42,33,24,0.6)",
                color: "#fff",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
