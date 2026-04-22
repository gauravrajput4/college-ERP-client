import TeacherDropdown from "./TeacherDropdown";
import { DAYS, addMinutesToTime } from "../utils/timetable";

const TimetableForm = ({
  form,
  onChange,
  onSubmit,
  onCancel,
  classOptions = [],
  subjectOptions = [],
  availableTeachers = [],
  unavailableTeachers = [],
  teacherLoading = false,
  submitLabel = "Save Timetable",
}) => {
  const autoEndTime = addMinutesToTime(form.startTime, 45);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Class</label>
          <select
            value={form.className}
            onChange={(event) => onChange("className", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
            required
          >
            <option value="">Select class</option>
            {classOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Subject</label>
          <select
            value={form.subject}
            onChange={(event) => onChange("subject", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
            required
          >
            <option value="">Select subject</option>
            {subjectOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Day</label>
          <select
            value={form.day}
            onChange={(event) => onChange("day", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
            required
          >
            <option value="">Select day</option>
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Start Time</label>
          <input
            type="time"
            value={form.startTime}
            onChange={(event) => onChange("startTime", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TeacherDropdown
          value={form.teacherId}
          onChange={(event) => onChange("teacherId", event.target.value)}
          availableTeachers={availableTeachers}
          unavailableTeachers={unavailableTeachers}
          loading={teacherLoading}
          disabled={!form.className || !form.subject || !form.day || !form.startTime}
        />

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">End Time</label>
          <input
            value={autoEndTime}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
            aria-label="Calculated end time"
          />
          <p className="text-xs text-slate-500">Lecture duration is fixed at 45 minutes.</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
        ) : null}
        <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TimetableForm;
