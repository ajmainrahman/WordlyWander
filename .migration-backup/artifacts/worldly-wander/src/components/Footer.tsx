import { Link } from "wouter";
import { useLang } from "@/contexts/LanguageContext";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-foreground text-background/80 mt-24" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-background mb-3">WordlyWander</h3>
            <p className="text-sm leading-relaxed text-background/60 max-w-xs">
              Stories from a writing family that roams Bangladesh — one river, one temple, one plate of biryani at a time.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" data-testid="link-social-facebook" className="text-background/50 hover:text-background transition-colors"><FaFacebook size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-testid="link-social-instagram" className="text-background/50 hover:text-background transition-colors"><FaInstagram size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" data-testid="link-social-twitter" className="text-background/50 hover:text-background transition-colors"><FaTwitter size={20} /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" data-testid="link-social-youtube" className="text-background/50 hover:text-background transition-colors"><FaYoutube size={20} /></a>
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
                <a href="https://medium.com" target="_blank" rel="noopener noreferrer" data-testid="link-medium" className="text-background/60 hover:text-background transition-colors">
                  Medium Essays
                </a>
              </li>
              <li>
                <a href="mailto:hello@wordlywander.com" data-testid="link-email" className="text-background/60 hover:text-background transition-colors">
                  hello@wordlywander.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/40">
          <span>© 2025 WordlyWander. All rights reserved.</span>
          <span>Made with love, in Bangladesh.</span>
        </div>
      </div>
    </footer>
  );
}
