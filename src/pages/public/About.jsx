import { Eye, Target, Shield, Quote } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const About = () => {
    return (
        <div className="bg-[#f8f9fa] font-sans text-slate-900">
            <Navbar />

            <main>
                {/* --- HERO SECTION --- */}
                <section className="relative h-[60vh] overflow-hidden bg-[#0a0a35] text-white">
                    <div className="absolute inset-0 opacity-30">
                        <img
                            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80"
                            alt="College Building"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
                        <span className="text-sm font-bold uppercase tracking-widest text-accent">Established 1988</span>
                        <h1 className="mt-4 font-serif text-5xl font-bold md:text-7xl">
                            Our Legacy of <br /> Academic Excellence
                        </h1>
                        <p className="mt-6 max-w-lg text-lg text-slate-300">
                            Nurturing minds and building characters for over three decades in the heart of academic tradition.
                        </p>
                    </div>
                </section>

                {/* --- HISTORY & STATS SECTION --- */}
                <section className="mx-auto max-w-7xl px-6 py-20">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* History Text */}
                        <div className="lg:col-span-2 rounded-2xl bg-white p-10 shadow-sm">
                            <h2 className="font-serif text-3xl font-bold text-primary mb-6">Our History</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    <span className="float-left mr-3 text-5xl font-serif text-primary">F</span>
                                    ounded in 1988 with a vision to democratize quality education, BJP Memorial Inter College has grown from a modest learning center to a cornerstone of regional scholarship. Named in honor of Bharat Jain Prasad, our institution stands as a testament to the belief that education is the ultimate tool for social transformation.
                                </p>
                                <p>
                                    Through three decades of challenges and triumphs, we have remained steadfast in our commitment to fostering an environment where every student can achieve their maximum potential.
                                </p>
                            </div>
                        </div>

                        {/* Stat Card 1 (Navy) */}
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-[#0a0a35] p-10 text-center text-white">
                            <span className="text-5xl font-bold text-accent">35+</span>
                            <p className="mt-2 text-sm uppercase tracking-widest opacity-80">Years of Service</p>
                        </div>

                        {/* Stat Card 2 (Yellow) */}
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-[#ffb400] p-10 text-center text-[#0a0a35]">
                            <span className="text-5xl font-bold">12k+</span>
                            <p className="mt-2 text-sm uppercase tracking-widest font-bold opacity-80">Distinguished Alumni</p>
                        </div>

                        {/* History Image */}
                        <div className="lg:col-span-2 overflow-hidden rounded-2xl shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80"
                                className="h-full w-full object-cover min-h-[300px]"
                                alt="Architecture"
                            />
                        </div>
                    </div>
                </section>

                {/* --- VISION, MISSION, VALUES --- */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-12 md:grid-cols-3">
                            <div className="text-center md:text-left">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-primary">
                                    <Eye size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">To be a beacon of intellectual light, shaping future leaders who combine scientific temper with deep-rooted ethical values.</p>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-primary">
                                    <Target size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">To provide holistic education that empowers students with knowledge, critical thinking skills, and a commitment to serving society.</p>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-primary">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Our Values</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Integrity, Excellence, Resilience, and Empathy are the four pillars that guide every interaction within our campus.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- PRINCIPAL'S MESSAGE --- */}
                <section className="mx-auto max-w-6xl px-6 py-24">
                    <div className="grid items-center gap-16 lg:grid-cols-2">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
                                alt="Principal"
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-[#ffb400] p-6 rounded-lg shadow-xl hidden md:block">
                                <p className="font-bold text-[#0a0a35]">Dr. R.K. Sharma</p>
                                <p className="text-xs uppercase text-[#0a0a35]/80">Principal Since 2011</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Quote className="mb-6 h-12 w-12 text-slate-200" />
                            <h2 className="font-serif text-3xl font-bold italic leading-tight text-[#0a0a35] mb-6">
                                "Education is not the filling of a pail, but the lighting of a fire."
                            </h2>
                            <div className="space-y-4 text-slate-600">
                                <p>Welcome to BJP Memorial Inter College. As we embark on another year of academic discovery, our focus remains on the individual growth of every student who walks through our gates.</p>
                                <p>In a fast-changing global landscape, we equip our pupils not just with information, but with the curiosity to learn and the courage to lead. Our legacy is built by our students, and it is a privilege to guide them.</p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <p className="font-bold">Warm Regards,</p>
                                <p className="text-sm text-slate-500">The Principal's Office</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- PRIDE OF INSTITUTION (ACHIEVEMENTS) --- */}
                <section className="bg-[#0a0a35] py-20 text-white">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Recognition & Merit</span>
                        <h2 className="mt-4 font-serif text-4xl font-bold mb-16">Pride of the Institution</h2>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                            {[
                                { title: "State Merit #1", desc: "Consistently producing District & State toppers in Board Exams." },
                                { title: "Sports Excellence", desc: "Regional Champions in Inter-School Football and Cricket tournaments." },
                                { title: "NAAC Accredited", desc: "Recognized for maintaining high standards of academic infrastructure." },
                                { title: "Community Award", desc: "Honored by the State Education Board for Social Literacy programs." },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl bg-white/10 p-8 backdrop-blur-sm transition-transform hover:-translate-y-2">
                                    <h4 className="mb-3 font-bold text-accent">{item.title}</h4>
                                    <p className="text-xs leading-relaxed text-slate-300">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- CAMPUS SECTION --- */}
                <section className="mx-auto max-w-7xl px-6 py-24">
                    <div className="grid gap-12 lg:grid-cols-[350px_1fr]">
                        <div>
                            <h2 className="font-serif text-4xl font-bold text-[#0a0a35]">World Class Campus</h2>
                            <p className="mt-6 text-slate-500 leading-relaxed">Our physical spaces are designed to foster exploration, collaboration, and deep focus.</p>
                            <div className="mt-10 space-y-4">
                                <div className="flex justify-between border-b pb-2 text-sm"><span className="text-slate-400">Science Labs</span><span>04</span></div>
                                <div className="flex justify-between border-b pb-2 text-sm"><span className="text-slate-400">Library Volumes</span><span>12k+</span></div>
                                <div className="flex justify-between border-b pb-2 text-sm"><span className="text-slate-400">Computer Labs</span><span>02</span></div>
                                <div className="flex justify-between border-b pb-2 text-sm"><span className="text-slate-400">Sports Complex</span><span>01</span></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative h-[400px] overflow-hidden rounded-2xl group">
                                <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80" className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="Library" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                    <h4 className="text-white font-bold">Central Library</h4>
                                    <p className="text-xs text-slate-300">A sanctuary for knowledge seekers</p>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <div className="relative h-[190px] overflow-hidden rounded-2xl group">
                                    <img src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80" className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="Lab" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                        <h4 className="text-white text-sm font-bold">Innovation Lab</h4>
                                    </div>
                                </div>
                                <div className="relative h-[190px] overflow-hidden rounded-2xl group">
                                    <img src="https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80" className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="Field" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                        <h4 className="text-white text-sm font-bold">Athletics Hub</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;