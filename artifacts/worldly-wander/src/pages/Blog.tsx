import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowRight, Facebook, Twitter, Share2 } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import postsData from "@/data/posts.json";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07 },
  }),
};

const CATEGORIES = ["All", "Adventure", "Food", "Culture", "Tips"];

export default function Blog() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = postsData.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen" data-testid="page-blog">
      {/* Header */}
      <div className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">Writing</span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-5">
              {t.blog}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Field notes, family observations, and honest accounts of life on the road in Bangladesh.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              data-testid="input-blog-search"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                data-testid={`button-category-${cat.toLowerCase()}`}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {cat === "All" ? t.allCategories : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-posts-grid">
        <p className="text-sm text-muted-foreground mb-8">
          {filtered.length} {filtered.length === 1 ? "story" : "stories"}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-24" data-testid="text-no-posts">
            <p className="text-muted-foreground text-lg">No stories found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post, i) => (
              <motion.article
                key={post.id}
                custom={i % 3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                data-testid={`card-post-${post.id}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link href={`/blog/${post.id}`} data-testid={`link-post-${post.id}`}>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold cursor-pointer hover:gap-2 transition-all">
                        {t.readMore} <ArrowRight size={14} />
                      </span>
                    </Link>
                    <div className="flex gap-2">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin + "/blog/" + post.id : "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`button-share-fb-${post.id}`}
                        className="text-muted-foreground hover:text-blue-600 transition-colors"
                        title="Share on Facebook"
                      >
                        <Facebook size={14} />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`button-share-tw-${post.id}`}
                        className="text-muted-foreground hover:text-sky-500 transition-colors"
                        title="Share on Twitter"
                      >
                        <Twitter size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
