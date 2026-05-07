import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminFetchGallery, adminFetchDestinations, adminAddPhoto, adminDeletePhoto, type GalleryPhoto } from "@/lib/api";

export default function AdminGallery() {
  const qc = useQueryClient();
  const { data: photos = [], isLoading } = useQuery({ queryKey: ["admin", "gallery"], queryFn: adminFetchGallery });
  const { data: destinations = [] } = useQuery({ queryKey: ["admin", "destinations"], queryFn: adminFetchDestinations });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ imageUrl: "", caption: "", destinationId: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "gallery"] });

  const add = useMutation({
    mutationFn: () =>
      adminAddPhoto({
        imageUrl: form.imageUrl,
        caption: form.caption || undefined,
        destinationId: form.destinationId ? Number(form.destinationId) : null,
      }),
    onSuccess: () => { invalidate(); setForm({ imageUrl: "", caption: "", destinationId: "" }); setShowForm(false); },
  });

  const remove = useMutation({ mutationFn: adminDeletePhoto, onSuccess: () => { invalidate(); setDeleteId(null); } });

  return (
    <AdminLayout>
      <div className="p-8" data-testid="page-admin-gallery">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Gallery</h2>
            <p className="text-sm text-muted-foreground">{photos.length} photos</p>
          </div>
          <button data-testid="button-add-photo" onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Add Photo
          </button>
        </div>

        {/* Add Photo Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6" data-testid="form-add-photo">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Add New Photo</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-muted rounded-md"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Image URL <span className="text-destructive">*</span></label>
                <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  data-testid="input-photo-url" placeholder="https://drive.google.com/..." className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Caption</label>
                <input value={form.caption} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                  data-testid="input-photo-caption" placeholder="Describe the photo..." className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Destination (optional)</label>
                <select value={form.destinationId} onChange={(e) => setForm((f) => ({ ...f, destinationId: e.target.value }))}
                  data-testid="select-photo-destination" className={inputCls}>
                  <option value="">No destination</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {form.imageUrl && (
              <div className="mt-4">
                <img src={form.imageUrl} alt="preview" className="h-40 w-full object-cover rounded-lg border border-border" />
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button data-testid="button-save-photo" onClick={() => add.mutate()} disabled={!form.imageUrl || add.isPending}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                {add.isPending ? "Adding..." : "Add Photo"}
              </button>
              <button onClick={() => setShowForm(false)} className="border border-border px-5 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground" data-testid="text-no-photos">
            <p>No photos yet. Add your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" data-testid="grid-photos">
            {photos.map((photo: GalleryPhoto) => (
              <div key={photo.id} className="group relative bg-card border border-border rounded-xl overflow-hidden" data-testid={`card-photo-${photo.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img src={photo.imageUrl} alt={photo.caption ?? ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button data-testid={`button-delete-photo-${photo.id}`} onClick={() => setDeleteId(photo.id)}
                    className="opacity-0 group-hover:opacity-100 bg-destructive text-white p-2 rounded-full transition-opacity">
                    <Trash2 size={14} />
                  </button>
                </div>
                {(photo.caption || photo.destinationName) && (
                  <div className="p-2">
                    {photo.caption && <p className="text-xs text-foreground truncate">{photo.caption}</p>}
                    {photo.destinationName && <p className="text-xs text-muted-foreground truncate">{photo.destinationName}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {deleteId !== null && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-serif font-bold text-lg mb-2">Delete photo?</h3>
              <p className="text-sm text-muted-foreground mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button data-testid="button-confirm-delete-photo" onClick={() => remove.mutate(deleteId!)} disabled={remove.isPending}
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
