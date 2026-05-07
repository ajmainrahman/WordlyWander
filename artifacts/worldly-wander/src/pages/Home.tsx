import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import destinationsData from "@/data/destinations.json";
import postsData from "@/data/posts.json";
import photosData from "@/data/photos.json";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90",
  "https://images.unsplash.com/photo-1519922639192-e73293ca430e?w=1600&q=90",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=90",
];

export default function Home() {
  const { t } = useLang();
  const [heroIdx, setHeroIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const featured = destinationsData.slice(0, 6);
  const latestPosts = postsData.slice(0, 3);
  const stripPhotos = photosData.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative h-screen min-h-[600px] overflow-hidden" data-testid="section-hero">
        {HERO_IMAGES.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            animate={{ opacity: i === heroIdx ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          >
            <img src={src} alt="Bangladesh travel" className="w-full h-full object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-4"
          >
            <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-white/70 mb-6">
              A Family Travel Blog
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-6 max-w-4xl"
          >
            WordlyWander
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed mb-10 font-light italic"
          >
            {t.tagline}
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/bangladesh" data-testid="button-hero-explore">
              <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                Explore Bangladesh <ArrowRight size={18} />
              </span>
            </Link>
            <Link href="/blog" data-testid="button-hero-blog">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white px-8 py-4 rounded-full font-semibold hover:bg-white/25 transition-all cursor-pointer border border-white/30">
                Read Our Stories
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              data-testid={`button-hero-dot-${i}`}
              onClick={() => setHeroIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? "bg-white w-6" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="section-featured">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">Discover</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mt-2">
            {t.featuredDestinations}
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((dest, i) => (
            <motion.div
              key={dest.id}
              custom={i % 3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
            >
              <Link href={`/destination/${dest.id}`} data-testid={`card-destination-${dest.id}`}>
                <div className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={dest.coverImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        {dest.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {dest.teaser}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
                      {t.readMore} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/bangladesh" data-testid="button-view-all-destinations">
            <span className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
              View All Destinations <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="py-24 bg-muted/30 px-4 sm:px-6 lg:px-8" data-testid="section-latest-posts">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">Writing</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mt-2">
              {t.latestPosts}
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {latestPosts.map((post, i) => (
              <motion.div
                key={post.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
              >
                <Link href={`/blog/${post.id}`} data-testid={`card-post-${post.id}`}>
                  <div className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{post.category}</span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog" data-testid="button-view-all-posts">
              <span className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
                All Stories <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* PHOTO STRIP */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="section-photo-strip">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">Gallery</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mt-2">
            {t.photoJournal}
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stripPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              custom={i % 4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`overflow-hidden rounded-xl ${i === 0 || i === 5 ? "sm:col-span-2 aspect-[4/3]" : "aspect-square"}`}
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
                data-testid={`img-photo-strip-${photo.id}`}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/photos" data-testid="button-view-all-photos">
            <span className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
              Full Photo Journal <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 px-4 bg-primary text-primary-foreground" data-testid="section-newsletter">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Mail size={40} className="mx-auto mb-4 opacity-80" />
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-3">{t.newsletterTitle}</h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">{t.newsletterSub}</p>

            {subscribed ? (
              <p className="text-xl font-semibold font-serif italic">Welcome aboard the journey.</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                data-testid="form-newsletter"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  data-testid="input-newsletter-email"
                  className="flex-1 px-5 py-3 rounded-full bg-primary-foreground/15 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/70 text-sm"
                />
                <button
                  type="submit"
                  data-testid="button-newsletter-subscribe"
                  className="px-7 py-3 bg-primary-foreground text-primary rounded-full font-semibold hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
                >
                  {t.subscribe}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
