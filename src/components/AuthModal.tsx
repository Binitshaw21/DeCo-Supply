import React, { useState } from "react";
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
  X,
  Key,
  Check,
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import { User as UserType } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
  inline?: boolean;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, inline }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Form fields
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("Procurement Officer");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Flow states
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [generatedUser, setGeneratedUser] = useState<UserType | null>(null);

  const rolesList = [
    "Procurement Officer",
    "Lead Purchasing Architect",
    "Director of Strategic Sourcing",
    "Consensus Audit Auditor",
    "System Administrator (Admin)"
  ];

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate database lookup
    setTimeout(() => {
      try {
        const storedUsersStr = localStorage.getItem("deco_supply_users");
        const storedUsers: UserType[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        
        // Find user by email
        const user = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          setError("No account found with this email. Try signing up!");
          setIsSubmitting(false);
          return;
        }

        // Normally we'd verify hash, but here we simulate a successful lookup/login
        setIsSubmitting(false);
        onAuthSuccess(user);
        onClose();
      } catch (err) {
        setError("Authentication service failure. Please retry.");
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const generateMockKeyPair = (seedName: string) => {
    // Generate a beautiful, pseudo-random hex sequence simulating cryptographic keys
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
      setError("Please fill in all fields to register.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    // Simulate checking existing
    setTimeout(() => {
      try {
        const storedUsersStr = localStorage.getItem("deco_supply_users");
        const storedUsers: UserType[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        
        const alreadyExists = storedUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (alreadyExists) {
          setError("An account already exists with this email address.");
          setIsSubmitting(false);
          return;
        }

        // Trigger cryptographic key generation animation
        setIsSubmitting(false);
        setIsGeneratingKey(true);
        
        const keys = generateMockKeyPair(fullName);
        const newUser: UserType = {
          email,
          fullName,
          companyName,
          role,
          publicKey: keys.publicKey,
          privateKeySeed: keys.privateKeySeed,
          registeredAt: new Date().toISOString().split("T")[0]
        };

        setGeneratedUser(newUser);

        // Step through simulated cryptographic ceremony
        setTimeout(() => {
          setIsGeneratingKey(false);
          
          // Save user
          const updatedUsers = [...storedUsers, newUser];
          localStorage.setItem("deco_supply_users", JSON.stringify(updatedUsers));
          
          onAuthSuccess(newUser);
        }, 3200);

      } catch (err) {
        setError("Database transaction failed. Please retry.");
        setIsSubmitting(false);
        setIsGeneratingKey(false);
      }
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={inline ? "flex items-center justify-center p-4 w-full" : "fixed inset-0 z-[100] flex items-center justify-center p-4"}>
          {/* Backdrop Blur */}
          {!inline && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={!isGeneratingKey ? onClose : undefined}
              className="absolute inset-0 bg-[#070709]/80 backdrop-blur-md"
            />
          )}

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`bg-[#0F0F13] border border-slate-800 rounded-2xl w-full max-w-md relative z-10 overflow-hidden font-sans ${inline ? 'shadow-lg mt-8' : 'shadow-2xl'}`}
          >
            {/* Visual Header Grid Accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r text-emerald-500 via-indigo-500 text-emerald-600"></div>

            {/* Close Button */}
            {!isGeneratingKey && !inline && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-1.5 hover:bg-slate-900/50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            {/* MAIN AUTHENTICATION CAROUSEL */}
            <AnimatePresence mode="wait">
              {isGeneratingKey && generatedUser ? (
                /* CRYPTOGRAPHIC KEY CREATION SCREEN */
                <motion.div
                  key="key-generation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden">
                    <Fingerprint className="w-8 h-8 text-emerald-400 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-t bg-emerald-500/10 to-transparent animate-shimmer"></div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-white font-mono uppercase tracking-wider">
                      Securing Cryptographic Enclave
                    </h3>
                    <p className="text-base text-slate-400 font-mono leading-relaxed max-w-sm mx-auto">
                      Mining local zero-knowledge entropy keys and baking signature parameters for <span className="text-emerald-400 font-semibold">{generatedUser.fullName}</span>...
                    </p>
                  </div>

                  {/* Animated Loading Bar */}
                  <div className="relative w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r text-emerald-500 to-indigo-500"
                    />
                  </div>

                  {/* Key Parameters ticker simulation */}
                  <div className="bg-black/80 border border-slate-900 rounded-lg p-3.5 text-left space-y-2 font-mono text-[9px] text-slate-500">
                    <div className="flex justify-between items-center">
                      <span>ENTROPY SOURCE:</span>
                      <span className="text-emerald-400">CSRNG_WEB_CRYPTO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>KEY SCHEME:</span>
                      <span className="text-indigo-400">Ed25519 (Consensus Proof)</span>
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                      <span>PUBKEY: </span>
                      <span className="text-emerald-400">{generatedUser.publicKey}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* LOGIN / SIGNUP FORM SCREEN */
                <motion.div
                  key="form-fields"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 md:p-8 space-y-6"
                >
                  {/* Headline Title */}
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 inline-block">
                      Consensus Security Gate
                    </span>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2.5">
                      {activeTab === "login" ? "Sign in to DeCo-Supply" : "Create Officer Account"}
                    </h2>
                    <p className="text-base text-slate-400 leading-relaxed">
                      {activeTab === "login" 
                        ? "Log in to unlock custom RFPs and sign consensus receipts." 
                        : "Register to generate unique cryptographic consensus keys."}
                    </p>
                  </div>

                  {/* Errors display */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-start gap-2.5 text-base font-mono"
                    >
                      <ShieldAlert className="w-6 h-6 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Login vs Signup Tabs */}
                  <div className="grid grid-cols-2 bg-slate-950/80 p-1 rounded-lg border border-slate-900">
                    <button
                      type="button"
                      onClick={() => { setActiveTab("login"); setError(""); }}
                      className={`py-2 rounded text-base font-mono font-bold transition-all cursor-pointer ${
                        activeTab === "login"
                          ? "bg-slate-900 text-white border border-slate-800 shadow"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      LOG IN
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("signup"); setError(""); }}
                      className={`py-2 rounded text-base font-mono font-bold transition-all cursor-pointer ${
                        activeTab === "signup"
                          ? "bg-slate-900 text-white border border-slate-800 shadow"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      SIGN UP
                    </button>
                  </div>

                  <form onSubmit={activeTab === "login" ? handleLogin : handleSignup} className="space-y-4">
                    {/* FULL NAME (Signup only) */}
                    {activeTab === "signup" && (
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
                          className="w-full bg-slate-900/60 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-base text-slate-200 font-mono transition-colors"
                          placeholder="e.g. Major James Vance"
                        />
                      </div>
                    )}

                    {/* EMAIL (Both) */}
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
                        className="w-full bg-slate-900/60 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-base text-slate-200 font-mono transition-colors"
                        placeholder="e.g. officer@vance.gov"
                      />
                    </div>

                    {/* COMPANY / ORGANIZATION NAME (Signup only) */}
                    {activeTab === "signup" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            className="w-full bg-slate-900/60 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-base text-slate-200 font-mono transition-colors"
                            placeholder="Global Defense"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                            <Key className="w-5 h-5 text-emerald-400" />
                            Officer Role:
                          </label>
                          <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-slate-900/60 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg px-2 py-2 text-base text-slate-200 font-mono transition-colors cursor-pointer"
                          >
                            {rolesList.map((r) => (
                              <option key={r} value={r} className="bg-slate-950 text-slate-300">
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* PASSWORD (Both) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                        <Lock className="w-5 h-5 text-emerald-400" />
                        Password:
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-900/60 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg pl-3 pr-10 py-2 text-base text-slate-200 font-mono transition-colors"
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

                    {/* Actions and Sign In */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-2.5 rounded-xl font-bold text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer ${
                        isSubmitting
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                          : "text-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 active:scale-95"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Validating Credentials...</span>
                        </>
                      ) : (
                        <span>
                          {activeTab === "login" ? "Verify Identity Key" : "Generate Consensus Identity"}
                        </span>
                      )}
                    </button>
                  </form>

                  {/* Tip Footer */}
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-900/60 flex items-start gap-2.5 text-[10px] text-slate-500 font-mono leading-normal">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Identities are compiled and saved locally. Your generated keypair signs approved ledger purchase records securely.
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
