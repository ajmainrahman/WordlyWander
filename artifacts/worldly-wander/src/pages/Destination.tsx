import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, X, Share2, Facebook, Twitter } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import destinationsData from "@/data/destinations.json";
import StarRating from "@/components/StarRating";

export default function Destination() {
  const [, params] = useRoute("/destination/:id");
  const { t } = useLang();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const dest = destinationsData.find((d) => d.id === params?.id);

  if (!dest) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Destination not found</h1>
          <Link href="/bangladesh">
            <span className="text-primary cursor-pointer hover:underline">Back to destinations</span>
          </Link>
        </div>
      </div>
    );
  }

  const related = destinationsData.filter((d) => d.id !== dest.id && d.type === dest.type).slice(0, 3);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen" data-testid="page-destination">
      {/* Hero */}
      <div className="relative h-[65vh] min-h-[500px] overflow-hidden">
        <img src={dest.coverImage} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Link href="/bangladesh" data-testid="link-back-to-bangladesh">
              <span className="inline-flex items-center gap-2 text-white/80 text-sm mb-4 cursor-pointer hover:text-white transition-colors">
                <ArrowLeft size={16} /> {t.bangladesh}
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">{dest.type}</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white">{dest.name}</h1>
            <p className="text-white/70 text-lg mt-2 font-light">{dest.region}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <p className="text-lg leading-relaxed text-foreground/80 mb-10 font-light italic border-l-4 border-primary pl-6">
                {dest.description}
              </p>

              {/* Gallery */}
              <h2 className="font-serif text-2xl font-bold mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
                {dest.gallery.map((img, i) => (
                  <button
                    key={i}
                    data-testid={`button-gallery-img-${i}`}
                    onClick={() => setLightboxIdx(i)}
                    className="overflow-hidden rounded-xl aspect-square focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img src={img} alt={`${dest.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </button>
                ))}
              </div>

              {/* Highlights */}
              <h2 className="font-serif text-2xl font-bold mb-5">{t.highlights}</h2>
              <ul className="space-y-3 mb-12">
                {dest.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80" data-testid={`text-highlight-${i}`}>
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Share */}
              <div className="border-t border-border pt-8">
                <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Share2 size={14} /> Share this destination
                </p>
                <div className="flex gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="button-share-facebook"
                    className="flex items-center gap-2 text-sm px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook size={14} /> Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Discover ${dest.name} with WordlyWander!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="button-share-twitter"
                    className="flex items-center gap-2 text-sm px-4 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                  >
                    <Twitter size={14} /> Twitter
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6"
              data-testid="card-destination-info"
            >
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <Calendar size={18} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.bestTime}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5" data-testid="text-best-time">{dest.bestTimeToVisit}</p>
                </div>
              </div>

              <div className="mb-5 pb-5 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t.familyRating}</p>
                <StarRating rating={dest.familyRating} />
                <p className="text-xs text-muted-foreground mt-1">{dest.familyRating}/5 stars</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Region</p>
                <p className="text-sm text-foreground">{dest.region}</p>
              </div>
            </motion.div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
              data-testid="card-map"
            >
              <iframe
                title={`Map of ${dest.name}`}
                width="100%"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(dest.name + ", Bangladesh")}&output=embed`}
                className="opacity-90"
              />
            </motion.div>
          </div>
        </div>

        {/* Related Destinations */}
        {related.length > 0 && (
          <div className="mt-20" data-testid="section-related">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-10 text-center">{t.relatedDest}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/destination/${r.id}`} data-testid={`card-related-${r.id}`}>
                  <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors">{r.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.teaser}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
            data-testid="lightbox-overlay"
          >
            <button
              data-testid="button-lightbox-close"
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
              onClick={() => setLightboxIdx(null)}
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={dest.gallery[lightboxIdx]}
              alt=""
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 flex gap-3">
              <button
                data-testid="button-lightbox-prev"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => ((i ?? 0) - 1 + dest.gallery.length) % dest.gallery.length); }}
                className="text-white/70 hover:text-white px-4 py-2 rounded-full border border-white/20 text-sm"
              >
                Prev
              </button>
              <span className="text-white/50 text-sm py-2">{lightboxIdx + 1} / {dest.gallery.length}</span>
              <button
                data-testid="button-lightbox-next"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => ((i ?? 0) + 1) % dest.gallery.length); }}
                className="text-white/70 hover:text-white px-4 py-2 rounded-full border border-white/20 text-sm"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
