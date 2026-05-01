import api from "./axios";

export const getDashboard = async () => (await api.get("/student/dashboard")).data;
export const getAttendance = async (params) => (await api.get("/student/attendance", { params })).data;
export const getDailyAttendance = async (date) => (await api.get("/attendance", { params: { date } })).data;
export const getResults = async (params) => (await api.get("/student/results", { params })).data;
export const getFees = async () => (await api.get("/student/fees")).data;
export const createPayNowOrder = async (data) => (await api.post("/student/fees/pay-now", data)).data;
export const verifyPayNowOrder = async (data) => (await api.post("/student/fees/pay-now/verify", data)).data;
export const updatePayNowOrderStatus = async (data) => (await api.post("/student/fees/pay-now/status", data)).data;
export const downloadReceipt = async (receiptNo) =>
  await api.get(`/student/fees/receipt/${receiptNo}`, {
    responseType: "blob",
  });
export const getMaterials = async (params) => (await api.get("/student/materials", { params })).data;
export const getExams = async () => (await api.get("/student/exams")).data;
export const getTimetable = async (params) => (await api.get("/student/timetable", { params })).data;
