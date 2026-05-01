import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAttendance,
  getAttendanceReport,
  markAttendance,
  updateAttendance,
} from "../../api/attendance";
import { showSuccess } from "../../components/Toast";
import { invalidateAttendanceMutation } from "../../lib/queryInvalidation";

export const useAttendance = (filters) => {
  return useQuery({
    queryKey: ["attendance", filters],
    queryFn: () => getAttendance(filters),
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAttendance,
    onMutate: async (payload) => {
      const key = ["attendance", { date: payload.date, subject: payload.subject, class: payload.class, section: payload.section }];
      await queryClient.cancelQueries({ queryKey: ["attendance"] });
      const previous = queryClient.getQueryData(key);
      queryClient.setQueryData(key, (current) => ({
        ...(current || {}),
        items: payload.entries || current?.items || [],
      }));
      return { previous, key };
    },
    onError: (_error, _variables, context) => {
      if (context?.key) queryClient.setQueryData(context.key, context.previous);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      for (const entry of variables.entries || []) {
        invalidateAttendanceMutation(queryClient, entry.studentId);
      }
      showSuccess("Attendance marked successfully");
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAttendance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export const useAttendanceReport = (studentId, period) => {
  return useQuery({
    queryKey: ["attendance-report", studentId, period],
    queryFn: () => getAttendanceReport({ studentId, ...period }),
    enabled: !!studentId,
  });
};
