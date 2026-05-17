import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLang } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, toggleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const links = [
    { href: "/", label: t.home },
    { href: "/bangladesh", label: t.bangladesh },
    { href: "/blog", label: t.blog },
    { href: "/photos", label: t.photos },
    { href: "/bucket-list", label: "Bucket List" },
    { href: "/about", label: t.about },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/97 backdrop-blur-xl shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" data-testid="link-logo">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <img
                src="/logo-couple.png"
                alt="WordlyWander"
                className="w-9 h-9 object-contain"
              />
              <span className={`font-serif text-[1.35rem] font-semibold tracking-tight transition-colors ${
                scrolled ? "text-foreground" : "text-white drop-shadow"
              }`}>
                WordlyWander
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}>
                <span className={`relative px-3 py-1.5 text-[13px] font-medium tracking-wide cursor-pointer transition-colors rounded-md ${
                  isActive(link.href)
                    ? scrolled ? "text-primary" : "text-white"
                    : scrolled
                    ? "text-foreground/60 hover:text-foreground hover:bg-muted/50"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}>
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-current rounded-full" />
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              data-testid="button-lang-toggle"
              onClick={toggleLang}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-full border transition-colors ${
                scrolled
                  ? "border-border text-foreground/70 hover:text-foreground hover:bg-muted"
                  : "border-white/25 text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {lang === "en" ? "🇧🇩 বাংলা" : "🇬🇧 EN"}
            </button>

            <button
              data-testid="button-theme-toggle"
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground hover:bg-muted"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              data-testid="button-mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground hover:bg-muted"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-background border-t border-border px-5 py-5 flex flex-col gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} data-testid={`link-mobile-${link.href.replace("/", "") || "home"}`}>
              <span className={`block px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                isActive(link.href)
                  ? "text-primary bg-primary/8"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/60"
              }`}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
