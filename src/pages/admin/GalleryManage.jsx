import { useMemo, useState } from "react";
import {
  createGallery,
  deleteGallery,
  getGallery,
} from "../../api/admin.api";
import FileUpload from "../../components/FileUpload";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import { showError, showSuccess } from "../../components/Toast";

const categories = ["Campus", "Events", "Sports", "Cultural", "Classrooms"];

const GalleryManage = () => {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ caption: "", category: "Campus" });
  const [file, setFile] = useState(null);
  const galleryState = useFetch(() => getGallery({ category: categoryFilter }), [categoryFilter]);

  const items = useMemo(() => galleryState.data || [], [galleryState.data]);

  const upload = async () => {
    if (!file || !form.caption || !form.category) {
      showError("File, caption and category are required");
      return;
    }
    const data = new FormData();
    data.append("file", file);
    data.append("caption", form.caption);
    data.append("category", form.category);
    try {
      await createGallery(data);
      showSuccess("Image uploaded");
      setForm({ caption: "", category: "Campus" });
      setFile(null);
      await galleryState.execute({ category: categoryFilter });
    } catch (error) {
      showError(error?.response?.data?.message || "Upload failed");
    }
  };

  const removeOne = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteGallery(id);
      showSuccess("Image deleted");
      await galleryState.execute({ category: categoryFilter });
    } catch (error) {
      showError(error?.response?.data?.message || "Delete failed");
    }
  };

  const bulkDelete = async () => {
    if (!selected.length) {
      showError("Select images first");
      return;
    }
    if (!window.confirm(`Delete ${selected.length} images?`)) return;
    try {
      await Promise.all(selected.map((id) => deleteGallery(id)));
      setSelected([]);
      showSuccess("Selected images deleted");
      await galleryState.execute({ category: categoryFilter });
    } catch (error) {
      showError(error?.response?.data?.message || "Bulk delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Gallery Management</h1>

      <div className="rounded-xl bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-primary">Upload New Image</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input className="rounded border" placeholder="Caption" value={form.caption} onChange={(e) => setForm((prev) => ({ ...prev, caption: e.target.value }))} />
          <select className="rounded border" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button onClick={upload} className="rounded bg-primary px-4 py-2 text-white">
            Upload
          </button>
        </div>
        <div className="mt-3">
          <FileUpload file={file} onChange={setFile} accept="image/*" />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-card">
        <select className="rounded border" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button onClick={bulkDelete} className="rounded border px-3 py-2 text-sm">
          Bulk Delete
        </button>
      </div>

      {galleryState.loading ? (
        <Loader />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="overflow-hidden rounded-xl bg-white shadow-card">
              <img src={item.imageUrl} alt={item.caption} className="h-44 w-full object-cover" />
              <div className="space-y-2 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.caption}</p>
                  <input
                    type="checkbox"
                    checked={selected.includes(item._id)}
                    onChange={(e) =>
                      setSelected((prev) =>
                        e.target.checked ? [...prev, item._id] : prev.filter((id) => id !== item._id),
                      )
                    }
                  />
                </div>
                <p className="text-xs text-slate-500">{item.category}</p>
                <button onClick={() => removeOne(item._id)} className="rounded border px-3 py-1 text-xs text-rose-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManage;
