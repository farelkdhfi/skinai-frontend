import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from 'framer-motion';
import {
    ArrowRight, ArrowUpRight, Play, Star,
    Atom, ScanFace, ShieldCheck, Zap,
    AlertTriangle, HeartHandshake, CalendarCheck, Sun, BookOpen,
    Microscope, Lightbulb, Grid
} from 'lucide-react';

// --- ASSETS ---
import { Header } from '../components/Header';
import { ROUTES } from '../config';

import HeroImg from '../assets/fullface.png';
import faceAnalysisImg from '../assets/facewithhandphone.jpg';
import processAnalysisImg from '../assets/processAnalysis.jpg';
import resultAnalysisImg from '../assets/resultAnalysis.jpg';
import patchImg from '../assets/patch.jpg';
import heatmapImg from '../assets/heatmap.jpg';

// Ingredients Assets
import ingredients1 from '../assets/ingredients/1.jpg'
import ingredients2 from '../assets/ingredients/2.jpg'
import ingredients3 from '../assets/ingredients/3.jpg'
import ingredients4 from '../assets/ingredients/4.jpg'

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
    { label: 'Backend', value: 'Express.js', image: LogoExpress },
    { label: 'Backend', value: 'Node.js', image: LogoNodejs },
    { label: 'Database', value: 'Supabase', image: LogoSupabase },
    { label: 'Lang', value: 'JavaScript', image: LogoJs },
];

const ACTIVE_INGREDIENTS = [
    {
        id: 1,
        name: "Anti-Acne Cluster",
        role: "Inflammation Control",
        text: "Kelompok bahan aktif seperti Salicylic Acid & Tea Tree Oil.",
        image: ingredients1,
        avatar: ingredients1,
    },
    {
        id: 2,
        name: "Sebum Control",
        role: "Oil Regulation",
        text: "Cluster Niacinamide & Zinc untuk mengontrol minyak berlebih.",
        image: ingredients2,
        avatar: ingredients2,
    },
    {
        id: 3,
        name: "Barrier Support",
        role: "Hydration",
        text: "Cluster Hyaluronic Acid & Ceramides untuk kulit normal/kering.",
        image: ingredients3,
        avatar: ingredients3,
    },
    {
        id: 4,
        name: "Exfoliating Agent",
        role: "Texture Refining",
        text: "AHA/BHA cluster untuk memperbaiki tekstur mikro kulit.",
        image: ingredients4,
        avatar: ingredients4,
    }
];

// --- UTILITY COMPONENTS ---

