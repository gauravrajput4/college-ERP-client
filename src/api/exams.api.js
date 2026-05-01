import api from "./axios";

export const getExams = async (params) => (await api.get("/v1/exams", { params })).data;
export const getExam = async (examId) => (await api.get(`/v1/exams/${examId}`)).data;
export const createExam = async (payload) => (await api.post("/v1/exams", payload)).data;
export const updateExam = async (examId, payload) => (await api.put(`/v1/exams/${examId}`, payload)).data;
export const generateExamSchedule = async (payload) => (await api.post("/v1/exams/generate", payload)).data;
export const previewEligibility = async (examId) => (await api.get(`/v1/exams/${examId}/eligibility`)).data;
export const generateAdmitCards = async (examId) => (await api.post(`/v1/exams/${examId}/admit-cards/generate`)).data;
export const getExamAdmitCards = async (examId, params) =>
  (await api.get(`/v1/exams/${examId}/admit-cards`, { params })).data;
export const revokeAdmitCard = async ({ examId, acId, reason }) =>
  (await api.patch(`/v1/exams/${examId}/admit-cards/${acId}/revoke`, { reason })).data;
export const reissueAdmitCard = async ({ examId, acId }) =>
  (await api.patch(`/v1/exams/${examId}/admit-cards/${acId}/reissue`)).data;
export const getAdmitCardData = async (acId) => (await api.get(`/v1/exams/admit-cards/${acId}`)).data;
export const downloadAdmitCardPDF = async (acId) =>
  (
    await api.get(`/v1/exams/admit-cards/${acId}/download`, {
      responseType: "blob",
    })
  ).data;
export const getMyAdmitCards = async () => (await api.get("/v1/exams/admit-cards/my")).data;
