import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const DEFAULT_PARAS = [
  "We are the Hossains — a family of four who believe that the best way to understand a country is to move slowly through it, eat what the locals eat, and write down everything.",
  "We started WordlyWander in 2022 after our eldest daughter insisted we keep a record of our travels. She was seven then. She's nine now, and she edits our photo captions with a red pen.",
  "Our home is Dhaka, but Bangladesh is our entire classroom. We travel every school holiday — sometimes by rocket steamer, sometimes by country boat, sometimes by the local bus that takes four hours to go sixty kilometres and stops at every village market along the way.",
  "We write because we believe Bangladesh deserves better travel writing. Not the anxious kind, not the poverty-tourism kind — the kind that sees the country whole, with complexity and love and a full stomach.",
];

const DEFAULT_ARTICLES = [
  { title: "Why We Travel to Bangladesh — Not Just Through It", url: "https://medium.com" },
  { title: "On Raising Children Who Know the Names of Rivers", url: "https://medium.com" },
  { title: "The Bangladesh Nobody Photographs", url: "https://medium.com" },
  { title: "Learning to Be Lost: A Family Travel Manifesto", url: "https://medium.com" },
];

export default function About() {
  const { data: s = {} } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings, staleTime: 5 * 60 * 1000 });

  const heading = s.about_heading || "A writing family that roams.";
  const subheading = s.about_subheading || "Who we are";
  const familyPhotoUrl = s.about_photo_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80";
  const heroImageUrl = s.about_hero_image || "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80";

  const paras = [
    s.about_para_1 || DEFAULT_PARAS[0],
    s.about_para_2 || DEFAULT_PARAS[1],
    s.about_para_3 || DEFAULT_PARAS[2],
    s.about_para_4 || DEFAULT_PARAS[3],
  ].filter(Boolean);

  const wordlyMeaning = s.about_wordly_meaning || "Word + Worldly. We are writers first — journalists, teachers, storytellers. Travel for us is always also language. We are chasing the right word for the smell of the tea garden at dawn, the sound of the Sadarghat ferries at midnight, the colour of the paddy before harvest.";
  const wanderMeaning = s.about_wander_meaning || "To explore freely. Not a fixed itinerary, not a checklist. We wander with intention but without anxiety. We take the longer route. We stop when something is beautiful. We let children lead — because children always find the most interesting things.";

  const mediumArticles = s.about_medium_articles
    ? JSON.parse(s.about_medium_articles)
    : DEFAULT_ARTICLES;

  return (
    <div className="min-h-screen" data-testid="page-about">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img src={heroImageUrl} alt="Our family journeys" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[11px] font-medium tracking-[0.35em] uppercase text-white/50">
            {subheading}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl lg:text-6xl font-semibold text-white text-center">
            Our Story
          </motion.h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Family Photo & Social */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-6 shadow-lg">
              <img src={familyPhotoUrl} alt="The WordlyWander family" className="w-full h-full object-cover" data-testid="img-family" />
            </div>
            <div className="flex gap-3">
              <a href={s.facebook_url || "https://facebook.com"} target="_blank" rel="noopener noreferrer" data-testid="link-about-facebook"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                <FaFacebook size={15} />
              </a>
              <a href={s.instagram_url || "https://instagram.com"} target="_blank" rel="noopener noreferrer" data-testid="link-about-instagram"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                <FaInstagram size={15} />
              </a>
              <a href={s.twitter_url || "https://twitter.com"} target="_blank" rel="noopener noreferrer" data-testid="link-about-twitter"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                <FaTwitter size={15} />
              </a>
            </div>
          </motion.div>

          {/* Story */}
          <div>
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-primary/60">Who we are</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mt-3 mb-7">
                {heading}
              </h2>
              <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
                {paras.map((para, i) => para && <p key={i}>{para}</p>)}
              </div>
            </motion.div>
          </div>
        </div>

        {/* The Name */}
        <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
          className="mt-20 bg-card border border-border rounded-2xl p-10 text-center"
          data-testid="card-wordlywander-meaning">
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-primary/60 mb-3">The Name</p>
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-8">
            What does WordlyWander mean?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-primary mb-3">Wordly</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{wordlyMeaning}</p>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-semibold text-secondary mb-3">Wander</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{wanderMeaning}</p>
            </div>
          </div>
        </motion.div>

        {/* Medium Articles */}
        <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} className="mt-20" data-testid="section-medium-articles">
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-primary/60 text-center mb-3">Also on</p>
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-8 text-center">Medium</h2>
          <div className="space-y-3">
            {mediumArticles.map((article: { title: string; url: string }, i: number) => (
              <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" data-testid={`link-medium-article-${i}`}
                className="flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group">
                <span className="font-serif text-[16px] text-foreground group-hover:text-primary transition-colors leading-snug">{article.title}</span>
                <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
