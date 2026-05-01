const bar = "overflow-hidden rounded-lg bg-slate-200/70 skeleton-shimmer";

const DashboardSkeleton = () => (
  <div className="space-y-4">
    <div className={`${bar} h-20 rounded-2xl`} />
    <div className="grid gap-4 md:grid-cols-3">
      <div className={`${bar} h-28`} />
      <div className={`${bar} h-28`} />
      <div className={`${bar} h-28`} />
    </div>
    <div className={`${bar} h-72 rounded-2xl`} />
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="grid gap-3 md:grid-cols-4">
      <div className={`${bar} h-10`} />
      <div className={`${bar} h-10`} />
      <div className={`${bar} h-10`} />
      <div className={`${bar} h-10`} />
    </div>
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className={`${bar} mb-3 h-10 last:mb-0`} />
      ))}
    </div>
  </div>
);

const FormSkeleton = () => (
  <div className="rounded-2xl bg-white p-5 shadow-card">
    <div className={`${bar} h-8 w-52`} />
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className={`${bar} h-10`} />
      ))}
    </div>
    <div className={`${bar} mt-4 h-10 w-32`} />
  </div>
);

const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div className="skeleton-shimmer h-20 w-20 rounded-full bg-slate-200/70" />
        <div className="space-y-2">
          <div className={`${bar} h-5 w-48`} />
          <div className={`${bar} h-4 w-60`} />
        </div>
      </div>
    </div>
    <div className={`${bar} h-56 rounded-2xl`} />
  </div>
);

const skeletonByVariant = {
  dashboard: <DashboardSkeleton />,
  table: <TableSkeleton />,
  form: <FormSkeleton />,
  profile: <ProfileSkeleton />,
};

const PageSkeleton = ({ variant = "dashboard" }) => (
  <div className="animate-fade-in">{skeletonByVariant[variant] || skeletonByVariant.dashboard}</div>
);

export default PageSkeleton;

