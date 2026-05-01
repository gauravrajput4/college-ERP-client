import { useContext, useState } from "react";
import {
  createNotice,
  deleteNotice,
  getNotices,
  updateNotice,
} from "../../api/admin.api";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import ErrorState from "../../components/common/ErrorState";
import { showError, showSuccess } from "../../components/Toast";
import { EmptyState, EmptyGenericIllustration } from "../../components/empty";
import NoticeItem from "../../components/notices/NoticeItem";
import { NoticeBoardSkeleton, SkeletonWrapper } from "../../components/skeleton";
import useDeferredSkeleton from "../../hooks/useDeferredSkeleton";
import { AuthContext } from "../../context/AuthContext";

const defaultNotice = { title: "", content: "", targetAudience: "All", isActive: true };

const NoticeBoard = () => {
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);
  const noticesState = useFetch(getNotices, []);
  const showSkeleton = useDeferredSkeleton(noticesState.loading, 300);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultNotice);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultNotice);
    setModalOpen(true);
  };

  const openEdit = (notice) => {
    setEditing(notice);
    setForm({
      title: notice.title || "",
      content: notice.content || "",
      targetAudience: notice.targetAudience || "All",
      isActive: notice.isActive,
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      showError("Title and content are required");
      return;
    }
    try {
      if (editing) {
        await updateNotice(editing._id, form);
        showSuccess("Notice updated");
      } else {
        await createNotice(form);
        showSuccess("Notice created");
      }
      setModalOpen(false);
      await noticesState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Operation failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await deleteNotice(id);
      showSuccess("Notice deleted");
      await noticesState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">Notice Board</h1>
        <button onClick={openCreate} className="rounded bg-primary px-4 py-2 text-white">
          Add Notice
        </button>
      </div>

      {showSkeleton ? (
        <SkeletonWrapper loading>
          <NoticeBoardSkeleton />
        </SkeletonWrapper>
      ) : noticesState.error ? (
        <ErrorState error={noticesState.error} onRetry={noticesState.execute} onGoHome={() => navigate("/admin")} />
      ) : !(noticesState.data || []).length ? (
        <EmptyState
          illustration={<EmptyGenericIllustration />}
          title={role === "Admin" ? "No notices published" : "All clear — no notices"}
          description={
            role === "Admin"
              ? "Keep everyone informed. Post your first notice to students and faculty."
              : "No announcements right now. Check back later for updates from admin."
          }
          action={role === "Admin" ? { label: "Create Notice", onClick: openCreate } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {(noticesState.data || []).map((notice) => (
            <NoticeItem key={notice._id} notice={notice} onEdit={openEdit} onDelete={remove} />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Notice" : "Add Notice"}>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full rounded border" placeholder="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          <textarea className="w-full rounded border" rows={4} placeholder="Content" value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} />
          <select className="w-full rounded border" value={form.targetAudience} onChange={(e) => setForm((prev) => ({ ...prev, targetAudience: e.target.value }))}>
            <option>All</option>
            <option>Students</option>
            <option>Teachers</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
            Active
          </label>
          <button className="rounded bg-primary px-4 py-2 text-white">{editing ? "Update" : "Create"}</button>
        </form>

        <div className="mt-5 rounded border bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">Homepage Preview</p>
          <p className="mt-1 font-semibold text-primary">{form.title || "Notice title..."}</p>
          <p className="text-sm text-slate-700">{form.content || "Notice content..."}</p>
        </div>
      </Modal>
    </div>
  );
};

export default NoticeBoard;
