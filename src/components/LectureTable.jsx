import { getLectureStatus } from "../utils/timetable";

const LectureTable = ({ lectures = [] }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Subject</th>
              <th className="px-4 py-3 font-semibold">Class</th>
              <th className="px-4 py-3 font-semibold">Section</th>
              <th className="px-4 py-3 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture, index) => {
              const isCurrent = getLectureStatus(lecture) === "Ongoing";
              return (
                <tr
                  key={`${lecture.subject}-${lecture.class}-${lecture.section}-${lecture.startTime}-${index}`}
                  className={`border-t ${isCurrent ? "bg-emerald-50" : ""}`}
                >
                  <td className="px-4 py-3 font-semibold text-primary">{lecture.subject}</td>
                  <td className="px-4 py-3">{lecture.class}</td>
                  <td className="px-4 py-3">{lecture.section || "-"}</td>
                  <td className="px-4 py-3">{lecture.startTime}-{lecture.endTime}</td>
                </tr>
              );
            })}
            {!lectures.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No lectures assigned
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LectureTable;

