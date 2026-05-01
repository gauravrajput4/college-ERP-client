import React from "react";

const isChunkLoadError = (error) => {
  if (!error) return false;
  const message = String(error.message || "");
  return (
    error.name === "ChunkLoadError" ||
    message.includes("Loading chunk") ||
    message.includes("dynamically imported module")
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (window?.Sentry?.captureException) {
      window.Sentry.captureException(error, {
        tags: { scope: "lazy-chunk-load" },
        extra: { componentStack: info?.componentStack },
      });
    } else {
      // eslint-disable-next-line no-console
      console.error("Chunk load failure:", error);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const chunkError = isChunkLoadError(this.state.error);

    return (
      <div className="mx-auto my-10 max-w-xl rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-card">
        <h2 className="font-heading text-2xl text-primary">
          {chunkError ? "Failed to load page. Check your connection." : "Something went wrong."}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {chunkError
            ? "A page chunk could not be downloaded. You can retry now."
            : "Unexpected UI error occurred while rendering this view."}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/")}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Reload Home
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

