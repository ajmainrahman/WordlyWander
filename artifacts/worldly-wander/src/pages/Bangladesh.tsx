import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import destinationsData from "@/data/destinations.json";
import StarRating from "@/components/StarRating";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" },
  }),
};

const TYPES = ["All", "Nature", "City", "Heritage", "Beach", "Hill Tracts"];

export default function Bangladesh() {
  const { t } = useLang();
  const [activeType, setActiveType] = useState("All");

  const filtered = activeType === "All"
    ? destinationsData
    : destinationsData.filter((d) => d.type === activeType);

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <div className="relative pt-32 pb-20 px-4 text-center overflow-hidden" data-testid="section-bangladesh-hero">
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">Explore</span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-5">
              {t.bangladesh}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Fourteen districts. Every landscape imaginable. One endlessly fascinating country.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-4" data-testid="filter-bar">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {TYPES.map((type) => (
            <button
              key={type}
              data-testid={`button-filter-${type.toLowerCase().replace(" ", "-")}`}
              onClick={() => setActiveType(type)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeType === type
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {type === "All" ? t.filterAll : type}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="section-destinations-grid">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">
            {filtered.length} destination{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dest, i) => (
            <motion.div
              key={dest.id}
              custom={i % 3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              layout
            >
              <div className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1" data-testid={`card-destination-${dest.id}`}>
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={dest.coverImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {dest.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <StarRating rating={dest.familyRating} />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin size={12} /> {dest.region}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-5">
                    {dest.teaser}
                  </p>
                  <Link href={`/destination/${dest.id}`} data-testid={`button-read-more-${dest.id}`}>
                    <span className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all cursor-pointer">
                      {t.readMore} <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground" data-testid="text-no-results">
            <p className="text-lg">No destinations found for this filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
