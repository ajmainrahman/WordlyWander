import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X, Upload, Link as LinkIcon, Loader2, Pencil, Check, Image } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  adminFetchGallery, adminFetchDestinations, adminAddPhoto,
  adminUpdatePhoto, adminDeletePhoto, uploadFileToStorage,
  convertGoogleDriveUrl, type GalleryPhoto,
} from "@/lib/api";

type EditState = { id: number; imageUrl: string; caption: string; destinationId: string };

export default function AdminGallery() {
  const qc = useQueryClient();
  const { data: photos = [], isLoading } = useQuery({ queryKey: ["admin", "gallery"], queryFn: adminFetchGallery });
  const { data: destinations = [] } = useQuery({ queryKey: ["admin", "destinations"], queryFn: adminFetchDestinations });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ imageUrl: "", caption: "", destinationId: "" });
  const [uploadMode, setUploadMode] = useState<"url" | "file" | "drive">("drive");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [driveInput, setDriveInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "gallery"] });

  const add = useMutation({
    mutationFn: () => adminAddPhoto({
      imageUrl: form.imageUrl,
      caption: form.caption || undefined,
      destinationId: form.destinationId ? Number(form.destinationId) : null,
    }),
    onSuccess: () => {
      invalidate();
      setForm({ imageUrl: "", caption: "", destinationId: "" });
      setDriveInput("");
      setShowForm(false);
    },
  });

  const update = useMutation({
    mutationFn: () => adminUpdatePhoto(editing!.id, {
      imageUrl: editing!.imageUrl,
      caption: editing!.caption,
      destinationId: editing!.destinationId ? Number(editing!.destinationId) : null,
    }),
    onSuccess: () => { invalidate(); setEditing(null); },
  });

  const remove = useMutation({ mutationFn: adminDeletePhoto, onSuccess: () => { invalidate(); setDeleteId(null); } });

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadProgress("Uploading...");
    try {
      const url = await uploadFileToStorage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      setUploadProgress("Uploaded!");
    } catch {
      setUploadProgress("Upload failed. Try a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const applyDriveLink = () => {
    const converted = convertGoogleDriveUrl(driveInput.trim());
    setForm((f) => ({ ...f, imageUrl: converted }));
  };

  const openAdd = () => {
    setForm({ imageUrl: "", caption: "", destinationId: "" });
    setDriveInput("");
    setUploadProgress("");
    setUploadMode("drive");
    setShowForm(true);
  };

  const openEdit = (photo: GalleryPhoto) => {
    setEditing({
      id: photo.id,
      imageUrl: photo.imageUrl,
      caption: photo.caption ?? "",
      destinationId: photo.destinationId ? String(photo.destinationId) : "",
    });
  };

  return (
    <AdminLayout>
      <div className="p-8" data-testid="page-admin-gallery">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Gallery</h2>
            <p className="text-sm text-muted-foreground">{photos.length} photos</p>
          </div>
          <button data-testid="button-add-photo" onClick={openAdd}
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

            {/* Mode tabs */}
            <div className="flex gap-2 mb-5">
              {(["drive", "url", "file"] as const).map((mode) => (
                <button key={mode} onClick={() => { setUploadMode(mode); setForm((f) => ({ ...f, imageUrl: "" })); setDriveInput(""); setUploadProgress(""); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${uploadMode === mode ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {mode === "drive" && <><Image size={12} /> Google Drive</>}
                  {mode === "url" && <><LinkIcon size={12} /> Any URL</>}
                  {mode === "file" && <><Upload size={12} /> Upload File</>}
                </button>
              ))}
            </div>

            {/* Google Drive mode — simple paste box */}
            {uploadMode === "drive" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Paste your Google Drive share link
                </label>
                <div className="flex gap-2">
                  <input
                    value={driveInput}
                    onChange={(e) => setDriveInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className={inputCls + " flex-1"}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text").trim();
                      setTimeout(() => {
                        const converted = convertGoogleDriveUrl(pasted);
                        setDriveInput(pasted);
                        setForm((f) => ({ ...f, imageUrl: converted }));
                      }, 0);
                    }}
                  />
                  <button onClick={applyDriveLink} disabled={!driveInput.trim()}
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors whitespace-nowrap">
                    <Check size={15} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  In Google Drive: right-click the file → "Share" → "Copy link", then paste above.
                </p>
                {form.imageUrl && (
                  <p className="text-xs text-green-600 mt-1 font-medium">✓ Link converted and ready</p>
                )}
              </div>
            )}

            {/* URL mode */}
            {uploadMode === "url" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">Image URL <span className="text-destructive">*</span></label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => {
                    const converted = convertGoogleDriveUrl(e.target.value.trim());
                    setForm((f) => ({ ...f, imageUrl: converted }));
                  }}
                  data-testid="input-photo-url"
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>
            )}

            {/* File upload mode */}
            {uploadMode === "file" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">Upload Image</label>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={24} className="animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : form.imageUrl ? (
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-sm text-green-600 font-medium">✓ {uploadProgress}</p>
                      <p className="text-xs text-muted-foreground">Click to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">Click to choose a photo</p>
                      <p className="text-xs text-muted-foreground/60">JPG, PNG, WebP up to 10MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
              </div>
            )}

            {/* Preview */}
            {form.imageUrl && (
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Preview</p>
                <img src={form.imageUrl} alt="preview" className="h-40 w-full object-cover rounded-lg border border-border bg-muted"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                  {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
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

        {/* Photo Grid */}
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground" data-testid="text-no-photos">
            <p>No photos yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="grid-photos">
            {photos.map((photo: GalleryPhoto) => (
              <div key={photo.id} className="bg-card border border-border rounded-xl overflow-hidden" data-testid={`card-photo-${photo.id}`}>
                <div className="aspect-video overflow-hidden bg-muted">
                  <img src={photo.imageUrl} alt={photo.caption ?? ""} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  {photo.caption && (
                    <p className="text-sm font-medium text-foreground truncate mb-0.5">{photo.caption}</p>
                  )}
                  {photo.destinationName && (
                    <p className="text-xs text-muted-foreground truncate mb-2">{photo.destinationName}</p>
                  )}
                  {!photo.caption && !photo.destinationName && (
                    <p className="text-xs text-muted-foreground italic mb-2">No caption</p>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(photo)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => setDeleteId(photo.id)}
                      data-testid={`button-delete-photo-${photo.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10 transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-lg">Edit Photo</h3>
                <button onClick={() => setEditing(null)} className="p-1.5 hover:bg-muted rounded-md"><X size={16} /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Image URL</label>
                  <input
                    value={editing.imageUrl}
                    onChange={(e) => {
                      const converted = convertGoogleDriveUrl(e.target.value.trim());
                      setEditing((f) => f ? { ...f, imageUrl: converted } : f);
                    }}
                    placeholder="https://... or Google Drive link"
                    className={inputCls}
                  />
                </div>

                {editing.imageUrl && (
                  <img src={editing.imageUrl} alt="preview"
                    className="h-36 w-full object-cover rounded-lg border border-border bg-muted"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Caption</label>
                  <input value={editing.caption}
                    onChange={(e) => setEditing((f) => f ? { ...f, caption: e.target.value } : f)}
                    placeholder="Describe the photo..." className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Destination (optional)</label>
                  <select value={editing.destinationId}
                    onChange={(e) => setEditing((f) => f ? { ...f, destinationId: e.target.value } : f)}
                    className={inputCls}>
                    <option value="">No destination</option>
                    {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => update.mutate()} disabled={!editing.imageUrl || update.isPending}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {update.isPending ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => setEditing(null)} className="flex-1 border border-border py-2 rounded-lg text-sm font-semibold hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
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
                <button onClick={() => setDeleteId(null)} className="flex-1 border border-border py-2 rounded-lg text-sm font-semibold hover:bg-muted">
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

const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground";
