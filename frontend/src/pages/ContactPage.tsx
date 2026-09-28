import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Footer, SectionLabel, globalStyles } from "../components/shared";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How far in advance should I request a service?",
    a: "We recommend reaching out at least 3–4 weeks before your event to secure your date and allow adequate time for planning and preparation. For peak seasons or larger events, 6–8 weeks in advance is ideal.",
  },
  {
    q: "Can I customize a package?",
    a: "Absolutely. Every NOVA package is a starting point, not a limit. During your consultation we listen to your vision and adjust the scope, décor choices, and inclusions to match exactly what you have in mind.",
  },
  {
    q: "Do you provide decorations for small home events?",
    a: "Yes — in fact, some of our most beautiful work has been done in private homes. We're experienced with indoor residential spaces and work with whatever the space allows to create something truly special.",
  },
  {
    q: "Can I request a service that isn't listed?",
    a: "Of course. Our listed services are a guide, not a ceiling. If you have a specific idea or a combination of services in mind, reach out and we'll work together to bring it to life.",
  },
  {
    q: "How does the quote process work?",
    a: "Simply fill out our contact form or send us a message with a few details about your occasion. We'll review your request and respond within 1–2 business days with a tailored proposal and price estimate.",
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.28 8.28 0 004.83 1.56V6.79a4.84 4.84 0 01-1.07-.1z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [packages, setPackages] = useState<{ id: number; name: string; service_id?: number }[]>([]);
  const [form, setForm] = useState({
    service_id: "",
    package_id: "",
    event_type: "",
    event_date: "",
    event_location: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const state = location.state as { service_id?: number; package_id?: number; quote?: typeof form } | null;
    if (state?.quote || state?.service_id || state?.package_id) {
      setForm((current) => ({
        ...current,
        ...(state.quote ?? {}),
        service_id: state.service_id ? String(state.service_id) : current.service_id,
        package_id: state.package_id ? String(state.package_id) : current.package_id,
      }));
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: servicesData }, { data: packagesData }] = await Promise.all([
          api.get("/services"),
          api.get("/packages"),
        ]);
        setServices((servicesData.services ?? []).map((item: { id: number; name: string }) => ({ id: item.id, name: item.name })));
        setPackages((packagesData.packages ?? []).map((item: { id: number; name: string; service_id?: number }) => ({ id: item.id, name: item.name, service_id: item.service_id })));
      } catch {
        // silently ignore and keep UI default; backend may still be unavailable
      }
    };

    void fetchData();
  }, []);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.service_id) e.service_id = "Please choose a service.";
    if (!form.event_type.trim()) e.event_type = "Please tell us the type of event.";
    if (!form.event_date) e.event_date = "Please choose an event date.";
    if (!form.event_location.trim()) e.event_location = "Please tell us the event location.";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); setSubmitError(null); return; }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/contact", quote: form } });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.post("/quote-requests", {
        service_id: Number(form.service_id),
        package_id: form.package_id ? Number(form.package_id) : undefined,
        event_type: form.event_type,
        event_date: form.event_date,
        event_location: form.event_location,
        message: form.message || undefined,
      });
      setSent(true);
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response
        ? (err.response as { data?: { message?: string } }).data?.message || "Unable to submit your request right now."
        : "Unable to submit your request right now.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (
    id: keyof typeof form,
    label: string,
    placeholder: string,
    type = "text",
    textarea = false,
  ) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs tracking-wider uppercase" style={{ color: "var(--color-muted-foreground)" }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          placeholder={placeholder}
          value={form[id]}
          onChange={(e) => { setForm({ ...form, [id]: e.target.value }); setErrors({ ...errors, [id]: undefined }); }}
          className="form-input resize-none"
          style={{ borderColor: errors[id] ? "#c0392b" : undefined }}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={form[id]}
          onChange={(e) => { setForm({ ...form, [id]: e.target.value }); setErrors({ ...errors, [id]: undefined }); }}
          className="form-input"
          style={{ borderColor: errors[id] ? "#c0392b" : undefined }}
        />
      )}
      {errors[id] && (
        <p className="text-xs" style={{ color: "#b94040" }}>{errors[id]}</p>
      )}
    </div>
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
            paddingBottom: 64,
            backgroundColor: "var(--color-secondary)",
          }}
        >
          <div className="container-wide text-center">
            <SectionLabel>Get in Touch</SectionLabel>
            <h1
              className="mb-4 mx-auto"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
                lineHeight: 1.1,
                color: "var(--color-foreground)",
                maxWidth: 640,
              }}
            >
              Let's Talk About{" "}
              <span className="italic" style={{ color: "var(--color-primary)" }}>
                Your Celebration
              </span>
            </h1>
            <p className="text-base max-w-md mx-auto" style={{ color: "var(--color-muted-foreground)" }}>
              Have a question, an idea, or a special occasion coming up? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* ── Main two-column ───────────────────────────────────────────────── */}
        <section className="section-pad" style={{ backgroundColor: "var(--color-background)" }}>
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

              {/* Left: Contact info */}
              <div>
                <SectionLabel>Contact Information</SectionLabel>
                <h2 className="display-heading mb-8">Reach Us Directly</h2>

                <div className="flex flex-col gap-4 mb-10">
                  {[
                    {
                      label: "Email",
                      value: "Use the quote request form",
                      sub: "Your request is saved to your account",
                      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
                    },
                    {
                      label: "Location",
                      value: "NOVA event planning",
                      sub: "Tell us where your event will take place",
                      icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></>,
                    },
                    {
                      label: "Working Hours",
                      value: "Customer support",
                      sub: "Send us your event details",
                      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    },
                  ].map(({ label, value, sub, icon }) => (
                    <div
                      key={label}
                      className="flex gap-4 items-start p-5"
                      style={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius)",
                      }}
                    >
                      <div
                        className="w-10 h-10 flex items-center justify-center shrink-0 rounded-sm"
                        style={{ backgroundColor: "var(--color-muted)", color: "var(--color-primary)" }}
                      >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
                      </div>
                      <div>
                        <p className="text-xs tracking-wider uppercase mb-0.5" style={{ color: "var(--color-muted-foreground)" }}>{label}</p>
                        <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{value}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social links */}
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "var(--color-muted-foreground)" }}>
                    Follow Us
                  </p>
                  <div className="flex gap-3">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="w-10 h-10 flex items-center justify-center transition-colors duration-200"
                        style={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius)",
                          color: "var(--color-muted-foreground)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary)";
                          (e.currentTarget as HTMLElement).style.color = "var(--color-primary-foreground)";
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-card)";
                          (e.currentTarget as HTMLElement).style.color = "var(--color-muted-foreground)";
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                        }}
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div
                className="p-8 md:p-10"
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
              >
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <div
                      className="w-14 h-14 flex items-center justify-center rounded-full mb-5"
                      style={{ backgroundColor: "var(--color-muted)", color: "var(--color-primary)" }}
                    >
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3
                      className="text-2xl mb-3"
                      style={{ fontFamily: "var(--font-serif)", color: "var(--color-foreground)" }}
                    >
                      Message Sent
                    </h3>
                    <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
                      Thank you for reaching out. We'll review your message and get back to you within 1–2 business days.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ service_id: "", package_id: "", event_type: "", event_date: "", event_location: "", message: "" }); }}
                      className="btn-ghost mt-8"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <h3
                      className="text-xl mb-2"
                      style={{ fontFamily: "var(--font-serif)", color: "var(--color-foreground)" }}
                    >
                      Request a Quote
                    </h3>

                    <label className="flex flex-col gap-1.5 text-xs uppercase" style={{ color: "var(--color-muted-foreground)" }}>Service
                      <select required value={form.service_id} onChange={(event) => { setForm({ ...form, service_id: event.target.value, package_id: "" }); setErrors({ ...errors, service_id: undefined }); }} className="form-input">
                        <option value="">Choose a service</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
                      </select>{errors.service_id && <span style={{ color: "#b94040" }}>{errors.service_id}</span>}
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs uppercase" style={{ color: "var(--color-muted-foreground)" }}>Package (optional)
                      <select value={form.package_id} onChange={(event) => setForm({ ...form, package_id: event.target.value })} className="form-input">
                        <option value="">No package selected</option>{packages.filter((pkg) => !form.service_id || pkg.service_id === Number(form.service_id)).map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
                      </select>
                    </label>
                    {field("event_type", "Type of event", "Birthday, engagement, graduation…")}
                    {field("event_date", "Event date", "", "date")}
                    {field("event_location", "Event location", "City or venue")}
                    {field("message", "Message", "Share your vision and any helpful details…", "text", true)}
                    {!isAuthenticated && <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Sign in or create an account to submit your request. Your details will remain here while you sign in.</p>}
                    {submitError && <p role="alert" className="text-sm" style={{ color: "#b94040" }}>{submitError}</p>}

                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-1">
                      {isSubmitting ? "Submitting…" : "Submit quote request"}
                    </button>

                    <p className="text-xs text-center" style={{ color: "var(--color-muted-foreground)" }}>
                      New requests start as Pending and appear under My Requests.
                    </p>
                  </form>
                )}
              </div>

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
                <SectionLabel>FAQ</SectionLabel>
                <h2 className="display-heading mb-4">Frequently Asked Questions</h2>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--color-muted-foreground)" }}>
                  Everything you need to know about working with NOVA. Still have a question?
                  Send us a message — we're happy to help.
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
                        border: "none",
                      }}
                    >
                      <span className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                        {faq.q}
                      </span>
                      <span
                        className="shrink-0"
                        style={{
                          color: "var(--color-primary)",
                          transform: openFaq === i ? "rotate(45deg)" : "none",
                          display: "inline-block",
                          transition: "transform 0.2s",
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
          className="section-pad"
          style={{ backgroundColor: "var(--color-foreground)" }}
        >
          <div className="container-wide text-center">
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
              Ready to Plan{" "}
              <span className="italic" style={{ color: "var(--color-accent)" }}>
                Your Moment?
              </span>
            </h2>
            <p className="text-sm max-w-sm mx-auto mb-10 leading-relaxed" style={{ color: "rgba(248,245,241,0.55)" }}>
              Tell us about your occasion and we'll take care of every beautiful detail from here.
            </p>
            <Link to="/contact" className="btn-primary" onClick={() => window.scrollTo(0, 0)}>
              Request a Quote
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
