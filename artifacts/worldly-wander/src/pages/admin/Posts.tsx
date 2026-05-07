import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminFetchPosts, adminCreatePost, adminUpdatePost, adminDeletePost, type BlogPost } from "@/lib/api";

const EMPTY: Partial<BlogPost> = {
  title: "", content: "", excerpt: "", coverImageUrl: "", published: false,
};

export default function AdminPosts() {
  const qc = useQueryClient();
  const { data: posts = [], isLoading } = useQuery({ queryKey: ["admin", "posts"], queryFn: adminFetchPosts });

  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "posts"] });

  const create = useMutation({ mutationFn: adminCreatePost, onSuccess: () => { invalidate(); setEditing(null); } });
  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BlogPost> }) => adminUpdatePost(id, data),
    onSuccess: () => { invalidate(); setEditing(null); },
  });
  const remove = useMutation({
    mutationFn: adminDeletePost,
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const openNew = () => { setEditing({ ...EMPTY }); setIsNew(true); };
  const openEdit = (p: BlogPost) => { setEditing({ ...p }); setIsNew(false); };

  const save = () => {
    if (!editing) return;
    if (isNew) {
      create.mutate(editing);
    } else {
      update.mutate({ id: editing.id!, data: editing });
    }
  };

  const isPending = create.isPending || update.isPending;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <AdminLayout>
      <div className="p-8" data-testid="page-admin-posts">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Blog Posts</h2>
            <p className="text-sm text-muted-foreground">{posts.length} total</p>
          </div>
          <button data-testid="button-new-post" onClick={openNew}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus size={16} /> New Post
          </button>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground" data-testid="text-no-posts">
            <p>No posts yet. Create your first one.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm" data-testid="table-posts">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground hidden md:table-cell">Excerpt</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground hidden lg:table-cell">Created</th>
                  <th className="text-center px-5 py-3 font-semibold text-foreground">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/20" data-testid={`row-post-${post.id}`}>
                    <td className="px-5 py-3 font-medium text-foreground max-w-xs truncate">{post.title}</td>
                    <td className="px-5 py-3 text-muted-foreground max-w-xs truncate hidden md:table-cell">{post.excerpt}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">{formatDate(post.createdAt)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${post.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                        {post.published ? <><Eye size={11} /> Published</> : <><EyeOff size={11} /> Draft</>}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button data-testid={`button-edit-post-${post.id}`} onClick={() => openEdit(post)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button data-testid={`button-delete-post-${post.id}`} onClick={() => setDeleteId(post.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete confirm */}
        {deleteId !== null && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" data-testid="modal-delete-confirm">
            <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">Delete post?</h3>
              <p className="text-sm text-muted-foreground mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button data-testid="button-confirm-delete" onClick={() => remove.mutate(deleteId!)}
                  disabled={remove.isPending}
                  className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60">
                  {remove.isPending ? "Deleting..." : "Delete"}
                </button>
                <button data-testid="button-cancel-delete" onClick={() => setDeleteId(null)}
                  className="flex-1 border border-border py-2 rounded-lg text-sm font-semibold hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit/New drawer */}
        {editing !== null && (
          <div className="fixed inset-0 z-50 flex" data-testid="drawer-post-form">
            <div className="flex-1 bg-black/40" onClick={() => setEditing(null)} />
            <div className="w-full max-w-xl bg-background border-l border-border overflow-y-auto flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-serif text-lg font-bold">{isNew ? "New Post" : "Edit Post"}</h3>
                <button data-testid="button-close-drawer" onClick={() => setEditing(null)} className="p-1.5 hover:bg-muted rounded-md">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 px-6 py-5 space-y-4">
                <Field label="Title">
                  <input value={editing.title ?? ""} onChange={(e) => setEditing((v) => ({ ...v!, title: e.target.value }))}
                    data-testid="input-post-title" placeholder="Post title" className={inputCls} />
                </Field>

                <Field label="Excerpt">
                  <input value={editing.excerpt ?? ""} onChange={(e) => setEditing((v) => ({ ...v!, excerpt: e.target.value }))}
                    data-testid="input-post-excerpt" placeholder="Short summary" className={inputCls} />
                </Field>

                <Field label="Cover Image URL">
                  <input value={editing.coverImageUrl ?? ""} onChange={(e) => setEditing((v) => ({ ...v!, coverImageUrl: e.target.value }))}
                    data-testid="input-post-cover" placeholder="https://..." className={inputCls} />
                </Field>

                {editing.coverImageUrl && (
                  <img src={editing.coverImageUrl} alt="preview" className="h-36 w-full object-cover rounded-lg border border-border" />
                )}

                <Field label="Content">
                  <textarea value={editing.content ?? ""} onChange={(e) => setEditing((v) => ({ ...v!, content: e.target.value }))}
                    data-testid="input-post-content" rows={12} placeholder="Write your post here..." className={`${inputCls} resize-y min-h-40`} />
                </Field>

                <label className="flex items-center gap-3 cursor-pointer" data-testid="toggle-post-published">
                  <div className={`w-10 h-6 rounded-full transition-colors ${editing.published ? "bg-primary" : "bg-muted"} relative`}
                    onClick={() => setEditing((v) => ({ ...v!, published: !v!.published }))}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${editing.published ? "translate-x-5" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">Published</span>
                </label>
              </div>

              <div className="px-6 py-4 border-t border-border flex gap-3">
                <button data-testid="button-save-post" onClick={save} disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  <Check size={15} /> {isPending ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing(null)}
                  className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 placeholder:text-muted-foreground";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
