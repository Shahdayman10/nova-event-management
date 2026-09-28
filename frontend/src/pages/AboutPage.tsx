import { Link } from "react-router-dom";
import { Navbar, Footer, SectionLabel, globalStyles } from "../components/shared";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    number: "01",
    title: "Thoughtful Design",
    description:
      "Every detail should have a purpose and reflect the feeling of your occasion. We don't add things — we compose them.",
  },
  {
    number: "02",
    title: "Personal Touch",
    description:
      "No two celebrations are exactly alike. We design around your story, your preferences, and the people who matter most to you.",
  },
  {
    number: "03",
    title: "Quality & Care",
    description:
      "We focus on beautiful presentation, careful preparation, and attention to detail — from the first consultation to the final setup.",
  },
  {
    number: "04",
    title: "Meaningful Moments",
    description:
      "Our goal is not simply to decorate a space, but to help create memories that last far beyond the event itself.",
  },
];

const WHYS = [
  "Personalized event styling for every occasion",
  "Carefully selected florals, décor, and details",
  "Flexible packages that fit your budget and vision",
  "Friendly consultation with no pressure or rush",
  "Reliable setup and full day-of coordination",
];

const PROCESS = [
  {
    step: "01",
    title: "Tell Us Your Vision",
    description:
      "Reach out and share your occasion, ideas, and preferences. We listen carefully before we plan anything.",
  },
  {
    step: "02",
    title: "We Plan the Details",
    description:
      "We put together a tailored proposal — styling concept, package recommendation, and a clear timeline.",
  },
  {
    step: "03",
    title: "We Create the Experience",
    description:
      "Our team handles every element of setup, coordination, and styling so everything is ready when you arrive.",
  },
  {
    step: "04",
    title: "You Enjoy the Moment",
    description:
      "On the day, all you need to do is show up and be present. We've taken care of every beautiful detail.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
        <Navbar />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            backgroundColor: "var(--color-secondary)",
          }}
        >
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div>
                <SectionLabel>About NOVA</SectionLabel>
                <h1
                  className="mb-5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
                    lineHeight: 1.1,
                    color: "var(--color-foreground)",
                  }}
                >
                  Thoughtful Details.{" "}
                  <span className="italic" style={{ color: "var(--color-primary)" }}>
                    Meaningful Moments.
                  </span>
                </h1>
                <p className="text-base leading-relaxed max-w-md" style={{ color: "var(--color-muted-foreground)" }}>
                  At NOVA, we believe the smallest details can turn an ordinary gathering into a
                  moment worth remembering — and worth celebrating for years to come.
                </p>
              </div>
              <div
                className="overflow-hidden bg-stone-200"
                style={{ borderRadius: "var(--radius)", aspectRatio: "4/3" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1738669469820-259d9c7189bb?w=900&h=675&fit=crop&auto=format"
                  alt="Elegant table set with flowers and candles for a celebration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Our Story ─────────────────────────────────────────────────────── */}
        <section className="section-pad" style={{ backgroundColor: "var(--color-background)" }}>
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div
                className="overflow-hidden bg-stone-300"
                style={{ borderRadius: "var(--radius)", aspectRatio: "4/5" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1785339678169-9b19ecb4c443?w=700&h=875&fit=crop&auto=format"
                  alt="White orchids and candles in an elegant floral arrangement"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <SectionLabel>Our Story</SectionLabel>
                <h2 className="display-heading mb-6">
                  Born from a belief in{" "}
                  <span className="italic" style={{ color: "var(--color-primary)" }}>
                    beautiful beginnings
                  </span>
                </h2>
                <div className="flex flex-col gap-4" style={{ color: "var(--color-muted-foreground)" }}>
                  <p className="text-sm leading-loose">
                    NOVA was created with a simple belief: every celebration — no matter how
                    intimate or how grand — deserves to be approached with thought, care, and
                    genuine creativity. We started as a small event styling studio focused on the
                    details that most people overlook, and quickly discovered how much those
                    details mean to the people celebrating.
                  </p>
                  <p className="text-sm leading-loose">
                    Today, we help individuals and families mark their most meaningful occasions
                    through carefully considered event styling, decoration, florals, gifts, and
                    personalized giveaways. From a quiet birthday dinner to an engagement
                    proposal that takes someone's breath away, our work is always personal,
                    always intentional, and always made with love.
                  </p>
                  <p className="text-sm leading-loose">
                    Our name, NOVA, reflects that belief — a nova is a star that suddenly shines
                    brighter. We're here to help your moment shine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What We Believe ───────────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          <div className="container-wide">
            <div className="text-center mb-14">
              <SectionLabel>Our Values</SectionLabel>
              <h2 className="display-heading">What We Believe</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.number}
                  className="flex gap-6 p-7"
                  style={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                >
                  <p
                    className="text-4xl font-light shrink-0 leading-none"
                    style={{ fontFamily: "var(--font-serif)", color: "var(--color-border)" }}
                  >
                    {v.number}
                  </p>
                  <div>
                    <h3
                      className="text-base font-medium mb-2"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {v.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why NOVA ──────────────────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ backgroundColor: "var(--color-foreground)" }}
        >
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel>
                  <span style={{ color: "var(--color-accent)" }}>Why NOVA?</span>
                </SectionLabel>
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                    lineHeight: 1.2,
                    color: "var(--color-primary-foreground)",
                  }}
                >
                  We treat every celebration like{" "}
                  <span className="italic" style={{ color: "var(--color-accent)" }}>
                    the only one
                  </span>
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(248,245,241,0.58)" }}>
                  From the moment you reach out to the moment you walk into your event, NOVA is
                  committed to making the experience as beautiful as the occasion itself.
                </p>
                <ul className="flex flex-col gap-4">
                  {WHYS.map((w) => (
                    <li key={w} className="flex items-start gap-4">
                      <span
                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-sm mt-0.5"
                        style={{ backgroundColor: "rgba(201,180,154,0.14)", color: "var(--color-accent)" }}
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: "rgba(248,245,241,0.75)" }}>
                        {w}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="overflow-hidden bg-stone-400"
                style={{ borderRadius: "var(--radius)", aspectRatio: "4/5" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1529516222410-a269d812f320?w=700&h=875&fit=crop&auto=format"
                  alt="White rose bouquet in vase with tealight candles — intimate styling"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Process ───────────────────────────────────────────────────────── */}
        <section className="section-pad" style={{ backgroundColor: "var(--color-muted)" }}>
          <div className="container-wide">
            <div className="text-center mb-14">
              <SectionLabel>How It Works</SectionLabel>
              <h2 className="display-heading">From Idea to Memory</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS.map((step, i) => (
                <div key={step.step} className="relative">
                  {/* Connector line */}
                  {i < PROCESS.length - 1 && (
                    <div
                      className="hidden lg:block absolute top-5 right-0 w-1/2 h-px"
                      style={{
                        backgroundColor: "var(--color-border)",
                        left: "60%",
                      }}
                    />
                  )}
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-sm mb-5"
                    style={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <span
                      className="text-xs font-medium tracking-widest"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3
                    className="text-base font-medium mb-2"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: "var(--color-background)", padding: "80px 0" }}
        >
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <div className="container-wide relative text-center">
            <SectionLabel>Let's Begin</SectionLabel>
            <h2
              className="mb-4 mx-auto max-w-xl"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.2,
                color: "var(--color-foreground)",
              }}
            >
              Your Moment Deserves Something{" "}
              <span className="italic" style={{ color: "var(--color-primary)" }}>Special</span>
            </h2>
            <p className="text-sm max-w-md mx-auto mb-10 leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
              Reach out and let's start planning something beautiful together.
            </p>
            <Link to="/contact" className="btn-primary">Start Planning</Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
