import { FileSpreadsheet } from "lucide-react";
import { useMemo, useState } from "react";
import AdmitCardStatusBadge from "./AdmitCardStatusBadge";

const buildCsv = (rows = []) => {
  const headers = ["Name", "Roll", "Attendance%", "Fees%", "Status", "Reasons"];
  const records = rows.map((row) => [
    row.studentName,
    row.rollNumber,
    row.attendancePercent,
    row.feesPaidPercent,
    row.eligibilityStatus,
    (row.ineligibilityReasons || []).join("; "),
  ]);
  return [headers, ...records]
    .map((record) => record.map((item) => `"${String(item ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
};

const EligibilityPreviewTable = ({ preview }) => {
  const [tab, setTab] = useState("eligible");
  const rows = useMemo(() => (tab === "eligible" ? preview?.eligible || [] : preview?.ineligible || []), [preview, tab]);

  const exportCsv = () => {
    const csv = buildCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eligibility-preview-${tab}.csv`;
    link.click();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-md bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
            {preview?.summary?.eligibleCount ?? 0} eligible
          </span>
          <span className="rounded-md bg-rose-50 px-3 py-1 font-semibold text-rose-700">
            {preview?.summary?.ineligibleCount ?? 0} ineligible
          </span>
        </div>
        <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
          <FileSpreadsheet size={16} />
          Export CSV
        </button>
      </div>

      <div className="flex gap-2 px-4 py-3">
        {[
          ["eligible", "Eligible Students"],
          ["ineligible", "Ineligible Students"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${tab === key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["Name", "Roll", "Attend%", "Fees%", "Status", "Reasons"].map((label) => (
                <th key={label} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.studentId} className={row.isEligible ? "bg-emerald-50/30" : "bg-rose-50/30"}>
                <td className="px-4 py-3 font-medium text-slate-900">{row.studentName}</td>
                <td className="px-4 py-3">{row.rollNumber}</td>
                <td className="px-4 py-3">{row.attendancePercent}%</td>
                <td className="px-4 py-3">{row.feesPaidPercent}%</td>
                <td className="px-4 py-3">
                  <AdmitCardStatusBadge status={row.eligibilityStatus} />
                </td>
                <td className="px-4 py-3 text-slate-600">{(row.ineligibilityReasons || []).join(", ") || "-"}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No students in this view.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EligibilityPreviewTable;
