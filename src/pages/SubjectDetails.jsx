import { useEffect, useMemo, useState } from "react";
import { getAssignmentsBySubject, getSubjectList } from "../api/assignment.api";
import { getMaterials as getTeacherMaterials } from "../api/teacher.api";
import { getMaterials as getStudentMaterials } from "../api/student.api";
import AssignmentList from "../components/AssignmentList";
import Loader from "../components/Loader";
import UploadAssignment from "../components/UploadAssignment";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";

const tabs = [
  { key: "e-content", label: "E-Content" },
  { key: "assignments", label: "Assignments" },
  { key: "syllabus-theory", label: "Syllabus Theory" },
  { key: "syllabus-lab", label: "Syllabus Lab" },
];

const SubjectDetails = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("assignments");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const subjectsState = useFetch(getSubjectList, []);

  const subjects = subjectsState.data || [];

  useEffect(() => {
    if (!subjects.length) return;
    if (!selectedSubjectId) setSelectedSubjectId(subjects[0].subjectId);
  }, [selectedSubjectId, subjects]);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.subjectId === selectedSubjectId) || null,
    [selectedSubjectId, subjects],
  );

  const assignmentsState = useFetch(
    () => (selectedSubjectId ? getAssignmentsBySubject(selectedSubjectId) : Promise.resolve({ data: [] })),
    [selectedSubjectId],
  );

  const materialsState = useFetch(
    () => {
      if (!selectedSubject) return Promise.resolve({ data: [] });
      if (role === "teacher") return getTeacherMaterials({ page: 1, limit: 100 });
      return getStudentMaterials({ page: 1, limit: 100, subject: selectedSubject.subjectName });
    },
    [role, selectedSubjectId],
  );

  const filteredMaterials = useMemo(() => {
    const materials = materialsState.data || [];
    if (!selectedSubject) return [];
    if (role === "teacher") {
      return materials.filter((item) => item.subject === selectedSubject.subjectName && item.class === selectedSubject.className);
    }
    return materials;
  }, [materialsState.data, role, selectedSubject]);

  const refreshAssignments = async () => {
    await assignmentsState.execute();
  };

  if (subjectsState.loading) return <Loader text="Loading subjects..." />;

  return (
    <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
      <aside className="rounded-xl bg-white p-4 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Subjects</p>
        <div className="mt-3 space-y-2">
          {subjects.map((subject) => (
            <button
              key={subject.subjectId}
              type="button"
              onClick={() => setSelectedSubjectId(subject.subjectId)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                selectedSubjectId === subject.subjectId ? "bg-primary text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              <p>{subject.subjectName}</p>
              <p className={`text-xs ${selectedSubjectId === subject.subjectId ? "text-indigo-100" : "text-slate-500"}`}>
                Class {subject.className}
              </p>
            </button>
          ))}
          {!subjects.length ? <p className="text-sm text-slate-500">No subjects available.</p> : null}
        </div>
      </aside>

      <section className="space-y-4 rounded-xl bg-white p-4 shadow-card">
        <header className="border-b border-slate-200 pb-3">
          <h1 className="font-heading text-2xl text-primary">
            {selectedSubject ? `${selectedSubject.subjectName} · Class ${selectedSubject.className}` : "Subject Details"}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  activeTab === tab.key ? "bg-primary text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {activeTab === "e-content" ? (
          <div className="space-y-3">
            {materialsState.loading ? <Loader text="Loading e-content..." /> : null}
            {!materialsState.loading &&
              filteredMaterials.map((item) => (
                <article key={item._id} className="rounded-lg border border-slate-200 p-3">
                  <h3 className="font-semibold text-primary">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description || "No description"}</p>
                  <div className="mt-2 flex gap-2">
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="rounded border px-3 py-1.5 text-sm">
                      View
                    </a>
                    <a href={item.fileUrl} download className="rounded bg-primary px-3 py-1.5 text-sm text-white">
                      Download
                    </a>
                  </div>
                </article>
              ))}
            {!materialsState.loading && !filteredMaterials.length ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                No e-content available for this subject.
              </p>
            ) : null}
          </div>
        ) : null}

        {activeTab === "assignments" ? (
          <div className="space-y-4">
            {role === "teacher" ? <UploadAssignment subject={selectedSubject} onCreated={refreshAssignments} /> : null}
            {assignmentsState.loading ? (
              <Loader text="Loading assignments..." />
            ) : (
              <AssignmentList role={role} assignments={assignmentsState.data || []} onChanged={refreshAssignments} />
            )}
          </div>
        ) : null}

        {activeTab === "syllabus-theory" ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600">
            <p className="font-semibold text-primary">Syllabus Theory</p>
            <p className="mt-2">Theory syllabus can be configured by academic admin for this subject.</p>
          </div>
        ) : null}

        {activeTab === "syllabus-lab" ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600">
            <p className="font-semibold text-primary">Syllabus Lab</p>
            <p className="mt-2">Lab syllabus and practical schedule will appear here when published.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default SubjectDetails;
