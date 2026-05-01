import api from "./axios";

export const getSubjectList = async () => (await api.get("/assignments/subjects")).data;

export const getAssignmentsBySubject = async (subjectId) =>
  (await api.get("/assignments", { params: { subjectId } })).data;

export const createAssignment = async (formData) =>
  (
    await api.post("/assignments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;

export const getAssignmentSubmissions = async (assignmentId) =>
  (await api.get(`/assignments/${assignmentId}/submissions`)).data;

export const submitAssignment = async (formData) =>
  (
    await api.post("/submissions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;

export const updateSubmissionFeedback = async (submissionId, payload) =>
  (await api.patch(`/submissions/${submissionId}`, payload)).data;
