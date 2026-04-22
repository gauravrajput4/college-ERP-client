import { useMemo, useState } from "react";
import { Play, MapPin, Camera, Info, MoveRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getGallery } from "../../api/public.api";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";

const categories = ["All Collections", "Campus", "Events", "Sports", "Labs"];

const Gallery = () => {
    const [category, setCategory] = useState("All Collections");
    const [selected, setSelected] = useState(null);
    const galleryState = useFetch(() => getGallery(category === "All Collections" ? "All" : category), [category]);

    const items = useMemo(() => galleryState.data || [], [galleryState.data]);

    return (
        <div className="bg-[#fcfcfd]">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden text-white">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80"
                        className="h-full w-full object-cover brightness-50"
                        alt="Campus Header"
                    />
                </div>
                <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
          <span className="mb-4 inline-block rounded-md bg-[#ffb400] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0a0a35]">
            Visual Archive
          </span>
                    <h1 className="font-serif text-5xl font-bold md:text-7xl">
                        The Legacy in <br /> <span className="text-accent italic">Frames</span>
                    </h1>
                    <p className="mt-6 max-w-lg text-lg text-slate-200">
                        Experience our architectural heritage and vibrant campus life through our curated visual gallery and interactive virtual journey.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 py-20">
                {/* --- FILTER & HEADER --- */}
                <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
                    <div className="max-w-md text-left">
                        <h2 className="font-serif text-4xl font-bold text-[#0a0a35]">Institutional Gallery</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Capturing moments of academic excellence, athletic spirit, and the evolving campus landscape.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 rounded-full bg-slate-100 p-1">
                        {categories.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setCategory(tab)}
                                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                                    category === tab ? "bg-[#0a0a35] text-white shadow-md" : "text-slate-500 hover:text-[#0a0a35]"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- GRID GALLERY --- */}
                {galleryState.loading ? (
                    <Loader />
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
                            {/* Feature Large Card */}
                            <div
                                className="group relative cursor-pointer overflow-hidden rounded-2xl md:col-span-8 md:row-span-2"
                                onClick={() => setSelected(items[0])}
                            >
                                <img src={items[0]?.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80"} className="h-full min-h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Graduation" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>

                            {/* Top Right Card */}
                            <div className="group relative cursor-pointer overflow-hidden rounded-2xl md:col-span-4" onClick={() => setSelected(items[1])}>
                                <img src={items[1]?.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?q=80"} className="h-[250px] w-full object-cover transition-transform group-hover:scale-110" alt="Campus" />
                            </div>

                            {/* Bottom Right Card */}
                            <div className="group relative cursor-pointer overflow-hidden rounded-2xl md:col-span-4" onClick={() => setSelected(items[2])}>
                                <img src={items[2]?.imageUrl || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80"} className="h-[250px] w-full object-cover transition-transform group-hover:scale-110" alt="Library" />
                            </div>
                        </div>

                        {/* Smaller Row */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="group relative cursor-pointer overflow-hidden rounded-2xl h-[200px]" onClick={() => setSelected(items[3])}>
                                <img src={items[3]?.imageUrl || "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80"} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Lab" />
                            </div>
                            <div className="group relative cursor-pointer overflow-hidden rounded-2xl h-[200px]" onClick={() => setSelected(items[4])}>
                                <img src={items[4]?.imageUrl || "https://images.unsplash.com/photo-1526676023131-d356ede0be39?q=80"} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Sports" />
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button className="flex items-center gap-2 rounded-lg border border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                                View More Collections <MoveRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- VIRTUAL CAMPUS SECTION --- */}
                <section className="mt-32 rounded-3xl bg-[#f0f2f5] p-8 md:p-16">
                    <div className="grid gap-16 lg:grid-cols-2">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Digital Walkthrough</span>
                            <h2 className="mt-2 font-serif text-4xl font-bold text-[#0a0a35]">Virtual Campus</h2>
                            <p className="mt-6 text-slate-500">
                                Navigate through the corridors of BJP Memorial Inter College from anywhere in the world. Click on a landmark to start your tour.
                            </p>

                            <div className="mt-10 space-y-3">
                                {[
                                    { icon: <MapPin size={18}/>, title: "Main Gate & Porch", desc: "The Iconic Entrance" },
                                    { icon: <Info size={18}/>, title: "Administrative Office", desc: "Portal Access" },
                                    { icon: <Camera size={18}/>, title: "Advanced Science Labs", desc: "Discovery Center" },
                                ].map((point, idx) => (
                                    <div key={idx} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-transform hover:translate-x-2 cursor-pointer">
                                        <div className="rounded-lg bg-slate-100 p-2 text-primary">{point.icon}</div>
                                        <div>
                                            <h4 className="text-sm font-bold">{point.title}</h4>
                                            <p className="text-[10px] text-slate-400">{point.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-xl bg-[#0a0a35] py-4 font-bold text-white shadow-lg">
                                <Play size={18} fill="white" /> Start Guided Tour
                            </button>
                        </div>

                        {/* Virtual Tour Viewport */}
                        <div className="group relative h-[500px] overflow-hidden rounded-3xl bg-slate-800 shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80" className="h-full w-full object-cover opacity-60" alt="Virtual Hall" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Hotspots */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/30 p-1 backdrop-blur-md animate-pulse cursor-pointer">
                                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-primary">i</div>
                                </div>
                                <div className="absolute top-2/3 right-1/4 h-8 w-8 rounded-full bg-white/30 p-1 backdrop-blur-md cursor-pointer">
                                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-primary">i</div>
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 rounded-full bg-white/90 px-6 py-2 text-[10px] font-bold text-[#0a0a35] backdrop-blur-sm">
                                <span>{"<"}</span>
                                <span>POINT 01: MAIN PORCH</span>
                                <span>{">"}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- NEWSLETTER SECTION --- */}
            <section className="bg-white py-24 text-center">
                <h2 className="font-serif text-3xl font-bold text-[#0a0a35]">Stay Connected to the Legacy</h2>
                <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500">
                    Sign up for our quarterly visual gazette to receive highlights of campus events, alumni stories, and institutional growth.
                </p>
                <div className="mx-auto mt-10 flex max-w-md gap-2">
                    <input
                        type="email"
                        placeholder="Your Email Address"
                        className="flex-1 rounded-lg bg-slate-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="rounded-lg bg-[#ffb400] px-6 py-3 text-sm font-bold text-[#0a0a35]">Subscribe</button>
                </div>
            </section>

            <Footer />

            <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.caption || "Preview"}>
                {selected && (
                    <div className="p-2">
                        <img src={selected.imageUrl} alt={selected.caption} className="w-full rounded-xl object-cover" />
                        <p className="mt-4 text-center font-medium text-slate-700">{selected.caption}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Gallery;