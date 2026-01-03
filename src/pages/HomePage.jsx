import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Camera, Zap, ArrowRight,
    GithubIcon,
    TwitterIcon,
    LinkedinIcon
} from 'lucide-react';

import { Header } from '../components/Header';
import { ROUTES } from '../config';
import FaceScanner from '../components/FaceScanner';

import HeroImg from '../assets/heroimg.png'
import HeroImg2 from '../assets/heroimg2.png'

import LogoJs from '../assets/logo/logo_js.png'
import LogoExpress from '../assets/logo/logo_expressjs.png'
import LogoMediapipe from '../assets/logo/logo_mediapipe.png'
import LogoNodejs from '../assets/logo/logo_nodejs.png'
import LogoReactjs from '../assets/logo/logo_reactjs.png'
import LogoSupabase from '../assets/logo/logo_supabase.png'
import LogoMobilenetv2 from '../assets/logo/logo_mobilenetv2.png'

// --- ANIMATION VARIANTS (Framer Motion untuk interaksi User saja) ---

const transition = { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] };

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: transition }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: transition }
};

// Optimasi Blob: Mengurangi frekuensi update animasi background
const floatingBlob = {
    animate: {
        y: [0, -20, 0], // Range gerak diperkecil agar repaint area lebih sedikit
        scale: [1, 1.05, 1],
        transition: { duration: 10, repeat: Infinity, ease: "easeInOut" } // Durasi diperlambat
    }
};

// --- DATA TECH STACK ---
const TECH_STACK = [
    { label: 'Frontend', value: 'React.js', image: LogoReactjs },
    { label: 'Backend', value: 'Node.js', image: LogoNodejs },
    { label: 'Backend', value: 'Express.js', image: LogoExpress },
    { label: 'Database', value: 'Supabase', image: LogoSupabase },
    { label: 'AI Model', value: 'MobileNetV2', image: LogoMobilenetv2 },
    { label: 'Vision', value: 'MediaPipe', image: LogoMediapipe },
    { label: 'Language', value: 'JavaScript', image: LogoJs },
];

