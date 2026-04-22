import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../api/auth.api";
import { showError, showSuccess } from "../../components/Toast";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      showError("Email is required");
      return;
    }
    try {
      setLoading(true);
      await forgotPassword(email);
      showSuccess("OTP sent successfully");
      setStep(2);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!otp || !newPassword) {
      showError("OTP and new password are required");
      return;
    }
    try {
      setLoading(true);
      await resetPassword({ email, otp, newPassword });
      showSuccess("Password reset successful");
      setStep(3);
    } catch (error) {
      showError(error?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card">
        <h1 className="font-heading text-3xl text-primary">Forgot Password</h1>
        {step === 1 && (
          <div className="mt-4 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Registered email"
              className="w-full rounded-lg border"
            />
            <button disabled={loading} onClick={sendOtp} className="w-full rounded-lg bg-primary px-4 py-2 text-white">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="mt-4 space-y-3">
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full rounded-lg border" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-lg border"
            />
            <button disabled={loading} onClick={handleReset} className="w-full rounded-lg bg-accent px-4 py-2 font-semibold text-slate-900">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
            Password updated successfully. You can login now.
          </div>
        )}
        <Link className="mt-5 inline-block text-sm font-semibold text-primary" to="/login">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
