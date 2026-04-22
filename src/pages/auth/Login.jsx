import { useRef, useState } from "react";
import { Eye, EyeOff, GraduationCap, BookOpen, Shield, User, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import useAuth from "../../hooks/useAuth";
import { forgotPassword } from "../../api/auth.api";
import { showError, showSuccess } from "../../components/Toast";

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLES = [
    { id: "student", label: "STUDENT", icon: GraduationCap },
    { id: "teacher", label: "TEACHER", icon: BookOpen      },
    { id: "admin",   label: "ADMIN",   icon: Shield        },
];

// ─── Login Page ───────────────────────────────────────────────────────────────
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [role,         setRole]         = useState("student");
    const [showPassword, setShowPassword] = useState(false);
    const [remember,     setRemember]     = useState(false);
    const [form,         setForm]         = useState({ email: "", password: "" });
    const [loading,      setLoading]      = useState(false);
    const [roleSwitching,setRoleSwitching]= useState("");
    const [forgotLoading,setForgotLoading]= useState(false);
    const [forgotOpen,   setForgotOpen]   = useState(false);
    const [forgotEmail,  setForgotEmail]  = useState("");
    const [focused,      setFocused]      = useState(null);
    const submitLockRef = useRef(false);
    const forgotLockRef = useRef(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitLockRef.current || loading) return;
        if (!form.email || !form.password) {
            showError("Institutional ID and password are required");
            return;
        }
        submitLockRef.current = true;
        try {
            setLoading(true);
            await login({ ...form, role });
            if (!remember) {
                sessionStorage.setItem("token", localStorage.getItem("token") || "");
            }
            showSuccess("Login successful");
            if (role === "teacher") navigate("/teacher/dashboard");
            else if (role === "admin") navigate("/admin/dashboard");
            else navigate("/student/dashboard");
        } catch (error) {
            showError(error?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
            submitLockRef.current = false;
        }
    };

    const handleForgotPassword = async () => {
        if (forgotLockRef.current || forgotLoading) return;
        if (!forgotEmail) { showError("Email is required"); return; }
        forgotLockRef.current = true;
        try {
            setForgotLoading(true);
            await forgotPassword(forgotEmail);
            showSuccess("OTP sent to your email");
            setForgotOpen(false);
            navigate("/forgot-password");
        } catch (error) {
            showError(error?.response?.data?.message || "Failed to send OTP");
        } finally {
            setForgotLoading(false);
            forgotLockRef.current = false;
        }
    };

    const handleRoleChange = (nextRole) => {
        if (loading || roleSwitching) return;
        setRole(nextRole);
        setRoleSwitching(nextRole);
        window.setTimeout(() => setRoleSwitching(""), 350);
    };

    // Input style helper
    const inp = (name) => ({
        onFocus: () => setFocused(name),
        onBlur:  () => setFocused(null),
        style: {
            width: "100%", padding: "14px 14px 14px 44px",
            background: focused === name ? "#fff" : "rgba(255,255,255,0.93)",
            border: `1.5px solid ${focused === name ? "#1a237e" : "rgba(26,35,126,0.15)"}`,
            boxShadow: focused === name ? "0 0 0 3px rgba(26,35,126,0.1)" : "none",
            borderRadius: "10px", fontSize: "0.9rem",
            fontFamily: "'Nunito', sans-serif", color: "#1c1c2e",
            outline: "none", boxSizing: "border-box",
            transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
        },
    });

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Nunito:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #1a237e; font-family: 'Nunito', sans-serif; }

        /* ── Page layout ── */
        .login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px 16px;
          background: #1a237e;
        }

        /* ── Background: college building silhouette overlay ── */
        .login-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(57,73,171,0.5) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(26,35,126,0.8) 0%, transparent 50%);
          z-index: 0;
        }
        .login-bg-img {
          position: absolute;
          inset: 0;
          background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Missouri_State_Capitol_Building.jpg/1280px-Missouri_State_Capitol_Building.jpg');
          background-size: cover;
          background-position: center bottom;
          opacity: 0.10;
          z-index: 0;
        }

        /* ── Content wrapper ── */
        .login-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── Logo block ── */
        .login-logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
          animation: fadeUp 0.5s ease both;
        }
        .login-logo-box {
          width: 88px; height: 88px;
          background: #fff;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.8rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          margin-bottom: 16px;
          border: 2px solid rgba(255,255,255,0.3);
        }
        .login-college-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 4vw, 2rem);
          font-weight: 700;
          color: #fff;
          text-align: center;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .login-college-sub {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          margin-top: 6px;
          text-align: center;
        }

        /* ── Card ── */
        .login-card {
          width: 100%;
          background: rgba(240,242,255,0.97);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 36px 36px 28px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.30);
          border: 1px solid rgba(255,255,255,0.5);
          animation: fadeUp 0.5s ease 0.1s both;
        }

        .login-secure-tag {
          font-size: 0.68rem; font-weight: 800;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #f9a825; margin-bottom: 4px;
        }
        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem; font-weight: 700;
          color: #1a237e; margin-bottom: 24px;
        }

        /* ── Role selector ── */
        .login-role-label {
          font-size: 0.68rem; font-weight: 800;
          letter-spacing: 1.5px; color: #6b7280;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .login-roles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 24px;
          background: rgba(26,35,126,0.06);
          padding: 6px;
          border-radius: 14px;
        }
        .login-role-btn {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px; padding: 12px 8px;
          border-radius: 10px; border: none;
          cursor: pointer; font-family: 'Nunito', sans-serif;
          font-size: 0.72rem; font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase;
          transition: all 0.2s;
          background: transparent; color: #6b7280;
        }
        .login-role-btn:hover {
          background: rgba(26,35,126,0.08);
          color: #1a237e;
        }
        .login-role-btn.active {
          background: #1a237e;
          color: #fff;
          box-shadow: 0 4px 16px rgba(26,35,126,0.30);
        }
        .login-role-btn.active svg { color: #f9a825; }
        .login-role-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ── Form fields ── */
        .login-field { position: relative; margin-bottom: 14px; }
        .login-field-label {
          display: block; font-size: 0.67rem; font-weight: 800;
          letter-spacing: 1.2px; color: #6b7280;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .login-field-icon {
          position: absolute; left: 13px;
          top: 50%; transform: translateY(-50%);
          color: #9ca3af; pointer-events: none;
          display: flex; align-items: center;
        }
        .login-eye-btn {
          position: absolute; right: 12px;
          top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9ca3af; display: flex; align-items: center;
          padding: 4px; border-radius: 4px;
          transition: color 0.15s;
        }
        .login-eye-btn:hover { color: #1a237e; }
        .login-eye-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Remember + Forgot ── */
        .login-meta {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 22px; gap: 12px; flex-wrap: wrap;
        }
        .login-remember {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem; font-weight: 600; color: #6b7280;
          cursor: pointer; user-select: none;
        }
        .login-remember input[type="checkbox"] {
          width: 16px; height: 16px; accent-color: #1a237e;
          cursor: pointer;
        }
        .login-forgot {
          font-size: 0.85rem; font-weight: 700;
          color: #1a237e; background: none; border: none;
          cursor: pointer; font-family: 'Nunito', sans-serif;
          text-decoration: none; transition: color 0.15s;
        }
        .login-forgot:hover { color: #f9a825; }
        .login-forgot:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Submit button ── */
        .login-submit {
          width: 100%; padding: 15px;
          background: #f9a825; color: #1a237e;
          border: none; border-radius: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 1rem; font-weight: 800;
          cursor: pointer; letter-spacing: 0.3px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(249,168,37,0.40);
          transition: all 0.2s;
          margin-bottom: 20px;
        }
        .login-submit:hover:not(:disabled) {
          background: #e6981a;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(249,168,37,0.50);
        }
        .login-submit:disabled { opacity: 0.75; cursor: not-allowed; }

        /* ── Bottom text ── */
        .login-bottom {
          text-align: center; font-size: 0.85rem;
          color: #6b7280; padding-top: 16px;
          border-top: 1px solid rgba(26,35,126,0.08);
        }
        .login-bottom a {
          color: #1a237e; font-weight: 700;
          text-decoration: none; transition: color 0.15s;
        }
        .login-bottom a:hover { color: #f9a825; }

        /* ── Footer strip ── */
        .login-footer {
          position: relative; z-index: 1;
          margin-top: 28px; text-align: center;
          animation: fadeUp 0.5s ease 0.3s both;
        }
        .login-footer-security {
          display: flex; align-items: center; justify-content: center;
          gap: 20px; margin-bottom: 8px;
        }
        .login-footer-security span {
          font-size: 0.72rem; color: rgba(255,255,255,0.45);
          font-weight: 600; letter-spacing: 0.5px;
          display: flex; align-items: center; gap: 5px;
        }
        .login-footer-copy {
          font-size: 0.7rem; color: rgba(255,255,255,0.3);
          letter-spacing: 0.5px; margin-bottom: 16px;
        }
        .login-footer-links {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .login-footer-links-left {
          display: flex; gap: 20px; flex-wrap: wrap;
        }
        .login-footer-link {
          font-size: 0.72rem; color: rgba(255,255,255,0.40);
          text-decoration: none; font-weight: 600;
          letter-spacing: 0.5px; text-transform: uppercase;
          transition: color 0.15s;
        }
        .login-footer-link:hover { color: rgba(255,255,255,0.75); }
        .login-footer-tagline {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 0.78rem; color: rgba(255,255,255,0.35);
        }

        /* ── Modal overrides ── */
        .forgot-modal-input {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid #dde3f0; border-radius: 10px;
          font-size: 0.9rem; font-family: 'Nunito', sans-serif;
          color: #1c1c2e; outline: none;
          transition: border-color 0.2s;
          margin-bottom: 12px;
        }
        .forgot-modal-input:focus { border-color: #1a237e; box-shadow: 0 0 0 3px rgba(26,35,126,0.08); }
        .forgot-modal-btn {
          width: 100%; padding: 12px;
          background: #1a237e; color: #fff;
          border: none; border-radius: 10px;
          font-size: 0.9rem; font-weight: 700;
          font-family: 'Nunito', sans-serif;
          cursor: pointer; transition: background 0.2s;
        }
        .forgot-modal-btn:hover { background: #283593; }
        .forgot-modal-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ── Spinner ── */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(26,35,126,0.3);
          border-top-color: #1a237e;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 480px) {
          .login-card { padding: 24px 18px 20px; border-radius: 16px; }
          .login-title { font-size: 1.45rem; }
          .login-logo-box { width: 72px; height: 72px; font-size: 2.2rem; }
          .login-college-name { font-size: 1.3rem; }
          .login-footer-links { flex-direction: column; align-items: center; gap: 8px; }
        }
      `}</style>

            <div className="login-page">
                {/* Background layers */}
                <div className="login-bg" />
                <div className="login-bg-img" />

                {/* Main content */}
                <div className="login-content">

                    {/* ── Logo + College name ── */}
                    <div className="login-logo-wrap">
                        <div className="login-logo-box">🎓</div>
                        <h1 className="login-college-name">BJP Memorial Inter College</h1>
                        <p className="login-college-sub">Academic Heirloom Portal</p>
                    </div>

                    {/* ── Card ── */}
                    <div className="login-card">

                        <p className="login-secure-tag">🔒 Secure Access</p>
                        <h2 className="login-title">Portal Sign-in</h2>

                        {/* Role selector */}
                        <p className="login-role-label">Select Your Designation</p>
                        <div className="login-roles" role="group" aria-label="Select role">
                            {ROLES.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    className={`login-role-btn${role === id ? " active" : ""}`}
                                    onClick={() => handleRoleChange(id)}
                                    disabled={loading || Boolean(roleSwitching)}
                                    aria-pressed={role === id}
                                >
                                    {((loading && role === id) || roleSwitching === id) ? (
                                        <>
                                            <span className="spin" style={{ width: 16, height: 16 }} />
                                            {loading ? "LOADING..." : "SELECTING..."}
                                        </>
                                    ) : (
                                        <>
                                            <Icon size={22} strokeWidth={2} />
                                            {label}
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} noValidate>

                            {/* Institutional ID */}
                            <div className="login-field">
                                <label className="login-field-label" htmlFor="login-email">
                                    Institutional ID
                                </label>
                                <div className="login-field-icon">
                                    <User size={16} strokeWidth={2.5} />
                                </div>
                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="e.g. BJP-2024-001"
                                    autoComplete="username"
                                    required
                                    {...inp("email")}
                                />
                            </div>

                            {/* Access Password */}
                            <div className="login-field">
                                <label className="login-field-label" htmlFor="login-password">
                                    Access Password
                                </label>
                                <div className="login-field-icon">
                                    <Lock size={16} strokeWidth={2.5} />
                                </div>
                                <input
                                    id="login-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    {...inp("password")}
                                    style={{
                                        ...inp("password").style,
                                        paddingRight: "44px",
                                    }}
                                />
                                <button
                                    type="button"
                                    className="login-eye-btn"
                                    onClick={() => setShowPassword((v) => !v)}
                                    disabled={loading}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Remember + Forgot */}
                            <div className="login-meta">
                                <label className="login-remember">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                    />
                                    Keep me logged in
                                </label>
                                <button
                                    type="button"
                                    className="login-forgot"
                                    onClick={() => setForgotOpen(true)}
                                    disabled={loading}
                                >
                                    Forgot Access Code?
                                </button>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="login-submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spin" /> Signing in...</>
                                ) : (
                                    <>Login to Portal →</>
                                )}
                            </button>
                        </form>

                        {/* Bottom link */}
                        <div className="login-bottom">
                            New to the institution?{" "}
                            <Link to="/admission">Admission Inquiry</Link>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <footer className="login-footer" style={{ width: "100%", maxWidth: "520px" }}>
                    <div className="login-footer-security">
                        <span>🔒 256-BIT SSL SECURED</span>
                        <span>🛡️ PRIVACY FIRST</span>
                    </div>
                    <p className="login-footer-copy">
                        © 2024 BJP MEMORIAL INTER COLLEGE. ESTABLISHED 1988.
                    </p>
                    <div className="login-footer-links">
                        <div className="login-footer-links-left">
                            {["Mandatory Disclosure", "Alumni Network", "Career", "Contact"].map((l) => (
                                <Link key={l} to="#" className="login-footer-link">{l}</Link>
                            ))}
                        </div>
                        <span className="login-footer-tagline">Knowledge Is The Eternal Light.</span>
                    </div>
                </footer>
            </div>

            {/* ── Forgot Password Modal ── */}
            <Modal
                isOpen={forgotOpen}
                onClose={() => setForgotOpen(false)}
                title="Forgot Access Code?"
            >
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "16px", lineHeight: 1.6 }}>
                    Enter your registered institutional email address and we'll send an OTP to reset your access code.
                </p>
                <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="forgot-modal-input"
                    onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                    autoFocus
                />
                <button
                    type="button"
                    className="forgot-modal-btn"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                >
                    {forgotLoading ? (
                        <><span className="spin" style={{ width: 14, height: 14 }} /> Sending...</>
                    ) : (
                        <>Send OTP →</>
                    )}
                </button>
                <p style={{ textAlign: "center", marginTop: "10px", fontSize: "0.78rem", color: "#9ca3af" }}>
                    Check your spam folder if you don't see it within 2 minutes.
                </p>
            </Modal>
        </>
    );
};

export default Login;