const HomePage = () => {
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white overflow-hidden font-sans">
            <Header />

            {/* --- INJECT CSS KHUSUS CAROUSEL --- */}
            {/* Menggunakan Pure CSS Keyframes agar berjalan di GPU Thread (Sangat Halus) */}
            <style>{`
                @keyframes scroll-infinite {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                .animate-marquee {
                    animation: scroll-infinite 30s linear infinite;
                    will-change: transform; /* Memberi tahu browser untuk optimasi layer */
                }
                /* Pause animasi saat hover (opsional) */
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* --- ANIMATED BACKGROUND (Optimized) --- */}
            {/* Pointer-events-none dan fixed position penting agar tidak memicu layout repaint */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transform-gpu">
                <motion.div
                    variants={floatingBlob}
                    animate="animate"
                    // Menggunakan translate-z-0 untuk force hardware acceleration
                    className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[80px] opacity-60 translate-z-0"
                />
                <motion.div
                    variants={floatingBlob}
                    animate="animate"
                    transition={{ delay: 2 }}
                    className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-50/70 rounded-full blur-[100px] opacity-70 translate-z-0"
                />
            </div>

            <main className="relative z-10">

                {/* --- HERO SECTION --- */}
                <section className="relative flex justify-center items-center pt-32 pb-20 lg:pt-30 lg:pb-32 px-6 bg-white h-screen overflow-hidden">
                    {/* Background Image: Added decoding async & optimize opacity */}
                    <img src={HeroImg} alt="" decoding="async" className='right-0 top-30 h-full object-contain absolute opacity-80 pointer-events-none' />
                    <img src={HeroImg2} alt="" decoding="async" className='left-0 top-30 h-full object-contain absolute opacity-80 pointer-events-none' />

                    <motion.div
                        style={{ y: yHero }}
                        className="max-w-7xl mx-auto text-center relative z-10"
                    >
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="max-w-4xl mx-auto space-y-8"
                        >
                            <motion.div variants={fadeInUp} className="flex justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm text-xs font-semibold text-neutral-900 uppercase tracking-wide hover:border-indigo-200 transition-colors cursor-default">
                                    <Zap size={14} className="text-indigo-500 fill-indigo-500" />
                                    <span>Powered by MobileNetV2</span>
                                </div>
                            </motion.div>

                            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.05]">
                                Understanding your skin <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-neutral-900 via-indigo-900 to-neutral-900">
                                    powered by AI.
                                </span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
                                Get professional-grade skin analysis in seconds. Our deep learning model detects skin types and conditions with <span className="text-neutral-900 font-semibold">98% accuracy</span>.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                                <Link to={ROUTES.ANALYZE}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-5 bg-neutral-900 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-neutral-900/20 flex items-center gap-3 group"
                                    >
                                        <Camera size={20} className="group-hover:rotate-12 transition-transform" />
                                        Start Analysis
                                    </motion.button>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 bg-white text-neutral-700 border border-neutral-200 rounded-full font-bold text-lg shadow-sm hover:shadow-md transition-all"
                                >
                                    Learn more
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- TECH STACK INFINITE CAROUSEL (OPTIMIZED) --- */}
                <section className="py-10 border-y border-neutral-100 bg-white/50 backdrop-blur-sm overflow-hidden transform-gpu">
                    <div className="max-w-full mx-auto relative">
                        {/* Gradient Mask */}
                        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

                        {/* Container Overflow Hidden */}
                        <div className="flex overflow-hidden w-full">
                            {/* OPTIMASI UTAMA DI SINI:
                                1. Menggunakan class 'animate-marquee' (defined di <style> atas).
                                2. Tidak lagi menggunakan motion.div untuk pergerakan loop.
                                3. 'w-max' agar konten tidak wrapping.
                            */}
                            <div className="flex w-max animate-marquee items-center">
                                {/* Set 1 */}
                                <div className="flex gap-16 md:gap-24 pl-16 md:pl-24">
                                    {TECH_STACK.map((tech, idx) => (
                                        <CarouselItem key={`t1-${idx}`} tech={tech} />
                                    ))}
                                </div>
                                
                                {/* Set 2 (Duplikat untuk efek seamless) */}
                                <div className="flex gap-16 md:gap-24 pl-16 md:pl-94">
                                    {TECH_STACK.map((tech, idx) => (
                                        <CarouselItem key={`t2-${idx}`} tech={tech} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- HOW IT WORKS --- */}
                <section className="py-32 px-6 bg-neutral-50/50 border-t border-neutral-200 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">

                            {/* Left: Content */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={staggerContainer}
                                className="space-y-10"
                            >
                                <div className="space-y-4">
                                    <motion.span variants={fadeInUp} className="text-indigo-600 font-bold tracking-wider text-sm uppercase">Simple Process</motion.span>
                                    <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                                        Skin analysis made <br /> simple and effective.
                                    </motion.h2>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        { title: "Take a Selfie", text: "Ensure good lighting and center your face." },
                                        { title: "AI Processing", text: "MobileNetV2 analyzes textures and pores." },
                                        { title: "Get Results", text: "Receive personalized recommendations." }
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={fadeInUp}
                                            className="flex gap-6 group"
                                        >
                                            <div className="shrink-0 w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-colors">
                                                <span className="font-bold text-neutral-400 group-hover:text-indigo-600 transition-colors">{idx + 1}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                                                <p className="text-neutral-500">{item.text}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Right: 3D FACE SCANNER */}
                            <div className="relative h-[600px] flex items-center justify-center">
                                {/* Blur diperkecil radiusnya untuk performa */}
                                <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-10 rounded-full" />
                                <div className="relative w-full h-full bg-linear-60 from-transparent to-neutral-600 rounded-3xl overflow-hidden shadow-2xl shadow-neutral-900 flex flex-col transform-gpu">
                                    <div className="flex-1 relative z-10 cursor-move">
                                        <FaceScanner />
                                    </div>

                                    <div className="absolute bottom-8 right-8 z-20 pointer-events-none">
                                        <div className="flex items-end flex-col gap-1">
                                            <span className="text-4xl font-black text-white/90">SKinAI</span>
                                            <span className="text-[10px] text-neutral-400 font-mono tracking-widest">PROCESSING UNIT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- CTA SECTION --- */}
                <section className="py-32 px-6 text-center bg-gray-50">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleIn}
                        className="max-w-5xl mx-auto bg-white border border-neutral-100 shadow-2xl shadow-neutral-200/50 rounded-[3rem] p-12 md:p-24 relative overflow-hidden group transform-gpu"
                    >
                        {/* Background blobs statis atau animasi sangat lambat untuk performa */}
                        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-[80px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

                        <div className="relative z-10 space-y-10">
                            <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-tight">
                                Ready to transform <br /> your skin health?
                            </h2>

                            <p className="text-neutral-500 text-lg max-w-xl mx-auto">
                                Join thousands of users who are making smarter, data-driven decisions for their skincare routine today.
                            </p>

                            <Link to={ROUTES.CAMERA} className="inline-block">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 bg-neutral-900 text-white rounded-full font-bold text-xl flex items-center gap-3 mx-auto hover:bg-neutral-800 transition-colors shadow-xl shadow-neutral-900/20"
                                >
                                    Get Started Now <ArrowRight size={22} />
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-white border-t border-neutral-200 pt-16 pb-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-1 md:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 font-bold text-2xl text-neutral-900">
                                    SKinAI
                                </div>
                                <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                                    Mendeteksi kondisi kulit dengan kekuatan Artificial Intelligence. Akurat, cepat, dan aman.
                                </p>
                                <div className="flex gap-4">
                                    {[GithubIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                                        <a key={i} href="#" className="p-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 transition-all">
                                            <Icon size={18} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-neutral-900 mb-4">Product</h4>
                                <ul className="space-y-2 text-sm text-neutral-500">
                                    {['Features', 'Technology', 'Dataset', 'Demo'].map((item) => (
                                        <li key={item}><a href="#" className="hover:text-indigo-600 transition-colors">{item}</a></li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-neutral-900 mb-4">Legal</h4>
                                <ul className="space-y-2 text-sm text-neutral-500">
                                    {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((item) => (
                                        <li key={item}><a href="#" className="hover:text-indigo-600 transition-colors">{item}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-neutral-400 text-sm">
                                © {new Date().getFullYear()} SKinAI Inc. All rights reserved.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                System Operational
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}

// Extracted Component untuk meminimalisir re-render berat
const CarouselItem = React.memo(({ tech }) => (
    <div className="flex items-center gap-4 shrink-0 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default group">
        <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 group-hover:bg-white group-hover:shadow-md transition-all">
            <img src={tech.image} alt={tech.value} loading="lazy" decoding="async" className='w-10 h-10 object-contain' />
        </div>
        <div>
            <h3 className="text-lg font-bold text-neutral-900 leading-tight">{tech.value}</h3>
            <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">{tech.label}</p>
        </div>
    </div>
));

export default HomePage;