import { createContext, useContext, useEffect, useState } from "react";
import {
  adminLogin as apiLogin,
  adminLogout as apiLogout,
  adminMe,
  getAdminToken,
  setAdminToken,
  clearAdminToken,
} from "@/lib/api";

interface AdminUser { email: string; }

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }
    adminMe()
      .then((u) => setUser(u))
      .catch(() => {
        clearAdminToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    if (res.token) {
      setAdminToken(res.token);
    }
    setUser({ email: res.email });
  };

  const logout = async () => {
    try { await apiLogout(); } catch { }
    clearAdminToken();
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
