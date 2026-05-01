import { useMemo, useState } from "react";
import { getAttendanceOverview, getResults, getResultsReport } from "../../api/admin.api";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import { Search } from "lucide-react";
import EmptyState from "../../components/empty/EmptyState";
import EmptyGenericIllustration from "../../components/empty/illustrations/EmptyGenericIllustration";

const ResultsOverview = () => {
  const [tab, setTab] = useState("results"); // results | attendance | rank
  const [filters, setFilters] = useState({
    class: "",
    examType: "",
    subject: "",
    search: "",
    page: 1,
    limit: 10,
  });

  const resultsState = useFetch(
    () => getResults({ class: filters.class, examType: filters.examType, subject: filters.subject, search: filters.search, page: filters.page, limit: filters.limit }),
    [filters.class, filters.examType, filters.subject, filters.search, filters.page, filters.limit],
  );
  const rankingState = useFetch(() => getResultsReport({ class: filters.class, examType: filters.examType }), [filters.class, filters.examType]);
  const attendanceState = useFetch(
    () => (filters.class ? getAttendanceOverview({ class: filters.class, page: filters.page, limit: filters.limit }) : Promise.resolve({ success: true, data: { summary: null, items: [] }, pagination: { page: 1, limit: filters.limit, total: 0, totalPages: 1 } })),
    [filters.class, filters.page, filters.limit],
  );

  const examTypeOptions = ["Unit Test", "Mid-Term", "Final"];
  const classOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => String(i + 1)), []);

  const resultsPayload = resultsState.data || {};
  const resultsRows = resultsPayload.data || resultsPayload || [];
  const resultsPagination = resultsPayload.pagination || { page: filters.page, limit: filters.limit, total: 0, totalPages: 1 };

  const subjectsFromResults = useMemo(() => {
    const set = new Set();
    (Array.isArray(resultsRows) ? resultsRows : []).forEach((row) => {
      const value = String(row.subject || "").trim();
      if (value) set.add(value);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [resultsRows]);

  const attendancePayload = attendanceState.data || {};
  const attendanceData = attendancePayload.data || {};
  const attendanceRows = attendanceData.items || [];
  const attendanceSummary = attendanceData.summary || null;
  const attendancePagination = attendancePayload.pagination || { page: filters.page, limit: filters.limit, total: 0, totalPages: 1 };

  const showing = (pagination) => {
    const total = Number(pagination.total || 0);
    const from = total ? (filters.page - 1) * filters.limit + 1 : 0;
    const to = total ? Math.min(filters.page * filters.limit, total) : 0;
    return { total, from, to, totalPages: Math.max(1, Number(pagination.totalPages || 1)) };
  };

  const resultsShowing = showing(resultsPagination);
  const attendanceShowing = showing(attendancePagination);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Results & Attendance Overview</h1>
      <div className="rounded-2xl bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-full rounded-xl bg-slate-100 p-1 text-sm lg:w-auto">
            {[
              { key: "results", label: "Results" },
              { key: "attendance", label: "Attendance" },
              { key: "rank", label: "Class Rank" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`flex-1 rounded-lg px-3 py-2 font-semibold transition lg:flex-none ${
                  tab === item.key ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[160px,180px,200px,1fr]">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={filters.class}
              onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, class: e.target.value }))}
            >
              <option value="">Select Class</option>
              {classOptions.map((value) => (
                <option key={value} value={value}>
                  Class {value}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={filters.examType}
              onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, examType: e.target.value }))}
              disabled={tab === "attendance"}
            >
              <option value="">{tab === "attendance" ? "Exam Type (N/A)" : "All Exam Types"}</option>
              {examTypeOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50"
              value={filters.subject}
              onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, subject: e.target.value }))}
              disabled={tab !== "results"}
            >
              <option value="">{tab !== "results" ? "Subject (N/A)" : "All Subjects"}</option>
              {subjectsFromResults.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Search student"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, search: e.target.value }))}
                disabled={tab !== "results"}
              />
            </div>
          </div>
        </div>
      </div>

      {(resultsState.loading || rankingState.loading || attendanceState.loading) && <Loader />}

      {tab === "results" && !resultsState.loading && (
        !filters.class ? (
          <EmptyState
            illustration={<EmptyGenericIllustration />}
            title="Select filters to view results"
            description="Choose a class (and optionally exam type / subject) to load results."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Subject</th>
                    <th className="px-4 py-3 font-semibold">Exam Type</th>
                    <th className="px-4 py-3 font-semibold">Marks</th>
                    <th className="px-4 py-3 font-semibold">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(resultsRows) ? resultsRows : []).map((row) => {
                    const obtained = Number(row.marksObtained || 0);
                    const max = Math.max(1, Number(row.maxMarks || 0));
                    const pct = (obtained / max) * 100;
                    const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F";
                    const tone = pct >= 75 ? "text-emerald-700 bg-emerald-50" : pct < 40 ? "text-rose-700 bg-rose-50" : "text-slate-700 bg-slate-50";
                    return (
                      <tr key={row._id} className="border-t hover:bg-slate-50/60">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{row.studentId?.userId?.name || "-"}</div>
                          <div className="text-xs text-slate-500">{row.studentId?.rollNo || "-"}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{row.subject || "-"}</td>
                        <td className="px-4 py-3 text-slate-700">{row.examType || "-"}</td>
                        <td className="px-4 py-3 text-slate-800">
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${tone}`}>
                            {obtained}/{max} ({pct.toFixed(0)}%)
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{grade}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {(!Array.isArray(resultsRows) || resultsRows.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                        No results found for selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
              <div className="text-slate-600">
                Showing <span className="font-semibold text-slate-800">{resultsShowing.from}</span>–<span className="font-semibold text-slate-800">{resultsShowing.to}</span> of{" "}
                <span className="font-semibold text-slate-800">{resultsShowing.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={filters.page === 1} className="rounded-lg border px-3 py-1 disabled:opacity-50">
                  ← Prev
                </button>
                <button type="button" onClick={() => setFilters((p) => ({ ...p, page: Math.min(resultsShowing.totalPages, p.page + 1) }))} disabled={filters.page >= resultsShowing.totalPages} className="rounded-lg border px-3 py-1 disabled:opacity-50">
                  Next →
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {tab === "attendance" && !attendanceState.loading && (
        !filters.class ? (
          <EmptyState
            illustration={<EmptyGenericIllustration />}
            title="Select a class to view attendance"
            description="Choose a class to load attendance summary and student-wise breakdown."
          />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Classes", value: attendanceSummary?.totalClasses ?? 0 },
                { label: "Present", value: attendanceSummary?.present ?? 0 },
                { label: "Absent", value: attendanceSummary?.absent ?? 0 },
                { label: "Percentage", value: `${Number(attendanceSummary?.percentage ?? 0).toFixed(2)}%` },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
                  <div className="text-xs font-semibold text-slate-500">{card.label}</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">{card.value}</div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-left text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Student</th>
                      <th className="px-4 py-3 font-semibold">Present</th>
                      <th className="px-4 py-3 font-semibold">Absent</th>
                      <th className="px-4 py-3 font-semibold">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRows.map((row) => {
                      const pct = Number(row.percentage || 0);
                      return (
                        <tr key={row.studentId || `${row.rollNo}-${row.name}`} className="border-t hover:bg-slate-50/60">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{row.name || "-"}</div>
                            <div className="text-xs text-slate-500">{row.rollNo || "-"}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-800">{row.present ?? 0}</td>
                          <td className="px-4 py-3 text-slate-800">{row.absent ?? 0}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
                              </div>
                              <span className="text-xs font-semibold text-slate-700">{pct.toFixed(1)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {!attendanceRows.length && (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                          No attendance records for this class.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
                <div className="text-slate-600">
                  Showing <span className="font-semibold text-slate-800">{attendanceShowing.from}</span>–<span className="font-semibold text-slate-800">{attendanceShowing.to}</span> of{" "}
                  <span className="font-semibold text-slate-800">{attendanceShowing.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={filters.page === 1} className="rounded-lg border px-3 py-1 disabled:opacity-50">
                    ← Prev
                  </button>
                  <button type="button" onClick={() => setFilters((p) => ({ ...p, page: Math.min(attendanceShowing.totalPages, p.page + 1) }))} disabled={filters.page >= attendanceShowing.totalPages} className="rounded-lg border px-3 py-1 disabled:opacity-50">
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {tab === "rank" && !rankingState.loading && (
        !filters.class ? (
          <EmptyState
            illustration={<EmptyGenericIllustration />}
            title="Select a class to view rank"
            description="Choose a class to load the consolidated rank list."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Rank</th>
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Total Marks</th>
                    <th className="px-4 py-3 font-semibold">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {(rankingState.data || []).map((row) => {
                    const medal =
                      row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : null;
                    return (
                      <tr key={row._id} className={`border-t hover:bg-slate-50/60 ${row.rank <= 3 ? "bg-amber-50/40" : ""}`}>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {medal ? `${medal} ` : ""}{row.rank}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{row.name || "-"}</div>
                          <div className="text-xs text-slate-500">{row.rollNo || ""}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {Number(row.totalObtained || 0)}/{Number(row.totalMax || 0)}
                        </td>
                        <td className="px-4 py-3 text-slate-800">{Number(row.percentage || 0).toFixed(2)}%</td>
                      </tr>
                    );
                  })}
                  {(!rankingState.data || rankingState.data.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                        No ranking data for selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ResultsOverview;
