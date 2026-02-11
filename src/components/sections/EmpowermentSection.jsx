import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useScroll,
    useTransform,
} from 'framer-motion';
import {
    ArrowUpRight
} from 'lucide-react';

// --- ASSETS ---

import ClosingVid from '../../assets/video/closing.mp4';


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
            <div className="absolute inset-0 w-full h-full z-0">
                <motion.div style={{ scale }} className="w-full h-full">
                    <video
                        src={ClosingVid}
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
            <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-6 mix-blend-screen w-full">

                {/* Small Label */}
                <motion.p
                    style={{ opacity }}
                    className="text-neutral-400 text-[10px] md:text-sm tracking-[0.3em] uppercase font-medium mb-4 md:mb-6"
                >
                    The Future is Personal
                </motion.p>

                {/* GIANT TYPOGRAPHY */}
                <motion.div style={{ y, opacity }} className="flex flex-col items-center justify-center">
                    <h2 className="text-[18vw] sm:text-[15vw] md:text-[10rem] font-medium tracking-tighter leading-[0.8] md:leading-[0.85] text-white">
                        SMART
                    </h2>
                    
                    {/* Baris kedua dengan style Serif Italic biar kontras */}
                    <div className="flex items-center justify-center gap-3 md:gap-8 mt-2 md:mt-0 w-full">
                        <span className="block h-[1px] w-8 sm:w-16 md:w-32 bg-white/50"></span>
                        <h2 className="text-[8vw] sm:text-[6vw] md:text-[5rem] font-serif italic text-white/90 leading-tight">
                            Insight.
                        </h2>
                        <span className="block h-[1px] w-8 sm:w-16 md:w-32 bg-white/50"></span>
                    </div>
                </motion.div>

                {/* CALL TO ACTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-8 md:mt-20"
                >
                    <Link to="/analyze" className="group flex items-center gap-3 md:gap-4 text-white transition-all hover:opacity-70 cursor-pointer">
                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
                            <ArrowUpRight size={20} className="md:w-6 md:h-6" />
                        </div>
                        <span className="text-xs md:text-lg tracking-widest uppercase font-medium">
                            Start Diagnosis
                        </span>
                    </Link>
                </motion.div>

            </div>

            {/* Footer Credit Kecil */}
            <div className="absolute bottom-6 md:bottom-10 w-full flex justify-between px-6 md:px-10 text-[9px] md:text-[10px] text-neutral-600 font-mono uppercase tracking-widest">
                <span>© 2026 UNSIL INFORMATICS</span>
                <span>SCROLL TO TOP</span>
            </div>

        </section>
    );
};
export default EmpowermentSection;