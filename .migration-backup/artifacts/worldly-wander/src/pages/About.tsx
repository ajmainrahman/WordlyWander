import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const MEDIUM_ARTICLES = [
  { title: "Why We Travel to Bangladesh — Not Just Through It", url: "https://medium.com" },
  { title: "On Raising Children Who Know the Names of Rivers", url: "https://medium.com" },
  { title: "The Bangladesh Nobody Photographs", url: "https://medium.com" },
  { title: "Learning to Be Lost: A Family Travel Manifesto", url: "https://medium.com" },
];

export default function About() {
  return (
    <div className="min-h-screen" data-testid="page-about">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80"
          alt="Our family journeys"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl lg:text-6xl font-bold text-white text-center"
          >
            Our Story
          </motion.h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Family Photo & Identity */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-8 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
                alt="The WordlyWander family"
                className="w-full h-full object-cover"
                data-testid="img-family"
              />
            </div>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" data-testid="link-about-facebook" className="text-muted-foreground hover:text-primary transition-colors"><FaFacebook size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-testid="link-about-instagram" className="text-muted-foreground hover:text-primary transition-colors"><FaInstagram size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" data-testid="link-about-twitter" className="text-muted-foreground hover:text-primary transition-colors"><FaTwitter size={20} /></a>
            </div>
          </motion.div>

          {/* Story */}
          <div>
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">Who we are</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mt-3 mb-6">
                A writing family that roams.
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We are the Hossains — a family of four who believe that the best way to understand a country is to move slowly through it, eat what the locals eat, and write down everything.
                </p>
                <p>
                  We started WordlyWander in 2022 after our eldest daughter insisted we keep a record of our travels. She was seven then. She's nine now, and she edits our photo captions with a red pen.
                </p>
                <p>
                  Our home is Dhaka, but Bangladesh is our entire classroom. We travel every school holiday — sometimes by rocket steamer, sometimes by country boat, sometimes by the local bus that takes four hours to go sixty kilometres and stops at every village market along the way.
                </p>
                <p>
                  We write because we believe Bangladesh deserves better travel writing. Not the anxious kind, not the poverty-tourism kind — the kind that sees the country whole, with complexity and love and a full stomach.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* The Name */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-20 bg-card border border-border rounded-2xl p-10 text-center"
          data-testid="card-wordlywander-meaning"
        >
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
            What does WordlyWander mean?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
            <div>
              <h3 className="font-serif text-2xl font-bold text-primary mb-3">Wordly</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <span className="font-semibold text-foreground">Word</span> + <span className="font-semibold text-foreground">Worldly</span>. We are writers first — journalists, teachers, storytellers. Travel for us is always also language. We are chasing the right word for the smell of the tea garden at dawn, the sound of the Sadarghat ferries at midnight, the colour of the paddy before harvest.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-secondary mb-3">Wander</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To <span className="font-semibold text-foreground">explore freely</span>. Not a fixed itinerary, not a checklist. We wander with intention but without anxiety. We take the longer route. We stop when something is beautiful. We let children lead — because children always find the most interesting things.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Medium Articles */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-20"
          data-testid="section-medium-articles"
        >
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
            Also on Medium
          </h2>
          <div className="space-y-4">
            {MEDIUM_ARTICLES.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-medium-article-${i}`}
                className="flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <span className="font-serif text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </span>
                <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
