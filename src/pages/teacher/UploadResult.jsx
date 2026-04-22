import { useState } from "react";
import { getStudents, uploadResult } from "../../api/teacher.api";
import { showError, showSuccess } from "../../components/Toast";

const UploadResult = () => {
  const [meta, setMeta] = useState({ class: "", section: "", subject: "", examType: "Unit Test", session: "2026-27" });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleMetaChange = (e) => setMeta((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const fetchStudents = async () => {
    if (!meta.class || !meta.section) {
      showError("Class and section are required");
      return;
    }
    try {
      setLoading(true);
      const response = await getStudents(meta.class, meta.section);
      const prepared = (response.data || []).map((student) => ({
        studentId: student._id,
        rollNo: student.rollNo,
        name: student.userId?.name,
        maxMarks: "",
        marksObtained: "",
        remarks: "",
      }));
      setRows(prepared);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (index, key, value) => {
    setRows((prev) => prev.map((row, idx) => (idx === index ? { ...row, [key]: value } : row)));
  };

  const submitResults = async () => {
    if (!meta.class || !meta.subject || !rows.length) {
      showError("Complete details and load students first");
      return;
    }
    for (const row of rows) {
      if (!row.maxMarks || !row.marksObtained) {
        showError("Max marks and obtained marks are required for each row");
        return;
      }
      if (Number(row.marksObtained) > Number(row.maxMarks)) {
        showError(`Marks obtained cannot exceed max marks for ${row.name}`);
        return;
      }
    }

    try {
      setSubmitting(true);
      await uploadResult({
        ...meta,
        rows: rows.map((r) => ({
          studentId: r.studentId,
          maxMarks: Number(r.maxMarks),
          marksObtained: Number(r.marksObtained),
          remarks: r.remarks,
        })),
      });
      showSuccess("Results uploaded successfully");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to upload results");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Upload Result</h1>
      <div className="grid gap-3 rounded-xl bg-white p-5 shadow-card md:grid-cols-6">
        <input className="rounded border" name="class" value={meta.class} onChange={handleMetaChange} placeholder="Class" />
        <input className="rounded border" name="section" value={meta.section} onChange={handleMetaChange} placeholder="Section" />
        <input className="rounded border" name="subject" value={meta.subject} onChange={handleMetaChange} placeholder="Subject" />
        <select className="rounded border" name="examType" value={meta.examType} onChange={handleMetaChange}>
          {["Unit Test", "Mid-Term", "Final"].map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <input className="rounded border" name="session" value={meta.session} onChange={handleMetaChange} placeholder="Session" />
        <button onClick={fetchStudents} className="rounded bg-primary px-4 py-2 text-white">
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {!!rows.length && (
        <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-card">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Roll No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Max Marks</th>
                <th className="p-2">Obtained</th>
                <th className="p-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.studentId} className="border-b">
                  <td className="p-2">{row.rollNo}</td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">
                    <input
                      className="w-24 rounded border"
                      value={row.maxMarks}
                      onChange={(e) => updateRow(idx, "maxMarks", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-24 rounded border"
                      value={row.marksObtained}
                      onChange={(e) => updateRow(idx, "marksObtained", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full rounded border"
                      value={row.remarks}
                      onChange={(e) => updateRow(idx, "remarks", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={submitResults}
            disabled={submitting}
            className="mt-4 rounded-lg bg-accent px-5 py-2 font-semibold text-slate-900"
          >
            {submitting ? "Submitting..." : "Submit All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadResult;
