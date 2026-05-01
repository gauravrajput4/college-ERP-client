import { UserPlus } from "lucide-react";
import EmptyState from "../EmptyState";
import EmptyStudentsIllustration from "../illustrations/EmptyStudentsIllustration";

const EmptyStudentsList = ({ userRole, onAddStudent, onImport }) => {
  if (userRole === "Admin") {
    return (
      <EmptyState
        illustration={<EmptyStudentsIllustration />}
        title="No students enrolled yet"
        description="Add your first student or import a batch from CSV to get started."
        action={{ label: "Add First Student", onClick: onAddStudent, icon: <UserPlus size={16} /> }}
        secondaryAction={{ label: "Import from CSV", onClick: onImport }}
      />
    );
  }

  return (
    <EmptyState
      illustration={<EmptyStudentsIllustration />}
      title="No students found"
      description="No students are assigned to your classes yet. Contact the admin if this seems incorrect."
    />
  );
};

export default EmptyStudentsList;
