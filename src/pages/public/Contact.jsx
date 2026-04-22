import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, Globe } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { submitContact } from "../../api/public.api";
import { showError, showSuccess } from "../../components/Toast";

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.phone || !form.message) {
            showError("Please fill all fields");
            return;
        }
        try {
            setLoading(true);
            await submitContact(form);
            showSuccess("Message sent successfully");
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            showError(error?.response?.data?.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#fcfcfd] min-h-screen">
            <Navbar />

            {/* --- HERO HEADER --- */}
            <section className="bg-[#0a0a35] py-20 text-white">
                <div className="mx-auto max-w-7xl px-6 text-center md:text-left">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Connect With Us</span>
                    <h1 className="mt-4 font-serif text-5xl font-bold md:text-6xl">Get in Touch</h1>
                    <p className="mt-6 max-w-2xl text-lg text-slate-300">
                        Have questions about admissions, curriculum, or campus life? Our administrative team is here to assist you.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-12 lg:grid-cols-12">

                    {/* --- CONTACT INFO CARDS (Left 5 Columns) --- */}
                    <div className="space-y-6 lg:col-span-5">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            {/* Address */}
                            <div className="group flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="rounded-xl bg-primary/5 p-3 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0a0a35]">Campus Address</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                        College Road, Institutional Area, <br />
                                        Jaunpur, Uttar Pradesh - 222001
                                    </p>
                                </div>
                            </div>

                            {/* Phone/Email */}
                            <div className="group flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="rounded-xl bg-primary/5 p-3 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0a0a35]">Contact Channels</h3>
                                    <p className="mt-2 text-sm text-slate-500">+91 5452 260876</p>
                                    <p className="text-sm text-slate-500">info@bjpmemorial.edu.in</p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="group flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="rounded-xl bg-primary/5 p-3 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0a0a35]">Office Hours</h3>
                                    <p className="mt-2 text-sm text-slate-500">Mon — Sat: 8:00 AM - 4:00 PM</p>
                                    <p className="text-sm text-slate-500 italic">Closed on Sundays & Public Holidays</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder/Iframe */}
                        <div className="relative h-64 overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
                            <iframe
                                title="College Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115132.861072444!2d82.603099958742!3d25.757199144445213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3990370830490f87%3A0x7d6a52479e000494!2sJaunpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714567890123!5m2!1sen!2sin"
                                className="h-full w-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* --- CONTACT FORM (Right 7 Columns) --- */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl bg-white p-8 shadow-xl md:p-12">
                            <div className="mb-8">
                                <h2 className="font-serif text-3xl font-bold text-[#0a0a35]">Send an Inquiry</h2>
                                <p className="mt-2 text-slate-500">Please fill out the form below and we'll get back to you within 24-48 hours.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="e.g. John Doe"
                                            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+91 00000 00000"
                                        className="w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="How can we help you?"
                                        className="w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                        rows={5}
                                    />
                                </div>

                                <button
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0a0a35] py-4 font-bold text-white shadow-lg transition-all hover:bg-primary hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {loading ? (
                                        <span className="animate-pulse">Processing...</span>
                                    ) : (
                                        <>
                                            Submit Message <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </main>

            {/* --- QUICK LINKS / CAMPUS PORTALS --- */}
            <section className="bg-slate-100 py-16 border-t border-slate-200">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-8 md:grid-cols-3 text-center md:text-left">
                        <div>
                            <h4 className="font-bold text-[#0a0a35]">Online Admissions</h4>
                            <p className="mt-2 text-sm text-slate-500">Apply for the academic session 2026-27 directly through our portal.</p>
                            <button className="mt-4 text-sm font-bold text-primary hover:underline">Apply Now →</button>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#0a0a35]">Alumni Network</h4>
                            <p className="mt-2 text-sm text-slate-500">Are you a former student? Join our global network of alumni.</p>
                            <button className="mt-4 text-sm font-bold text-primary hover:underline">Register Today →</button>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#0a0a35]">Careers</h4>
                            <p className="mt-2 text-sm text-slate-500">Join our distinguished faculty and contribute to academic excellence.</p>
                            <button className="mt-4 text-sm font-bold text-primary hover:underline">View Vacancies →</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;