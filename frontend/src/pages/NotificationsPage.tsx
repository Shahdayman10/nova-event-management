import { useEffect, useState } from "react";
import { Footer, Navbar, SectionLabel, globalStyles } from "../components/shared";
import api from "../services/api";

interface NoticeItem { id: string; data: { message?: string; status?: string; event_type?: string }; read_at: string | null; created_at: string }

export default function NotificationsPage() {
  const [items, setItems] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get("/notifications"); setItems(data.notifications ?? []); }
    catch { setError("Unable to load notifications."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const markRead = async (item: NoticeItem) => {
    try { await api.patch(`/notifications/${item.id}/read`); setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, read_at: new Date().toISOString() } : entry)); }
    catch { setError("Unable to update notification."); }
  };

  return <>
    <style>{globalStyles}</style>
    <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}><Navbar />
      <section className="section-pad" style={{ paddingTop: 150, minHeight: "70vh", backgroundColor: "var(--color-secondary)" }}><div className="container-wide max-w-4xl">
        <SectionLabel>Your account</SectionLabel><h1 className="mb-8" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem, 4vw, 3rem)" }}>Notifications</h1>
        {loading ? <p role="status">Loading notifications…</p> : error ? <p role="alert" style={{ color: "#a33" }}>{error}</p> : items.length === 0 ? <p className="rounded-[var(--radius)] border p-8 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>No notifications yet.</p> : <div className="grid gap-3">
          {items.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius)] border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", opacity: item.read_at ? 0.75 : 1 }}>
            <div><p>{item.data.message ?? `Your ${item.data.event_type ?? "event"} request was updated.`}</p><time className="mt-2 block text-xs" style={{ color: "var(--color-muted-foreground)" }}>{new Date(item.created_at).toLocaleString()}</time></div>
            {!item.read_at && <button type="button" className="btn-ghost" onClick={() => void markRead(item)}>Mark read</button>}
          </article>)}
        </div>}
      </div></section><Footer />
    </div>
  </>;
}