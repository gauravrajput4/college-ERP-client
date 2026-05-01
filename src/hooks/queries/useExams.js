import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExam,
  downloadAdmitCardPDF,
  generateAdmitCards,
  getAdmitCardData,
  getExam,
  getExamAdmitCards,
  getExams,
  getMyAdmitCards,
  previewEligibility,
  reissueAdmitCard,
  revokeAdmitCard,
  updateExam,
  generateExamSchedule,
} from "../../api/exams.api";
import { showError, showSuccess } from "../../components/Toast";

export const useExams = (filters = {}) =>
  useQuery({
    queryKey: ["exams", filters],
    queryFn: async () => {
      const response = await getExams(filters);
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

export const useExam = (examId) =>
  useQuery({
    queryKey: ["exams", examId],
    queryFn: async () => {
      const response = await getExam(examId);
      return response.data;
    },
    enabled: !!examId,
  });

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExam,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      showSuccess(response?.message || "Exam created");
    },
    onError: (error) => showError(error?.response?.data?.message || "Failed to create exam"),
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, payload }) => updateExam(examId, payload),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", variables.examId] });
      showSuccess("Exam updated");
    },
  });
};

export const useGenerateExamSchedule = () => {
  return useMutation({
    mutationFn: generateExamSchedule,
    onSuccess: () => {
      showSuccess("Smart schedule generated");
    },
    onError: (error) => showError(error?.response?.data?.message || "Failed to generate schedule"),
  });
};

export const useEligibilityPreview = (examId, criteria) =>
  useQuery({
    queryKey: ["eligibility", examId, criteria],
    queryFn: async () => {
      const response = await previewEligibility(examId);
      return response.data;
    },
    staleTime: 30 * 1000,
    enabled: !!examId,
  });

export const useExamAdmitCards = (examId, filters = {}) =>
  useQuery({
    queryKey: ["admitCards", examId, filters],
    queryFn: async () => {
      const response = await getExamAdmitCards(examId, filters);
      return response.data || [];
    },
    enabled: !!examId,
    placeholderData: keepPreviousData,
  });

export const useGenerateAdmitCards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateAdmitCards,
    onSuccess: (_response, examId) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", examId] });
      queryClient.invalidateQueries({ queryKey: ["admitCards", examId] });
      queryClient.invalidateQueries({ queryKey: ["eligibility", examId] });
      showSuccess("Admit cards generated");
    },
    onError: (error) => showError(error?.response?.data?.message || "Generation failed"),
  });
};

export const useMyAdmitCards = () =>
  useQuery({
    queryKey: ["admitCards", "mine"],
    queryFn: async () => {
      const response = await getMyAdmitCards();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useDownloadAdmitCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ acId, openInNewTab = true }) => {
      const pdfBlob = await downloadAdmitCardPDF(acId);
      const blob = new Blob([pdfBlob], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      if (openInNewTab) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = `admit-card-${acId}.pdf`;
        link.click();
      }
      return { acId, url };
    },
    onMutate: async ({ acId }) => {
      await queryClient.cancelQueries({ queryKey: ["admitCards", "mine"] });
      const previousMine = queryClient.getQueryData(["admitCards", "mine"]);
      if (Array.isArray(previousMine)) {
        queryClient.setQueryData(
          ["admitCards", "mine"],
          previousMine.map((item) =>
            item._id === acId ? { ...item, downloadCount: Number(item.downloadCount || 0) + 1 } : item,
          ),
        );
      }
      return { previousMine };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMine) {
        queryClient.setQueryData(["admitCards", "mine"], context.previousMine);
      }
      showError("Download failed. Try again.");
    },
  });
};

export const useRevokeAdmitCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeAdmitCard,
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admitCards", variables.examId] });
      queryClient.invalidateQueries({ queryKey: ["admitCards", "mine"] });
      showSuccess("Admit card revoked");
    },
  });
};

export const useReissueAdmitCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reissueAdmitCard,
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admitCards", variables.examId] });
      queryClient.invalidateQueries({ queryKey: ["admitCards", "mine"] });
      showSuccess("Admit card reissued");
    },
  });
};

export const useAdmitCardData = (acId) =>
  useQuery({
    queryKey: ["admitCardData", acId],
    queryFn: async () => {
      const response = await getAdmitCardData(acId);
      return response.data;
    },
    enabled: !!acId,
  });
