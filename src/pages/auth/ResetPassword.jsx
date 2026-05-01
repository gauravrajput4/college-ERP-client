import { useState } from "react";
import { resetPassword } from "../../api/auth";
import { showError, showSuccess } from "../../components/Toast";

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!token || !password) {
      showError("Reset token and new password are required.");
      return;
    }
    try {
      setLoading(true);
      await resetPassword(token, password);
      showSuccess("Password reset successful.");
    } catch (error) {
      showError(error?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl bg-white p-6 shadow-card">
      <h1 className="font-heading text-3xl text-primary">Reset Password</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Reset token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
        <input
          type="password"
          className="w-full rounded border px-3 py-2"
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

