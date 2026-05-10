import { Link } from "wouter";
import { useLang } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "@/lib/api";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const { t } = useLang();
  const { data: s = {} } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings, staleTime: 5 * 60 * 1000 });

  const tagline = s.site_tagline || "Stories from a writing family that roams Bangladesh — one river, one temple, one plate of biryani at a time.";
  const copyright = s.footer_copyright || "© 2025 WordlyWander. All rights reserved.";
  const bottomTagline = s.footer_tagline || "Made with love, in Bangladesh.";

  return (
    <footer className="bg-foreground text-background/80 mt-24" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-background mb-3">WordlyWander</h3>
            <p className="text-sm leading-relaxed text-background/60 max-w-xs">{tagline}</p>
            <div className="flex gap-4 mt-5">
              <a href={s.facebook_url || "https://facebook.com"} target="_blank" rel="noopener noreferrer" data-testid="link-social-facebook" className="text-background/50 hover:text-background transition-colors"><FaFacebook size={20} /></a>
              <a href={s.instagram_url || "https://instagram.com"} target="_blank" rel="noopener noreferrer" data-testid="link-social-instagram" className="text-background/50 hover:text-background transition-colors"><FaInstagram size={20} /></a>
              <a href={s.twitter_url || "https://twitter.com"} target="_blank" rel="noopener noreferrer" data-testid="link-social-twitter" className="text-background/50 hover:text-background transition-colors"><FaTwitter size={20} /></a>
              <a href={s.youtube_url || "https://youtube.com"} target="_blank" rel="noopener noreferrer" data-testid="link-social-youtube" className="text-background/50 hover:text-background transition-colors"><FaYoutube size={20} /></a>
            </div>
          </div>

          {/* Site Map */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-widest">Explore</h4>
            <ul className="space-y-2 text-sm">
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
                    <span className="text-background/60 hover:text-background transition-colors cursor-pointer">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Writing */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-widest">Also on</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={s.medium_url || "https://medium.com"} target="_blank" rel="noopener noreferrer" data-testid="link-medium" className="text-background/60 hover:text-background transition-colors">
                  Medium Essays
                </a>
              </li>
              <li>
                <a href={`mailto:${s.contact_email || "hello@wordlywander.com"}`} data-testid="link-email" className="text-background/60 hover:text-background transition-colors">
                  {s.contact_email || "hello@wordlywander.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/40">
          <span>{copyright}</span>
          <span>{bottomTagline}</span>
        </div>
      </div>
    </footer>
  );
}
