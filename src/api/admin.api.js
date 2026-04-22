import api from "./axios";

export const getDashboard = async () => (await api.get("/admin/dashboard")).data;

export const getStudents = async (params) => (await api.get("/admin/students", { params })).data;
export const createStudent = async (data) => (await api.post("/admin/students", data)).data;
export const updateStudent = async (id, data) => (await api.put(`/admin/students/${id}`, data)).data;
export const deleteStudent = async (id) => (await api.delete(`/admin/students/${id}`)).data;

export const getTeachers = async (params) => (await api.get("/admin/teachers", { params })).data;
export const createTeacher = async (data) => (await api.post("/admin/teachers", data)).data;
export const updateTeacher = async (id, data) => (await api.put(`/admin/teachers/${id}`, data)).data;
export const deleteTeacher = async (id) => (await api.delete(`/admin/teachers/${id}`)).data;

export const getFees = async (params) => (await api.get("/admin/fees", { params })).data;
export const getPaymentReconciliation = async (params) =>
  (await api.get("/admin/fees/reconciliation", { params })).data;
export const createFee = async (data) => (await api.post("/admin/fees", data)).data;
export const updateFee = async (id, data) => (await api.put(`/admin/fees/${id}`, data)).data;
export const deleteFee = async (id) => (await api.delete(`/admin/fees/${id}`)).data;
export const recordPayment = async (id, data) => (await api.post(`/admin/fees/${id}/payment`, data)).data;
export const getCourseFees = async (params) => (await api.get("/admin/course-fees", { params })).data;
export const upsertCourseFee = async (data) => (await api.post("/admin/course-fees", data)).data;
export const getClassCatalog = async () => (await api.get("/admin/class-catalog")).data;
export const upsertClassCatalog = async (data) => (await api.post("/admin/class-catalog", data)).data;
export const deleteClassCatalog = async (id) => (await api.delete(`/admin/class-catalog/${id}`)).data;
export const getTimetables = async (params) => (await api.get("/admin/timetables", { params })).data;
export const getAvailableTeachers = async (params) =>
  (await api.get("/admin/timetables/available-teachers", { params })).data;
export const createTimetable = async (data) => (await api.post("/admin/timetables", data)).data;
export const updateTimetable = async (id, data) => (await api.put(`/admin/timetables/${id}`, data)).data;
export const deleteTimetable = async (id) => (await api.delete(`/admin/timetables/${id}`)).data;

export const getExamSchedules = async (params) => (await api.get("/admin/exams", { params })).data;
export const createExamSchedule = async (data) => (await api.post("/admin/exams", data)).data;
export const updateExamSchedule = async (id, data) => (await api.put(`/admin/exams/${id}`, data)).data;
export const deleteExamSchedule = async (id) => (await api.delete(`/admin/exams/${id}`)).data;

export const getResults = async (params) => (await api.get("/admin/results", { params })).data;
export const getAttendanceReport = async (params) => (await api.get("/admin/reports/attendance", { params })).data;
export const getResultsReport = async (params) => (await api.get("/admin/reports/results", { params })).data;

export const getNotices = async () => (await api.get("/admin/notices")).data;
export const createNotice = async (data) => (await api.post("/admin/notices", data)).data;
export const updateNotice = async (id, data) => (await api.put(`/admin/notices/${id}`, data)).data;
export const deleteNotice = async (id) => (await api.delete(`/admin/notices/${id}`)).data;

export const getGallery = async (params) => (await api.get("/admin/gallery", { params })).data;
export const createGallery = async (formData) =>
  (
    await api.post("/admin/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
export const deleteGallery = async (id) => (await api.delete(`/admin/gallery/${id}`)).data;

export const getEnquiries = async (params) => (await api.get("/admin/enquiries", { params })).data;
export const updateEnquiryStatus = async (id, status) =>
  (await api.patch(`/admin/enquiries/${id}/status`, { status })).data;
