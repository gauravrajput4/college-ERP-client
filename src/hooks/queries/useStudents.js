import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "../../api/students";
import { showError, showSuccess } from "../../components/Toast";
import { invalidateStudentCreation } from "../../lib/queryInvalidation";

const studentsKey = ["students"];

export const useStudents = (filters) => {
  return useQuery({
    queryKey: [...studentsKey, filters],
    queryFn: () => getStudents(filters),
    staleTime: 3 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useStudent = (id) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [...studentsKey, id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
    initialData: () => {
      const cachedLists = queryClient.getQueriesData({ queryKey: studentsKey });
      for (const [, listPayload] of cachedLists) {
        const list = listPayload?.items || [];
        const cached = list.find((item) => item._id === id);
        if (cached) return cached;
      }
      return undefined;
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      invalidateStudentCreation(queryClient);
      showSuccess("Student created");
    },
    onError: (error) => {
      showError(error?.response?.data?.message || "Failed to create student");
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateStudent(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: studentsKey });
      const previous = queryClient.getQueriesData({ queryKey: studentsKey });

      previous.forEach(([key, value]) => {
        if (!value?.items) return;
        queryClient.setQueryData(key, {
          ...value,
          items: value.items.map((item) =>
            item._id === id
              ? {
                  ...item,
                  ...data.student,
                  userId: { ...item.userId, ...data.user },
                }
              : item,
          ),
        });
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous?.forEach(([key, oldValue]) => queryClient.setQueryData(key, oldValue));
      showError("Could not update student. Rolled back changes.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: studentsKey });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: studentsKey });
      const previous = queryClient.getQueriesData({ queryKey: studentsKey });
      previous.forEach(([key, value]) => {
        if (!value?.items) return;
        queryClient.setQueryData(key, {
          ...value,
          items: value.items.filter((item) => item._id !== id),
        });
      });
      return { previous };
    },
    onError: (_error, _id, context) => {
      context?.previous?.forEach(([key, oldValue]) => queryClient.setQueryData(key, oldValue));
      showError("Delete failed. Restored previous data.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKey });
      showSuccess("Student deleted");
    },
  });
};
