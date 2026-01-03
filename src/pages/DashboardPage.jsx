import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Calendar, ArrowRight,
    Activity, Target, Clock, Trash2, Plus, Sparkles,
    ChevronRight,
    MoreHorizontal
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { dashboardAPI, historyAPI } from '../services/api';
import { DIAGNOSIS_COLORS, ROUTES } from '../config';

// --- Animation Config ---
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

export default function DashboardPage() {
    const { isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [recentAnalyses, setRecentAnalyses] = useState([]);
    const [conditionDistribution, setConditionDistribution] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (id) => {
        try {
            await historyAPI.delete(id);
            setRecentAnalyses(prev => prev.filter(item => item.id !== id));
            // Refresh stats slightly optimistically or re-fetch
            const response = await dashboardAPI.getStats();
            setStats(response.data.stats);
        } catch (err) {
            console.error('Failed to delete analysis:', err);
            alert('Failed to delete analysis');
        }
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                const response = await dashboardAPI.getStats();
                setStats(response.data.stats);
                setConditionDistribution(response.data.stats.condition_distribution || []);
                setTrendData(response.data.trend_data || []);
                setRecentAnalyses(response.data.recent_analyses || []);
            } catch (err) {
                console.error('Failed to fetch dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [isAuthenticated]);

    // Demo data for layout visualization (or guest users)
    const demoStats = {
        total_analyses: 0,
        most_frequent_condition: 'None',
        average_confidence: 0,
        improvement_percentage: 0
    };

    const demoPieData = [
        { name: 'Normal', value: 1 },
        { name: 'Oily', value: 1 },
        { name: 'Acne', value: 1 }
    ];

    const displayStats = stats || demoStats;
    const displayTrend = trendData.length > 0 ? trendData : [];
    const displayDistribution = conditionDistribution.length > 0 ? conditionDistribution : demoPieData;
    const hasData = recentAnalyses.length > 0;

    return (
        <div className="min-h-screen bg-white text-zinc-950 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
            <Header />

            <motion.main
                className="max-w-6xl mx-auto px-6 pt-12 md:pt-30"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <motion.div variants={itemVariants} className='max-w-2xl'>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 mb-4">
                            Skin Health <span className="text-zinc-400">Overview</span>
                        </h1>
                        <p className="text-zinc-500 font-light text-lg leading-relaxed">
                            Track your dermatological profile progression over time.
                            Use AI-driven insights to maintain optimal skin health.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Link
                            to={ROUTES.ANALYZE}
                            className="group inline-flex items-center gap-3 px-6 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-zinc-200 hover:shadow-indigo-200 hover:-translate-y-1"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Analysis</span>
                        </Link>
                    </motion.div>
                </div>

                {!isAuthenticated && (
                    <motion.div variants={itemVariants} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 mb-12 flex items-center gap-4">
                        <div className="p-2 bg-white rounded-full border border-zinc-100 shadow-sm">
                            <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                        <p className="text-zinc-600 text-sm">
                            <Link to={ROUTES.LOGIN} className="font-semibold text-zinc-900 hover:underline decoration-indigo-300 underline-offset-4">{t('login')}</Link> to save your progress and access detailed history.
                        </p>
                    </motion.div>
                )}

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={BarChart3}
                        label={t('stats_total')}
                        value={displayStats.total_analyses}
                        trend="Total Scans"
                    />
                    <StatCard
                        icon={Target}
                        label={t('stats_frequent')}
                        value={displayStats.most_frequent_condition || '-'}
                        trend="Dominant Type"
                    />
                    <StatCard
                        icon={Activity}
                        label={t('stats_confidence')}
                        value={`${(displayStats.average_confidence * 100).toFixed(0)}%`}
                        trend="AI Accuracy"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label={t('stats_improvement')}
                        value={displayStats.improvement_percentage ? `+${displayStats.improvement_percentage}%` : '-'}
                        trend="Since last month"
                        highlight={true}
                    />
                </div>

                {/* --- Charts Section --- */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Timeline Chart */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-medium text-lg text-zinc-900 flex items-center gap-2">
                                    {t('chart_timeline')}
                                </h3>
                                <p className="text-sm text-zinc-400 font-light mt-1">Condition frequency over time</p>
                            </div>
                            <Calendar className="w-5 h-5 text-zinc-300" />
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={displayTrend}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#4f46e5"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Distribution Chart */}
                    <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                        <h3 className="font-medium text-lg text-zinc-900 mb-2">{t('chart_distribution')}</h3>
                        <p className="text-sm text-zinc-400 font-light mb-6">Ratio of detected conditions</p>

                        <div className="flex-1 relative min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={displayDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        dataKey="value"
                                        paddingAngle={5}
                                        stroke="none"
                                    >
                                        {displayDistribution.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={DIAGNOSIS_COLORS[entry.name]?.hex || '#e4e4e7'}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Inner Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-light text-zinc-900">{displayStats.total_analyses}</span>
                                <span className="text-xs text-zinc-400 uppercase tracking-widest">Scans</span>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {displayDistribution.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DIAGNOSIS_COLORS[entry.name]?.hex || '#e4e4e7' }} />
                                    <span className="text-xs text-zinc-500 font-medium">
                                        {entry.name}
                                        <span className="text-zinc-300 ml-1">
                                            {hasData ? `${((entry.value / displayStats.total_analyses) * 100).toFixed(0)}%` : '-'}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* --- Recent Analysis List --- */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-lg text-zinc-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-600" />
                                Recent History
                            </h3>
                        </div>
                        <Link to={ROUTES.HISTORY || '#'} className="text-sm font-medium text-zinc-400 hover:text-indigo-600 flex items-center transition-colors">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="divide-y divide-zinc-50">
                        {hasData ? (
                            recentAnalyses.map((analysis, i) => (
                                <HistoryRow key={i} analysis={analysis} onDelete={handleDelete} t={t} />
                            ))
                        ) : (
                            <div className="py-16 text-center">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-6 h-6 text-zinc-300" />
                                </div>
                                <p className="text-zinc-900 font-medium">No analyses yet</p>
                                <p className="text-zinc-400 text-sm mt-1">Start your first analysis to see data here.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}

// --- Sub-components ---

function StatCard({ icon: Icon, label, value, trend, highlight }) {
    return (
        <motion.div
            variants={itemVariants}
            className={`
                p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                ${highlight
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-200'
                    : 'bg-white border-zinc-200 text-zinc-900 hover:border-indigo-100'
                }
            `}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${highlight ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-50 text-indigo-600'}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <p className={`text-4xl font-light mb-1 ${highlight ? 'text-white' : 'text-zinc-900'}`}>{value}</p>
                <p className={`text-sm font-medium ${highlight ? 'text-zinc-300' : 'text-zinc-500'}`}>{label}</p>
                <p className={`text-xs mt-3 ${highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>{trend}</p>
            </div>
        </motion.div>
    );
}

function HistoryRow({ analysis, onDelete, t }) {
    const colors = DIAGNOSIS_COLORS[analysis.skin_condition] || DIAGNOSIS_COLORS.Normal;
    const dateObj = new Date(analysis.created_at);
    const date = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const time = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    const handleDelete = (e) => {
        e.preventDefault();
        if (window.confirm(t('delete_confirm'))) {
            onDelete(analysis.id);
        }
    };

    return (
        <Link
            to={`/history/${analysis.id}`}
            className="group flex items-center justify-between p-6 hover:bg-zinc-50/80 transition-colors"
        >
            <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors.bg.replace('bg-', 'border-').replace('100', '200')} bg-white`}>
                    <div className={`w-3 h-3 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('100', '500')}`} />
                </div>
                <div>
                    <p className="font-medium text-zinc-900 text-lg mb-0.5">{analysis.skin_condition}</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                        <span>{date}</span>
                        <span>•</span>
                        <span>{time}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="text-right hidden md:block">
                    <span className="block text-sm font-bold text-zinc-900">
                        {(analysis.confidence_score * 100).toFixed(0)}%
                    </span>
                    <span className="text-xs text-zinc-400">Confidence</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDelete}
                        className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 text-zinc-300 group-hover:text-indigo-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border border-zinc-100 shadow-xl rounded-2xl">
                <p className="text-sm font-medium text-zinc-900 mb-1">{payload[0].payload.name || payload[0].payload.date}</p>
                <p className="text-xs text-indigo-600 font-mono">
                    Value: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};