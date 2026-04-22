import { useEffect, useRef } from "react";

const DEFAULT_LOCK_MS = 1200;

const isPositiveNumber = (value) => Number.isFinite(value) && value > 0;

const getLockDuration = (button) => {
  const overrideMs = Number(button.dataset.lockMs);
  return isPositiveNumber(overrideMs) ? overrideMs : DEFAULT_LOCK_MS;
};

const isSkippedButton = (button) =>
  button.disabled ||
  button.dataset.noAutoLoading === "true" ||
  button.getAttribute("aria-busy") === "true";

const releaseLock = (button, lockTimersRef) => {
  button.dataset.clickLocked = "false";
  button.removeAttribute("data-global-loading");

  if (button.dataset.autoBusySet === "true") {
    button.removeAttribute("aria-busy");
    delete button.dataset.autoBusySet;
  }

  const timer = lockTimersRef.current.get(button);
  if (timer) {
    window.clearTimeout(timer);
    lockTimersRef.current.delete(button);
  }
};

const lockButton = (button, lockTimersRef) => {
  button.dataset.clickLocked = "true";
  button.dataset.globalLoading = "true";

  if (!button.hasAttribute("aria-busy")) {
    button.setAttribute("aria-busy", "true");
    button.dataset.autoBusySet = "true";
  }

  const timer = window.setTimeout(() => releaseLock(button, lockTimersRef), getLockDuration(button));
  lockTimersRef.current.set(button, timer);
};

const useGlobalButtonGuard = () => {
  const lockTimersRef = useRef(new Map());

  useEffect(() => {
    const handleClickCapture = (event) => {
      if (!(event.target instanceof Element)) return;

      const button = event.target.closest("button");
      if (!(button instanceof HTMLButtonElement)) return;

      // Form submit buttons are handled by submit listener to avoid blocking the first submit.
      if (button.type === "submit") return;
      if (isSkippedButton(button)) return;

      if (button.dataset.clickLocked === "true") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      lockButton(button, lockTimersRef);
    };

    const handleSubmitCapture = (event) => {
      if (!(event.target instanceof HTMLFormElement)) return;

      const submitter =
        event.submitter instanceof HTMLButtonElement
          ? event.submitter
          : event.target.querySelector('button[type="submit"]');

      if (!(submitter instanceof HTMLButtonElement)) return;
      if (isSkippedButton(submitter)) return;

      if (submitter.dataset.clickLocked === "true") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      lockButton(submitter, lockTimersRef);
    };

    document.addEventListener("click", handleClickCapture, true);
    document.addEventListener("submit", handleSubmitCapture, true);

    return () => {
      document.removeEventListener("click", handleClickCapture, true);
      document.removeEventListener("submit", handleSubmitCapture, true);

      lockTimersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      lockTimersRef.current.clear();
    };
  }, []);
};

export default useGlobalButtonGuard;
