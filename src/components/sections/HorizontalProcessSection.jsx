import React, { useEffect, useRef, useState } from 'react';
import {
    motion,
    useScroll,
    useTransform,
} from 'framer-motion';

import faceAnalysisImg from '../../assets/facewithhandphone.jpg';
import processAnalysisImg from '../../assets/processAnalysis.jpg';
import resultAnalysisImg from '../../assets/resultAnalysis.jpg';

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

    // Logic range dipertahankan, namun visual CSS disesuaikan agar pas
    const endRange = isMobile ? "-75%" : "-50%";

    const x = useTransform(scrollYProgress, [0, 1], ["0%", endRange]);

    const steps = [
        { id: "01", title: "Face Capture", desc: "Pengambilan citra dengan panduan grid otomatis.", img: faceAnalysisImg },
        { id: "02", title: "Segmentation", desc: "Pemisahan area ROI (Region of Interest) secara presisi.", img: processAnalysisImg },
        { id: "03", title: "Result & Heatmap", desc: "Diagnosis akhir dengan validasi area terdampak.", img: resultAnalysisImg },
    ];

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[#f2f2f0]">
            {/* Menggunakan h-[100dvh] untuk mobile agar tidak tertutup address bar browser */}
            <div className="sticky top-0 h-screen supports-[height:100dvh]:h-[100dvh] flex items-center overflow-hidden">
                
                <motion.div 
                    style={{ x }} 
                    className="flex gap-4 md:gap-10 px-4 md:px-12 items-center"
                >
                    {/* Mapping Steps Card */}
                    {steps.map((step, i) => (
                        <div key={i} className="relative w-[85vw] md:w-[60vw] h-[55vh] md:h-[70vh] flex-shrink-0 rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-neutral-200 group">
                            <div className="absolute top-6 left-6 md:top-12 md:left-12 z-20 text-white pr-4">
                                <span className="text-6xl md:text-8xl font-bold opacity-30 tracking-tighter mb-2 md:mb-5 block">{step.id}</span>
                                <h3 className="text-2xl md:text-5xl font-medium mt-2 md:mt-4 leading-tight">{step.title}</h3>
                                <p className="mt-2 md:mt-4 max-w-[80%] md:max-w-md text-sm md:text-lg opacity-90 leading-snug">{step.desc}</p>
                            </div>

                            <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none" />
                        </div>
                    ))}

                    {/* Section Tombol "Mulai Analysis" */}
                    <div className="w-[85vw] md:w-[40vw] h-[55vh] md:h-[70vh] flex-shrink-0 flex flex-col justify-center items-start pl-4 md:pl-16 pr-4">
                        <h3 className="text-4xl md:text-6xl font-medium tracking-tighter mb-4 md:mb-8 text-neutral-800 leading-tight">
                            Ready to <br />
                            <span className="font-serif italic text-neutral-500">Analysis?</span>
                        </h3>
                        <p className="text-base md:text-lg text-neutral-600 mb-6 md:mb-8 max-w-xs leading-relaxed">
                            Dapatkan hasil analisis kulit presisi dalam hitungan detik.
                        </p>

                        <button
                            onClick={() => console.log("Navigate to analysis")}
                            className="group relative px-6 py-3 md:px-8 md:py-4 bg-black text-white rounded-full text-base md:text-xl font-medium overflow-hidden transition-all hover:pr-10 md:hover:pr-12"
                        >
                            <span className="relative z-10">Mulai sekarang</span>
                            {/* Icon Arrow animasi saat hover */}
                            <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm md:text-base">
                                →
                            </span>
                        </button>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};
export default HorizontalProcessSection;