import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Check, 
  Lock, 
  Unlock, 
  Settings, 
  Terminal, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Copy, 
  Sparkles, 
  Cpu, 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  Shield,
  Layers, 
  Send, 
  Info, 
  Clock, 
  Settings2, 
  ChevronsRight,
  RefreshCw,
  Key,
  Award,
  BookOpen,
  History,
  Sliders,
  Trash2,
  Search,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Fingerprint,
  Share2,
  CreditCard,
  HelpCircle,
  MessageSquare,
  PlusCircle,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LogEntry, PurchaseOrder, VendorData, User, logUserInteraction } from "./types";
import InteractiveNodeMap from "./components/InteractiveNodeMap";
import BiddingProgressChart from "./components/BiddingProgressChart";
import SignaturePad from "./components/SignaturePad";
import ProtocolMetrics from "./components/ProtocolMetrics";
import AuthModal from "./components/AuthModal";
import DuoLoginGate from "./components/DuoLoginGate";
import AdminPortal from "./components/AdminPortal";
import LandingPage from "./components/LandingPage";

export default function App() {
  // Navigation Tabs: landing, login, overview, workspace, ledger, playground
  const [activeTab, setActiveTab] = useState<'landing' | 'login' | 'overview' | 'workspace' | 'ledger' | 'playground' | 'billing' | 'settings' | 'help' | 'feedback' | 'admin'>(() => {
    try {
      const stored = localStorage.getItem("deco_supply_current_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.role === "Admin" || user.role === "System Administrator (Admin)") {
          return "admin";
        }
        return "workspace";
      }
    } catch (e) {}
    return "landing";
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Interactive Form-based RFP Inputs (Total User Input)
  const [rfpMode, setRfpMode] = useState<'form' | 'manual'>('form');
  const [rfpItemName, setRfpItemName] = useState("Enterprise AI Tensor Processors");
  const [rfpQuantity, setRfpQuantity] = useState(5000);
  const [rfpBudget, setRfpBudget] = useState(4000000);
  const [prompt, setPrompt] = useState("Need 5,000 units of Enterprise AI Tensor Processors under $4,000,000");

  // Custom Vendor Data Inputs (Total User Input)
  const [vendorA, setVendorA] = useState<VendorData>({
    name: "Apex Chipsets Ltd",
    inventory: 6000,
    publicPrice: 900,
    minPrice: 750
  });

  const [vendorB, setVendorB] = useState<VendorData>({
    name: "Nexus Silicon Partners",
    inventory: 8000,
    publicPrice: 850,
    minPrice: 780
  });

  // Keep prompt in sync when in Form mode
  useEffect(() => {
    if (rfpMode === 'form') {
      setPrompt(`Need ${rfpQuantity.toLocaleString()} units of ${rfpItemName} under $${rfpBudget.toLocaleString()}`);
    }
  }, [rfpItemName, rfpQuantity, rfpBudget, rfpMode]);

  // Terminal & Simulation States
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [fullLogs, setFullLogs] = useState<LogEntry[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [rolloutSpeed, setRolloutSpeed] = useState(400); // ms delay
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [negotiationStatus, setNegotiationStatus] = useState<"IDLE" | "RUNNING" | "SUCCESS" | "FAILED">("IDLE");
  const [winner, setWinner] = useState<string | null>(null);
  const [savingsInfo, setSavingsInfo] = useState<{ unitPrice: number; total: number; savings: number } | null>(null);

  // Playground Settings State
  const [biddingAgility, setBiddingAgility] = useState<'moderate' | 'aggressive' | 'conservative'>('moderate');
  const [autoSaveLedger, setAutoSaveLedger] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [hasAicooApiKey, setHasAicooApiKey] = useState(false);
  const [invoiceHistory, setInvoiceHistory] = useState<any[]>([]);

  // Persistent Ledger PO History state
  const [poHistory, setPoHistory] = useState<PurchaseOrder[]>(() => {
    try {
      const stored = localStorage.getItem("deco_supply_po_history_v2");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to load historical POs from localStorage", e);
    }
    // Return gorgeous initial historic POs
    return [
      {
        id: "PO-749102",
        buyerName: "Global Supply Solutions Corp",
        vendorName: "Nexus Silicon Partners",
        itemDescription: "High-Performance H100 Accelerators",
        quantity: 5000,
        unitPrice: 785,
        totalCost: 3925000,
        savings: 325000,
        status: "APPROVED" as const,
        cryptographicHash: "aicoo_zkp_proof_bf7e1903fa8a3a0c201d1fa4e0b57f012e87",
        signedAt: "2026-06-22"
      },
      {
        id: "PO-312948",
        buyerName: "Global Supply Solutions Corp",
        vendorName: "Apex Chipsets Ltd",
        itemDescription: "ASIC Tensor Processing Cores",
        quantity: 2500,
        unitPrice: 740,
        totalCost: 1850000,
        savings: 400000,
        status: "APPROVED" as const,
        cryptographicHash: "aicoo_zkp_proof_1e37bc902da77f8841da5a1b3c90da37f22a",
        signedAt: "2026-06-25"
      }
    ];
  });

  // Sync historical POs to local storage
  useEffect(() => {
    localStorage.setItem("deco_supply_po_history_v2", JSON.stringify(poHistory));
  }, [poHistory]);

  // User Authentication States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("deco_supply_current_user");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse current user on init", e);
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Proof Credits Persistent State
  const [proofCredits, setProofCredits] = useState<number>(() => {
    const stored = localStorage.getItem("deco_supply_proof_credits");
    return stored ? Number(stored) : 8421;
  });

  useEffect(() => {
    localStorage.setItem("deco_supply_proof_credits", proofCredits.toString());
  }, [proofCredits]);

  // Profile Settings States
  const [profileName, setProfileName] = useState("");
  const [profileCompany, setProfileCompany] = useState("");
  const [profileSeed, setProfileSeed] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);

  // Sync profile settings with current user
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.fullName);
      setProfileCompany(currentUser.companyName);
      setProfileSeed(currentUser.privateKeySeed);
    }
  }, [currentUser]);

  // Support Ticket States
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("protocol");
  const [ticketPriority, setTicketPriority] = useState("medium");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketsList, setTicketsList] = useState<any[]>(() => {
    const stored = localStorage.getItem("deco_supply_tickets");
    return stored ? JSON.parse(stored) : [
      {
        id: "TCK-4819",
        timestamp: "2026-06-27T10:14:22.000Z",
        subject: "RNG key entropy limits",
        category: "cryptography",
        priority: "high",
        message: "When spinning multiple negotiation containers, our local node warning logs mention potential private key entropy threshold drift. Please confirm the consensus seed limits.",
        status: "RESOLVED",
        adminResponse: "We have confirmed secure hardware RNG is functioning in the ZK-enclave on Node #001. All key entropy remains strict."
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("deco_supply_tickets", JSON.stringify(ticketsList));
  }, [ticketsList]);

  // Feedback States
  const [feedbackCategory, setFeedbackCategory] = useState<"feature" | "bug" | "praise" | "algorithm">("algorithm");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [userFeedbackList, setUserFeedbackList] = useState<any[]>(() => {
    const stored = localStorage.getItem("deco_supply_feedback");
    const all = stored ? JSON.parse(stored) : [];
    return currentUser ? all.filter((f: any) => f.userEmail === currentUser.email) : [];
  });

  // Sync feedback list when feedback changes or user logs in
  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem("deco_supply_feedback");
      const all = stored ? JSON.parse(stored) : [];
      setUserFeedbackList(all.filter((f: any) => f.userEmail === currentUser.email));
    } else {
      setUserFeedbackList([]);
    }
  }, [currentUser, feedbackSuccess]);

  const handleSignOut = () => {
    if (currentUser) {
      logUserInteraction(
        currentUser.email,
        currentUser.fullName,
        "User Logged Out",
        "Terminated active secure protocol session.",
        "auth"
      );
    }
    localStorage.removeItem("deco_supply_current_user");
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: User) => {
    localStorage.setItem("deco_supply_current_user", JSON.stringify(user));
    setCurrentUser(user);
    logUserInteraction(
      user.email,
      user.fullName,
      "User Logged In",
      `Authenticated successfully with clearance: ${user.role}.`,
      "auth"
    );
    if (user.role === "Admin" || user.role === "System Administrator (Admin)") {
      setActiveTab("admin");
    } else {
      setActiveTab("workspace");
    }
  };

  // UI helpers
  const [poSigned, setPoSigned] = useState(false);
  const [localSignatureSaved, setLocalSignatureSaved] = useState(false);
  const [selectedLedgerPo, setSelectedLedgerPo] = useState<PurchaseOrder | null>(null);
  const [ledgerSearch, setLedgerSearch] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Fetch API key confirmation from server on mount
  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setHasAicooApiKey(data.hasAicooApiKey);
      })
      .catch((err) => console.error("Error reading config:", err));
  }, []);

  // Fetch real payment history for billing tab
  useEffect(() => {
    if (activeTab === 'billing' && currentUser) {
      fetch(`/api/payments?email=${currentUser.email}`)
        .then(res => res.json())
        .then(data => setInvoiceHistory(data))
        .catch(console.error);
    }
  }, [activeTab, currentUser]);

  // Synchronize adjusted settings to the server
  const handleSyncDatabases = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorA, vendorB })
      });
      const data = await res.json();
      if (data.success) {
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Run the multi-round negotiation
  const startNegotiation = async () => {
    setIsNegotiating(true);
    setNegotiationStatus("RUNNING");
    setLogs([]);
    setFullLogs([]);
    setCurrentLogIndex(0);
    setPurchaseOrder(null);
    setWinner(null);
    setSavingsInfo(null);
    setPoSigned(false);
    setLocalSignatureSaved(false);

    if (currentUser) {
      logUserInteraction(
        currentUser.email,
        currentUser.fullName,
        "Initiated Sourcing Negotiation",
        `Requested bids for "${rfpItemName}" (x${rfpQuantity}) with budget limit $${rfpBudget.toLocaleString()}.`,
        "negotiation"
      );
    }

    // Initial system log
    const initialLog: LogEntry = {
      id: "init",
      timestamp: new Date().toLocaleTimeString(),
      actor: "system",
      actorName: "Consensus Node",
      type: "info",
      message: `Spinning up isolated secure context containers for ${vendorA.name} and ${vendorB.name}...`
    };
    setLogs([initialLog]);

    try {
      // Direct sync to the server
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorA, vendorB })
      });

      // Execute zero-trust negotiation
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, vendorA, vendorB })
      });

      const data = await response.json();
      
      if (data.logs && data.logs.length > 0) {
        // Tweak vendor names dynamically in the logs to match user customized input names!
        const parsedLogs: LogEntry[] = data.logs.map((item: any) => {
          let updatedName = item.actorName;
          if (item.actor === 'vendor_a') updatedName = `${vendorA.name} Agent`;
          if (item.actor === 'vendor_b') updatedName = `${vendorB.name} Agent`;
          
          return {
            ...item,
            actorName: updatedName,
            // Replace private database logging statements to reflect user's custom names
            message: item.message
              .replace(/Vendor A/g, vendorA.name)
              .replace(/Vendor B/g, vendorB.name)
              .replace(/Apex Chipsets/g, vendorA.name)
              .replace(/Nexus Silicon/g, vendorB.name)
          };
        });

        setFullLogs(parsedLogs);

        if (data.status === "SUCCESS") {
          const selectedWinner = data.winner === 'Vendor A' ? vendorA.name : vendorB.name;
          setWinner(selectedWinner);
          setSavingsInfo({
            unitPrice: data.finalUnitPrice,
            total: data.totalCost,
            savings: data.savings
          });
        }
      } else {
        throw new Error("No logs returned from execution pool");
      }
    } catch (error) {
      console.error("Negotiation failed:", error);
      const errLog: LogEntry = {
        id: "err",
        timestamp: new Date().toLocaleTimeString(),
        actor: "system",
        actorName: "Consensus Node",
        type: "info",
        message: "Cryptographic protocol error: Live socket failed. Falling back to local consensus..."
      };
      setLogs((prev) => [...prev, errLog]);
      setIsNegotiating(false);
      setNegotiationStatus("FAILED");
    }
  };

  // Log Typewriter Rollout Effect
  useEffect(() => {
    if (fullLogs.length === 0 || currentLogIndex >= fullLogs.length) {
      if (fullLogs.length > 0 && currentLogIndex === fullLogs.length) {
        setIsNegotiating(false);
        if (savingsInfo && winner) {
          setNegotiationStatus("SUCCESS");
          if (currentUser) {
            logUserInteraction(
              currentUser.email,
              currentUser.fullName,
              "Negotiation Secured",
              `Acquired contract with ${winner} for "${rfpItemName}" (x${rfpQuantity}) at unit price $${savingsInfo.unitPrice} (Total: $${savingsInfo.total.toLocaleString()}).`,
              "negotiation"
            );
          }
          
           // Generate customized PO certificate matching the dynamic inputs
          const finalPO: PurchaseOrder = {
            id: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
            buyerName: currentUser ? currentUser.companyName : "Global Supply Solutions Corp",
            vendorName: winner,
            itemDescription: rfpItemName,
            quantity: rfpQuantity,
            unitPrice: savingsInfo.unitPrice,
            totalCost: savingsInfo.total,
            savings: savingsInfo.savings,
            status: "APPROVED",
            cryptographicHash: currentUser 
              ? `aicoo_zkp_proof_${currentUser.publicKey.substring(12, 20)}_${Math.random().toString(16).substring(2, 10)}`
              : `aicoo_zkp_proof_${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
            signedAt: new Date().toISOString().split('T')[0]
          };
          setPurchaseOrder(finalPO);

          // Auto commit to history ledger if toggle is set!
          if (autoSaveLedger) {
            setPoHistory((prev) => [finalPO, ...prev]);
            setPoSigned(true);
          }
        } else {
          setNegotiationStatus("FAILED");
          if (currentUser) {
            logUserInteraction(
              currentUser.email,
              currentUser.fullName,
              "Negotiation Failed",
              `Failed to secure agreement for "${rfpItemName}" under budget constraints.`,
              "negotiation"
            );
          }
        }
      }
      return;
    }

    const timer = setTimeout(() => {
      setLogs((prev) => [...prev, fullLogs[currentLogIndex]]);
      setCurrentLogIndex((idx) => idx + 1);
    }, rolloutSpeed);

    return () => clearTimeout(timer);
  }, [fullLogs, currentLogIndex, rolloutSpeed, savingsInfo, winner, rfpItemName, rfpQuantity, autoSaveLedger]);

  // Autoscroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Execute manual signing & committing of the PO to the ledger
  const handleCommitPoToLedger = () => {
    if (purchaseOrder && !poSigned) {
      setPoHistory((prev) => [purchaseOrder, ...prev]);
      setPoSigned(true);
      if (currentUser) {
        logUserInteraction(
          currentUser.email,
          currentUser.fullName,
          "Committed PO to Ledger",
          `Signed and authorized purchase contract: ${purchaseOrder.id} with ${purchaseOrder.vendorName} for a total cost of $${purchaseOrder.totalCost.toLocaleString()}.`,
          "ledger"
        );
      }
    }
  };

  // Clear Ledger History
  const handleClearLedger = () => {
    if (window.confirm("Are you sure you want to completely wipe the Consensus Ledger historical POs?")) {
      setPoHistory([]);
      if (currentUser) {
        logUserInteraction(
          currentUser.email,
          currentUser.fullName,
          "Pruned Sourcing Ledger",
          "Completely wiped all local purchase order block histories.",
          "ledger"
        );
      }
    }
  };

  // Reset Databases to pristine default states
  const handleResetDefaults = () => {
    setVendorA({
      name: "Apex Chipsets Ltd",
      inventory: 6000,
      publicPrice: 900,
      minPrice: 750
    });
    setVendorB({
      name: "Nexus Silicon Partners",
      inventory: 8000,
      publicPrice: 850,
      minPrice: 780
    });
    setRfpItemName("Enterprise AI Tensor Processors");
    setRfpQuantity(5000);
    setRfpBudget(4000000);
    setRolloutSpeed(400);
    setBiddingAgility('moderate');
    setAutoSaveLedger(true);
    alert("Prone database inputs and simulator variables restored to default.");
  };

  // Submit Profile update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsUpdatingProfile(true);
    setProfileUpdateSuccess(false);

    setTimeout(() => {
      const updatedUser: User = {
        ...currentUser,
        fullName: profileName,
        companyName: profileCompany,
        privateKeySeed: profileSeed,
        // Regenerate public key from seed for realism
        publicKey: `aicoo_zkp_pk_${profileSeed.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 16) || "9c8a7b6f"}_node_authorized`
      };

      // Save as current user
      localStorage.setItem("deco_supply_current_user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      // Save inside user directory too
      try {
        const storedUsers = localStorage.getItem("deco_supply_users");
        if (storedUsers) {
          const list: User[] = JSON.parse(storedUsers);
          const idx = list.findIndex(u => u.email === currentUser.email);
          if (idx !== -1) {
            list[idx] = updatedUser;
            localStorage.setItem("deco_supply_users", JSON.stringify(list));
          }
        }
      } catch (err) {
        console.error("Failed to sync profile change in directory:", err);
      }

      setIsUpdatingProfile(false);
      setProfileUpdateSuccess(true);
      logUserInteraction(
        updatedUser.email,
        updatedUser.fullName,
        "Updated Profile Parameters",
        `Altered organization to "${updatedUser.companyName}" and re-keyed secure consensus seed.`,
        "settings"
      );
      setTimeout(() => setProfileUpdateSuccess(false), 3000);
    }, 850);
  };

  // Submit Help Ticket
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !ticketSubject || !ticketMessage) return;

    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      message: ticketMessage,
      status: "OPEN",
    };

    const updated = [newTicket, ...ticketsList];
    setTicketsList(updated);
    setTicketSubject("");
    setTicketMessage("");

    logUserInteraction(
      currentUser.email,
      currentUser.fullName,
      "Submitted Support Ticket",
      `Opened assistance request: "${ticketSubject}" (Priority: ${ticketPriority.toUpperCase()}).`,
      "help"
    );
    alert("Support ticket logged successfully inside the secure enclave node!");
  };

  // Submit Feedback
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !feedbackMessage) return;

    const newFeedback = {
      id: `FBK-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      companyName: currentUser.companyName,
      role: currentUser.role,
      category: feedbackCategory,
      rating: feedbackRating,
      message: feedbackMessage,
      status: "pending",
    };

    try {
      const stored = localStorage.getItem("deco_supply_feedback");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newFeedback);
      localStorage.setItem("deco_supply_feedback", JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }

    setFeedbackMessage("");
    setFeedbackSuccess(true);
    
    logUserInteraction(
      currentUser.email,
      currentUser.fullName,
      "Submitted System Feedback",
      `Sent system feedback with rating ${feedbackRating}/5 stars. Category: ${feedbackCategory}.`,
      "feedback"
    );

    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  // Filtered historic POs
  const filteredLedger = poHistory.filter(po => 
    po.vendorName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
    po.itemDescription.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
    po.id.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  const handleRazorpayPurchase = async () => {
    try {
      // 1. Fetch Order from backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 500000 }) // 5000 INR
      });
      const order = await res.json();
      
      if (!order.id) {
        alert("Failed to initialize payment gateway. Check server logs or API keys.");
        return;
      }

      // 2. Load Razorpay script dynamically
      if (!(window as any).Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
          document.body.appendChild(script);
        });
      }

      // 3. Initialize Razorpay
      const options = {
        key: "rzp_test_SjDvirFREAQxKp", 
        amount: order.amount,
        currency: order.currency,
        name: "DeCo-Supply Network",
        description: "5,000 Computation Proof Credits",
        order_id: order.id,
        handler: async function (response: any) {
          // 4. Verify Payment on Server
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              currency: order.currency,
              email: currentUser?.email
            })
          });
          
          const result = await verifyRes.json();
          if (result.status === "ok") {
            setProofCredits((prev) => prev + 5000);
            fetch(`/api/payments?email=${currentUser?.email}`)
              .then(res => res.json())
              .then(data => setInvoiceHistory(data))
              .catch(console.error);

            if (currentUser) {
              logUserInteraction(
                currentUser.email,
                currentUser.fullName,
                "Purchased Computation Credits",
                "Acquired +5,000 Zero Knowledge Sourcing Proof credits via live Razorpay secure tunnel.",
                "billing"
              );
            }
            alert("Payment verification complete. Secured +5,000 credits to your Enclave!");
          } else {
            alert("Cryptographic payment verification failed.");
          }
        },
        prefill: {
          name: currentUser?.fullName || "",
          email: currentUser?.email || "",
          contact: "9999999999"
        },
        theme: {
          color: "#10b981" // emerald-500 matching the premium aesthetic
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        console.error("Payment Failed", response.error);
        alert(`Transaction Failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (err) {
      console.error("Razorpay Error:", err);
      alert("Error initializing payment enclave.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-200 font-sans flex flex-col antialiased">
      {/* Top Banner Status */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-emerald-950/40 to-emerald-950/60 border-b border-indigo-500/10 px-6 py-2 text-center text-[11px] font-mono tracking-wider text-slate-400 flex items-center justify-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        <span>Fully decentralized zero-knowledge multi-agent consensus protocol active.</span>
        <button 
          onClick={() => setActiveTab('landing')} 
          className="text-indigo-400 hover:underline hover:text-indigo-300 font-semibold cursor-pointer"
        >
          Read whitepaper &rarr;
        </button>
      </div>

      {/* Premium Navigation Header */}
      <header className="h-16 border-b border-white/[0.04] bg-[#0c0c10]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center font-black text-white text-base tracking-wider shadow-lg shadow-indigo-500/20 font-mono animate-pulse-glow">
            ZK
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              DeCo-Supply
            </h1>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">Zero-Trust Agent Consensus v1.5</span>
          </div>
        </div>

        {/* Hamburger Menu Toggle */}
        {currentUser && (
        <div className="relative ml-4 mr-auto">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 cursor-pointer rounded-lg transition-colors ${
              isSidebarOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Instagram-style Dropdown Menu */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSidebarOpen(false)}
                />
                <motion.nav 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-3 w-64 bg-[#0f0f12] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 flex flex-col gap-1 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setActiveTab('landing');
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-lg font-medium transition-all cursor-pointer flex items-center gap-3 text-left ${
                      activeTab === 'landing'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <BookOpen className="w-6 h-6" />
                    <span>Protocol Overview</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setActiveTab('workspace');
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-lg font-medium transition-all cursor-pointer flex items-center gap-3 text-left ${
                      activeTab === 'workspace'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Terminal className="w-6 h-6" />
                    <span className="flex-1">Negotiation Terminal</span>
                    {!currentUser && <Lock className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setActiveTab('ledger');
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-lg font-medium transition-all cursor-pointer flex items-center gap-3 text-left ${
                      activeTab === 'ledger'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <History className="w-6 h-6" />
                    <span className="flex-1">Consensus Ledger</span>
                    {poHistory.length > 0 && (
                      <span className="bg-slate-800 text-slate-300 text-base px-2 py-0.5 rounded-full border border-slate-700 font-bold">
                        {poHistory.length}
                      </span>
                    )}
                    {!currentUser && <Lock className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setActiveTab('playground');
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-lg font-medium transition-all cursor-pointer flex items-center gap-3 text-left ${
                      activeTab === 'playground'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Sliders className="w-6 h-6" />
                    <span className="flex-1">Playground Settings</span>
                    {!currentUser && <Lock className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>

                  <div className="h-px bg-slate-800/60 my-2 mx-1" />

                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setActiveTab('billing');
                      if (currentUser) {
                        logUserInteraction(
                          currentUser.email,
                          currentUser.fullName,
                          "Accessed Billing Console",
                          "Viewed consensus credits, active subscription plan, and billing history.",
                          "billing"
                        );
                      }
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-lg font-medium transition-all cursor-pointer flex items-center gap-3 text-left ${
                      activeTab === 'billing'
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="flex-1">Billing</span>
                    {!currentUser && <Lock className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setActiveTab('settings');
                      if (currentUser) {
                        logUserInteraction(
                          currentUser.email,
                          currentUser.fullName,
                          "Opened Security Settings",
                          "Viewed cryptographic key material and officer profile parameters.",
                          "settings"
                        );
                      }
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-lg font-medium transition-all cursor-pointer flex items-center gap-3 text-left ${
                      activeTab === 'settings'
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Settings className="w-6 h-6" />
                    <span className="flex-1">Settings</span>
                    {!currentUser && <Lock className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setActiveTab('help');
                      if (currentUser) {
                        logUserInteraction(
                          currentUser.email,
                          currentUser.fullName,
                          "Accessed Help Desk",
                          "Browsed decentralized procurement FAQ and raised a protocol support inquiry.",
                          "help"
                        );
                      }
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-lg font-medium transition-all cursor-pointer flex items-center gap-3 text-left ${
                      activeTab === 'help'
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <HelpCircle className="w-6 h-6" />
                    <span className="flex-1">Help Desk</span>
                    {!currentUser && <Lock className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setActiveTab('feedback');
                      if (currentUser) {
                        logUserInteraction(
                          currentUser.email,
                          currentUser.fullName,
                          "Accessed Feedback Hub",
                          "Opened system feedback interface.",
                          "feedback"
                        );
                      }
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-lg font-medium transition-all cursor-pointer flex items-center gap-3 text-left ${
                      activeTab === 'feedback'
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span className="flex-1">Feedback</span>
                    {!currentUser && <Lock className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>

                  {currentUser && (currentUser.role === "Admin" || currentUser.role === "System Administrator (Admin)") && (
                    <>
                      <div className="h-px bg-slate-800/60 my-2 mx-1" />
                      <button
                        onClick={() => {
                          setIsSidebarOpen(false);
                          setActiveTab('admin');
                          logUserInteraction(
                            currentUser.email,
                            currentUser.fullName,
                            "Accessed Admin Console",
                            "Opened the system decentralized parameters admin portal.",
                            "admin"
                          );
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl text-lg font-medium transition-all cursor-pointer flex items-center gap-3 text-left ${
                          activeTab === 'admin'
                            ? 'bg-rose-900/30 text-rose-300 border border-rose-500/20'
                            : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/20'
                        }`}
                      >
                        <Shield className="w-6 h-6" />
                        <span>Admin Control</span>
                      </button>
                    </>
                  )}
                </motion.nav>
              </>
            )}
          </AnimatePresence>
        </div>
        )}

        {/* User profile & API connection status indicators */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 hover:bg-[#12121a] p-1.5 rounded-xl border border-transparent hover:border-amber-500/20 transition-all cursor-pointer text-left shadow-lg hover:shadow-amber-500/5 group"
                id="user-profile-panel-btn"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-mono leading-none flex items-center justify-end gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    {currentUser.fullName}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 uppercase tracking-wider group-hover:text-amber-500/70 transition-colors">
                    {currentUser.role} @ {currentUser.companyName}
                  </span>
                </div>
                
                {/* Avatar circle */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-950 via-slate-900 to-black border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-base font-mono select-none uppercase shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all">
                  {currentUser.fullName.split(" ").map(n => n[0]).join("")}
                </div>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop to close */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-72 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] p-5 z-50 font-mono text-base text-slate-300 space-y-4"
                      id="user-profile-panel-dropdown"
                    >
                      {/* Officer Identity card */}
                      <div className="border-b border-white/5 pb-4">
                        <p className="text-[9px] text-amber-500/60 uppercase tracking-widest font-bold">Active Clearance</p>
                        <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mt-1">{currentUser.fullName}</p>
                        <p className="text-[10px] text-amber-400 mt-1.5 uppercase font-semibold tracking-wide">{currentUser.role}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{currentUser.companyName}</p>
                      </div>

                      {/* Subscription & Proof Credits Card */}
                      <div className="bg-gradient-to-br from-amber-950/30 to-black border border-amber-500/20 p-3 rounded-xl space-y-2 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 blur-xl rounded-full"></div>
                        <div className="flex justify-between items-center text-[10px] relative z-10">
                          <span className="text-slate-400">Tier:</span>
                          <span className="text-amber-400 font-bold uppercase tracking-wider text-[9.5px]">ZKP Pro Enterprise</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] relative z-10">
                          <span className="text-slate-400">Proofs:</span>
                          <span className="text-amber-100 font-bold">{proofCredits.toLocaleString()} Credits</span>
                        </div>
                      </div>

                      {/* Navigation Actions */}
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setActiveTab('billing');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-white transition-all text-left cursor-pointer"
                        >
                          <CreditCard className="w-5 h-5 text-emerald-400" />
                          <span>Billing & Subscription</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('settings');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-white transition-all text-left cursor-pointer"
                        >
                          <Settings className="w-5 h-5 text-indigo-400" />
                          <span>Security & Enclave Keys</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('help');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-white transition-all text-left cursor-pointer"
                        >
                          <HelpCircle className="w-5 h-5 text-emerald-400" />
                          <span>Help Desk & Tickets</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('feedback');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-white transition-all text-left cursor-pointer"
                        >
                          <MessageSquare className="w-5 h-5 text-emerald-400" />
                          <span>Send Feedback</span>
                        </button>
                      </div>

                      {/* Sign Out Button */}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-center text-[10px] font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 transition-all py-2 rounded-lg cursor-pointer border border-rose-500/20 hover:border-transparent uppercase"
                      >
                        Sign Out Cryptographic Session
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl text-base font-bold font-mono bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-400 hover:to-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-95 transition-all cursor-pointer uppercase flex items-center gap-2 border border-amber-300/50"
            >
              <Fingerprint className="w-6 h-6 text-black/80" />
              <span className="tracking-wider">Officer Log In</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-4">
            {hasAicooApiKey ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider font-mono">Live Gateway Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span className="text-[10px] font-medium text-amber-400 uppercase tracking-wider font-mono">Isolated Sandbox</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Render Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          
          {/* ==========================================
              TAB 1: PREMIUM LANDING PAGE
              ========================================== */}
          {activeTab === 'landing' && (
            <motion.div
              key="landing-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LandingPage 
                currentUser={currentUser} 
                onNavigate={(tab: string) => setActiveTab(tab as any)} 
              />
            </motion.div>
          )}

          {/* ==========================================
              TAB 1.5: LOGIN PAGE (INLINE AUTH)
              ========================================== */}
          {activeTab === 'login' && !currentUser && (
            <motion.div
              key="login-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-12 flex justify-center w-full relative min-h-[70vh] items-center"
            >
              {/* Animated background blobs */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px] animate-aurora" />
                <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] text-emerald-600/8 rounded-full blur-[100px] animate-aurora" style={{ animationDelay: '4s' }} />
              </div>
              <AuthModal 
                isOpen={true} 
                onClose={() => setActiveTab('landing')} 
                onAuthSuccess={handleAuthSuccess} 
                inline={true} 
              />
            </motion.div>
          )}

          {/* ==========================================
              TAB 2: TERMINAL WORKSPACE (ACTIVE AREA)
              ========================================== */}
          {activeTab === 'workspace' && currentUser && (
            <motion.div
              key="workspace-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0A0A0C]"
            >
              {/* COLUMN 1: CONFIGURATION & DATABASE INPUTS (Lg: col-span-4) */}
              <section className="lg:col-span-4 flex flex-col gap-6 bg-[#0F0F12] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                
                {/* Active Officer Cryptographic Identity */}
                {currentUser ? (
                  <div className="bg-slate-950 rounded-xl border border-emerald-500/10 p-3 space-y-2 font-mono relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 text-emerald-500/5 blur-xl rounded-full"></div>
                    <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5">
                      <Fingerprint className="w-6 h-6 text-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Signing Authority Active</span>
                    </div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between text-slate-400">
                        <span>OFFICER:</span>
                        <span className="text-white font-bold">{currentUser.fullName}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>ENTITY:</span>
                        <span className="text-white font-bold">{currentUser.companyName}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>ROLE:</span>
                        <span className="text-slate-300 font-semibold">{currentUser.role}</span>
                      </div>
                      <div className="pt-1 text-[8px] text-slate-500 border-t border-slate-900/60 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span>SIGNING KEY: {currentUser.publicKey}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 rounded-xl border border-dashed border-slate-800 p-3.5 space-y-2 font-mono text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Lock className="w-6 h-6 text-amber-500" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Anonymous Mode Active</span>
                    </div>
                    <p className="text-[9.5px] text-slate-500 leading-relaxed">
                      Consensus purchase order records will be signed with default anonymous sandbox keys.
                    </p>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Sign In to Authenticate
                    </button>
                  </div>
                )}
                
                {/* RFP DETAILS (TOTAL USER INPUT FORM) */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 text-slate-300 font-medium text-base uppercase tracking-wider">
                      <Send className="w-6 h-6 text-emerald-400" />
                      <span>RFP Contract Parameters</span>
                    </div>
                    <div className="flex rounded bg-slate-900 border border-slate-800 p-0.5">
                      <button
                        onClick={() => setRfpMode('form')}
                        disabled={isNegotiating}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold transition-all ${
                          rfpMode === 'form' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Form
                      </button>
                      <button
                        onClick={() => setRfpMode('manual')}
                        disabled={isNegotiating}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold transition-all ${
                          rfpMode === 'manual' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        NL Prompt
                      </button>
                    </div>
                  </div>

                  {rfpMode === 'form' ? (
                    <div className="space-y-3.5">
                      {/* Item description */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                          Target Product/Item Name:
                        </label>
                        <input
                          type="text"
                          disabled={isNegotiating}
                          value={rfpItemName}
                          onChange={(e) => setRfpItemName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg p-2.5 text-base text-slate-200 font-mono"
                          placeholder="e.g. H100 Tensor Processing GPUs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Quantity */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                            Target Quantity:
                          </label>
                          <input
                            type="number"
                            min="100"
                            step="100"
                            disabled={isNegotiating}
                            value={rfpQuantity}
                            onChange={(e) => setRfpQuantity(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg p-2.5 text-base text-slate-200 font-mono"
                          />
                        </div>

                        {/* Budget */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                            Max Total Budget ($):
                          </label>
                          <input
                            type="number"
                            min="1000"
                            step="50000"
                            disabled={isNegotiating}
                            value={rfpBudget}
                            onChange={(e) => setRfpBudget(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg p-2.5 text-base text-slate-200 font-mono"
                          />
                        </div>
                      </div>

                      {/* Display computed RFP prompt */}
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                        <span className="block text-[9px] uppercase font-mono tracking-widest text-slate-600 font-bold mb-1">
                          Consensus Broadcaster Payload:
                        </span>
                        <p className="text-[11px] font-mono text-slate-400 italic">
                          "{prompt}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                        Enter Natural Language RFP Request:
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        disabled={isNegotiating}
                        className="w-full bg-slate-900 border border-slate-700 focus:text-emerald-500 rounded-lg p-3 text-base text-slate-200 resize-none focus:outline-none font-mono"
                        placeholder="e.g. Need 5,000 units of Enterprise AI Tensor Processors under $4,000,000"
                      />
                      <p className="text-[10px] text-slate-500 leading-normal font-mono">
                        💡 Specify target quantity (e.g., "5000 units") and budget (e.g., "under $4M") for the regex parser to bind accurately.
                      </p>
                    </div>
                  )}

                  {/* Trigger Action */}
                  <button
                    onClick={startNegotiation}
                    disabled={isNegotiating || !prompt}
                    className={`w-full py-3.5 rounded-xl font-bold text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isNegotiating
                        ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                        : "text-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 active:scale-95"
                    }`}
                  >
                    {isNegotiating ? (
                      <>
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                        <span>Negotiating Autonomous Pool...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6 fill-current" />
                        <span>Broadcaster Bids RFP</span>
                      </>
                    )}
                  </button>
                </div>

                <hr className="border-slate-800/80 my-1" />

                {/* PRIVATE CELLS DATABASES (TOTAL USER INPUT FIELDS) */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 text-slate-300 font-medium text-base uppercase tracking-wider">
                      <Database className="w-6 h-6 text-emerald-400" />
                      <span>Isolated Private Cell DBs</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Lock className="w-4 h-4" />
                      Zero-Trust
                    </div>
                  </div>

                  {/* Vendor A Config Box */}
                  <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-base font-bold text-rose-400 font-mono">Cell Container A:</span>
                      <span className="text-[9px] font-mono text-slate-500">Apex Node</span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Name input */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Vendor Name:</span>
                        <input
                          type="text"
                          disabled={isNegotiating}
                          value={vendorA.name}
                          onChange={(e) => setVendorA({ ...vendorA, name: e.target.value })}
                          className="w-2/3 bg-slate-950 border border-slate-800 rounded p-1 text-[11px] font-mono text-slate-200"
                        />
                      </div>

                      {/* Stock input */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Inventory stock:</span>
                        <input
                          type="number"
                          disabled={isNegotiating}
                          value={vendorA.inventory}
                          onChange={(e) => setVendorA({ ...vendorA, inventory: Number(e.target.value) })}
                          className="w-1/3 bg-slate-950 border border-slate-800 rounded p-1 text-[11px] font-mono text-slate-200"
                        />
                      </div>

                      {/* Catalog Price */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Catalog Price ($):</span>
                        <input
                          type="number"
                          disabled={isNegotiating}
                          value={vendorA.publicPrice}
                          onChange={(e) => setVendorA({ ...vendorA, publicPrice: Number(e.target.value) })}
                          className="w-1/3 bg-slate-950 border border-slate-800 rounded p-1 text-[11px] font-mono text-slate-200"
                        />
                      </div>

                      {/* Floor price (Secret) */}
                      <div className="flex items-center justify-between gap-2 bg-rose-500/5 p-2 rounded border border-rose-500/10">
                        <span className="text-[10px] font-mono text-rose-300 uppercase flex items-center gap-1">
                          <Lock className="w-4 h-4" /> Minimum Floor ($):
                        </span>
                        <input
                          type="number"
                          disabled={isNegotiating}
                          value={vendorA.minPrice}
                          onChange={(e) => setVendorA({ ...vendorA, minPrice: Number(e.target.value) })}
                          className="w-1/3 bg-slate-950 border border-rose-950 rounded p-1 text-[11px] font-mono text-rose-300 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vendor B Config Box */}
                  <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-base font-bold text-emerald-400 font-mono">Cell Container B:</span>
                      <span className="text-[9px] font-mono text-slate-500">Nexus Node</span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Name input */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Vendor Name:</span>
                        <input
                          type="text"
                          disabled={isNegotiating}
                          value={vendorB.name}
                          onChange={(e) => setVendorB({ ...vendorB, name: e.target.value })}
                          className="w-2/3 bg-slate-950 border border-slate-800 rounded p-1 text-[11px] font-mono text-slate-200"
                        />
                      </div>

                      {/* Stock input */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Inventory stock:</span>
                        <input
                          type="number"
                          disabled={isNegotiating}
                          value={vendorB.inventory}
                          onChange={(e) => setVendorB({ ...vendorB, inventory: Number(e.target.value) })}
                          className="w-1/3 bg-slate-950 border border-slate-800 rounded p-1 text-[11px] font-mono text-slate-200"
                        />
                      </div>

                      {/* Catalog Price */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Catalog Price ($):</span>
                        <input
                          type="number"
                          disabled={isNegotiating}
                          value={vendorB.publicPrice}
                          onChange={(e) => setVendorB({ ...vendorB, publicPrice: Number(e.target.value) })}
                          className="w-1/3 bg-slate-950 border border-slate-800 rounded p-1 text-[11px] font-mono text-slate-200"
                        />
                      </div>

                      {/* Floor price (Secret) */}
                      <div className="flex items-center justify-between gap-2 bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                        <span className="text-[10px] font-mono text-emerald-300 uppercase flex items-center gap-1">
                          <Lock className="w-4 h-4" /> Minimum Floor ($):
                        </span>
                        <input
                          type="number"
                          disabled={isNegotiating}
                          value={vendorB.minPrice}
                          onChange={(e) => setVendorB({ ...vendorB, minPrice: Number(e.target.value) })}
                          className="w-1/3 bg-slate-950 border border-emerald-950 rounded p-1 text-[11px] font-mono text-emerald-300 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sync Databases action */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSyncDatabases}
                      disabled={isNegotiating || isSyncing}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-base py-2 rounded-xl transition-all cursor-pointer"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                          <span>Syncing Cell Arrays...</span>
                        </>
                      ) : syncSuccess ? (
                        <>
                          <Check className="w-5 h-5 text-emerald-400" />
                          <span>Private cells fully synced!</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-5 h-5 text-slate-500" />
                          <span>Sync Custom Private DBs</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </section>

              {/* COLUMN 2: THE AICOO CONSENSUS TERMINAL (Lg: col-span-5) */}
              <section className="lg:col-span-5 flex flex-col bg-[#0F0F12] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                {/* Terminal Banner / Header */}
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-4">
                    <label className="text-base font-bold text-slate-500 uppercase tracking-widest font-mono">
                      Trustless Terminal
                    </label>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full animate-ping"></div>
                      <div className="w-1.5 h-1.5 text-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-mono">Rollout delay:</span>
                    {/* Rollout Speed Config */}
                    <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[10px] font-mono text-slate-400">
                      <select 
                        value={rolloutSpeed}
                        onChange={(e) => setRolloutSpeed(Number(e.target.value))}
                        disabled={isNegotiating && currentLogIndex === 0}
                        className="bg-transparent text-emerald-400 focus:outline-none cursor-pointer font-semibold border-none"
                      >
                        <option value={100}>100ms (Turbo)</option>
                        <option value={400}>400ms (Fast)</option>
                        <option value={1000}>1000ms (Simulated)</option>
                      </select>
                    </div>

                    {/* Instant Skip Button */}
                    {isNegotiating && (
                      <button
                        onClick={() => setRolloutSpeed(10)}
                        className="text-[9px] uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-400 hover:text-emerald-600 hover:text-white border border-emerald-500/20 px-2 py-1 rounded transition-all cursor-pointer"
                      >
                        Skip ⚡
                      </button>
                    )}
                  </div>
                </div>

                {/* Real-time price chart */}
                <div className="mb-4">
                  <BiddingProgressChart
                    logs={logs}
                    vendorA={vendorA}
                    vendorB={vendorB}
                    targetUnitPrice={Math.round(rfpBudget / rfpQuantity)}
                    isNegotiating={isNegotiating}
                  />
                </div>

                {/* Terminal Logs Viewport */}
                <div className="flex-1 bg-black rounded-xl border border-slate-850 p-5 font-mono text-base overflow-y-auto space-y-3 min-h-[450px] max-h-[750px] relative shadow-2xl">
                  {/* Terminal Grid Background lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40"></div>
                  
                  <div className="relative z-10 space-y-3.5">
                    {logs.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 gap-3 font-mono py-32">
                        <Terminal className="w-10 h-10 text-slate-800 animate-pulse" />
                        <div>
                          <p className="text-slate-500 text-base uppercase font-bold tracking-wider">Aicoo Node: Standing By</p>
                          <p className="text-[10px] text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                            Awaiting client Request for Proposal (RFP) broadcast. Click "Broadcaster Bids RFP" to trigger multi-round negotiation.
                          </p>
                        </div>
                      </div>
                    ) : (
                      logs.map((log) => {
                        let actorLabel = `[${log.actorName}]`;
                        let actorClass = "text-emerald-400";
                        
                        if (log.actor === "router") {
                          actorClass = "text-indigo-400 font-semibold";
                        } else if (log.actor === "buyer") {
                          actorClass = "text-cyan-400 font-bold";
                        } else if (log.actor === "vendor_a") {
                          actorClass = "text-rose-400";
                        } else if (log.actor === "vendor_b") {
                          actorClass = "text-emerald-400";
                        } else if (log.actor === "system") {
                          actorClass = "text-slate-500";
                        }

                        const isThinking = log.type === "thinking";
                        const isAgreement = log.type === "agreement" || log.type === "crypto";

                        if (isThinking) {
                          return (
                            <div key={log.id} className="space-y-1 bg-slate-950/40 p-2.5 rounded border border-slate-900">
                              <div className="flex gap-3 text-[11px]">
                                <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                                <span className={actorClass}>{actorLabel}</span>
                                <span className="text-slate-400 font-semibold italic">Reading local state container cell (Zero-Knowledge Isolation Mode)</span>
                              </div>
                              <div className="flex gap-3 pl-6">
                                <span className="text-slate-500 text-[10px] leading-relaxed">
                                  &rarr; {log.message}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={log.id} className={`flex gap-3 items-start p-1.5 rounded transition-colors ${
                            isAgreement ? "bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 font-semibold" : "text-slate-300 hover:bg-slate-900/40"
                          }`}>
                            <span className="text-slate-600 select-none text-[10px]">[{log.timestamp}]</span>
                            <span className={`${actorClass} text-[11px] whitespace-nowrap`}>{actorLabel}</span>
                            <span className="flex-1 text-[11px] leading-relaxed">
                              {log.message}
                              {log.meta && (
                                <span className="block mt-1 text-[10px] text-slate-500 font-mono bg-slate-950 p-2 rounded border border-slate-900 max-w-sm">
                                  Price / item: <strong className="text-slate-300">${log.meta.unitPrice}</strong> | Pool value: <strong className="text-slate-300">${log.meta.total?.toLocaleString()}</strong>
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })
                    )}
                    
                    {isNegotiating && (
                      <div className="flex items-center gap-1 animate-pulse pl-1 pt-1 text-emerald-500">
                        <span className="w-2 h-3.5 text-emerald-500 inline-block"></span>
                        <span className="text-[10px] font-mono">Consensus pipeline working...</span>
                      </div>
                    )}
                  </div>

                  <div ref={terminalEndRef} />
                </div>

                {/* Running Status Footer */}
                {isNegotiating && (
                  <div className="bg-slate-950 rounded-xl border border-slate-800 px-4 py-3 mt-4 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full text-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 text-emerald-500"></span>
                      </span>
                      Bidding coordination in rounds...
                    </span>
                    <span className="font-semibold text-base">Round {currentLogIndex < 6 ? "1" : "2"}/2</span>
                  </div>
                )}
              </section>

              {/* COLUMN 3: DECISION CERTIFICATE & SIGNING ACTIONS (Lg: col-span-3) */}
              <section className="lg:col-span-3 flex flex-col gap-6">
                
                {/* Winning Purchase Order Certificate */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-base font-bold text-slate-500 uppercase tracking-widest font-mono">
                      ZK Purchase Order
                    </label>
                    {purchaseOrder && negotiationStatus === "SUCCESS" && (
                      <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-mono font-bold tracking-widest">
                        Settled
                      </span>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {purchaseOrder && negotiationStatus === "SUCCESS" ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-900 border border-slate-700/80 rounded-xl p-5 shadow-inner flex flex-col gap-4 relative overflow-hidden"
                      >
                        {/* Stamp overlay */}
                        <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                          <CheckCircle className="w-32 h-32 text-emerald-500" />
                        </div>

                        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                          <div>
                            <p className="text-[9px] text-slate-500 uppercase font-mono font-semibold">Consensus Winner</p>
                            <p className="text-lg font-bold text-white tracking-tight leading-normal uppercase">
                              {purchaseOrder.vendorName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-slate-500 uppercase font-mono font-semibold">Ledger ID</p>
                            <p className="text-[10px] font-mono text-slate-300 font-semibold">{purchaseOrder.id}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 text-base font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Description:</span>
                            <span className="text-slate-200 text-right max-w-[150px] truncate">{purchaseOrder.itemDescription}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Order Quantity:</span>
                            <span className="text-slate-200 font-bold">{purchaseOrder.quantity.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Unit Cost Squeezed:</span>
                            <span className="text-emerald-400 font-bold">${purchaseOrder.unitPrice.toFixed(2)}</span>
                          </div>
                          
                          <div className="h-px bg-slate-800 my-1"></div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 uppercase text-[9px] tracking-widest font-bold">Total Cost</span>
                            <span className="text-2xl font-bold text-white">${purchaseOrder.totalCost.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 uppercase text-[9px] tracking-widest font-bold">Total Saved</span>
                            <span className="text-base text-emerald-400 font-semibold">${purchaseOrder.savings.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="bg-black/60 p-2 rounded border border-slate-800 text-[8px] text-slate-400 leading-normal font-mono select-all break-all relative">
                          <span className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5 tracking-wider">Zero-Knowledge Root Proof:</span>
                          {purchaseOrder.cryptographicHash}
                        </div>

                        {!poSigned && (
                          <SignaturePad 
                            onSignStatusChange={setLocalSignatureSaved} 
                            poId={purchaseOrder.id} 
                          />
                        )}

                        {poSigned ? (
                          <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 py-3 rounded-lg font-bold text-base uppercase tracking-wider text-center flex items-center justify-center gap-1.5 font-mono">
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                            <span>Committed to Ledger!</span>
                          </div>
                        ) : (
                          <button 
                            onClick={handleCommitPoToLedger}
                            disabled={!localSignatureSaved}
                            className={`w-full py-3 rounded-lg font-bold text-base uppercase tracking-wider transition-all shadow-md font-mono ${
                              localSignatureSaved 
                                ? 'bg-white hover:bg-slate-100 text-black active:scale-95 cursor-pointer' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                            }`}
                          >
                            {!localSignatureSaved ? "Sign signature pad first" : "Commit Ledger"}
                          </button>
                        )}

                        {poSigned && (
                          <button
                            onClick={() => {
                              setSelectedLedgerPo(purchaseOrder);
                              setActiveTab('ledger');
                            }}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono text-center hover:underline cursor-pointer"
                          >
                            View cryptographic certificate &rarr;
                          </button>
                        )}
                      </motion.div>
                    ) : negotiationStatus === "FAILED" ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center py-8 flex flex-col gap-3"
                      >
                        <div className="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
                          <Lock className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider font-mono">Negotiation Aborted</h3>
                          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                            RFP budget was below the private floor boundaries of both Active Vendors. No deal formed.
                          </p>
                          <div className="text-[10px] text-rose-400 font-mono mt-3.5 p-2 bg-rose-500/5 rounded border border-rose-500/15">
                            🔒 Both vendor floor margins remained 100% hidden and secure. Zero leakage.
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-900/60 border border-slate-850 border-dashed rounded-xl p-5 text-center py-20 text-slate-500 font-mono"
                      >
                        <FileText className="w-8 h-8 text-slate-800 mx-auto mb-2.5" />
                        <div className="text-[11px] leading-relaxed">
                          <p>Contract Pending.</p>
                          <p className="text-[9px] text-slate-600 mt-1">Start bidding loop to generate cryptographic ledger agreement.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </section>
            </motion.div>
          )}

          {/* ==========================================
              TAB 3: CONSENSUS LEDGER (HISTORY ARCHIVE)
              ========================================== */}
          {activeTab === 'ledger' && currentUser && (
            <motion.div
              key="ledger-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 py-4"
            >
              {/* Header and Controls */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-3xl font-bold text-white font-sans">ZK Consensus PO Ledger</h2>
                  </div>
                  <p className="text-base text-slate-400">
                    A secure decentralized audit trail of successfully completed zero-trust procurement contract settlements.
                  </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {/* Search input */}
                  <div className="relative flex-1 md:flex-initial">
                    <Search className="w-6 h-6 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search ledger..."
                      value={ledgerSearch}
                      onChange={(e) => setLedgerSearch(e.target.value)}
                      className="bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg pl-9 pr-4 py-2 text-base text-slate-200 font-mono w-full md:w-60"
                    />
                  </div>

                  {/* Reset action */}
                  <button
                    onClick={handleClearLedger}
                    disabled={poHistory.length === 0}
                    className="bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 border border-slate-800 hover:border-rose-950/20 px-3 py-2 rounded-lg text-base font-mono transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Wipe Ledger</span>
                  </button>
                </div>
              </div>

              {/* Ledger Grid/List */}
              {filteredLedger.length === 0 ? (
                <div className="bg-[#0F0F12] border border-slate-850 rounded-2xl p-16 text-center max-w-lg mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                    <History className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">No Matching Ledger Records</h3>
                    <p className="text-base text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Either no negotiations have successfully closed yet, or your search filter doesn't match any historical IDs.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setLedgerSearch("");
                      setActiveTab('workspace');
                    }}
                    className="text-emerald-600 hover:bg-emerald-500 text-white font-mono text-base px-4 py-2 rounded-lg transition-all font-bold cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Run Negotiation Simulation</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Side: Table of records */}
                  <div className="lg:col-span-8 bg-[#0F0F12] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-mono text-base">
                        <thead>
                          <tr className="border-b border-slate-800 bg-[#141418] text-slate-400 text-[10px] uppercase tracking-wider">
                            <th className="p-4 font-semibold">Ledger ID / Date</th>
                            <th className="p-4 font-semibold">Consensus Winner</th>
                            <th className="p-4 font-semibold">Product Description</th>
                            <th className="p-4 font-semibold text-right">Qty / Unit Cost</th>
                            <th className="p-4 font-semibold text-right">Savings Saved</th>
                            <th className="p-4 font-semibold text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 text-slate-300">
                          {filteredLedger.map((po) => (
                            <tr 
                              key={po.id} 
                              onClick={() => setSelectedLedgerPo(po)}
                              className={`hover:bg-slate-900/60 transition-colors cursor-pointer ${
                                selectedLedgerPo?.id === po.id ? 'bg-emerald-950/20' : ''
                              }`}
                            >
                              <td className="p-4">
                                <div className="font-semibold text-white text-[11px]">{po.id}</div>
                                <div className="text-[9px] text-slate-500 mt-0.5">{po.signedAt}</div>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 font-bold uppercase block w-fit">
                                  {po.vendorName.replace(" (Apex Chipsets Ltd)", "").replace(" (Nexus Silicon Partners)", "")}
                                </span>
                              </td>
                              <td className="p-4 text-slate-200 max-w-[150px] truncate">{po.itemDescription}</td>
                              <td className="p-4 text-right">
                                <div className="font-bold">{po.quantity.toLocaleString()} units</div>
                                <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">${po.unitPrice.toFixed(2)}/each</div>
                              </td>
                              <td className="p-4 text-right font-bold text-emerald-400">
                                ${po.savings.toLocaleString()}
                              </td>
                              <td className="p-4 text-center">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLedgerPo(po);
                                  }}
                                  className="text-emerald-400 hover:text-emerald-300 hover:underline font-bold text-[10px]"
                                >
                                  Inspect ZK
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Side: High-fidelity selected record Certificate inspect view */}
                  <div className="lg:col-span-4 bg-[#0F0F12] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
                    {selectedLedgerPo ? (
                      <div className="space-y-5">
                        <div className="text-center border-b border-slate-800 pb-4">
                          <Fingerprint className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-pulse" />
                          <h3 className="text-base font-bold text-slate-400 uppercase tracking-widest font-mono">
                            ZK Cryptographic Receipt
                          </h3>
                          <p className="text-[10px] font-mono text-slate-500 mt-1">
                            Block Verification ID: {selectedLedgerPo.id}
                          </p>
                        </div>

                        {/* Certificate frame layout */}
                        <div className="border border-slate-800/80 rounded-xl bg-slate-950 p-5 space-y-4 font-mono text-base relative overflow-hidden">
                          {/* Corner patterns */}
                          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l text-emerald-500"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r text-emerald-500"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l text-emerald-500"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r text-emerald-500"></div>

                          {/* Security Stamp watermark */}
                          <div className="flex justify-between text-[10px] border-b border-slate-900 pb-2">
                            <span className="text-slate-500 font-bold uppercase">PROV PROTOCOL:</span>
                            <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4" /> VERIFIED OK
                            </span>
                          </div>

                          <div className="space-y-2 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Buyer Entity:</span>
                              <span className="text-slate-300 font-bold">{selectedLedgerPo.buyerName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Vendor Node:</span>
                              <span className="text-slate-300 font-bold">{selectedLedgerPo.vendorName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Product Code:</span>
                              <span className="text-slate-300 font-bold max-w-[150px] truncate text-right">{selectedLedgerPo.itemDescription}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Lot Quantity:</span>
                              <span className="text-slate-200 font-bold">{selectedLedgerPo.quantity.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Consensus Price:</span>
                              <span className="text-emerald-400 font-bold">${selectedLedgerPo.unitPrice.toFixed(2)} / each</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Final PO Total:</span>
                              <span className="text-white font-extrabold">${selectedLedgerPo.totalCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Total Savings:</span>
                              <span className="text-emerald-400 font-bold">${selectedLedgerPo.savings.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="border-t border-slate-900 pt-3 space-y-1.5">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Merkle Tree Root Signature:</span>
                            <div className="bg-black p-2 rounded border border-slate-900 text-[8px] text-slate-400 break-all select-all font-mono leading-normal leading-relaxed">
                              {selectedLedgerPo.cryptographicHash}
                            </div>
                          </div>

                          <div className="text-[9px] text-slate-600 text-center pt-1 font-mono leading-relaxed">
                            🔒 Proof evaluated with zero-leakage of vendor minimum pricing. Encoded consensus locked on timestamp {selectedLedgerPo.signedAt}.
                          </div>
                        </div>

                        {/* Copy details */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(selectedLedgerPo, null, 2));
                            alert("Cryptographic receipt details copied to clipboard as JSON.");
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-base py-2.5 rounded-lg font-mono transition-all font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Copy className="w-5 h-5" />
                          <span>Copy Payload JSON</span>
                        </button>
                      </div>
                    ) : (
                      <div className="py-16 text-center text-slate-500 font-mono space-y-2">
                        <Fingerprint className="w-10 h-10 text-slate-800 mx-auto animate-pulse" />
                        <div>
                          <p className="text-base">Select Ledger Receipt</p>
                          <p className="text-[9px] text-slate-600 max-w-[180px] mx-auto mt-1">
                            Click any ledger row in the table to inspect its cryptographic zero-knowledge details.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* ==========================================
              TAB 4: PLAYGROUND SETTINGS (SIMULATOR)
              ========================================== */}
          {activeTab === 'playground' && currentUser && (
            <motion.div
              key="playground-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto py-4 space-y-8"
            >
              <div className="space-y-1.5 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-3xl font-bold text-white font-sans">Simulator Playground & Diagnostics</h2>
                </div>
                <p className="text-base text-slate-400">
                  Configure simulation parameters, agent behavioral models, and fine-tune zero-trust coordination thresholds.
                </p>
              </div>

              <div className="space-y-6">
                {/* Section 1: Typewriter rollout speed */}
                <div className="bg-[#0F0F12] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-300 uppercase tracking-wider font-mono">Consensus Terminal Delay</h4>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Control how fast strategic thinking logs and bidding rounds roll out in the terminal window.
                      </p>
                    </div>
                    <span className="text-base font-mono font-bold text-emerald-400">{rolloutSpeed}ms</span>
                  </div>

                  <input
                    type="range"
                    min="20"
                    max="1500"
                    step="10"
                    value={rolloutSpeed}
                    onChange={(e) => setRolloutSpeed(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>⚡ 20ms (Instant)</span>
                    <span>400ms (Fast)</span>
                    <span>1500ms (Simulated Slow)</span>
                  </div>
                </div>

                {/* Section 2: Agent Bidding Agility Model */}
                <div className="bg-[#0F0F12] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-300 uppercase tracking-wider font-mono">Agent Bidding Agility / Strategy</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Toggle the strategic aggressiveness profiles. Defines how closely agents drop prices towards their minimum thresholds.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setBiddingAgility('conservative')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col gap-1 items-center ${
                        biddingAgility === 'conservative'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-base font-mono">Conservative</span>
                      <span className="text-[9px] text-slate-500 font-normal">Slower bid drop, walks early</span>
                    </button>

                    <button
                      onClick={() => setBiddingAgility('moderate')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col gap-1 items-center ${
                        biddingAgility === 'moderate'
                          ? 'bg-emerald-500/10 text-emerald-500 text-emerald-400 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-base font-mono">Balanced</span>
                      <span className="text-[9px] text-slate-500 font-normal">Standard strategic match</span>
                    </button>

                    <button
                      onClick={() => setBiddingAgility('aggressive')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col gap-1 items-center ${
                        biddingAgility === 'aggressive'
                          ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-base font-mono">Aggressive</span>
                      <span className="text-[9px] text-slate-500 font-normal">Bids aggressively near floor</span>
                    </button>
                  </div>
                </div>

                {/* Section 3: Ledger Auto Save */}
                <div className="bg-[#0F0F12] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-300 uppercase tracking-wider font-mono">Auto-Commit Ledger on Success</h4>
                    <p className="text-[11px] text-slate-500 leading-normal max-w-md">
                      If enabled, successfully generated procurement purchase orders are auto-saved to the persistent history ledger.
                    </p>
                  </div>

                  <button
                    onClick={() => setAutoSaveLedger(!autoSaveLedger)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      autoSaveLedger ? 'text-emerald-600' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                      autoSaveLedger ? 'left-7' : 'left-1'
                    }`}></span>
                  </button>
                </div>

                {/* Section 4: Diagnostics and Defaults */}
                <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-base font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5 justify-center sm:justify-start">
                      <AlertCircle className="w-6 h-6 text-amber-500" /> System Diagnostics / Clear State
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Restore original sample databases and wipe customized configurations in one click.
                    </p>
                  </div>

                  <button
                    onClick={handleResetDefaults}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-4 py-2.5 rounded-lg text-base font-mono transition-all font-semibold whitespace-nowrap cursor-pointer"
                  >
                    Restore Original Variables
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              TAB 5: BILLING & SUBSCRIPTION CONSOLE
              ========================================== */}
          {currentUser && activeTab === 'billing' && (
            <motion.div
              key="billing-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto py-4 space-y-8"
              id="billing-console-tab"
            >
              <div className="space-y-1.5 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-3xl font-bold text-white font-sans">Enclave Subscription & Billing</h2>
                </div>
                <p className="text-base text-slate-400">
                  Manage your secure multi-agent protocol plan, audit subscription licenses, and purchase ZK computation proof credits.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Active Plan Card */}
                <div className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-5 space-y-4 md:col-span-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold uppercase">
                        Active Subscription
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-2">ZK-Enclave Enterprise Sourcing</h3>
                      <p className="text-base text-slate-400">Consensus Engine Layer with hardware-grade zero-knowledge enclave isolation.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-white font-mono">$2,499</span>
                      <span className="text-slate-500 text-base font-mono">/mo</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/60 pt-4 grid grid-cols-2 gap-4 text-base font-mono text-slate-400">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Clearance Status</p>
                      <p className="text-slate-300 font-bold mt-0.5">AUTHORIZED OFFICER</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Next Auto-Renewal</p>
                      <p className="text-slate-300 font-bold mt-0.5">July 28, 2026</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Registered Company</p>
                      <p className="text-slate-300 font-bold mt-0.5 truncate">{currentUser.companyName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Assigned Node</p>
                      <p className="text-slate-300 font-bold mt-0.5">SGX-Enclave-001</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/60 pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => alert("Enterprise custom licenses are configured via DeCo-Supply global command admin nodes.")}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-4 py-2 rounded-xl text-base font-mono font-bold cursor-pointer transition-all flex-1 text-center"
                    >
                      Modify Plan Options
                    </button>
                    <button 
                      type="button"
                      onClick={() => alert("Contact support at compliance@deco.supply for subscription cancellations.")}
                      className="text-slate-500 hover:text-rose-400 bg-rose-950/10 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/25 px-4 py-2 rounded-xl text-base font-mono font-semibold cursor-pointer transition-all"
                    >
                      Cancel Plan
                    </button>
                  </div>
                </div>

                {/* ZK Proof Credits remaining */}
                <div className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">
                      Gas / Proof Balance
                    </span>
                    <div className="py-2">
                      <h4 className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                        {proofCredits.toLocaleString()}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">ZK Proof Credits Available</p>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Each autonomous negotiation run consumes approximately <strong className="text-slate-200">240 credits</strong> to compile cryptographic range proofs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRazorpayPurchase}
                    className="w-full text-emerald-600 hover:bg-emerald-500 text-white font-mono text-base font-bold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-6 h-6" />
                    <span>Purchase 5,000 Credits</span>
                  </button>
                </div>

              </div>

              {/* Invoices History list */}
              <div className="bg-[#0F0F12] border border-slate-800/80 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-950/40">
                  <h4 className="text-base font-bold text-white uppercase tracking-wider font-mono">Consensus Licensing Invoice History</h4>
                </div>
                <div className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {invoiceHistory.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 italic">No previous payments found in the database.</div>
                  ) : (
                    invoiceHistory.map((invoice) => (
                      <div key={invoice.id} className="p-3.5 flex items-center justify-between text-slate-400 hover:bg-slate-900/10">
                        <div>
                          <p className="font-bold text-white">INV-{invoice.id.toString().padStart(6, '0')}</p>
                          <p className="text-[9.5px] text-slate-500 mt-0.5">
                            {new Date(invoice.created_at).toLocaleDateString()} &bull; Razorpay ID: {invoice.payment_id.substring(0, 10)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-white font-bold">{(invoice.amount / 100).toLocaleString('en-IN', { style: 'currency', currency: invoice.currency })}</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9.5px] rounded-md font-bold uppercase">PAID</span>
                          <button 
                            type="button"
                            onClick={() => alert("Downloading secure PDF receipt from DB record... Completed.")}
                            className="text-slate-500 hover:text-emerald-400 hover:bg-slate-900 p-1.5 rounded transition-all cursor-pointer"
                            title="Download Receipt"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </motion.div>
          )}

          {/* ==========================================
              TAB 6: SECURITY & PROFILE SETTINGS
              ========================================== */}
          {currentUser && activeTab === 'settings' && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto py-4 space-y-8"
              id="settings-console-tab"
            >
              <div className="space-y-1.5 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-3xl font-bold text-white font-sans">Officer Security Parameters</h2>
                </div>
                <p className="text-base text-slate-400">
                  Update your cryptographically signed identity settings and configure hardware-isolated enclave variables.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2.5">
                  Officer Identity Profile Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-base font-mono">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Officer Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-xl p-3 text-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Assigned Corporation / Entity</label>
                    <input
                      type="text"
                      required
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-xl p-3 text-slate-300"
                    />
                  </div>

                </div>

                <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 font-mono">
                    {currentUser.publicKey ? (
                      <span className="text-[9.5px] truncate max-w-sm block">
                        PublicKey: <strong className="text-indigo-400 select-all font-bold break-all">{currentUser.publicKey}</strong>
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="text-emerald-600 hover:bg-emerald-500 text-white font-mono text-base font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-40"
                  >
                    {isUpdatingProfile ? "Recalculating ZK keys..." : "Apply Profile Parameters"}
                  </button>
                </div>

                {profileUpdateSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3.5 text-center text-base font-mono font-bold animate-pulse">
                    Profile parameters updated and signed back to ledger.
                  </div>
                )}
              </form>

              {/* Cryptographic Proof Parameters */}
              <div className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2.5">
                  Consensus Proof Verification Variables
                </h3>

                <div className="space-y-4 font-mono text-base">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-300">Ephemeral Session Keys</p>
                      <p className="text-[10px] text-slate-500">Regenerate public signing credentials on each browser reload.</p>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold uppercase">ENABLED</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/50 pt-4">
                    <div>
                      <p className="font-bold text-slate-300">Enclave Core Sourcing Isolation</p>
                      <p className="text-[10px] text-slate-500">Run calculations strictly inside secure SGX/AMD hardware cells.</p>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold uppercase">HARDWARE FORCE</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ==========================================
              TAB 7: PROTOCOL HELP DESK
              ========================================== */}
          {currentUser && activeTab === 'help' && (
            <motion.div
              key="help-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto py-4 space-y-8"
              id="help-console-tab"
            >
              <div className="space-y-1.5 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-3xl font-bold text-white font-sans">Enclave Help Desk & Protocol Support</h2>
                </div>
                <p className="text-base text-slate-400">
                  Submit cryptographic support requests to DeCo-Supply system administrators or browse the decentralization protocol wiki.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Submit ticket form */}
                <form onSubmit={handleSubmitTicket} className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-5 space-y-4 md:col-span-1 h-fit text-base font-mono">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                    Open Support Request
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500">Inquiry Subject:</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Entropy warning"
                      className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg p-2 text-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500">Inquiry Category:</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg p-2 text-slate-300 cursor-pointer"
                    >
                      <option value="protocol">Sourcing Protocol</option>
                      <option value="cryptography">Zero Knowledge Cryptography</option>
                      <option value="billing">Plan & Billing</option>
                      <option value="hardware">Hardware Enclaves</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500">Priority Level:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["low", "medium", "high"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setTicketPriority(p)}
                          className={`py-1.5 border rounded-lg text-center font-bold font-mono transition-all uppercase text-[9px] cursor-pointer ${
                            ticketPriority === p
                              ? p === "high"
                                ? "bg-rose-500/10 border-rose-500 text-rose-400"
                                : p === "medium"
                                ? "bg-amber-500/10 border-amber-500 text-amber-400"
                                : "bg-emerald-500/10 text-emerald-500 text-emerald-400"
                              : "bg-slate-900 border-slate-800 text-slate-500"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500">Description Message:</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Provide full session details or ledger hash context..."
                      className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-lg p-2 text-slate-300 font-mono resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-emerald-600 hover:bg-emerald-500 text-white font-mono text-base font-bold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer text-center"
                  >
                    Transmit Support Inquiry
                  </button>
                </form>

                {/* My Active Tickets history list */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 font-mono">
                      Your Secure Tickets ({ticketsList.length})
                    </h3>

                    {ticketsList.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-base font-mono">
                        No active support tickets. All network nodes operating normally.
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {ticketsList.map((t: any) => (
                          <div key={t.id} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-2 font-mono text-base">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-emerald-400 font-bold">{t.id}</span>
                              <span className={`px-2 py-0.5 rounded-md font-bold ${
                                t.status === "RESOLVED"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 border-amber-500 text-amber-400"
                              }`}>
                                {t.status}
                              </span>
                            </div>
                            <h4 className="font-bold text-white">{t.subject}</h4>
                            <p className="text-[11px] text-slate-400 leading-normal">{t.message}</p>
                            
                            {t.adminResponse && (
                              <div className="bg-[#0F0F12] border-l-2 border-emerald-500 p-2.5 rounded-r-lg text-[10.5px] text-slate-400 mt-2">
                                <span className="font-bold text-emerald-400 uppercase tracking-wide block text-[9px] mb-1">
                                  System Node Operator:
                                </span>
                                {t.adminResponse}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FAQ Quick Links */}
                  <div className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-5 space-y-4 text-base">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 font-mono">
                      Frequently Answered Core mechanics
                    </h3>
                    
                    <div className="space-y-4 font-mono leading-relaxed">
                      <div>
                        <h4 className="font-bold text-slate-300">How do zero-knowledge negotiations prevent margin leakage?</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Neither the client nor the competing vendor agents ever exchange minimum price thresholds. The zero-trust protocol runs range proof comparisons dynamically using multi-round encrypted variables. Only the final settlement price is written to the ledger.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-300">Are my credits consumed if negotiations fail?</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          No. Proof credits are only deducted from your active subscription balance upon successful contract commitment and signature execution.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              TAB 8: FEEDBACK HUB
              ========================================== */}
          {currentUser && activeTab === 'feedback' && (
            <motion.div
              key="feedback-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto py-4 space-y-8"
              id="feedback-console-tab"
            >
              <div className="space-y-1.5 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-3xl font-bold text-white font-sans">Consensus Feedback Hub</h2>
                </div>
                <p className="text-base text-slate-400">
                  Help us tune procurement protocols. Send feedback directly to engineers operating the secure enclaves.
                </p>
              </div>

              <form onSubmit={handleSubmitFeedback} className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-6 space-y-6 text-base font-mono">
                <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
                  Submit Platform Feedback
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Feedback Category</label>
                    <select
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-xl p-3 text-slate-300 cursor-pointer"
                    >
                      <option value="algorithm">Sourcing Algorithm Tuning</option>
                      <option value="feature">New Feature Request</option>
                      <option value="bug">Protocol Bug / Slip</option>
                      <option value="praise">Interface Praise</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Protocol Usability Rating</label>
                    <div className="flex items-center gap-2.5 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className={`text-2xl transition-all transform hover:scale-110 cursor-pointer ${
                            star <= feedbackRating ? "text-amber-400" : "text-slate-700"
                          }`}
                        >
                          &#9733;
                        </button>
                      ))}
                      <span className="text-base font-bold text-slate-400 ml-1">({feedbackRating}/5 Stars)</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Inquiry / Message</label>
                    <textarea
                      required
                      rows={5}
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Describe your user experience, algorithm suggestions, or feature requests..."
                      className="w-full bg-slate-900 border border-slate-800 focus:text-emerald-500 focus:outline-none rounded-xl p-3 text-slate-300 font-mono resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between">
                  <div className="text-[9.5px] text-slate-500">
                    Your feedback is signed securely using key seed credentials.
                  </div>
                  <button
                    type="submit"
                    className="text-emerald-600 hover:bg-emerald-500 text-white font-mono text-base font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                  >
                    Transmit Feedback Message
                  </button>
                </div>

                {feedbackSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3.5 text-center text-base font-mono font-bold animate-pulse">
                    Feedback transmitted successfully and stored on the local node dashboard.
                  </div>
                )}
              </form>

              {/* User past feedbacks list */}
              <div className="bg-[#0F0F12] border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 font-mono">
                  Your Submitted Feedback History ({userFeedbackList.length})
                </h3>

                {userFeedbackList.length === 0 ? (
                  <p className="text-center py-6 text-slate-500 font-mono text-base">
                    You haven't submitted any feedback on this local node yet.
                  </p>
                ) : (
                  <div className="space-y-3.5 text-base font-mono">
                    {userFeedbackList.map((f: any) => (
                      <div key={f.id} className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-emerald-400 uppercase font-bold text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            {f.category}
                          </span>
                          <span className="text-slate-500">{new Date(f.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-300 leading-normal">{f.message}</p>
                        <div className="text-[10px] text-amber-400 font-bold">
                          Rating: {"\u2605".repeat(f.rating)}{"\u2606".repeat(5 - f.rating)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* ==========================================
              TAB 9: DECENTRALIZED ADMIN CONTROL PORTAL
              ========================================== */}
          {currentUser && activeTab === 'admin' && (currentUser.role === "Admin" || currentUser.role === "System Administrator (Admin)") && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col justify-start"
            >
              <AdminPortal 
                currentUser={currentUser} 
                onSignOut={handleSignOut} 
                vendorA={vendorA}
                vendorB={vendorB}
                onUpdateVendors={(vA, vB) => {
                  setVendorA(vA);
                  setVendorB(vB);
                }}
              />
            </motion.div>
          )}

          {/* ==========================================
              SECURE AUTHORIZATION GATE FOR RESTRICTED TABS
              ========================================== */}
          {!currentUser && activeTab !== 'overview' && (
            <motion.div
              key="restricted-auth-gate"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto py-8 text-center space-y-6"
              id="secure-gate-tab-prompt"
            >
              <div className="bg-[#0F0F12] border border-slate-800/80 p-8 rounded-3xl shadow-2xl space-y-5">
                <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider font-mono">Restricted Enclave Workspace</h3>
                  <p className="text-base text-slate-400 leading-normal">
                    This module contains highly classified multi-agent systems and real-time ledger databases. You must authenticate as an authorized Procurement Officer to interact with this tab.
                  </p>
                </div>
                <div className="border-t border-slate-800/60 pt-6 text-left">
                  <DuoLoginGate onAuthSuccess={handleAuthSuccess} />
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Futuristic status line */}
      <footer className="h-10 bg-[#111114] border-t border-slate-800 px-8 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-medium font-mono">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 text-emerald-500 rounded-full"></span>
            <span>Latency: 14ms</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-500">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span>Zero-Trust Protocol: Active</span>
          </div>
        </div>
        <div className="hidden md:flex gap-6">
          <span>Vendor Margin Protection: Grade A+</span>
          <span>Zero Knowledge Consensus Validated</span>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
