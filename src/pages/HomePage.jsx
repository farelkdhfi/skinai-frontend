import React, { Activity, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
    useSpring,
    useMotionValue,
    useMotionTemplate,
    useVelocity,
    useAnimationFrame
} from 'framer-motion';
import {
    ArrowRight, ArrowUpRight, Play, Star,
    Atom, ScanFace, ShieldCheck, Zap,
    AlertTriangle, HeartHandshake, CalendarCheck, Sun, BookOpen,
    Microscope, Lightbulb, Grid,
    ScatterChartIcon,
    ActivityIcon,
    Droplet,
    ClockPlusIcon,
    User2,
    Database,
    Fingerprint,
    Sparkles,
    History,
    CheckCircle2,
    TrendingUp,
    ScanLine,
    ShieldAlert
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

// Patch Assets
import patch1 from '../assets/patch/1.jpg';
import patch2 from '../assets/patch/2.jpg';
import patch3 from '../assets/patch/3.jpg';

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
        title: "Salicylic Acid",
        role: "Beta Hydroxy Acid",
        desc: "Oil-soluble exfoliant that penetrates deep into pores to dissolve sebum.",
        color: "bg-teal-900",
        img: ingredients1 // Mapping ke image 1
    },
    {
        title: "Niacinamide",
        role: "Vitamin B3",
        desc: "Strengthens barrier function and regulates oil production while soothing.",
        color: "bg-indigo-900",
        img: ingredients2 // Mapping ke image 2
    },
    {
        title: "Ceramides",
        role: "Lipids",
        desc: "Essential fats that hold skin cells together, forming a protective layer.",
        color: "bg-rose-900",
        img: ingredients3 // Mapping ke image 3
    },
    {
        title: "Retinol",
        role: "Vitamin A",
        desc: "Accelerates cell turnover and boosts collagen production.",
        color: "bg-amber-900",
        img: ingredients4 // Mapping ke image 4
    }
];

// --- UTILITY COMPONENTS ---

const ParallaxImage = ({ src, alt, className, speed = 1 }) => {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Core motion
    const y = useTransform(scrollYProgress, [0, 1], [-60 * speed, 60 * speed]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.1]);
    const rotateX = useTransform(scrollYProgress, [0, 1], [6, -6]);
    const rotateY = useTransform(scrollYProgress, [0, 1], [-4, 4]);

    // Light sweep
    const lightX = useTransform(scrollYProgress, [0, 1], ["-40%", "140%"]);
    const lightOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.25, 0]);

    return (
        <div
            ref={ref}
            className={`flex items-center justify-center perspective-[1200px] ${className}`}
        >
            {/* DEVICE */}
            <motion.div
                style={{ rotateX, rotateY }}
                className="relative w-full h-full md:max-w-[95%] md:max-h-[100%]"
            >
                {/* Phone Body */}
                <div className="relative w-full h-full bg-[#0E0E0E] border-[14px] md:border-[18px] border-[#0E0E0E]
                        rounded-[3.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.45)]
                        overflow-hidden ring-1 ring-white/10 z-10">

                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-30" />

                    {/* Screen */}
                    <div className="relative w-full h-full rounded-[2.6rem] overflow-hidden bg-black">

                        {/* Background depth */}
                        <motion.div
                            style={{ y: useTransform(scrollYProgress, [0, 1], [-20, 20]) }}
                            className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 to-black"
                        />

                        {/* Image */}
                        <motion.img
                            src={src}
                            alt={alt}
                            style={{ y, scale }}
                            className="relative w-full h-full object-cover z-10 will-change-transform"
                        />

                        {/* Cinematic light sweep */}
                        <motion.div
                            style={{ left: lightX, opacity: lightOpacity }}
                            className="absolute top-0 w-[60%] h-full
                         bg-gradient-to-r from-transparent via-white/25 to-transparent
                         skew-x-[-12deg] pointer-events-none z-20"
                        />

                        {/* Inner glass */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent z-20" />
                        <div className="absolute inset-0 border border-white/5 rounded-[2.6rem] z-20" />
                    </div>
                </div>

                {/* Side Buttons */}
                <div className="absolute top-36 -right-[18px] w-[3px] h-20 bg-neutral-800 rounded-r-md border-l border-white/10" />
                <div className="absolute top-36 -left-[18px] w-[3px] h-14 bg-neutral-800 rounded-l-md border-r border-white/10" />
                <div className="absolute top-56 -left-[18px] w-[3px] h-14 bg-neutral-800 rounded-l-md border-r border-white/10" />
            </motion.div>
        </div>
    );
};


