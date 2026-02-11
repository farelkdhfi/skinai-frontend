import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Save, RefreshCw, Sparkles,
    Check, Info, ExternalLink,
    Loader2
} from 'lucide-react';

import { useAnalysis } from '../context/AnalysisContext';
import { useAuth } from '../context/AuthContext';
import { DIAGNOSIS_COLORS, ROUTES } from '../config';
import Header from '../components/Header';

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 50, damping: 20 }
    }
};

export default function ResultsPage() {
    const navigate = useNavigate();
    const { results, patches, recommendations, saveToHistory } = useAnalysis();
    const { isAuthenticated } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Redirect if no results
    useEffect(() => {
        if (!results) {
            navigate(ROUTES.ANALYZE);
        }
    }, [results, navigate]);

    if (!results) return null;

    const diagnosis = results.final_result?.class || 'Unknown';
    const confidence = results.final_result?.confidence || 0;
    const votingMethod = results.final_result?.voting_method || '';
    const colors = DIAGNOSIS_COLORS[diagnosis] || DIAGNOSIS_COLORS.Normal;

    const handleSave = async () => {
        if (isSaved || isSaving) return;

        setIsSaving(true);
        try {
            const saved = await saveToHistory();
            if (saved) {
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-950 pb-32 md:pb-24">
            <Header />

            <motion.main
                // Padding top disesuaikan: pt-24 (mobile) -> pt-32 (desktop) agar pas dengan Header fixed
                className="max-w-5xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-8 md:pb-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- Top Nav --- */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 md:mb-12">
                    <Link to={ROUTES.ANALYZE} className="group inline-flex items-center text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Discard & Return</span>
                    </Link>
                    <div className="text-[10px] md:text-xs font-medium text-zinc-300 uppercase tracking-widest">
                        Analysis Complete
                    </div>
                </motion.div>

                {/* Grid Layout: 1 Column (Mobile) -> 12 Columns (Desktop) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">

                    {/* --- Left Column: Diagnosis Headline --- */}
                    <div className="lg:col-span-5 space-y-6 md:space-y-8">
                        <motion.div variants={itemVariants} className="relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-500 mb-4 md:mb-6">
                                <Sparkles className="w-3 h-3 text-indigo-500" />
                                AI Diagnosis
                            </div>

                            {/* Responsive Text Size */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-zinc-900 mb-3 md:mb-4 leading-[0.95] md:leading-[0.9]">
                                {diagnosis}
                            </h1>
                            <p className="text-base md:text-lg text-zinc-500 font-light leading-relaxed">
                                Our deep learning model identified this condition based on texture, oiliness, and pore analysis.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center gap-4 md:gap-6 pt-6 border-t border-zinc-100">
                            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
                                {/* Simple CSS Ring Chart */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-100" />
                                    <circle
                                        cx="50%" cy="50%" r="45%"
                                        stroke="currentColor" strokeWidth="6" fill="transparent"
                                        strokeDasharray={`${confidence * 280} 280`} // Approx circumference
                                        className={`${colors.text.replace('text-', 'text-')}`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-sm md:text-base font-bold text-zinc-900">{(confidence * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-zinc-900 text-sm md:text-base">Confidence Score</h3>
                                <div className="text-xs md:text-sm text-zinc-400 font-light flex items-center gap-1 mt-1">
                                    <Info className="w-3 h-3" />
                                    <span className="truncate max-w-[200px]">Method: {votingMethod}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- Right Column: Visuals --- */}
                    <div className="lg:col-span-7">
                        {/* Conditional rendering based on analysis type */}
                        {results.predictions?.length === 1 && results.predictions[0].region === 'full_image' ? (
                            <motion.div variants={itemVariants}>
                                <SingleImageCard
                                    item={results.predictions[0]}
                                    patch={patches['full_image']}
                                    heatmap={results.gradcam_heatmaps?.['full_image']}
                                />
                            </motion.div>
                        ) : (
                            <motion.div variants={itemVariants}>
                                <div className="flex items-baseline justify-between mb-4 md:mb-6">
                                    <h3 className="text-base md:text-lg font-medium text-zinc-900">Regional Analysis</h3>
                                    <span className="text-[10px] md:text-xs text-zinc-400 font-light uppercase tracking-wider">AI Focus Areas</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    {results.predictions?.map((item, idx) => (
                                        <PatchCard
                                            key={idx}
                                            item={item}
                                            patch={patches[item.region]}
                                            heatmap={results.gradcam_heatmaps?.[item.region]}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* --- Recommendations Section --- */}
                {recommendations && (
                    <motion.section variants={itemVariants} className="border-t border-zinc-100 pt-10 md:pt-16">
                        <div className="flex items-center gap-3 mb-8 md:mb-10">
                            <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
                            <div>
                                <h2 className="text-xl md:text-2xl font-medium text-zinc-900">Curated Regimen</h2>
                                <p className="text-sm md:text-base text-zinc-400 font-light">Ingredients tailored to your skin profile.</p>
                            </div>
                        </div>

                        {/* Responsive Grid: 1 Col (Mobile) -> 2 Col (Desktop) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            {/* Primary */}
                            <div className="space-y-4 md:space-y-6">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Primary Essentials
                                </h3>
                                <div className="space-y-3">
                                    {recommendations.primary_ingredients?.map((ing, i) => (
                                        <IngredientRow key={i} ingredient={ing} type="primary" />
                                    ))}
                                </div>
                            </div>

                            {/* Alternatives */}
                            {recommendations.alternative_ingredients?.length > 0 && (
                                <div className="space-y-4 md:space-y-6">
                                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
                                        Alternatives
                                    </h3>
                                    <div className="space-y-3">
                                        {recommendations.alternative_ingredients?.map((ing, i) => (
                                            <IngredientRow key={i} ingredient={ing} type="secondary" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}

                {/* --- Sticky Action Bar (Mobile Friendly) --- */}
                <motion.div
                    variants={itemVariants}
                    className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/90 backdrop-blur-xl border-t border-zinc-200 z-50 safe-area-pb"
                >
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4">
                        <span className="hidden sm:block text-xs md:text-sm text-zinc-400 mr-auto">
                            Analysis ID: <span className="font-mono text-zinc-900">{results.analysis_id?.substring(0, 8) || '---'}</span>
                        </span>

                        <div className="flex w-full sm:w-auto gap-3">
                            <Link
                                to={ROUTES.ANALYZE}
                                className="flex-1 sm:flex-none sm:w-auto px-4 md:px-6 py-3 rounded-xl font-medium text-sm md:text-base text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Discard
                            </Link>

                            {isAuthenticated ? (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaved || isSaving}
                                    className={`
                                        flex-1 sm:flex-none sm:w-auto px-6 md:px-8 py-3 rounded-xl font-medium text-sm md:text-base flex items-center justify-center gap-2 transition-all shadow-lg
                                        ${isSaved
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5'
                                        }
                                    `}
                                >
                                    {isSaved ? (
                                        <>
                                            <Check className="w-4 h-4" /> Saved
                                        </>
                                    ) : isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" /> Save Analysis
                                        </>
                                    )}
                                </button>
                            ) : (
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="flex-1 sm:flex-none sm:w-auto px-6 md:px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium text-sm md:text-base flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    Login to Save
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}

// --- Sub-components with Elegant Design ---

function PatchCard({ item, patch, heatmap }) {
    const colors = DIAGNOSIS_COLORS[item.predicted_class] || DIAGNOSIS_COLORS.Normal;

    return (
        <div className="group relative bg-zinc-50 rounded-xl md:rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-300 transition-all duration-300">
            <div className="aspect-square relative">
                {patch && (
                    <img src={patch} alt={item.region} className="w-full h-full object-cover" />
                )}
                {/* Heatmap Overlay */}
                {heatmap && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <img src={heatmap} alt="Heatmap" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                )}

                {/* Floating Badge */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3">
                    <span className={`text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full bg-white/90 backdrop-blur shadow-sm ${colors.text}`}>
                        {item.predicted_class}
                    </span>
                </div>
            </div>

            <div className="p-2 md:p-3 bg-white">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] md:text-xs font-bold uppercase text-zinc-400 tracking-wider">
                        {item.region}
                    </span>
                    <span className="font-mono text-[10px] md:text-xs font-bold text-zinc-900">
                        {(item.confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    );
}

function SingleImageCard({ item, patch, heatmap }) {
    const colors = DIAGNOSIS_COLORS[item.predicted_class] || DIAGNOSIS_COLORS.Normal;

    return (
        <div className="group relative bg-zinc-50 rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200 shadow-sm">
            <div className="aspect-4/3 relative">
                {patch && (
                    <img src={patch} alt="Analyzed skin" className="w-full h-full object-contain p-2" />
                )}
                {heatmap && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <img src={heatmap} alt="Heatmap" className="w-full h-full object-contain p-2" />
                        <div className="absolute inset-0 bg-zinc-900/5 mix-blend-multiply pointer-events-none" />
                    </div>
                )}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 md:px-4 md:py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 flex items-center gap-2 whitespace-nowrap">
                <span className="text-[10px] md:text-xs font-medium text-zinc-500">Prediction:</span>
                <span className={`text-xs md:text-sm font-bold ${colors.text}`}>
                    {item.predicted_class}
                </span>
            </div>
        </div>
    );
}

function IngredientRow({ ingredient, type = 'primary' }) {
    const isPrimary = type === 'primary';

    return (
        <div className={`
            group flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all duration-300
            ${isPrimary
                ? 'bg-white border-zinc-200 hover:border-indigo-300 hover:shadow-md'
                : 'bg-zinc-50/50 border-transparent hover:bg-white hover:border-zinc-200'
            }
        `}>
            <div className={`mt-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shrink-0 ${isPrimary ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-200 text-zinc-500'}`}>
                <Check className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={3} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                    <h4 className="font-medium text-sm md:text-base text-zinc-900 truncate">{ingredient.name}</h4>
                    {ingredient.reference_url && (
                        <a
                            href={ingredient.reference_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-300 hover:text-indigo-600 transition-colors shrink-0"
                        >
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
                <p className="text-xs md:text-sm text-zinc-500 font-light leading-relaxed">
                    {ingredient.what_it_does}
                </p>
            </div>
        </div>
    );
}