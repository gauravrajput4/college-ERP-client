import { useMemo, useState } from "react";
import { createAssignment } from "../api/assignment.api";
import { showError, showSuccess } from "./Toast";

const UploadAssignment = ({ subject, onCreated }) => {
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const minDateTime = useMemo(() => new Date().toISOString().slice(0, 16), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!subject?.subjectId) {
      showError("Select a subject first");
      return;
    }
    if (!form.title || !form.dueDate || !file) {
      showError("Title, due date and PDF file are required");
      return;
    }
    if (file.type !== "application/pdf") {
      showError("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError("File size must be 5MB or less");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("subjectId", subject.subjectId);
    payload.append("dueDate", form.dueDate);
    payload.append("file", file);

    try {
      setSaving(true);
      await createAssignment(payload);
      showSuccess("Assignment uploaded");
      setForm({ title: "", description: "", dueDate: "" });
      setFile(null);
      onCreated?.();
    } catch (error) {
      showError(error?.response?.data?.message || "Could not upload assignment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-primary">Upload Assignment</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <input
          className="rounded border px-3 py-2"
          placeholder="Assignment title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
        />
        <input
          type="datetime-local"
          min={minDateTime}
          className="rounded border px-3 py-2"
          value={form.dueDate}
          onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
        />
      </div>
      <textarea
        rows={3}
        className="mt-3 w-full rounded border px-3 py-2"
        placeholder="Description"
        value={form.description}
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="max-w-full rounded border px-2 py-2 text-sm"
        />
        <span className="text-xs text-slate-500">{file ? file.name : "PDF only · max 5MB"}</span>
      </div>
      <button type="submit" disabled={saving} className="mt-4 rounded bg-primary px-4 py-2 text-white disabled:opacity-50">
        {saving ? "Uploading..." : "Upload Assignment"}
      </button>
    </form>
  );
};

export default UploadAssignment;