const HeroSection = () => {
    return (
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
                    Scan. <br className='md:hidden block' /> Analyze.<br />
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
            <div className="relative w-full md:max-w-[90rem] mt-40 h-[70vh] md:h-[80vh] z-20 px-4 md:px-0">
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
    )
}

const CardStackItem = ({ data, index }) => {
    return (
        <div className="sticky top-40 mb-20 md:mb-40 last:mb-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`${data.color} rounded-[2.5rem] p-4 md:p-8 grid md:grid-cols-2 shadow-xl bg-neutral-900 relative overflow-hidden h-[500px]`}
            >
                <div className="relative z-10">
                    <h1 className='font-bold text-8xl text-neutral-600 mb-4'>{data.num}</h1>
                    <h3 className="md:text-3xl text-2xl font-medium md:mb-4">{data.title}</h3>
                    <p className="text-neutral-600 md:text-lg text-sm max-w-sm">{data.desc}</p>
                </div>
                <div className="relative md:absolute mt-4 md:mt-0 right-0 bottom-0 w-full md:w-1/2 h-full md:h-full rounded-tl-[3rem] overflow-hidden">
                    <>
                        {/* Fix: Added absolute, inset-0, and z-10 to overlay */}
                        <div className='absolute inset-0 bg-linear-to-t from-black/90 to-transparent z-10' />

                        {data.isVideo ? (
                            <video src={data.img} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={data.img} alt={data.title} className="w-full h-full object-cover" />
                        )}
                    </>
                </div>
            </motion.div>
        </div>
    );
};

