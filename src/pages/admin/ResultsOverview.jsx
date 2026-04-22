import { useState } from "react";
import { getAttendanceReport, getResults, getResultsReport } from "../../api/admin.api";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import Table from "../../components/Table";

const ResultsOverview = () => {
  const [tab, setTab] = useState("results");
  const [filters, setFilters] = useState({ class: "", examType: "" });

  const resultsState = useFetch(() => getResults(filters), [filters.class, filters.examType]);
  const rankingState = useFetch(() => getResultsReport(filters), [filters.class, filters.examType]);
  const attendanceState = useFetch(() => getAttendanceReport({ class: filters.class }), [filters.class]);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Results & Attendance Overview</h1>
      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-card md:grid-cols-4">
        <input className="rounded border" placeholder="Class" value={filters.class} onChange={(e) => setFilters((prev) => ({ ...prev, class: e.target.value }))} />
        <select className="rounded border" value={filters.examType} onChange={(e) => setFilters((prev) => ({ ...prev, examType: e.target.value }))}>
          <option value="">All Exam Types</option>
          <option value="Unit Test">Unit Test</option>
          <option value="Mid-Term">Mid-Term</option>
          <option value="Final">Final</option>
        </select>
        <button
          onClick={() => setTab("results")}
          className={`rounded px-3 py-2 text-sm ${tab === "results" ? "bg-primary text-white" : "border"}`}
        >
          Results
        </button>
        <button
          onClick={() => setTab("attendance")}
          className={`rounded px-3 py-2 text-sm ${tab === "attendance" ? "bg-primary text-white" : "border"}`}
        >
          Attendance
        </button>
      </div>

      {(resultsState.loading || rankingState.loading || attendanceState.loading) && <Loader />}

      {!resultsState.loading && tab === "results" && (
        <div className="space-y-4">
          <Table
            data={resultsState.data || []}
            columns={[
              { key: "student", title: "Student", render: (row) => row.studentId?.rollNo || "-" },
              { key: "subject", title: "Subject" },
              { key: "examType", title: "Exam Type" },
              { key: "marksObtained", title: "Obtained" },
              { key: "maxMarks", title: "Max" },
            ]}
          />
          <div className="rounded-xl bg-white p-5 shadow-card">
            <h2 className="mb-3 text-lg font-semibold text-primary">Class Rank (Consolidated)</h2>
            <Table
              data={rankingState.data || []}
              columns={[
                { key: "rank", title: "Rank" },
                { key: "_id", title: "Student ID" },
                { key: "totalObtained", title: "Total Obtained" },
                { key: "totalMax", title: "Total Max" },
                {
                  key: "percentage",
                  title: "Percentage",
                  render: (row) => Number(row.percentage || 0).toFixed(2),
                },
              ]}
            />
          </div>
        </div>
      )}

      {!attendanceState.loading && tab === "attendance" && (
        <Table
          data={attendanceState.data || []}
          columns={[
            { key: "_id", title: "Status" },
            { key: "count", title: "Count" },
          ]}
        />
      )}
    </div>
  );
};

export default ResultsOverview;
