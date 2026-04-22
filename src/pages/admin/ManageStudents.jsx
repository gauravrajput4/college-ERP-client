import { useMemo, useState } from "react";
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "../../api/admin.api";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import { showError, showSuccess } from "../../components/Toast";

const defaultForm = {
  user: { name: "", email: "", password: "", phone: "" },
  student: { rollNo: "", class: "", section: "", fatherName: "", motherName: "", session: "2026-27" },
};

const ManageStudents = () => {
  const [filters, setFilters] = useState({ search: "", class: "", section: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const studentsState = useFetch(() => getStudents(filters), [filters.search, filters.class, filters.section]);

  const rows = useMemo(() => studentsState.data || [], [studentsState.data]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      user: {
        name: row.userId?.name || "",
        email: row.userId?.email || "",
        password: "",
        phone: row.userId?.phone || "",
      },
      student: {
        rollNo: row.rollNo || "",
        class: row.class || "",
        section: row.section || "",
        fatherName: row.fatherName || "",
        motherName: row.motherName || "",
        session: row.session || "2026-27",
      },
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.user.name || !form.user.email || !form.student.rollNo) {
      showError("Name, email and roll no are required");
      return;
    }
    try {
      if (editing) {
        const payload = {
          user: { name: form.user.name, email: form.user.email, phone: form.user.phone },
          student: form.student,
        };
        await updateStudent(editing._id, payload);
        showSuccess("Student updated");
      } else {
        if (!form.user.password) {
          showError("Password is required");
          return;
        }
        await createStudent(form);
        showSuccess("Student created");
      }
      setModalOpen(false);
      await studentsState.execute(filters);
    } catch (error) {
      showError(error?.response?.data?.message || "Operation failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      showSuccess("Student deleted");
      await studentsState.execute(filters);
    } catch (error) {
      showError(error?.response?.data?.message || "Delete failed");
    }
  };

  const exportCsv = () => {
    const header = "RollNo,Name,Class,Section,Father,Phone\n";
    const body = rows
      .map((row) => `${row.rollNo},${row.userId?.name || ""},${row.class},${row.section},${row.fatherName || ""},${row.userId?.phone || ""}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Manage Students</h1>
      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-card md:grid-cols-5">
        <input
          className="rounded border"
          placeholder="Search name/roll"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
        <input
          className="rounded border"
          placeholder="Class"
          value={filters.class}
          onChange={(e) => setFilters((prev) => ({ ...prev, class: e.target.value }))}
        />
        <input
          className="rounded border"
          placeholder="Section"
          value={filters.section}
          onChange={(e) => setFilters((prev) => ({ ...prev, section: e.target.value }))}
        />
        <button onClick={openCreate} className="rounded bg-primary px-4 py-2 text-white">
          Add Student
        </button>
        <button onClick={exportCsv} className="rounded border px-4 py-2">
          Export CSV
        </button>
      </div>

      {studentsState.loading ? (
        <Loader />
      ) : (
        <Table
          data={rows}
          columns={[
            { key: "photo", title: "Photo", render: (row) => (row.userId?.photo ? <img src={row.userId.photo} alt="" className="h-8 w-8 rounded-full" /> : "-") },
            { key: "rollNo", title: "Roll No" },
            { key: "name", title: "Name", render: (row) => row.userId?.name },
            { key: "class", title: "Class" },
            { key: "section", title: "Section" },
            { key: "fatherName", title: "Father" },
            { key: "phone", title: "Phone", render: (row) => row.userId?.phone },
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
          pageSize={10}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Student" : "Add Student"}
      >
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
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
          <input className="rounded border" placeholder="Roll No" value={form.student.rollNo} onChange={(e) => setForm((prev) => ({ ...prev, student: { ...prev.student, rollNo: e.target.value } }))} />
          <input className="rounded border" placeholder="Class" value={form.student.class} onChange={(e) => setForm((prev) => ({ ...prev, student: { ...prev.student, class: e.target.value } }))} />
          <input className="rounded border" placeholder="Section" value={form.student.section} onChange={(e) => setForm((prev) => ({ ...prev, student: { ...prev.student, section: e.target.value } }))} />
          <input className="rounded border" placeholder="Father Name" value={form.student.fatherName} onChange={(e) => setForm((prev) => ({ ...prev, student: { ...prev.student, fatherName: e.target.value } }))} />
          <button className="col-span-full rounded bg-primary px-4 py-2 text-white">{editing ? "Update" : "Create"}</button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageStudents;
