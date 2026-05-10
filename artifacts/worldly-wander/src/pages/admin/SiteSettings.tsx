import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Check, Globe, BookOpen, User } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminFetchSiteSettings, adminSaveSiteSettings } from "@/lib/api";

const SITE_FIELDS = [
  { key: "site_title", label: "Site Title", placeholder: "WordlyWander" },
  { key: "site_tagline", label: "Site Tagline / Footer Description", placeholder: "Stories from a writing family that roams Bangladesh...", multiline: true },
  { key: "contact_email", label: "Contact Email", placeholder: "hello@wordlywander.com" },
  { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/..." },
  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
  { key: "twitter_url", label: "Twitter URL", placeholder: "https://twitter.com/..." },
  { key: "youtube_url", label: "YouTube URL", placeholder: "https://youtube.com/..." },
  { key: "medium_url", label: "Medium Profile URL", placeholder: "https://medium.com/@..." },
  { key: "footer_copyright", label: "Copyright Text", placeholder: "© 2025 WordlyWander. All rights reserved." },
  { key: "footer_tagline", label: "Footer Bottom Tagline", placeholder: "Made with love, in Bangladesh." },
];

const OUR_STORY_FIELDS = [
  { key: "about_heading", label: "Main Heading", placeholder: "A writing family that roams." },
  { key: "about_subheading", label: "Sub-label (above heading)", placeholder: "Who we are" },
  { key: "about_photo_url", label: "Family Photo URL", placeholder: "https://images.unsplash.com/..." },
  { key: "about_hero_image", label: "Hero Banner Image URL", placeholder: "https://images.unsplash.com/..." },
  { key: "about_para_1", label: "Paragraph 1", placeholder: "We are the Hossains...", multiline: true },
  { key: "about_para_2", label: "Paragraph 2", placeholder: "We started WordlyWander in...", multiline: true },
  { key: "about_para_3", label: "Paragraph 3", placeholder: "Our home is Dhaka, but...", multiline: true },
  { key: "about_para_4", label: "Paragraph 4 (optional)", placeholder: "We write because...", multiline: true },
  { key: "about_wordly_meaning", label: "What does 'Wordly' mean?", placeholder: "Word + Worldly. We are writers first...", multiline: true },
  { key: "about_wander_meaning", label: "What does 'Wander' mean?", placeholder: "To explore freely...", multiline: true },
];

type Tab = "site" | "story";

export default function AdminSiteSettings() {
  const qc = useQueryClient();
  const { data: settings = {}, isLoading } = useQuery({
    queryKey: ["admin", "site-settings"],
    queryFn: adminFetchSiteSettings,
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<Tab>("site");

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

  const fields = tab === "site" ? SITE_FIELDS : OUR_STORY_FIELDS;

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl" data-testid="page-admin-site-settings">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Site Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your site content and Our Story page</p>
          </div>
          <button onClick={() => save.mutate()} disabled={save.isPending}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
            {saved ? <><Check size={16} /> Saved!</> : save.isPending ? "Saving..." : <><Save size={16} /> Save Changes</>}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setTab("site")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === "site" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe size={15} /> Site & Footer
          </button>
          <button
            onClick={() => setTab("story")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === "story" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="tab-our-story"
          >
            <User size={15} /> Our Story
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : (
          <div className="space-y-5">
            {tab === "story" && (
              <div className="flex items-start gap-3 p-4 bg-primary/8 border border-primary/20 rounded-xl mb-6">
                <BookOpen size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Our Story Editor</p>
                  <p className="text-xs text-muted-foreground mt-0.5">These fields control the content on the public <strong>/about</strong> page. Leave any field blank to use the default text.</p>
                </div>
              </div>
            )}
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                {field.multiline ? (
                  <textarea
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={field.key.startsWith("about_para") ? 4 : 3}
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

const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-y";
