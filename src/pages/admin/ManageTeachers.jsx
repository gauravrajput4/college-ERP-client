import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from "../../api/admin.api";
import Modal from "../../components/Modal";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import { showError, showSuccess } from "../../components/Toast";
import { EmptyTeachersList } from "../../components/empty";
import { Eye, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import debounce from "lodash-es/debounce";

const defaultForm = {
  user: { name: "", email: "", password: "", phone: "" },
  teacher: { employeeId: "", qualification: "", designation: "", joiningDate: "" },
};

const ManageTeachers = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    designation: "",
  });
  const [searchDraft, setSearchDraft] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const teachersState = useFetch(() => getTeachers(filters), [
    filters.page,
    filters.limit,
    filters.search,
    filters.designation,
  ]);

  const teachers = useMemo(() => teachersState.data?.data || teachersState.data || [], [teachersState.data]);
  const pagination = teachersState.data?.pagination || { page: filters.page, limit: filters.limit, total: 0, totalPages: 1 };
  const total = Number(pagination.total || 0);

  const showingFrom = total ? (filters.page - 1) * filters.limit + 1 : 0;
  const showingTo = total ? Math.min(filters.page * filters.limit, total) : 0;

  const designationOptions = useMemo(() => {
    const values = new Set();
    teachers.forEach((row) => {
      const value = String(row.designation || "").trim();
      if (value) values.add(value);
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [teachers]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setFilters((prev) => ({ ...prev, page: 1, search: value }));
      }, 300),
    [],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearch = useCallback(
    (value) => {
      setSearchDraft(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleFilter = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, page: 1, [name]: value }));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
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
      },
    });
    setModalOpen(true);
  };

  const openView = (row) => {
    setViewing(row);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.user.name || !form.user.email || !form.teacher.employeeId) {
      showError("Name, email and employee ID are required");
      return;
    }
    try {
      if (editing) {
        await updateTeacher(editing._id, {
          user: { name: form.user.name, email: form.user.email, phone: form.user.phone },
          teacher: form.teacher,
        });
        showSuccess("Teacher updated");
      } else {
        if (!form.user.password) {
          showError("Password is required");
          return;
        }
        await createTeacher({
          name: form.user.name,
          email: form.user.email,
          password: form.user.password,
          phone: form.user.phone,
          employeeId: form.teacher.employeeId,
          designation: form.teacher.designation,
          qualification: form.teacher.qualification,
          joiningDate: form.teacher.joiningDate,
        });
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

  const handlePrev = () => {
    setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  };

  const handleNext = () => {
    const totalPages = Math.max(1, Number(pagination.totalPages || 1));
    setFilters((prev) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-3xl text-primary">Manage Teachers</h1>
        <button
          onClick={openCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:opacity-90 sm:w-auto"
        >
          <Plus size={16} />
          Add Teacher
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-card">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.6fr,1fr,auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Search by name or Emp ID"
              value={searchDraft}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </div>

          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={filters.designation}
            onChange={(event) => handleFilter("designation", event.target.value)}
          >
            <option value="">All Designations</option>
            {designationOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => teachersState.execute(filters)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:bg-slate-100 lg:w-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {teachersState.loading ? (
        <Loader />
      ) : !teachers.length ? (
        <EmptyTeachersList onAddTeacher={openCreate} />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Photo</th>
                    <th className="px-4 py-3 font-semibold">Emp ID</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Designation</th>
                    <th className="px-4 py-3 font-semibold">Qualification</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((row) => (
                    <tr key={row._id} className="border-t hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        {row.userId?.photo ? (
                          <img src={row.userId.photo} alt={row.userId?.name || "Teacher"} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                            {(row.userId?.name || "T").slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{row.employeeId || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{row.userId?.name || "-"}</div>
                        <div className="text-xs text-slate-500">{row.userId?.email || ""}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{row.designation || "-"}</td>
                      <td className="px-4 py-3 text-slate-700">{row.qualification || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openView(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            title="View"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            title="Edit"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(row._id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                            title="Delete"
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

            <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
              <div className="text-slate-600">
                Showing <span className="font-semibold text-slate-800">{showingFrom}</span>–<span className="font-semibold text-slate-800">{showingTo}</span> of{" "}
                <span className="font-semibold text-slate-800">{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handlePrev} disabled={filters.page === 1} className="rounded-lg border px-3 py-1 disabled:opacity-50">
                  ← Prev
                </button>
                <button type="button" onClick={handleNext} disabled={filters.page >= Number(pagination.totalPages || 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">
                  Next →
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {teachers.map((row) => (
              <div key={row._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
                <div className="flex items-center gap-3">
                  {row.userId?.photo ? (
                    <img src={row.userId.photo} alt={row.userId?.name || "Teacher"} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
                      {(row.userId?.name || "T").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-slate-900">{row.userId?.name || "-"}</div>
                    <div className="truncate text-xs text-slate-500">{row.employeeId || "-"}</div>
                    <div className="truncate text-xs text-slate-500">{row.designation || "-"}</div>
                    <div className="truncate text-xs text-slate-500">{row.qualification || "-"}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => openEdit(row)} className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(row._id)} className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm shadow-card">
              <button type="button" onClick={handlePrev} disabled={filters.page === 1} className="rounded-lg border px-3 py-1 disabled:opacity-50">
                ← Prev
              </button>
              <span className="text-slate-600">
                {showingFrom}–{showingTo} of {total}
              </span>
              <button type="button" onClick={handleNext} disabled={filters.page >= Number(pagination.totalPages || 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">
                Next →
              </button>
            </div>
          </div>
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Teacher" : "Add Teacher"}>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded border px-3 py-2" placeholder="Name" value={form.user.name} onChange={(e) => setForm((prev) => ({ ...prev, user: { ...prev.user, name: e.target.value } }))} />
            <input className="rounded border px-3 py-2" placeholder="Email" value={form.user.email} onChange={(e) => setForm((prev) => ({ ...prev, user: { ...prev.user, email: e.target.value } }))} />
            {!editing && (
              <input
                className="rounded border px-3 py-2"
                type="password"
                placeholder="Password"
                value={form.user.password}
                onChange={(e) => setForm((prev) => ({ ...prev, user: { ...prev.user, password: e.target.value } }))}
              />
            )}
            <input className="rounded border px-3 py-2" placeholder="Phone" value={form.user.phone} onChange={(e) => setForm((prev) => ({ ...prev, user: { ...prev.user, phone: e.target.value } }))} />
            <input className="rounded border px-3 py-2" placeholder="Employee ID" value={form.teacher.employeeId} onChange={(e) => setForm((prev) => ({ ...prev, teacher: { ...prev.teacher, employeeId: e.target.value } }))} />
            <input className="rounded border px-3 py-2" placeholder="Designation" value={form.teacher.designation} onChange={(e) => setForm((prev) => ({ ...prev, teacher: { ...prev.teacher, designation: e.target.value } }))} />
            <input className="rounded border px-3 py-2" placeholder="Qualification" value={form.teacher.qualification} onChange={(e) => setForm((prev) => ({ ...prev, teacher: { ...prev.teacher, qualification: e.target.value } }))} />
            <input className="rounded border px-3 py-2" type="date" value={form.teacher.joiningDate} onChange={(e) => setForm((prev) => ({ ...prev, teacher: { ...prev.teacher, joiningDate: e.target.value } }))} />
          </div>

          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">{editing ? "Update" : "Create"}</button>
        </form>
      </Modal>

      <Modal isOpen={Boolean(viewing)} onClose={() => setViewing(null)} title="Teacher Details">
        {viewing ? (
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              {viewing.userId?.photo ? (
                <img src={viewing.userId.photo} alt={viewing.userId?.name || "Teacher"} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
                  {(viewing.userId?.name || "T").slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-slate-900">{viewing.userId?.name || "-"}</div>
                <div className="truncate text-xs text-slate-500">{viewing.userId?.email || "-"}</div>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <p><span className="font-semibold">Emp ID:</span> {viewing.employeeId || "-"}</p>
              <p><span className="font-semibold">Phone:</span> {viewing.userId?.phone || "-"}</p>
              <p><span className="font-semibold">Designation:</span> {viewing.designation || "-"}</p>
              <p><span className="font-semibold">Qualification:</span> {viewing.qualification || "-"}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ManageTeachers;
