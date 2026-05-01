import { AlertTriangle, Ban, CheckCircle2, Lock } from "lucide-react";

const statusConfig = {
  eligible: { label: "ELIGIBLE", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  ineligible_attendance: { label: "LOW ATTENDANCE", icon: AlertTriangle, className: "bg-amber-50 text-amber-700 ring-amber-200" },
  ineligible_fees: { label: "FEES PENDING", icon: AlertTriangle, className: "bg-amber-50 text-amber-700 ring-amber-200" },
  ineligible_both: { label: "NOT ELIGIBLE", icon: Ban, className: "bg-rose-50 text-rose-700 ring-rose-200" },
  revoked: { label: "REVOKED", icon: Lock, className: "bg-slate-100 text-slate-700 ring-slate-200" },
};

const AdmitCardStatusBadge = ({ status = "eligible" }) => {
  const config = statusConfig[status] || statusConfig.revoked;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-semibold ring-1 ${config.className}`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
};

export default AdmitCardStatusBadge;
