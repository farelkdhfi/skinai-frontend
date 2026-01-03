import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Camera, LayoutDashboard, User, Menu, X, LogOut, ChevronRight 
} from 'lucide-react';

import { ROUTES } from '../config';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const { t } = useLanguage();
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Detect scroll to change header style
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navItems = [
        { path: ROUTES.ANALYZE, label: t('nav_analyze'), icon: Camera },
        { path: ROUTES.DASHBOARD, label: t('nav_dashboard'), icon: LayoutDashboard },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled || isMobileMenuOpen
                        ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm py-3'
                        : 'bg-transparent py-5'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    
                    {/* --- LOGO --- */}
                    <Link to={ROUTES.HOME} className="flex items-center gap-2 group z-50">
                        <span className={`font-black text-3xl tracking-tight transition-colors ${
                            isScrolled ? 'text-slate-900' : 'text-slate-900'
                        }`}>
                            SKinAI
                        </span>
                    </Link>

                    {/* --- DESKTOP NAV --- */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Navigation Links */}
                        <nav className="flex items-center gap-6">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`text-sm font-medium transition-colors hover:text-slate-900 ${
                                            isActive ? 'text-slate-900' : 'text-slate-500'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Divider */}
                        <div className="w-px h-6 bg-slate-200" />

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <ThemeSwitcher />
                            <LanguageSwitcher />
                            
                            {isAuthenticated ? (
                                <button
                                    onClick={logout}
                                    className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    {t('nav_logout')}
                                </button>
                            ) : (
                                <Link to={ROUTES.LOGIN}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-black transition-all shadow-md shadow-slate-900/10 flex items-center gap-2"
                                    >
                                        <User size={16} />
                                        {t('nav_login')}
                                    </motion.button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* --- MOBILE HAMBURGER --- */}
                    <button 
                        className="md:hidden z-50 p-2 text-slate-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.header>

            {/* --- MOBILE MENU OVERLAY --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col gap-6"
                    >
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 text-slate-900 font-medium"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} className="text-slate-500" />
                                        {item.label}
                                    </div>
                                    <ChevronRight size={16} className="text-slate-400" />
                                </Link>
                            ))}
                        </nav>

                        <div className="h-px bg-slate-100 w-full" />

                        <div className="flex justify-between items-center px-2">
                            <span className="text-sm text-slate-500 font-medium">Settings</span>
                            <div className="flex gap-4">
                                <ThemeSwitcher />
                                <LanguageSwitcher />
                            </div>
                        </div>

                        <div className="mt-auto mb-8">
                            {isAuthenticated ? (
                                <button
                                    onClick={logout}
                                    className="w-full py-4 rounded-xl bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-2"
                                >
                                    <LogOut size={20} />
                                    {t('nav_logout')}
                                </button>
                            ) : (
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                                >
                                    <User size={20} />
                                    {t('nav_login')}
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}