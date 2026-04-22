import { useEffect, useMemo, useState } from "react";
import {
  createTimetable,
  deleteClassCatalog,
  deleteTimetable,
  getAvailableTeachers,
  getClassCatalog,
  getTeachers,
  getTimetables,
  upsertClassCatalog,
  updateTimetable,
} from "../../api/admin.api";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import TimetableForm from "../../components/TimetableForm";
import Loader from "../../components/Loader";
import useFetch from "../../hooks/useFetch";
import { formatTimeLabel } from "../../utils/timetable";
import { showError, showSuccess } from "../../components/Toast";

const emptyForm = {
  className: "",
  subject: "",
  teacherId: "",
  day: "",
  startTime: "",
};

const TimetableManagement = () => {
  const [filters, setFilters] = useState({ className: "", day: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [classForm, setClassForm] = useState({ className: "", subjectInput: "" });

  const timetableState = useFetch(() => getTimetables(filters), [filters.className, filters.day]);
  const teachersState = useFetch(() => getTeachers({ page: 1, limit: 200 }), []);
  const classCatalogState = useFetch(() => getClassCatalog(), []);
  const availabilityState = useFetch(() => getAvailableTeachers(form), [form.className, form.subject, form.day, form.startTime], {
    immediate: false,
    initialData: { availableTeachers: [], unavailableTeachers: [], endTime: "" },
  });

  const classOptions = useMemo(
    () => (classCatalogState.data || []).map((item) => item.className).sort(),
    [classCatalogState.data],
  );

  const subjectOptions = useMemo(() => {
    if (!form.className) return [];
    return (classCatalogState.data || []).find((item) => item.className === form.className)?.subjects || [];
  }, [form.className, classCatalogState.data]);

  useEffect(() => {
    if (!form.className || !form.subject || !form.day || !form.startTime) {
      availabilityState.setData({ availableTeachers: [], unavailableTeachers: [], endTime: "" });
      return;
    }

    availabilityState.execute({
      className: form.className,
      subject: form.subject,
      day: form.day,
      startTime: form.startTime,
      ...(editing?._id ? { timetableId: editing._id } : {}),
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
      teacherId: row.teacherId?._id || row.teacherId || "",
      day: row.day || "",
      startTime: row.startTime || "",
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

    const subjects = classForm.subjectInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!classForm.className.trim()) {
      showError("Class name is required");
      return;
    }
    if (!subjects.length) {
      showError("Enter subjects separated by commas");
      return;
    }

    try {
      await upsertClassCatalog({ className: classForm.className.trim(), subjects });
      showSuccess("Class subjects saved");
      setClassForm({ className: "", subjectInput: "" });
      await classCatalogState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to save class subjects");
    }
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
            <h2 className="mt-1 text-xl font-semibold text-primary">Create classes with their subjects</h2>
            <p className="mt-1 text-sm text-slate-600">Example: `MCA` with `DBMS, OS, CN, Java, AI`.</p>
          </div>

          <form onSubmit={handleClassCatalogSubmit} className="grid gap-3">
            <input
              value={classForm.className}
              onChange={(event) => setClassForm((prev) => ({ ...prev, className: event.target.value }))}
              placeholder="Class name e.g. MCA"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />
            <textarea
              value={classForm.subjectInput}
              onChange={(event) => setClassForm((prev) => ({ ...prev, subjectInput: event.target.value }))}
              placeholder="Subjects separated by commas"
              rows={4}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />
            <button type="submit" className="w-fit rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
              Save Class Subjects
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Saved Classes</h2>
            {classCatalogState.loading ? <span className="text-sm text-slate-500">Loading...</span> : null}
          </div>
          <div className="space-y-3">
            {(classCatalogState.data || []).map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{item.className}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.subjects.join(", ")}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteClassCatalog(item._id)}
                    className="rounded-lg border px-3 py-1 text-xs font-semibold text-rose-600"
                  >
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

      <section className="grid gap-4 rounded-2xl bg-white p-4 shadow-card md:grid-cols-3">
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
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Lecture duration: <span className="font-semibold text-slate-900">45 minutes</span>
        </div>
      </section>

      {timetableState.loading || teachersState.loading || classCatalogState.loading ? (
        <Loader text="Loading timetable data..." />
      ) : (
        <Table
          data={timetableState.data || []}
          columns={[
            { key: "className", title: "Class" },
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
          availableTeachers={availabilityState.data?.availableTeachers || []}
          unavailableTeachers={availabilityState.data?.unavailableTeachers || []}
          teacherLoading={availabilityState.loading}
          submitLabel={editing ? "Update Timetable" : "Save Timetable"}
        />
      </Modal>
    </div>
  );
};

export default TimetableManagement;
