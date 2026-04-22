import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { submitEnquiry } from "../../api/public.api";
import { showError, showSuccess } from "../../components/Toast";

// ─── useWindowWidth hook ─────────────────────────────────────────────────────
function useWindowWidth() {
    const [width, setWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200
    );
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return width;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const initialState = {
    name: "", dob: "", fatherName: "", classApplying: "",
    previousSchool: "", phone: "", email: "", message: "",
};

const CLASS_OPTIONS = [
    "Class 9", "Class 10",
    "Class 11 (Science)", "Class 11 (Commerce)", "Class 11 (Arts)",
    "Class 12 (Science)", "Class 12 (Commerce)", "Class 12 (Arts)",
];

// ─── Admission Page ──────────────────────────────────────────────────────────
const Admission = () => {
    const [form, setForm]           = useState(initialState);
    const [loading, setLoading]     = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused]     = useState(null);

    const width     = useWindowWidth();
    const isMobile  = width < 640;
    const isTablet  = width >= 640 && width < 1024;
    const isDesktop = width >= 1024;

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const required = ["name", "fatherName", "classApplying", "dob", "phone", "email"];
        for (const f of required) {
            if (!form[f]) {
                showError("Please fill all required fields");
                return;
            }
        }
        try {
            setLoading(true);
            await submitEnquiry(form);
            setSubmitted(true);
            showSuccess("Enquiry submitted successfully!");
        } catch (err) {
            showError(err?.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Shared style helpers ──────────────────────────────────────────────────
    const inp = (name, extra = {}) => ({
        name,
        value: form[name],
        onChange: handleChange,
        onFocus: () => setFocused(name),
        onBlur: () => setFocused(null),
        style: {
            width: "100%",
            padding: "11px 14px",
            borderRadius: "8px",
            border: `1.5px solid ${focused === name ? "#1a237e" : "#dde3f0"}`,
            boxShadow: focused === name ? "0 0 0 3px rgba(26,35,126,0.08)" : "none",
            fontSize: "0.88rem",
            fontFamily: "'Nunito', sans-serif",
            color: "#1c1c2e",
            outline: "none",
            background: "#fff",
            boxSizing: "border-box",
            transition: "border-color 0.2s, box-shadow 0.2s",
            ...extra,
        },
    });

    const lbl = {
        display: "block",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "1px",
        color: "#6b7280",
        marginBottom: "5px",
        textTransform: "uppercase",
    };

    const grid2 = {
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: "12px",
        marginBottom: "12px",
    };

    // ── Success screen ─────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "#f5f6fa" }}>
                <Navbar />
                <main style={{
                    maxWidth: "560px", margin: "0 auto",
                    padding: isMobile ? "56px 20px" : "100px 24px",
                    textAlign: "center",
                }}>
                    <div style={{
                        width: "88px", height: "88px", borderRadius: "50%",
                        background: "linear-gradient(135deg,#e8f5e9,#c8e6c9)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 24px", fontSize: "2.2rem",
                        boxShadow: "0 8px 32px rgba(22,163,74,0.15)",
                    }}>✅</div>

                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: isMobile ? "1.8rem" : "2.4rem",
                        color: "#1a237e", marginBottom: "14px",
                    }}>Thank You!</h1>

                    <p style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.8 }}>
                        Your admission enquiry has been submitted successfully.<br />
                        Our admissions counselor will contact you within{" "}
                        <strong style={{ color: "#1a237e" }}>24 hours</strong>.
                    </p>

                    <div style={{
                        marginTop: "24px", padding: "16px 20px", background: "#fff",
                        borderRadius: "12px", border: "1px solid #eef0f7",
                        boxShadow: "0 2px 12px rgba(26,35,126,0.07)",
                    }}>
                        <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "4px" }}>Application for</div>
                        <div style={{ fontWeight: 700, color: "#1a237e", fontSize: "1rem" }}>{form.name}</div>
                        <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "2px" }}>
                            {form.classApplying} · {form.phone}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexDirection: isMobile ? "column" : "row" }}>
                        <button
                            onClick={() => { setSubmitted(false); setForm(initialState); }}
                            style={{
                                flex: 1, background: "#1a237e", color: "#fff", border: "none",
                                borderRadius: "10px", padding: "13px 24px", fontWeight: 700,
                                fontSize: "0.9rem", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                            }}
                        >Submit Another Enquiry</button>
                        <Link
                            to="/"
                            style={{
                                flex: 1, background: "#fff", color: "#1a237e",
                                border: "1.5px solid #dde3f0", borderRadius: "10px",
                                padding: "13px 24px", fontWeight: 700, fontSize: "0.9rem",
                                textDecoration: "none", display: "flex", alignItems: "center",
                                justifyContent: "center",
                            }}
                        >Back to Home</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // ── Main page ──────────────────────────────────────────────────────────────
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Nunito:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f6fa; -webkit-text-size-adjust: 100%; }
        select { -webkit-appearance: none; appearance: none; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: none; }
        }
        .adm-a1 { animation: fadeUp 0.5s ease 0.05s both; }
        .adm-a2 { animation: fadeUp 0.5s ease 0.15s both; }
        .adm-a3 { animation: fadeUp 0.5s ease 0.25s both; }
        .adm-a4 { animation: fadeUp 0.5s ease 0.35s both; }

        .adm-why-card { transition: transform 0.2s, box-shadow 0.2s; }
        .adm-why-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(26,35,126,0.13) !important;
        }
        .adm-submit-btn { transition: all 0.2s; }
        .adm-submit-btn:hover:not(:disabled) {
          background: #283593 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(26,35,126,0.3) !important;
        }
        .adm-cta-btn { transition: all 0.2s; }
        .adm-cta-btn:hover { background: #e69518 !important; transform: translateY(-1px); }
        .adm-scroll-btn { transition: all 0.2s; }
        .adm-scroll-btn:hover { background: #e69518 !important; transform: translateY(-1px); }

        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.6; }
        textarea { resize: vertical; }
      `}</style>

            <div style={{ fontFamily: "'Nunito', sans-serif", background: "#f5f6fa", minHeight: "100vh" }}>

                {/* ── Real Navbar from your components ── */}
                <Navbar />

                {/* ══════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════ */}
                <section style={{
                    background: "#f5f6fa",
                    padding: isMobile ? "36px 20px 48px" : isTablet ? "48px 32px 60px" : "60px 48px 80px",
                }}>
                    <div style={{
                        maxWidth: "1200px", margin: "0 auto",
                        display: "flex",
                        flexDirection: isDesktop ? "row" : "column",
                        gap: isDesktop ? "56px" : "36px",
                        alignItems: isDesktop ? "flex-start" : "stretch",
                    }}>

                        {/* Left: Hero copy */}
                        <div className="adm-a1" style={{ flex: 1, paddingTop: isDesktop ? "16px" : 0 }}>

                            {/* Badge */}
                            <span style={{
                                display: "inline-block", background: "#f9a825", color: "#1a237e",
                                fontSize: "0.68rem", fontWeight: 800, letterSpacing: "1.5px",
                                padding: "5px 14px", borderRadius: "20px", marginBottom: "20px",
                                textTransform: "uppercase",
                            }}>Admissions 2024–25</span>

                            {/* Headline */}
                            <h1 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: isMobile ? "1.95rem" : isTablet ? "2.6rem" : "3.2rem",
                                lineHeight: 1.12, color: "#1a237e",
                            }}>
                                Shape Your Future<br />with{" "}
                                <em style={{ color: "#f9a825", fontStyle: "italic" }}>
                                    Academic<br />Excellence.
                                </em>
                            </h1>

                            {/* Sub-copy */}
                            <p style={{
                                color: "#6b7280",
                                fontSize: isMobile ? "0.88rem" : "0.95rem",
                                lineHeight: 1.75, marginTop: "18px",
                                maxWidth: isDesktop ? "400px" : "100%",
                            }}>
                                Since 1988, we have been cultivating leaders through a blend of
                                traditional values and modern pedagogical approaches. Begin your
                                journey toward wisdom today.
                            </p>

                            {/* Feature chips */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                                gap: "12px", marginTop: "24px",
                            }}>
                                {[
                                    { icon: "🔬", title: "State-of-the-Art Labs", desc: "Advanced STEM facilities for practical learning." },
                                    { icon: "🏆", title: "Proven Legacy", desc: "Top academic rankings for 35+ years." },
                                ].map((item) => (
                                    <div key={item.title} style={{
                                        display: "flex", alignItems: "flex-start", gap: "12px",
                                        background: "#fff", borderRadius: "12px", padding: "14px",
                                        boxShadow: "0 2px 12px rgba(26,35,126,0.07)",
                                        border: "1px solid #eef0f7",
                                    }}>
                                        <div style={{
                                            width: "38px", height: "38px", borderRadius: "8px", flexShrink: 0,
                                            background: "rgba(249,168,37,0.12)", display: "flex",
                                            alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
                                        }}>{item.icon}</div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: "0.83rem", color: "#1a237e" }}>{item.title}</div>
                                            <div style={{ fontSize: "0.77rem", color: "#9ca3af", marginTop: "2px", lineHeight: 1.4 }}>{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Form card */}
                        <div className="adm-a2" style={{
                            width: isDesktop ? "488px" : "100%",
                            flexShrink: 0,
                            background: "#fff",
                            borderRadius: "18px",
                            boxShadow: "0 8px 48px rgba(26,35,126,0.13)",
                            padding: isMobile ? "22px 18px" : "34px",
                        }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: isMobile ? "1.25rem" : "1.55rem",
                                color: "#1a237e", marginBottom: "4px",
                            }}>Admission Enquiry</h2>
                            <p style={{ fontSize: "0.79rem", color: "#9ca3af", marginBottom: "22px", lineHeight: 1.5 }}>
                                Please fill in the details below. Our admissions counselor will
                                contact you within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit}>

                                {/* Name + Father Name */}
                                <div style={grid2}>
                                    <div>
                                        <label style={lbl}>Name *</label>
                                        <input {...inp("name")} placeholder="Full legal name" required />
                                    </div>
                                    <div>
                                        <label style={lbl}>Father's Name *</label>
                                        <input {...inp("fatherName")} placeholder="Full legal name" required />
                                    </div>
                                </div>

                                {/* Class + DOB */}
                                <div style={grid2}>
                                    <div>
                                        <label style={lbl}>Class Applying For *</label>
                                        <select
                                            {...inp("classApplying", {
                                                cursor: "pointer",
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "right 12px center",
                                                paddingRight: "34px",
                                            })}
                                            required
                                        >
                                            <option value="">Select Grade</option>
                                            {CLASS_OPTIONS.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={lbl}>Date of Birth *</label>
                                        <input {...inp("dob")} type="date" required />
                                    </div>
                                </div>

                                {/* Phone + Email */}
                                <div style={grid2}>
                                    <div>
                                        <label style={lbl}>Phone Number *</label>
                                        <input {...inp("phone")} placeholder="+91 00000 00000" type="tel" required />
                                    </div>
                                    <div>
                                        <label style={lbl}>Email Address *</label>
                                        <input {...inp("email")} placeholder="example@email.com" type="email" required />
                                    </div>
                                </div>

                                {/* Previous School */}
                                <div style={{ marginBottom: "12px" }}>
                                    <label style={lbl}>Previous School</label>
                                    <input {...inp("previousSchool")} placeholder="Institution Name & City" />
                                </div>

                                {/* Message */}
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={lbl}>Message / Questions</label>
                                    <textarea
                                        {...inp("message", { minHeight: "84px", lineHeight: 1.6 })}
                                        placeholder="Tell us about your academic goals..."
                                        rows={3}
                                    />
                                </div>

                                {/* Submit button */}
                                <button
                                    className="adm-submit-btn"
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: "100%", padding: "14px",
                                        background: loading ? "#3949ab" : "#1a237e",
                                        color: "#fff", border: "none", borderRadius: "10px",
                                        fontSize: "0.92rem", fontWeight: 700,
                                        cursor: loading ? "not-allowed" : "pointer",
                                        fontFamily: "'Nunito', sans-serif",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", gap: "8px",
                                    }}
                                >
                                    {loading ? (
                                        <>
                      <span style={{
                          width: "16px", height: "16px",
                          border: "2px solid rgba(255,255,255,0.35)",
                          borderTopColor: "#fff", borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.7s linear infinite",
                      }} />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>Submit Application Request →</>
                                    )}
                                </button>

                                <p style={{ textAlign: "center", marginTop: "10px", fontSize: "0.73rem", color: "#bbb" }}>
                                    🔒 Your information is safe and will not be shared.
                                </p>
                            </form>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
            STATS STRIP
        ══════════════════════════════════════════════════════ */}
                <section style={{
                    background: "#1a237e",
                    padding: isMobile ? "32px 20px" : "44px 48px",
                }}>
                    <div style={{
                        maxWidth: "1200px", margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                        gap: isMobile ? "28px" : "24px",
                        textAlign: "center",
                    }}>
                        {[
                            { num: "35+", label: "Years of Excellence" },
                            { num: "5000+", label: "Alumni Worldwide" },
                            { num: "98%", label: "Board Pass Rate" },
                            { num: "50+", label: "Expert Faculty" },
                        ].map((s) => (
                            <div key={s.label}>
                                <div style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: isMobile ? "1.8rem" : "2.4rem",
                                    fontWeight: 700, color: "#f9a825",
                                }}>{s.num}</div>
                                <div style={{ fontSize: "0.78rem", color: "#aab4d4", marginTop: "4px", fontWeight: 600 }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
            WHY CHOOSE BJP MEMORIAL
        ══════════════════════════════════════════════════════ */}
                <section style={{
                    background: "#fff",
                    padding: isMobile ? "56px 20px" : isTablet ? "64px 32px" : "80px 48px",
                }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
                        <h2 className="adm-a1" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: isMobile ? "1.65rem" : "2.2rem",
                            color: "#1a237e", marginBottom: "8px",
                        }}>Why Choose BJP Memorial?</h2>
                        <div style={{
                            width: "56px", height: "3px", background: "#f9a825",
                            margin: "0 auto 44px", borderRadius: "2px",
                        }} />

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
                            gap: "20px",
                        }}>
                            {[
                                { icon: "👨‍🏫", title: "Elite Faculty", desc: "Our educators are subject matter experts dedicated to mentoring the next generation of innovators and scholars." },
                                { icon: "🌱", title: "Holistic Growth", desc: "From rigorous academics to competitive sports and arts, we ensure every student finds their unique calling." },
                                { icon: "🏛️", title: "Modern Campus", desc: "Sprawling infrastructure equipped with fiber-optic connectivity, digital libraries, and modern sports complexes." },
                            ].map((card, i) => (
                                <div key={card.title} className={`adm-why-card adm-a${i + 2}`} style={{
                                    background: "#f9fafb", borderRadius: "16px",
                                    padding: isMobile ? "28px 20px" : "36px 28px",
                                    border: "1px solid #eef0f7",
                                    boxShadow: "0 2px 16px rgba(26,35,126,0.05)",
                                }}>
                                    <div style={{
                                        width: "64px", height: "64px", borderRadius: "14px",
                                        background: "rgba(249,168,37,0.12)", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        fontSize: "1.8rem", margin: "0 auto 18px",
                                    }}>{card.icon}</div>
                                    <h3 style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: "1.1rem", color: "#f9a825", marginBottom: "10px",
                                    }}>{card.title}</h3>
                                    <p style={{ color: "#6b7280", fontSize: "0.87rem", lineHeight: 1.7 }}>{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
            ADMISSION JOURNEY
        ══════════════════════════════════════════════════════ */}
                <section style={{
                    background: "#f5f6fa",
                    padding: isMobile ? "56px 20px" : isTablet ? "64px 32px" : "80px 48px",
                }}>
                    <div style={{
                        maxWidth: "1200px", margin: "0 auto",
                        display: "flex",
                        flexDirection: isDesktop ? "row" : "column",
                        gap: isDesktop ? "64px" : "36px",
                        alignItems: isDesktop ? "center" : "stretch",
                    }}>

                        {/* College gate image — hidden on mobile */}
                        {!isMobile && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    borderRadius: "20px", overflow: "hidden",
                                    height: isTablet ? "320px" : "460px",
                                    position: "relative",
                                    boxShadow: "0 12px 48px rgba(26,35,126,0.15)",
                                    background: "#cfd8dc",
                                }}>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Stylized_Spruce_Avenue_School_Entrance.jpg/640px-Stylized_Spruce_Avenue_School_Entrance.jpg"
                                        alt="College Gate"
                                        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(10%)" }}
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        background: "linear-gradient(to top, rgba(26,35,126,0.45) 0%, transparent 55%)",
                                    }} />
                                    <div style={{
                                        position: "absolute", bottom: "22px", left: "22px",
                                        color: "#fff", fontFamily: "'Playfair Display', serif",
                                        fontSize: "1rem", fontWeight: 700,
                                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                    }}>BJP Memorial Inter College</div>
                                </div>
                            </div>
                        )}

                        {/* Steps */}
                        <div style={{ flex: 1 }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: isMobile ? "1.55rem" : "2rem",
                                color: "#1a237e", marginBottom: "6px",
                            }}>
                                The Admission Journey{" "}
                                <em style={{ color: "#f9a825", fontStyle: "italic" }}>Step-by-Step</em>
                            </h2>
                            <p style={{ color: "#9ca3af", fontSize: "0.86rem", marginBottom: "32px", lineHeight: 1.65 }}>
                                A transparent, four-step process designed for your convenience.
                            </p>

                            {[
                                { num: "01", title: "Initial Enquiry", desc: "Submit the form on this page to express interest and receive our digital prospectus." },
                                { num: "02", title: "Campus Visit", desc: "Schedule a guided tour of our facilities and meet with the departmental heads." },
                                { num: "03", title: "Interaction", desc: "A brief academic assessment followed by a student-parent interaction with the Principal." },
                                { num: "04", title: "Enrollment", desc: "Completion of documentation and fee submission to secure the academic seat." },
                            ].map((step, idx, arr) => (
                                <div key={step.num} style={{ display: "flex", gap: "14px" }}>
                                    {/* Circle + connector line */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                                        <div style={{
                                            width: "42px", height: "42px", borderRadius: "50%",
                                            background: "#fff", border: "2px solid #dde3f0",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: "0.9rem", fontWeight: 700, color: "#1a237e",
                                            boxShadow: "0 2px 8px rgba(26,35,126,0.1)", flexShrink: 0,
                                        }}>{step.num}</div>
                                        {idx < arr.length - 1 && (
                                            <div style={{
                                                width: "2px", flex: 1, background: "#e2e8f0",
                                                margin: "5px 0", minHeight: "28px",
                                            }} />
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div style={{
                                        paddingTop: "9px",
                                        paddingBottom: idx < arr.length - 1 ? "20px" : 0,
                                    }}>
                                        <div style={{
                                            fontWeight: 700,
                                            fontSize: isMobile ? "0.92rem" : "1rem",
                                            color: "#1a237e", marginBottom: "4px",
                                        }}>{step.title}</div>
                                        <div style={{ fontSize: "0.83rem", color: "#9ca3af", lineHeight: 1.65 }}>
                                            {step.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                className="adm-scroll-btn"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                style={{
                                    marginTop: "30px", background: "#f9a825", color: "#1a237e",
                                    border: "none", borderRadius: "10px", padding: "13px 28px",
                                    fontWeight: 800, fontSize: "0.9rem", cursor: "pointer",
                                    fontFamily: "'Nunito', sans-serif",
                                    width: isMobile ? "100%" : "auto",
                                }}
                            >Start Your Application →</button>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
            CTA BANNER
        ══════════════════════════════════════════════════════ */}
                <section style={{
                    background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
                    padding: isMobile ? "48px 20px" : "64px 48px",
                    textAlign: "center",
                }}>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: isMobile ? "1.5rem" : "2rem",
                        color: "#fff", marginBottom: "12px",
                    }}>Ready to Begin Your Journey?</h2>
                    <p style={{
                        color: "#aab4d4",
                        fontSize: isMobile ? "0.85rem" : "0.95rem",
                        lineHeight: 1.7, marginBottom: "28px",
                        maxWidth: "480px", margin: "0 auto 28px",
                    }}>
                        Limited seats available for 2024–25. Apply early to secure your academic place.
                    </p>
                    <Link
                        to="/admission"
                        className="adm-cta-btn"
                        style={{
                            display: "inline-block",
                            background: "#f9a825", color: "#1a237e",
                            borderRadius: "10px", padding: isMobile ? "14px 28px" : "14px 36px",
                            fontWeight: 800, fontSize: "0.95rem",
                            textDecoration: "none",
                            width: isMobile ? "100%" : "auto",
                            boxSizing: "border-box",
                            textAlign: "center",
                        }}
                    >Apply Now — Free Enquiry →</Link>
                </section>

                {/* ── Real Footer from your components ── */}
                <Footer />
            </div>
        </>
    );
};

export default Admission;