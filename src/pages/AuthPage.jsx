import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Lock, Loader2, ArrowLeft, AlertCircle, CheckCircle,
    Quote, Sparkles
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ROUTES } from '../config';

// Import assets (Pastikan path sesuai)
import Modelbg1 from '../assets/modelbg.jpg';
import Modelbg2 from '../assets/modelbg2.jpeg';
import Modelbg3 from '../assets/modelbg3.jpeg';

const carouselImages = [Modelbg1, Modelbg2, Modelbg3];
const SLIDE_DURATION = 3000;

// --- Animation Variants ---
const fadeZoomVariants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 1.5, ease: "easeOut" }
    },
    exit: { 
        opacity: 0,
        transition: { duration: 1 }
    }
};

const formContainerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

export default function AuthPage() {
    const navigate = useNavigate();
    const { login, register, isAuthenticated } = useAuth();
    const { t } = useLanguage();

    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Carousel Logic
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        }, SLIDE_DURATION);
        return () => clearInterval(intervalId);
    }, []);

    // Redirect if authenticated
    if (isAuthenticated) {
        navigate(ROUTES.DASHBOARD);
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        if (mode === 'register') {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
        }

        setLoading(true);

        try {
            if (mode === 'login') {
                await login(email, password);
                navigate(ROUTES.DASHBOARD);
            } else {
                await register(email, password);
                setSuccess('Account created! Please check your email.');
                setMode('login');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Authentication failed.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = (newMode) => {
        setMode(newMode);
        setError('');
        setSuccess('');
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden">

            {/* --- LEFT SIDE: Cinematic Visuals --- */}
            <div className="hidden lg:block lg:w-[55%] relative bg-zinc-900 overflow-hidden">
                <AnimatePresence mode="popLayout">
                    <motion.img
                        key={currentImageIndex}
                        src={carouselImages[currentImageIndex]}
                        alt="Skin Analysis Model"
                        variants={fadeZoomVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                </AnimatePresence>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-16 z-10 text-white">
                    <div className="flex items-center">
                        <span className="font-black text-5xl tracking-tight">SKinAI</span>
                    </div>

                    <div className="max-w-xl">
                        <div className="mb-6">
                            <Quote className="w-10 h-10 text-white/20 mb-4 rotate-180" />
                            <h2 className="text-3xl font-light leading-tight mb-6">
                                "The precision of SkinAI transformed my dermatology practice. It's not just an app; it's a daily essential for skin health."
                            </h2>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-white/30" />
                            <div>
                                <p className="font-semibold text-white">EL-Kadhafi</p>
                                <p className="text-white/60 text-sm">Developer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: Elegant Form --- */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 md:p-16 relative">
                
                <motion.div 
                    className="w-full max-w-sm"
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="mb-10">
                         <Link
                            to={ROUTES.HOME}
                            className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <h1 className="text-4xl font-medium tracking-tight text-zinc-900 mb-3">
                            {mode === 'login' ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-zinc-500 font-light">
                            {mode === 'login' 
                                ? 'Enter your credentials to access your dashboard.' 
                                : 'Start your journey to better skin health today.'}
                        </p>
                    </motion.div>

                    {/* Mode Toggle (Segmented Control) */}
                    <motion.div variants={itemVariants} className="mb-8 p-1 bg-zinc-100 rounded-xl flex relative">
                        {/* Animated Background for Active Tab */}
                        <motion.div
                            layoutId="activeTab"
                            className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm border border-zinc-200/50"
                            initial={false}
                            animate={{
                                left: mode === 'login' ? '4px' : '50%',
                                right: mode === 'login' ? '50%' : '4px',
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                        
                        <button
                            onClick={() => toggleMode('login')}
                            className={`flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors text-center ${mode === 'login' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => toggleMode('register')}
                            className={`flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors text-center ${mode === 'register' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            Sign Up
                        </button>
                    </motion.div>

                    {/* Auth Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 border border-red-100"
                                >
                                    <AlertCircle size={16} className="shrink-0" /> {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm flex items-center gap-2 border border-emerald-100"
                                >
                                    <CheckCircle size={16} className="shrink-0" /> {success}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div variants={itemVariants} className="space-y-4">
                            {/* Email Input */}
                            <div className="group">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
                                    {t('auth_email_label')}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-0 outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="group">
                                <div className="flex justify-between items-center mb-1.5 ml-1">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                        {t('auth_password_label')}
                                    </label>
                                    {mode === 'login' && (
                                        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700">Forgot?</a>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-0 outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Confirm Password (Register Only) */}
                            <AnimatePresence>
                                {mode === 'register' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden group"
                                    >
                                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1 pt-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-0 outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-zinc-900 text-white rounded-xl font-medium shadow-lg shadow-zinc-200 hover:bg-black hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                mode === 'login' ? 'Sign In' : 'Create Account'
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Footer */}
                <motion.div 
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute bottom-8 text-xs text-zinc-400"
                >
                    &copy; 2025 SkinAI Analysis. All rights reserved.
                </motion.div>
            </div>
        </div>
    );
}