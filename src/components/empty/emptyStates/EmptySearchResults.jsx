import EmptyState from "../EmptyState";
import EmptyGenericIllustration from "../illustrations/EmptyGenericIllustration";

const EmptySearchResults = ({ query, onClear }) => {
  return (
    <EmptyState
      illustration={<EmptyGenericIllustration />}
      title={`No results for "${query}"`}
      description="Try different keywords or check for typos."
      action={{ label: "Clear Search", onClick: onClear }}
      size="sm"
    />
  );
};

export default EmptySearchResults;
