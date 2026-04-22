import { useMemo, useState } from "react";
import { getMaterials } from "../../api/student.api";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";

const StudyMaterial = () => {
  const [subject, setSubject] = useState("");
  const [search, setSearch] = useState("");
  const materialsState = useFetch(() => getMaterials({ subject, search, page: 1, limit: 50 }), [subject, search]);

  const items = useMemo(() => materialsState.data || [], [materialsState.data]);
  const subjects = useMemo(() => [...new Set(items.map((item) => item.subject).filter(Boolean))], [items]);

  const fileTypeTone = (fileType) => {
    if (fileType === "PDF") return "bg-rose-100 text-rose-700";
    if (fileType === "PPT" || fileType === "PPTX") return "bg-amber-100 text-amber-700";
    if (fileType === "Video") return "bg-indigo-100 text-indigo-700";
    return "bg-emerald-100 text-emerald-700";
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-amber-600">Scholar's Gateway</span>
          <h1 className="mt-1 font-heading text-3xl text-primary">Study Material Library</h1>
          <p className="mt-1 text-sm text-slate-600">
            Access notes, videos, and learning resources curated by your teachers.
          </p>
        </div>
        <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-card">
          Total Resources: <span className="font-bold text-primary">{items.length}</span>
        </div>
      </div>

      <section className="rounded-xl bg-white p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, topic, or keyword..."
          />
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSubject("");
            }}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700"
          >
            Reset
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setSubject("")}
            className={`rounded-full px-3 py-1 text-sm ${subject === "" ? "bg-primary text-white" : "bg-slate-100"}`}
          >
            All Subjects
          </button>
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSubject(subj)}
              className={`rounded-full px-3 py-1 text-sm ${subject === subj ? "bg-primary text-white" : "bg-slate-100"}`}
            >
              {subj}
            </button>
          ))}
        </div>
      </section>

      {materialsState.loading ? (
        <Loader text="Loading materials..." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item._id} className="flex h-full flex-col rounded-xl bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${fileTypeTone(item.fileType)}`}>
                  {item.fileType || "Resource"}
                </span>
                <span className="text-xs text-slate-500">{new Date(item.uploadedAt).toLocaleDateString()}</span>
              </div>

              <h3 className="mt-3 line-clamp-2 text-lg font-bold text-primary">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {item.subject || "General"}
                {item.chapter ? ` · ${item.chapter}` : ""}
              </p>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-500">{item.description || "No description"}</p>

              <div className="mt-4 flex gap-2">
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Preview
                </a>
                <a href={item.fileUrl} download className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                  Download
                </a>
              </div>
            </article>
          ))}
          {!items.length && (
            <div className="col-span-full rounded-xl bg-white p-8 text-center text-slate-500 shadow-card">
              No study material found for the selected filters.
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default StudyMaterial;
