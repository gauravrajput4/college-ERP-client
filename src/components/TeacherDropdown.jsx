const TeacherDropdown = ({
  value,
  onChange,
  availableTeachers = [],
  unavailableTeachers = [],
  loading = false,
  disabled = false,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-700">Teacher</label>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
      aria-label="Select available teacher"
    >
      <option value="">{loading ? "Loading teachers..." : "Select available teacher"}</option>
      {availableTeachers.map((teacher) => (
        <option key={teacher._id} value={teacher._id}>
          {teacher.name} ({teacher.employeeId})
        </option>
      ))}
    </select>

    {!!unavailableTeachers.length && (
      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
        <p className="font-semibold">Unavailable at this time</p>
        <div className="mt-2 space-y-1">
          {unavailableTeachers.map((teacher) => (
            <p key={teacher._id}>
              {teacher.name}: {teacher.conflict?.className} {teacher.conflict?.subject}{" "}
              {teacher.conflict?.startTime} - {teacher.conflict?.endTime}
            </p>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default TeacherDropdown;
