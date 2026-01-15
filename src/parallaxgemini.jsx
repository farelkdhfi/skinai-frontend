import React, { useRef } from 'react';
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
    Atom, ScanFace, ShieldCheck, Zap
} from 'lucide-react';

// --- ASSETS ---
import { Header } from '../components/Header';
import { ROUTES } from '../config';

import HeroImg from '../assets/fullface.png';
import faceAnalysis from '../assets/facewithhandphone.png';
import processAnalysis from '../assets/processAnalysis.png';
import resultAnalysis from '../assets/resultAnalysis.png';

// Ingredients Assets
import ingredients1 from '../assets/ingredients/1.png'
import ingredients2 from '../assets/ingredients/2.png'
import ingredients3 from '../assets/ingredients/3.png'
import ingredients4 from '../assets/ingredients/4.png'

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

// --- DATA DEFINITIONS (FIXED: Added missing constants) ---

const TECH_STACK = [
    { label: 'Frontend', value: 'React.js', image: LogoReactjs },
    { label: 'Backend', value: 'Node.js', image: LogoNodejs },
    { label: 'Backend', value: 'Express.js', image: LogoExpress },
    { label: 'Database', value: 'Supabase', image: LogoSupabase },
    { label: 'AI Model', value: 'MobileNetV2', image: LogoMobilenetv2 },
    { label: 'Vision', value: 'MediaPipe', image: LogoMediapipe },
    { label: 'Language', value: 'JavaScript', image: LogoJs },
];

const ACTIVE_INGREDIENTS = [
    {
        id: 1,
        name: "Salicylic Acid",
        role: "Deep Exfoliator",
        text: "Membersihkan pori tersumbat",
        image: ingredients1, // Menggunakan image untuk background card
        avatar: ingredients1,
    },
    {
        id: 2,
        name: "Niacinamide",
        role: "Brightening Agent",
        text: "Mencerahkan noda bekas jerawat",
        image: ingredients2,
        avatar: ingredients2,
    },
    {
        id: 3,
        name: "Tea Tree Oil",
        role: "Anti-Bacterial",
        text: "Melawan bakteri penyebab jerawat",
        image: ingredients3,
        avatar: ingredients3,
    },
    {
        id: 4,
        name: "Hyaluronic Acid",
        role: "Mega Hydrator",
        text: "Menghidrasi tanpa menyumbat pori",
        image: ingredients4,
        avatar: ingredients4,
    }
];

// --- UTILITY COMPONENTS ---

// 1. Smooth Parallax Image Component
const ParallaxImage = ({ src, alt, className, speed = 1 }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    // Efek tarik vertikal halus
    const y = useTransform(scrollYProgress, [0, 1], [-50 * speed, 50 * speed]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
    
    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.img 
                style={{ y, scale }}
                src={src} 
                alt={alt} 
                className="w-full h-full object-cover will-change-transform"
            />
        </div>
    );
};

// 2. Velocity Marquee (Teks jalan ngebut kalau discroll cepat)
const VelocityText = ({ baseVelocity = 100, children }) => {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

    const x = useTransform(baseX, (v) => `${parseFloat(v) % 100}%`); // Wrap string

    const directionFactor = useRef(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
        
        // Reverse direction on scroll up (optional)
        if (velocityFactor.get() < 0) directionFactor.current = -1;
        else if (velocityFactor.get() > 0) directionFactor.current = 1;

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
            <motion.div className="flex flex-nowrap gap-10 text-6xl md:text-9xl font-bold uppercase tracking-tighter opacity-10" style={{ x }}>
                <span className="block mr-10">{children} </span>
                <span className="block mr-10">{children} </span>
                <span className="block mr-10">{children} </span>
                <span className="block mr-10">{children} </span>
            </motion.div>
        </div>
    );
};

