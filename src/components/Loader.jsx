const Loader = ({ text = "Loading..." }) => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-3 text-sm text-slate-600">{text}</p>
    </div>
  </div>
);

export default Loader;
