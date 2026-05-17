import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/contexts/LanguageContext";
import { fetchDestinations, type Destination } from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" } }),
};

export default function Bangladesh() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const { data: destinations = [], isLoading } = useQuery({ queryKey: ["destinations"], queryFn: fetchDestinations });

  const filtered = destinations.filter((d: Destination) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.region ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="relative pt-32 pb-20 px-4 text-center overflow-hidden" data-testid="section-bangladesh-hero">
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">Explore</span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-5">{t.bangladesh}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">One country, every landscape imaginable.</p>
          </motion.div>
        </div>
      </div>

      <div className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-4" data-testid="filter-bar">
        <div className="max-w-7xl mx-auto">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search destinations..."
            className="w-full max-w-sm px-4 py-2 rounded-full border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground" />
        </div>
      </div>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="section-destinations-grid">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-6 space-y-3"><div className="h-5 bg-muted rounded w-2/3" /><div className="h-3 bg-muted rounded" /></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground" data-testid="text-no-results">
            <p className="text-lg">{search ? "No destinations found." : "No destinations published yet."}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-8">{filtered.length} destination{filtered.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((dest: Destination, i) => (
                <motion.div key={dest.id} custom={i % 3} initial="hidden" animate="visible" variants={fadeUp} layout>
                  <div className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1" data-testid={`card-destination-${dest.id}`}>
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img src={dest.coverImageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"}
                        alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">{dest.name}</h3>
                        {dest.region && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1 ml-2 flex-shrink-0">
                            <MapPin size={12} /> {dest.region}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-5">{dest.description}</p>
                      <Link href={`/destination/${dest.slug}`} data-testid={`button-read-more-${dest.id}`}>
                        <span className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all cursor-pointer">
                          {t.readMore} <ArrowRight size={14} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
