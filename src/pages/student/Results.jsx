import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getResults } from "../../api/student.api";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";

const tabs = ["Unit Test", "Mid-Term", "Final"];

const Results = () => {
  const [examType, setExamType] = useState("Unit Test");
  const resultsState = useFetch(() => getResults({ examType }), [examType]);

  const results = useMemo(() => resultsState.data?.results || [], [resultsState.data]);
  const summary = resultsState.data?.summary || {};
  const percentage = Number(summary.percentage || 0);
  const badgeTone =
    percentage >= 90
      ? "bg-emerald-100 text-emerald-700"
      : percentage >= 75
        ? "bg-indigo-100 text-indigo-700"
        : "bg-amber-100 text-amber-700";

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Student Report Card", 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [["Subject", "Max", "Obtained", "Grade", "Remarks"]],
      body: results.map((row) => [row.subject, row.maxMarks, row.marksObtained, row.grade, row.remarks || "-"]),
    });
    doc.text(`Total: ${summary.totalObtained || 0}/${summary.totalMax || 0}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Percentage: ${summary.percentage || 0}%`, 14, doc.lastAutoTable.finalY + 18);
    doc.save("report-card.pdf");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-amber-600">Student Portfolio</span>
          <h1 className="mt-1 font-heading text-3xl text-primary">Academic Performance</h1>
        </div>
        <button
          onClick={handleDownload}
          className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-slate-900 shadow-sm hover:brightness-95"
        >
          Download Report Card (PDF)
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setExamType(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              examType === tab ? "bg-primary text-white" : "bg-white text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {resultsState.loading ? (
        <Loader text="Loading report card..." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-card">
              <p className="text-xs uppercase tracking-widest text-slate-500">Total Marks</p>
              <p className="mt-2 text-3xl font-bold text-primary">
                {summary.totalObtained || 0}
                <span className="text-lg text-slate-500"> / {summary.totalMax || 0}</span>
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-card">
              <p className="text-xs uppercase tracking-widest text-slate-500">Percentage</p>
              <p className="mt-2 text-3xl font-bold text-primary">{percentage}%</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-card">
              <p className="text-xs uppercase tracking-widest text-slate-500">Performance Band</p>
              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-bold ${badgeTone}`}>
                {percentage >= 90 ? "Outstanding" : percentage >= 75 ? "Strong" : "Needs Improvement"}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-card">
            <div className="border-b bg-slate-50 px-5 py-4">
              <h2 className="text-lg font-semibold text-primary">{examType} Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Subject</th>
                    <th className="px-4 py-3 text-center font-semibold">Max</th>
                    <th className="px-4 py-3 text-center font-semibold">Obtained</th>
                    <th className="px-4 py-3 text-center font-semibold">Grade</th>
                    <th className="px-4 py-3 font-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row._id} className="border-t">
                      <td className="px-4 py-3 font-semibold text-primary">{row.subject}</td>
                      <td className="px-4 py-3 text-center">{row.maxMarks}</td>
                      <td className="px-4 py-3 text-center font-semibold">{row.marksObtained}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700">
                          {row.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.remarks || "-"}</td>
                    </tr>
                  ))}
                  {!results.length && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No records found for this exam type.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Results;
