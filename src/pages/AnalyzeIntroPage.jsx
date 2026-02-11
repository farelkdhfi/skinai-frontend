import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    motion, 
    useScroll, 
    useTransform, 
    useSpring, 
    useMotionValue, 
} from 'framer-motion';
import { Camera, Upload, CheckCircle2, Lightbulb, User, ArrowRight, ScanLine } from 'lucide-react';
import { ROUTES } from '../config';
import Header from '../components/Header';

// --- KOMPONEN UTILITIES ---

// 1. Tilt Card (Kartu dengan efek 3D saat hover)
const TiltCard = ({ children, onClick, className }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Konversi posisi mouse menjadi nilai rotasi (-10deg sampai 10deg)
    const xSpring = useSpring(x);
    const ySpring = useSpring(y);
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative cursor-pointer group perspective-1000 ${className}`}
        >
             {/* Efek Lighting/Glare pada Card */}
            <div 
                style={{ transform: "translateZ(50px)" }} 
                className="absolute inset-4 rounded-3xl bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-colors duration-500 -z-10" 
            />
            {children}
        </motion.div>
    );
};

// 2. Main Page
const AnalyzeIntroPage = () => {
    const navigate = useNavigate();
    
    // Parallax Setup untuk Background Text
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    
    // Unused parallax var removed for cleaner code, or keep if intending to use later
    // const bgTextY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FAFAFA] text-[#111] selection:bg-black selection:text-white font-sans overflow-x-hidden">
            <Header />

            {/* Background Decor (Subtle Gradient Orb) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1], 
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 90, 0] 
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-[60px] md:blur-[100px]" 
                />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* --- SPLIT LAYOUT: STICKY LEFT vs SCROLLABLE RIGHT --- */}
                {/* Mobile: Stacked (Flex-Col), Desktop: Side-by-side (Flex-Row) */}
                <div className="flex flex-col lg:flex-row min-h-screen pt-20 lg:pt-0">
                    
                    {/* LEFT COLUMN: Sticky Info & Guidelines */}
                    <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-start lg:justify-center py-10 lg:py-0 lg:pr-20">
                        
                        {/* Animated Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-neutral-200 shadow-sm w-fit mb-6 md:mb-8"
                        >
                            <ScanLine size={14} className="text-indigo-600 animate-pulse md:w-4 md:h-4" />
                            <span className="text-[10px] md:text-xs font-semibold tracking-widest text-neutral-500 uppercase">AI Diagnostic Tool</span>
                        </motion.div>

                        {/* Huge Title */}
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] md:leading-[0.9] text-neutral-900 mb-6 md:mb-8"
                        >
                            Reveal your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-200 italic font-serif">true profile.</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-base sm:text-lg md:text-xl text-neutral-500 font-light leading-relaxed max-w-md mb-8 md:mb-12"
                        >
                            Teknologi computer vision canggih untuk mendeteksi tipe jerawat, kadar minyak, dan sensitivitas kulit dalam hitungan detik.
                        </motion.p>

                        {/* Prerequisites List (Styled) */}
                        <div className="space-y-4 md:space-y-6 max-w-md w-full">
                            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-300 mb-2 md:mb-4">Prerequisites</h3>
                            {[
                                { icon: Lightbulb, title: "Lighting", desc: "Pastikan wajah terpapar cahaya merata." },
                                { icon: User, title: "Pose", desc: "Wajah menghadap lurus ke kamera." },
                                { icon: CheckCircle2, title: "Clean", desc: "Hapus makeup untuk hasil akurat." }
                            ].map((item, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (index * 0.1) }}
                                    className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/50 border border-transparent hover:border-neutral-200 hover:bg-white transition-all duration-300"
                                >
                                    <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600">
                                        <item.icon size={18} className="md:w-5 md:h-5" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm md:text-base text-neutral-900">{item.title}</h4>
                                        <p className="text-xs md:text-sm text-neutral-500 leading-snug">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Interaction Cards (Scrollable/Float) */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-start lg:justify-center items-center gap-6 md:gap-8 pb-20 pt-10 lg:pt-0 lg:pb-0">
                        
                        {/* PILIHAN 1: LIVE CAMERA */}
                        <TiltCard 
                            onClick={() => navigate(ROUTES.LIVECAM)}
                            className="w-full max-w-sm md:max-w-md"
                        >
                            <div className="relative overflow-hidden bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-neutral-200 shadow-2xl shadow-neutral-200/50 group-hover:border-indigo-500/30 transition-colors h-[320px] md:h-[400px] flex flex-col justify-between">
                                {/* Decorative BG */}
                                <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-indigo-50 rounded-full blur-[60px] md:blur-[80px] -mr-16 -mt-16 md:-mr-20 md:-mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <Camera size={24} className="md:w-8 md:h-8" strokeWidth={1.5} />
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-neutral-200 flex items-center justify-center group-hover:bg-neutral-900 group-hover:border-neutral-900 group-hover:text-white transition-all duration-300">
                                        <ArrowRight size={14} className="md:w-4 md:h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl md:text-4xl font-medium text-neutral-900 mb-2 group-hover:translate-x-2 transition-transform duration-300">Live Analysis</h3>
                                    <p className="text-neutral-500 text-base md:text-lg">Gunakan webcam untuk deteksi real-time instan.</p>
                                </div>
                            </div>
                        </TiltCard>

                        {/* PILIHAN 2: UPLOAD */}
                        <TiltCard 
                            onClick={() => navigate(ROUTES.UPLOAD)}
                            className="w-full max-w-sm md:max-w-md"
                        >
                             <div className="relative overflow-hidden bg-[#F2F2F0] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-transparent shadow-xl group-hover:shadow-2xl hover:bg-white transition-all duration-500 h-[260px] md:h-[300px] flex flex-col justify-between">
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white border border-neutral-200 text-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <Upload size={20} className="md:w-7 md:h-7" strokeWidth={1.5} />
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-neutral-300 flex items-center justify-center group-hover:bg-neutral-900 group-hover:border-neutral-900 group-hover:text-white transition-all duration-300">
                                        <ArrowRight size={14} className="md:w-4 md:h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xl md:text-3xl font-medium text-neutral-900 mb-2 group-hover:translate-x-2 transition-transform duration-300">Upload Image</h3>
                                    <p className="text-neutral-500 text-sm md:text-base">Pilih foto resolusi tinggi dari galeri Anda.</p>
                                </div>
                            </div>
                        </TiltCard>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default AnalyzeIntroPage;