const TeacherDropdown = ({
  value,
  onChange,
  availableTeachers = [],
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
      <option value="">
        {loading ? "Fetching available teachers..." : "Select available teacher"}
      </option>
      {availableTeachers.map((teacher) => (
        <option key={teacher._id} value={teacher._id}>
          {teacher.name} ({teacher.qualification || teacher.designation || "Teacher"})
        </option>
      ))}
    </select>
  </div>
);

export default TeacherDropdown;
