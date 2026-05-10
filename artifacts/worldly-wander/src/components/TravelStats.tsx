import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Camera, FileText, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStats, type SiteStats } from "@/lib/api";

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function buildStats(stats?: SiteStats) {
  return [
    { icon: MapPin, label: "Destinations", value: stats?.destinations ?? 0, suffix: stats?.destinations ? "+" : "" },
    { icon: FileText, label: "Stories Written", value: stats?.posts ?? 0, suffix: stats?.posts ? "+" : "" },
    { icon: Camera, label: "Photos Captured", value: stats?.photos ?? 0, suffix: stats?.photos ? "+" : "" },
    { icon: Heart, label: "Bucket List Goals", value: stats?.bucketDone ?? 0, suffix: stats?.bucketTotal ? `/${stats.bucketTotal}` : "" },
  ];
}

export default function TravelStats() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: fetchStats, staleTime: 60_000 });

  const STATS = buildStats(stats);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-muted/40 border-y border-border" data-testid="section-travel-stats">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-medium tracking-[0.35em] uppercase text-primary/60 mb-3">By the Numbers</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">Our Journey So Far</h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index, visible }: { stat: ReturnType<typeof buildStats>[0]; index: number; visible: boolean }) {
  const count = useCountUp(stat.value, 1600, visible);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-1">
        <stat.icon size={18} className="text-primary" />
      </div>
      <div className="font-serif text-4xl lg:text-5xl font-semibold text-foreground tabular-nums">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-[12px] text-muted-foreground font-medium tracking-wide uppercase">{stat.label}</div>
    </motion.div>
  );
}
