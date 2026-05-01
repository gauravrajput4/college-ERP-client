import { useMemo, useState } from "react";
import { getAssignmentSubmissions, submitAssignment, updateSubmissionFeedback } from "../api/assignment.api";
import { showError, showSuccess } from "./Toast";

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");

const AssignmentList = ({ role, assignments = [], onChanged }) => {
  const [fileByAssignmentId, setFileByAssignmentId] = useState({});
  const [loadingId, setLoadingId] = useState("");
  const [trackingById, setTrackingById] = useState({});
  const [gradingBySubmissionId, setGradingBySubmissionId] = useState({});

  const sorted = useMemo(
    () => [...assignments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [assignments],
  );

  const handleSubmitAssignment = async (assignment) => {
    const file = fileByAssignmentId[assignment._id];
    if (!file) {
      showError("Choose your PDF before submitting");
      return;
    }
    if (file.type !== "application/pdf" || file.size > 5 * 1024 * 1024) {
      showError("Submission must be a PDF up to 5MB");
      return;
    }

    const payload = new FormData();
    payload.append("assignmentId", assignment._id);
    payload.append("file", file);

    try {
      setLoadingId(assignment._id);
      await submitAssignment(payload);
      showSuccess("Assignment submitted");
      setFileByAssignmentId((prev) => ({ ...prev, [assignment._id]: null }));
      onChanged?.();
    } catch (error) {
      showError(error?.response?.data?.message || "Could not submit assignment");
    } finally {
      setLoadingId("");
    }
  };

  const handleLoadTracking = async (assignmentId) => {
    try {
      setLoadingId(assignmentId);
      const response = await getAssignmentSubmissions(assignmentId);
      setTrackingById((prev) => ({ ...prev, [assignmentId]: response.data }));
    } catch (error) {
      showError(error?.response?.data?.message || "Could not load submission tracking");
    } finally {
      setLoadingId("");
    }
  };

  const handleGrade = async (submissionId, patch) => {
    const current = gradingBySubmissionId[submissionId] || { marks: "", feedback: "" };
    const payload = {
      marks: patch?.marks ?? current.marks,
      feedback: patch?.feedback ?? current.feedback,
    };
    try {
      setLoadingId(submissionId);
      await updateSubmissionFeedback(submissionId, payload);
      showSuccess("Feedback updated");
      onChanged?.();
    } catch (error) {
      showError(error?.response?.data?.message || "Could not update feedback");
    } finally {
      setLoadingId("");
    }
  };

  return (
    <div className="space-y-3">
      {sorted.map((assignment) => {
        const submissionState = assignment.submissionStatus || "not_submitted";
        const isLate = submissionState === "late" || new Date(assignment.dueDate).getTime() < Date.now();
        const tracking = trackingById[assignment._id];
        return (
          <article key={assignment._id} className={`rounded-xl border bg-white p-4 shadow-sm ${isLate ? "border-rose-300" : "border-slate-200"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-primary">{assignment.title}</h3>
                <p className="text-sm text-slate-600">{assignment.description || "No description"}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Uploaded: {formatDate(assignment.createdAt)} · Due: {formatDate(assignment.dueDate)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a href={assignment.fileUrl} target="_blank" rel="noreferrer" className="rounded border px-3 py-1.5 text-sm">
                  Download
                </a>
                {role === "student" && submissionState !== "not_submitted" ? (
                  <a href={assignment.submission?.fileUrl} target="_blank" rel="noreferrer" className="rounded border px-3 py-1.5 text-sm text-emerald-700">
                    View Submission
                  </a>
                ) : null}
                {role === "teacher" ? (
                  <button
                    type="button"
                    onClick={() => handleLoadTracking(assignment._id)}
                    className="rounded bg-primary px-3 py-1.5 text-sm text-white"
                  >
                    {loadingId === assignment._id ? "Loading..." : "Track Submissions"}
                  </button>
                ) : null}
              </div>
            </div>

            {role === "student" ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    submissionState === "submitted"
                      ? "bg-emerald-100 text-emerald-700"
                      : submissionState === "late"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {submissionState === "not_submitted" ? "Not Submitted" : submissionState === "late" ? "Late" : "Submitted"}
                </span>
                {submissionState === "not_submitted" ? (
                  <>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="rounded border px-2 py-1 text-xs"
                      onChange={(event) =>
                        setFileByAssignmentId((prev) => ({ ...prev, [assignment._id]: event.target.files?.[0] || null }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleSubmitAssignment(assignment)}
                      className="rounded bg-primary px-3 py-1.5 text-sm text-white"
                    >
                      {loadingId === assignment._id ? "Submitting..." : "Submit"}
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}

            {role === "teacher" && tracking ? (
              <div className="mt-4 overflow-x-auto rounded border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2">Student</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Submitted At</th>
                      <th className="px-3 py-2">Marks</th>
                      <th className="px-3 py-2">Feedback</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracking.submissions.map((item) => (
                      <tr key={item.studentId} className="border-t">
                        <td className="px-3 py-2">
                          <p className="font-medium">{item.studentName}</p>
                          <p className="text-xs text-slate-500">{item.email}</p>
                        </td>
                        <td className="px-3 py-2">{item.status}</td>
                        <td className="px-3 py-2">{formatDate(item.submittedAt)}</td>
                        <td className="px-3 py-2">
                          {item.submissionId ? (
                            <input
                              type="number"
                              min="0"
                              className="w-20 rounded border px-2 py-1"
                              value={gradingBySubmissionId[item.submissionId]?.marks ?? item.marks ?? ""}
                              onChange={(event) =>
                                setGradingBySubmissionId((prev) => ({
                                  ...prev,
                                  [item.submissionId]: {
                                    ...prev[item.submissionId],
                                    marks: event.target.value,
                                    feedback: prev[item.submissionId]?.feedback ?? item.feedback ?? "",
                                  },
                                }))
                              }
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {item.submissionId ? (
                            <input
                              className="w-52 rounded border px-2 py-1"
                              value={gradingBySubmissionId[item.submissionId]?.feedback ?? item.feedback ?? ""}
                              onChange={(event) =>
                                setGradingBySubmissionId((prev) => ({
                                  ...prev,
                                  [item.submissionId]: {
                                    ...prev[item.submissionId],
                                    feedback: event.target.value,
                                    marks: prev[item.submissionId]?.marks ?? item.marks ?? "",
                                  },
                                }))
                              }
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {item.submissionId ? (
                            <button
                              type="button"
                              onClick={() => handleGrade(item.submissionId)}
                              className="rounded bg-primary px-2.5 py-1 text-xs text-white"
                            >
                              {loadingId === item.submissionId ? "Saving..." : "Save"}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>
        );
      })}

      {!sorted.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No assignments available for this subject.
        </div>
      ) : null}
    </div>
  );
};

export default AssignmentList;
