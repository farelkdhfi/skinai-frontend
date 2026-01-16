import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useInView,
    AnimatePresence
} from 'framer-motion';
import {
    ArrowRight, ArrowUpRight, Play, Star,
    Atom, ScanFace, ShieldCheck, Zap,
    AlertTriangle, HeartHandshake, CalendarCheck, Sun, BookOpen,
    Microscope, Lightbulb, Grid, Activity, Fingerprint, Layers
} from 'lucide-react';

// --- ASSETS (Pastikan path ini sesuai dengan struktur folder kamu) ---
import { Header } from '../components/Header'; // Asumsi Header sudah ada
import { ROUTES } from '../config';

import HeroImg from '../assets/fullface.png';
import faceAnalysisImg from '../assets/facewithhandphone.jpg';
import processAnalysisImg from '../assets/processAnalysis.jpg';
import resultAnalysisImg from '../assets/resultAnalysis.jpg';
import patchImg from '../assets/patch.jpg';
import heatmapImg from '../assets/heatmap.jpg';

// Ingredients Assets
import ingredients1 from '../assets/ingredients/1.jpg';
import ingredients2 from '../assets/ingredients/2.jpg';
import ingredients3 from '../assets/ingredients/3.jpg';
import ingredients4 from '../assets/ingredients/4.jpg';

// Logo Assets
import LogoJs from '../assets/logo/logo_js.png';
import LogoExpress from '../assets/logo/logo_expressjs.png';
import LogoMediapipe from '../assets/logo/logo_mediapipe.png';
import LogoNodejs from '../assets/logo/logo_nodejs.png';
import LogoReactjs from '../assets/logo/logo_reactjs.png';
import LogoSupabase from '../assets/logo/logo_supabase.png';
import LogoMobilenetv2 from '../assets/logo/logo_mobilenetv2.png';

// Video
import VideoDemo from '../assets/video/demo.mp4';
import ClosingVid from '../assets/video/closing.mp4';
import faceScan from '../assets/video/facescan2.mp4';

// --- DATA DEFINITIONS ---

const TECH_STACK = [
    { label: 'Model', value: 'MobileNetV2', image: LogoMobilenetv2 },
    { label: 'Vision', value: 'MediaPipe', image: LogoMediapipe },
    { label: 'Frontend', value: 'React.js', image: LogoReactjs },
    { label: 'Backend', value: 'Express', image: LogoExpress },
    { label: 'Database', value: 'Supabase', image: LogoSupabase },
];

const ACTIVE_INGREDIENTS = [
    {
        id: 1,
        name: "Salicylic Cluster",
        role: "Acne Combat",
        text: "Menargetkan bakteri P. acnes dan mengurangi inflamasi aktif.",
        image: ingredients1,
        color: "from-red-500/20 to-orange-500/20"
    },
    {
        id: 2,
        name: "Niacinamide+",
        role: "Sebum Control",
        text: "Regulasi produksi minyak berlebih dan mengecilkan tampilan pori.",
        image: ingredients2,
        color: "from-blue-500/20 to-cyan-500/20"
    },
    {
        id: 3,
        name: "Hyaluronic Matrix",
        role: "Deep Hydration",
        text: "Menjaga skin barrier tetap utuh pada kulit normal hingga kering.",
        image: ingredients3,
        color: "from-indigo-500/20 to-purple-500/20"
    },
    {
        id: 4,
        name: "AHA/BHA Complex",
        role: "Resurfacing",
        text: "Eksfoliasi kimiawi untuk memperbaiki tekstur mikro kulit.",
        image: ingredients4,
        color: "from-emerald-500/20 to-teal-500/20"
    }
];

// --- UTILITY COMPONENTS ---

const SectionHeading = ({ subtitle, title, light = false }) => (
    <div className="mb-12 md:mb-20">
        <div className="flex items-center gap-3 mb-4">
            <span className={`h-px w-8 ${light ? 'bg-white/30' : 'bg-black/20'}`}></span>
            <span className={`text-xs font-bold tracking-[0.2em] uppercase ${light ? 'text-white/60' : 'text-neutral-500'}`}>
                {subtitle}
            </span>
        </div>
        <h2 className={`text-4xl md:text-6xl font-medium tracking-tight leading-[1.1] ${light ? 'text-white' : 'text-neutral-900'}`}>
            {title}
        </h2>
    </div>
);

const ParallaxImage = ({ src, alt }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

    return (
        <div ref={ref} className="relative w-full h-full overflow-hidden rounded-[2rem] shadow-2xl bg-neutral-900 border border-white/10 group">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 z-20 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none" />
            
            <motion.div style={{ y, scale }} className="w-full h-full">
                <img src={src} alt={alt} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>

            {/* UI Mockup Overlay (Phone Frame Hint) */}
            <div className="absolute inset-x-0 bottom-6 mx-auto w-1/3 h-1.5 bg-white/20 backdrop-blur-md rounded-full z-30" />
        </div>
    );
};

// --- SECTIONS ---

