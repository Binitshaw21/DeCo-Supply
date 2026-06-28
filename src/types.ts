export interface VendorData {
  name: string;
  inventory: number;
  publicPrice: number;
  minPrice: number;
}

export interface NegotiationParams {
  itemDescription: string;
  targetQuantity: number;
  maxBudget: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  actor: 'system' | 'router' | 'buyer' | 'vendor_a' | 'vendor_b';
  actorName: string;
  type: 'info' | 'broadcast' | 'thinking' | 'proposal' | 'counter' | 'agreement' | 'crypto';
  message: string;
  meta?: any;
}

export interface PurchaseOrder {
  id: string;
  buyerName: string;
  vendorName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  savings: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  cryptographicHash: string;
  signedAt: string;
}

export interface NegotiationResult {
  status: 'SUCCESS' | 'FAILED';
  winner?: 'Vendor A' | 'Vendor B';
  finalUnitPrice?: number;
  totalCost?: number;
  savings?: number;
  logs: LogEntry[];
  purchaseOrder?: PurchaseOrder;
  roundsCount: number;
}

export interface User {
  email: string;
  fullName: string;
  companyName: string;
  role: string;
  publicKey: string;
  privateKeySeed: string;
  registeredAt: string;
}

export interface UserInteraction {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  action: string;
  details: string;
  type: "auth" | "negotiation" | "ledger" | "settings" | "feedback" | "billing" | "help" | "admin";
}

export interface UserFeedback {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  companyName: string;
  role: string;
  category: "feature" | "bug" | "praise" | "algorithm";
  rating: number;
  message: string;
  status: "pending" | "reviewed" | "backlog";
  adminResponse?: string;
}

export function logUserInteraction(
  userEmail: string,
  userName: string,
  action: string,
  details: string,
  type: "auth" | "negotiation" | "ledger" | "settings" | "feedback" | "billing" | "help" | "admin"
) {
  try {
    const stored = localStorage.getItem("deco_supply_interactions");
    const list: any[] = stored ? JSON.parse(stored) : [];
    const interaction = {
      id: "int_" + Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      userEmail,
      userName,
      action,
      details,
      type
    };
    list.unshift(interaction);
    if (list.length > 100) list.pop();
    localStorage.setItem("deco_supply_interactions", JSON.stringify(list));
  } catch (e) {
    console.error("Failed to log interaction:", e);
  }
}

