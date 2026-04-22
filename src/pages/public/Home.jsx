import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"; // Optional: for icons
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useFetch from "../../hooks/useFetch";
import { getGallery, getNotices } from "../../api/public.api";
import Loader from "../../components/Loader";

const Home = () => {
    const noticesState = useFetch(getNotices, []);
    const galleryState = useFetch(() => getGallery("All"), []);

    if (noticesState.loading || galleryState.loading) {
        return <Loader text="Loading homepage..." />;
    }

    return (
        <div className="bg-slate-50 font-sans text-slate-900">
            <Navbar />

            <main>
                {/* --- HERO SECTION --- */}
                <section className="relative min-h-[80vh] overflow-hidden bg-[#0a0a35] text-white">
                    {/* Background Image/Overlay */}
                    <div className="absolute inset-0 opacity-40">
                        <img
                            src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80"
                            alt="Campus"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:py-32">
                        <div className="flex-1 text-left">
                            <span className="text-sm font-semibold uppercase tracking-widest text-accent/80">Est. 1988 — Legacy of Learning</span>
                            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight md:text-7xl">
                                Cultivating <span className="italic text-accent">Excellence</span> Since Generations.
                            </h1>
                            <p className="mt-6 max-w-xl text-lg text-slate-300">
                                At BJP Memorial Inter College, we blend traditional values with modern innovation to shape the leaders of tomorrow. Your journey starts here.
                            </p>
                            <div className="mt-10 flex gap-4">
                                <Link to="/admission" className="rounded-md bg-[#ffb400] px-8 py-4 font-bold text-[#0a0a35] transition-transform hover:scale-105">
                                    Apply Now
                                </Link>
                                <Link to="/tour" className="rounded-md border border-white/30 bg-white/10 px-8 py-4 font-bold backdrop-blur-sm transition-colors hover:bg-white/20">
                                    Take a Tour
                                </Link>
                            </div>
                        </div>

                        {/* Admission Update Card */}
                        <div className="w-full max-w-md rounded-xl bg-white p-8 text-slate-900 shadow-2xl">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <span className="text-xl">📢</span>
                                </div>
                                <div>
                                    <h4 className="font-bold">Admission Update</h4>
                                    <p className="text-xs text-slate-500">Session 2026-2027</p>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-600">
                                Registration for entrance examinations for Grade XI (Science, Commerce, Arts) is now open until June 30th.
                            </p>
                            <div className="mt-6 space-y-3 border-t pt-4 text-sm">
                                <div className="flex justify-between"><span className="text-slate-500">Status:</span> <span className="font-bold text-green-600 uppercase">Open</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Next Entrance:</span> <span className="font-bold">July 12, 2026</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- STATS STRIP --- */}
                <section className="relative z-10 -mt-12 mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-8 shadow-xl md:grid-cols-4">
                        {[
                            { label: "Active Students", value: "2500+", icon: "👥" },
                            { label: "Years of Excellence", value: "35+", icon: "🏆" },
                            { label: "Academic Streams", value: "12+", icon: "📚" },
                            { label: "Qualified Teachers", value: "120+", icon: "🎓" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                                <p className="text-xs uppercase tracking-wider text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- CURRICULUM SECTION --- */}
                <section className="mx-auto max-w-7xl px-6 py-24">
                    <div className="mb-12 text-center lg:text-left">
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Our Curriculum</span>
                        <h2 className="mt-2 font-serif text-4xl font-bold text-[#0a0a35]">Academic Pathways to Future Success</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            { title: "Science", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80", color: "from-blue-900" },
                            { title: "Commerce", img: "https://images.unsplash.com/photo-1454165833222-38d722548571?auto=format&fit=crop&q=80", color: "from-amber-900" },
                            { title: "Humanities", img: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80", color: "from-purple-900" },
                        ].map((stream) => (
                            <div key={stream.title} className="group relative h-[400px] cursor-pointer overflow-hidden rounded-2xl transition-all hover:-translate-y-2">
                                <img src={stream.img} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={stream.title} />
                                <div className={`absolute inset-0 bg-gradient-to-t ${stream.color} to-transparent opacity-80`} />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <h3 className="text-2xl font-bold">{stream.title}</h3>
                                    <p className="mt-2 text-sm text-slate-200">Explore Curriculum →</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- EVENTS & ALUMNI --- */}
                <section className="bg-slate-100 py-24">
                    <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2">
                        {/* Events */}
                        <div>
                            <h2 className="mb-8 font-serif text-3xl font-bold">Upcoming Events</h2>
                            <div className="space-y-4">
                                {[
                                    { date: "NOV 15", title: "Annual Inter-School Sports Meet", loc: "Main Grounds" },
                                    { date: "DEC 02", title: "Career Counseling Workshop", loc: "Auditorium" },
                                ].map((event) => (
                                    <div key={event.title} className="flex items-center gap-6 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                                        <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 px-4 py-2 text-primary">
                                            <span className="text-xs font-bold">{event.date.split(' ')[0]}</span>
                                            <span className="text-xl font-black">{event.date.split(' ')[1]}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{event.title}</h4>
                                            <p className="text-sm text-slate-500">{event.loc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div>
                            <h2 className="mb-8 font-serif text-3xl font-bold text-right">Alumni Voices</h2>
                            <div className="relative rounded-2xl bg-[#0a0a35] p-10 text-white">
                                <Quote className="absolute right-6 top-6 h-12 w-12 text-white/10" />
                                <p className="italic leading-relaxed text-slate-300">
                                    "The guidance I received at BJP Memorial wasn't just academic; it was architectural for my character. The teachers instilled a discipline that serves me as a Senior Surgeon today."
                                </p>
                                <div className="mt-8 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-500" />
                                    <div>
                                        <p className="font-bold">Dr. Aryan Sharma</p>
                                        <p className="text-xs text-slate-400">Batch of 2008 | Senior Surgeon, AIIMS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FINAL CTA --- */}
                <section className="bg-[#0a0a35] py-20 text-center text-white">
                    <h2 className="font-serif text-4xl font-bold">Ready to Define Your Future?</h2>
                    <p className="mt-4 text-slate-400">Join a heritage of academic excellence and holistic development.</p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link to="/admission" className="rounded-md bg-[#ffb400] px-8 py-3 font-bold text-[#0a0a35]">Apply Now</Link>
                        <button className="rounded-md border border-white/20 px-8 py-3 font-bold hover:bg-white/10">Download Prospectus</button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;