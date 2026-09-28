import { useState, type FormEvent } from "react";
import { Footer, Navbar, SectionLabel, globalStyles } from "../components/shared";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const payload: Record<string, string> = { name, email };
      if (password) {
        payload.current_password = currentPassword;
        payload.password = password;
        payload.password_confirmation = passwordConfirmation;
      }
      await api.put("/profile", payload);
      await refreshUser();
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setNotice("Your profile has been updated.");
    } catch (err: unknown) {
      const data = err && typeof err === "object" && "response" in err ? (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }).response?.data : undefined;
      setError(data?.message ?? Object.values(data?.errors ?? {}).flat()[0] ?? "Unable to update your profile.");
    } finally {
      setBusy(false);
    }
  };

  return <>
    <style>{globalStyles}</style>
    <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
      <Navbar />
      <section className="section-pad" style={{ paddingTop: 150, minHeight: "70vh", backgroundColor: "var(--color-secondary)" }}>
        <div className="container-wide max-w-3xl">
          <SectionLabel>Your account</SectionLabel>
          <h1 className="mb-8" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem, 4vw, 3rem)" }}>Profile</h1>
          <form onSubmit={(event) => void submit(event)} className="grid gap-5 rounded-[var(--radius)] border p-6 md:p-8" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
            <label className="grid gap-2 text-sm">Name<input required maxLength={255} className="form-input" value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label className="grid gap-2 text-sm">Email<input required type="email" className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <div className="border-t pt-5" style={{ borderColor: "var(--color-border)" }}><h2 className="mb-1 text-xl" style={{ fontFamily: "var(--font-serif)" }}>Change password</h2><p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Leave these fields blank to keep your current password.</p></div>
            <label className="grid gap-2 text-sm">Current password<input type="password" autoComplete="current-password" className="form-input" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
            <label className="grid gap-2 text-sm">New password<input type="password" minLength={8} autoComplete="new-password" className="form-input" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <label className="grid gap-2 text-sm">Confirm new password<input type="password" minLength={8} autoComplete="new-password" className="form-input" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} /></label>
            {error && <p role="alert" style={{ color: "#a33" }}>{error}</p>}{notice && <p role="status" style={{ color: "#356b50" }}>{notice}</p>}
            <div><button className="btn-primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button></div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  </>;
}