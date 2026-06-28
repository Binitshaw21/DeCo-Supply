import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, 
  Database, 
  Send, 
  ShieldCheck, 
  Terminal, 
  Lock, 
  Fingerprint, 
  Activity, 
  CheckCircle,
  Network
} from "lucide-react";

interface NodeDetails {
  id: string;
  name: string;
  role: string;
  status: string;
  ip: string;
  encryption: string;
  description: string;
  icon: any;
  color: string;
}

export default function InteractiveNodeMap() {
  const [activeNode, setActiveNode] = useState<string | null>("router");

  const nodes: NodeDetails[] = [
    {
      id: "broadcaster",
      name: "RFP Broadcaster Node",
      role: "Initiator",
      status: "Active (Standing By)",
      ip: "10.240.0.12",
      encryption: "AES-GCM-256",
      description: "Extracts RFP details via custom tokenizers and broadcasts the contract payload to the decentralized coordination pool.",
      icon: Send,
      color: "from-cyan-500 text-emerald-500",
    },
    {
      id: "router",
      name: "Aicoo Consensus Router",
      role: "Orchestrator",
      status: "Running (Round Bidding)",
      ip: "10.240.0.1",
      encryption: "SHA3-512 Consensus",
      description: "Coordinates trustless agent iterations, compares bid logs in virtual zero-knowledge memory cells, and determines optimal consensus.",
      icon: Cpu,
      color: "text-emerald-500 to-indigo-600",
    },
    {
      id: "cell_a",
      name: "Apex Private Container Cell",
      role: "Secure Storage",
      status: "Shielded (ZKP Enabled)",
      ip: "10.128.4.88",
      encryption: "ZK-Snarks Privacy Core",
      description: "Houses Vendor A's minimum floor price formulas. Evaluates bid requests inside private RAM chips without exposing the margin boundary.",
      icon: Lock,
      color: "from-rose-500 to-pink-600",
    },
    {
      id: "cell_b",
      name: "Nexus Private Container Cell",
      role: "Secure Storage",
      status: "Shielded (ZKP Enabled)",
      ip: "10.128.6.94",
      encryption: "ZK-Snarks Privacy Core",
      description: "Houses Vendor B's minimum floor price formulas. Operates in hardware-isolated enclave cells to protect strategic supplier parameters.",
      icon: Lock,
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: "ledger",
      name: "Consensus Ledger Block",
      role: "Archiver",
      status: "Idle (Ready to Commit)",
      ip: "10.250.8.204",
      encryption: "Merkle-Proof Hash chain",
      description: "Locks approved transaction purchase orders. Signs cryptographic receipts verified by public/private verification keys.",
      icon: Fingerprint,
      color: "text-emerald-500 to-fuchsia-600",
    },
  ];

  const selectedNode = nodes.find(n => n.id === activeNode) || nodes[1];

  return (
    <div className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden relative">
      {/* Visual background grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.05),rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
        {/* Left Side: Dynamic Node Diagram SVG */}
        <div className="w-full lg:w-3/5 flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              Interactive Protocol Blueprint
            </span>
            <p className="text-base text-slate-500 mt-1.5 font-mono">Click any node to inspect physical parameters and hardware enclaves</p>
          </div>

          <div className="w-full max-w-lg relative bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            <svg viewBox="0 0 600 320" className="w-full h-auto drop-shadow-lg">
              <defs>
                <linearGradient id="blueGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8"/>
                </linearGradient>
                <linearGradient id="roseGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.8"/>
                </linearGradient>
                <linearGradient id="emeraldGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.8"/>
                </linearGradient>
                <linearGradient id="purpleGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8"/>
                </linearGradient>

                <style>{`
                  @keyframes march {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  .animate-march {
                    stroke-dasharray: 6, 6;
                    animation: march 1.5s linear infinite;
                  }
                `}</style>
              </defs>

              {/* Network Connection Lines (Data flow paths) */}
              {/* Broadcaster to Router */}
              <line x1="100" y1="160" x2="280" y2="160" stroke="#334155" strokeWidth="2" />
              <line x1="100" y1="160" x2="280" y2="160" stroke="#3b82f6" strokeWidth="1.5" className="animate-march" />

              {/* Router to Private Cell A (Top Right) */}
              <path d="M 300 140 Q 300 70, 480 70" fill="none" stroke="#334155" strokeWidth="2" />
              <path d="M 300 140 Q 300 70, 480 70" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-march" />

              {/* Router to Private Cell B (Bottom Right) */}
              <path d="M 300 180 Q 300 250, 480 250" fill="none" stroke="#334155" strokeWidth="2" />
              <path d="M 300 180 Q 300 250, 480 250" fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-march" />

              {/* Router to Ledger Vault */}
              <line x1="320" y1="160" x2="480" y2="160" stroke="#334155" strokeWidth="2" />
              <line x1="320" y1="160" x2="480" y2="160" stroke="#a855f7" strokeWidth="1.5" className="animate-march" />

              {/* Node Buttons as interactive SVG elements */}
              
              {/* 1. Broadcaster (Left Node) */}
              <g 
                className="cursor-pointer group" 
                onClick={() => setActiveNode("broadcaster")}
              >
                <circle 
                  cx="100" 
                  cy="160" 
                  r="28" 
                  fill="#020617" 
                  stroke={activeNode === "broadcaster" ? "#06b6d4" : "#1e293b"} 
                  strokeWidth={activeNode === "broadcaster" ? "3" : "1.5"}
                  className="transition-all duration-300 group-hover:stroke-cyan-500" 
                />
                <circle cx="100" cy="160" r="22" fill="#0c4a6e" fillOpacity="0.4" />
                <path d="M 94 160 L 104 154 L 104 166 Z" fill="#06b6d4" />
                <circle cx="100" cy="160" r="4" fill="#06b6d4" />
                <text x="100" y="202" fill={activeNode === "broadcaster" ? "#22d3ee" : "#94a3b8"} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  BROADCASTER
                </text>
              </g>

              {/* 2. Consensus Router (Center Node) */}
              <g 
                className="cursor-pointer group" 
                onClick={() => setActiveNode("router")}
              >
                <circle 
                  cx="300" 
                  cy="160" 
                  r="34" 
                  fill="#020617" 
                  stroke={activeNode === "router" ? "#3b82f6" : "#1e293b"} 
                  strokeWidth={activeNode === "router" ? "3" : "1.5"}
                  className="transition-all duration-300 group-hover:stroke-blue-500" 
                />
                <circle cx="300" cy="160" r="28" fill="#1e1b4b" fillOpacity="0.4" />
                <rect x="292" y="152" width="16" height="16" rx="3" fill="none" stroke="#60a5fa" strokeWidth="2" />
                <circle cx="300" cy="160" r="3" fill="#60a5fa" className="animate-pulse" />
                <text x="300" y="210" fill={activeNode === "router" ? "#60a5fa" : "#94a3b8"} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  AICOO ROUTER
                </text>
              </g>

              {/* 3. Apex Cell A (Top Right Node) */}
              <g 
                className="cursor-pointer group" 
                onClick={() => setActiveNode("cell_a")}
              >
                <circle 
                  cx="500" 
                  cy="70" 
                  r="28" 
                  fill="#020617" 
                  stroke={activeNode === "cell_a" ? "#f43f5e" : "#1e293b"} 
                  strokeWidth={activeNode === "cell_a" ? "3" : "1.5"}
                  className="transition-all duration-300 group-hover:stroke-rose-500" 
                />
                <circle cx="500" cy="70" r="22" fill="#881337" fillOpacity="0.4" />
                <path d="M 495 65 L 505 65 L 505 75 L 495 75 Z" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                <path d="M 497 65 Q 500 58, 503 65" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                <text x="500" y="112" fill={activeNode === "cell_a" ? "#fb7185" : "#94a3b8"} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  APEX CELL A
                </text>
              </g>

              {/* 4. Nexus Cell B (Bottom Right Node) */}
              <g 
                className="cursor-pointer group" 
                onClick={() => setActiveNode("cell_b")}
              >
                <circle 
                  cx="500" 
                  cy="250" 
                  r="28" 
                  fill="#020617" 
                  stroke={activeNode === "cell_b" ? "#10b981" : "#1e293b"} 
                  strokeWidth={activeNode === "cell_b" ? "3" : "1.5"}
                  className="transition-all duration-300 group-hover:stroke-emerald-500" 
                />
                <circle cx="500" cy="250" r="22" fill="#064e3b" fillOpacity="0.4" />
                <path d="M 495 245 L 505 245 L 505 255 L 495 255 Z" fill="none" stroke="#10b981" strokeWidth="1.5" />
                <path d="M 497 245 Q 500 238, 503 245" fill="none" stroke="#10b981" strokeWidth="1.5" />
                <text x="500" y="292" fill={activeNode === "cell_b" ? "#34d399" : "#94a3b8"} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  NEXUS CELL B
                </text>
              </g>

              {/* 5. Ledger Vault (Center Right Node) */}
              <g 
                className="cursor-pointer group" 
                onClick={() => setActiveNode("ledger")}
              >
                <circle 
                  cx="500" 
                  cy="160" 
                  r="28" 
                  fill="#020617" 
                  stroke={activeNode === "ledger" ? "#a855f7" : "#1e293b"} 
                  strokeWidth={activeNode === "ledger" ? "3" : "1.5"}
                  className="transition-all duration-300 group-hover:stroke-purple-500" 
                />
                <circle cx="500" cy="160" r="22" fill="#581c87" fillOpacity="0.4" />
                <circle cx="500" cy="160" r="7" fill="none" stroke="#c084fc" strokeWidth="2" />
                <line x1="500" y1="153" x2="500" y2="167" stroke="#c084fc" strokeWidth="2" />
                <line x1="493" y1="160" x2="507" y2="160" stroke="#c084fc" strokeWidth="2" />
                <text x="500" y="202" fill={activeNode === "ledger" ? "#c084fc" : "#94a3b8"} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  LEDGER VAULT
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right Side: Deep Telemetry Metrics Panel */}
        <div className="w-full lg:w-2/5 h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4 shadow-inner relative overflow-hidden"
            >
              {/* Highlight ribbon indicator */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${selectedNode.color}`}></div>

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono text-slate-500 font-bold tracking-widest">{selectedNode.role}</span>
                  <h3 className="text-lg font-extrabold text-white font-mono flex items-center gap-2 mt-0.5">
                    <selectedNode.icon className="w-6 h-6 text-emerald-400" />
                    {selectedNode.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 animate-pulse" />
                  ONLINE
                </span>
              </div>

              <p className="text-base text-slate-400 leading-relaxed font-mono">
                {selectedNode.description}
              </p>

              <hr className="border-slate-900" />

              {/* Node Specific Grid specs */}
              <div className="grid grid-cols-2 gap-3.5 font-mono text-[10px]">
                <div className="bg-[#0A0A0C] p-2 rounded border border-slate-900">
                  <span className="block text-slate-500 uppercase text-[8px] tracking-wider font-semibold">Virtual Address</span>
                  <span className="text-slate-300 font-semibold">{selectedNode.ip}</span>
                </div>
                <div className="bg-[#0A0A0C] p-2 rounded border border-slate-900">
                  <span className="block text-slate-500 uppercase text-[8px] tracking-wider font-semibold">Privacy Cipher</span>
                  <span className="text-slate-300 font-semibold">{selectedNode.encryption}</span>
                </div>
                <div className="bg-[#0A0A0C] p-2 rounded border border-slate-900">
                  <span className="block text-slate-500 uppercase text-[8px] tracking-wider font-semibold">Container Status</span>
                  <span className="text-emerald-400 font-bold uppercase">{selectedNode.status}</span>
                </div>
                <div className="bg-[#0A0A0C] p-2 rounded border border-slate-900">
                  <span className="block text-slate-500 uppercase text-[8px] tracking-wider font-semibold">Enclave Isolation</span>
                  <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <ShieldCheck className="w-5 h-5" /> SEALED
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