const CoreFeatureSection = () => {
    return (
        <section className="relative py-20 px-6 md:px-16 bg-neutral-950 text-white">
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
                            <div key={i} className="px-3 py-1.5 rounded-md bg-neutral-800 text-xs font-medium text-neutral-100 border border-neutral-900 flex items-center gap-2 hover:bg-neutral-900 transition-colors cursor-default">
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
                            num: '01',
                            isVideo: true
                        },
                        {
                            title: "Patch-Based Learning",
                            desc: "Model fokus pada tekstur mikro (pori & lesi) dengan mengekstrak area spesifik (Dahi, Pipi, Hidung) untuk menghindari bias fitur non-kulit.",
                            icon: <Grid size={24} />,
                            color: "bg-[#EAE8E4]",
                            img: patchImg,
                            num: '02',

                            isVideo: false
                        },
                        {
                            title: "Explainable AI (XAI)",
                            desc: "Implementasi Grad-CAM untuk menghasilkan heatmap yang memvisualisasikan area wajah penentu keputusan prediksi.",
                            icon: <Lightbulb size={24} />,
                            color: "bg-[#DFDCD7]",
                            img: heatmapImg,
                            num: '03',
                            isVideo: false
                        }
                    ].map((card, index) => (
                        <CardStackItem key={index} data={card} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

const HorizontalProcessSection = () => {

    function useMediaQuery(query) {
        const [matches, setMatches] = useState(false);

        useEffect(() => {
            const media = window.matchMedia(query);
            if (media.matches !== matches) {
                setMatches(media.matches);
            }
            const listener = () => setMatches(media.matches);
            media.addEventListener("change", listener);
            return () => media.removeEventListener("change", listener);
        }, [matches, query]);

        return matches;
    }

    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const isMobile = useMediaQuery("(max-width: 768px)");

    const endRange = isMobile ? "-75%" : "-50%";

    const x = useTransform(scrollYProgress, [0, 1], ["0%", endRange]);

    const steps = [
        { id: "01", title: "Face Capture", desc: "Pengambilan citra dengan panduan grid otomatis.", img: faceAnalysisImg },
        { id: "02", title: "Segmentation", desc: "Pemisahan area ROI (Region of Interest) secara presisi.", img: processAnalysisImg },
        { id: "03", title: "Result & Heatmap", desc: "Diagnosis akhir dengan validasi area terdampak.", img: resultAnalysisImg },
    ];

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[#f2f2f0] py-20">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <div className="absolute top-0 left-6 md:left-12 z-20 max-w-3xl">
                    <h2 className='text-5xl font-medium tracking-tight'>Designed to be <span className='italic text-neutral-400 font-serif'>Effortless.</span></h2>
                </div>

                <motion.div style={{ x }} className="flex gap-10 px-6 md:px-12">
                    {/* Mapping Steps Card */}
                    {steps.map((step, i) => (
                        <div key={i} className="relative w-[85vw] md:w-[60vw] h-[70vh] flex-shrink-0 rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-neutral-200 group">
                            <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20 text-white">
                                <span className="text-8xl font-bold opacity-30 tracking-tighter mb-5">{step.id}</span>
                                <h3 className="text-4xl md:text-5xl font-medium mt-4">{step.title}</h3>
                                <p className="mt-4 max-w-md text-lg">{step.desc}</p>
                            </div>

                            <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                    ))}

                    {/* UBAHAN 2: Section Tombol "Mulai Analysis" */}
                    <div className="w-[85vw] md:w-[40vw] h-[70vh] flex-shrink-0 flex flex-col justify-center items-start pl-8 md:pl-16">
                        <h3 className="text-5xl md:text-6xl font-medium tracking-tighter mb-8 text-neutral-800">
                            Ready to <br />
                            <span className="font-serif italic text-neutral-500">Analysis?</span>
                        </h3>
                        <p className="text-lg text-neutral-600 mb-8 max-w-xs">
                            Dapatkan hasil analisis kulit presisi dalam hitungan detik.
                        </p>

                        <button
                            onClick={() => console.log("Navigate to analysis")}
                            className="group relative px-8 py-4 bg-black text-white rounded-full text-xl font-medium overflow-hidden transition-all hover:pr-12"
                        >
                            <span className="relative z-10">Mulai sekarang</span>
                            {/* Icon Arrow animasi saat hover */}
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                →
                            </span>
                        </button>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};


const DailyRoutineSection = () => {
    const containerRef = useRef(null);

    // --- PARALLAX LOGIC ---
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20
    });

    const usePhase = (start, end) => {
        const opacity = useTransform(smoothProgress, [start - 0.05, start, end, end + 0.05], [0, 1, 1, 0]);
        const scale = useTransform(smoothProgress, [start, end], [1, 0.95]);
        const y = useTransform(smoothProgress, [start, end], [50, -50]);
        return { opacity, scale, y };
    };
    const p1Opacity = useTransform(smoothProgress, [0, 0.3, 0.35], [1, 1, 0]);
    const p1Scale = useTransform(smoothProgress, [0, 0.35], [1, 0.9]);
    const p1Y = useTransform(smoothProgress, [0, 0.35], [0, -50]);

    const phase1 = {
        opacity: p1Opacity,
        scale: p1Scale,
        y: p1Y,
        pointerEvents: useTransform(p1Opacity, (v) => v < 0.1 ? 'none' : 'auto')
    };

    const phase2Helper = usePhase(0.4, 0.6);
    const phase2 = {
        ...phase2Helper,
        pointerEvents: useTransform(phase2Helper.opacity, (v) => v < 0.1 ? 'none' : 'auto')
    };

    const lightFlashOpacity = useTransform(smoothProgress, [0.70, 0.90], [0, 1]);
    const finaleTextOpacity = useTransform(smoothProgress, [0.75, 0.85], [0, 1]);
    const finaleTextScale = useTransform(smoothProgress, [0.75, 1], [0.9, 1.15]);

    return (
        <div ref={containerRef} className="relative h-[450vh] bg-[#F8F8F7] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white py-20">

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* --- PHASE 1: THE DAILY RITUAL --- */}
                <motion.div
                    style={phase1}
                    className="absolute inset-0 z-20 px-6 md:px-20 flex items-center"
                >
                    <div className="grid md:grid-cols-2 gap-20 items-center w-full">

                        {/* LEFT — CINEMATIC VISUAL */}
                        <div className="relative w-full h-[520px] rounded-[3rem] overflow-hidden group">

                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/20 via-transparent to-neutral-900/30 z-10" />

                            {/* Video */}
                            <video
                                src={faceScan}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover scale-[1.03] group-hover:scale-[1.05] transition-transform duration-[3000ms] ease-out"
                            />

                            {/* Subtle Film Grain */}
                            <div className="absolute inset-0 bg-[url('/grain.png')] opacity-[0.06] mix-blend-overlay z-20" />

                            {/* Floating AI Marker */}
                            <motion.div
                                style={{
                                    y: useTransform(smoothProgress, [0, 0.3], [20, -20]),
                                    opacity: useTransform(smoothProgress, [0.05, 0.15], [0, 1])
                                }}
                                className="absolute bottom-6 left-6 px-4 py-2 rounded-full
                   bg-black/40 backdrop-blur-xl border border-white/20
                   text-white text-xs tracking-widest uppercase z-30"
                            >
                                Live Skin Capture
                            </motion.div>
                        </div>

                        {/* RIGHT — EDITORIAL + DATA */}
                        <div className="relative">

                            {/* Eyebrow */}
                            <p className="text-xs tracking-[0.35em] uppercase text-neutral-400 mb-6">
                                Daily Ritual
                            </p>

                            {/* Headline */}
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-neutral-900">
                                Discipline <br />
                                <span className="font-serif italic font-light text-neutral-500">
                                    becomes data.
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="mt-8 max-w-md text-neutral-600 text-base leading-relaxed">
                                Each morning scan is transformed into a living biometric timeline —
                                capturing subtle changes invisible to the human eye.
                            </p>

                            {/* DATA STRIP */}
                            <div className="mt-12 space-y-4">

                                {[
                                    { label: "Scan Frequency", value: "Daily" },
                                    { label: "Precision Level", value: "Dermal Grade" },
                                    { label: "Data Points / Scan", value: "12,480+" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="flex items-center justify-between
                       border-b border-neutral-200/70 pb-3"
                                    >
                                        <span className="text-sm text-neutral-500">
                                            {item.label}
                                        </span>
                                        <span className="text-sm font-semibold text-neutral-900">
                                            {item.value}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* DATA PULSE GRID */}
                            <div className="mt-14 grid grid-cols-7 gap-2 max-w-sm">
                                {[...Array(28)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            opacity: [0.2, 0.8, 0.2]
                                        }}
                                        transition={{
                                            duration: 4,
                                            delay: i * 0.04,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className={`aspect-square rounded-md
              ${i > 24
                                                ? 'bg-neutral-900 shadow-[0_0_12px_rgba(0,0,0,0.25)]'
                                                : 'bg-neutral-300'
                                            }`}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </motion.div>


                {/* --- PHASE 2: THE PREDICTIVE TRAJECTORY --- */}
                <motion.div
                    style={phase2}
                    className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-20"
                >
                    <div className="relative w-full">

                        {/* HEADER */}
                        <motion.div
                            style={{
                                y: useTransform(smoothProgress, [0.4, 0.6], [60, -40]),
                                opacity: useTransform(smoothProgress, [0.42, 0.5], [0, 1])
                            }}
                            className="mb-14 max-w-2xl"
                        >
                            <p className="text-xs tracking-[0.35em] uppercase text-neutral-400 mb-4">
                                Predictive Layer
                            </p>

                            <h3 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] text-neutral-900">
                                Intelligence <br />
                                <span className="font-serif italic font-light text-neutral-500">
                                    takes form.
                                </span>
                            </h3>

                            <p className="mt-6 text-neutral-600 text-lg">
                                Patterns converge. Signals align.
                                The system no longer observes — it anticipates.
                            </p>
                        </motion.div>

                        {/* MAIN CANVAS */}
                        <div className="relative h-[50vh] rounded-[3rem] overflow-hidden bg-neutral-950 shadow-2xl">

                            {/* AMBIENT DEPTH */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_60%)]" />

                            {/* AI CORE */}
                            <motion.div
                                style={{
                                    scale: useTransform(smoothProgress, [0.42, 0.6], [0.85, 1]),
                                    opacity: useTransform(smoothProgress, [0.42, 0.5], [0, 1])
                                }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
                            >
                                <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl animate-pulse" />
                                <div className="absolute inset-6 rounded-full bg-white/20 blur-xl" />
                                <div className="absolute inset-10 rounded-full bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.6)]" />
                            </motion.div>

                            {/* TRAJECTORY GRAPH */}
                            <motion.svg
                                viewBox="0 0 1000 400"
                                preserveAspectRatio="none"
                                className="absolute inset-0 w-full h-full"
                            >
                                <defs>
                                    <linearGradient id="ai-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                                        <stop offset="50%" stopColor="#ffffff" />
                                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
                                    </linearGradient>
                                </defs>

                                <motion.path
                                    d="M 0 330
             C 160 310, 260 260, 420 240
             C 620 210, 760 140, 1000 90"
                                    fill="none"
                                    stroke="url(#ai-line)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </motion.svg>

                            {/* FLOATING SIGNALS */}
                            {[
                                { x: "18%", y: "52%", label: "Inflammation Signal ↓" },
                                { x: "46%", y: "34%", label: "Barrier Recovery" },
                                { x: "78%", y: "14%", label: "Stability Zone" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        left: item.x,
                                        top: item.y,
                                        y: useTransform(
                                            smoothProgress,
                                            [0.4, 0.6],
                                            [30 * (i + 1), -30 * (i + 1)]
                                        ),
                                        opacity: useTransform(smoothProgress, [0.45, 0.55], [0, 1])
                                    }}
                                    className="absolute px-4 py-2 rounded-full
                     bg-white/10 backdrop-blur-xl border border-white/20
                     text-white text-xs tracking-wide"
                                >
                                    {item.label}
                                </motion.div>
                            ))}

                            {/* AI THOUGHT */}
                            <motion.div
                                style={{
                                    opacity: useTransform(smoothProgress, [0.5, 0.65], [0, 1]),
                                    y: useTransform(smoothProgress, [0.5, 0.65], [20, 0])
                                }}
                                className="absolute bottom-8 right-8 max-w-sm
                   text-neutral-200 text-sm leading-relaxed"
                            >
                                <span className="text-neutral-400 tracking-widest text-[10px] uppercase">
                                    System Insight
                                </span>
                                <p className="mt-2">
                                    Consistency detected.
                                    Predictive confidence reaches{" "}
                                    <span className="text-white font-semibold">high certainty</span>
                                    {" "}within a 21-day behavioral window.
                                </p>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>



                {/* --- CLOSING PHASE --- */}
                {/* --- PHASE 3: THE LONG-TERM REVELATION --- */}
                <>
                    {/* LIGHT WASH */}
                    <motion.div
                        style={{
                            opacity: useTransform(smoothProgress, [0.68, 0.78], [0, 1])
                        }}
                        className="absolute inset-0 z-40
               bg-gradient-to-b from-white/80 via-white to-white
               pointer-events-none"
                    />

                    {/* FINAL MOMENT */}
                    <motion.div
                        style={{
                            opacity: useTransform(smoothProgress, [0.72, 0.85], [0, 1]),
                            scale: useTransform(smoothProgress, [0.72, 1], [0.96, 1.08]),
                            y: useTransform(smoothProgress, [0.72, 1], [40, -40])
                        }}
                        className="absolute inset-0 z-50 flex items-center justify-center text-center px-6"
                    >
                        <div className="max-w-4xl">

                            {/* EYEBROW */}
                            <motion.p
                                style={{
                                    opacity: useTransform(smoothProgress, [0.74, 0.82], [0, 1])
                                }}
                                className="text-xs tracking-[0.4em] uppercase text-neutral-400 mb-10"
                            >
                                Long-Term Vision
                            </motion.p>

                            {/* MAIN STATEMENT */}
                            <h1 className="text-6xl md:text-[9rem] font-medium tracking-tighter
                     text-neutral-900 leading-[0.85]">
                                LONG<br />TERM
                            </h1>

                            {/* SUB STATEMENT */}
                            <motion.span
                                style={{
                                    opacity: useTransform(smoothProgress, [0.78, 0.9], [0, 1])
                                }}
                                className="block mt-6 font-serif italic
                   text-3xl md:text-5xl text-neutral-500"
                            >
                                clarity.
                            </motion.span>

                            {/* SILENT DIVIDER */}
                            <motion.div
                                style={{
                                    scaleX: useTransform(smoothProgress, [0.8, 0.95], [0, 1])
                                }}
                                className="mx-auto mt-14 h-px w-32 bg-neutral-300 origin-left"
                            />

                            {/* FINAL THOUGHT */}
                            <motion.p
                                style={{
                                    opacity: useTransform(smoothProgress, [0.82, 1], [0, 1])
                                }}
                                className="mx-auto mt-10 max-w-xl
                   text-neutral-600 text-base md:text-lg leading-relaxed"
                            >
                                When consistency compounds,
                                prediction becomes understanding.
                            </motion.p>
                        </div>
                    </motion.div>
                </>
            </div>
        </div>
    );
};

const Ingredients = () => {
    const [active, setActive] = useState(0);
    const containerRef = useRef(null);

    // 1. Setup Scroll Hook
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"] // Mulai tracking saat section menyentuh atas layar
    });

    // Mapping data dengan image yang sudah di-import


    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Kita membagi scroll 0-1 menjadi bagian rata sesuai jumlah item
        // Contoh 4 item: 0-0.25 (idx 0), 0.25-0.5 (idx 1), dst.
        const itemsLength = ACTIVE_INGREDIENTS.length;
        const sectionSize = 1 / itemsLength;

        // Kalkulasi index saat ini
        const newIndex = Math.floor(latest / sectionSize);

        // Pastikan index tidak keluar dari batas array (0 sampai 3)
        const clampedIndex = Math.min(Math.max(newIndex, 0), itemsLength - 1);

        if (clampedIndex !== active) {
            setActive(clampedIndex);
        }
    });

    return (
        <div ref={containerRef} className="relative h-[300vh] bg-[#0A0A0A] py-20">

            {/* Sticky Container: Ini yang akan terlihat diam saat user scroll */}
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

                <section className="w-full max-w-7xl mx-auto px-6 relative z-20">
                    {/* Header Section */}
                    <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between md:items-end">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
                                Personalized <br />
                                <span className="text-neutral-500 font-serif italic">Recommendations.</span>
                            </h2>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <p className="text-neutral-400 text-sm">Based on K-Means Clustering</p>
                            {/* Indikator Progress Scroll opsional */}
                            <div className="w-full bg-neutral-800 h-1 mt-2 rounded-full overflow-hidden">
                                <motion.div
                                    style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                                    className="h-full bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card Container */}
                    <div className="flex flex-col md:flex-row gap-4 h-[55vh]">
                        {ACTIVE_INGREDIENTS.map((item, i) => (
                            <motion.div
                                key={i}
                                onClick={() => {
                                    setActive(i);
                                }}
                                className={`relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-700 ease-[0.16,1,0.3,1] ${active === i ? 'flex-[3]' : 'flex-[1]'
                                    }`}
                            >
                                {/* --- BACKGROUND IMAGE LAYER --- */}
                                <div className="absolute inset-0 bg-neutral-900">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className={`w-full h-full object-cover transition-all duration-1000 
                                            ${active === i ? 'opacity-60 scale-110' : 'opacity-30 scale-100 grayscale'}
                                        `}
                                    />
                                </div>

                                {/* Abstract Color Glow */}
                                <div className={`absolute inset-0 opacity-40 ${item.color} mix-blend-overlay transition-opacity duration-500`}></div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                                {/* CONTENT LAYER */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 text-white">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold tracking-widest uppercase opacity-80 border border-white/20 px-2 py-1 rounded-full backdrop-blur-md bg-black/20">
                                            {item.role}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-500 ${active === i ? 'rotate-45 opacity-100' : 'rotate-0 opacity-0'}`}>
                                            <ArrowUpRight size={16} />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className={`font-medium transition-all duration-500 ${active === i ? 'text-4xl mb-4' : 'text-xl mb-0 rotate-0 md:-rotate-90 md:origin-bottom-left md:translate-x-8 md:-translate-y-8 whitespace-nowrap'}`}>
                                            {item.title}
                                        </h3>
                                        <div className={`overflow-hidden transition-all duration-700 ${active === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <p className="text-neutral-300 text-lg leading-relaxed max-w-lg shadow-black drop-shadow-md">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};


const DisclaimerSection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const smooth = useSpring(scrollYProgress, { stiffness: 30, damping: 20 });

    const opacity = useTransform(smooth, [0, 0.3], [0, 1]);
    const y = useTransform(smooth, [0, 1], [40, 0]);
    const scale = useTransform(smooth, [0, 1], [0.95, 1]);

    return (
        <section
            ref={ref}
            className="relative min-h-[110vh] bg-[#020202] flex items-center justify-center px-6 py-20"
        >
            {/* Background wordmark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <h1 className="text-[22vw] font-bold tracking-tight text-white">
                    DISCLAIMER
                </h1>
            </div>

            <motion.div
                style={{ opacity, y, scale }}
                className="relative z-10 max-w-3xl w-full"
            >
                <div className="rounded-[2.5rem] bg-[#0B0B0B] border border-white/10 px-10 py-14 md:px-16 md:py-20 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">

                    {/* Label */}
                    <p className="text-[11px] tracking-[0.35em] uppercase text-neutral-500 mb-10">
                        Academic Notice
                    </p>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
                        Research Context<br />
                        <span className="font-serif italic font-light text-neutral-500">
                            & Usage Boundaries
                        </span>
                    </h2>

                    {/* Divider */}
                    <div className="mt-10 mb-12 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Content */}
                    <div className="space-y-6 text-neutral-400 text-sm md:text-lg leading-relaxed font-light max-w-2xl">
                        <p>
                            Sistem ini dikembangkan secara eksklusif untuk kebutuhan
                            <strong className="text-white font-medium"> penelitian akademik </strong>
                            di Universitas Siliwangi.
                        </p>
                        <p>
                            Seluruh keluaran model berbasis MobileNetV2 bersifat probabilistik
                            dan tidak dirancang sebagai pengganti evaluasi klinis,
                            diagnosis medis, maupun keputusan profesional dermatologi.
                        </p>
                    </div>

                    {/* Footer mark */}
                    <div className="mt-14 text-[10px] tracking-[0.4em] text-neutral-600 uppercase">
                        For Research Use Only
                    </div>
                </div>
            </motion.div>
        </section>
    );
};


const EmpowermentSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // Efek Zoom-Out perlahan pada background video agar tidak statis
    const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

    // Efek Reveal Teks
    const y = useTransform(scrollYProgress, [0.2, 0.8], [100, 0]);
    const opacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

    return (
        <section ref={containerRef} className="relative h-screen bg-black flex flex-col justify-center items-center overflow-hidden">

            {/* --- VIDEO MASKING LAYER --- */}
            {/* Videonya kita taruh di paling bawah, tapi kita tutupin pake layer hitam yang punya 'bolongan' teks */}
            {/* Teknik CSS: mix-blend-multiply atau background-clip: text */}

            <div className="absolute inset-0 w-full h-full z-0">
                <motion.div style={{ scale }} className="w-full h-full">
                    <video
                        src={ClosingVid} // Ganti dengan video lu
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                    />
                </motion.div>
                {/* Overlay Gradient biar teks makin pop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 mix-blend-screen">

                {/* Small Label */}
                <motion.p
                    style={{ opacity }}
                    className="text-neutral-400 text-xs md:text-sm tracking-[0.3em] uppercase font-medium mb-6"
                >
                    The Future is Personal
                </motion.p>

                {/* GIANT TYPOGRAPHY */}
                <motion.div style={{ y, opacity }}>
                    <h2 className="text-[12vw] md:text-[10rem] font-medium tracking-tighter leading-[0.85] text-white">
                        SMART
                    </h2>
                    {/* Baris kedua dengan style Serif Italic biar kontras */}
                    <div className="flex items-center justify-center gap-4 md:gap-8">
                        <span className="block h-[1px] w-12 md:w-32 bg-white/50"></span>
                        <h2 className="text-[5vw] md:text-[5rem] font-serif italic text-white/90">
                            Insight.
                        </h2>
                        <span className="block h-[1px] w-12 md:w-32 bg-white/50"></span>
                    </div>
                </motion.div>

                {/* CALL TO ACTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-12 md:mt-20"
                >
                    <Link to="/analyze" className="group flex items-center gap-3 text-white transition-all hover:opacity-70">
                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
                            <ArrowUpRight size={24} />
                        </div>
                        <span className="text-sm md:text-lg tracking-widest uppercase font-medium">
                            Start Diagnosis
                        </span>
                    </Link>
                </motion.div>

            </div>

            {/* Footer Credit Kecil */}
            <div className="absolute bottom-10 w-full flex justify-between px-10 text-[10px] text-neutral-600 font-mono uppercase tracking-widest">
                <span>© 2026 UNSIL INFORMATICS</span>
                <span>SCROLL TO TOP</span>
            </div>

        </section>
    );
};

const Footer = () => {
    return (
        <footer className="bg-white py-12 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold tracking-tight">SKinAI.</div>
            <p className="text-neutral-500 text-sm text-center">Penelitian Skripsi Teknik Informatika - Universitas Siliwangi.</p>
            <div className="flex gap-6 text-sm font-medium">
                <a href="#" className="hover:underline">Github</a>
                <a href="#" className="hover:underline">Paper</a>
            </div>
        </footer>
    )
}

// --- MAIN PAGE COMPONENT ---

const HomePage = () => {
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className="bg-[#F8F8F7] text-[#111] font-sans selection:bg-black selection:text-white">
            <Header />

            {/* SECTION 1: HERO */}
            <HeroSection />

            {/* SECTION 2: STICKY CARDS (Core Research Components) */}
            <CoreFeatureSection />

            {/* SECTION 3: HORIZONTAL PROCESS */}
            <HorizontalProcessSection />

            {/* SECTION 4: MONITORING DASHBOARD (Daily Routine) */}
            <DailyRoutineSection />

            {/* SECTION 5: CLUSTERING RECOMMENDATIONS */}
            <Ingredients />

            {/* SECTION 6: DISCLAIMER */}
            <DisclaimerSection />

            {/* SECTION 7: EMPOWERMENT CLOSING */}
            <EmpowermentSection />

            {/* FOOTER */}
            <Footer />
        </div>
    );
}

export default HomePage;