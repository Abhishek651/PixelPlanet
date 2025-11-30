import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import SideNavbar from '../components/SideNavbar';
import BottomNavbar from '../components/BottomNavbar';

const AboutPage = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            <SideNavbar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
                    {/* Hero Section */}
                    <HeroSection mousePosition={mousePosition} scrollYProgress={scrollYProgress} />
                    
                    {/* Mission Section */}
                    <MissionSection />
                    
                    {/* Innovation Section */}
                    <InnovationSection />
                    
                    {/* Scope Section */}
                    <ScopeSection />
                    
                    {/* Team Section */}
                    <TeamSection />
                    
                    {/* Values Section */}
                    <ValuesSection />
                    
                    {/* CTA Section */}
                    <CTASection />
                </main>
                <BottomNavbar />
            </div>
        </div>
    );
};

export default AboutPage;


// Hero Section Component
const HeroSection = ({ mousePosition, scrollYProgress }) => {
    const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
    
    const springConfig = { stiffness: 50, damping: 30 };
    const mouseX = useSpring(mousePosition.x, springConfig);
    const mouseY = useSpring(mousePosition.y, springConfig);

    return (
        <motion.section 
            style={{ y, opacity }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8"
        >
            {/* Animated Background Particles */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-green-400 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 1, 0.2],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    />
                ))}
            </div>

            {/* Mouse Follower Effect */}
            <motion.div
                className="absolute w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"
                style={{
                    x: useTransform(mouseX, (value) => (value - 192) * 0.5),
                    y: useTransform(mouseY, (value) => (value - 192) * 0.5),
                }}
            />

            <div className="relative z-10 text-center max-w-5xl">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="mb-8"
                >
                    <span className="text-6xl md:text-8xl">🏆</span>
                </motion.div>

                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6"
                >
                    Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Invictus</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
                >
                    Unconquered. Undefeated. Unstoppable.
                </motion.p>

                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto"
                >
                    We are a team of passionate innovators dedicated to transforming environmental education 
                    through gamification and technology.
                </motion.p>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mt-12"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-green-400"
                    >
                        <span className="material-symbols-outlined text-4xl">expand_more</span>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
};


// Mission Section Component
const MissionSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="min-h-screen flex items-center justify-center px-4 md:px-8 py-20">
            <div className="max-w-6xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Our <span className="text-green-400">Mission</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-600 mx-auto"></div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-green-400/50 transition-all duration-300"
                    >
                        <div className="text-5xl mb-4">🌍</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Environmental Impact</h3>
                        <p className="text-gray-300 leading-relaxed">
                            We believe in creating a sustainable future by empowering the next generation with 
                            knowledge and tools to make environmentally conscious decisions. Our platform transforms 
                            complex environmental concepts into engaging, actionable learning experiences.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-green-400/50 transition-all duration-300"
                    >
                        <div className="text-5xl mb-4">🎮</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Gamified Learning</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Through innovative gamification, we make environmental education fun, competitive, and 
                            rewarding. Students don't just learn—they experience, compete, and grow while making 
                            real-world impact through their digital achievements.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};


