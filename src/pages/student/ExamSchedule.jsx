import { useMemo, useState } from "react";
import { getExams } from "../../api/student.api";
import useFetch from "../../hooks/useFetch";
import Table from "../../components/Table";
import Loader from "../../components/Loader";

const ExamSchedule = () => {
  const [calendarView, setCalendarView] = useState(false);
  const examsState = useFetch(getExams, []);
  const exams = examsState.data || [];

  const upcoming = useMemo(() => exams.filter((exam) => new Date(exam.date) >= new Date()), [exams]);
  const past = useMemo(() => exams.filter((exam) => new Date(exam.date) < new Date()), [exams]);

  const nextExamCountdown = useMemo(() => {
    if (!upcoming.length) return "-";
    const ms = new Date(upcoming[0].date).getTime() - Date.now();
    return `${Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))} days`;
  }, [upcoming]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">Exam Schedule</h1>
        <button onClick={() => setCalendarView((v) => !v)} className="rounded border px-3 py-1 text-sm">
          {calendarView ? "Table View" : "Calendar View"}
        </button>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-card text-sm text-slate-700">
        Countdown to next exam: <span className="font-bold text-primary">{nextExamCountdown}</span>
      </div>

      {examsState.loading ? (
        <Loader />
      ) : calendarView ? (
        <div className="grid gap-2 rounded-xl bg-white p-5 shadow-card sm:grid-cols-2 md:grid-cols-3">
          {upcoming.map((exam) => (
            <div key={exam._id} className="rounded border p-3 text-sm">
              <p className="font-semibold text-primary">{exam.subject}</p>
              <p>{new Date(exam.date).toLocaleDateString()}</p>
              <p>{exam.time}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          <Table
            data={upcoming}
            columns={[
              { key: "subject", title: "Subject" },
              { key: "date", title: "Date", render: (row) => new Date(row.date).toLocaleDateString() },
              { key: "time", title: "Time" },
              { key: "syllabus", title: "Syllabus" },
              { key: "roomNo", title: "Room No" },
            ]}
          />
          <div className="rounded-xl bg-white p-5 shadow-card">
            <h2 className="text-lg font-semibold text-primary">Past Exams</h2>
            <div className="mt-3 space-y-2 text-sm">
              {past.map((exam) => (
                <div key={exam._id} className="rounded border p-2">
                  {exam.subject} - {new Date(exam.date).toLocaleDateString()}
                </div>
              ))}
              {!past.length && <p className="text-slate-500">No past exams.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExamSchedule;