const HeroSection = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);

    return (
        <section className="relative min-h-screen flex flex-col pt-32 pb-20 px-6 md:px-12 bg-[#050505] text-white overflow-hidden">
            {/* Background Grain/Gradient */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 z-10">
                {/* Left: Typography */}
                <motion.div style={{ y: y1 }} className="lg:col-span-7 flex flex-col justify-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm w-fit mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium tracking-widest text-neutral-300">THESIS RESEARCH PROJECT</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-medium leading-[0.9] tracking-tight mb-8">
                        Dermatology <br />
                        <span className="font-serif italic text-neutral-400">Reimagined.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed mb-10">
                        Sistem analisis kulit berbasis Deep Learning (MobileNetV2) dengan pendekatan 
                        <span className="text-white mx-1">patch-based</span> 
                        untuk mendeteksi mikro-tekstur wajah secara presisi.
                    </p>

                    <div className="flex items-center gap-4">
                        <Link to={ROUTES?.ANALYZE || '#'} className="group relative px-8 py-4 bg-white text-black rounded-full font-medium overflow-hidden">
                            <div className="absolute inset-0 bg-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center gap-2">
                                Start Analysis <ArrowRight size={18} />
                            </span>
                        </Link>
                        <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-colors text-white font-medium flex items-center gap-2">
                            <Play size={16} fill="currentColor" /> Watch Demo
                        </button>
                    </div>
                </motion.div>

                {/* Right: Visual */}
                <motion.div style={{ y: y2 }} className="lg:col-span-5 relative h-[60vh] lg:h-auto">
                    <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/10">
                         <ParallaxImage src={HeroImg} alt="Hero" />
                         
                         {/* Floating Stats Card */}
                         <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-[200px]"
                         >
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-neutral-400 text-xs uppercase tracking-wider">Accuracy</span>
                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                             </div>
                             <div className="text-3xl font-bold text-white">94.8%</div>
                             <div className="text-xs text-neutral-500 mt-1">on Validation Set</div>
                         </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const TechnologySection = () => {
    return (
        <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <h3 className="text-white text-3xl font-medium mb-2">Powered by Modern Stack</h3>
                        <p className="text-neutral-500">Dibangun dengan teknologi industri standar tinggi.</p>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
                        {TECH_STACK.map((tech, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 shrink-0">
                                <img src={tech.image} className="w-5 h-5 object-contain" alt={tech.label} />
                                <span className="text-sm font-medium text-neutral-300">{tech.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { 
                            title: "Smart Guidance", 
                            desc: "Validasi posisi wajah & pencahayaan real-time menggunakan MediaPipe Mesh.",
                            icon: ScanFace,
                            video: VideoDemo 
                        },
                        { 
                            title: "Patch Learning", 
                            desc: "Isolasi area (Dahi, Pipi, Hidung) untuk menghindari bias pada fitur non-kulit.",
                            icon: Layers,
                            img: patchImg
                        },
                        { 
                            title: "Explainable AI", 
                            desc: "Transparansi keputusan model dengan visualisasi Heatmap Grad-CAM.",
                            icon: Lightbulb,
                            img: heatmapImg
                        }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative h-[400px] rounded-[2rem] overflow-hidden border border-white/10 bg-neutral-900/50"
                        >
                            <div className="absolute inset-0 z-0">
                                {item.video ? (
                                    <video src={item.video} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                ) : (
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
                            </div>
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/10 text-white">
                                    <item.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-2xl font-medium text-white mb-2">{item.title}</h4>
                                <p className="text-neutral-400 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProcessScrollSection = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

    const steps = [
        { id: "01", title: "Face Capture", desc: "Pengambilan citra dengan panduan grid otomatis.", img: faceAnalysisImg },
        { id: "02", title: "Segmentation", desc: "Pemisahan area ROI (Region of Interest) secara presisi.", img: processAnalysisImg },
        { id: "03", title: "Deep Inference", desc: "MobileNetV2 memproses patch tekstur mikro.", img: patchImg },
        { id: "04", title: "Result & Heatmap", desc: "Diagnosis akhir dengan validasi area terdampak.", img: resultAnalysisImg },
    ];

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[#f2f2f0]">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <div className="absolute top-10 left-6 md:left-12 z-20">
                     <h2 className="text-neutral-900 text-3xl font-medium flex items-center gap-2">
                        <Activity className="text-blue-600" /> Workflow
                     </h2>
                </div>

                <motion.div style={{ x }} className="flex gap-10 px-6 md:px-12">
                    {steps.map((step, i) => (
                        <div key={i} className="relative w-[85vw] md:w-[60vw] h-[70vh] flex-shrink-0 rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-neutral-200 group">
                            <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20 mix-blend-difference text-white">
                                <span className="text-8xl font-bold opacity-30 tracking-tighter">{step.id}</span>
                                <h3 className="text-4xl md:text-5xl font-medium mt-[-20px]">{step.title}</h3>
                                <p className="mt-4 max-w-md text-lg opacity-80">{step.desc}</p>
                            </div>
                            
                            <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const DashboardSection = () => {
    return (
        <section className="py-32 px-6 md:px-12 bg-[#050505] text-white">
            <div className="max-w-[1400px] mx-auto">
                <SectionHeading subtitle="Your Dashboard" title="Daily Monitoring Ecosystem" light />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                    {/* BENTO GRID 1: Consistency (Large) */}
                    <div className="md:col-span-5 relative bg-neutral-900/50 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><CalendarCheck size={20} /></div>
                                <span className="text-sm font-medium text-neutral-400">Streak</span>
                            </div>
                            <h4 className="text-4xl font-medium text-white">7 Days</h4>
                            <p className="text-neutral-500 mt-1">Consistency Score: Excellent</p>
                        </div>
                        
                        {/* Abstract Graph Visualization */}
                        <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-between px-8 pb-8 gap-2">
                             {[40, 60, 35, 80, 50, 90, 75].map((h, i) => (
                                 <motion.div 
                                    key={i}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${h}%` }}
                                    transition={{ delay: i*0.1, duration: 1 }}
                                    className="w-full bg-neutral-800 rounded-t-md group-hover:bg-blue-600 transition-colors duration-500"
                                 />
                             ))}
                        </div>
                    </div>

                    {/* BENTO GRID 2: Realtime Analysis (Medium) */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <div className="flex-1 bg-neutral-900/50 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-20"><Fingerprint size={100} /></div>
                             <h4 className="text-2xl font-medium mb-4">Texture Depth</h4>
                             <div className="flex items-end gap-2">
                                <span className="text-5xl font-bold tracking-tighter">0.04</span>
                                <span className="text-neutral-500 mb-2">mm variance</span>
                             </div>
                        </div>
                        <div className="flex-1 bg-white text-black border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer hover:bg-neutral-200 transition-colors">
                             <div>
                                <h4 className="text-xl font-bold">Start Daily Scan</h4>
                                <p className="text-neutral-600 text-sm">Recommended: 08:00 AM</p>
                             </div>
                             <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition-transform">
                                 <ArrowUpRight />
                             </div>
                        </div>
                    </div>

                    {/* BENTO GRID 3: Skin Type (Tall) */}
                    <div className="md:col-span-3 bg-gradient-to-b from-neutral-800 to-black border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                         <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                             <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-6 animate-spin-slow">
                                <ScanFace size={40} className="text-white" />
                             </div>
                             <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-2">Current Type</h4>
                             <h3 className="text-4xl font-serif italic text-white">Oily/Acne</h3>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Recommendations = () => {
    const [active, setActive] = useState(0);

    return (
        <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
             {/* Background Blur Spot */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <SectionHeading subtitle="Smart Care" title="Personalized Ingredients" light />

                <div className="flex flex-col lg:flex-row gap-6 h-[600px] lg:h-[500px]">
                    {ACTIVE_INGREDIENTS.map((item, i) => {
                        const isActive = active === i;
                        return (
                            <motion.div
                                key={item.id}
                                onClick={() => setActive(i)}
                                className={`relative rounded-[2rem] overflow-hidden cursor-pointer transition-[flex] duration-700 ease-out border border-white/10
                                    ${isActive ? 'lg:flex-[3] flex-[3]' : 'lg:flex-[1] flex-[1] grayscale hover:grayscale-0'}
                                `}
                            >
                                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-90' : 'opacity-60'}`} />
                                
                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className={`transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70'}`}>
                                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            {isActive && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                                            {item.role}
                                        </p>
                                        <h3 className={`font-medium text-white mb-2 ${isActive ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                                            {item.name}
                                        </h3>
                                        {isActive && (
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-neutral-400 max-w-lg mt-4 leading-relaxed"
                                            >
                                                {item.text}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const Disclaimer = () => {
    return (
        <section className="py-20 bg-[#050505] border-t border-white/5 text-center px-6">
            <div className="max-w-2xl mx-auto bg-neutral-900/30 border border-white/5 rounded-3xl p-10 backdrop-blur-sm">
                <ShieldCheck size={40} className="mx-auto text-neutral-500 mb-6" />
                <h3 className="text-white text-xl font-medium mb-4">Research Purpose Only</h3>
                <p className="text-neutral-500 leading-relaxed text-sm md:text-base">
                    Sistem ini dikembangkan sebagai bagian dari Skripsi Teknik Informatika Universitas Siliwangi. 
                    Hasil prediksi model MobileNetV2 bersifat komputasional dan <span className="text-white font-medium">tidak menggantikan diagnosis medis</span> profesional.
                </p>
            </div>
        </section>
    );
};

// --- MAIN COMPONENT ---

const HomePage = () => {
    return (
        <div className="bg-[#050505] min-h-screen selection:bg-white selection:text-black font-sans">
            <Header /> {/* Pastikan Header mendukung dark mode/transparan */}
            
            <main>
                <HeroSection />
                <TechnologySection />
                <ProcessScrollSection />
                <DashboardSection />
                <Recommendations />
                <Disclaimer />
            </main>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-white/10 bg-[#050505] text-neutral-500 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} SKinAI Research Project. Universitas Siliwangi.</p>
            </footer>
        </div>
    );
}

export default HomePage;