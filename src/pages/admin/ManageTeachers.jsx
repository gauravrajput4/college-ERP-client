import { useState } from "react";
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from "../../api/admin.api";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import { showError, showSuccess } from "../../components/Toast";

const defaultForm = {
  user: { name: "", email: "", password: "", phone: "" },
  teacher: { employeeId: "", qualification: "", designation: "", joiningDate: "", subjects: [] },
};

const ManageTeachers = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [subjectInput, setSubjectInput] = useState({ subject: "", class: "", section: "" });
  const teachersState = useFetch(() => getTeachers({}), []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setSubjectInput({ subject: "", class: "", section: "" });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      user: { name: row.userId?.name || "", email: row.userId?.email || "", password: "", phone: row.userId?.phone || "" },
      teacher: {
        employeeId: row.employeeId || "",
        qualification: row.qualification || "",
        designation: row.designation || "",
        joiningDate: row.joiningDate ? row.joiningDate.slice(0, 10) : "",
        subjects: row.subjects || [],
      },
    });
    setModalOpen(true);
  };

  const addSubject = () => {
    if (!subjectInput.subject || !subjectInput.class || !subjectInput.section) {
      showError("Complete subject assignment fields");
      return;
    }
    setForm((prev) => ({ ...prev, teacher: { ...prev.teacher, subjects: [...prev.teacher.subjects, subjectInput] } }));
    setSubjectInput({ subject: "", class: "", section: "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.user.name || !form.user.email || !form.teacher.employeeId) {
      showError("Name, email and employee ID are required");
      return;
    }
    try {
      if (editing) {
        await updateTeacher(editing._id, { user: { name: form.user.name, email: form.user.email, phone: form.user.phone }, teacher: form.teacher });
        showSuccess("Teacher updated");
      } else {
        if (!form.user.password) {
          showError("Password is required");
          return;
        }
        await createTeacher(form);
        showSuccess("Teacher created");
      }
      setModalOpen(false);
      await teachersState.execute({});
    } catch (error) {
      showError(error?.response?.data?.message || "Operation failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await deleteTeacher(id);
      showSuccess("Teacher deleted");
      await teachersState.execute({});
    } catch (error) {
      showError(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">Manage Teachers</h1>
        <button onClick={openCreate} className="rounded bg-primary px-4 py-2 text-white">
          Add Teacher
        </button>
      </div>

      {teachersState.loading ? (
        <Loader />
      ) : (
        <Table
          data={teachersState.data || []}
          columns={[
            { key: "photo", title: "Photo", render: (row) => (row.userId?.photo ? <img src={row.userId.photo} alt="" className="h-8 w-8 rounded-full" /> : "-") },
            { key: "employeeId", title: "EmpID" },
            { key: "name", title: "Name", render: (row) => row.userId?.name },
            { key: "designation", title: "Designation" },
            { key: "subjects", title: "Subjects", render: (row) => (row.subjects || []).map((s) => s.subject).join(", ") || "-" },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openEdit(row)} className="rounded border px-2 py-1 text-xs">
                    Edit
                  </button>
                  <button onClick={() => remove(row._id)} className="rounded border px-2 py-1 text-xs text-rose-600">
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Teacher" : "Add Teacher"}>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded border" placeholder="Name" value={form.user.name} onChange={(e) => setForm((prev) => ({ ...prev, user: { ...prev.user, name: e.target.value } }))} />
            <input className="rounded border" placeholder="Email" value={form.user.email} onChange={(e) => setForm((prev) => ({ ...prev, user: { ...prev.user, email: e.target.value } }))} />
            {!editing && (
              <input
                className="rounded border"
                type="password"
                placeholder="Password"
                value={form.user.password}
                onChange={(e) => setForm((prev) => ({ ...prev, user: { ...prev.user, password: e.target.value } }))}
              />
            )}
            <input className="rounded border" placeholder="Phone" value={form.user.phone} onChange={(e) => setForm((prev) => ({ ...prev, user: { ...prev.user, phone: e.target.value } }))} />
            <input className="rounded border" placeholder="Employee ID" value={form.teacher.employeeId} onChange={(e) => setForm((prev) => ({ ...prev, teacher: { ...prev.teacher, employeeId: e.target.value } }))} />
            <input className="rounded border" placeholder="Designation" value={form.teacher.designation} onChange={(e) => setForm((prev) => ({ ...prev, teacher: { ...prev.teacher, designation: e.target.value } }))} />
            <input className="rounded border" placeholder="Qualification" value={form.teacher.qualification} onChange={(e) => setForm((prev) => ({ ...prev, teacher: { ...prev.teacher, qualification: e.target.value } }))} />
            <input className="rounded border" type="date" value={form.teacher.joiningDate} onChange={(e) => setForm((prev) => ({ ...prev, teacher: { ...prev.teacher, joiningDate: e.target.value } }))} />
          </div>

          <div className="rounded border p-3">
            <p className="mb-2 text-sm font-semibold">Subject Assignment</p>
            <div className="grid gap-2 md:grid-cols-4">
              <input className="rounded border" placeholder="Subject" value={subjectInput.subject} onChange={(e) => setSubjectInput((prev) => ({ ...prev, subject: e.target.value }))} />
              <input className="rounded border" placeholder="Class" value={subjectInput.class} onChange={(e) => setSubjectInput((prev) => ({ ...prev, class: e.target.value }))} />
              <input className="rounded border" placeholder="Section" value={subjectInput.section} onChange={(e) => setSubjectInput((prev) => ({ ...prev, section: e.target.value }))} />
              <button type="button" onClick={addSubject} className="rounded border px-3 py-2">
                Add
              </button>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              {form.teacher.subjects.map((subj, idx) => (
                <div key={`${subj.subject}-${idx}`} className="rounded bg-slate-100 p-2">
                  {subj.subject} - Class {subj.class} ({subj.section})
                </div>
              ))}
            </div>
          </div>

          <button className="rounded bg-primary px-4 py-2 text-white">{editing ? "Update" : "Create"}</button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageTeachers;
