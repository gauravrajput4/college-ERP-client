import { ChevronDown, Download, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AdmitCardStatusBadge from "../../components/admitCard/AdmitCardStatusBadge";
import ExamSubjectScheduleTable from "../../components/admitCard/ExamSubjectScheduleTable";
import { EmptyGenericIllustration, EmptyState } from "../../components/empty";
import { useDownloadAdmitCard, useMyAdmitCards } from "../../hooks/queries/useExams";

const MyAdmitCardsPage = () => {
  const { data: admitCards = [], isLoading } = useMyAdmitCards();
  const downloadMutation = useDownloadAdmitCard();
  const [expandedId, setExpandedId] = useState("");

  if (!isLoading && !admitCards.length) {
    return <EmptyState illustration={<EmptyGenericIllustration />} title="No admit cards available" description="Your exam admit cards will appear here after exam publishing." />;
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Exam Documents</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">My Admit Cards</h1>
      </div>

      {admitCards.map((card) => {
        const isExpanded = expandedId === card._id;
        return (
          <article key={card._id} className="rounded-xl bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">{card.exam?.name}</h2>
                  <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {card.exam?.type === "external" ? "External" : "Internal"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {card.exam?.semester} | {card.exam?.academicYear}
                </p>
                <div className="mt-4">
                  <AdmitCardStatusBadge status={card.eligibilityStatus} />
                </div>
                {!card.isEligible ? <p className="mt-3 text-sm text-rose-600">{(card.ineligibilityReasons || []).join(", ") || "Eligibility criteria not met"}</p> : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {card.isEligible ? (
                  <button type="button" onClick={() => downloadMutation.mutate({ acId: card._id })} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                    <Download size={16} />
                    Download Admit Card
                  </button>
                ) : (
                  <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                    <Mail size={16} />
                    Contact Admin
                  </Link>
                )}

                <button type="button" onClick={() => setExpandedId(isExpanded ? "" : card._id)} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                  <ChevronDown size={16} className={isExpanded ? "rotate-180" : ""} />
                  Schedule
                </button>
              </div>
            </div>

            {isExpanded ? (
              <div className="mt-5">
                <ExamSubjectScheduleTable subjects={card.exam?.subjects || []} />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
};

export default MyAdmitCardsPage;
