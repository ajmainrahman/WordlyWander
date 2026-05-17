import { Link } from "wouter";
import { useLang } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "@/lib/api";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const { t } = useLang();
  const { data: s = {} } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings, staleTime: 5 * 60 * 1000 });

  const tagline = s.site_tagline || "Stories from a writing family that roams Bangladesh — one river, one temple, one plate of biryani at a time.";
  const copyright = s.footer_copyright || `© ${new Date().getFullYear()} WordlyWander. All rights reserved.`;
  const bottomTagline = s.footer_tagline || "Made with love, in Bangladesh.";

  return (
    <footer className="bg-foreground text-background/75 mt-24" data-testid="footer">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand — wider column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-couple.png" alt="WordlyWander" className="w-8 h-8 object-contain opacity-80" />
              <h3 className="font-serif text-xl font-semibold text-background">WordlyWander</h3>
            </div>
            <p className="text-sm leading-relaxed text-background/50 max-w-xs">{tagline}</p>
            <div className="flex gap-3.5 mt-6">
              <a href={s.facebook_url || "https://facebook.com"} target="_blank" rel="noopener noreferrer" data-testid="link-social-facebook"
                className="w-9 h-9 rounded-full border border-background/15 flex items-center justify-center text-background/40 hover:text-background hover:border-background/40 transition-all">
                <FaFacebook size={15} />
              </a>
              <a href={s.instagram_url || "https://instagram.com"} target="_blank" rel="noopener noreferrer" data-testid="link-social-instagram"
                className="w-9 h-9 rounded-full border border-background/15 flex items-center justify-center text-background/40 hover:text-background hover:border-background/40 transition-all">
                <FaInstagram size={15} />
              </a>
              <a href={s.twitter_url || "https://twitter.com"} target="_blank" rel="noopener noreferrer" data-testid="link-social-twitter"
                className="w-9 h-9 rounded-full border border-background/15 flex items-center justify-center text-background/40 hover:text-background hover:border-background/40 transition-all">
                <FaTwitter size={15} />
              </a>
              <a href={s.youtube_url || "https://youtube.com"} target="_blank" rel="noopener noreferrer" data-testid="link-social-youtube"
                className="w-9 h-9 rounded-full border border-background/15 flex items-center justify-center text-background/40 hover:text-background hover:border-background/40 transition-all">
                <FaYoutube size={15} />
              </a>
            </div>
          </div>

          {/* Site Map */}
          <div className="md:col-span-4">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-background/35 mb-5">Explore</p>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: t.home },
                { href: "/bangladesh", label: t.bangladesh },
                { href: "/blog", label: t.blog },
                { href: "/photos", label: t.photos },
                { href: "/bucket-list", label: "Bucket List" },
                { href: "/about", label: t.about },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-background/50 hover:text-background transition-colors cursor-pointer">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-background/35 mb-5">Also on</p>
            <ul className="space-y-2.5">
              <li>
                <a href={s.medium_url || "https://medium.com"} target="_blank" rel="noopener noreferrer" data-testid="link-medium"
                  className="text-sm text-background/50 hover:text-background transition-colors">
                  Medium Essays
                </a>
              </li>
              <li>
                <a href={`mailto:${s.contact_email || "hello@wordlywander.com"}`} data-testid="link-email"
                  className="text-sm text-background/50 hover:text-background transition-colors">
                  {s.contact_email || "hello@wordlywander.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-background/30">
          <span>{copyright}</span>
          <span className="italic">{bottomTagline}</span>
        </div>
      </div>
    </footer>
  );
}
