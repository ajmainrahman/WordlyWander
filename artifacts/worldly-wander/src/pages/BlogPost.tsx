import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Facebook, Twitter, Share2 } from "lucide-react";
import postsData from "@/data/posts.json";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const post = postsData.find((p) => p.id === params?.id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Post not found</h1>
          <Link href="/blog">
            <span className="text-primary cursor-pointer hover:underline">Back to blog</span>
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const related = postsData.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen" data-testid="page-blog-post">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-4xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/blog" data-testid="link-back-to-blog">
              <span className="inline-flex items-center gap-1 text-white/70 text-sm mb-3 cursor-pointer hover:text-white">
                <ArrowLeft size={14} /> Blog
              </span>
            </Link>
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {post.category}
            </span>
            <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><Calendar size={13} /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-xl leading-relaxed text-muted-foreground italic font-light border-l-4 border-primary pl-6 mb-8">
            {post.excerpt}
          </p>
          <div className="prose prose-lg max-w-none text-foreground/85 leading-relaxed" data-testid="text-post-content">
            {post.content.split(". ").map((sentence, i) => (
              <p key={i} className="mb-5">{sentence}{i < post.content.split(". ").length - 1 ? "." : ""}</p>
            ))}
          </div>

          {/* Share */}
          <div className="border-t border-border mt-12 pt-8">
            <p className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <Share2 size={14} /> Share this story
            </p>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-share-facebook"
                className="inline-flex items-center gap-2 text-sm px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Facebook size={14} /> Share on Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-share-twitter"
                className="inline-flex items-center gap-2 text-sm px-5 py-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
              >
                <Twitter size={14} /> Share on Twitter
              </a>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16" data-testid="section-related-posts">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">More in {post.category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((r) => (
                  <Link key={r.id} href={`/blog/${r.id}`} data-testid={`card-related-post-${r.id}`}>
                    <div className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-semibold text-primary">{r.category}</span>
                        <h3 className="font-serif font-bold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