// 3. Card Stack Item (Untuk Sticky Section)
const CardStackItem = ({ data, index }) => {
    return (
        <div className="sticky top-40 mb-20 lg:mb-40 last:mb-0"> 
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`${data.color} rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-white/50 relative overflow-hidden h-[500px] flex flex-col justify-between`}
            >
                {/* Content */}
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                        {data.icon}
                    </div>
                    <h3 className="text-3xl font-medium mb-4">{data.title}</h3>
                    <p className="text-neutral-600 text-lg max-w-sm">{data.desc}</p>
                </div>

                {/* Visual */}
                <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-3/4 md:h-full translate-x-10 translate-y-10 md:translate-x-0 md:translate-y-0 rounded-tl-[3rem] overflow-hidden shadow-2xl border-t border-l border-white/50 bg-white">
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

// 4. Horizontal Process Section
const HorizontalProcessSection = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]); // Geser 2/3 karena ada 3 item

    const steps = [
        { id: "01", title: "Face Scan", desc: "Posisikan wajah Anda di depan kamera dalam pencahayaan yang cukup.", img: faceAnalysis },
        { id: "02", title: "AI Analysis", desc: "Model MobileNetV2 memindai tekstur, minyak, dan lesi kulit.", img: processAnalysis },
        { id: "03", title: "Result", desc: "Dapatkan laporan detail dan rekomendasi produk yang personal.", img: resultAnalysis },
    ];

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-neutral-900 text-white">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-0">
                    {steps.map((step, i) => (
                        <div key={i} className="w-screen h-screen flex flex-col md:flex-row items-center justify-center p-10 lg:p-20 shrink-0 gap-10">
                             {/* Text Side */}
                            <div className="w-full md:w-1/2 space-y-6">
                                <span className="text-8xl font-bold text-white/10 block">{step.id}</span>
                                <h3 className="text-4xl md:text-6xl font-medium">{step.title}</h3>
                                <p className="text-neutral-400 text-xl max-w-md leading-relaxed">{step.desc}</p>
                            </div>
                            {/* Image Side */}
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


// --- MAIN PAGE COMPONENT ---

const HomePage = () => {
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className="bg-[#F8F8F7] text-[#111] font-sans selection:bg-black selection:text-white">
            <Header />
            
            {/* SECTION 1: CINEMATIC HERO */}
            <section className="relative min-h-[120vh] w-full flex flex-col items-center pt-40 px-6">
                <div className="sticky top-40 text-center z-10 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                        <span className="text-xs font-medium tracking-wide text-neutral-500">AI-POWERED DERMATOLOGY</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl lg:text-[7rem] font-medium tracking-tight leading-[0.9] text-center"
                    >
                        Scan. Analyze.<br/>
                        <span className="text-neutral-400 font-serif italic">Perfect.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="max-w-md mx-auto text-neutral-500 text-lg leading-relaxed"
                    >
                        Diagnosis kulit tingkat klinis langsung dari browser Anda. Tanpa upload cloud, privasi 100% terjaga.
                    </motion.p>
                    
                    <motion.div
                         initial={{ opacity: 0, scale: 0.8 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Link to={ROUTES?.ANALYZE || '#'} className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-[#111] px-8 font-medium text-neutral-50 transition-all hover:bg-neutral-800 hover:w-52 w-48 mt-8">
                            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                                <div className="relative h-full w-8 bg-white/20" />
                            </div>
                            <span className="mr-2">Mulai Analisis</span>
                            <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform'/>
                        </Link>
                    </motion.div>
                </div>

                {/* Parallax Hero Image Container */}
                <div className="relative w-full max-w-6xl mt-20 h-[60vh] md:h-[80vh] rounded-[2rem] overflow-hidden shadow-2xl z-20">
                    <ParallaxImage 
                        src={HeroImg} 
                        alt="Face Analysis Hero" 
                        className="w-full h-full bg-neutral-200"
                        speed={1.2}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-10 left-10 text-white">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Confidence Score</p>
                                <p className="text-3xl font-light">98.5%</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 hidden md:block">
                                <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Processing Time</p>
                                <p className="text-3xl font-light">~50ms</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: STICKY CARDS (Fixed TECH_STACK usage) */}
            <section className="relative py-32 px-6 lg:px-16 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
                    
                    {/* LEFT: STICKY TITLE */}
                    <div className="lg:w-1/3 h-fit sticky top-32">
                        <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-8">
                            Teknologi di Balik<br/>
                            <span className="text-neutral-400 italic font-serif">Kecerdasan.</span>
                        </h2>
                        <p className="text-neutral-500 mb-8 leading-relaxed">
                            Kami menggabungkan lightweight deep learning dengan computer vision untuk menghadirkan dermatolog pribadi di saku Anda.
                        </p>
                        
                        {/* Display TECH_STACK properly here */}
                        <div className="flex flex-wrap gap-3">
                           {TECH_STACK.map((tech, i) => (
                               <div key={i} className="px-3 py-1.5 rounded-md bg-neutral-100 text-xs font-medium text-neutral-600 border border-neutral-200 flex items-center gap-2 hover:bg-neutral-200 transition-colors cursor-default">
                                   <img src={tech.image} className="w-4 h-4 object-contain grayscale" alt="" />
                                   {tech.value}
                               </div>
                           ))}
                        </div>
                    </div>

                    {/* RIGHT: STACKING CARDS */}
                    <div className="lg:w-2/3 space-y-24 lg:space-y-0 relative">
                        {[
                            {
                                title: "Real-time Detection",
                                desc: "Menggunakan MobileNetV2 untuk inferensi super cepat langsung di browser tanpa lag.",
                                icon: <Zap size={24} />,
                                color: "bg-[#F2F2F0]",
                                img: VideoDemo,
                                isVideo: true
                            },
                            {
                                title: "Privacy First",
                                desc: "Wajah Anda diproses secara lokal (Edge Computing). Data tidak pernah meninggalkan device Anda.",
                                icon: <ShieldCheck size={24} />,
                                color: "bg-[#EAE8E4]",
                                img: processAnalysis,
                                isVideo: false
                            },
                            {
                                title: "High Precision",
                                desc: "Landmark detection 468 titik wajah menggunakan MediaPipe untuk akurasi pinpoint.",
                                icon: <ScanFace size={24} />,
                                color: "bg-[#DFDCD7]",
                                img: faceAnalysis,
                                isVideo: false
                            }
                        ].map((card, index) => (
                            <CardStackItem key={index} data={card} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3: HORIZONTAL PINNING SCROLL */}
            <HorizontalProcessSection />


            {/* SECTION 4: INGREDIENTS AS "FLOATING MATTER" (Fixed Data Usage) */}
            <section className="py-32 bg-[#111] text-white rounded-t-[3rem] -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-10">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-medium tracking-tight">Active Agents</h2>
                            <p className="text-neutral-400 mt-4 max-w-sm">Formula yang dikurasi AI berdasarkan kondisi kulit spesifik Anda.</p>
                        </div>
                        <div className="hidden md:block">
                            <Atom size={48} className="text-white/20 animate-spin-slow" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ACTIVE_INGREDIENTS.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative h-[400px] bg-neutral-900 rounded-3xl overflow-hidden cursor-pointer"
                            >
                                {/* Menggunakan item.image dari data user */}
                                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                
                                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{item.role}</p>
                                    <h3 className="text-2xl font-medium text-white mb-2">{item.name}</h3>
                                    <p className="text-white/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.text}</p>
                                </div>
                                
                                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <ArrowUpRight size={18} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: VELOCITY MARQUEE */}
            <section className="py-20 bg-[#F8F8F7] border-b border-neutral-200 overflow-hidden">
                <VelocityText baseVelocity={-2}>AI DIAGNOSIS • PRECISE • SECURE •</VelocityText>
                <VelocityText baseVelocity={2}>HEALTHY SKIN • CONFIDENCE • GLOW •</VelocityText>
            </section>

            {/* FOOTER */}
            <footer className="bg-white py-12 px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="text-2xl font-bold tracking-tight">SKinAI.</div>
                 <p className="text-neutral-500 text-sm">Designed for final project UNSIL.</p>
                 <div className="flex gap-6 text-sm font-medium">
                     <a href="#" className="hover:underline">Github</a>
                     <a href="#" className="hover:underline">LinkedIn</a>
                 </div>
            </footer>

        </div>
    );
}

export default HomePage;