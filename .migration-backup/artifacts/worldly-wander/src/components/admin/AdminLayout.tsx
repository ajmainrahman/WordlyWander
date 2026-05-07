import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, MapPin, Image, LogOut, List } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/bucket-list", label: "Bucket List", icon: List },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAdminAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex bg-background" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-foreground text-background flex flex-col">
        <div className="px-5 py-6 border-b border-background/10">
          <h1 className="font-serif text-lg font-bold text-background">WordlyWander</h1>
          <p className="text-xs text-background/50 mt-0.5">Content Manager</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <span
                data-testid={`link-admin-nav-${label.toLowerCase().replace(/ /g, "-")}`}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-colors ${
                  location === href || location.startsWith(href + "/")
                    ? "bg-primary text-primary-foreground"
                    : "text-background/70 hover:text-background hover:bg-background/10"
                }`}
              >
                <Icon size={16} />
                {label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-background/10">
          <p className="text-xs text-background/50 mb-3 truncate">{user?.email}</p>
          <button
            data-testid="button-admin-logout"
            onClick={logout}
            className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