// Innovation Section Component
const InnovationSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const innovations = [
        {
            icon: "🚀",
            title: "AI-Powered Learning",
            description: "Adaptive learning paths that evolve with each student's progress and interests."
        },
        {
            icon: "🏆",
            title: "Real-Time Competition",
            description: "Live leaderboards and challenges that foster healthy competition and engagement."
        },
        {
            icon: "📊",
            title: "Impact Analytics",
            description: "Comprehensive dashboards showing real environmental impact of collective actions."
        },
        {
            icon: "🎯",
            title: "Personalized Quests",
            description: "Custom challenges tailored to individual learning styles and environmental interests."
        }
    ];

    return (
        <section ref={ref} className="min-h-screen flex items-center justify-center px-4 md:px-8 py-20 bg-black/20">
            <div className="max-w-7xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Our <span className="text-green-400">Innovation</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Pioneering the future of environmental education with cutting-edge technology
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {innovations.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10, transition: { duration: 0.4 } }}
                            className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-lg rounded-2xl p-6 border border-green-400/20 hover:border-green-400/50 transition-all duration-300"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="text-5xl mb-4"
                            >
                                {item.icon}
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// Scope Section Component
const ScopeSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

    const scopes = [
        {
            number: "01",
            title: "Educational Institutions",
            description: "Building partnerships with schools and universities to revolutionize environmental education through gamification.",
            stats: "Our Vision"
        },
        {
            number: "02",
            title: "Global Expansion",
            description: "Starting locally, dreaming globally. Our goal is to create a worldwide network of eco-conscious learners making real impact.",
            stats: "Future Ready"
        },
        {
            number: "03",
            title: "Sustainable Impact",
            description: "Measuring and amplifying environmental impact through technology, one student, one institution at a time.",
            stats: "Growing Daily"
        }
    ];

    return (
        <section ref={ref} className="min-h-screen flex items-center justify-center px-4 md:px-8 py-20">
            <motion.div style={{ scale }} className="max-w-6xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Our <span className="text-green-400">Future Scope</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Starting small, thinking big. Building the future of environmental education
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {scopes.map((scope, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="relative"
                        >
                            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-green-400/50 transition-all duration-300 overflow-hidden group">
                                <div className="absolute top-0 right-0 text-9xl font-black text-green-400/5 group-hover:text-green-400/10 transition-all duration-300">
                                    {scope.number}
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="text-green-400 font-bold text-sm mb-2">{scope.number}</div>
                                        <h3 className="text-3xl font-bold text-white mb-3">{scope.title}</h3>
                                        <p className="text-gray-300 leading-relaxed">{scope.description}</p>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <div className="text-3xl font-black text-green-400">{scope.stats}</div>
                                        <div className="text-sm text-gray-400 mt-1">Starting Now</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};


// Team Section Component
const TeamSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="min-h-screen flex items-center justify-center px-4 md:px-8 py-20 bg-black/20">
            <div className="max-w-6xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Meet Team <span className="text-green-400">Invictus</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        A diverse group of innovators, educators, and environmental advocates
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-lg rounded-3xl p-12 border border-green-400/20 text-center"
                >
                    <div className="text-7xl mb-6">👥</div>
                    <h3 className="text-3xl font-bold text-white mb-4">United by Purpose</h3>
                    <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                        Our team brings together expertise in education, technology, environmental science, 
                        and game design to create an unparalleled learning experience.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                        {[
                            { icon: '💻', label: 'Tech Innovation' },
                            { icon: '📚', label: 'Education Focus' },
                            { icon: '🎨', label: 'Creative Design' },
                            { icon: '🌍', label: 'Eco Science' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl mb-2">
                                    {item.icon}
                                </div>
                                <div className="text-gray-300 font-medium">{item.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};


// Values Section Component
const ValuesSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const values = [
        {
            icon: "💪",
            title: "Invictus Spirit",
            description: "Unconquered in our mission to create positive environmental change"
        },
        {
            icon: "🌱",
            title: "Sustainability First",
            description: "Every decision we make considers its environmental impact"
        },
        {
            icon: "🤝",
            title: "Collaboration",
            description: "Working together with educators, students, and institutions worldwide"
        },
        {
            icon: "💡",
            title: "Innovation",
            description: "Constantly pushing boundaries to make learning more engaging"
        },
        {
            icon: "🎯",
            title: "Impact Driven",
            description: "Measuring success by real-world environmental improvements"
        },
        {
            icon: "🌟",
            title: "Excellence",
            description: "Committed to delivering the highest quality educational experience"
        }
    ];

    return (
        <section ref={ref} className="min-h-screen flex items-center justify-center px-4 md:px-8 py-20">
            <div className="max-w-7xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Our <span className="text-green-400">Values</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        The principles that guide everything we do
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-green-400/50 transition-all duration-300 cursor-pointer group"
                        >
                            <motion.div
                                className="text-5xl mb-4 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110"
                                style={{
                                    filter: 'drop-shadow(0 0 0 transparent)',
                                }}
                                whileHover={{
                                    filter: 'drop-shadow(0 10px 20px rgba(74, 222, 128, 0.4))',
                                }}
                            >
                                {value.icon}
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// CTA Section Component
const CTASection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section ref={ref} className="min-h-screen flex items-center justify-center px-4 md:px-8 py-20 bg-black/20">
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="max-w-4xl w-full text-center"
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl mb-8"
                >
                    🚀
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Join the <span className="text-green-400">Revolution</span>
                </h2>

                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Be part of a global movement transforming environmental education. 
                    Together, we can create a sustainable future for generations to come.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-green-400/50 transition-all duration-300"
                    >
                        Get Started Today
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-bold rounded-full text-lg border-2 border-white/20 hover:border-green-400/50 transition-all duration-300"
                    >
                        Learn More
                    </motion.button>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                >
                    {[
                        { number: 'Beta', label: 'Launch Phase' },
                        { number: '∞', label: 'Potential' },
                        { number: '2025', label: 'Our Year' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                        >
                            <div className="text-3xl md:text-4xl font-black text-green-400 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};
