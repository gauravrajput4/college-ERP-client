import { Suspense, lazy, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import debounce from "lodash-es/debounce";
import { useQueryClient } from "@tanstack/react-query";
import { showError } from "../../components/Toast";
import OptimizedImage from "../../components/common/OptimizedImage";
import ErrorState from "../../components/common/ErrorState";
import { EmptySearchResults, EmptyStudentsList } from "../../components/empty";
import { SkeletonWrapper, StudentsTableSkeleton } from "../../components/skeleton";
import { Search } from "lucide-react";
import { getAvatarUrl } from "../../utils/cloudinaryUrl";
import { getStudents } from "../../api/students";
import {
  useCreateStudent,
  useDeleteStudent,
  useStudents,
  useUpdateStudent,
} from "../../hooks/queries/useStudents";
import useRenderCount from "../../hooks/useRenderCount";
import useDeferredSkeleton from "../../hooks/useDeferredSkeleton";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StudentsFormModal = lazy(() =>
  import(/* webpackChunkName: "admin-students-form-modal" */ "./StudentsFormModal"),
);

const CARD_CLASSES =
  "rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-primary/20";

const defaultForm = {
  user: { name: "", email: "", password: "", phone: "" },
  student: { rollNo: "", class: "", section: "", fatherName: "", motherName: "", session: "2026-27" },
};

const StudentCard = memo(
  ({ student }) => {
    const attendancePercentage = useMemo(() => {
      const value = Number(student.attendancePercentage || 0);
      return Number.isFinite(value) ? value : 0;
    }, [student.attendancePercentage]);

    const avatarSrc = useMemo(() => {
      const photo = student.userId?.photo || "";
      if (!photo) return "";
      if (photo.startsWith("http")) return photo;
      try {
        return getAvatarUrl(photo, 64);
      } catch {
        return "";
      }
    }, [student.userId?.photo]);

    return (
      <div className={CARD_CLASSES}>
        <div className="flex items-center gap-3">
          <OptimizedImage
            src={avatarSrc}
            alt={student.userId?.name || "Student"}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-primary">{student.userId?.name}</p>
            <p className="truncate text-xs text-slate-500">{student.userId?.email}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">Attendance: {attendancePercentage}%</p>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.student._id === nextProps.student._id &&
    prevProps.student.userId?.name === nextProps.student.userId?.name &&
    Number(prevProps.student.attendancePercentage || 0) ===
      Number(nextProps.student.attendancePercentage || 0),
);

StudentCard.displayName = "StudentCard";

const StudentsList = () => {
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    search: "",
    className: "",
    section: "",
    department: "",
    page: 1,
    limit: 10,
  });
  const [searchDraft, setSearchDraft] = useState("");
  const [sortField, setSortField] = useState("name");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const queryClient = useQueryClient();

  useRenderCount("StudentsList", { filters, sortField, modalOpen });

  const studentsQuery = useStudents(filters);
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();
  const showSkeleton = useDeferredSkeleton(studentsQuery.isLoading, 300);

  const rows = studentsQuery.data?.items || [];
  const total = studentsQuery.data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.limit));

  const CLASS_OPTIONS = useMemo(() => Array.from({ length: 12 }, (_, i) => String(i + 1)), []);
  const SECTION_OPTIONS = useMemo(() => ["A", "B", "C", "D"], []);

  const filteredSortedStudents = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    const source = rows.filter((row) => {
      if (!normalizedSearch) return true;
      return (
        String(row.rollNo || "").toLowerCase().includes(normalizedSearch) ||
        String(row.userId?.name || "").toLowerCase().includes(normalizedSearch)
      );
    });

    return source.sort((a, b) => {
      if (sortField === "recent") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortField === "roll") return String(a.rollNo).localeCompare(String(b.rollNo));
      return String(a.userId?.name || "").localeCompare(String(b.userId?.name || ""));
    });
  }, [rows, filters.search, sortField]);

  useEffect(() => {
    if (filters.page >= totalPages) return;
    const nextFilters = { ...filters, page: filters.page + 1 };
    queryClient.prefetchQuery({
      queryKey: ["students", nextFilters],
      queryFn: () => getStudents(nextFilters),
    });
  }, [filters, queryClient, totalPages]);

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

  const handleSort = useCallback((value) => {
    setSortField(value);
  }, []);

  const handlePageChange = useCallback((nextPage) => {
    setFilters((prev) => ({ ...prev, page: Math.max(1, Math.min(nextPage, totalPages)) }));
  }, [totalPages]);

  const handleOpenCreate = useCallback(() => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((row) => {
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
  }, []);

  const handleDeleteStudent = useCallback(
    async (id) => {
      if (!window.confirm("Delete this student?")) return;
      await deleteStudentMutation.mutateAsync(id);
    },
    [deleteStudentMutation],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!form.user.name || !form.user.email || !form.student.rollNo) {
        showError("Name, email and roll no are required");
        return;
      }
      if (!editing && !form.user.password) {
        showError("Password is required");
        return;
      }

      if (editing) {
        await updateStudentMutation.mutateAsync({
          id: editing._id,
          data: {
            user: { name: form.user.name, email: form.user.email, phone: form.user.phone },
            student: form.student,
          },
        });
      } else {
        await createStudentMutation.mutateAsync(form);
      }
      setModalOpen(false);
    },
    [createStudentMutation, editing, form, updateStudentMutation],
  );

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Manage Students</h1>

      <div className="rounded-2xl bg-white p-4 shadow-card">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.6fr,1fr,1fr,1fr,auto,auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Search by name or roll number"
              value={searchDraft}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </div>

          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={filters.className}
            onChange={(event) => handleFilter("className", event.target.value)}
          >
            <option value="">Select Class</option>
            {CLASS_OPTIONS.map((value) => (
              <option key={value} value={value}>
                Class {value}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={filters.section}
            onChange={(event) => handleFilter("section", event.target.value)}
          >
            <option value="">Select Section</option>
            {SECTION_OPTIONS.map((value) => (
              <option key={value} value={value}>
                Section {value}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={sortField}
            onChange={(event) => handleSort(event.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="roll">Sort by Roll</option>
            <option value="recent">Recently Added</option>
          </select>

          <button
            onClick={handleOpenCreate}
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:opacity-90 sm:w-auto"
          >
            Add Student
          </button>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["students"] })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:bg-slate-100 sm:w-auto"
          >
            Refresh
          </button>
        </div>
      </div>

      {showSkeleton ? (
        <SkeletonWrapper loading>
          <StudentsTableSkeleton />
        </SkeletonWrapper>
      ) : studentsQuery.isError ? (
        <ErrorState error={studentsQuery.error} onRetry={studentsQuery.refetch} onGoHome={() => navigate("/admin")} />
      ) : !filteredSortedStudents.length ? (
        filters.search ? (
          <EmptySearchResults
            query={filters.search}
            onClear={() => {
              setSearchDraft("");
              setFilters((prev) => ({ ...prev, search: "" }));
            }}
          />
        ) : (
          <EmptyStudentsList
            userRole={role}
            onAddStudent={handleOpenCreate}
            onImport={() => navigate("/admin/students/import")}
          />
        )
      ) : (
        <div className="space-y-3">
          {filteredSortedStudents.map((row) => (
            <div key={row._id} className="grid gap-3 rounded-xl bg-white p-3 shadow-card md:grid-cols-[300px,1fr,auto]">
              <StudentCard student={row} />
              <div className="grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
                <p><span className="font-semibold">Roll No:</span> {row.rollNo || "-"}</p>
                <p><span className="font-semibold">Class:</span> {row.class || "-"}</p>
                <p><span className="font-semibold">Section:</span> {row.section || "-"}</p>
                <p><span className="font-semibold">Phone:</span> {row.userId?.phone || "-"}</p>
                <p className="sm:col-span-2"><span className="font-semibold">Father:</span> {row.fatherName || "-"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(row)} className="rounded border px-3 py-2 text-sm">
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStudent(row._id)}
                  className="rounded border px-3 py-2 text-sm text-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm shadow-card">
        <button
          type="button"
          onClick={() => handlePageChange(filters.page - 1)}
          disabled={filters.page === 1}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {filters.page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => handlePageChange(filters.page + 1)}
          disabled={filters.page === totalPages}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Suspense fallback={null}>
        <StudentsFormModal
          modalOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          editing={editing}
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          isSubmitting={createStudentMutation.isPending || updateStudentMutation.isPending}
        />
      </Suspense>
    </div>
  );
};

export default StudentsList;
