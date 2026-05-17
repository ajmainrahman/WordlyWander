import { motion } from "framer-motion";
import { CheckCircle2, Circle, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchBucketList, type BucketListItem } from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06 } }),
};

export default function BucketList() {
  const { data: items = [], isLoading } = useQuery({ queryKey: ["bucket-list"], queryFn: fetchBucketList });

  const completed = items.filter((i) => i.completed);
  const pending = items.filter((i) => !i.completed);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative bg-primary py-28 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=60')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary-foreground/60 mb-3 block">Adventure Goals</span>
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-primary-foreground mb-4">Our Bucket List</h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl mx-auto">
              Every destination we dream of visiting, every experience we're chasing — our ever-growing travel wishlist.
            </p>
          </motion.div>
          <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="flex items-center justify-center gap-6 mt-8 text-primary-foreground/80">
            <div className="text-center">
              <div className="font-serif text-3xl font-bold">{completed.length}</div>
              <div className="text-xs text-primary-foreground/60 mt-1">Completed</div>
            </div>
            <div className="w-px h-10 bg-primary-foreground/20" />
            <div className="text-center">
              <div className="font-serif text-3xl font-bold">{pending.length}</div>
              <div className="text-xs text-primary-foreground/60 mt-1">Still to Go</div>
            </div>
            <div className="w-px h-10 bg-primary-foreground/20" />
            <div className="text-center">
              <div className="font-serif text-3xl font-bold">{items.length}</div>
              <div className="text-xs text-primary-foreground/60 mt-1">Total Dreams</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <MapPin size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No bucket list items yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section className="mb-16">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Circle size={20} className="text-primary" /> Still Dreaming
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pending.map((item, i) => (
                    <BucketCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-500" /> Done & Dusted
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {completed.map((item, i) => (
                    <BucketCard key={item.id} item={item} index={i} done />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BucketCard({ item, index, done }: { item: BucketListItem; index: number; done?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      variants={fadeUp}
      className={`group relative rounded-xl border overflow-hidden transition-all hover:shadow-lg ${
        done ? "border-green-200 dark:border-green-900/40 bg-green-50/50 dark:bg-green-950/20" : "border-border bg-card hover:border-primary/30"
      }`}
    >
      {item.imageUrl && (
        <div className="h-36 overflow-hidden">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-5 flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {done ? (
            <CheckCircle2 size={22} className="text-green-500" />
          ) : (
            <Circle size={22} className="text-primary/40" />
          )}
        </div>
        <div>
          <h3 className={`font-serif font-bold text-base leading-snug ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
