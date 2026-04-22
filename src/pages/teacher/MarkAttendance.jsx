import { useMemo, useState } from "react";
import { getStudents, markAttendance } from "../../api/teacher.api";
import { showError, showSuccess } from "../../components/Toast";

const MarkAttendance = () => {
  const [form, setForm] = useState({ class: "", section: "", subject: "", date: "" });
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);

  const canFetch = form.class && form.section;

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const fetchStudents = async () => {
    if (!canFetch) {
      showError("Select class and section");
      return;
    }
    try {
      const response = await getStudents(form.class, form.section);
      setStudents(response.data || []);
      const defaults = {};
      (response.data || []).forEach((item) => {
        defaults[item._id] = "Present";
      });
      setStatusMap(defaults);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to fetch students");
    }
  };

  const entries = useMemo(
    () =>
      students.map((s) => ({
        studentId: s._id,
        status: statusMap[s._id] || "Present",
      })),
    [students, statusMap],
  );

  const submitAttendance = async () => {
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
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Mark Attendance</h1>
      <div className="grid gap-3 rounded-xl bg-white p-5 shadow-card md:grid-cols-5">
        <input className="rounded border" name="class" placeholder="Class" value={form.class} onChange={handleChange} />
        <input className="rounded border" name="section" placeholder="Section" value={form.section} onChange={handleChange} />
        <input className="rounded border" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />
        <input className="rounded border" type="date" name="date" value={form.date} onChange={handleChange} />
        <button onClick={fetchStudents} className="rounded bg-primary px-4 py-2 text-white">
          Fetch Students
        </button>
      </div>

      {!!students.length && (
        <div className="rounded-xl bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Student List</h2>
            <button
              onClick={() =>
                setStatusMap((prev) =>
                  Object.fromEntries(Object.keys(prev).map((key) => [key, "Present"])),
                )
              }
              className="rounded border px-3 py-1 text-sm"
            >
              Mark All Present
            </button>
          </div>
          <div className="space-y-2">
            {students.map((student) => (
              <div key={student._id} className="flex flex-wrap items-center justify-between rounded border p-3">
                <span className="font-semibold text-slate-700">{student.userId?.name}</span>
                <div className="flex gap-2">
                  {["Present", "Absent", "Leave"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusMap((prev) => ({ ...prev, [student._id]: status }))}
                      className={`rounded px-3 py-1 text-sm ${
                        statusMap[student._id] === status ? "bg-primary text-white" : "bg-slate-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
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