const ParallaxImage = ({ src, alt, className, speed = 1 }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Gerakan parallax dan scale
    const y = useTransform(scrollYProgress, [0, 1], [-50 * speed, 50 * speed]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

    return (
        <div ref={ref} className={`flex items-center justify-center ${className} backdrop-blur-lg`}>
            {/* --- PHONE FRAME CONTAINER --- */}
            <div className="relative w-full h-full md:max-w-[95%] md:max-h-[100%]">

                {/* 1. Body Handphone (Bezel & Frame) */}
                <div className="relative w-full h-full bg-[#121212] border-[12px] md:border-[16px] border-[#121212] rounded-[3.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10 z-10">

                    {/* 2. Dynamic Island / Notch (Top Center) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-30 pointer-events-none"></div>

                    {/* 3. Screen Area (Masking the Parallax Image) */}
                    <div className="relative w-full h-full bg-linear-to-t from-black/10 via-white to-white rounded-[2.5rem] overflow-hidden">

                        {/* The Moving Image */}
                        <motion.img
                            style={{ y, scale }}
                            src={src}
                            alt={alt}
                            className="w-full h-full object-cover will-change-transform"
                        />

                        {/* 4. Glass/Gloss Reflection Effect (Overlay) */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-20 rounded-[2.5rem]" />

                        {/* Inner Border for depth */}
                        <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none z-20"></div>
                    </div>
                </div>

                {/* 5. Physical Buttons (Cosmetic side buttons) */}
                {/* Power Button (Right) */}
                <div className="absolute top-32 -right-[15px] md:-right-[19px] w-[3px] h-16 bg-[#222] rounded-r-md shadow-sm border-l border-white/10"></div>
                {/* Volume Up (Left) */}
                <div className="absolute top-32 -left-[15px] md:-left-[19px] w-[3px] h-12 bg-[#222] rounded-l-md shadow-sm border-r border-white/10"></div>
                {/* Volume Down (Left) */}
                <div className="absolute top-48 -left-[15px] md:-left-[19px] w-[3px] h-12 bg-[#222] rounded-l-md shadow-sm border-r border-white/10"></div>
            </div>
        </div>
    );
};

const CardStackItem = ({ data, index }) => {
    return (
        <div className="sticky top-40 mb-20 md:mb-40 last:mb-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`${data.color} rounded-[2.5rem] p-4 md:p-8 grid md:grid-cols-2 shadow-xl bg-neutral-100 relative overflow-hidden h-[500px]`}
            >
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 md:mb-6">
                        {data.icon}
                    </div>
                    <h3 className="md:text-3xl text-2xl font-medium md:mb-4">{data.title}</h3>
                    <p className="text-neutral-600 md:text-lg text-sm max-w-sm">{data.desc}</p>
                </div>
                <div className="md:absolute mt-4 md:mt-0 right-0 bottom-0 w-full md:w-1/2 h-full md:h-full  rounded-tl-[3rem] overflow-hidden shadow-2xl border-t border-l border-white/50 bg-white">
                    {data.isVideo ? (
                        <video src={data.img} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                    ) : (
                        <img src={data.img} alt={data.title} className="w-full h-full object-cover" />
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const HorizontalProcessSection = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

    const steps = [
        { id: "01", title: "Face Scan", desc: "Posisikan wajah Anda di depan kamera dalam pencahayaan yang cukup.", img: faceAnalysisImg },
        { id: "02", title: "AI Analysis", desc: "Ekstraksi otomatis area Dahi, Pipi, dan Hidung untuk memindai tekstur, minyak, dan lesi kulit.", img: processAnalysisImg },
        { id: "03", title: "Result", desc: "Diagnosis dilengkapi heatmap Grad-CAM untuk transparansi dan rekomendasi berbasis clustering.", img: resultAnalysisImg },
    ];

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-neutral-900 text-white">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-0">
                    {steps.map((step, i) => (
                        <div key={i} className="w-screen h-screen flex flex-col md:flex-row items-center justify-center p-10 md:p-20 shrink-0 gap-5 md:gap-10">
                            <div className="w-full md:w-1/2 space-y-5 md:space-y-6">
                                <span className="md:text-8xl text-8xl font-bold text-white/10 block">{step.id}</span>
                                <h3 className="text-4xl md:text-6xl font-medium">{step.title}</h3>
                                <p className="text-neutral-400 text-sm md:text-xl max-w-md leading-relaxed">{step.desc}</p>
                            </div>
                            <div className="w-full md:w-1/2 h-[40vh] md:h-[60vh] bg-neutral-800 rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/10">
                                <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const DailyRoutineSection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax logic: Kolom kiri naik lebih cepat, kolom kanan sedikit tertahan
    const yLeft = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const yRight = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <section ref={ref} className="py-20 px-6 md:px-16 bg-[#F8F8F7] relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <motion.div style={{ opacity }} className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Daily Monitoring</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-[0.9] text-[#111]">
                            Your Skin <br />
                            <span className="font-serif italic text-neutral-400">Journey.</span>
                        </h2>
                    </motion.div>
                    <motion.p style={{ opacity }} className="text-neutral-500 text-lg max-w-sm leading-relaxed mb-2">
                        Pantau progres kesehatan kulit harian Anda melalui dashboard terintegrasi yang mencatat setiap perubahan tekstur mikro.
                    </motion.p>
                </div>

                {/* Grid Content - 1:1 Ratio Focus */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">

                    {/* LEFT COLUMN (Calendar/Routine) */}
                    <motion.div style={{ y: yLeft }} className="flex flex-col gap-8">
                        {/* Card 1: Square Aspect Ratio */}
                        <div className="group relative aspect-square w-full bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-neutral-200/50 overflow-hidden p-8 flex flex-col justify-between hover:border-black/10 transition-colors duration-500">

                            <video src={faceScan} autoPlay muted playsInline loop className='absolute w-full h-full object-cover top-0 left-0 z-0 pointer-events-none opacity-90' />
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center text-white">
                                    <CalendarCheck size={26} strokeWidth={1.5} />
                                </div>
                                <div className="bg-black/10 text-white px-4 py-1.5 rounded-full text-sm font-medium border border-white">
                                    On Track
                                </div>
                            </div>

                            <div className="relative z-10 mt-auto text-white bg-black/10 rounded-2xl p-6 border border-white/20">
                                <h3 className="text-3xl font-medium mb-2">Consistency Tracker</h3>
                                <p className=" mb-8">Visualisasi konsistensi perawatan harian Anda.</p>

                                <div className="flex justify-between items-end gap-2 h-32">
                                    {[65, 40, 75, 50, 90, 85, 100].map((h, i) => (
                                        <div key={i} className="w-full bg-neutral-100 rounded-t-xl relative overflow-hidden group-hover:bg-blue-50 transition-colors duration-500">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                whileInView={{ height: `${h}%` }}
                                                transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                                                className="absolute bottom-0 w-full bg-neutral-900 rounded-t-xl"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN (Analysis/Graph) */}
                    <motion.div style={{ y: yRight }} className="flex flex-col gap-8 md:pt-32">
                        {/* Card 2: Square Aspect Ratio */}
                        <div className="group relative aspect-square w-full bg-[#111] rounded-[2.5rem] shadow-2xl overflow-hidden p-8 flex flex-col justify-between text-white">

                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-700" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                        <Microscope size={26} strokeWidth={1.5} />
                                    </div>
                                    <ArrowUpRight className="text-neutral-500 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-3xl font-medium mb-2">Deep Analysis</h3>
                                <p className="text-neutral-400">Grafik perkembangan perbaikan tekstur kulit.</p>
                            </div>

                            {/* Dummy UI: Waveform/Graph */}
                            <div className="relative z-10 w-full h-40 border-t border-white/10 mt-6 pt-6 flex items-end">
                                <div className="w-full flex items-center justify-between text-xs text-neutral-500 font-mono mb-2 absolute top-4">
                                    <span>ACNE</span>
                                    <span>OILY</span>
                                    <span>NORMAL</span>
                                </div>

                                {/* Simulated Curve */}
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                                    <path
                                        d="M0,50 C20,40 40,50 50,30 S80,10 100,5"
                                        fill="none"
                                        stroke="url(#gradientLine)"
                                        strokeWidth="0.5"
                                        className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    />
                                    <path
                                        d="M0,50 C20,40 40,50 50,30 S80,10 100,5 L100,50 L0,50"
                                        fill="url(#gradientFill)"
                                        className="opacity-20"
                                    />
                                    <defs>
                                        <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#404040" />
                                            <stop offset="100%" stopColor="#ffffff" />
                                        </linearGradient>
                                        <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ffffff" />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        {/* Additional Small Context Card */}
                        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 flex items-center gap-6 shadow-lg shadow-neutral-100/50">
                            <div className="w-12 h-12 bg-[#F2F2F0] rounded-full flex items-center justify-center shrink-0">
                                <Sun size={20} className="text-orange-500" />
                            </div>
                            <div>
                                <h4 className="font-medium text-lg">Morning Check</h4>
                                <p className="text-sm text-neutral-500">Disarankan melakukan scan pada pukul 08:00 WIB.</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

const RecommendationSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % ACTIVE_INGREDIENTS.length);
        }, 1000); // 3000ms = 3 detik

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 bg-[#111] text-white rounded-t-[3rem] -mt-10 relative z-20">
            <div className="max-w-7xl mx-auto px-6 md:px-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-6 md:pb-10">
                    <div>
                        <h2 className="text-3xl md:text-6xl font-medium tracking-tight">K-Means Recommendation</h2>
                        <p className="text-neutral-400 text-sm md:text-lg mt-4 max-w-sm">
                            Rekomendasi bahan aktif berdasarkan kemiripan fungsi (clustering) dan kondisi kulit terdeteksi.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <Atom size={48} className="text-white/20 animate-spin-slow" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {ACTIVE_INGREDIENTS.map((item, i) => {
                        // Cek apakah kartu ini sedang aktif (otomatis atau manual)
                        const isActive = i === activeIndex;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                // Tambahkan event handler untuk interaksi manual
                                onMouseEnter={() => setActiveIndex(i)}
                                className={`group relative h-[400px] bg-neutral-900 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 border ${isActive ? 'border-white/20' : 'border-transparent'}`}
                            >
                                {/* Gambar Background */}
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 
                                        ${isActive ? 'opacity-80 scale-110 grayscale-0' : 'opacity-60 grayscale scale-100'}
                                    `} 
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                                {/* Konten Text Bawah */}
                                <div 
                                    className={`absolute bottom-0 left-0 p-8 w-full transition-transform duration-500 
                                        ${isActive ? 'translate-y-0' : 'translate-y-4'}
                                    `}
                                >
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{item.role}</p>
                                    <h3 className="text-2xl font-medium text-white mb-2">{item.name}</h3>
                                    
                                    {/* Deskripsi yang muncul saat aktif */}
                                    <p 
                                        className={`text-white/60 text-sm transition-opacity duration-500 delay-100 
                                            ${isActive ? 'opacity-100' : 'opacity-0'}
                                        `}
                                    >
                                        {item.text}
                                    </p>
                                </div>

                                {/* Icon Panah Pojok Kanan Atas */}
                                <div 
                                    className={`absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 
                                        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                                    `}
                                >
                                    <ArrowUpRight size={18} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const DisclaimerSection = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    // Parallax Effects
    // Background text bergerak lambat
    const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    // Card bergerak lebih cepat (berlawanan arah sedikit untuk efek floating)
    const yCard = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
    // Opacity fade in/out agar transisi halus
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={targetRef}
            className="relative min-h-[150vh] flex items-center justify-center bg-[#050505] overflow-hidden py-40"
        >

            <motion.div
                style={{ y: yBg, opacity: 0.1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
            >
                <h1 className="text-[15vw] md:text-[20vw] font-bold text-white tracking-tighter leading-none text-center whitespace-nowrap">
                    RESEARCH<br />ONLY
                </h1>
            </motion.div>

            <motion.div
                style={{ y: yCard, opacity }}
                className="relative z-10 w-full max-w-3xl px-6"
            >
                <div className="relative bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-[2.5rem] shadow-2xl overflow-hidden">

                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />

                    <div className="flex flex-col items-center text-center">
                        {/* Icon Wrapper */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center mb-10 shadow-lg group">
                            <ShieldCheck size={36} className="text-neutral-400 group-hover:text-white transition-colors duration-500" />
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-6">
                            Academic Purpose
                            <span className="block text-neutral-500 text-2xl md:text-3xl mt-2 font-serif italic">Disclaimer.</span>
                        </h2>

                        {/* Main Text */}
                        <div className="space-y-6 text-sm md:text-xl leading-relaxed text-neutral-400 max-w-2xl font-light">
                            <p>
                                Sistem ini dikembangkan secara eksklusif untuk kebutuhan <strong className="text-white font-medium">Penelitian Skripsi</strong> di Universitas Siliwangi.
                            </p>
                            <p>
                                Seluruh hasil analisis, prediksi, dan rekomendasi yang dihasilkan oleh model AI (MobileNetV2) bersifat komputasional dan
                                <span className="text-white mx-1"> tidak menggantikan diagnosis klinis</span>
                                dari Dermatolog atau profesional medis.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};


const EmpowermentSection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

    const x1 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
    const x2 = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section ref={ref} className="py-32 bg-[#F8F8F7] overflow-hidden flex flex-col justify-center items-center relative">
            <video
                src={ClosingVid}
                autoPlay
                muted
                playsInline
                loop
                className='absolute w-full h-full object-cover top-0 left-0 z-0 pointer-events-none opacity-90'
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <HeartHandshake size={400} />
            </div>

            <motion.div style={{ x: x1 }} className="whitespace-nowrap">
                <h2 className="text-[10vw] font-bold text-neutral-300 leading-none">
                    SMART <span className="text-[#fff]">INSIGHT</span> FOR
                </h2>
            </motion.div>

            <motion.div style={{ x: x2 }} className="whitespace-nowrap">
                <h2 className="text-[10vw] font-bold text-neutral-300 leading-none">
                    <span className="text-[#fff]">BETTER</span> SKIN CARE
                </h2>
            </motion.div>
        </section>
    );
};


// --- MAIN PAGE COMPONENT ---

const HomePage = () => {
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className="bg-[#F8F8F7] text-[#111] font-sans selection:bg-black selection:text-white">
            <Header />

            {/* SECTION 1: HERO */}
            <section className="relative w-full flex flex-col items-center px-6 pb-20">
                <div className="sticky md:top-30 top-25 text-center z-10 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-medium tracking-wide text-neutral-500">PATCH-BASED SKIN ANALYSIS</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl  font-medium tracking-tight leading-[0.9] text-center"
                    >
                        Scan. Analyze.<br />
                        <span className="text-neutral-400 font-serif italic">Result.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="max-w-xl mx-auto text-neutral-500 text-sm md:text-lg leading-relaxed"
                    >
                        Menggunakan MobileNetV2 dengan strategi patch-based untuk analisis tekstur mikro dan Smart Camera Guidance untuk standarisasi input real-time.
                    </motion.p>

                    {/*BUTTON */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Link to={ROUTES?.ANALYZE || '#'} className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-[#111] px-8 font-medium text-neutral-50 transition-all hover:bg-neutral-800 hover:w-52 w-48">
                            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                                <div className="relative h-full w-8 bg-white/20" />
                            </div>
                            <span className="mr-2">Mulai Analisis</span>
                            <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                        </Link>
                    </motion.div>
                </div>

                {/* Parallax Hero Image (Landscape Mode with Device Frame) */}
                <div className="relative w-full max-w-6xl mt-40 h-[70vh] md:h-[80vh] z-20 px-4 md:px-0">
                    <ParallaxImage
                        src={HeroImg}
                        alt="Face Analysis Hero"
                        className="w-full h-full"
                        speed={1.2}
                    />

                    {/* Info Cards Overlay - Posisi dikembalikan ke pojok kiri bawah */}
                    <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 text-white z-30">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">

                            {/* Card 1 */}
                            <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
                                <p className="text-xs uppercase tracking-widest opacity-80 mb-1 text-neutral-300">Powered by</p>
                                <p className="text-sm md:text-3xl font-light">MobileNetV2</p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg hidden md:block">
                                <p className="text-xs uppercase tracking-widest opacity-80 mb-1 text-neutral-300">Method</p>
                                <p className="text-sm md:text-3xl font-light">Patch-Based</p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: STICKY CARDS (Core Research Components) */}
            <section className="relative py-20 px-6 md:px-16 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
                    <div className="md:w-1/3 h-fit sticky top-32">
                        <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-8">
                            Integrated<br />
                            <span className="text-neutral-400 italic font-serif">Systems.</span>
                        </h2>
                        <p className="text-neutral-500 mb-8 leading-relaxed">
                            Sistem mengintegrasikan empat komponen utama untuk mengatasi variabilitas input dan transparansi model AI.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {TECH_STACK.map((tech, i) => (
                                <div key={i} className="px-3 py-1.5 rounded-md bg-neutral-100 text-xs font-medium text-neutral-600 border border-neutral-200 flex items-center gap-2 hover:bg-neutral-200 transition-colors cursor-default">
                                    <img src={tech.image} className="w-4 h-4 object-contain grayscale" alt="" />
                                    {tech.value}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:w-2/3 space-y-24 md:space-y-0 relative">
                        {[
                            {
                                title: "Smart Camera Guidance",
                                desc: "Standardisasi kualitas input secara real-time menggunakan MediaPipe untuk validasi pencahayaan dan posisi wajah.",
                                icon: <ScanFace size={24} />,
                                color: "bg-[#F2F2F0]",
                                img: VideoDemo,
                                isVideo: true
                            },
                            {
                                title: "Patch-Based Learning",
                                desc: "Model fokus pada tekstur mikro (pori & lesi) dengan mengekstrak area spesifik (Dahi, Pipi, Hidung) untuk menghindari bias fitur non-kulit.",
                                icon: <Grid size={24} />,
                                color: "bg-[#EAE8E4]",
                                img: patchImg,
                                isVideo: false
                            },
                            {
                                title: "Explainable AI (XAI)",
                                desc: "Implementasi Grad-CAM untuk menghasilkan heatmap yang memvisualisasikan area wajah penentu keputusan prediksi.",
                                icon: <Lightbulb size={24} />,
                                color: "bg-[#DFDCD7]",
                                img: heatmapImg,
                                isVideo: false
                            }
                        ].map((card, index) => (
                            <CardStackItem key={index} data={card} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3: HORIZONTAL PROCESS */}
            <HorizontalProcessSection />

            {/* SECTION 4: MONITORING DASHBOARD (Daily Routine) */}
            <DailyRoutineSection />

            {/* SECTION 5: CLUSTERING RECOMMENDATIONS */}
           <RecommendationSection />

            {/* SECTION 6: DISCLAIMER */}
            <DisclaimerSection />

            {/* SECTION 7: EMPOWERMENT CLOSING */}
            <EmpowermentSection />

            <footer className="bg-white py-12 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-2xl font-bold tracking-tight">SKinAI.</div>
                <p className="text-neutral-500 text-sm">Penelitian Skripsi Teknik Informatika - Universitas Siliwangi.</p>
                <div className="flex gap-6 text-sm font-medium">
                    <a href="#" className="hover:underline">Github</a>
                    <a href="#" className="hover:underline">Paper</a>
                </div>
            </footer>

        </div>
    );
}

export default HomePage;