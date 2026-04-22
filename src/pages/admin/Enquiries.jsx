import { useState } from "react";
import { getEnquiries, updateEnquiryStatus } from "../../api/admin.api";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { showError, showSuccess } from "../../components/Toast";

const statuses = ["", "Pending", "Contacted", "Enrolled", "Rejected"];

const Enquiries = () => {
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const enquiriesState = useFetch(() => getEnquiries({ status }), [status]);

  const updateStatus = async (id, nextStatus) => {
    try {
      await updateEnquiryStatus(id, nextStatus);
      showSuccess("Status updated");
      await enquiriesState.execute({ status });
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Enquiries</h1>
      <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-card">
        {statuses.map((item) => (
          <button
            key={item || "All"}
            onClick={() => setStatus(item)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              status === item ? "bg-primary text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {item || "All"}
          </button>
        ))}
      </div>

      {enquiriesState.loading ? (
        <Loader />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(enquiriesState.data || []).map((enquiry) => (
            <div key={enquiry._id} className="rounded-xl bg-white p-4 shadow-card">
              <p className="font-semibold text-primary">{enquiry.name}</p>
              <p className="text-sm text-slate-600">
                Class: {enquiry.classApplying} | Phone: {enquiry.phone}
              </p>
              <p className="text-sm text-slate-600">{enquiry.email}</p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-700">{enquiry.message}</p>
              <div className="mt-3 flex items-center justify-between">
                <select
                  className="rounded border text-sm"
                  value={enquiry.status}
                  onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                >
                  {statuses.filter(Boolean).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button onClick={() => setSelected(enquiry)} className="rounded border px-3 py-1 text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Enquiry Details">
        {selected && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {selected.name}
            </p>
            <p>
              <strong>Father:</strong> {selected.fatherName}
            </p>
            <p>
              <strong>DOB:</strong> {new Date(selected.dob).toLocaleDateString()}
            </p>
            <p>
              <strong>Class Applying:</strong> {selected.classApplying}
            </p>
            <p>
              <strong>Previous School:</strong> {selected.previousSchool}
            </p>
            <p>
              <strong>Email:</strong> {selected.email}
            </p>
            <p>
              <strong>Phone:</strong> {selected.phone}
            </p>
            <p>
              <strong>Message:</strong> {selected.message}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Enquiries;
