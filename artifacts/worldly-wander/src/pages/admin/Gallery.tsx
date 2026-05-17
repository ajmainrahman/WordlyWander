import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X, Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminFetchGallery, adminFetchDestinations, adminAddPhoto, adminDeletePhoto, uploadFileToStorage, convertGoogleDriveUrl, type GalleryPhoto } from "@/lib/api";

export default function AdminGallery() {
  const qc = useQueryClient();
  const { data: photos = [], isLoading } = useQuery({ queryKey: ["admin", "gallery"], queryFn: adminFetchGallery });
  const { data: destinations = [] } = useQuery({ queryKey: ["admin", "destinations"], queryFn: adminFetchDestinations });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ imageUrl: "", caption: "", destinationId: "" });
  const [uploadMode, setUploadMode] = useState<"url" | "file">("file");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadProgress("Uploading...");
    try {
      const url = await uploadFileToStorage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      setUploadProgress("Uploaded successfully!");
    } catch (e) {
      setUploadProgress("Upload failed. Try a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8" data-testid="page-admin-gallery">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Gallery</h2>
            <p className="text-sm text-muted-foreground">{photos.length} photos · Images are stored permanently in the cloud</p>
          </div>
          <button data-testid="button-add-photo" onClick={() => { setShowForm(true); setUploadProgress(""); setForm({ imageUrl: "", caption: "", destinationId: "" }); }}
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

            {/* Upload mode toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setUploadMode("file"); setForm((f) => ({ ...f, imageUrl: "" })); setUploadProgress(""); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${uploadMode === "file" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                <Upload size={12} /> Upload File
              </button>
              <button
                onClick={() => { setUploadMode("url"); setForm((f) => ({ ...f, imageUrl: "" })); setUploadProgress(""); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${uploadMode === "url" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                <LinkIcon size={12} /> Paste URL
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                {uploadMode === "file" ? (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Upload Image <span className="text-green-600 text-xs font-normal">(stored permanently — no expiry)</span></label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 size={24} className="animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">Uploading to cloud...</p>
                        </div>
                      ) : form.imageUrl ? (
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-sm text-green-600 font-medium">✓ {uploadProgress || "File uploaded"}</p>
                          <p className="text-xs text-muted-foreground">Click to replace</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={24} className="text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">Click to choose a photo from your device</p>
                          <p className="text-xs text-muted-foreground/60">JPG, PNG, WebP up to 10MB</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                    {uploadProgress && !uploading && (
                      <p className={`text-xs mt-1.5 ${uploadProgress.includes("failed") ? "text-destructive" : "text-green-600"}`}>{uploadProgress}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Image URL <span className="text-destructive">*</span></label>
                    <input
                      value={form.imageUrl}
                      onChange={(e) => {
                        const converted = convertGoogleDriveUrl(e.target.value.trim());
                        setForm((f) => ({ ...f, imageUrl: converted }));
                      }}
                      data-testid="input-photo-url"
                      placeholder="https://... or Google Drive share link"
                      className={inputCls}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Google Drive share links are automatically converted. For permanent storage, use file upload.
                    </p>
                  </div>
                )}
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
              <button data-testid="button-save-photo" onClick={() => add.mutate()} disabled={!form.imageUrl || add.isPending || uploading}
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
            <p>No photos yet. Add your first one using the upload button above.</p>
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
