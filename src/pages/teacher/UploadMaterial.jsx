import { useState } from "react";
import { deleteMaterial, getMaterials, uploadMaterial } from "../../api/teacher.api";
import FileUpload from "../../components/FileUpload";
import useFetch from "../../hooks/useFetch";
import { showError, showSuccess } from "../../components/Toast";
import Loader from "../../components/Loader";

const UploadMaterial = () => {
  const [form, setForm] = useState({
    title: "",
    class: "",
    subject: "",
    chapter: "",
    fileType: "PDF",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const materialsState = useFetch(() => getMaterials({ page: 1, limit: 50 }), []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.class || !form.subject || !file) {
      showError("Title, class, subject and file are required");
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    payload.append("file", file);

    try {
      setSubmitting(true);
      setUploadProgress(30);
      await uploadMaterial(payload);
      setUploadProgress(100);
      showSuccess("Material uploaded successfully");
      setForm({ title: "", class: "", subject: "", chapter: "", fileType: "PDF", description: "" });
      setFile(null);
      await materialsState.execute({ page: 1, limit: 50 });
    } catch (error) {
      showError(error?.response?.data?.message || "Upload failed");
    } finally {
      setSubmitting(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMaterial(id);
      showSuccess("Material deleted");
      await materialsState.execute({ page: 1, limit: 50 });
    } catch (error) {
      showError(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Upload Study Material</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow-card">
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border" name="title" value={form.title} onChange={handleChange} placeholder="Title" />
          <input className="rounded border" name="class" value={form.class} onChange={handleChange} placeholder="Class" />
          <input className="rounded border" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" />
          <input className="rounded border" name="chapter" value={form.chapter} onChange={handleChange} placeholder="Chapter" />
          <select className="rounded border" name="fileType" value={form.fileType} onChange={handleChange}>
            {["PDF", "PPT", "Video", "Notes"].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <textarea
          className="w-full rounded border"
          rows={3}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <FileUpload file={file} onChange={setFile} accept=".pdf,.ppt,.pptx,video/*" />
        {uploadProgress > 0 && (
          <div className="h-2 rounded bg-slate-200">
            <div className="h-2 rounded bg-primary" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
        <button disabled={submitting} className="rounded-lg bg-accent px-5 py-2 font-semibold text-slate-900">
          {submitting ? "Uploading..." : "Upload"}
        </button>
      </form>

      <div className="rounded-xl bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-primary">My Materials</h2>
        {materialsState.loading ? (
          <Loader />
        ) : (
          <div className="mt-3 space-y-2">
            {(materialsState.data || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded border p-3 text-sm">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-slate-500">
                    {item.subject} | Class {item.class}
                  </p>
                </div>
                <button onClick={() => handleDelete(item._id)} className="rounded border px-3 py-1 text-rose-600">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMaterial;
