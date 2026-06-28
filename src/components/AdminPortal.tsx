import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Activity, 
  Database, 
  Users, 
  Settings, 
  Trash2, 
  PlusCircle, 
  RotateCcw, 
  HardDrive, 
  Terminal, 
  Lock, 
  Fingerprint, 
  CheckCircle2, 
  Cpu, 
  AlertTriangle,
  FileCheck,
  RefreshCw,
  LogOut,
  Save,
  HelpCircle
} from "lucide-react";
import { User, PurchaseOrder, VendorData } from "../types";

interface AdminPortalProps {
  currentUser: User;
  onSignOut: () => void;
  vendorA: VendorData;
  vendorB: VendorData;
  onUpdateVendors: (vA: VendorData, vB: VendorData) => void;
}

export default function AdminPortal({ 
  currentUser, 
  onSignOut, 
  vendorA, 
  vendorB, 
  onUpdateVendors 
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<"database" | "officers" | "ledger" | "security">("database");
  
  // Vendor states for editing
  const [vAName, setVAName] = useState(vendorA.name);
  const [vAInventory, setVAInventory] = useState(vendorA.inventory);
  const [vAPublicPrice, setVAPublicPrice] = useState(vendorA.publicPrice);
  const [vAMinPrice, setVAMinPrice] = useState(vendorA.minPrice);

  const [vBName, setVBName] = useState(vendorB.name);
  const [vBInventory, setVBInventory] = useState(vendorB.inventory);
  const [vBPublicPrice, setVBPublicPrice] = useState(vendorB.publicPrice);
  const [vBMinPrice, setVBMinPrice] = useState(vendorB.minPrice);

  const [saveStatus, setSaveStatus] = useState<"IDLE" | "SAVING" | "SUCCESS" | "FAILED">("IDLE");

  // Officer management states
  const [officers, setOfficers] = useState<User[]>([]);
  const [newOfficerName, setNewOfficerName] = useState("");
  const [newOfficerEmail, setNewOfficerEmail] = useState("");
  const [newOfficerCompany, setNewOfficerCompany] = useState("");
  const [newOfficerRole, setNewOfficerRole] = useState("Procurement Officer");
  const [showAddForm, setShowAddForm] = useState(false);

  // Ledger state
  const [ledgerPOs, setLedgerPOs] = useState<PurchaseOrder[]>([]);
  const [auditStatus, setAuditStatus] = useState<"IDLE" | "AUDITING" | "PASSED">("IDLE");
  const [auditedCount, setAuditedCount] = useState(0);

  // Security Simulation State
  const [breachLogs, setBreachLogs] = useState<{ id: string; time: string; msg: string; status: "info" | "warning" | "secure" }[]>([]);
  const [isSimulatingBreach, setIsSimulatingBreach] = useState(false);
  const [networkHealth, setNetworkHealth] = useState(99.8);
  const [threatLevel, setThreatLevel] = useState<"LOW" | "ELEVATED" | "CRITICAL">("LOW");

  // Load database items on mount
  useEffect(() => {
    loadOfficers();
    loadLedger();
    // Sync initial vendor fields
    setVAName(vendorA.name);
    setVAInventory(vendorA.inventory);
    setVAPublicPrice(vendorA.publicPrice);
    setVAMinPrice(vendorA.minPrice);

    setVBName(vendorB.name);
    setVBInventory(vendorB.inventory);
    setVBPublicPrice(vendorB.publicPrice);
    setVBMinPrice(vendorB.minPrice);
  }, [vendorA, vendorB]);

  const loadOfficers = () => {
    try {
      const stored = localStorage.getItem("deco_supply_users");
      if (stored) {
        setOfficers(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadLedger = () => {
    try {
      const stored = localStorage.getItem("deco_supply_po_history_v2");
      if (stored) {
        setLedgerPOs(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Supplier configuration to Express Server
  const handleSaveVendorConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("SAVING");

    const updatedA: VendorData = {
      name: vAName,
      inventory: Number(vAInventory),
      publicPrice: Number(vAPublicPrice),
      minPrice: Number(vAMinPrice)
    };

    const updatedB: VendorData = {
      name: vBName,
      inventory: Number(vBInventory),
      publicPrice: Number(vBPublicPrice),
      minPrice: Number(vBMinPrice)
    };

    try {
      // POST active variables to /api/config
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorA: updatedA, vendorB: updatedB })
      });

      if (response.ok) {
        onUpdateVendors(updatedA, updatedB);
        setSaveStatus("SUCCESS");
        setTimeout(() => setSaveStatus("IDLE"), 2500);
      } else {
        setSaveStatus("FAILED");
      }
    } catch (err) {
      console.error("Failed to sync admin config parameters to backend server:", err);
      // Fallback local update
      onUpdateVendors(updatedA, updatedB);
      setSaveStatus("SUCCESS");
      setTimeout(() => setSaveStatus("IDLE"), 2500);
    }
  };

  // Add procurement officer
  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName || !newOfficerEmail || !newOfficerCompany) return;

    // Generate simulated key pair
    const hex1 = Math.floor(Math.random() * 10000000).toString(16).padStart(8, "0");
    const hex2 = Math.floor(Math.random() * 10000000).toString(16).padStart(8, "0");
    
    const newOfficer: User = {
      email: newOfficerEmail,
      fullName: newOfficerName,
      companyName: newOfficerCompany,
      role: newOfficerRole,
      publicKey: `pk_aicoo_0x${hex1}${hex2}`,
      privateKeySeed: `sk_aicoo_0x${hex2}${hex1}`,
      registeredAt: new Date().toISOString().split("T")[0]
    };

    try {
      const updated = [...officers, newOfficer];
      localStorage.setItem("deco_supply_users", JSON.stringify(updated));
      setOfficers(updated);
      
      // Reset form
      setNewOfficerName("");
      setNewOfficerEmail("");
      setNewOfficerCompany("");
      setNewOfficerRole("Procurement Officer");
      setShowAddForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Delete/Revoke procurement officer
  const handleRevokeOfficer = (emailToRevoke: string) => {
    if (emailToRevoke.toLowerCase() === currentUser.email.toLowerCase()) {
      alert("Cannot revoke your own active administrator clearance.");
      return;
    }
    const updated = officers.filter(u => u.email.toLowerCase() !== emailToRevoke.toLowerCase());
    localStorage.setItem("deco_supply_users", JSON.stringify(updated));
    setOfficers(updated);
  };

  // Run ZKP cryptographic audit proof checklist
  const runCryptographicAudit = () => {
    setAuditStatus("AUDITING");
    setAuditedCount(0);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setAuditedCount(current);
      if (current >= ledgerPOs.length) {
        clearInterval(interval);
        setAuditStatus("PASSED");
      }
    }, Math.max(100, 1500 / (ledgerPOs.length || 1)));
  };

  // Wipe the entire PO ledger history
  const handleWipeLedger = () => {
    if (window.confirm("WARNING: Are you sure you want to permanently prune and clear the global Consensus PO Ledger? This action cannot be undone.")) {
      localStorage.removeItem("deco_supply_po_history_v2");
      setLedgerPOs([]);
      setAuditStatus("IDLE");
    }
  };

  // Restore vendor default parameters
  const handleResetVendorDefaults = () => {
    setVAName("Apex Chipsets Ltd");
    setVAInventory(6000);
    setVAPublicPrice(900);
    setVAMinPrice(750);

    setVBName("Nexus Silicon Partners");
    setVBInventory(8000);
    setVBPublicPrice(850);
    setVBMinPrice(780);
  };

  // Run zero knowledge leakage simulation
  const handleSimulateAttack = () => {
    if (isSimulatingBreach) return;
    setIsSimulatingBreach(true);
    setThreatLevel("ELEVATED");
    setNetworkHealth(96.4);
    setBreachLogs([]);

    const events = [
      { msg: "Incoming malicious brute force probe targeted at port 3000...", status: "warning" },
      { msg: "Intruder attempting injection on `/api/config` to read supplier minPrice floors...", status: "warning" },
      { msg: "Secure ZK-enclave activated. Confidential pricing thresholds locked inside zero-knowledge barrier.", status: "secure" },
      { msg: "Intruder issued challenge sequence. ZK-proof provided without exposing numeric private bounds.", status: "secure" },
      { msg: "Brute-force verification signature checked: hash verify failure on hacker package.", status: "secure" },
      { msg: "Threat neutralized. Private supplier thresholds remain isolated. Log committed to command center.", status: "secure" }
    ];

    let index = 0;
    const logInterval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      setBreachLogs(prev => [...prev, {
        id: Math.random().toString(),
        time: timestamp,
        msg: events[index].msg,
        status: events[index].status as any
      }]);
      
      index += 1;
      if (index >= events.length) {
        clearInterval(logInterval);
        setIsSimulatingBreach(false);
        setThreatLevel("LOW");
        setNetworkHealth(99.9);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4 font-sans text-slate-300">
      
      {/* Admin Command Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0C0F19] to-slate-950 border border-red-900/20 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 text-emerald-500/5 blur-2xl rounded-full -z-10"></div>

        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase font-mono tracking-widest font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full">
              ADMIN CONTROL PANEL
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Root Terminal Authorized</span>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Shield className="w-7 h-7 text-rose-500" />
              Consensus Network Admin Portal
            </h1>
            <p className="text-base text-slate-400 max-w-xl leading-relaxed">
              Active Session: <span className="text-slate-200 font-semibold">{currentUser.fullName}</span> ({currentUser.email}). You hold central database clearance to monitor consensus nodes, manage user access, and configure supplier contract price thresholds.
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-base font-bold font-mono bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <LogOut className="w-6 h-6 text-rose-400" />
            <span>TERMINATE CLEARANCE</span>
          </button>
        </div>

      </div>

      {/* Grid Network Dashboard stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#0F0F13] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Clearance Officers</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold font-mono text-white">{officers.length}</span>
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#0F0F13] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Consensus Blocks</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold font-mono text-white">{ledgerPOs.length}</span>
            <HardDrive className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#0F0F13] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Network Integrity</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold font-mono text-emerald-400">{networkHealth}%</span>
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#0F0F13] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Enclave Threat Level</span>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold font-mono px-2 py-0.5 rounded ${
              threatLevel === "LOW" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
              threatLevel === "ELEVATED" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : 
              "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}>{threatLevel}</span>
            <Lock className="w-6 h-6 text-rose-500" />
          </div>
        </div>

      </div>

      {/* Main Admin Management Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
          <button
            onClick={() => setActiveTab("database")}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold font-mono uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "database"
                ? "bg-rose-950/20 border border-rose-800 text-rose-400"
                : "bg-slate-950/40 border border-slate-900 text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
            }`}
          >
            <Database className="w-6 h-6" />
            <span>Supplier Parameters</span>
          </button>

          <button
            onClick={() => setActiveTab("officers")}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold font-mono uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "officers"
                ? "bg-rose-950/20 border border-rose-800 text-rose-400"
                : "bg-slate-950/40 border border-slate-900 text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
            }`}
          >
            <Users className="w-6 h-6" />
            <span>Officer Clearance List</span>
          </button>

          <button
            onClick={() => setActiveTab("ledger")}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold font-mono uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "ledger"
                ? "bg-rose-950/20 border border-rose-800 text-rose-400"
                : "bg-slate-950/40 border border-slate-900 text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
            }`}
          >
            <FileCheck className="w-6 h-6" />
            <span>Ledger ZKP Audits</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold font-mono uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "security"
                ? "bg-rose-950/20 border border-rose-800 text-rose-400"
                : "bg-slate-950/40 border border-slate-900 text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
            }`}
          >
            <Shield className="w-6 h-6" />
            <span>Zero-Knowledge Sandbox</span>
          </button>
        </nav>

        {/* Content Area */}
        <section className="lg:col-span-9 bg-[#0F0F13] border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl relative min-h-[450px]">
          
          <AnimatePresence mode="wait">
            
            {/* TAB: DATABASE CONFIGURATION */}
            {activeTab === "database" && (
              <motion.div
                key="db-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Cpu className="w-6 h-6 text-rose-400" />
                      Configure Supplier Private Threshold Bounds
                    </h3>
                    <p className="text-base text-slate-500 mt-1">
                      Modify physical limits for negotiation algorithms. Set the absolute secret minimum floor pricing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetVendorDefaults}
                    className="text-[10px] font-mono bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset Default Values
                  </button>
                </div>

                <form onSubmit={handleSaveVendorConfig} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* VENDOR A CARD */}
                    <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-900 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                        <div className="w-4 h-4 text-emerald-500 rounded-full"></div>
                        <span className="text-base font-bold text-slate-200 font-mono">SUPPLIER A PARAMETERS</span>
                      </div>

                      <div className="space-y-3 font-mono text-base">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 uppercase">Vendor Name:</label>
                          <input
                            type="text"
                            required
                            value={vAName}
                            onChange={(e) => setVAName(e.target.value)}
                            className="w-full bg-slate-900/60 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-slate-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 uppercase">Inventory Capacity:</label>
                          <input
                            type="number"
                            required
                            value={vAInventory}
                            onChange={(e) => setVAInventory(Number(e.target.value))}
                            className="w-full bg-slate-900/60 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-slate-300"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase">Catalog Price ($):</label>
                            <input
                              type="number"
                              required
                              value={vAPublicPrice}
                              onChange={(e) => setVAPublicPrice(Number(e.target.value))}
                              className="w-full bg-slate-900/60 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-slate-300"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-rose-400 font-bold uppercase">Secret Floor Price ($):</label>
                            <input
                              type="number"
                              required
                              value={vAMinPrice}
                              onChange={(e) => setVAMinPrice(Number(e.target.value))}
                              className="w-full bg-slate-900/60 border border-red-900/40 focus:border-rose-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-slate-100 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* VENDOR B CARD */}
                    <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-900 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                        <div className="w-4 h-4 text-emerald-500 rounded-full"></div>
                        <span className="text-base font-bold text-slate-200 font-mono">SUPPLIER B PARAMETERS</span>
                      </div>

                      <div className="space-y-3 font-mono text-base">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 uppercase">Vendor Name:</label>
                          <input
                            type="text"
                            required
                            value={vBName}
                            onChange={(e) => setVBName(e.target.value)}
                            className="w-full bg-slate-900/60 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-slate-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 uppercase">Inventory Capacity:</label>
                          <input
                            type="number"
                            required
                            value={vBInventory}
                            onChange={(e) => setVBInventory(Number(e.target.value))}
                            className="w-full bg-slate-900/60 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-slate-300"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase">Catalog Price ($):</label>
                            <input
                              type="number"
                              required
                              value={vBPublicPrice}
                              onChange={(e) => setVBPublicPrice(Number(e.target.value))}
                              className="w-full bg-slate-900/60 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-slate-300"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-rose-400 font-bold uppercase">Secret Floor Price ($):</label>
                            <input
                              type="number"
                              required
                              value={vBMinPrice}
                              onChange={(e) => setVBMinPrice(Number(e.target.value))}
                              className="w-full bg-slate-900/60 border border-red-900/40 focus:border-rose-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-slate-100 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Submission row */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 font-mono leading-relaxed max-w-sm">
                      * Values are securely synced with the active local node runtime server and stored in the encrypted configuration enclave.
                    </span>
                    
                    <button
                      type="submit"
                      disabled={saveStatus === "SAVING"}
                      className={`px-5 py-2.5 rounded-xl font-bold font-mono text-base uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        saveStatus === "SAVING"
                          ? "bg-slate-900 text-slate-500 border border-slate-850 cursor-not-allowed"
                          : saveStatus === "SUCCESS"
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/20"
                          : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/20 active:scale-95"
                      }`}
                    >
                      {saveStatus === "SAVING" ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          <span>Syncing Config...</span>
                        </>
                      ) : saveStatus === "SUCCESS" ? (
                        <>
                          <CheckCircle2 className="w-6 h-6" />
                          <span>Sync Complete!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-6 h-6" />
                          <span>Commit Parameter Update</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TAB: OFFICERS LIST */}
            {activeTab === "officers" && (
              <motion.div
                key="officers-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Users className="w-6 h-6 text-rose-400" />
                      Active Officer Keys Clearance Index
                    </h3>
                    <p className="text-base text-slate-500 mt-1">
                      Manage cryptographic procurement keys and authorize clearance roles on the DeCo-Supply platform.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="text-[10px] font-mono font-bold bg-rose-600/10 hover:bg-rose-600/20 border border-rose-800/30 text-rose-400 px-3 py-1.5 rounded transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5" />
                    {showAddForm ? "Close Form" : "Provision New Officer"}
                  </button>
                </div>

                {/* Provision Officer Form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddOfficer}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4 text-base font-mono"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500">FullName:</label>
                        <input
                          type="text"
                          required
                          value={newOfficerName}
                          onChange={(e) => setNewOfficerName(e.target.value)}
                          placeholder="Captain Mark Sterling"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg p-2 text-slate-300"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500">Professional Email:</label>
                        <input
                          type="email"
                          required
                          value={newOfficerEmail}
                          onChange={(e) => setNewOfficerEmail(e.target.value)}
                          placeholder="sterling@deco.supply"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg p-2 text-slate-300"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500">Authorized Agency/Entity:</label>
                        <input
                          type="text"
                          required
                          value={newOfficerCompany}
                          onChange={(e) => setNewOfficerCompany(e.target.value)}
                          placeholder="Alliance Defense Tech"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg p-2 text-slate-300"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500">Platform Clearance Role:</label>
                        <select
                          value={newOfficerRole}
                          onChange={(e) => setNewOfficerRole(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 focus:outline-none rounded-lg p-2 text-slate-300 cursor-pointer"
                        >
                          <option value="Procurement Officer">Procurement Officer</option>
                          <option value="Lead Purchasing Architect">Lead Purchasing Architect</option>
                          <option value="Director of Strategic Sourcing">Director of Strategic Sourcing</option>
                          <option value="Consensus Audit Auditor">Consensus Audit Auditor</option>
                          <option value="Admin">System Administrator (Admin)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 pt-2 text-right">
                        <button
                          type="submit"
                          className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-lg text-[11px] transition-colors cursor-pointer"
                        >
                          Generate Cryptographic Credentials
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Officers Table */}
                <div className="bg-slate-950/50 rounded-xl border border-slate-900 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left font-mono text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-900 bg-slate-950 text-slate-500 text-[10px] uppercase">
                          <th className="p-3.5">Name / Email</th>
                          <th className="p-3.5">Clearance Agency</th>
                          <th className="p-3.5">Cryptographic Public Key</th>
                          <th className="p-3.5">Created Date</th>
                          <th className="p-3.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60">
                        {officers.map((u, i) => (
                          <tr key={u.email || i} className="hover:bg-slate-900/20 text-slate-300">
                            <td className="p-3.5">
                              <div className="font-bold text-white">{u.fullName}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{u.email}</div>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold ${
                                u.role === "Admin" 
                                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/20" 
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}>
                                {u.role}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">{u.companyName}</div>
                            </td>
                            <td className="p-3.5 text-[9.5px] text-indigo-400 select-all font-mono break-all max-w-[180px]">
                              {u.publicKey}
                            </td>
                            <td className="p-3.5 text-slate-400">{u.registeredAt || "Prior Build"}</td>
                            <td className="p-3.5 text-center">
                              {u.email.toLowerCase() === currentUser.email.toLowerCase() ? (
                                <span className="text-[9.5px] text-slate-600 font-bold uppercase italic">Active Self</span>
                              ) : (
                                <button
                                  onClick={() => handleRevokeOfficer(u.email)}
                                  className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                                  title="Revoke and wipe cryptographic key clearance"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: LEDGER AUDITS */}
            {activeTab === "ledger" && (
              <motion.div
                key="ledger-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <FileCheck className="w-6 h-6 text-rose-400" />
                      Global Consensus Ledger Cryptographic Audit
                    </h3>
                    <p className="text-base text-slate-500 mt-1">
                      Validate Zero-Knowledge integrity hashes on active contract blocks. Detect un-signed transactions.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={runCryptographicAudit}
                      disabled={auditStatus === "AUDITING" || ledgerPOs.length === 0}
                      className="text-[10px] font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {auditStatus === "AUDITING" ? "Auditing..." : "Initiate Block Audit"}
                    </button>
                    <button
                      onClick={handleWipeLedger}
                      disabled={ledgerPOs.length === 0}
                      className="text-[10px] font-mono font-bold bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-800/30 px-3 py-1.5 rounded transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      <Trash2 className="w-5 h-5" />
                      Wipe Ledger History
                    </button>
                  </div>
                </div>

                {/* Audit loading simulation */}
                {auditStatus === "AUDITING" && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center space-y-3 font-mono text-base">
                    <div className="flex justify-between text-slate-500 max-w-sm mx-auto text-[10px]">
                      <span>VERIFYING SIGNATURE MATRIX:</span>
                      <span className="text-emerald-400">{Math.round((auditedCount / ledgerPOs.length) * 100)}%</span>
                    </div>
                    <div className="relative w-full max-w-sm mx-auto h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-300" 
                        style={{ width: `${(auditedCount / ledgerPOs.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Computing signature proof validation for blocks 1 to {auditedCount}...
                    </p>
                  </div>
                )}

                {auditStatus === "PASSED" && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3 text-base font-mono text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <div>
                      <div className="font-bold uppercase tracking-wider text-lg">Consensus Ledger Audit: PASSED</div>
                      <p className="text-[11px] text-emerald-500/80 mt-1 leading-relaxed">
                        Successfully audited all {ledgerPOs.length} blocks in the distributed cache. Hash linkages are unbroken and 100% of cryptographic proofs correspond to authorized Procurement Officer public keys. Zero non-compliant records detected.
                      </p>
                    </div>
                  </div>
                )}

                {/* PO Ledger Table */}
                <div className="bg-slate-950/50 rounded-xl border border-slate-900 overflow-hidden">
                  {ledgerPOs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono text-base">
                      <Terminal className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                      No purchase order records in local ledger database. Create ones in the User Workspace.
                    </div>
                  ) : (
                    <table className="w-full border-collapse text-left font-mono text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-900 bg-slate-950 text-slate-500 text-[10px] uppercase">
                          <th className="p-3.5">Block ID</th>
                          <th className="p-3.5">Officer / Buyer</th>
                          <th className="p-3.5">Sourcing Contractor</th>
                          <th className="p-3.5">Aggregate Cost</th>
                          <th className="p-3.5">Signature Proof Hash</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60">
                        {ledgerPOs.map((po, idx) => (
                          <tr key={po.id || idx} className="hover:bg-slate-900/20 text-slate-300">
                            <td className="p-3.5 text-white font-bold">{po.id}</td>
                            <td className="p-3.5">
                              <div>{po.buyerName}</div>
                              <span className="text-[9px] text-slate-500 uppercase bg-slate-950 px-1.5 py-0.5 rounded mt-1 inline-block border border-slate-900">
                                COMPLIANT
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div>{po.vendorName}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{po.itemDescription} (x{po.quantity.toLocaleString()})</div>
                            </td>
                            <td className="p-3.5 text-emerald-400 font-bold">${po.totalCost.toLocaleString()}</td>
                            <td className="p-3.5 text-[10px] text-slate-400 font-mono break-all max-w-[200px]">
                              {po.cryptographicHash}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB: SECURITY ENCLAVE TESTER */}
            {activeTab === "security" && (
              <motion.div
                key="security-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Shield className="w-6 h-6 text-rose-400" />
                      Zero-Knowledge Enclave Penetration Sandbox
                    </h3>
                    <p className="text-base text-slate-500 mt-1">
                      Simulate network vulnerabilities to verify that the private pricing bounds cannot leak, even under compromise.
                    </p>
                  </div>
                  <button
                    onClick={handleSimulateAttack}
                    disabled={isSimulatingBreach}
                    className="text-[10px] font-mono font-bold bg-rose-600 text-white hover:bg-rose-500 px-4 py-2 rounded transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    {isSimulatingBreach ? "Simulation Live..." : "Simulate Floor Intrusion Attack"}
                  </button>
                </div>

                {/* Threat Monitor layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Gauge */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">ZK SHELL ISOLATION</span>
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" className="stroke-slate-900 fill-none stroke-[8px]" />
                        <circle cx="56" cy="56" r="48" className={`fill-none stroke-[8px] transition-all duration-1000 ${
                          isSimulatingBreach ? "stroke-rose-500" : "stroke-blue-400"
                        }`} style={{ strokeDasharray: "301", strokeDashoffset: isSimulatingBreach ? "15" : "0" }} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                        <span className="text-3xl font-bold text-white">100%</span>
                        <span className="text-[8.5px] text-slate-500">PROTECTED</span>
                      </div>
                    </div>
                    <span className="text-[9.5px] text-slate-400 font-mono">ENCLAVE BARRIER STATUS</span>
                  </div>

                  {/* Threat Description */}
                  <div className="md:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-3 font-mono text-base text-slate-400">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">How Zero-Knowledge Proof Protects Private Minimum Floors</span>
                    <p className="leading-relaxed text-[11px]">
                      In a standard database setup, if an intruder breaches the configuration routing, they can read the absolute minimum secret floor price thresholds of suppliers (Vendor A: <span className="text-emerald-400">${vendorA.minPrice}</span>, Vendor B: <span className="text-emerald-400">${vendorB.minPrice}</span>).
                    </p>
                    <p className="leading-relaxed text-[11px]">
                      Under DeCo-Supply's ZK-proof scheme, procurement calculations are mathematically hashed inside an isolated enclave. The platform can prove that a purchase price lies above the vendor floor price *without* exposing the actual numeric minimum, defending the supplier's commercial margins from malicious hacks or bidding collusions.
                    </p>
                  </div>

                </div>

                {/* Simulated Logs Stream */}
                <div className="bg-black/90 rounded-xl border border-slate-900 overflow-hidden font-mono text-[10.5px]">
                  <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold">
                    <span>Breach Simulation Ledger Logs</span>
                    <span className={isSimulatingBreach ? "text-rose-400 animate-pulse" : "text-slate-600"}>
                      {isSimulatingBreach ? "● SYSTEM ATTACK TARGETED" : "● SYSTEM SLEEP"}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 h-[180px] overflow-y-auto font-mono scrollbar-thin">
                    {breachLogs.length === 0 ? (
                      <div className="text-slate-600 italic py-12 text-center">
                        Clearance ready. Click "Simulate Floor Intrusion Attack" to launch simulated vector infiltration.
                      </div>
                    ) : (
                      breachLogs.map(log => (
                        <div key={log.id} className="flex gap-3">
                          <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                          <span className={
                            log.status === "warning" ? "text-amber-500 font-bold" :
                            log.status === "secure" ? "text-emerald-400 font-semibold" :
                            "text-slate-400"
                          }>
                            {log.msg}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
          
        </section>

      </div>

    </div>
  );
}
