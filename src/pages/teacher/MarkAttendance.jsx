import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getStudents, markAttendance } from "../../api/teacher.api";
import { showError, showSuccess } from "../../components/Toast";
import AttendanceRow from "../../components/attendance/AttendanceRow";

const normalizeDate = (value = "") => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MarkAttendance = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    class: searchParams.get("class") || "",
    section: searchParams.get("section") || "",
    subject: searchParams.get("subject") || "",
    date: normalizeDate(searchParams.get("date")) || normalizeDate(new Date()),
  });
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const canFetch = form.class && form.section;

  const handleChange = useCallback((event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }, []);

  const hydrateStatuses = useCallback((items) => {
    const defaults = {};
    items.forEach((item) => {
      defaults[item._id] = "Present";
    });
    setStatusMap(defaults);
  }, []);

  const fetchStudents = useCallback(async () => {
    if (!canFetch) {
      showError("Select class and section");
      return;
    }
    try {
      setFetching(true);
      const response = await getStudents(form.class, form.section);
      const items = response.data || [];
      setStudents(items);
      hydrateStatuses(items);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to fetch students");
    } finally {
      setFetching(false);
    }
  }, [canFetch, form.class, form.section, hydrateStatuses]);

  useEffect(() => {
    if (searchParams.get("class") && searchParams.get("section")) {
      fetchStudents();
    }
  }, [fetchStudents, searchParams]);

  const handleStatusChange = useCallback((studentId, status) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  }, []);

  const markAllPresent = useCallback(() => {
    setStatusMap((prev) => Object.fromEntries(Object.keys(prev).map((key) => [key, "Present"])));
  }, []);

  const entries = useMemo(
    () =>
      students.map((student) => ({
        studentId: student._id,
        status: statusMap[student._id] || "Present",
      })),
    [students, statusMap],
  );

  const submitAttendance = useCallback(async () => {
    if (!form.subject || !form.date || !students.length) {
      showError("Complete all fields and fetch students first");
      return;
    }
    try {
      setLoading(true);
      await markAttendance({ ...form, entries });
      showSuccess("Attendance marked successfully");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to submit attendance");
    } finally {
      setLoading(false);
    }
  }, [entries, form, students.length]);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Mark Attendance</h1>
      <div className="grid gap-3 rounded-xl bg-white p-5 shadow-card md:grid-cols-5">
        <input className="rounded border" name="class" placeholder="Class (e.g. MCA)" value={form.class} onChange={handleChange} />
        <input className="rounded border" name="section" placeholder="Section" value={form.section} onChange={handleChange} />
        <input className="rounded border" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />
        <input className="rounded border" type="date" name="date" value={form.date} onChange={handleChange} />
        <button onClick={fetchStudents} className="rounded bg-primary px-4 py-2 text-white">
          {fetching ? "Fetching..." : "Fetch Students"}
        </button>
      </div>

      {!!students.length && (
        <div className="rounded-xl bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">
              Student List · {form.class}
              {form.section ? `-${form.section}` : ""} · {form.subject || "Subject"} · {form.date}
            </h2>
            <button onClick={markAllPresent} className="rounded border px-3 py-1 text-sm">
              Mark All Present
            </button>
          </div>
          <div className="space-y-2">
            {students.map((student) => (
              <AttendanceRow
                key={student._id}
                student={student}
                status={statusMap[student._id] || "Present"}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          <button
            onClick={submitAttendance}
            disabled={loading}
            className="mt-4 rounded-lg bg-accent px-5 py-2 font-semibold text-slate-900"
          >
            {loading ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
