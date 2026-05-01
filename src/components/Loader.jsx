import PageSkeleton from "./common/PageSkeleton";

const resolveVariant = (text = "") => {
  const label = String(text).toLowerCase();
  if (label.includes("dashboard") || label.includes("homepage") || label.includes("command center")) {
    return "dashboard";
  }
  if (label.includes("profile")) return "profile";
  if (label.includes("form")) return "form";
  return "table";
};

const Loader = ({ text = "Loading...", variant }) => (
  <div className="min-h-[200px]">
    <PageSkeleton variant={variant || resolveVariant(text)} />
  </div>
);

export default Loader;
