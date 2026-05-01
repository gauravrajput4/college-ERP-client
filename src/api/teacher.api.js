import api from "./axios";

export const getDashboard = async () => (await api.get("/teacher/dashboard")).data;
export const getStudents = async (className, section) =>
  (await api.get("/teacher/students", { params: { class: className, section } })).data;
export const markAttendance = async (data) => (await api.post("/teacher/attendance", data)).data;
export const uploadResult = async (data) => (await api.post("/teacher/result", data)).data;
export const uploadMaterial = async (formData) =>
  (
    await api.post("/teacher/material", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
export const getMaterials = async (params) => (await api.get("/teacher/materials", { params })).data;
export const deleteMaterial = async (id) => (await api.delete(`/teacher/material/${id}`)).data;
export const getTimetable = async (params) => (await api.get("/teacher/timetable", { params })).data;
export const getTeacherSchedule = async (teacherId, params) =>
  (await api.get(`/teachers/${teacherId}/schedule`, { params })).data;
export const getTeacherWeeklySummary = async (teacherId) =>
  (await api.get(`/teachers/${teacherId}/schedule/weekly`)).data;
