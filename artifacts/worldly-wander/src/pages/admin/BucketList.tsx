import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, CheckCircle2, Circle, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  adminFetchBucketList, adminCreateBucketListItem, adminUpdateBucketListItem,
  adminDeleteBucketListItem, type BucketListItem,
} from "@/lib/api";

const EMPTY: Partial<BucketListItem> = { title: "", description: "", imageUrl: "", completed: false };

export default function AdminBucketList() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin", "bucket-list"], queryFn: adminFetchBucketList });
  const [editing, setEditing] = useState<Partial<BucketListItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "bucket-list"] });

  const create = useMutation({ mutationFn: adminCreateBucketListItem, onSuccess: () => { invalidate(); setEditing(null); } });
  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BucketListItem> }) => adminUpdateBucketListItem(id, data),
    onSuccess: () => { invalidate(); setEditing(null); },
  });
  const remove = useMutation({ mutationFn: adminDeleteBucketListItem, onSuccess: () => { invalidate(); setDeleteId(null); } });

  const toggleComplete = (item: BucketListItem) => {
    update.mutate({ id: item.id, data: { ...item, completed: !item.completed } });
  };

  const save = () => {
    if (!editing?.title?.trim()) return;
    if (isNew) create.mutate(editing);
    else update.mutate({ id: editing!.id!, data: editing! });
  };

  return (
    <AdminLayout>
      <div className="p-8" data-testid="page-admin-bucket-list">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Bucket List</h2>
            <p className="text-sm text-muted-foreground">{items.length} items · {items.filter((i) => i.completed).length} completed</p>
          </div>
          <button onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Form */}
        {editing && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{isNew ? "New Bucket List Item" : "Edit Item"}</h3>
              <button onClick={() => setEditing(null)} className="p-1.5 hover:bg-muted rounded-md"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Title <span className="text-destructive">*</span></label>
                <input value={editing.title ?? ""} onChange={(e) => setEditing((f) => ({ ...f!, title: e.target.value }))}
                  placeholder="e.g. Hike the Sundarbans at sunrise" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea value={editing.description ?? ""} onChange={(e) => setEditing((f) => ({ ...f!, description: e.target.value }))}
                  placeholder="Add more details..." rows={2} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Image URL (optional)</label>
                <input value={editing.imageUrl ?? ""} onChange={(e) => setEditing((f) => ({ ...f!, imageUrl: e.target.value }))}
                  placeholder="https://..." className={inputCls} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="completed" checked={editing.completed ?? false}
                  onChange={(e) => setEditing((f) => ({ ...f!, completed: e.target.checked }))}
                  className="w-4 h-4 rounded border-border" />
                <label htmlFor="completed" className="text-sm font-medium">Mark as completed</label>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={save} disabled={!editing.title?.trim() || create.isPending || update.isPending}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                {create.isPending || update.isPending ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditing(null)} className="border border-border px-5 py-2 rounded-lg text-sm hover:bg-muted">Cancel</button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No bucket list items yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
                <button onClick={() => toggleComplete(item)} className="flex-shrink-0">
                  {item.completed
                    ? <CheckCircle2 size={22} className="text-green-500" />
                    : <Circle size={22} className="text-muted-foreground/40 hover:text-primary" />}
                </button>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</p>
                  {item.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(item); setIsNew(false); }}
                    className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteId !== null && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-serif font-bold text-lg mb-2">Delete item?</h3>
              <p className="text-sm text-muted-foreground mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => remove.mutate(deleteId!)} disabled={remove.isPending}
                  className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                  {remove.isPending ? "Deleting..." : "Delete"}
                </button>
                <button onClick={() => setDeleteId(null)} className="flex-1 border border-border py-2 rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground";
