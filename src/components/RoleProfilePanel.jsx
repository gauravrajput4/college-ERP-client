import { useState } from "react";
import FileUpload from "./FileUpload";
import { changePassword, updateProfilePhoto } from "../api/auth.api";
import { showError, showSuccess } from "./Toast";
import useAuth from "../hooks/useAuth";
import OptimizedImage from "./common/OptimizedImage";
import { getAvatarUrl } from "../utils/cloudinaryUrl";

const resolveProfilePhoto = (photo) => {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;
  try {
    return getAvatarUrl(photo, 160);
  } catch {
    return "";
  }
};

const RoleProfilePanel = ({ roleLabel }) => {
  const { user, loadUser } = useAuth();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePhotoSubmit = async (event) => {
    event.preventDefault();
    if (!photoFile) {
      showError("Please select a photo");
      return;
    }
    try {
      setPhotoLoading(true);
      const formData = new FormData();
      formData.append("photo", photoFile);
      await updateProfilePhoto(formData);
      await loadUser();
      setPhotoFile(null);
      showSuccess("Profile photo updated");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to update photo");
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showError("All password fields are required");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError("New password and confirm password do not match");
      return;
    }
    try {
      setPasswordLoading(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showSuccess("Password changed successfully");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-amber-600">{roleLabel} Settings</p>
        <h1 className="mt-1 font-heading text-3xl text-primary">My Profile</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-5 shadow-card">
          <h2 className="text-xl font-semibold text-primary">Profile Photo</h2>
          <div className="mt-4 flex items-center gap-4">
            {user?.photo ? (
              <OptimizedImage
                src={resolveProfilePhoto(user.photo)}
                alt={user?.name || "Profile"}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full border"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border bg-slate-100 text-2xl">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="text-sm text-slate-600">
              <p className="font-semibold text-slate-800">{user?.name || "-"}</p>
              <p>{user?.email || "-"}</p>
            </div>
          </div>
          <form onSubmit={handlePhotoSubmit} className="mt-4 space-y-3">
            <FileUpload file={photoFile} onChange={setPhotoFile} accept="image/*" />
            <button
              type="submit"
              disabled={photoLoading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {photoLoading ? "Uploading..." : "Upload Photo"}
            </button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-card">
          <h2 className="text-xl font-semibold text-primary">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
            <input
              type="password"
              className="w-full rounded border px-3 py-2"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
              }
            />
            <input
              type="password"
              className="w-full rounded border px-3 py-2"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
              }
            />
            <input
              type="password"
              className="w-full rounded border px-3 py-2"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
              }
            />
            <button
              type="submit"
              disabled={passwordLoading}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
            >
              {passwordLoading ? "Saving..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default RoleProfilePanel;
