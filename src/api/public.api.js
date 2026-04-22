import api from "./axios";

export const getNotices = async () => (await api.get("/public/notices")).data;
export const getGallery = async (category) =>
  (await api.get("/public/gallery", { params: { category } })).data;
export const submitEnquiry = async (data) => (await api.post("/public/enquiry", data)).data;
export const submitContact = async (data) => (await api.post("/public/contact", data)).data;
