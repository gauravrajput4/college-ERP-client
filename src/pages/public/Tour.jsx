import { useState } from "react";
import { MapPin, ArrowRight, Play, Info, Layers, Maximize } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const tourPoints = [
    {
        id: "campus",
        title: "Main Gate & Porch",
        desc: "The Iconic Entrance",
        image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80",
        details: "Established in 1988, the main porch represents our architectural heritage."
    },
    {
        id: "labs",
        title: "Advanced Science Labs",
        desc: "Discovery Center",
        image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80",
        details: "State-of-the-art physics and chemistry labs equipped with modern apparatus."
    },
    {
        id: "library",
        title: "Heritage Library",
        desc: "Archive of Knowledge",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80",
        details: "Over 12,000 volumes and digital research access for all students."
    },
    {
        id: "sports",
        title: "Athletic Pavilion",
        desc: "Outdoor Grounds",
        image: "https://images.unsplash.com/photo-1526676023131-d356ede0be39?auto=format&fit=crop&q=80",
        details: "A 400m track and multi-purpose courts for football, cricket, and basketball."
    },
];

const Tour = () => {
    const [activePoint, setActivePoint] = useState(tourPoints[0]);

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            <Navbar />

            {/* --- HEADER --- */}
            <section className="bg-[#0a0a35] py-12 text-white">
                <div className="mx-auto max-w-7xl px-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">Digital Walkthrough</span>
                    <h1 className="mt-2 font-serif text-4xl font-bold">Virtual Campus Tour</h1>
                </div>
            </section>

            <main className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[350px_1fr]">

                {/* --- LEFT SIDEBAR NAV --- */}
                <aside className="space-y-4">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="mb-6 font-serif text-xl font-bold text-primary">Tour Landmarks</h2>
                        <nav className="space-y-3">
                            {tourPoints.map((point) => (
                                <button
                                    key={point.id}
                                    onClick={() => setActivePoint(point)}
                                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                                        activePoint.id === point.id
                                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                                            : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    <div className={`rounded-lg p-2 ${activePoint.id === point.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-900">{point.title}</h4>
                                        <p className="text-[11px] text-slate-500 uppercase tracking-tight">{point.desc}</p>
                                    </div>
                                    {activePoint.id === point.id && <ArrowRight size={16} className="text-primary" />}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Additional Info Card */}
                    <div className="rounded-2xl bg-accent p-6 text-[#0a0a35]">
                        <Info className="mb-3" />
                        <h4 className="font-bold">Need a Guided Tour?</h4>
                        <p className="mt-2 text-sm opacity-80">Our admissions office hosts physical campus walks every Saturday at 10:00 AM.</p>
                        <button className="mt-4 flex items-center gap-2 text-sm font-bold underline">
                            Book a Visit <ArrowRight size={14} />
                        </button>
                    </div>
                </aside>

                {/* --- RIGHT VIEWPORT --- */}
                <div className="space-y-6">
                    <div className="relative aspect-video overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
                        {/* The Image/Video Viewport */}
                        <img
                            src={activePoint.image}
                            alt={activePoint.title}
                            className="h-full w-full object-cover opacity-80 transition-opacity duration-500"
                        />

                        {/* Interactive Overlay UI */}
                        <div className="absolute inset-0 flex flex-col justify-between p-8">
                            <div className="flex justify-between items-start">
                <span className="rounded-full bg-black/40 px-4 py-2 text-xs font-bold text-white backdrop-blur-md border border-white/20">
                  {activePoint.title}
                </span>
                                <div className="flex gap-2">
                                    <button className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md hover:bg-white/30">
                                        <Layers size={20} />
                                    </button>
                                    <button className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md hover:bg-white/30">
                                        <Maximize size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Playback Controls (Aesthetic) */}
                            <div className="flex items-center justify-center">
                                <button className="group flex h-20 w-20 items-center justify-center rounded-full bg-accent text-[#0a0a35] shadow-xl transition-transform hover:scale-110">
                                    <Play fill="currentColor" size={32} className="ml-1" />
                                </button>
                            </div>

                            <div className="flex justify-center">
                                <div className="flex items-center gap-6 rounded-full bg-white/90 px-8 py-3 text-[11px] font-bold text-[#0a0a35] backdrop-blur-sm shadow-lg">
                                    <button className="opacity-50 hover:opacity-100">PREVIOUS</button>
                                    <span className="h-4 w-[1px] bg-slate-300" />
                                    <span className="uppercase tracking-widest">{activePoint.title}</span>
                                    <span className="h-4 w-[1px] bg-slate-300" />
                                    <button className="opacity-50 hover:opacity-100">NEXT</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description below viewport */}
                    <div className="rounded-2xl bg-white p-8 shadow-sm">
                        <h3 className="font-serif text-2xl font-bold text-[#0a0a35]">{activePoint.title}</h3>
                        <p className="mt-4 leading-relaxed text-slate-600">
                            {activePoint.details}
                        </p>
                        <div className="mt-6 flex gap-4">
                            <div className="rounded-lg bg-slate-50 px-4 py-3">
                                <p className="text-[10px] uppercase text-slate-400 font-bold">Capacity</p>
                                <p className="text-sm font-bold">250+ Students</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 px-4 py-3">
                                <p className="text-[10px] uppercase text-slate-400 font-bold">WiFi Zone</p>
                                <p className="text-sm font-bold">Enabled</p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default Tour;