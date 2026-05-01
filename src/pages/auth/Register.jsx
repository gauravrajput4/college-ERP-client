import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl bg-white p-6 shadow-card">
      <h1 className="font-heading text-3xl text-primary">Register</h1>
      <p className="mt-2 text-sm text-slate-600">Account self-registration is currently managed by admin.</p>
      <Link to="/login" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
        Back to Login
      </Link>
    </div>
  );
};

export default Register;

