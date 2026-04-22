import { formatTimeLabel, getLectureStatus, getStatusClasses } from "../utils/timetable";

const UpcomingLectureCard = ({ lecture, title = "Upcoming Lecture" }) => {
  const status = lecture ? getLectureStatus(lecture) : "Completed";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <h3 className="mt-1 font-heading text-2xl text-primary">
            {lecture?.subject || "No lecture scheduled"}
          </h3>
        </div>
        {lecture ? (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(status)}`}>{status}</span>
        ) : null}
      </div>

      {lecture ? (
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">Teacher:</span> {lecture.teacherName}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Time:</span> {formatTimeLabel(lecture.startTime)} -{" "}
            {formatTimeLabel(lecture.endTime)}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Day:</span> {lecture.day}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">No class is available in the current timetable.</p>
      )}
    </div>
  );
};

export default UpcomingLectureCard;
