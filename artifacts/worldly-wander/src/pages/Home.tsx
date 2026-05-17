import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, ChevronDown, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/contexts/LanguageContext";
import { fetchDestinations, fetchPosts, fetchGallery, subscribe } from "@/lib/api";
import TravelStats from "@/components/TravelStats";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90",
  "https://images.unsplash.com/photo-1519922639192-e73293ca430e?w=1600&q=90",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=90",
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function Home() {
  const { t } = useLang();
  const [heroIdx, setHeroIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(interval);
  }, []);

  const { data: allDestinations = [] } = useQuery({ queryKey: ["destinations"], queryFn: fetchDestinations });
  const { data: allPosts = [] } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });
  const { data: allPhotos = [] } = useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });

  const featured = allDestinations.slice(0, 6);
  const latestPosts = allPosts.slice(0, 3);
  const stripPhotos = allPhotos.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[640px] overflow-hidden" data-testid="section-hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIdx}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <img src={HERO_IMAGES[heroIdx]} alt="Travel" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            className="mb-6 flex items-center gap-3">
            <div className="h-px w-10 bg-white/40" />
            <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-white/60">A Family Travel Blog · Bangladesh</span>
            <div className="h-px w-10 bg-white/40" />
          </motion.div>

          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="font-serif text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-semibold text-white leading-none mb-6 tracking-tight">
            Wordly<span className="italic font-normal">Wander</span>
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-base sm:text-lg text-white/70 max-w-lg leading-relaxed mb-10 font-light">
            {t.tagline}
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3">
            <Link href="/bangladesh" data-testid="button-hero-explore">
              <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer shadow-lg shadow-primary/30">
                Explore Bangladesh <ArrowRight size={16} />
              </span>
            </Link>
            <Link href="/blog" data-testid="button-hero-blog">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-white/20 transition-all cursor-pointer border border-white/20">
                Read Our Stories
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Slide indicators + scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
          <div className="flex gap-2">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} data-testid={`button-hero-dot-${i}`} onClick={() => setHeroIdx(i)}
                className={`h-0.5 rounded-full transition-all duration-500 ${i === heroIdx ? "bg-white w-8" : "bg-white/35 w-4"}`} />
            ))}
          </div>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
            <ChevronDown size={18} className="text-white/40" />
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED DESTINATIONS ───────────────────────────── */}
      <section className="pt-28 pb-20 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto" data-testid="section-featured">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-primary/60 mb-3">Discover</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-foreground">{t.featuredDestinations}</h2>
          </div>
          <Link href="/bangladesh" data-testid="button-view-all-destinations">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all cursor-pointer">
              All destinations <ArrowRight size={15} />
            </span>
          </Link>
        </motion.div>

        {featured.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Destinations coming soon — add some in the admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((dest, i) => (
              <motion.div key={dest.id} custom={i % 3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeUp}>
                <Link href={`/destination/${dest.slug}`} data-testid={`card-destination-${dest.id}`}>
                  <div className="group cursor-pointer bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-500">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img src={dest.coverImageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"}
                        alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-5">
                      {dest.region && <p className="text-[11px] font-medium tracking-widest uppercase text-primary/60 mb-1.5">{dest.region}</p>}
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{dest.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{dest.description}</p>
                      <div className="flex items-center gap-1 mt-4 text-primary text-xs font-medium">
                        {t.readMore} <ArrowUpRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── EDITORIAL DIVIDER ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-muted-foreground">Writing</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>

      {/* ── LATEST POSTS ────────────────────────────────────── */}
      <section className="py-20 px-5 sm:px-8 lg:px-12" data-testid="section-latest-posts">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-primary/60 mb-3">Stories</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-foreground">{t.latestPosts}</h2>
            </div>
            <Link href="/blog" data-testid="button-view-all-posts">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all cursor-pointer">
                All stories <ArrowRight size={15} />
              </span>
            </Link>
          </motion.div>

          {latestPosts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-sm">Stories coming soon.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {latestPosts.map((post, i) => (
                <motion.div key={post.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeUp}>
                  <Link href={`/blog/${post.slug}`} data-testid={`card-post-${post.id}`}>
                    <div className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-400">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={post.coverImageUrl || "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80"}
                          alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] font-medium tracking-wide text-muted-foreground mb-2.5">{formatDate(post.createdAt)}</p>
                        <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PHOTO STRIP ─────────────────────────────────────── */}
      {stripPhotos.length > 0 && (
        <section className="py-20 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto" data-testid="section-photo-strip">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-primary/60 mb-3">Gallery</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-foreground">{t.photoJournal}</h2>
            </div>
            <Link href="/photos" data-testid="button-view-all-photos">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all cursor-pointer">
                Full journal <ArrowRight size={15} />
              </span>
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {stripPhotos.map((photo, i) => (
              <motion.div key={photo.id} custom={i % 4} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className={`overflow-hidden rounded-lg ${i === 0 || i === 5 ? "sm:col-span-2 aspect-[4/3]" : "aspect-square"}`}>
                <img src={photo.imageUrl} alt={photo.caption ?? ""} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" data-testid={`img-photo-strip-${photo.id}`} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── TRAVEL STATS ────────────────────────────────────── */}
      <TravelStats />

      {/* ── NEWSLETTER ──────────────────────────────────────── */}
      <section className="py-24 px-5 bg-foreground text-background" data-testid="section-newsletter">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-[11px] font-medium tracking-[0.35em] uppercase text-background/40 mb-5">Newsletter</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-background mb-4">{t.newsletterTitle}</h2>
            <p className="text-background/60 mb-10 text-base font-light">{t.newsletterSub}</p>
            {subscribed ? (
              <p className="text-xl font-serif italic text-background/80">Welcome aboard the journey.</p>
            ) : (
              <>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSubError("");
                    try { await subscribe(email); setSubscribed(true); }
                    catch (err) { setSubError(err instanceof Error ? err.message : "Failed. Try again."); }
                  }}
                  className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto"
                  data-testid="form-newsletter"
                >
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder} required data-testid="input-newsletter-email"
                    className="flex-1 px-5 py-3 rounded-full bg-background/10 border border-background/15 text-background placeholder:text-background/35 focus:outline-none focus:border-background/40 text-sm" />
                  <button type="submit" data-testid="button-newsletter-subscribe"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
                    {t.subscribe}
                  </button>
                </form>
                {subError && <p className="mt-3 text-sm text-background/50">{subError}</p>}
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
