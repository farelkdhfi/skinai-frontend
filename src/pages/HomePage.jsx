import React, { useRef, } from 'react';

import Header from '../components/Header';
import HeroSection from '../components/sections/HeroSection';
import CoreFeatureSection from '../components/sections/CoreFeatureSection';
import HorizontalProcessSection from '../components/sections/HorizontalProcessSection';
import DailyRoutineSection from '../components/sections/DailyRoutineSection';
import IngredientsSection from '../components/sections/IngredientsSection';
import DisclaimerSection from '../components/sections/DisclaimerSection';
import EmpowermentSection from '../components/sections/EmpowermentSection';
import Footer from '../components/Footer';

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
            <IngredientsSection />

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