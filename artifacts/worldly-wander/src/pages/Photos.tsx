import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/contexts/LanguageContext";
import { fetchGallery, type GalleryPhoto } from "@/lib/api";

export default function Photos() {
  const { t } = useLang();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [filterDest, setFilterDest] = useState("All");
  const { data: photos = [], isLoading } = useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });

  const destinations = ["All", ...Array.from(new Set(photos.filter((p: GalleryPhoto) => p.destinationName).map((p: GalleryPhoto) => p.destinationName!)))];
  const filtered: GalleryPhoto[] = filterDest === "All" ? photos : photos.filter((p: GalleryPhoto) => p.destinationName === filterDest);

  const navigate = (dir: 1 | -1) => setLightboxIdx((i) => i === null ? 0 : (i + dir + filtered.length) % filtered.length);

  return (
    <div className="min-h-screen" data-testid="page-photos">
      <div className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">Gallery</span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-5">{t.photoJournal}</h1>
            <p className="text-muted-foreground text-lg">A visual diary of Bangladesh — one frame at a time.</p>
          </motion.div>
        </div>
      </div>

      {destinations.length > 1 && (
        <div className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
            {destinations.map((dest) => (
              <button key={dest ?? "all"} data-testid={`button-filter-dest-${(dest ?? "all").toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setFilterDest(dest ?? "All")}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterDest === dest ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
                {dest === "All" ? t.filterAll : dest}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="section-masonry-grid">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {[1,2,3,4,5,6].map((i) => <div key={i} className="break-inside-avoid aspect-square bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p>No photos yet. Add some in the admin panel.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map((photo: GalleryPhoto, i) => (
              <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.07 }} className="break-inside-avoid">
                <button data-testid={`button-photo-${photo.id}`} onClick={() => setLightboxIdx(i)}
                  className="w-full group overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
                  <div className="relative overflow-hidden">
                    <img src={photo.imageUrl} alt={photo.caption ?? ""} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                      <p className="text-white text-xs font-medium p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-left">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/97 flex items-center justify-center" data-testid="lightbox">
            <button data-testid="button-lightbox-close" onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"><X size={28} /></button>
            <button data-testid="button-lightbox-prev" onClick={() => navigate(-1)} className="absolute left-4 text-white/70 hover:text-white p-3 rounded-full border border-white/20 hover:border-white/50 transition-all"><ChevronLeft size={24} /></button>
            <motion.div key={lightboxIdx} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.25 }}
              className="flex flex-col items-center px-16 max-w-4xl w-full">
              <img src={filtered[lightboxIdx].imageUrl} alt={filtered[lightboxIdx].caption ?? ""} className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl" data-testid="lightbox-image" />
              <div className="mt-4 text-center">
                {filtered[lightboxIdx].caption && <p className="text-white/80 text-sm">{filtered[lightboxIdx].caption}</p>}
                {filtered[lightboxIdx].destinationName && <p className="text-white/40 text-xs mt-1">{filtered[lightboxIdx].destinationName}</p>}
              </div>
              <p className="text-white/40 text-xs mt-3">{lightboxIdx + 1} / {filtered.length}</p>
            </motion.div>
            <button data-testid="button-lightbox-next" onClick={() => navigate(1)} className="absolute right-4 text-white/70 hover:text-white p-3 rounded-full border border-white/20 hover:border-white/50 transition-all"><ChevronRight size={24} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
