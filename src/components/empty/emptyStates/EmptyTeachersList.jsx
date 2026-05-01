import { UserPlus2 } from "lucide-react";
import EmptyState from "../EmptyState";
import EmptyGenericIllustration from "../illustrations/EmptyGenericIllustration";

const EmptyTeachersList = ({ onAddTeacher }) => {
  return (
    <EmptyState
      illustration={<EmptyGenericIllustration />}
      title="No teachers added yet"
      description="Add your first teacher to start managing staff details and assignments."
      action={{ label: "Add Teacher", onClick: onAddTeacher, icon: <UserPlus2 size={16} /> }}
    />
  );
};

export default EmptyTeachersList;

