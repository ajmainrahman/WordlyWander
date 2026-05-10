import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Check } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminFetchSiteSettings, adminSaveSiteSettings } from "@/lib/api";

const FIELDS = [
  { key: "site_title", label: "Site Title", placeholder: "WordlyWander" },
  { key: "site_tagline", label: "Site Tagline / Footer Description", placeholder: "Stories from a writing family that roams Bangladesh...", multiline: true },
  { key: "contact_email", label: "Contact Email", placeholder: "hello@wordlywander.com" },
  { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/..." },
  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
  { key: "twitter_url", label: "Twitter URL", placeholder: "https://twitter.com/..." },
  { key: "youtube_url", label: "YouTube URL", placeholder: "https://youtube.com/..." },
  { key: "medium_url", label: "Medium URL", placeholder: "https://medium.com/@..." },
  { key: "footer_copyright", label: "Copyright Text", placeholder: "© 2025 WordlyWander. All rights reserved." },
  { key: "footer_tagline", label: "Footer Bottom Tagline", placeholder: "Made with love, in Bangladesh." },
];

export default function AdminSiteSettings() {
  const qc = useQueryClient();
  const { data: settings = {}, isLoading } = useQuery({
    queryKey: ["admin", "site-settings"],
    queryFn: adminFetchSiteSettings,
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings as Record<string, string>);
  }, [settings]);

  const save = useMutation({
    mutationFn: () => adminSaveSiteSettings(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl" data-testid="page-admin-site-settings">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Site Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">Edit your header, footer, and social link content</p>
          </div>
          <button onClick={() => save.mutate()} disabled={save.isPending}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
            {saved ? <><Check size={16} /> Saved!</> : save.isPending ? "Saving..." : <><Save size={16} /> Save Changes</>}
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : (
          <div className="space-y-5">
            {FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                {field.multiline ? (
                  <textarea
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={3}
                    className={inputCls}
                  />
                ) : (
                  <input
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className={inputCls}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground";
