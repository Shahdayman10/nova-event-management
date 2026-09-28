import { useEffect, useState, type FormEvent } from "react";
import { Footer, Navbar, SectionLabel, globalStyles } from "../components/shared";
import api from "../services/api";

type AdminSection = "overview" | "services" | "packages" | "quotes" | "reviews" | "customers";
type QuoteStatus = "pending" | "confirmed" | "completed";

interface ServiceItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  packages_count: number;
}

interface PackageItem {
  id: number;
  service_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number | string | null;
  features: string[] | null;
  image: string | null;
  is_active: boolean;
  service?: { name?: string };
}

interface QuoteAdminItem {
  id: number;
  event_type: string;
  event_date: string;
  event_location: string;
  message: string | null;
  status: QuoteStatus;
  user?: { name?: string; email?: string };
  service?: { name?: string };
  package?: { name?: string } | null;
}

interface AdminReview {
  id: number;
  rating: number;
  comment: string;
  is_visible: boolean;
  created_at: string;
  user?: { name?: string; email?: string };
  service?: { name?: string };
  quote_request?: { event_type?: string; status?: string };
}

interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  created_at: string;
  quote_requests_count: number;
  reviews_count: number;
}

interface ServiceForm {
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface PackageForm {
  service_id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  features: string;
  image: string;
}

const blankService: ServiceForm = { name: "", slug: "", description: "", image: "" };
const blankPackage: PackageForm = {
  service_id: "",
  name: "",
  slug: "",
  description: "",
  price: "",
  features: "",
  image: "",
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "response" in error) {
    const response = error.response;
    if (response && typeof response === "object" && "data" in response) {
      const data = response.data;
      if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
        return data.message;
      }
    }
  }
  return fallback;
}

