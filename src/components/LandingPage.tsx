import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  ChevronRight,
  Star,
  Users,
  BarChart3,
  Fingerprint,
  Eye
} from "lucide-react";

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================
function AnimatedCounter({ target, suffix = "", prefix = "", duration = 2000 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ============================================
// FLOATING PARTICLE FIELD
// ============================================
function ParticleField() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(99, 102, 241, ${p.opacity}), rgba(139, 92, 246, ${p.opacity * 0.5}))`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// 3D ORBITING RING
// ============================================
function OrbitRing({ size, duration, color, opacity, reverse }: { size: number; duration: number; color: string; opacity: number; reverse?: boolean }) {
  return (
    <motion.div
      className="absolute rounded-full border"
      style={{
        width: size,
        height: size,
        borderColor: `rgba(${color}, ${opacity})`,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: `rgba(${color}, ${opacity * 3})`,
          boxShadow: `0 0 10px rgba(${color}, ${opacity * 2})`,
          top: -5,
          left: '50%',
          marginLeft: -5,
        }}
      />
    </motion.div>
  );
}

// ============================================
// ANIMATED FEATURE CARD (3D)
// ============================================
function FeatureCard3D({ icon: Icon, title, description, gradient, delay }: { icon: any; title: string; description: string; gradient: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateY((x - centerX) / 15);
    setRotateX(-(y - centerY) / 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      className="perspective-1000"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
        className="relative group glass rounded-2xl p-6 cursor-default overflow-hidden"
      >
        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 bg-gradient-to-br ${gradient} rounded-2xl`} />
        
        {/* Shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h3>
          <p className="text-lg text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// STAT CARD
// ============================================
function StatCard({ value, suffix, prefix, label, icon: Icon, color, delay }: { value: number; suffix?: string; prefix?: string; label: string; icon: any; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 200 }}
      className="glass rounded-2xl p-5 text-center group hover:border-white/10 transition-all duration-300 relative overflow-hidden"
    >
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${color} blur-xl`} />
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
        <AnimatedCounter target={value} suffix={suffix} prefix={prefix} />
      </div>
      <div className="text-base text-slate-500 font-medium uppercase tracking-wider mt-1">{label}</div>
    </motion.div>
  );
}

// ============================================
// MAIN LANDING PAGE COMPONENT
// ============================================
interface LandingPageProps {
  currentUser: any;
  onNavigate: (tab: string) => void;
}

export default function LandingPage({ currentUser, onNavigate }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);

  const handleCTA = () => {
    if (currentUser) {
      onNavigate('workspace');
    } else {
      onNavigate('login');
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* ============================================
          SECTION 1: HERO WITH 3D ORBITS & PARTICLES
          ============================================ */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-20"
      >
        {/* Aurora background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-aurora" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] animate-aurora" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] animate-aurora" style={{ animationDelay: '6s' }} />
        </div>

        {/* Particle field */}
        <ParticleField />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 -z-5 animate-grid-pulse"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* 3D Orbiting rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-5">
          <OrbitRing size={350} duration={25} color="99, 102, 241" opacity={0.08} />
          <OrbitRing size={500} duration={35} color="139, 92, 246" opacity={0.06} reverse />
          <OrbitRing size={650} duration={45} color="6, 182, 212" opacity={0.04} />
        </div>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 group cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-base font-semibold text-slate-300 uppercase tracking-widest">
              Zero-Knowledge Protocol Active
            </span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6"
          >
            <span className="block">Autonomous</span>
            <span className="block text-gradient-cyan">AI Negotiation</span>
            <span className="block text-4xl md:text-5xl font-bold text-slate-400 mt-2">
              Protocol Engine
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-2xl md:text-3xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Deploy zero-trust software agents that autonomously discover
            optimal pricing in{" "}
            <span className="text-indigo-400 font-semibold">cryptographic isolation</span>
            {" "}— no vendor margins exposed, no middlemen required.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={handleCTA}
              className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-xl tracking-wide btn-3d cursor-pointer flex items-center justify-center gap-3 overflow-hidden shadow-lg shadow-emerald-500/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>{currentUser ? "Launch Protocol Terminal" : "Start Negotiating"}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => onNavigate('playground')}
              className="glass glass-hover text-slate-300 px-8 py-4 rounded-2xl font-semibold text-xl cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:text-white"
            >
              <Eye className="w-5 h-5" />
              <span>Explore Demo</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-slate-700 flex items-start justify-center p-1.5"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ============================================
          SECTION 2: ANIMATED STATS
          ============================================ */}
      <section className="relative px-4 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard value={847} suffix="K" label="Contracts Processed" icon={BarChart3} color="from-indigo-500 text-emerald-600" delay={0} />
          <StatCard value={99.7} suffix="%" label="Uptime SLA" icon={ShieldCheck} color="from-emerald-500 to-teal-600" delay={0.1} />
          <StatCard value={23} suffix="ms" label="Avg. Latency" icon={Zap} color="from-amber-500 to-orange-600" delay={0.2} />
          <StatCard value={340} prefix="$" suffix="M" label="Total Savings" icon={TrendingUp} color="text-emerald-500 to-pink-600" delay={0.3} />
        </div>
      </section>

      {/* ============================================
          SECTION 3: 3D FEATURE CARDS
          ============================================ */}
      <section className="relative px-4 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16"
        >
          <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase tracking-[0.25em] mb-3 block">Core Architecture</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500">Enterprise Scale</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-xl">
            Every component is designed with cryptographic isolation, autonomous consensus, and zero-trust verification.
          </p>
        </motion.div>        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard3D
            icon={Lock}
            title="Zero-Knowledge Proofs"
            description="Vendor margins, floor prices, and bid strategies remain cryptographically sealed inside isolated execution enclaves."
            gradient="from-indigo-500 to-purple-500"
            delay={0}
          />
          <FeatureCard3D
            icon={Cpu}
            title="Multi-Agent Consensus"
            description="Autonomous buyer and vendor agents negotiate independently, converging on optimal pricing through iterative bidding rounds."
            gradient="from-emerald-500 to-teal-500"
            delay={0.1}
          />
          <FeatureCard3D
            icon={Database}
            title="Isolated Context Cells"
            description="Each vendor agent operates in a private container with its own database - no cross-contamination of proprietary pricing data."
            gradient="from-cyan-500 to-blue-500"
            delay={0.2}
          />
          <FeatureCard3D
            icon={Layers}
            title="Consensus Ledger"
            description="Signed purchase orders are committed to an immutable, append-only ledger with full audit trail and cryptographic verification."
            gradient="from-emerald-500 to-green-500"
            delay={0.3}
          />
          <FeatureCard3D
            icon={Globe}
            title="Live Gateway Protocol"
            description="Connect to real vendor APIs and live market feeds for production-grade autonomous procurement at enterprise scale."
            gradient="from-amber-500 to-orange-500"
            delay={0.4}
          />
          <FeatureCard3D
            icon={Fingerprint}
            title="Cryptographic Identity"
            description="Ed25519 keypairs, deterministic signing, and zero-knowledge proof credits ensure every transaction is verifiable and tamper-proof."
            gradient="from-rose-500 to-pink-500"
            delay={0.5}
          />
        </div>
      </section>

      {/* ============================================
          SECTION 4: HOW IT WORKS (ANIMATED STEPS)
          ============================================ */}
      <section className="relative px-4 py-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-base font-bold text-cyan-400 uppercase tracking-[0.25em] mb-3 block">Protocol Pipeline</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            How It{" "}
            <span className="text-gradient-cyan">Works</span>
          </h2>
        </motion.div>

        <div className="space-y-0 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/30 via-emerald-500/30 to-cyan-500/30 hidden md:block" style={{ marginLeft: '-0.5px' }} />

          {[
            { step: "01", title: "Submit RFP", desc: "Define your procurement needs — product specifications, quantity targets, and maximum budget constraints.", icon: "📋", color: "from-indigo-500 text-emerald-600" },
            { step: "02", title: "Agent Deployment", desc: "Autonomous buyer and vendor agents are initialized inside isolated cryptographic containers with private databases.", icon: "🤖", color: "text-emerald-500 to-pink-600" },
            { step: "03", title: "Multi-Round Bidding", desc: "Agents negotiate iteratively through sealed-bid rounds, converging on optimal pricing without exposing private floors.", icon: "⚡", color: "from-cyan-500 to-teal-600" },
            { step: "04", title: "Consensus & Signing", desc: "The winning bid is verified, a purchase order is generated, cryptographically signed, and committed to the immutable ledger.", icon: "🔐", color: "from-emerald-500 to-green-600" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`flex items-center gap-6 md:gap-10 py-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 hidden md:block" />
              
              {/* Step circle */}
              <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                {item.icon}
              </div>

              <div className="flex-1">
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-base font-extrabold tracking-widest bg-gradient-to-r ${item.color} bg-clip-text text-transparent uppercase`}>
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-lg text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================
          SECTION 5: SOCIAL PROOF / TESTIMONIAL
          ============================================ */}
      <section className="relative px-4 py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden text-center"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <blockquote className="text-3xl md:text-2xl font-semibold text-white leading-relaxed mb-6">
              "DeCo-Supply's zero-knowledge negotiation saved us <span className="text-gradient-cyan font-extrabold">$1.2M</span> on
              our Q3 semiconductor procurement — and no vendor even knew our budget ceiling."
            </blockquote>
            <div>
              <p className="text-lg font-bold text-white">Major Sarah Chen</p>
              <p className="text-base text-slate-500 font-medium">VP Strategic Sourcing, Nexus Defense Corp</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================
          SECTION 6: FINAL CTA
          ============================================ */}
      <section className="relative px-4 py-24 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Ready to Eliminate{" "}
            <span className="text-gradient-fire">Margin Leakage</span>?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-xl mb-10">
            Deploy autonomous negotiation agents in minutes. No code changes needed — 
            just define your requirements and let the protocol work.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleCTA}
              className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-5 rounded-2xl font-bold text-2xl tracking-wide btn-3d cursor-pointer flex items-center justify-center gap-3 overflow-hidden shadow-xl shadow-emerald-500/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <span>{currentUser ? "Open Terminal" : "Get Started Free"}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
          <p className="text-base text-slate-600 mt-6 font-mono">
            No credit card required • 10,000 free proof credits • Enterprise tier available
          </p>
        </motion.div>
      </section>

      {/* Footer accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
    </div>
  );
}
