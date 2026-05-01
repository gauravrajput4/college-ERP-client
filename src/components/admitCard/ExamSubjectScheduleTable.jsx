const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "-";

const ExamSubjectScheduleTable = ({ subjects = [] }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-900 text-white">
        <tr>
          {["#", "Subject", "Code", "Date", "Day", "Room", "Start", "End", "Duration", "Max Marks"].map((label) => (
            <th key={label} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 bg-white">
        {subjects.map((subject, index) => (
          <tr key={`${subject.subjectCode || subject.code}-${index}`} className={index % 2 ? "bg-slate-50" : "bg-white"}>
            <td className="px-3 py-3">{index + 1}</td>
            <td className="px-3 py-3 font-medium text-slate-900">{subject.subjectName || subject.name}</td>
            <td className="px-3 py-3">{subject.subjectCode || subject.code}</td>
            <td className="px-3 py-3">{formatDate(subject.date)}</td>
            <td className="px-3 py-3 font-semibold">{subject.day}</td>
            <td className="px-3 py-3">{subject.room}</td>
            <td className="px-3 py-3">{subject.startTime}</td>
            <td className="px-3 py-3">{subject.endTime}</td>
            <td className="px-3 py-3 font-semibold">{subject.duration}</td>
            <td className="px-3 py-3">{subject.maxMarks}</td>
          </tr>
        ))}
        {!subjects.length ? (
          <tr>
            <td colSpan={10} className="px-3 py-8 text-center text-slate-500">
              No scheduled subjects added yet.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  </div>
);

export default ExamSubjectScheduleTable;
