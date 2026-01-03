import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle2, Lightbulb, User, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { ROUTES } from '../config';

// --- Konfigurasi Animasi ---

// 1. Container Utama: Mengatur orkestrasi (urutan) munculnya anak-anak elemen
const mainContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            // Stagger 0.2s: Elemen berikutnya muncul 0.2 detik setelah elemen sebelumnya
            staggerChildren: 0.25,
            delayChildren: 0.1,
            when: "beforeChildren"
        }
    }
};

// 2. Item Animasi: Gerakan masuk dari bawah ke atas
const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 }, // Mulai dari posisi lebih bawah (40px)
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 45, // Kekakuan pegas (makin kecil makin "lemas/halus")
            damping: 15,   // Redaman (biar tidak terlalu membal)
            duration: 0.8
        }
    }
};

// 3. Tombol Interaksi: Efek hover & tap
const buttonHoverVariants = {
    hover: {
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.98 }
};

const AnalyzeIntroPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-zinc-950 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <Header />

            <motion.main
                className="max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-30"
                variants={mainContainerVariants} // Pasang orkestra di sini
                initial="hidden"
                animate="visible"
            >
                {/* --- URUTAN 1: HERO SECTION (Badge, Judul, Deskripsi) --- */}
                <div className="max-w-3xl mb-20">
                    {/* Item 1: Badge */}
                    <motion.div variants={fadeInUpVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-600 mb-6">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        AI Powered Analysis
                    </motion.div>

                    {/* Item 2: Judul Utama */}
                    <motion.h1 variants={fadeInUpVariants} className="text-5xl md:text-6xl font-medium tracking-tight text-zinc-950 mb-6">
                        Discover your <br />
                        <span className="text-zinc-400">true skin profile.</span>
                    </motion.h1>

                    {/* Item 3: Deskripsi */}
                    <motion.p variants={fadeInUpVariants} className="text-xl text-zinc-500 font-light leading-relaxed max-w-2xl">
                        Utilizing advanced computer vision to detect acne types, oil levels, and skin sensitivity in seconds.
                    </motion.p>
                </div>

                {/* --- GRID LAYOUT --- */}
                {/* Div biasa digunakan sebagai wrapper layout, agar motion variants diteruskan ke children di dalamnya */}
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* --- URUTAN 4: KOLOM KIRI (Guidelines) --- */}
                    <motion.div variants={fadeInUpVariants} className="lg:col-span-5 space-y-8">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                            Prerequisites
                        </h3>

                        <div className="space-y-6">
                            {[
                                { icon: Lightbulb, title: "Optimal Lighting", desc: "Avoid strong shadows. Natural daylight works best." },
                                { icon: User, title: "Neutral Pose", desc: "Face the camera directly without tilting your head." },
                                { icon: CheckCircle2, title: "Clean Lens", desc: "Ensure your camera lens is clean for accuracy." }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-5 group">
                                    <div className="shrink-0 w-12 h-12 rounded-full border border-zinc-100 bg-zinc-50 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors duration-300">
                                        <item.icon className="w-5 h-5 text-zinc-900 group-hover:text-indigo-600 transition-colors" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-lg mb-1">{item.title}</h4>
                                        <p className="text-zinc-500 font-light leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* --- URUTAN 5: KOLOM KANAN (MENU PILIHAN / TOMBOL) --- */}
                    {/* Ini akan muncul paling terakhir sesuai urutan DOM */}
                    <motion.div variants={fadeInUpVariants} className="lg:col-span-7 flex flex-col gap-4 justify-center">

                        {/* Tombol 1: Live Camera */}
                        <motion.button
                            variants={buttonHoverVariants} // Hanya handle hover/tap disini
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => navigate(ROUTES.LIVECAM)}
                            className="group relative w-full text-left p-8 rounded-3xl border border-zinc-200 bg-white hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-900/5 transition-colors duration-300"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-zinc-950 rounded-2xl text-white group-hover:bg-indigo-600 transition-colors duration-300">
                                    <Camera className="w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-2xl font-medium text-zinc-900 mb-2">Live Analysis</h3>
                            <p className="text-zinc-500 font-light">Use your webcam for real-time detection.</p>
                        </motion.button>

                        {/* Tombol 2: Upload Image */}
                        <motion.button
                            variants={buttonHoverVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => navigate(ROUTES.UPLOAD)}
                            className="group relative w-full text-left p-8 rounded-3xl border border-zinc-200 bg-white hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-900/5 transition-colors duration-300"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-900 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors duration-300">
                                    <Upload className="w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-2xl font-medium text-zinc-900 mb-2">Upload Image</h3>
                            <p className="text-zinc-500 font-light">Select a high-quality photo from your gallery.</p>
                        </motion.button>

                    </motion.div>
                </div>
            </motion.main>
        </div>
    );
};

export default AnalyzeIntroPage;