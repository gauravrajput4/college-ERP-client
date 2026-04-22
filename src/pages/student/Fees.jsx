import { useEffect, useMemo, useState } from "react";
import { createPayNowOrder, downloadReceipt, getFees } from "../../api/student.api";
import useFetch from "../../hooks/useFetch";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import { showError, showSuccess } from "../../components/Toast";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Fees = () => {
  const feesState = useFetch(getFees, []);
  const data = feesState.data;
  const [payAmount, setPayAmount] = useState("");
  const [paying, setPaying] = useState(false);

  const countdown = useMemo(() => {
    if (!data?.dueDate) return "-";
    const ms = new Date(data.dueDate).getTime() - Date.now();
    const days = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    return `${days} days`;
  }, [data]);

  useEffect(() => {
    if (data?.pendingAmount && Number(data.pendingAmount) > 0) {
      setPayAmount(String(data.pendingAmount));
    }
  }, [data?.pendingAmount]);

  useEffect(() => {
    const paymentState = new URLSearchParams(window.location.search).get("payment");
    if (paymentState === "success") {
      showSuccess("Payment completed. Transaction will reflect once webhook confirms.");
      feesState.execute();
    }
    if (paymentState === "cancelled") {
      showError("Payment was cancelled.");
    }
  }, []);

  const handlePayNow = async () => {
    const pendingAmount = Number(data?.pendingAmount || 0);
    const amount = Number(payAmount);
    if (!amount || amount <= 0) {
      showError("Enter a valid amount");
      return;
    }
    if (amount > pendingAmount) {
      showError("Amount cannot exceed pending fees");
      return;
    }

    try {
      setPaying(true);
      const response = await createPayNowOrder({ amount });
      const order = response.data;

      if (order.provider === "razorpay") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          showError("Unable to load Razorpay checkout");
          return;
        }

        const razorpay = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: order.name,
          description: order.description,
          order_id: order.orderId,
          prefill: order.prefill,
          theme: { color: "#1a237e" },
          handler: async () => {
            showSuccess("Payment received. Waiting for gateway confirmation.");
            setTimeout(() => {
              feesState.execute();
            }, 4000);
          },
        });
        razorpay.open();
        return;
      }

      if (order.provider === "stripe") {
        if (!order.checkoutUrl) {
          showError("Stripe checkout URL missing");
          return;
        }
        window.location.href = order.checkoutUrl;
        return;
      }

      showError("Unsupported payment provider response");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to start payment");
    } finally {
      setPaying(false);
    }
  };

  const handleDownloadReceipt = async (receiptNo) => {
    try {
      const response = await downloadReceipt(receiptNo);
      const blobUrl = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const disposition = response.headers?.["content-disposition"] || "";
      const match = disposition.match(/filename="([^"]+)"/);
      const fileName = match?.[1] || `${receiptNo}.pdf`;
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      showError(error?.response?.data?.message || "Unable to download receipt");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Fees</h1>
      {feesState.loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-card">
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold text-primary">{data?.totalFee || 0}</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-card">
              <p className="text-sm text-slate-500">Paid</p>
              <p className="text-2xl font-bold text-emerald-600">{data?.paidAmount || 0}</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-card">
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-rose-600">{data?.pendingAmount || 0}</p>
              <p className="text-xs text-slate-500">Due in {countdown}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-card">
            <h2 className="text-lg font-semibold text-primary">Pay Online</h2>
            <p className="mt-1 text-sm text-slate-600">
              Gateway: {(data?.paymentProvider || "razorpay").toUpperCase()}
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-sm text-slate-600">Amount to Pay (INR)</label>
                <input
                  className="rounded border"
                  type="number"
                  min={1}
                  max={Number(data?.pendingAmount || 0)}
                  value={payAmount}
                  onChange={(event) => setPayAmount(event.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={handlePayNow}
                disabled={paying || Number(data?.pendingAmount || 0) <= 0}
                className="rounded-lg bg-primary px-5 py-2 font-semibold text-white disabled:opacity-60"
              >
                {paying ? "Starting..." : "Pay Now"}
              </button>
            </div>
          </div>

          <Table
            data={[
              {
                tuition: data?.feeStructure?.tuition || 0,
                exam: data?.feeStructure?.exam || 0,
                sports: data?.feeStructure?.sports || 0,
                misc: data?.feeStructure?.misc || 0,
              },
            ]}
            columns={[
              { key: "tuition", title: "Tuition" },
              { key: "exam", title: "Exam" },
              { key: "sports", title: "Sports" },
              { key: "misc", title: "Misc" },
            ]}
            pageSize={10}
          />

          <Table
            data={data?.payments || []}
            columns={[
              { key: "date", title: "Date", render: (row) => new Date(row.date).toLocaleDateString() },
              { key: "amount", title: "Amount" },
              { key: "receiptNo", title: "Receipt No" },
              { key: "mode", title: "Mode" },
              { key: "provider", title: "Provider", render: (row) => row.gateway || "-" },
              { key: "status", title: "Status", render: () => data?.status || "-" },
              {
                key: "print",
                title: "Action",
                render: (row) => (
                  <button
                    type="button"
                    onClick={() => handleDownloadReceipt(row.receiptNo)}
                    className="rounded border px-3 py-1 text-sm"
                  >
                    Print Receipt
                  </button>
                ),
              },
            ]}
            pageSize={10}
          />
        </>
      )}
    </div>
  );
};

export default Fees;
