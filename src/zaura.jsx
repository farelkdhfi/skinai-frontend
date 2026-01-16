 const { useState, useEffect, useRef } = React;
        const { motion, useScroll, useTransform, useSpring } = window.Motion;
        
        // Icon Wrapper to simulate Lucide React imports
        const Icon = ({ name, size = 20, className, strokeWidth = 1.5 }) => {
            const iconRef = useRef(null);
            useEffect(() => {
                if (iconRef.current) {
                    lucide.createIcons({
                        icons: { [name]: window.lucide.icons[name] },
                        attrs: { 
                            class: `lucide lucide-${name} ${className || ''}`, 
                            width: size, 
                            height: size, 
                            'stroke-width': strokeWidth 
                        },
                        nameAttr: 'data-lucide',
                    });
                    // Manual clear and append to ensure React doesn't conflict
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    // This is a simplified mock. ideally we render the svg string directly.
                    // For this environment, we will trust the Lucide global replacement on <i> tags
                }
            }, [name, size, className]);

            return <i data-lucide={name} ref={iconRef} className={className}></i>;
        };

        // --- COMPONENTS ---

        const Header = () => (
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center"
            >
                <div className="glass px-6 py-3 rounded-full flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 bg-neutral-900 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold tracking-tight uppercase">SkinAI Research</span>
                </div>
                <nav className="hidden md:flex gap-6 px-8 py-3 glass rounded-full shadow-sm text-sm font-medium text-neutral-600">
                    <a href="#" className="hover:text-black transition-colors">Methodology</a>
                    <a href="#" className="hover:text-black transition-colors">Analysis</a>
                    <a href="#" className="hover:text-black transition-colors">Results</a>
                </nav>
                <button className="bg-neutral-900 text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors">
                    Get Started
                </button>
            </motion.header>
        );

        const ParallaxPhone = () => {
            const ref = useRef(null);
            const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
            const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
            
            return (
                <div ref={ref} className="relative w-full max-w-sm md:max-w-md mx-auto aspect-[9/19] mt-20">
                    <motion.div style={{ y }} className="relative z-10 w-full h-full bg-black rounded-[3rem] border-[8px] border-neutral-900 shadow-2xl overflow-hidden ring-1 ring-neutral-900/10">
                        {/* Dynamic Island */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20"></div>
                        
                        {/* Screen Content */}
                        <div className="w-full h-full bg-white relative">
                            <img 
                                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop" 
                                alt="Face Analysis" 
                                className="w-full h-full object-cover opacity-90"
                            />
                            
                            {/* UI Overlay on Phone */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 pb-12">
                                <div className="flex gap-2 mb-4">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md border border-white/10">MobileNetV2</span>
                                    <span className="bg-green-500/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md border border-white/10">98% Confidence</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "70%" }}
                                            transition={{ duration: 1.5 }}
                                            className="h-full bg-white" 
                                        />
                                    </div>
                                    <div className="flex justify-between text-white/60 text-[10px] font-medium tracking-wide">
                                        <span>ANALYZING TEXTURE</span>
                                        <span>70%</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Scanning Grid Overlay */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                            <div className="absolute inset-4 border border-white/30 rounded-[2rem] border-dashed opacity-50"></div>
                        </div>
                    </motion.div>
                    
                    {/* Glow behind phone */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-blue-500/20 blur-[100px] -z-10 rounded-full"></div>
                </div>
            );
        };

        const Hero = () => {
            return (
                <section className="relative min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-start overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-100 via-transparent to-transparent -z-10"></div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-xs font-medium text-neutral-500 tracking-wide uppercase">AI-Powered Dermatology</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-8xl font-semibold tracking-tighter leading-[0.9] text-neutral-900 mb-6">
                            Precision skin <br />
                            <span className="text-neutral-400 font-serif italic">analysis.</span>
                        </h1>
                        
                        <p className="text-neutral-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
                            Leveraging patch-based MobileNetV2 architecture to detect micro-texture anomalies with clinical-grade accuracy.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-neutral-900 px-8 font-medium text-white transition-all hover:bg-neutral-800 hover:pr-10">
                                <span className="mr-2">Start Analysis</span>
                                <Icon name="arrow-right" size={16} className="transition-all group-hover:translate-x-1" />
                            </button>
                        </div>
                    </motion.div>
                    
                    <ParallaxPhone />
                </section>
            );
        };

        const TechCard = ({ title, desc, icon, delay, video }) => (
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: delay }}
                viewport={{ once: true, margin: "-100px" }}
                className="group sticky top-32 mb-8 last:mb-0 bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
            >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-900">
                            <Icon name={icon} size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-3">{title}</h3>
                            <p className="text-neutral-500 leading-relaxed text-sm md:text-base">{desc}</p>
                        </div>
                        <div className="flex gap-2">
                             {['React', 'Node', 'AI'].map((tag, i) => (
                                 <span key={i} className="text-[10px] font-semibold tracking-wider text-neutral-400 border border-neutral-100 px-2 py-1 rounded-md uppercase bg-neutral-50">{tag}</span>
                             ))}
                        </div>
                    </div>
                    <div className="flex-1 w-full aspect-video md:aspect-square bg-neutral-50 rounded-2xl overflow-hidden relative border border-neutral-100">
                        {video ? (
                            <div className="w-full h-full bg-neutral-900 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-700">
                                <Icon name="play" size={48} className="text-white opacity-50" />
                                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-white text-xs">Live Demo</div>
                            </div>
                        ) : (
                             <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80" alt="Tech" />
                        )}
                    </div>
                </div>
            </motion.div>
        );

        const Features = () => {
            const features = [
                {
                    title: "Smart Guidance",
                    desc: "Real-time face positioning validation using MediaPipe mesh detection to ensure standardized input quality before analysis begins.",
                    icon: "scan-face",
                    video: true
                },
                {
                    title: "Patch-Based Learning",
                    desc: "Our model segments the face into 12 distinct zones (forehead, cheeks, chin) to isolate micro-textures and reduce background noise bias.",
                    icon: "grid",
                    video: false
                },
                {
                    title: "Explainable AI (XAI)",
                    desc: "Transparent decision making with Grad-CAM heatmaps, visualizing exactly which pixels influenced the dermatological prediction.",
                    icon: "lightbulb",
                    video: false
                }
            ];

            return (
                <section className="py-32 px-6 max-w-5xl mx-auto">
                    <div className="mb-20">
                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">Intelligent Architecture.</h2>
                        <p className="text-neutral-500 max-w-md">An integrated system designed to bridge the gap between computer vision and clinical dermatology.</p>
                    </div>
                    <div className="space-y-12">
                        {features.map((f, i) => (
                            <TechCard key={i} {...f} delay={i * 0.1} />
                        ))}
                    </div>
                </section>
            );
        };

        const HorizontalProcess = () => {
            const targetRef = useRef(null);
            const { scrollYProgress } = useScroll({ target: targetRef });
            const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);
            
            const steps = [
                { id: "01", title: "Acquire", desc: "High-resolution capture with auto-lighting correction.", img: "https://images.unsplash.com/photo-1512413914633-b5043f4041ea?q=80&w=2000&auto=format&fit=crop" },
                { id: "02", title: "Process", desc: "MobilenetV2 extraction of feature vectors from skin patches.", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop" },
                { id: "03", title: "Diagnose", desc: "Clustering-based classification and recommendation generation.", img: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000&auto=format&fit=crop" }
            ];

            return (
                <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
                    <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                        <motion.div style={{ x }} className="flex">
                            {steps.map((step, i) => (
                                <div key={i} className="w-screen h-screen flex flex-col md:flex-row items-center justify-center p-8 md:p-24 gap-12 shrink-0 border-r border-white/5 last:border-0">
                                    <div className="md:w-1/2 space-y-6">
                                        <span className="text-[120px] leading-none font-bold text-neutral-800 select-none block tracking-tighter">{step.id}</span>
                                        <h3 className="text-4xl md:text-6xl font-medium text-white tracking-tight">{step.title}</h3>
                                        <p className="text-neutral-400 text-lg md:text-xl max-w-md font-light">{step.desc}</p>
                                    </div>
                                    <div className="md:w-1/2 h-[50vh] w-full rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                                        <img src={step.img} className="w-full h-full object-cover" alt={step.title} />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/50 to-transparent"></div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            );
        };

        const StatsGrid = () => (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {[
                    { label: "Scan Time", val: "1.2s" },
                    { label: "Accuracy", val: "94%" },
                    { label: "Active Users", val: "2k+" },
                    { label: "Data Points", val: "1M" }
                ].map((stat, i) => (
                    <div key={i} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className="text-2xl md:text-3xl font-medium text-neutral-900 tracking-tight">{stat.val}</p>
                    </div>
                ))}
            </div>
        );

        const Dashboard = () => {
            return (
                <section className="py-32 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-neutral-900 mb-4">Daily <span className="text-neutral-400 font-serif italic">Monitoring.</span></h2>
                                <p className="text-neutral-500 max-w-sm">Track your skin's health progression with our bento-grid dashboard.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 bg-neutral-50 px-4 py-2 rounded-full border border-neutral-100">
                                <Icon name="calendar-check" size={16} />
                                <span>Last sync: Just now</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
                            {/* Main Chart */}
                            <div className="md:col-span-2 md:row-span-2 bg-neutral-900 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <div className="bg-white/10 backdrop-blur w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                                            <Icon name="activity" className="text-white" />
                                        </div>
                                        <h3 className="text-3xl font-medium mb-1">Skin Health Index</h3>
                                        <p className="text-neutral-400">Consistent improvement over 30 days.</p>
                                    </div>
                                    <span className="text-4xl font-light tracking-tighter">92.4</span>
                                </div>
                                
                                {/* CSS Graph */}
                                <div className="relative h-48 w-full mt-8 flex items-end gap-2">
                                     {[30, 45, 40, 60, 55, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                                         <motion.div 
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.05, duration: 0.8 }}
                                            className="flex-1 bg-white/20 rounded-t-sm hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300"
                                         />
                                     ))}
                                </div>
                            </div>

                            {/* Secondary Card 1 */}
                            <div className="bg-neutral-50 rounded-[2.5rem] p-8 border border-neutral-100 flex flex-col justify-center items-center text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 mx-auto text-blue-600">
                                        <Icon name="droplets" size={28} />
                                    </div>
                                    <h4 className="text-lg font-semibold text-neutral-900">Hydration</h4>
                                    <p className="text-neutral-500 text-sm mt-1">Optimal Levels</p>
                                </div>
                            </div>

                            {/* Secondary Card 2 */}
                            <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-xl shadow-neutral-100/50 flex flex-col justify-between group cursor-pointer hover:border-neutral-200 transition-colors">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Next Scan</span>
                                    <Icon name="arrow-up-right" size={18} className="text-neutral-300 group-hover:text-black transition-colors" />
                                </div>
                                <div>
                                    <p className="text-3xl font-medium tracking-tight text-neutral-900">08:00 AM</p>
                                    <p className="text-neutral-500 text-sm mt-1">Recommended for best lighting.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <StatsGrid />
                        </div>
                    </div>
                </section>
            );
        };

        const Ingredients = () => {
            const [active, setActive] = useState(0);
            const items = [
                { title: "Salicylic Acid", role: "Beta Hydroxy Acid", desc: "Oil-soluble exfoliant that penetrates deep into pores to dissolve sebum.", color: "bg-teal-900" },
                { title: "Niacinamide", role: "Vitamin B3", desc: "Strengthens barrier function and regulates oil production while soothing.", color: "bg-indigo-900" },
                { title: "Ceramides", role: "Lipids", desc: "Essential fats that hold skin cells together, forming a protective layer.", color: "bg-rose-900" },
                { title: "Retinol", role: "Vitamin A", desc: "Accelerates cell turnover and boosts collagen production.", color: "bg-amber-900" }
            ];

            return (
                <section className="py-32 bg-[#0A0A0A] text-white rounded-t-[3rem] -mt-12 relative z-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-medium tracking-tight">Personalized <br/><span className="text-neutral-500 font-serif italic">Recommendations.</span></h2>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                                <p className="text-neutral-400 text-sm">Based on K-Means Clustering</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 h-[600px] md:h-[500px]">
                            {items.map((item, i) => (
                                <motion.div 
                                    key={i}
                                    onMouseEnter={() => setActive(i)}
                                    onClick={() => setActive(i)}
                                    className={`relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-700 ease-[0.16,1,0.3,1] ${active === i ? 'flex-[3] bg-neutral-800' : 'flex-[1] bg-neutral-900'}`}
                                >
                                    {/* Abstract Background */}
                                    <div className={`absolute inset-0 opacity-20 ${item.color} blur-3xl scale-150`}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

                                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-bold tracking-widest uppercase opacity-50 border border-white/20 px-2 py-1 rounded-full">{item.role}</span>
                                            <div className={`w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-500 ${active === i ? 'rotate-45 opacity-100' : 'rotate-0 opacity-0'}`}>
                                                <Icon name="arrow-up" size={16} />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className={`font-medium transition-all duration-500 ${active === i ? 'text-4xl mb-4' : 'text-xl mb-0 rotate-0 md:-rotate-90 md:origin-bottom-left md:translate-x-8 md:-translate-y-8 whitespace-nowrap'}`}>
                                                {item.title}
                                            </h3>
                                            <div className={`overflow-hidden transition-all duration-700 ${active === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <p className="text-neutral-400 text-lg leading-relaxed max-w-lg">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        const Disclaimer = () => (
            <section className="bg-[#050505] text-neutral-400 py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto border border-white/5 bg-white/[0.02] p-12 rounded-3xl backdrop-blur-sm">
                    <Icon name="shield-check" size={32} className="mx-auto text-neutral-600 mb-6" />
                    <h3 className="text-white text-xl font-medium mb-4">Research Purpose Only</h3>
                    <p className="leading-relaxed font-light text-sm">
                        This system is developed as a final year thesis project at Universitas Siliwangi. 
                        The AI predictions (MobileNetV2) are for academic demonstration and 
                        <span className="text-white font-medium"> do not replace professional medical diagnosis</span>.
                    </p>
                </div>
            </section>
        );

        const Footer = () => (
            <footer className="bg-white py-12 px-6 border-t border-neutral-100 text-sm text-neutral-500 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="font-semibold text-neutral-900 tracking-tight text-lg">SkinAI.</div>
                <div>© 2024 Informatics Engineering, Universitas Siliwangi.</div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-black transition-colors">GitHub</a>
                    <a href="#" className="hover:text-black transition-colors">Thesis Paper</a>
                    <a href="#" className="hover:text-black transition-colors">Contact</a>
                </div>
            </footer>
        );

        const App = () => {
            return (
                <main className="w-full overflow-hidden">
                    <Header />
                    <Hero />
                    <Features />
                    <HorizontalProcess />
                    <Dashboard />
                    <Ingredients />
                    <Disclaimer />
                    <Footer />
                </main>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);