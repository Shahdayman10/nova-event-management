import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer, Navbar, SectionLabel, globalStyles } from "../components/shared";
import api from "../services/api";

interface QuoteRequest {
  id: number;
  service_id: number;
  package_id?: number | null;
  event_type: string;
  event_date: string;
  event_location: string;
  message?: string | null;
  status: string;
  service?: { name?: string };
  package?: { name?: string };
  review?: { id: number } | null;
}

interface EligibleQuote {
  id: number;
  event_type: string;
  service?: { name?: string };
}

export default function CustomerQuotesPage() {
  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eligibleQuotes, setEligibleQuotes] = useState<EligibleQuote[]>([]);
  const [reviewDrafts, setReviewDrafts] = useState<Record<number, { rating: string; comment: string }>>({});
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const [{ data }, { data: eligibleData }] = await Promise.all([
          api.get("/quote-requests"),
          api.get("/reviews/eligible"),
        ]);
        setItems(data.quote_requests ?? []);
        setEligibleQuotes(eligibleData.quote_requests ?? []);
      } catch (err: unknown) {
        const message = err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response
          ? (err.response as { data?: { message?: string } }).data?.message || "Unable to load quotes."
          : "Unable to load quotes.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchQuotes();
  }, []);

  const submitReview = async (quote: EligibleQuote) => {
    const draft = reviewDrafts[quote.id];
    try {
      await api.post("/reviews", { quote_request_id: quote.id, rating: Number(draft?.rating), comment: draft?.comment ?? "" });
      setEligibleQuotes((current) => current.filter((item) => item.id !== quote.id));
      setReviewMessage("Your review was submitted and is awaiting approval.");
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response
        ? (err.response as { data?: { message?: string } }).data?.message || "Unable to submit review."
        : "Unable to submit review.";
      setError(message);
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
        <Navbar />
        <section className="section-pad" style={{ paddingTop: 160, backgroundColor: "var(--color-secondary)" }}>
          <div className="container-wide">
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <SectionLabel>My Requests</SectionLabel>
                <h1 className="mb-0" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem, 4vw, 3rem)", color: "var(--color-foreground)" }}>
                  Quote History
                </h1>
              </div>
              <Link to="/contact" className="btn-primary">
                New Quote Request
              </Link>
            </div>

            {loading ? (
              <div className="rounded-[var(--radius)] border p-8 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                Loading your quote requests…
              </div>
            ) : error ? (
              <div className="rounded-[var(--radius)] border p-8 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", color: "#b94040" }}>
                {error}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-[var(--radius)] border p-10 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                <p className="text-lg" style={{ fontFamily: "var(--font-serif)" }}>No quote requests yet.</p>
                <p className="mt-2 text-sm" style={{ color: "var(--color-muted-foreground)" }}>Your request history will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-5">
                {items.map((item) => (
                  <article key={item.id} className="rounded-[var(--radius)] border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-xs tracking-[0.25em] uppercase" style={{ color: "var(--color-primary)" }}>{item.service?.name || "Service"}</p>
                        <h3 className="mt-2 text-xl" style={{ fontFamily: "var(--font-serif)", color: "var(--color-foreground)" }}>{item.event_type}</h3>
                      </div>
                      <span className="inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em]" style={{ backgroundColor: "var(--color-muted)", color: "var(--color-foreground)" }}>
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] mb-1">Date</p>
                        <p style={{ color: "var(--color-foreground)" }}>{new Date(item.event_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] mb-1">Location</p>
                        <p style={{ color: "var(--color-foreground)" }}>{item.event_location}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] mb-1">Package</p>
                        <p style={{ color: "var(--color-foreground)" }}>{item.package?.name || "Not selected"}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] mb-1">Message</p>
                        <p style={{ color: "var(--color-foreground)" }}>{item.message || "—"}</p>
                      </div>
                    </div>
                    {eligibleQuotes.some((quote) => quote.id === item.id) && (
                      <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
                        <p className="mb-3 font-medium">Share your experience</p>
                        <div className="grid gap-3 sm:grid-cols-[150px_1fr_auto]">
                          <label className="grid gap-1 text-xs">Rating<select className="form-input" value={reviewDrafts[item.id]?.rating ?? "5"} onChange={(event) => setReviewDrafts((current) => ({ ...current, [item.id]: { rating: event.target.value, comment: current[item.id]?.comment ?? "" } }))}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label>
                          <label className="grid gap-1 text-xs">Review<textarea required maxLength={3000} rows={2} className="form-input" value={reviewDrafts[item.id]?.comment ?? ""} onChange={(event) => setReviewDrafts((current) => ({ ...current, [item.id]: { rating: current[item.id]?.rating ?? "5", comment: event.target.value } }))} /></label>
                          <button type="button" className="btn-primary self-end" disabled={!reviewDrafts[item.id]?.comment.trim()} onClick={() => void submitReview({ id: item.id, event_type: item.event_type, service: item.service })}>Submit review</button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
            {reviewMessage && <p role="status" className="mt-5 text-sm" style={{ color: "#356b50" }}>{reviewMessage}</p>}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
