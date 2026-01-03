import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Info, TrendingUp, AlertCircle, Clock, Check, ExternalLink, Trash2, ArrowUpRight } from 'lucide-react';
import { historyAPI } from '../services/api';
import { Header } from '../components/Header';
import { DIAGNOSIS_COLORS, ROUTES, API_URL } from '../config';

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
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

export default function HistoryDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await historyAPI.getById(id);
                setAnalysis(response.data.analysis);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load analysis details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAnalysis();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-zinc-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-zinc-400 text-sm tracking-widest uppercase">Loading Analysis</p>
                </div>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-medium text-zinc-900 mb-2">Unable to load</h2>
                    <p className="text-zinc-500 mb-8 font-light">{error || 'Analysis not found'}</p>
                    <Link to={ROUTES.DASHBOARD} className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const colors = DIAGNOSIS_COLORS[analysis.skin_condition] || DIAGNOSIS_COLORS.Normal;
    const dateObj = new Date(analysis.created_at);
    const date = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = API_URL.replace(/\/api\/?$/, '');
        return `${baseUrl}${path}`;
    };

    return (
        <div className="min-h-screen bg-white text-zinc-950 selection:bg-indigo-100 selection:text-indigo-900 pb-24">
            <Header />

            <motion.main
                className="max-w-5xl mx-auto px-6 pt-30"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- Top Navigation --- */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-12">
                    <Link to={ROUTES.DASHBOARD} className="group inline-flex items-center text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>

                    <button
                        onClick={async () => {
                            if (window.confirm('Delete this record permanently?')) {
                                try {
                                    setLoading(true);
                                    await historyAPI.delete(id);
                                    navigate(ROUTES.DASHBOARD);
                                } catch (err) {
                                    alert('Failed to delete');
                                    setLoading(false);
                                }
                            }
                        }}
                        className="text-zinc-400 hover:text-red-600 transition-colors p-2"
                        title="Delete Analysis"
                    >
                        <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-12">

                    {/* --- Left Column: Result & Stats --- */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Hero Result */}
                        <motion.div variants={itemVariants}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-500 mb-6">
                                <span className={`w-2 h-2 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('100', '500')}`}></span>
                                Analysis Result
                            </div>
                            <h1 className="text-6xl font-medium tracking-tighter text-zinc-900 mb-2 capitalize">
                                {analysis.skin_condition}
                            </h1>
                            <p className="text-zinc-400 font-light text-lg">
                                Detected with high precision.
                            </p>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 border-t border-zinc-100 pt-8">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-900">
                                    <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Confidence</p>
                                    <p className="text-2xl font-light text-zinc-900">{(analysis.confidence_score * 100).toFixed(1)}%</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-900">
                                    <Calendar className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Date Recorded</p>
                                    <p className="text-lg font-light text-zinc-900">{date}</p>
                                    <p className="text-sm text-zinc-400">{time}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Technical Info */}
                        <motion.div variants={itemVariants} className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
                            <div className="flex items-center gap-2 mb-3 text-indigo-900">
                                <Info className="w-4 h-4" />
                                <span className="text-sm font-semibold">Methodology</span>
                            </div>
                            <p className="text-sm text-indigo-900/70 leading-relaxed font-light">
                                This analysis utilized the <strong>{analysis.voting_method}</strong> method, scanning <strong>{analysis.patches_analyzed} distinct regions</strong> of the face to ensure diagnostic accuracy.
                            </p>
                        </motion.div>
                    </div>

                    {/* --- Right Column: Visuals & Ingredients --- */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* 1. Focus Patches */}
                        {analysis.analysis_patches?.length > 0 && (
                            <motion.div variants={itemVariants}>
                                <div className="flex items-baseline justify-between mb-6">
                                    <h3 className="text-xl font-medium text-zinc-900">Regional Analysis</h3>
                                    <span className="text-sm text-zinc-400 font-light">AI Focus Areas</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {analysis.analysis_patches.map((patch, idx) => (
                                        <PatchCard
                                            key={idx}
                                            item={patch}
                                            imageUrl={getImageUrl(patch.image_url)}
                                            heatmapUrl={getImageUrl(patch.heatmap_image_url)}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* 2. Full Image & Heatmap */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <div className="flex items-baseline justify-between mb-2">
                                <h3 className="text-xl font-medium text-zinc-900">Full Spectrum Scan</h3>
                            </div>

                            {analysis.image_url ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3 group">
                                        <div className="aspect-4/3 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 relative">
                                            <img
                                                src={getImageUrl(analysis.image_url)}
                                                alt="Original"
                                                className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-400 text-center uppercase tracking-widest">Original Source</p>
                                    </div>

                                    {analysis.heatmap_image_url && (
                                        <div className="space-y-3 group">
                                            <div className="aspect-4/3 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 relative">
                                                <div className="absolute inset-0 bg-zinc-900/5 mix-blend-multiply z-10 pointer-events-none"></div>
                                                <img
                                                    src={getImageUrl(analysis.heatmap_image_url)}
                                                    alt="Heatmap"
                                                    className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                            <p className="text-xs text-zinc-400 text-center uppercase tracking-widest">Grad-CAM Heatmap</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-12 border border-dashed border-zinc-200 rounded-2xl text-center text-zinc-400 font-light">
                                    Source images not available.
                                </div>
                            )}
                        </motion.div>

                        {/* 3. Recommendations */}
                        {analysis.recommended_ingredients && (
                            <motion.div variants={itemVariants} className="pt-8 border-t border-zinc-100">
                                <h3 className="text-xl font-medium text-zinc-900 mb-8">Curated Ingredients</h3>

                                <div className="space-y-8">
                                    {/* Primary */}
                                    {analysis.recommended_ingredients.primary_ingredients && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <h4 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Highly Recommended</h4>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {analysis.recommended_ingredients.primary_ingredients.map((ing, i) => (
                                                    <IngredientCard key={i} ingredient={ing} type="primary" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Alternatives */}
                                    {analysis.recommended_ingredients.alternative_ingredients?.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                                                <h4 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Alternatives</h4>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {analysis.recommended_ingredients.alternative_ingredients.map((ing, i) => (
                                                    <IngredientCard key={i} ingredient={ing} type="secondary" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fallback for simple array format */}
                                    {Array.isArray(analysis.recommended_ingredients) && (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {analysis.recommended_ingredients.map((ing, i) => (
                                                <IngredientCard key={i} ingredient={ing} type="primary" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.main>
        </div>
    );
}

// --- Sub-components with Elegant Design ---

function PatchCard({ item, imageUrl, heatmapUrl }) {
    const colors = DIAGNOSIS_COLORS[item.predicted_class] || DIAGNOSIS_COLORS.Normal;

    return (
        <div className="group relative">
            <div className="aspect-square bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 relative mb-3">
                {imageUrl ? (
                    <img src={imageUrl} alt={item.region} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">No Image</div>
                )}

                {/* Heatmap Overlay on Hover */}
                {heatmapUrl && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white">
                        <img src={heatmapUrl} alt="Heatmap" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-linear-to-t from-black/50 to-transparent text-center">
                            <span className="text-[10px] text-white font-medium tracking-wide">HEATMAP</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-start px-1">
                <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider mb-0.5">{item.region}</p>
                    <p className={`text-xs font-semibold ${colors.text.replace('text-', 'text-').replace('700', '900')}`}>
                        {item.predicted_class}
                    </p>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100">
                    {(item.confidence * 100).toFixed(0)}%
                </div>
            </div>
        </div>
    );
}

function IngredientCard({ ingredient, type = 'primary' }) {
    const isPrimary = type === 'primary';

    return (
        <div className={`
            group flex flex-col p-5 rounded-2xl border transition-all duration-300 h-full
            ${isPrimary
                ? 'bg-white border-zinc-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5'
                : 'bg-zinc-50/50 border-zinc-100 hover:bg-white hover:border-zinc-200'
            }
        `}>
            <div className="flex justify-between items-start mb-3">
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${isPrimary ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}
                `}>
                    <Check className="w-4 h-4" strokeWidth={2} />
                </div>
                {ingredient.reference_url && (
                    <a
                        href={ingredient.reference_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-300 hover:text-indigo-600"
                        title="Read Research"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>

            <h4 className="font-medium text-zinc-900 mb-2 group-hover:text-indigo-900 transition-colors">
                {ingredient.name}
            </h4>
            <p className="text-sm text-zinc-500 font-light leading-relaxed line-clamp-3">
                {ingredient.what_it_does}
            </p>
        </div>
    );
}