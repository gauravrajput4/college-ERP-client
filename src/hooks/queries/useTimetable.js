import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosInstance.js"; // Standard for Vite+Axios setup usually
// If not available, we can mock or use a fetcher, let's assume `api` from standard structure.
import axios from "axios";

// Using a basic fallback if api/axiosInstance isn't set up yet
const fetcher = axios.create({
  baseURL: "/api/v1/timetable",
  withCredentials: true,
});

export const useClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data } = await fetcher.get("/classes");
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSections = (classId) => {
  return useQuery({
    queryKey: ["sections", classId],
    queryFn: async () => {
      const { data } = await fetcher.get(`/sections/${classId}`);
      return data.data;
    },
    enabled: !!classId,
  });
};

export const useSubjectsByClass = (classId) => {
  return useQuery({
    queryKey: ["subjects", "byClass", classId],
    queryFn: async () => {
      const { data } = await fetcher.get(`/subjects/${classId}`);
      return data.data;
    },
    enabled: !!classId,
  });
};

export const useAvailableTeachers = (slotParams) => {
  return useQuery({
    queryKey: ["teachers", "available", slotParams],
    queryFn: async () => {
      const { day, startTime, endTime, subjectId } = slotParams;
      const { data } = await fetcher.get("/teachers/available", {
        params: { day, startTime, endTime, subjectId },
      });
      return data.data;
    },
    enabled: !!(slotParams?.day && slotParams?.startTime && slotParams?.endTime && slotParams?.subjectId),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useGenerateTimetable = () => {
  return useMutation({
    mutationFn: async (config) => {
      const { data } = await fetcher.post("/generate", config);
      return data.data;
    },
  });
};

export const useSaveTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      // payload is { timetableData, status }
      const { data } = await fetcher.post("/save", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
    },
  });
};

export const useUpdateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ timetableId, day, startTime, newSlotData }) => {
      const { data } = await fetcher.put(`/${timetableId}/slot`, {
        day,
        startTime,
        newSlotData,
      });
      return data.data;
    },
    onMutate: async ({ timetableId, day, startTime, newSlotData }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["timetable", timetableId] });
      const previousTimetable = queryClient.getQueryData(["timetable", timetableId]);

      if (previousTimetable) {
        queryClient.setQueryData(["timetable", timetableId], (old) => {
          if (!old) return old;
          const newSlots = old.slots.map((s) => {
            if (s.day === day && s.startTime === startTime) {
              return { ...s, ...newSlotData, isConflict: false };
            }
            return s;
          });
          return { ...old, slots: newSlots };
        });
      }
      return { previousTimetable };
    },
    onError: (err, variables, context) => {
      if (context?.previousTimetable) {
        queryClient.setQueryData(["timetable", variables.timetableId], context.previousTimetable);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timetable", variables.timetableId] });
    },
  });
};

export const usePublishTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (timetableId) => {
      const { data } = await fetcher.patch(`/${timetableId}/publish`);
      return data.data;
    },
    onSuccess: (data, timetableId) => {
      queryClient.invalidateQueries({ queryKey: ["timetable", timetableId] });
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
    },
  });
};
