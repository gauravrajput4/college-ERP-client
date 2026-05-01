import Modal from "../Modal";

const GenerateAdmitCardsModal = ({ isOpen, onClose, exam, preview, onConfirm, isLoading, confirmed, setConfirmed }) => {
  const eligibleCount = preview?.summary?.eligibleCount ?? 0;
  const totalStudents = preview?.totalStudents ?? 0;
  const ratio = totalStudents ? eligibleCount / totalStudents : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Admit Cards">
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">{exam?.name}</p>
          <p className="mt-1 text-sm text-slate-600">
            Attendance: {exam?.eligibilityCriteria?.minAttendancePercent}% | Fees: {exam?.eligibilityCriteria?.minFeesPaidPercent}%
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Eligible: <span className="font-semibold text-emerald-700">{eligibleCount}</span> / {totalStudents}
          </p>
        </div>

        {ratio < 0.3 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Warning: current criteria are very strict. Fewer than 30% of students are eligible.
          </div>
        ) : null}

        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600" />
          <span>I confirm the criteria are correct.</span>
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Cancel
          </button>
          <button
            type="button"
            disabled={!confirmed || isLoading}
            onClick={onConfirm}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {isLoading ? "Generating..." : "Generate Now"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateAdmitCardsModal;
