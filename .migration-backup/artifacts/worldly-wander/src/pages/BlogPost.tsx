import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Facebook, Twitter, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPost, fetchPosts, type BlogPost } from "@/lib/api";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:id");
  const slug = params?.id ?? "";

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
    enabled: !!slug,
  });

  const { data: allPosts = [] } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-3xl mx-auto animate-pulse space-y-6">
          <div className="h-[50vh] bg-muted rounded-2xl" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="space-y-3"><div className="h-4 bg-muted rounded" /><div className="h-4 bg-muted rounded w-5/6" /></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Post not found</h1>
          <Link href="/blog"><span className="text-primary cursor-pointer hover:underline">Back to blog</span></Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const related = allPosts.filter((p: BlogPost) => p.id !== post.id).slice(0, 2);
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen" data-testid="page-blog-post">
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img src={post.coverImageUrl || "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=80"} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-4xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/blog" data-testid="link-back-to-blog">
              <span className="inline-flex items-center gap-1 text-white/70 text-sm mb-3 cursor-pointer hover:text-white"><ArrowLeft size={14} /> Blog</span>
            </Link>
            <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(post.createdAt)}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {post.excerpt && (
            <p className="text-xl leading-relaxed text-muted-foreground italic font-light border-l-4 border-primary pl-6 mb-8">{post.excerpt}</p>
          )}
          <div className="prose prose-lg max-w-none text-foreground/85 leading-relaxed space-y-5" data-testid="text-post-content">
            {post.content.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
          </div>

          <div className="border-t border-border mt-12 pt-8">
            <p className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2"><Share2 size={14} /> Share this story</p>
            <div className="flex gap-3">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                data-testid="button-share-facebook" className="inline-flex items-center gap-2 text-sm px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Facebook size={14} /> Share on Facebook
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer"
                data-testid="button-share-twitter" className="inline-flex items-center gap-2 text-sm px-5 py-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                <Twitter size={14} /> Share on Twitter
              </a>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16" data-testid="section-related-posts">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">More Stories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((r: BlogPost) => (
                  <Link key={r.id} href={`/blog/${r.slug}`} data-testid={`card-related-post-${r.id}`}>
                    <div className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={r.coverImageUrl || "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80"} alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
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
