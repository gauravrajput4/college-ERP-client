export const invalidateStudentCreation = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["students"] });
};

export const invalidateAttendanceMutation = (queryClient, studentId) => {
  queryClient.invalidateQueries({ queryKey: ["attendance"] });
  if (studentId) {
    queryClient.invalidateQueries({ queryKey: ["students", studentId, "attendance"] });
  }
};

export const invalidateMarksMutation = (queryClient, studentId) => {
  queryClient.invalidateQueries({ queryKey: ["marks"] });
  if (studentId) {
    queryClient.invalidateQueries({ queryKey: ["students", studentId, "marks"] });
  }
};

export const invalidateAdminScope = (queryClient, scopeKey) => {
  queryClient.invalidateQueries({ queryKey: ["admin", scopeKey] });
};

