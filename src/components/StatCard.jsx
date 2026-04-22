const StatCard = ({ title, value, subtitle }) => (
  <div className="rounded-xl bg-white p-4 shadow-card">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
  </div>
);

export default StatCard;
