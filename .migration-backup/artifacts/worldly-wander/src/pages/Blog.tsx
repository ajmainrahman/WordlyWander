import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowRight, Facebook, Twitter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/contexts/LanguageContext";
import { fetchPosts, type BlogPost } from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07 } }),
};

export default function Blog() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const { data: allPosts = [], isLoading } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });

  const filtered = allPosts.filter((p: BlogPost) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.excerpt ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen" data-testid="page-blog">
      <div className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70">Writing</span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-5">{t.blog}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">Field notes, family observations, and honest accounts of life on the road in Bangladesh.</p>
          </motion.div>
        </div>
      </div>

      <div className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder}
              data-testid="input-blog-search"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-posts-grid">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24" data-testid="text-no-posts">
            <p className="text-muted-foreground text-lg">{search ? "No stories found. Try a different search." : "No posts published yet."}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-8">{filtered.length} {filtered.length === 1 ? "story" : "stories"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post: BlogPost, i) => (
                <motion.article key={post.id} custom={i % 3} initial="hidden" animate="visible" variants={fadeUp}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  data-testid={`card-post-${post.id}`}>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={post.coverImageUrl || "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80"} alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground mb-3">{formatDate(post.createdAt)}</p>
                    <h2 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">{post.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <Link href={`/blog/${post.slug}`} data-testid={`link-post-${post.id}`}>
                        <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold cursor-pointer hover:gap-2 transition-all">
                          {t.readMore} <ArrowRight size={14} />
                        </span>
                      </Link>
                      <div className="flex gap-2">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin + "/blog/" + post.slug : "")}`}
                          target="_blank" rel="noopener noreferrer" data-testid={`button-share-fb-${post.id}`} className="text-muted-foreground hover:text-blue-600 transition-colors">
                          <Facebook size={14} />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                          target="_blank" rel="noopener noreferrer" data-testid={`button-share-tw-${post.id}`} className="text-muted-foreground hover:text-sky-500 transition-colors">
                          <Twitter size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
