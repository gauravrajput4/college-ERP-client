import { Download, Eye, RefreshCcw, Search, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import AdmitCardStatusBadge from "../../components/admitCard/AdmitCardStatusBadge";
import EligibilityPreviewTable from "../../components/admitCard/EligibilityPreviewTable";
import GenerateAdmitCardsModal from "../../components/admitCard/GenerateAdmitCardsModal";
import { EmptyGenericIllustration, EmptyState } from "../../components/empty";
import {
  useDownloadAdmitCard,
  useExam,
  useExamAdmitCards,
  useGenerateAdmitCards,
  useEligibilityPreview,
  useReissueAdmitCard,
  useRevokeAdmitCard,
} from "../../hooks/queries/useExams";

const AdmitCardManagerPage = () => {
  const { examId } = useParams();
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [search, setSearch] = useState("");
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeReason, setRevokeReason] = useState("");
  const { data: exam } = useExam(examId);
  const { data: preview } = useEligibilityPreview(examId, exam?.eligibilityCriteria);
  const { data: admitCards = [] } = useExamAdmitCards(examId);
  const generateMutation = useGenerateAdmitCards();
  const revokeMutation = useRevokeAdmitCard();
  const reissueMutation = useReissueAdmitCard();
  const downloadMutation = useDownloadAdmitCard();

  const filteredAdmitCards = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return admitCards;
    return admitCards.filter((card) =>
      [card.studentName, card.rollNumber, card.admitCardNumber].some((value) =>
        String(value || "").toLowerCase().includes(normalized),
      ),
    );
  }, [admitCards, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Admit Card Control</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{exam?.name || "Exam Admit Cards"}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {exam?.type === "external" ? "External" : "Internal"} exam | Attendance {exam?.eligibilityCriteria?.minAttendancePercent}% | Fees {exam?.eligibilityCriteria?.minFeesPaidPercent}%
          </p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setIsGenerateOpen(true)} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
            Generate Admit Cards
          </button>
          <button type="button" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Download All as ZIP
          </button>
        </div>
      </div>

      {preview ? <EligibilityPreviewTable preview={preview} /> : null}

      <section className="rounded-xl bg-white p-6 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, roll number, admit card" className="w-full rounded-md border border-slate-200 py-2.5 pl-9 pr-3 text-sm" />
          </div>
        </div>

        {!filteredAdmitCards.length ? (
          <EmptyState illustration={<EmptyGenericIllustration />} title="No admit cards generated yet" description="Generate admit cards after reviewing the eligibility preview." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["Student", "Roll No", "Status", "Attend%", "Fees%", "Admit Card No", "Actions"].map((label) => (
                    <th key={label} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAdmitCards.map((card) => (
                  <tr key={card._id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{card.studentName}</td>
                    <td className="px-4 py-3">{card.rollNumber}</td>
                    <td className="px-4 py-3">
                      <AdmitCardStatusBadge status={card.eligibilityStatus} />
                    </td>
                    <td className="px-4 py-3">{card.attendancePercent}%</td>
                    <td className="px-4 py-3">{card.feesPaidPercent}%</td>
                    <td className="px-4 py-3 font-mono text-xs">{card.admitCardNumber || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => downloadMutation.mutate({ acId: card._id })} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                          <Download size={14} />
                          Download
                        </button>
                        <button type="button" onClick={() => setRevokeTarget(card)} className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">
                          <ShieldAlert size={14} />
                          Revoke
                        </button>
                        <button type="button" onClick={() => reissueMutation.mutate({ examId, acId: card._id })} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                          <RefreshCcw size={14} />
                          Reissue
                        </button>
                        <button type="button" onClick={() => downloadMutation.mutate({ acId: card._id })} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                          <Eye size={14} />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <GenerateAdmitCardsModal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        exam={exam}
        preview={preview}
        confirmed={confirmed}
        setConfirmed={setConfirmed}
        isLoading={generateMutation.isPending}
        onConfirm={async () => {
          await generateMutation.mutateAsync(examId);
          setIsGenerateOpen(false);
          setConfirmed(false);
        }}
      />

      <Modal isOpen={Boolean(revokeTarget)} onClose={() => setRevokeTarget(null)} title="Revoke Admit Card">
        <div className="space-y-4">
          <textarea value={revokeReason} onChange={(event) => setRevokeReason(event.target.value)} rows={4} className="w-full rounded-md border border-slate-200 px-3 py-2.5" placeholder="Reason for revocation" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setRevokeTarget(null)} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                await revokeMutation.mutateAsync({ examId, acId: revokeTarget._id, reason: revokeReason });
                setRevokeTarget(null);
                setRevokeReason("");
              }}
              className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Confirm Revoke
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdmitCardManagerPage;
