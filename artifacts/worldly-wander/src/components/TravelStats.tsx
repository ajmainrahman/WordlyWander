import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Camera, FileText, Heart } from "lucide-react";

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
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

const STATS = [
  { icon: MapPin, label: "Destinations", value: 64, suffix: "+" },
  { icon: FileText, label: "Stories Written", value: 120, suffix: "+" },
  { icon: Camera, label: "Photos Captured", value: 3200, suffix: "+" },
  { icon: Heart, label: "Years Travelling", value: 5, suffix: "" },
];

export default function TravelStats() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-primary text-primary-foreground" data-testid="section-travel-stats">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary-foreground/60">By the Numbers</span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mt-2">Our Journey So Far</h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index, visible }: { stat: typeof STATS[0]; index: number; visible: boolean }) {
  const count = useCountUp(stat.value, 1600, visible);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="w-14 h-14 rounded-full bg-primary-foreground/15 flex items-center justify-center">
        <stat.icon size={24} className="text-primary-foreground/80" />
      </div>
      <div className="font-serif text-4xl lg:text-5xl font-bold text-primary-foreground tabular-nums">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm text-primary-foreground/60 font-medium tracking-wide">{stat.label}</div>
    </motion.div>
  );
}
