import { useMemo, useState } from "react";
import {
  createFee,
  getCourseFees,
  getFees,
  getPaymentReconciliation,
  getStudents,
  recordPayment,
  upsertCourseFee,
} from "../../api/admin.api";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import { showError, showSuccess } from "../../components/Toast";

const FeeManagement = () => {
  const [filters, setFilters] = useState({ class: "", session: "", status: "" });
  const [tab, setTab] = useState("all");
  const [paymentModal, setPaymentModal] = useState({ open: false, feeId: null });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [courseFeeForm, setCourseFeeForm] = useState({
    className: "",
    session: "2026-27",
    academicFee: "",
    dueDate: "",
  });
  const [payment, setPayment] = useState({ amount: "", date: "", mode: "Cash", receiptNo: "" });
  const [feeForm, setFeeForm] = useState({
    studentId: "",
    session: "",
    dueDate: "",
    exam: "",
    sports: "",
    misc: "",
  });
  const [reconciliationFilters, setReconciliationFilters] = useState({
    provider: "",
    startDate: "",
    endDate: "",
    emailSent: "",
  });

  const feesState = useFetch(() => getFees(filters), [filters.class, filters.session, filters.status]);
  const studentsState = useFetch(() => getStudents({ page: 1, limit: 200 }), []);
  const courseFeesState = useFetch(() => getCourseFees({ session: filters.session }), [filters.session]);
  const reconciliationState = useFetch(
    () => getPaymentReconciliation(reconciliationFilters),
    [
      reconciliationFilters.provider,
      reconciliationFilters.startDate,
      reconciliationFilters.endDate,
      reconciliationFilters.emailSent,
    ],
  );

  const rows = useMemo(() => {
    const data = feesState.data || [];
    return tab === "defaulters" ? data.filter((row) => row.status !== "Paid") : data;
  }, [feesState.data, tab]);

  const availableStudents = useMemo(() => {
    const feeStudentIds = new Set((feesState.data || []).map((item) => item.studentId?._id).filter(Boolean));
    return (studentsState.data || []).filter((student) => feeStudentIds.has(student._id));
  }, [feesState.data, studentsState.data]);

  const summary = useMemo(() => {
    const data = feesState.data || [];
    return data.reduce(
      (acc, item) => {
        acc.total += item.totalFee || 0;
        acc.paid += item.paidAmount || 0;
        acc.pending += Math.max((item.totalFee || 0) - (item.paidAmount || 0), 0);
        if (item.status !== "Paid") acc.defaulters += 1;
        return acc;
      },
      { total: 0, paid: 0, pending: 0, defaulters: 0 },
    );
  }, [feesState.data]);

  const openPaymentModal = (id) => {
    setPayment({ amount: "", date: "", mode: "Cash", receiptNo: "" });
    setPaymentModal({ open: true, feeId: id });
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!payment.amount || !payment.date || !payment.receiptNo) {
      showError("Amount, date and receipt no are required");
      return;
    }
    try {
      await recordPayment(paymentModal.feeId, {
        amount: Number(payment.amount),
        date: payment.date,
        mode: payment.mode,
        receiptNo: payment.receiptNo,
      });
      showSuccess("Payment recorded");
      setPaymentModal({ open: false, feeId: null });
      await feesState.execute(filters);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to record payment");
    }
  };

  const openCreateModal = () => {
    setFeeForm({
      studentId: "",
      session: "",
      dueDate: "",
      exam: "",
      sports: "",
      misc: "",
    });
    setCreateModalOpen(true);
  };

  const submitCourseFee = async (event) => {
    event.preventDefault();

    if (!courseFeeForm.className || !courseFeeForm.session || !courseFeeForm.dueDate) {
      showError("Class, session and due date are required");
      return;
    }

    try {
      await upsertCourseFee({
        className: courseFeeForm.className.trim(),
        session: courseFeeForm.session.trim(),
        academicFee: Number(courseFeeForm.academicFee || 0),
        dueDate: courseFeeForm.dueDate,
      });
      showSuccess("Academic fee master saved");
      setCourseFeeForm((prev) => ({ ...prev, className: "", academicFee: "", dueDate: "" }));
      await courseFeesState.execute();
      await feesState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to save academic fee master");
    }
  };

  const submitCreateFee = async (event) => {
    event.preventDefault();

    if (!feeForm.studentId || !feeForm.session || !feeForm.dueDate) {
      showError("Student, session, and due date are required");
      return;
    }

    try {
      await createFee({
        studentId: feeForm.studentId,
        session: feeForm.session.trim(),
        dueDate: feeForm.dueDate,
        feeStructure: {
          exam: Number(feeForm.exam || 0),
          sports: Number(feeForm.sports || 0),
          misc: Number(feeForm.misc || 0),
        },
      });
      showSuccess("Extra fee saved successfully");
      setCreateModalOpen(false);
      await feesState.execute();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to create fee record");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-600">Institution Finance</p>
          <h1 className="mt-1 font-heading text-3xl text-primary">Fee Management</h1>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
        >
          Add Extra Fee
        </button>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl bg-white p-5 shadow-card">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Academic Fee Master</p>
            <h2 className="mt-1 text-xl font-semibold text-primary">Set class/course fee once for each session</h2>
          </div>

          <form onSubmit={submitCourseFee} className="grid gap-3 md:grid-cols-4">
            <input
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              placeholder="Class / Course"
              value={courseFeeForm.className}
              onChange={(e) => setCourseFeeForm((prev) => ({ ...prev, className: e.target.value }))}
            />
            <input
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              placeholder="Session"
              value={courseFeeForm.session}
              onChange={(e) => setCourseFeeForm((prev) => ({ ...prev, session: e.target.value }))}
            />
            <input
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              type="number"
              min={0}
              placeholder="Academic Fee"
              value={courseFeeForm.academicFee}
              onChange={(e) => setCourseFeeForm((prev) => ({ ...prev, academicFee: e.target.value }))}
            />
            <input
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              type="date"
              value={courseFeeForm.dueDate}
              onChange={(e) => setCourseFeeForm((prev) => ({ ...prev, dueDate: e.target.value }))}
            />
            <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white md:col-span-4">
              Save Academic Fee
            </button>
          </form>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">How It Works</p>
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            <p>Admin saves academic fee once for a class and session.</p>
            <p>When a student is added in that class, academic fee is assigned automatically.</p>
            <p>Extra fee entry is now only for exam, sports, and other charges.</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-primary">Saved Academic Fee Master</h2>
          {courseFeesState.loading ? <div className="h-5 w-24 rounded-md bg-slate-200/70 skeleton-shimmer" aria-hidden="true" /> : null}
        </div>
        <Table
          data={courseFeesState.data || []}
          columns={[
            { key: "className", title: "Class / Course" },
            { key: "session", title: "Session" },
            { key: "academicFee", title: "Academic Fee", render: (row) => `₹${row.academicFee || 0}` },
            { key: "dueDate", title: "Due Date", render: (row) => new Date(row.dueDate).toLocaleDateString() },
          ]}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-widest text-slate-500">Total Collected Scope</p>
          <p className="mt-2 text-3xl font-bold text-primary">₹{summary.total}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-widest text-slate-500">Paid</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">₹{summary.paid}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-widest text-slate-500">Pending Dues</p>
          <p className="mt-2 text-3xl font-bold text-rose-600">₹{summary.pending}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-widest text-slate-500">Defaulters</p>
          <p className="mt-2 text-3xl font-bold text-primary">{summary.defaulters}</p>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-6">
          <input
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
            placeholder="Class"
            value={filters.class}
            onChange={(e) => setFilters((prev) => ({ ...prev, class: e.target.value }))}
          />
          <input
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
            placeholder="Session"
            value={filters.session}
            onChange={(e) => setFilters((prev) => ({ ...prev, session: e.target.value }))}
          />
          <select
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
          </select>

          <button
            onClick={() => setTab("all")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === "all" ? "bg-primary text-white" : "border border-slate-300 text-slate-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTab("defaulters")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === "defaulters" ? "bg-primary text-white" : "border border-slate-300 text-slate-700"
            }`}
          >
            Defaulters
          </button>
          <button
            onClick={() => setTab("reconciliation")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === "reconciliation" ? "bg-primary text-white" : "border border-slate-300 text-slate-700"
            }`}
          >
            Reconciliation
          </button>
        </div>
      </section>

      {tab !== "reconciliation" && feesState.loading ? (
        <Loader text="Loading fee records..." />
      ) : tab !== "reconciliation" ? (
        <Table
          data={rows}
          columns={[
            { key: "student", title: "Student", render: (row) => row.studentId?.userId?.name || "-" },
            { key: "class", title: "Class", render: (row) => `${row.studentId?.class || "-"}-${row.studentId?.section || "-"}` },
            { key: "academicFee", title: "Academic", render: (row) => `₹${row.feeStructure?.tuition || 0}` },
            {
              key: "extraFee",
              title: "Extra Fees",
              render: (row) =>
                `₹${Number(row.feeStructure?.exam || 0) + Number(row.feeStructure?.sports || 0) + Number(row.feeStructure?.misc || 0)}`,
            },
            { key: "totalFee", title: "Total", render: (row) => `₹${row.totalFee || 0}` },
            { key: "paidAmount", title: "Paid", render: (row) => `₹${row.paidAmount || 0}` },
            {
              key: "pending",
              title: "Pending",
              render: (row) => `₹${Math.max((row.totalFee || 0) - (row.paidAmount || 0), 0)}`,
            },
            { key: "dueDate", title: "Due Date", render: (row) => new Date(row.dueDate).toLocaleDateString() },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    row.status === "Paid"
                      ? "bg-emerald-100 text-emerald-700"
                      : row.status === "Partial"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {row.status}
                </span>
              ),
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <button
                  onClick={() => openPaymentModal(row._id)}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold"
                >
                  Record Payment
                </button>
              ),
            },
          ]}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-xl bg-white p-4 shadow-card md:grid-cols-4">
            <select
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              value={reconciliationFilters.provider}
              onChange={(event) =>
                setReconciliationFilters((prev) => ({
                  ...prev,
                  provider: event.target.value,
                }))
              }
            >
              <option value="">All Providers</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Stripe">Stripe</option>
              <option value="Manual">Manual</option>
            </select>
            <input
              type="date"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              value={reconciliationFilters.startDate}
              onChange={(event) =>
                setReconciliationFilters((prev) => ({
                  ...prev,
                  startDate: event.target.value,
                }))
              }
            />
            <input
              type="date"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              value={reconciliationFilters.endDate}
              onChange={(event) =>
                setReconciliationFilters((prev) => ({
                  ...prev,
                  endDate: event.target.value,
                }))
              }
            />
            <select
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              value={reconciliationFilters.emailSent}
              onChange={(event) =>
                setReconciliationFilters((prev) => ({
                  ...prev,
                  emailSent: event.target.value,
                }))
              }
            >
              <option value="">All Receipt Emails</option>
              <option value="yes">Sent</option>
              <option value="no">Pending</option>
            </select>
          </div>

          {reconciliationState.loading ? (
            <Loader text="Loading reconciliation..." />
          ) : (
            <Table
              data={reconciliationState.data || []}
              columns={[
                { key: "studentName", title: "Student" },
                { key: "rollNo", title: "Roll No" },
                {
                  key: "classSection",
                  title: "Class",
                  render: (row) => `${row.class}/${row.section}`,
                },
                { key: "amount", title: "Amount", render: (row) => `₹${row.amount}` },
                { key: "provider", title: "Provider" },
                { key: "receiptNo", title: "Receipt" },
                {
                  key: "gatewayPaymentId",
                  title: "Gateway Txn ID",
                },
                { key: "transactionStatus", title: "Txn Status" },
                {
                  key: "receiptEmailSent",
                  title: "Receipt Email",
                  render: (row) => (row.receiptEmailSent ? "Sent" : "Pending"),
                },
                {
                  key: "date",
                  title: "Date",
                  render: (row) => new Date(row.date).toLocaleString(),
                },
              ]}
            />
          )}
        </div>
      )}

      <Modal isOpen={paymentModal.open} onClose={() => setPaymentModal({ open: false, feeId: null })} title="Record Payment">
        <form onSubmit={submitPayment} className="space-y-3">
          <input
            className="w-full rounded border"
            placeholder="Amount"
            value={payment.amount}
            onChange={(e) => setPayment((prev) => ({ ...prev, amount: e.target.value }))}
          />
          <input
            className="w-full rounded border"
            type="date"
            value={payment.date}
            onChange={(e) => setPayment((prev) => ({ ...prev, date: e.target.value }))}
          />
          <select
            className="w-full rounded border"
            value={payment.mode}
            onChange={(e) => setPayment((prev) => ({ ...prev, mode: e.target.value }))}
          >
            <option>Cash</option>
            <option>Online</option>
            <option>Cheque</option>
          </select>
          <input
            className="w-full rounded border"
            placeholder="Receipt No"
            value={payment.receiptNo}
            onChange={(e) => setPayment((prev) => ({ ...prev, receiptNo: e.target.value }))}
          />
          <button className="rounded bg-primary px-4 py-2 text-white">Submit</button>
        </form>
      </Modal>

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add Extra Fee">
        <form onSubmit={submitCreateFee} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Student</label>
            <select
              className="w-full rounded border"
              value={feeForm.studentId}
              onChange={(e) => setFeeForm((prev) => ({ ...prev, studentId: e.target.value }))}
              required
            >
              <option value="">Select Student</option>
              {availableStudents.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.userId?.name || "-"} ({student.rollNo || "-"}) - {student.class || "-"}
                  {student.section ? `-${student.section}` : ""}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">Only students with existing fee records are listed here.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Session</label>
              <input
                className="w-full rounded border"
                placeholder="2026-27"
                value={feeForm.session}
                onChange={(e) => setFeeForm((prev) => ({ ...prev, session: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Due Date</label>
              <input
                className="w-full rounded border"
                type="date"
                value={feeForm.dueDate}
                onChange={(e) => setFeeForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Academic fee is locked from the class/course fee master and is assigned automatically during student creation.
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Exam</label>
              <input
                className="w-full rounded border"
                type="number"
                min={0}
                value={feeForm.exam}
                onChange={(e) => setFeeForm((prev) => ({ ...prev, exam: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Sports</label>
              <input
                className="w-full rounded border"
                type="number"
                min={0}
                value={feeForm.sports}
                onChange={(e) => setFeeForm((prev) => ({ ...prev, sports: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Misc</label>
              <input
                className="w-full rounded border"
                type="number"
                min={0}
                value={feeForm.misc}
                onChange={(e) => setFeeForm((prev) => ({ ...prev, misc: e.target.value }))}
              />
            </div>
          </div>
          <button className="rounded bg-primary px-4 py-2 text-white" type="submit">
            Save Extra Fee
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FeeManagement;
