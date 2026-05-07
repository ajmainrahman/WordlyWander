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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const links = [
    { href: "/", label: t.home },
    { href: "/bangladesh", label: t.bangladesh },
    { href: "/blog", label: t.blog },
    { href: "/photos", label: t.photos },
    { href: "/about", label: t.about },
  ];

  const isAdminPath = location.startsWith("/admin");

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" data-testid="link-logo">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <img
                src="/logo-couple.png"
                alt="WordlyWander couple logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-serif text-2xl font-bold text-primary tracking-tight">
                WordlyWander
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}>
                <span
                  className={`text-sm font-medium transition-colors cursor-pointer relative group ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </span>
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {!isAdminPath && (
              <Link href="/admin" data-testid="link-admin">
                <span className="hidden lg:inline-flex text-xs font-semibold px-2.5 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-foreground/60 hover:text-foreground cursor-pointer">
                  Admin
                </span>
              </Link>
            )}
            <button
              data-testid="button-lang-toggle"
              onClick={toggleLang}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-foreground/80"
              title="Switch language"
            >
              {lang === "en" ? "🇧🇩 বাংলা" : "🇬🇧 EN"}
            </button>

            <button
              data-testid="button-theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors text-foreground/80 hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile menu button */}
            <button
              data-testid="button-mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border px-4 py-4 flex flex-col gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} data-testid={`link-mobile-${link.href.replace("/", "") || "home"}`}>
              <span
                className={`block py-2 text-base font-medium cursor-pointer transition-colors ${
                  isActive(link.href) ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