function formatDate(value: string) {
  if (!value) return "Not provided";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function statusLabel(status: QuoteStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function StatusTag({ status }: { status: QuoteStatus | boolean }) {
  const active = typeof status === "boolean" ? status : status !== "pending";
  const label = typeof status === "boolean" ? (status ? "Active" : "Inactive") : statusLabel(status);
  const color = typeof status === "boolean"
    ? (status ? "#356b50" : "#8b554c")
    : status === "completed" ? "#356b50" : status === "confirmed" ? "#8b6e5a" : "#8b554c";

  return (
    <span className="inline-flex rounded-full px-3 py-1 text-xs" style={{ backgroundColor: `${color}14`, color }}>
      {label}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [section, setSection] = useState<AdminSection>("overview");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteAdminItem[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [serviceEditor, setServiceEditor] = useState<ServiceItem | null | false>(false);
  const [packageEditor, setPackageEditor] = useState<PackageItem | null | false>(false);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(blankService);
  const [packageForm, setPackageForm] = useState<PackageForm>(blankPackage);
  const [saving, setSaving] = useState(false);
  const [busyItem, setBusyItem] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | QuoteStatus>("all");

  const fetchDashboard = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const [servicesRes, packagesRes, quotesRes, reviewsRes, customersRes] = await Promise.all([
        api.get("/admin/services"),
        api.get("/admin/packages"),
        api.get("/admin/quote-requests"),
        api.get("/admin/reviews"),
        api.get("/admin/customers"),
      ]);
      setServices(servicesRes.data.data ?? []);
      setPackages(packagesRes.data.data ?? []);
      setQuoteRequests(quotesRes.data.data ?? []);
      setReviews(reviewsRes.data.reviews ?? []);
      setCustomers(customersRes.data.customers ?? []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to load admin data. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboard(true);
  }, []);

  const openServiceEditor = (service?: ServiceItem) => {
    setServiceEditor(service ?? null);
    setServiceForm(service
      ? { name: service.name, slug: service.slug, description: service.description ?? "", image: service.image ?? "" }
      : blankService);
    setError(null);
  };

  const openPackageEditor = (pkg?: PackageItem) => {
    setPackageEditor(pkg ?? null);
    setPackageForm(pkg
      ? {
          service_id: String(pkg.service_id),
          name: pkg.name,
          slug: pkg.slug,
          description: pkg.description ?? "",
          price: pkg.price == null ? "" : String(pkg.price),
          features: (pkg.features ?? []).join("\n"),
          image: pkg.image ?? "",
        }
      : { ...blankPackage, service_id: services[0] ? String(services[0].id) : "" });
    setError(null);
  };

  const saveService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...serviceForm,
        slug: serviceForm.slug.trim() || serviceForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        description: serviceForm.description || null,
        image: serviceForm.image || null,
      };
      if (serviceEditor) await api.put(`/admin/services/${serviceEditor.id}`, payload);
      else await api.post("/admin/services", payload);
      setServiceEditor(false);
      setNotice(serviceEditor ? "Service updated." : "Service created.");
      await fetchDashboard();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to save this service."));
    } finally {
      setSaving(false);
    }
  };

  const savePackage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        service_id: Number(packageForm.service_id),
        name: packageForm.name,
        slug: packageForm.slug.trim() || packageForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        description: packageForm.description || null,
        price: packageForm.price.trim() === "" ? null : Number(packageForm.price),
        features: packageForm.features.split("\n").map((feature) => feature.trim()).filter(Boolean),
        image: packageForm.image || null,
      };
      if (packageEditor) await api.put(`/admin/packages/${packageEditor.id}`, payload);
      else await api.post("/admin/packages", payload);
      setPackageEditor(false);
      setNotice(packageEditor ? "Package updated." : "Package created.");
      await fetchDashboard();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to save this package."));
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (type: "service" | "package", id: number) => {
    const key = `${type}-${id}`;
    setBusyItem(key);
    setError(null);
    try {
      await api.patch(`/admin/${type === "service" ? "services" : "packages"}/${id}/status`);
      await fetchDashboard();
    } catch (err: unknown) {
      setError(getErrorMessage(err, `Unable to update ${type} status.`));
    } finally {
      setBusyItem(null);
    }
  };

  const updateQuoteStatus = async (quote: QuoteAdminItem, status: QuoteStatus) => {
    setBusyItem(`quote-${quote.id}`);
    setError(null);
    try {
      await api.patch(`/admin/quote-requests/${quote.id}/status`, { status });
      setQuoteRequests((current) => current.map((item) => item.id === quote.id ? { ...item, status } : item));
      setNotice(`Request #${quote.id} marked ${status}.`);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to update request status."));
    } finally {
      setBusyItem(null);
    }
  };

  const toggleReviewVisibility = async (review: AdminReview) => {
    setBusyItem(`review-${review.id}`);
    setError(null);
    try {
      const { data } = await api.patch(`/admin/reviews/${review.id}/visibility`);
      setReviews((current) => current.map((item) => item.id === review.id ? { ...item, is_visible: data.review.is_visible } : item));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to update review visibility."));
    } finally {
      setBusyItem(null);
    }
  };

  const deleteReview = async (review: AdminReview) => {
    if (!window.confirm("Delete this review permanently?")) return;
    setBusyItem(`review-${review.id}`);
    setError(null);
    try {
      await api.delete(`/admin/reviews/${review.id}`);
      setReviews((current) => current.filter((item) => item.id !== review.id));
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to delete review."));
    } finally {
      setBusyItem(null);
    }
  };

  const filteredQuotes = statusFilter === "all"
    ? quoteRequests
    : quoteRequests.filter((quote) => quote.status === statusFilter);
  const stats = [
    { label: "Services", value: services.length },
    { label: "Packages", value: packages.length },
    { label: "Quote requests", value: quoteRequests.length },
    { label: "Pending", value: quoteRequests.filter((quote) => quote.status === "pending").length },
    { label: "Confirmed", value: quoteRequests.filter((quote) => quote.status === "confirmed").length },
    { label: "Completed", value: quoteRequests.filter((quote) => quote.status === "completed").length },
  ];
  const tabs: { id: AdminSection; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "packages", label: "Packages" },
    { id: "quotes", label: "Quote Requests" },
    { id: "reviews", label: "Reviews" },
    { id: "customers", label: "Customers" },
  ];

  const sectionTitle = tabs.find((tab) => tab.id === section)?.label ?? "Overview";
  const fieldStyle = {
    width: "100%",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius)",
    backgroundColor: "var(--color-card)",
    color: "var(--color-foreground)",
    padding: "11px 12px",
  };
  const labelStyle = { display: "grid", gap: 6, color: "var(--color-muted-foreground)", fontSize: 13 };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--color-background)" }}>
        <Navbar />
        <section className="section-pad" style={{ paddingTop: 145, minHeight: "75vh", backgroundColor: "var(--color-secondary)" }}>
          <div className="container-wide">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <SectionLabel>Administration</SectionLabel>
                <h1 className="mb-0" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: "var(--color-foreground)" }}>
                  {sectionTitle}
                </h1>
              </div>
              <button type="button" className="btn-ghost" onClick={() => void fetchDashboard(true)} disabled={loading}>
                {loading ? "Refreshing…" : "Refresh data"}
              </button>
            </div>

            <nav aria-label="Admin sections" className="mb-8 flex gap-2 overflow-x-auto border-b" style={{ borderColor: "var(--color-border)" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setSection(tab.id); setError(null); setNotice(null); }}
                  aria-current={section === tab.id ? "page" : undefined}
                  className="shrink-0 border-b-2 px-4 py-3 text-sm transition-colors"
                  style={{
                    borderColor: section === tab.id ? "var(--color-primary)" : "transparent",
                    color: section === tab.id ? "var(--color-foreground)" : "var(--color-muted-foreground)",
                    fontWeight: section === tab.id ? 600 : 400,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {error && (
              <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border px-4 py-3 text-sm" style={{ backgroundColor: "rgba(190, 60, 60, 0.05)", borderColor: "#e3b9b3", color: "#9b3939" }}>
                <span>{error}</span>
                {loading && <span>Loading data…</span>}
              </div>
            )}
            {notice && !error && (
              <div role="status" className="mb-5 rounded-[var(--radius)] border px-4 py-3 text-sm" style={{ backgroundColor: "rgba(53, 107, 80, 0.06)", borderColor: "#b6cfbf", color: "#356b50" }}>
                {notice}
              </div>
            )}

            {loading ? (
              <div role="status" className="rounded-[var(--radius)] border p-10 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-muted-foreground)" }}>
                Loading admin data…
              </div>
            ) : error && services.length + packages.length + quoteRequests.length === 0 ? (
              <div className="rounded-[var(--radius)] border p-10 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                <p className="mb-4" style={{ color: "var(--color-muted-foreground)" }}>Admin data could not be loaded.</p>
                <button type="button" className="btn-primary" onClick={() => void fetchDashboard(true)}>Try again</button>
              </div>
            ) : (
              <>
                {section === "overview" && (
                  <div className="grid gap-8">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                      {stats.map((stat) => (
                        <article key={stat.label} className="rounded-[var(--radius)] border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{stat.label}</p>
                          <p className="mt-2 text-3xl" style={{ color: "var(--color-foreground)", fontFamily: "var(--font-serif)" }}>{stat.value}</p>
                        </article>
                      ))}
                    </div>

                    <section className="rounded-[var(--radius)] border p-5 md:p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Latest quote requests</h2>
                          <p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>Most recently submitted requests</p>
                        </div>
                        <button type="button" className="btn-ghost" onClick={() => setSection("quotes")}>View all</button>
                      </div>
                      {quoteRequests.length === 0 ? (
                        <p className="py-8 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>No quote requests yet.</p>
                      ) : (
                        <div className="grid gap-3">
                          {quoteRequests.slice(0, 5).map((quote) => (
                            <div key={quote.id} className="flex flex-wrap items-center justify-between gap-3 border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
                              <div>
                                <p className="font-medium">{quote.user?.name || "Customer"} · {quote.event_type}</p>
                                <p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{quote.service?.name || "Service"} · {formatDate(quote.event_date)}</p>
                              </div>
                              <StatusTag status={quote.status} />
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                )}

                {section === "services" && (
                  <section className="rounded-[var(--radius)] border p-5 md:p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Services</h2>
                        <p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{services.length} services</p>
                      </div>
                      <button type="button" className="btn-primary" onClick={() => openServiceEditor()}>Add service</button>
                    </div>
                    {services.length === 0 ? (
                      <p className="py-10 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>No services found. Add a service to get started.</p>
                    ) : (
                      <div className="grid gap-3">
                        {services.map((service) => (
                          <article key={service.id} className="flex flex-col justify-between gap-4 rounded-md border p-4 sm:flex-row sm:items-center" style={{ borderColor: "var(--color-border)" }}>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-medium">{service.name}</h3>
                                <StatusTag status={service.is_active} />
                              </div>
                              <p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{service.packages_count ?? 0} linked packages · {service.slug}</p>
                              {service.description && <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{service.description}</p>}
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button type="button" className="btn-ghost" onClick={() => openServiceEditor(service)}>Edit</button>
                              <button type="button" className="btn-ghost" disabled={busyItem === `service-${service.id}`} onClick={() => void toggleStatus("service", service.id)}>
                                {busyItem === `service-${service.id}` ? "Saving…" : service.is_active ? "Disable" : "Enable"}
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {section === "packages" && (
                  <section className="rounded-[var(--radius)] border p-5 md:p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Packages</h2>
                        <p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{packages.length} packages</p>
                      </div>
                      <button type="button" className="btn-primary" onClick={() => openPackageEditor()} disabled={services.length === 0}>Add package</button>
                    </div>
                    {services.length === 0 && <p className="mb-4 text-sm" style={{ color: "var(--color-muted-foreground)" }}>Add a service before creating a package.</p>}
                    {packages.length === 0 ? (
                      <p className="py-10 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>No packages found.</p>
                    ) : (
                      <div className="grid gap-3">
                        {packages.map((pkg) => (
                          <article key={pkg.id} className="flex flex-col justify-between gap-4 rounded-md border p-4 sm:flex-row sm:items-center" style={{ borderColor: "var(--color-border)" }}>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-medium">{pkg.name}</h3>
                                <StatusTag status={pkg.is_active} />
                              </div>
                              <p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{pkg.service?.name || "No service"} · {pkg.price == null ? "Price on request" : pkg.price}</p>
                              {pkg.description && <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{pkg.description}</p>}
                              {!!pkg.features?.length && <p className="mt-2 line-clamp-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{pkg.features.join(" · ")}</p>}
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button type="button" className="btn-ghost" onClick={() => openPackageEditor(pkg)}>Edit</button>
                              <button type="button" className="btn-ghost" disabled={busyItem === `package-${pkg.id}`} onClick={() => void toggleStatus("package", pkg.id)}>
                                {busyItem === `package-${pkg.id}` ? "Saving…" : pkg.is_active ? "Disable" : "Enable"}
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {section === "quotes" && (
                  <section className="rounded-[var(--radius)] border p-5 md:p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <h2 className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Quote requests</h2>
                        <p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{filteredQuotes.length} of {quoteRequests.length} requests</p>
                      </div>
                      <label className="flex items-center gap-2 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                        Status
                        <select className="form-input" style={{ minWidth: 150 }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | QuoteStatus)}>
                          <option value="all">All statuses</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </label>
                    </div>
                    {filteredQuotes.length === 0 ? (
                      <p className="py-10 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                        {quoteRequests.length === 0 ? "No quote requests yet." : "No requests match this status."}
                      </p>
                    ) : (
                      <div className="grid gap-4">
                        {filteredQuotes.map((quote) => (
                          <article key={quote.id} className="rounded-md border p-4 md:p-5" style={{ borderColor: "var(--color-border)" }}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-xs uppercase" style={{ color: "var(--color-primary)" }}>Request #{quote.id}</p>
                                <h3 className="mt-1 text-xl" style={{ fontFamily: "var(--font-serif)" }}>{quote.event_type}</h3>
                                <p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{quote.user?.name || "Customer"}{quote.user?.email ? ` · ${quote.user.email}` : ""}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <StatusTag status={quote.status} />
                                <select
                                  aria-label={`Update status for request ${quote.id}`}
                                  className="form-input"
                                  value={quote.status}
                                  disabled={quote.status === "completed" || busyItem === `quote-${quote.id}`}
                                  onChange={(event) => void updateQuoteStatus(quote, event.target.value as QuoteStatus)}
                                  style={{ minWidth: 145 }}
                                >
                                  {(["pending", "confirmed", "completed"] as QuoteStatus[])
                                    .slice(["pending", "confirmed", "completed"].indexOf(quote.status))
                                    .map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
                                </select>
                              </div>
                            </div>
                            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                              <div><dt style={{ color: "var(--color-muted-foreground)" }}>Service</dt><dd className="mt-1">{quote.service?.name || "Not available"}</dd></div>
                              <div><dt style={{ color: "var(--color-muted-foreground)" }}>Package</dt><dd className="mt-1">{quote.package?.name || "Not selected"}</dd></div>
                              <div><dt style={{ color: "var(--color-muted-foreground)" }}>Event date</dt><dd className="mt-1">{formatDate(quote.event_date)}</dd></div>
                              <div><dt style={{ color: "var(--color-muted-foreground)" }}>Location</dt><dd className="mt-1">{quote.event_location || "Not provided"}</dd></div>
                              <div className="sm:col-span-2 lg:col-span-4"><dt style={{ color: "var(--color-muted-foreground)" }}>Message</dt><dd className="mt-1 whitespace-pre-wrap">{quote.message || "No message"}</dd></div>
                            </dl>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {section === "reviews" && (
                  <section className="rounded-[var(--radius)] border p-5 md:p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <h2 className="mb-5 text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Review management</h2>
                    {reviews.length === 0 ? <p className="py-10 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>No reviews have been submitted.</p> : <div className="grid gap-3">
                      {reviews.map((review) => <article key={review.id} className="flex flex-col justify-between gap-4 rounded-md border p-4 md:flex-row md:items-start" style={{ borderColor: "var(--color-border)" }}>
                        <div className="min-w-0"><p className="font-medium">{review.user?.name} · {review.service?.name} · {review.rating}/5</p><p className="mt-1 text-sm">{review.comment}</p><p className="mt-2 text-xs" style={{ color: "var(--color-muted-foreground)" }}>{review.user?.email} · {formatDate(review.created_at)} · {review.quote_request?.event_type}</p><div className="mt-2"><StatusTag status={review.is_visible} /></div></div>
                        <div className="flex shrink-0 gap-2"><button type="button" className="btn-ghost" disabled={busyItem === `review-${review.id}`} onClick={() => void toggleReviewVisibility(review)}>{review.is_visible ? "Hide" : "Publish"}</button><button type="button" className="btn-ghost" disabled={busyItem === `review-${review.id}`} onClick={() => void deleteReview(review)}>Delete</button></div>
                      </article>)}
                    </div>}
                  </section>
                )}

                {section === "customers" && (
                  <section className="rounded-[var(--radius)] border p-5 md:p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <h2 className="mb-5 text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Customers</h2>
                    {customers.length === 0 ? <p className="py-10 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>No customers found.</p> : <div className="grid gap-3">
                      {customers.map((customer) => <article key={customer.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4" style={{ borderColor: "var(--color-border)" }}><div><p className="font-medium">{customer.name}</p><p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>{customer.email}</p></div><p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{customer.quote_requests_count} requests · {customer.reviews_count} reviews</p></article>)}
                    </div>}
                  </section>
                )}
              </>
            )}
          </div>
        </section>
        <Footer />

        {(serviceEditor !== false || packageEditor !== false) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) { setServiceEditor(false); setPackageEditor(false); } }}>
            <section role="dialog" aria-modal="true" aria-labelledby="admin-editor-title" className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius)] border p-5 shadow-xl md:p-7" style={{ backgroundColor: "var(--color-background)", borderColor: "var(--color-border)" }}>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <SectionLabel>{serviceEditor !== false ? "Services" : "Packages"}</SectionLabel>
                  <h2 id="admin-editor-title" className="text-3xl" style={{ fontFamily: "var(--font-serif)" }}>
                    {serviceEditor !== false ? (serviceEditor ? "Edit service" : "Add service") : (packageEditor ? "Edit package" : "Add package")}
                  </h2>
                </div>
                <button type="button" className="btn-ghost" aria-label="Close editor" onClick={() => { setServiceEditor(false); setPackageEditor(false); }} disabled={saving}>Close</button>
              </div>

              {serviceEditor !== false ? (
                <form className="grid gap-4" onSubmit={(event) => void saveService(event)}>
                  <label style={labelStyle}>Name<input required maxLength={255} style={fieldStyle} value={serviceForm.name} onChange={(event) => setServiceForm({ ...serviceForm, name: event.target.value })} /></label>
                  <label style={labelStyle}>Slug<input required maxLength={255} style={fieldStyle} value={serviceForm.slug} onChange={(event) => setServiceForm({ ...serviceForm, slug: event.target.value })} /></label>
                  <label style={labelStyle}>Description<textarea rows={4} style={fieldStyle} value={serviceForm.description} onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })} /></label>
                  <label style={labelStyle}>Image URL<input type="url" style={fieldStyle} value={serviceForm.image} onChange={(event) => setServiceForm({ ...serviceForm, image: event.target.value })} /></label>
                  {error && <p role="alert" className="text-sm" style={{ color: "#9b3939" }}>{error}</p>}
                  <div className="mt-2 flex justify-end gap-3">
                    <button type="button" className="btn-ghost" onClick={() => setServiceEditor(false)} disabled={saving}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving…" : serviceEditor ? "Save changes" : "Create service"}</button>
                  </div>
                </form>
              ) : (
                <form className="grid gap-4" onSubmit={(event) => void savePackage(event)}>
                  <label style={labelStyle}>Service<select required style={fieldStyle} value={packageForm.service_id} onChange={(event) => setPackageForm({ ...packageForm, service_id: event.target.value })}>
                    <option value="" disabled>Select a service</option>
                    {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
                  </select></label>
                  <label style={labelStyle}>Name<input required maxLength={255} style={fieldStyle} value={packageForm.name} onChange={(event) => setPackageForm({ ...packageForm, name: event.target.value })} /></label>
                  <label style={labelStyle}>Slug<input required maxLength={255} style={fieldStyle} value={packageForm.slug} onChange={(event) => setPackageForm({ ...packageForm, slug: event.target.value })} /></label>
                  <label style={labelStyle}>Description<textarea rows={4} style={fieldStyle} value={packageForm.description} onChange={(event) => setPackageForm({ ...packageForm, description: event.target.value })} /></label>
                  <label style={labelStyle}>Price<input type="number" min="0" step="0.01" placeholder="Leave blank if not set" style={fieldStyle} value={packageForm.price} onChange={(event) => setPackageForm({ ...packageForm, price: event.target.value })} /></label>
                  <label style={labelStyle}>Features<textarea rows={5} placeholder="One feature per line" style={fieldStyle} value={packageForm.features} onChange={(event) => setPackageForm({ ...packageForm, features: event.target.value })} /></label>
                  <label style={labelStyle}>Image URL<input type="url" style={fieldStyle} value={packageForm.image} onChange={(event) => setPackageForm({ ...packageForm, image: event.target.value })} /></label>
                  {error && <p role="alert" className="text-sm" style={{ color: "#9b3939" }}>{error}</p>}
                  <div className="mt-2 flex justify-end gap-3">
                    <button type="button" className="btn-ghost" onClick={() => setPackageEditor(false)} disabled={saving}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={saving || services.length === 0}>{saving ? "Saving…" : packageEditor ? "Save changes" : "Create package"}</button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  );
}