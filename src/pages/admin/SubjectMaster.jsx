import { useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { showError, showSuccess } from "../../components/Toast";
import { createSubject, deleteSubject, listSubjects, updateSubject } from "../../api/subjects.api";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import EmptyState from "../../components/empty/EmptyState";
import EmptyGenericIllustration from "../../components/empty/illustrations/EmptyGenericIllustration";

const emptyForm = { name: "", code: "", type: "Theory", credits: "" };

const SubjectMaster = () => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const subjectsState = useFetch(() => listSubjects({ search }), [search]);
  const subjects = useMemo(() => subjectsState.data || [], [subjectsState.data]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || "",
      code: row.code || "",
      type: row.type || "Theory",
      credits: row.credits === null || row.credits === undefined ? "" : String(row.credits),
    });
    setModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      type: form.type,
      credits: form.credits === "" ? null : Number(form.credits),
    };
    if (!payload.name || !payload.code || !payload.type) {
      showError("Subject name, code and type are required");
      return;
    }
    if (payload.credits !== null && (!Number.isFinite(payload.credits) || payload.credits < 0)) {
      showError("Credits must be a non-negative number");
      return;
    }

    try {
      if (editing?._id) {
        await updateSubject(editing._id, payload);
        showSuccess("Subject updated successfully");
      } else {
        await createSubject(payload);
        showSuccess("Subject created successfully");
      }
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await subjectsState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to save subject");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      await deleteSubject(id);
      showSuccess("Subject deleted successfully");
      await subjectsState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to delete subject");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-3xl text-primary">Subject Master</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:opacity-90 sm:w-auto"
        >
          <Plus size={16} />
          Create Subject
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-card">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject name or code"
            className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {subjectsState.loading ? (
        <Loader />
      ) : !subjects.length ? (
        <EmptyState
          illustration={<EmptyGenericIllustration />}
          title="No subjects found"
          description="Create your first subject to reuse across classes and timetables."
          action={{ label: "Create Subject", onClick: openCreate, icon: <Plus size={16} /> }}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((row) => (
                  <tr key={row._id} className="border-t hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.code}</td>
                    <td className="px-4 py-3 text-slate-800">{row.name}</td>
                    <td className="px-4 py-3 text-slate-700">{row.type}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(row._id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
          setForm(emptyForm);
        }}
        title={editing ? "Edit Subject" : "Create Subject"}
      >
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            placeholder="Subject Name (e.g., DBMS)"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            placeholder="Subject Code (e.g., CS101)"
            value={form.code}
            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
          />
          <select
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          >
            <option value="Theory">Theory</option>
            <option value="Practical">Practical</option>
          </select>
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            placeholder="Credits (optional)"
            inputMode="numeric"
            value={form.credits}
            onChange={(e) => setForm((p) => ({ ...p, credits: e.target.value }))}
          />
          <button
            type="submit"
            className="col-span-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            {editing ? "Update Subject" : "Create Subject"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectMaster;

