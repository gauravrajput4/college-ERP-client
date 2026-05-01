import api from "./axios";

const unwrap = (response) => response?.data?.data ?? response?.data ?? {};

const normalizeStudent = (student = {}) => ({
  _id: student._id ?? "",
  rollNo: student.rollNo ?? "",
  class: student.class ?? "",
  section: student.section ?? "",
  fatherName: student.fatherName ?? "",
  motherName: student.motherName ?? "",
  session: student.session ?? "",
  createdAt: student.createdAt ?? "",
  attendancePercentage: Number(student.attendancePercentage ?? 0),
  userId: {
    _id: student.userId?._id ?? "",
    name: student.userId?.name ?? "",
    email: student.userId?.email ?? "",
    phone: student.userId?.phone ?? "",
    photo: student.userId?.photo ?? "",
  },
});

export const getStudents = async ({ page = 1, limit = 10, search = "", department = "", className = "", section = "" } = {}) => {
  const payload = unwrap(
    await api.get("/admin/students", {
      params: {
        page,
        limit,
        search,
        department,
        class: className,
        section,
      },
    }),
  );

  const list = payload.students ?? payload.items ?? payload.data ?? [];
  return {
    items: Array.isArray(list) ? list.map(normalizeStudent) : [],
    total: Number(payload.total ?? payload.count ?? list.length ?? 0),
    page: Number(payload.page ?? page),
    limit: Number(payload.limit ?? limit),
  };
};

export const getStudentById = async (id) => {
  const payload = unwrap(await api.get(`/admin/students/${id}`));
  const candidate = payload.student ?? payload;
  return normalizeStudent(candidate);
};

export const createStudent = async (data) => {
  const payload = unwrap(await api.post("/admin/students", data));
  return normalizeStudent(payload.student ?? payload);
};

export const updateStudent = async (id, data) => {
  const payload = unwrap(await api.put(`/admin/students/${id}`, data));
  return normalizeStudent(payload.student ?? payload);
};

export const deleteStudent = async (id) => {
  const payload = unwrap(await api.delete(`/admin/students/${id}`));
  return { success: payload.success !== false, id };
};

export const getStudentAttendance = async (id, { month, year } = {}) => {
  const payload = unwrap(
    await api.get(`/student/attendance`, {
      params: { studentId: id, month, year },
    }),
  );
  return {
    studentId: id,
    attendance: payload.attendance ?? [],
    summary: payload.summary ?? { present: 0, absent: 0, leave: 0, percentage: 0 },
  };
};

export const getStudentMarks = async (id, { semester } = {}) => {
  const payload = unwrap(
    await api.get(`/student/results`, {
      params: { studentId: id, semester },
    }),
  );
  return {
    studentId: id,
    results: payload.results ?? [],
    summary: payload.summary ?? { percentage: 0, totalObtained: 0, totalMax: 0 },
  };
};

