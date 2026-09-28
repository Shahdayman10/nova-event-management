import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api from "../services/api";

type FavoriteType = "services" | "packages";

interface FavoriteEntry {
  id: number;
  name: string;
  slug?: string;
  service_id?: number;
  service?: { name?: string };
  image?: string | null;
  description?: string | null;
  price?: number | string | null;
}

interface FavoritesValue {
  services: FavoriteEntry[];
  packages: FavoriteEntry[];
  loading: boolean;
  error: string | null;
  toggle: (type: FavoriteType, id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [services, setServices] = useState<FavoriteEntry[]>([]);
  const [packages, setPackages] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!user || isAdmin) {
      setServices([]);
      setPackages([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/favorites");
      setServices(data.services ?? []);
      setPackages(data.packages ?? []);
    } catch {
      setError("Unable to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [user?.id, isAdmin]);

  const toggle = async (type: FavoriteType, id: number) => {
    if (!user || isAdmin) return;
    const list = type === "services" ? services : packages;
    const setter = type === "services" ? setServices : setPackages;
    const isSaved = list.some((item) => item.id === id);
    const previous = list;
    setter(isSaved ? list.filter((item) => item.id !== id) : [...list, { id, name: "Saved item" }]);
    try {
      if (isSaved) await api.delete(`/favorites/${type}/${id}`);
      else await api.post(`/favorites/${type}/${id}`);
      await refresh();
    } catch {
      setter(previous);
      setError("Unable to update favorites.");
      throw new Error("Favorite update failed");
    }
  };

  return <FavoritesContext.Provider value={{ services, packages, loading, error, toggle, refresh }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites must be used within FavoritesProvider");
  return value;
}

export function FavoriteButton({ type, id }: { type: FavoriteType; id: number }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { services, packages, toggle } = useFavorites();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const isSaved = (type === "services" ? services : packages).some((item) => item.id === id);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (isAdmin) return;
    setSaving(true);
    try {
      await toggle(type, id);
    } catch {
      // The shared context displays the request error.
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isSaved}
      title={isSaved ? "Remove from favorites" : "Add to favorites"}
      disabled={saving || isAdmin}
      onClick={() => void handleClick()}
      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border"
      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", color: isSaved ? "#a8414b" : "var(--color-foreground)" }}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 00-.1-7.8z" />
      </svg>
    </button>
  );
}