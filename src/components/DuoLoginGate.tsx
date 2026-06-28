import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Mail, 
  User, 
  Building, 
  Fingerprint, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Key, 
  Check, 
  ShieldCheck, 
  Terminal,
  Shield,
  ArrowRight,
  Sparkles,
  Server
} from "lucide-react";
import { User as UserType } from "../types";

interface DuoLoginGateProps {
  onAuthSuccess: (user: UserType) => void;
}

export default function DuoLoginGate({ onAuthSuccess }: DuoLoginGateProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleGroup, setRoleGroup] = useState<"officer" | "admin">("officer");
  const [officerRole, setOfficerRole] = useState("Procurement Officer");
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and process states
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [generatedUser, setGeneratedUser] = useState<UserType | null>(null);

  const officerRolesList = [
    "Procurement Officer",
    "Lead Purchasing Architect",
    "Director of Strategic Sourcing",
    "Consensus Audit Auditor"
  ];

  // Initialize demo accounts in local storage if not present
  useEffect(() => {
    try {
      const storedUsersStr = localStorage.getItem("deco_supply_users");
      const storedUsers: UserType[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
      
      const demoUsers: UserType[] = [
        {
          email: "admin@deco.supply",
          fullName: "Director Sarah Croft",
          companyName: "DeCo-Supply Global Command",
          role: "Admin",
          publicKey: "pk_aicoo_0x9f9a2e31912dcb01",
          privateKeySeed: "sk_aicoo_0x83e29f102cbda041",
          registeredAt: "2026-01-01"
        },
        {
          email: "officer@vance.gov",
          fullName: "Major James Vance",
          companyName: "Global Defense Procurement",
          role: "Procurement Officer",
          publicKey: "pk_aicoo_0x4f12e8213db929a0",
          privateKeySeed: "sk_aicoo_0x7b1129bc78ae99d1",
          registeredAt: "2026-03-15"
        }
      ];

      // Merge demo accounts into stored users if they don't already exist
      const mergedUsers = [...storedUsers];
      demoUsers.forEach(demo => {
        if (!mergedUsers.some(u => u.email.toLowerCase() === demo.email.toLowerCase())) {
          mergedUsers.push(demo);
        }
      });
      localStorage.setItem("deco_supply_users", JSON.stringify(mergedUsers));
    } catch (e) {
      console.error("Failed to seed demo accounts:", e);
    }
  }, []);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please input email and security password.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid professional email address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate cryptographic gate verification
    setTimeout(() => {
      try {
        const storedUsersStr = localStorage.getItem("deco_supply_users");
        const storedUsers: UserType[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        
        // Find user by email
        const user = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          setError("No registered credentials matching this email address.");
          setIsSubmitting(false);
          return;
        }

        // Demo passwords bypass / simple match check
        if (email.toLowerCase() === "admin@deco.supply" && password !== "admin123") {
          setError("Incorrect security passcode for Administrator account.");
          setIsSubmitting(false);
          return;
        }
        if (email.toLowerCase() === "officer@vance.gov" && password !== "officer123") {
          setError("Incorrect credential passkey for Procurement Officer.");
          setIsSubmitting(false);
          return;
        }

        setIsSubmitting(false);
        onAuthSuccess(user);
      } catch (err) {
        setError("Cryptographic database connection failure. Try again.");
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const triggerQuickDemoLogin = (type: "admin" | "officer") => {
    setError("");
    setIsSubmitting(true);
    
    const targetEmail = type === "admin" ? "admin@deco.supply" : "officer@vance.gov";
    
    setTimeout(() => {
      try {
        const storedUsersStr = localStorage.getItem("deco_supply_users");
        const storedUsers: UserType[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        const user = storedUsers.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
        
        if (user) {
          setIsSubmitting(false);
          onAuthSuccess(user);
        } else {
          // Fallback if not loaded
          const fallbackUser: UserType = type === "admin" ? {
            email: "admin@deco.supply",
            fullName: "Director Sarah Croft",
            companyName: "DeCo-Supply Global Command",
            role: "Admin",
            publicKey: "pk_aicoo_0x9f9a2e31912dcb01",
            privateKeySeed: "sk_aicoo_0x83e29f102cbda041",
            registeredAt: "2026-01-01"
          } : {
            email: "officer@vance.gov",
            fullName: "Major James Vance",
            companyName: "Global Defense Procurement",
            role: "Procurement Officer",
            publicKey: "pk_aicoo_0x4f12e8213db929a0",
            privateKeySeed: "sk_aicoo_0x7b1129bc78ae99d1",
            registeredAt: "2026-03-15"
          };
          setIsSubmitting(false);
          onAuthSuccess(fallbackUser);
        }
      } catch (e) {
        setIsSubmitting(false);
        setError("Failed to boot demo account profile.");
      }
    }, 800);
  };

  const generateKeyPair = (seedName: string) => {
    const rawSeed = seedName + Date.now();
    let hash = 0;
    for (let i = 0; i < rawSeed.length; i++) {
      const char = rawSeed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const hex1 = Math.abs(hash).toString(16).padStart(8, "0");
    const hex2 = Math.abs(hash * 31).toString(16).padStart(8, "0");
    const hex3 = Math.abs(hash * 97).toString(16).padStart(8, "0");
    
    return {
      publicKey: `pk_aicoo_0x${hex1}${hex2}`,
      privateKeySeed: `sk_aicoo_0x${hex2}${hex3}`
    };
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !fullName || !companyName || !password) {
      setError("Please fill in all details to compile your account.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please use a valid professional email address.");
      return;
    }

    if (password.length < 5) {
      setError("Security passphrase must be at least 5 characters.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const storedUsersStr = localStorage.getItem("deco_supply_users");
        const storedUsers: UserType[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        
        const alreadyExists = storedUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (alreadyExists) {
          setError("An account with this email is already registered.");
          setIsSubmitting(false);
          return;
        }

        setIsSubmitting(false);
        setIsGeneratingKey(true);
        
        const keys = generateKeyPair(fullName);
        const resolvedRole = roleGroup === "admin" ? "Admin" : officerRole;
        
        const newUser: UserType = {
          email,
          fullName,
          companyName,
          role: resolvedRole,
          publicKey: keys.publicKey,
          privateKeySeed: keys.privateKeySeed,
          registeredAt: new Date().toISOString().split("T")[0]
        };

        setGeneratedUser(newUser);

        // Step through simulated cryptographic key creation
        setTimeout(() => {
          setIsGeneratingKey(false);
          
          // Store user
          const updatedUsers = [...storedUsers, newUser];
          localStorage.setItem("deco_supply_users", JSON.stringify(updatedUsers));
          
          onAuthSuccess(newUser);
        }, 3000);

      } catch (err) {
        setError("Error committing data to local secure partition.");
        setIsSubmitting(false);
        setIsGeneratingKey(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:14px_24px] -z-20"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] text-emerald-500/5 blur-[120px] rounded-full -z-10"></div>
      
      <div className="w-full max-w-lg space-y-8">
        
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r bg-emerald-500/10 to-indigo-500/10 rounded-full border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Zero-Trust Protocol Security Node</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
            DeCo-Supply Gateway
          </h1>
          <p className="text-base text-slate-400 max-w-sm mx-auto">
            Authorized portal for strategic procurement officers & database network administrators.
          </p>
        </div>

        {/* Auth Box Container */}
        <div className="bg-[#0F0F13] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden relative">
          
          {/* Top visual gradient accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r text-emerald-500 via-indigo-500 text-emerald-600"></div>

          <AnimatePresence mode="wait">
            {isGeneratingKey && generatedUser ? (
              /* CRYPTOGRAPHIC KEY GENERATION SCREEN */
              <motion.div
                key="key-generation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center space-y-6 font-mono"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden">
                  <Fingerprint className="w-8 h-8 text-emerald-400 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t bg-emerald-500/15 to-transparent animate-shimmer"></div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    Securing Consensus Credentials
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Computing local zero-knowledge signature parameters for <span className="text-emerald-400 font-bold">{generatedUser.fullName}</span>...
                  </p>
                </div>

                {/* Simulated cryptographic ticker bar */}
                <div className="relative w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.8, ease: "easeInOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r text-emerald-500 via-indigo-500 text-emerald-500"
                  />
                </div>

                {/* Key parameters output */}
                <div className="bg-black/80 border border-slate-900 rounded-lg p-3.5 text-left space-y-1 text-[9.5px] text-slate-500">
                  <div className="flex justify-between items-center">
                    <span>ENTROPY BASE:</span>
                    <span className="text-emerald-400">HARDWARE_CSRNG</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CIPHER SCHEME:</span>
                    <span className="text-indigo-400">Ed25519-ZKPA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>RESOLVED ROLE:</span>
                    <span className="text-emerald-400 uppercase font-semibold">{generatedUser.role}</span>
                  </div>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap pt-1 border-t border-slate-900/60 text-emerald-400">
                    <span>PUBKEY: {generatedUser.publicKey}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* LOGIN & SIGNUP FORMS */
              <motion.div
                key="form-fields"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 md:p-8 space-y-6"
              >
                
                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl flex items-start gap-2.5 text-base font-mono"
                  >
                    <ShieldAlert className="w-4.5 h-4.5 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-900">
                  <button
                    type="button"
                    onClick={() => { setActiveTab("login"); setError(""); }}
                    className={`py-2 rounded-lg text-base font-mono font-bold uppercase transition-all cursor-pointer ${
                      activeTab === "login"
                        ? "bg-slate-900 text-white border border-slate-800 shadow"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    SECURE SIGN IN
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("signup"); setError(""); }}
                    className={`py-2 rounded-lg text-base font-mono font-bold uppercase transition-all cursor-pointer ${
                      activeTab === "signup"
                        ? "bg-slate-900 text-white border border-slate-800 shadow"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    REGISTER ACCOUNT
                  </button>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={activeTab === "login" ? handleLogin : handleSignup} className="space-y-4">
                  
                  {/* Signup Specific Fields */}
                  {activeTab === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 overflow-visible"
                    >
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                          <User className="w-5 h-5 text-emerald-400" />
                          Full Name:
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-slate-900/40 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-base text-slate-200 font-mono transition-colors"
                          placeholder="e.g. Director Sarah Croft"
                        />
                      </div>

                      {/* Organization & Role Selectors */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                            <Building className="w-5 h-5 text-emerald-400" />
                            Organization:
                          </label>
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-slate-900/40 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-base text-slate-200 font-mono transition-colors"
                            placeholder="DeCo-Supply Core"
                          />
                        </div>

                        {/* Duo System Role selector */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                            <Key className="w-5 h-5 text-emerald-400" />
                            System Clearance:
                          </label>
                          <select
                            value={roleGroup}
                            onChange={(e) => setRoleGroup(e.target.value as "officer" | "admin")}
                            className="w-full bg-slate-900/40 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg px-2 py-2 text-base text-slate-200 font-mono transition-colors cursor-pointer"
                          >
                            <option value="officer" className="bg-slate-950 text-slate-300">Officer / User Portal</option>
                            <option value="admin" className="bg-slate-950 text-slate-300">System Administrator (Admin)</option>
                          </select>
                        </div>
                      </div>

                      {/* Detailed Officer Role Selector if group is officer */}
                      {roleGroup === "officer" && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-1.5"
                        >
                          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                            Functional Officer Title:
                          </label>
                          <select
                            value={officerRole}
                            onChange={(e) => setOfficerRole(e.target.value)}
                            className="w-full bg-slate-900/40 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg px-2 py-2 text-base text-slate-200 font-mono transition-colors cursor-pointer"
                          >
                            {officerRolesList.map((r) => (
                              <option key={r} value={r} className="bg-slate-950 text-slate-300">
                                {r}
                              </option>
                            ))}
                          </select>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Shared Login Fields */}
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                        <Mail className="w-5 h-5 text-emerald-400" />
                        Professional Email:
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900/40 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-base text-slate-200 font-mono transition-colors"
                        placeholder="e.g. administrator@deco.supply"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                        <Lock className="w-5 h-5 text-emerald-400" />
                        Passphrase:
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-900/40 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg pl-3 pr-10 py-2 text-base text-slate-200 font-mono transition-colors"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={handleTogglePassword}
                          className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submission Buttons */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2.5 rounded-xl font-bold text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer ${
                      isSubmitting
                        ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                        : "text-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 active:scale-95 border border-emerald-500/20"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Verifying Gate Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>{activeTab === "login" ? "Verify System Credentials" : "Issue Secure Keypair"}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick demo accounts section - EXTREMELY HELPFUL */}
                <div className="border-t border-slate-900 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] uppercase font-mono tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      Duo Role Demo Accounts:
                    </span>
                    <span className="text-[9px] font-mono text-slate-600">Click to auto-login</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[10px]">
                    
                    {/* Admin demo button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => triggerQuickDemoLogin("admin")}
                      className="flex flex-col text-left p-2.5 bg-rose-950/20 hover:bg-rose-950/30 border border-rose-900/30 hover:border-rose-800/40 rounded-xl transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-1 text-rose-400 font-bold">
                        <Shield className="w-5 h-5" />
                        <span>SYSTEM ADMIN PORTAL</span>
                      </div>
                      <span className="text-[8.5px] text-slate-400 mt-1">ID: admin@deco.supply</span>
                      <span className="text-[8px] text-slate-500 mt-0.5">Password: admin123</span>
                    </button>

                    {/* Officer/User demo button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => triggerQuickDemoLogin("officer")}
                      className="flex flex-col text-left p-2.5 bg-emerald-950/20 hover:bg-emerald-950/30 border border-emerald-900/30 hover:bg-emerald-800/40 rounded-xl transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Terminal className="w-5 h-5" />
                        <span>OFFICER / USER PAGE</span>
                      </div>
                      <span className="text-[8.5px] text-slate-400 mt-1">ID: officer@vance.gov</span>
                      <span className="text-[8px] text-slate-500 mt-0.5">Password: officer123</span>
                    </button>
                    
                  </div>
                </div>

                {/* Secure certificate note */}
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-900 flex items-start gap-2.5 text-[9.5px] text-slate-500 font-mono leading-relaxed">
                  <Server className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Zero-Trust cryptographic signatures are enforced. Standard users log in to source contracts, while administrators manage network database parameters.
                  </span>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
        
      </div>
    </div>
  );
}
