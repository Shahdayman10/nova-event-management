import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Footer, Navbar, SectionLabel, globalStyles } from "../components/shared";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoritesPage() {
  const { services, packages, loading, error, refresh, toggle } = useFavorites();

  useEffect(() => { void refresh(); }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
        <Navbar />
        <section className="section-pad" style={{ paddingTop: 150, minHeight: "70vh", backgroundColor: "var(--color-secondary)" }}>
          <div className="container-wide">
            <SectionLabel>Your NOVA</SectionLabel>
            <h1 className="mb-8" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem, 4vw, 3rem)" }}>Favorites</h1>
            {loading ? <p role="status" className="py-12 text-center">Loading favorites…</p> : error ? <p role="alert" className="py-12 text-center" style={{ color: "#a33" }}>{error}</p> : null}
            {!loading && !error && services.length + packages.length === 0 && (
              <div className="rounded-[var(--radius)] border p-10 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                <p style={{ color: "var(--color-muted-foreground)" }}>You have not saved any services or packages yet.</p>
                <Link to="/services" className="btn-primary mt-5">Explore services</Link>
              </div>
            )}
            <div className="grid gap-8">
              {services.length > 0 && <section>
                <h2 className="mb-4 text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Services</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {services.map((item) => <article key={item.id} className="flex items-center justify-between gap-4 rounded-[var(--radius)] border p-4" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <div><h3 className="font-medium">{item.name}</h3><p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{item.description}</p></div>
                    <div className="flex shrink-0 items-center gap-3"><Link to={`/services/${item.id}`} className="text-sm" style={{ color: "var(--color-primary)" }}>View</Link><button type="button" aria-label={`Remove ${item.name} from favorites`} className="btn-ghost" onClick={() => void toggle("services", item.id)}>Remove</button></div>
                  </article>)}
                </div>
              </section>}
              {packages.length > 0 && <section>
                <h2 className="mb-4 text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Packages</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {packages.map((item) => <article key={item.id} className="flex items-center justify-between gap-4 rounded-[var(--radius)] border p-4" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <div><h3 className="font-medium">{item.name}</h3><p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{item.service?.name} · {item.price == null ? "Price on request" : item.price}</p></div>
                    <button type="button" aria-label={`Remove ${item.name} from favorites`} className="btn-ghost shrink-0" onClick={() => void toggle("packages", item.id)}>Remove</button>
                  </article>)}
                </div>
              </section>}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}