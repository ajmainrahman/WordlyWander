import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  adminFetchDestinations, adminCreateDestination, adminUpdateDestination,
  adminDeleteDestination, type Destination,
} from "@/lib/api";

const EMPTY: Partial<Destination> = {
  name: "", region: "", description: "", coverImageUrl: "", bestTimeToVisit: "", published: false,
};

export default function AdminDestinations() {
  const qc = useQueryClient();
  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["admin", "destinations"],
    queryFn: adminFetchDestinations,
  });

  const [editing, setEditing] = useState<Partial<Destination> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "destinations"] });

  const create = useMutation({ mutationFn: adminCreateDestination, onSuccess: () => { invalidate(); setEditing(null); } });
  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Destination> }) => adminUpdateDestination(id, data),
    onSuccess: () => { invalidate(); setEditing(null); },
  });
  const remove = useMutation({ mutationFn: adminDeleteDestination, onSuccess: () => { invalidate(); setDeleteId(null); } });

  const save = () => {
    if (!editing) return;
    if (isNew) create.mutate(editing);
    else update.mutate({ id: editing.id!, data: editing });
  };

  const isPending = create.isPending || update.isPending;
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <AdminLayout>
      <div className="p-8" data-testid="page-admin-destinations">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Destinations</h2>
            <p className="text-sm text-muted-foreground">{destinations.length} total</p>
          </div>
          <button data-testid="button-new-destination" onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus size={16} /> New Destination
          </button>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground" data-testid="text-no-destinations">
            <p>No destinations yet. Add your first one.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm" data-testid="table-destinations">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground hidden md:table-cell">Region</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground hidden lg:table-cell">Created</th>
                  <th className="text-center px-5 py-3 font-semibold text-foreground">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((dest) => (
                  <tr key={dest.id} className="border-b border-border last:border-0 hover:bg-muted/20" data-testid={`row-destination-${dest.id}`}>
                    <td className="px-5 py-3 font-medium text-foreground">{dest.name}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{dest.region}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">{formatDate(dest.createdAt)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${dest.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                        {dest.published ? <><Eye size={11} /> Published</> : <><EyeOff size={11} /> Draft</>}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button data-testid={`button-edit-destination-${dest.id}`} onClick={() => { setEditing({ ...dest }); setIsNew(false); }}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button data-testid={`button-delete-destination-${dest.id}`} onClick={() => setDeleteId(dest.id)}
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

        {deleteId !== null && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-serif font-bold text-lg mb-2">Delete destination?</h3>
              <p className="text-sm text-muted-foreground mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button data-testid="button-confirm-delete" onClick={() => remove.mutate(deleteId!)} disabled={remove.isPending}
                  className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                  {remove.isPending ? "Deleting..." : "Delete"}
                </button>
                <button onClick={() => setDeleteId(null)} className="flex-1 border border-border py-2 rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {editing !== null && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40" onClick={() => setEditing(null)} />
            <div className="w-full max-w-xl bg-background border-l border-border overflow-y-auto flex flex-col" data-testid="drawer-destination-form">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-serif text-lg font-bold">{isNew ? "New Destination" : "Edit Destination"}</h3>
                <button onClick={() => setEditing(null)} className="p-1.5 hover:bg-muted rounded-md"><X size={18} /></button>
              </div>
              <div className="flex-1 px-6 py-5 space-y-4">
                {[
                  { label: "Name", key: "name", placeholder: "e.g. Cox's Bazar" },
                  { label: "Region", key: "region", placeholder: "e.g. Chittagong Division" },
                  { label: "Best Time to Visit", key: "bestTimeToVisit", placeholder: "e.g. November – March" },
                  { label: "Cover Image URL", key: "coverImageUrl", placeholder: "https://..." },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                    <input
                      value={(editing as Record<string, unknown>)[key] as string ?? ""}
                      onChange={(e) => setEditing((v) => ({ ...v!, [key]: e.target.value }))}
                      placeholder={placeholder}
                      data-testid={`input-destination-${key}`}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                    />
                  </div>
                ))}

                {editing.coverImageUrl && (
                  <img src={editing.coverImageUrl} alt="preview" className="h-36 w-full object-cover rounded-lg border border-border" />
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                  <textarea value={editing.description ?? ""} onChange={(e) => setEditing((v) => ({ ...v!, description: e.target.value }))}
                    data-testid="input-destination-description" rows={6} placeholder="Describe this destination..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y placeholder:text-muted-foreground" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer" data-testid="toggle-destination-published">
                  <div className={`w-10 h-6 rounded-full transition-colors ${editing.published ? "bg-primary" : "bg-muted"} relative`}
                    onClick={() => setEditing((v) => ({ ...v!, published: !v!.published }))}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${editing.published ? "translate-x-5" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">Published</span>
                </label>
              </div>
              <div className="px-6 py-4 border-t border-border flex gap-3">
                <button data-testid="button-save-destination" onClick={save} disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  <Check size={15} /> {isPending ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing(null)} className="px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
