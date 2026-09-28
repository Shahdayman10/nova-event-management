import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Footer, SectionLabel, globalStyles } from "../components/shared";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let destination = "/";
      let destinationState: unknown;
      if (mode === "register") {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        });
      } else {
        const authenticatedUser = await login({
          email: form.email,
          password: form.password,
        });
        destination = authenticatedUser.role === "admin" ? "/admin" : "/";
      }

      const returnState = location.state as { from?: string; quote?: unknown } | null;
      if (returnState?.from && returnState.from !== "/admin" && destination !== "/admin") {
        destination = returnState.from;
        destinationState = returnState.quote ? { quote: returnState.quote } : undefined;
      }

      navigate(destination, { state: destinationState });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response
          ? (err.response as { data?: { message?: string } }).data?.message || "Something went wrong."
          : "Something went wrong.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
        <Navbar />
        <section className="section-pad" style={{ paddingTop: 160, backgroundColor: "var(--color-secondary)" }}>
          <div className="container-wide">
            <div className="mx-auto max-w-xl rounded-[var(--radius)] border" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", padding: "2rem" }}>
              <SectionLabel>{mode === "login" ? "Welcome back" : "Create account"}</SectionLabel>
              <h1 className="mb-6" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--color-foreground)" }}>
                {mode === "login" ? "Login to NOVA" : "Register for NOVA"}
              </h1>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {mode === "register" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs tracking-wider uppercase" style={{ color: "var(--color-muted-foreground)" }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="form-input"
                      placeholder="Your full name"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-wider uppercase" style={{ color: "var(--color-muted-foreground)" }}>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-wider uppercase" style={{ color: "var(--color-muted-foreground)" }}>Password</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>

                {mode === "register" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs tracking-wider uppercase" style={{ color: "var(--color-muted-foreground)" }}>Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={form.password_confirmation}
                      onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                      className="form-input"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {error && (
                  <div className="rounded-md border border-red-200 px-3 py-2 text-sm" style={{ backgroundColor: "rgba(190, 60, 60, 0.05)", color: "#b94040" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-center" style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
                </button>
              </form>

              <p className="mt-6 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
                <Link to={mode === "login" ? "/register" : "/login"} state={location.state} style={{ color: "var(--color-primary)" }}>
                  {mode === "login" ? "Register here" : "Login here"}
                </Link>
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
