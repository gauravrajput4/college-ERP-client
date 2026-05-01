import { memo } from "react";

const NoticeItem = ({ notice, onEdit, onDelete }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-primary">{notice.title}</h3>
          <p className="text-sm text-slate-600">{notice.content}</p>
          <p className="text-xs text-slate-500">
            Audience: {notice.targetAudience} | {notice.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(notice)} className="rounded border px-3 py-1 text-sm">
            Edit
          </button>
          <button onClick={() => onDelete(notice._id)} className="rounded border px-3 py-1 text-sm text-rose-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(
  NoticeItem,
  (prevProps, nextProps) =>
    prevProps.notice._id === nextProps.notice._id &&
    prevProps.notice.updatedAt === nextProps.notice.updatedAt,
);

