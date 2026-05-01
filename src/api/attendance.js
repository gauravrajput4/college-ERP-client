import api from "./axios";

const unwrap = (response) => response?.data?.data ?? response?.data ?? {};

export const getAttendance = async ({ date = "", subject = "", class: className = "", section = "" } = {}) => {
  const payload = unwrap(
    await api.get("/teacher/attendance", {
      params: { date, subject, class: className, section },
    }),
  );
  return {
    items: payload.attendance ?? payload.items ?? [],
    summary: payload.summary ?? {},
  };
};

export const markAttendance = async (data) => {
  const payload = unwrap(await api.post("/teacher/attendance", data));
  return {
    items: payload.attendance ?? payload.entries ?? data.entries ?? [],
    summary: payload.summary ?? {},
  };
};

export const updateAttendance = async (id, data) => {
  const payload = unwrap(await api.put(`/teacher/attendance/${id}`, data));
  return payload.attendance ?? payload;
};

export const getAttendanceReport = async ({ studentId = "", month = "", year = "" } = {}) => {
  const payload = unwrap(
    await api.get("/admin/reports/attendance", {
      params: { studentId, month, year },
    }),
  );
  return {
    studentId,
    month,
    year,
    items: payload.attendance ?? payload.items ?? [],
    summary: payload.summary ?? {},
  };
};

