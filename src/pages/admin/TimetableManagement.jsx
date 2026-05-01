import { useEffect, useMemo, useState } from "react";
import {
  createTimetable,
  deleteClassCatalog,
  deleteTimetable,
  getAvailableTeachers,
  getClassCatalog,
  getTimetables,
  upsertClassCatalog,
  updateTimetable,
} from "../../api/admin.api";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import TimetableForm from "../../components/TimetableForm";
import Loader from "../../components/Loader";
import useFetch from "../../hooks/useFetch";
import { addMinutesToTime, formatTimeLabel } from "../../utils/timetable";
import { showError, showSuccess } from "../../components/Toast";
import { ChevronDown, Plus, Search, Trash2 } from "lucide-react";
import { listSubjects as fetchSubjects } from "../../api/subjects.api";

const emptyForm = {
  className: "",
  subject: "",
  section: "",
  teacherId: "",
  day: "",
  startTime: "",
  endTime: "",
};

const TimetableManagement = () => {
  const [filters, setFilters] = useState({ className: "", day: "", section: "", teacherSearch: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [classForm, setClassForm] = useState({ className: "", subjects: [], subjectQuery: "" });
  const [editingClassId, setEditingClassId] = useState(null);

  const timetableState = useFetch(() => getTimetables({ className: filters.className, day: filters.day }), [filters.className, filters.day]);
  const classCatalogState = useFetch(() => getClassCatalog(), []);
  const subjectsState = useFetch(() => fetchSubjects({}), []);
  const availabilityState = useFetch(() => getAvailableTeachers(form), [form.className, form.subject, form.day, form.startTime], {
    immediate: false,
    initialData: [],
  });

  const classOptions = useMemo(
    () => (classCatalogState.data || []).map((item) => item.className).sort(),
    [classCatalogState.data],
  );

  const subjectCatalog = useMemo(() => subjectsState.data || [], [subjectsState.data]);

  const subjectOptions = useMemo(() => {
    if (!form.className) return [];
    return (classCatalogState.data || []).find((item) => item.className === form.className)?.subjects || [];
  }, [form.className, classCatalogState.data]);

  const sectionOptions = useMemo(() => ["", "A", "B", "C", "D"], []);

  useEffect(() => {
    if (!form.day || !form.startTime) {
      availabilityState.setData([]);
      return;
    }

    const endTime = addMinutesToTime(form.startTime, 45);
    availabilityState.execute({
      day: form.day,
      startTime: form.startTime,
      endTime,
      ...(editing?._id ? { excludeTimetableId: editing._id } : {}),
    }).catch(() => {});
  }, [form.className, form.subject, form.day, form.startTime, editing?._id]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      className: row.className || "",
        subject: row.subject || "",
        section: row.section || "",
        teacherId: row.teacherId?._id || row.teacherId || "",
        day: row.day || "",
        startTime: row.startTime || "",
        endTime: row.endTime || "",
      });
      setModalOpen(true);
    };

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "className") {
        next.subject = "";
        next.teacherId = "";
      }
      if (field === "subject" || field === "day" || field === "startTime") {
        next.teacherId = "";
      }
      if (field === "startTime") {
        next.endTime = addMinutesToTime(value, 45);
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.className || !form.subject || !form.teacherId || !form.day || !form.startTime) {
      showError("Complete all timetable fields");
      return;
    }

    try {
      if (editing) {
        await updateTimetable(editing._id, form);
        showSuccess("Timetable updated");
      } else {
        await createTimetable(form);
        showSuccess("Timetable created");
      }
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await timetableState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to save timetable");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this timetable entry?")) return;
    try {
      await deleteTimetable(id);
      showSuccess("Timetable deleted");
      await timetableState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to delete timetable");
    }
  };

  const handleClassCatalogSubmit = async (event) => {
    event.preventDefault();

    const subjects = (classForm.subjects || []).map((item) => String(item).trim()).filter(Boolean);

    if (!classForm.className.trim()) {
      showError("Class name is required");
      return;
    }
    if (!subjects.length) {
      showError("Select at least one subject");
      return;
    }

    try {
      await upsertClassCatalog({ className: classForm.className.trim(), subjects });
      showSuccess(editingClassId ? "Class updated successfully" : "Class created successfully");
      setClassForm({ className: "", subjects: [], subjectQuery: "" });
      setEditingClassId(null);
      await classCatalogState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to save class subjects");
    }
  };

  const startEditClass = (item) => {
    setEditingClassId(item._id);
    setClassForm({
      className: item.className || "",
      subjects: Array.isArray(item.subjects) ? item.subjects : [],
      subjectQuery: "",
    });
  };

  const handleDeleteClassCatalog = async (id) => {
    if (!window.confirm("Delete this class and its subject list?")) return;
    try {
      await deleteClassCatalog(id);
      showSuccess("Class deleted");
      await classCatalogState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to delete class");
    }
  };

  const filteredTimetableRows = useMemo(() => {
    const rows = timetableState.data || [];
    return rows
      .filter((row) => (filters.section ? String(row.section || "") === filters.section : true))
      .filter((row) => {
        const q = String(filters.teacherSearch || "").trim().toLowerCase();
        if (!q) return true;
        const name = row.teacherName || row.teacherId?.userId?.name || "";
        return String(name).toLowerCase().includes(q);
      });
  }, [timetableState.data, filters.section, filters.teacherSearch]);

  const subjectSuggestions = useMemo(() => {
    const query = String(classForm.subjectQuery || "").trim().toLowerCase();
    const selected = new Set((classForm.subjects || []).map((s) => String(s).toLowerCase()));
    const base = subjectCatalog.filter((s) => !selected.has(String(s.name || "").toLowerCase()));
    const filtered = query
      ? base.filter((s) => String(s.name || "").toLowerCase().includes(query) || String(s.code || "").toLowerCase().includes(query))
      : base;
    return filtered.slice(0, 25);
  }, [subjectCatalog, classForm.subjectQuery, classForm.subjects]);

  const addSubject = (value) => {
    const subject = String(value || "").trim();
    if (!subject) return;
    setClassForm((prev) => {
      const next = new Set((prev.subjects || []).map((s) => String(s)));
      next.add(subject);
      return { ...prev, subjects: Array.from(next), subjectQuery: "" };
    });
  };

  const removeSubject = (value) => {
    const subject = String(value || "").trim();
    setClassForm((prev) => ({ ...prev, subjects: (prev.subjects || []).filter((s) => String(s) !== subject) }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-600">Academic Operations</p>
          <h1 className="mt-1 font-heading text-3xl text-primary">Class Scheduling & Timetable</h1>
          <p className="mt-1 text-sm text-slate-600">Create 45-minute lectures with smart teacher availability checks.</p>
        </div>
        <button onClick={openCreate} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
          Create Timetable
        </button>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Class Master</p>
            <h2 className="mt-1 text-xl font-semibold text-primary">{editingClassId ? "Edit Class" : "Create Class"}</h2>
            <p className="mt-1 text-sm text-slate-600">Pick subjects from a reusable catalog (no comma-separated typing).</p>
          </div>

          <form onSubmit={handleClassCatalogSubmit} className="grid gap-3">
            <input
              value={classForm.className}
              onChange={(event) => setClassForm((prev) => ({ ...prev, className: event.target.value }))}
              placeholder="Class name e.g. MCA"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap gap-2">
                {(classForm.subjects || []).map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    title="Remove"
                  >
                    {subject}
                    <span className="text-slate-500">✕</span>
                  </button>
                ))}
                {!classForm.subjects?.length ? (
                  <span className="text-sm text-slate-500">No subjects selected.</span>
                ) : null}
              </div>

              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={classForm.subjectQuery}
                  onChange={(event) => setClassForm((prev) => ({ ...prev, subjectQuery: event.target.value }))}
                  placeholder="Search and select subjects"
                  className="w-full rounded-lg border border-slate-200 bg-white px-9 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="mt-2 max-h-44 overflow-auto rounded-lg border border-slate-100">
                {subjectSuggestions.length ? (
                  <div className="divide-y">
                    {subjectSuggestions.map((subject) => (
                      <button
                        key={subject._id}
                        type="button"
                        onClick={() => addSubject(subject.name)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
                      >
                        <span className="text-slate-800">
                          {subject.name} <span className="text-xs text-slate-500">({subject.code})</span>
                        </span>
                        <span className="text-xs font-semibold text-primary">Add</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-3 text-sm text-slate-500">
                    {subjectCatalog.length ? "No matches." : "No subjects found. Create subjects in Subject Master first."}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!classForm.className.trim() || !(classForm.subjects || []).length}
              className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 md:w-fit"
            >
              <span className="inline-flex items-center gap-2">
                <Plus size={16} />
                {editingClassId ? "Update Class" : "Create Class"}
              </span>
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Saved Classes</h2>
            {classCatalogState.loading ? <div className="h-5 w-24 rounded-md bg-slate-200/70 skeleton-shimmer" aria-hidden="true" /> : null}
          </div>
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Class</th>
                    <th className="px-4 py-3 font-semibold">Subjects</th>
                    <th className="px-4 py-3 font-semibold">Total Subjects</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(classCatalogState.data || []).map((item) => (
                    <tr key={item._id} className="border-t hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-semibold text-slate-900">{item.className}</td>
                      <td className="px-4 py-3 text-slate-700">{(item.subjects || []).join(", ")}</td>
                      <td className="px-4 py-3 text-slate-700">{(item.subjects || []).length}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEditClass(item)} className="rounded-lg border px-3 py-1 text-xs font-semibold">
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClassCatalog(item._id)}
                            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-semibold text-rose-600"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!classCatalogState.loading && !(classCatalogState.data || []).length && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                        No classes created yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {(classCatalogState.data || []).map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-primary">{item.className}</p>
                    <p className="mt-2 text-sm text-slate-600">{(item.subjects || []).join(", ")}</p>
                    <p className="mt-2 text-xs text-slate-500">Total subjects: {(item.subjects || []).length}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => startEditClass(item)} className="flex-1 rounded-xl border px-3 py-2 text-sm font-semibold">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteClassCatalog(item._id)} className="flex-1 rounded-xl border px-3 py-2 text-sm font-semibold text-rose-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!classCatalogState.loading && !(classCatalogState.data || []).length && (
              <p className="text-sm text-slate-500">No classes created yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Timetable Filters</p>
          <h2 className="mt-1 text-xl font-semibold text-primary">Filter timetable entries</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <select
            value={filters.className}
            onChange={(event) => setFilters((prev) => ({ ...prev, className: event.target.value }))}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          >
            <option value="">All Classes</option>
            {classOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={filters.section}
            onChange={(event) => setFilters((prev) => ({ ...prev, section: event.target.value }))}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          >
            <option value="">All Sections</option>
            {sectionOptions.filter(Boolean).map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
          <select
            value={filters.day}
            onChange={(event) => setFilters((prev) => ({ ...prev, day: event.target.value }))}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          >
            <option value="">All Days</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            value={filters.teacherSearch}
            onChange={(event) => setFilters((prev) => ({ ...prev, teacherSearch: event.target.value }))}
            placeholder="Filter teacher (optional)"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          />
        </div>
      </section>

      {timetableState.loading || classCatalogState.loading ? (
        <Loader text="Loading timetable data..." />
      ) : (
        <Table
          data={filteredTimetableRows}
          columns={[
            { key: "className", title: "Class" },
            { key: "section", title: "Section", render: (row) => row.section || "-" },
            { key: "subject", title: "Subject" },
            { key: "teacherName", title: "Teacher", render: (row) => row.teacherName || row.teacherId?.userId?.name || "-" },
            { key: "day", title: "Day" },
            { key: "startTime", title: "Time", render: (row) => `${formatTimeLabel(row.startTime)} - ${formatTimeLabel(row.endTime)}` },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openEdit(row)} className="rounded-lg border px-3 py-1 text-xs font-semibold">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(row._id)} className="rounded-lg border px-3 py-1 text-xs font-semibold text-rose-600">
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
          setForm(emptyForm);
        }}
        title={editing ? "Edit Timetable Entry" : "Create Timetable Entry"}
      >
        <TimetableForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
            setForm(emptyForm);
          }}
          classOptions={classOptions}
          subjectOptions={subjectOptions}
          availableTeachers={availabilityState.data || []}
          teacherLoading={availabilityState.loading}
          submitLabel={editing ? "Update Timetable" : "Save Timetable"}
        />
      </Modal>
    </div>
  );
};

export default TimetableManagement;
