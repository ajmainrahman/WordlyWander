import { useQuery } from "@tanstack/react-query";
import { FileText, MapPin, Image, List } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminFetchPosts, adminFetchDestinations, adminFetchGallery } from "@/lib/api";

export default function AdminDashboard() {
  const posts = useQuery({ queryKey: ["admin", "posts"], queryFn: adminFetchPosts });
  const destinations = useQuery({ queryKey: ["admin", "destinations"], queryFn: adminFetchDestinations });
  const gallery = useQuery({ queryKey: ["admin", "gallery"], queryFn: adminFetchGallery });

  const stats = [
    {
      label: "Blog Posts",
      value: posts.data?.length ?? "—",
      published: posts.data?.filter((p) => p.published).length ?? 0,
      icon: FileText,
      href: "/admin/posts",
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Destinations",
      value: destinations.data?.length ?? "—",
      published: destinations.data?.filter((d) => d.published).length ?? 0,
      icon: MapPin,
      href: "/admin/destinations",
      color: "bg-secondary/10 text-secondary",
    },
    {
      label: "Gallery Photos",
      value: gallery.data?.length ?? "—",
      published: null,
      icon: Image,
      href: "/admin/gallery",
      color: "bg-accent text-accent-foreground",
    },
    {
      label: "Bucket List",
      value: "—",
      published: null,
      icon: List,
      href: "/admin/bucket-list",
      color: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8" data-testid="page-admin-dashboard">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Dashboard</h2>
        <p className="text-sm text-muted-foreground mb-8">Welcome back. Here's what's in your blog.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(({ label, value, published, icon: Icon, href, color }) => (
            <a key={label} href={href} data-testid={`card-stat-${label.toLowerCase().replace(/ /g, "-")}`}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
              {published !== null && (
                <p className="text-xs text-primary mt-2">{published} published</p>
              )}
            </a>
          ))}
        </div>

        <div className="mt-10 bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Quick start</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>1. Go to <a href="/admin/posts" className="text-primary hover:underline">Posts</a> and create your first blog post</li>
            <li>2. Go to <a href="/admin/destinations" className="text-primary hover:underline">Destinations</a> and add a destination</li>
            <li>3. Go to <a href="/admin/gallery" className="text-primary hover:underline">Gallery</a> and add photos (paste Google Drive / Unsplash URLs)</li>
            <li>4. Toggle "Published" on to make content live on the website</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
