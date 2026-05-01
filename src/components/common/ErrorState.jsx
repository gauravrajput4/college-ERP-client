import EmptyState from "../empty/EmptyState";
import EmptyGenericIllustration from "../empty/illustrations/EmptyGenericIllustration";

const getErrorDescription = (error) => {
  const status = error?.response?.status;
  if (status === 404) return "This content could not be found.";
  if (status === 403) return "You don't have permission to view this.";
  if (status >= 500) return "Server error. Please try again in a moment.";
  if (!status) return "Check your internet connection and try again.";
  return "Something went wrong while loading this content.";
};

const ErrorState = ({ error, onRetry, onGoHome }) => {
  return (
    <div className="space-y-3">
      <EmptyState
        illustration={<EmptyGenericIllustration />}
        title="Something went wrong"
        description={getErrorDescription(error)}
        action={{ label: "Try Again", onClick: onRetry }}
        secondaryAction={onGoHome ? { label: "Go to Dashboard", onClick: onGoHome } : undefined}
      />
      {import.meta.env.DEV ? (
        <details className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <summary className="cursor-pointer font-semibold">Debug error</summary>
          <pre className="mt-2 whitespace-pre-wrap">{String(error?.message || error || "Unknown error")}</pre>
        </details>
      ) : null}
    </div>
  );
};

export default ErrorState;
