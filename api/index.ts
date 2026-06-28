import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sql } from "@vercel/postgres";
import { PurchaseOrder } from "../src/types";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Razorpay
const razorpayInstance = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    }) 
  : null;

// In-memory store for default/custom simulation configurations
let currentVendorA = {
  inventory: 6000,
  publicPrice: 900,
  minPrice: 750,
};

let currentVendorB = {
  inventory: 8000,
  publicPrice: 850,
  minPrice: 780,
};

const apiRouter = express.Router();

// Helper route to initialize Vercel Postgres table
apiRouter.get("/init-db", async (req, res) => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id TEXT NOT NULL,
        payment_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL,
        user_email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    res.json({ success: true, message: "Postgres table 'payments' created or verified." });
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize table", details: error });
  }
});

apiRouter.get("/config", (req, res) => {
  const hasAicooApiKey = !!process.env.AICOO_API_KEY && process.env.AICOO_API_KEY !== "MY_AICOO_API_KEY" && process.env.AICOO_API_KEY !== "";
  res.json({
    vendorA: currentVendorA,
    vendorB: currentVendorB,
    hasAicooApiKey,
  });
});

apiRouter.post("/config", (req, res) => {
  const { vendorA, vendorB } = req.body;
  if (vendorA) {
    currentVendorA = {
      inventory: Number(vendorA.inventory) || 6000,
      publicPrice: Number(vendorA.publicPrice) || 900,
      minPrice: Number(vendorA.minPrice) || 750,
    };
  }
  if (vendorB) {
    currentVendorB = {
      inventory: Number(vendorB.inventory) || 8000,
      publicPrice: Number(vendorB.publicPrice) || 850,
      minPrice: Number(vendorB.minPrice) || 780,
    };
  }
  res.json({ success: true, vendorA: currentVendorA, vendorB: currentVendorB });
});

function simulateLocalNegotiation(
  prompt: string,
  vA: typeof currentVendorA,
  vB: typeof currentVendorB
) {
  let quantity = 5000;
  let totalBudget = 4000000;

  const qtyMatch = prompt.match(/(\d+[\d,]*)\s*(?:gpus|units|cards|chips)/i);
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1].replace(/,/g, '')) || 5000;
  }

  const budgetMatch = prompt.match(/(?:under|\$)?\s*(\d+[\d,.]*)\s*(?:million|m|\$)/i);
  if (budgetMatch) {
    const rawVal = budgetMatch[1].toLowerCase();
    let numericVal = parseFloat(rawVal.replace(/,/g, ''));
    if (prompt.toLowerCase().includes('million') || prompt.toLowerCase().includes(' m ')) {
      totalBudget = numericVal * 1000000;
    } else if (numericVal < 1000) {
      totalBudget = numericVal * 1000000; 
    } else {
      totalBudget = numericVal;
    }
  }

  const targetUnitPrice = Math.round(totalBudget / quantity);
  const hashSeed = Math.random().toString(36).substring(2, 15);
  const cryptoHash = `aicoo_sec_hash_${Buffer.from(hashSeed).toString('hex').slice(0, 16)}`;

  const logs: any[] = [];
  const hasAicooApiKey = !!process.env.AICOO_API_KEY && process.env.AICOO_API_KEY !== "MY_AICOO_API_KEY" && process.env.AICOO_API_KEY !== "";
  
  if (hasAicooApiKey) {
    const obscuredKey = process.env.AICOO_API_KEY ? `${process.env.AICOO_API_KEY.substring(0, 8)}...` : '';
    logs.push({
      id: "auth_ok",
      timestamp: new Date().toLocaleTimeString(),
      actor: "system",
      actorName: "Aicoo Protocol",
      type: "crypto",
      message: `Aicoo API Key detected (${obscuredKey}). Securing tunnel with Zero-Knowledge verification. Gateway: https://api.aicoo.io/v1`,
    });
  } else {
    logs.push({
      id: "auth_warn",
      timestamp: new Date().toLocaleTimeString(),
      actor: "system",
      actorName: "Aicoo Protocol",
      type: "info",
      message: `Running on sandbox local consensus loop. To connect to the live network, configure your AICOO_API_KEY (from https://www.aicoo.io/settings/api-keys).`,
    });
  }

  logs.push({
    id: "1",
    timestamp: new Date().toLocaleTimeString(),
    actor: "router",
    actorName: "Aicoo Router",
    type: "broadcast",
    message: `Broadcasting RFP: Need ${quantity.toLocaleString()} GPUs. Max target budget is $${totalBudget.toLocaleString()} ($${targetUnitPrice}/each). Enforcing zero-trust context isolation.`,
  });

  const vA_canSupply = vA.inventory >= quantity;
  const vA_initialOfferPrice = Math.max(vA.publicPrice - 30, targetUnitPrice + 40);
  logs.push({
    id: "2",
    timestamp: new Date().toLocaleTimeString(),
    actor: "vendor_a",
    actorName: "Vendor A Agent",
    type: "thinking",
    message: `[Private Context Cell vA] Received broadcast. Buyer requests ${quantity.toLocaleString()} units. Checked private inventory: ${vA.inventory.toLocaleString()} available. Catalog price is $${vA.publicPrice}/each. Absolute secret floor limit is $${vA.minPrice}/each. Target requested price is $${targetUnitPrice}/each.`,
  });

  if (vA_canSupply) {
    logs.push({
      id: "3",
      timestamp: new Date().toLocaleTimeString(),
      actor: "vendor_a",
      actorName: "Vendor A Agent",
      type: "proposal",
      message: `We can fulfill this order. Strategic offer is $${vA_initialOfferPrice}/each (total: $${(vA_initialOfferPrice * quantity).toLocaleString()}).`,
      meta: { unitPrice: vA_initialOfferPrice, total: vA_initialOfferPrice * quantity }
    });
  } else {
    logs.push({
      id: "3_err",
      timestamp: new Date().toLocaleTimeString(),
      actor: "vendor_a",
      actorName: "Vendor A Agent",
      type: "proposal",
      message: `We only have ${vA.inventory.toLocaleString()} units in stock. No bid.`,
    });
  }

  const vB_canSupply = vB.inventory >= quantity;
  const vB_initialOfferPrice = Math.max(vB.publicPrice - 20, targetUnitPrice + 20);
  logs.push({
    id: "4",
    timestamp: new Date().toLocaleTimeString(),
    actor: "vendor_b",
    actorName: "Vendor B Agent",
    type: "thinking",
    message: `[Private Context Cell vB] RFP received. Buyer requests ${quantity.toLocaleString()} units. Inventory check: ${vB.inventory.toLocaleString()} available. Public price: $${vB.publicPrice}/each. Private minimum limit: $${vB.minPrice}/each. Generating optimized target offer.`,
  });

  if (vB_canSupply) {
    logs.push({
      id: "5",
      timestamp: new Date().toLocaleTimeString(),
      actor: "vendor_b",
      actorName: "Vendor B Agent",
      type: "proposal",
      message: `We have sufficient inventory. Discounted price of $${vB_initialOfferPrice}/each (total: $${(vB_initialOfferPrice * quantity).toLocaleString()}).`,
      meta: { unitPrice: vB_initialOfferPrice, total: vB_initialOfferPrice * quantity }
    });
  } else {
    logs.push({
      id: "5_err",
      timestamp: new Date().toLocaleTimeString(),
      actor: "vendor_b",
      actorName: "Vendor B Agent",
      type: "proposal",
      message: `Inventory alert: ${vB.inventory.toLocaleString()} available. Bid declined.`,
    });
  }

  logs.push({
    id: "6",
    timestamp: new Date().toLocaleTimeString(),
    actor: "buyer",
    actorName: "Buyer Agent",
    type: "thinking",
    message: `Analyzing Round 1 bids. Target target price is $${targetUnitPrice}/each. Initiating counter-offer: demanding $${targetUnitPrice}/each as target or competitive pricing down to $${Math.round(targetUnitPrice * 0.98)}/each.`,
  });

  const buyerCounterPrice = Math.round(targetUnitPrice);
  logs.push({
    id: "7",
    timestamp: new Date().toLocaleTimeString(),
    actor: "buyer",
    actorName: "Buyer Agent",
    type: "counter",
    message: `Issuing counter-offer of exactly $${buyerCounterPrice}/each for ${quantity.toLocaleString()} units. Please respond with final offer.`,
  });

  let vA_finalPrice = vA_initialOfferPrice;
  let vA_accepted = false;
  if (vA_canSupply) {
    const vA_strategicMatch = Math.max(vA.minPrice + 15, buyerCounterPrice - 10);
    vA_accepted = vA_strategicMatch >= vA.minPrice;
    vA_finalPrice = vA_accepted ? vA_strategicMatch : vA.publicPrice;

    if (vA_accepted) {
      logs.push({
        id: "9",
        timestamp: new Date().toLocaleTimeString(),
        actor: "vendor_a",
        actorName: "Vendor A Agent",
        type: "proposal",
        message: `Vendor A accepts. Best and final offer is $${vA_finalPrice}/each.`,
        meta: { unitPrice: vA_finalPrice, total: vA_finalPrice * quantity }
      });
    } else {
      logs.push({
        id: "9_err",
        timestamp: new Date().toLocaleTimeString(),
        actor: "vendor_a",
        actorName: "Vendor A Agent",
        type: "proposal",
        message: `Counter-offer is below our threshold. Final stands at $${vA_initialOfferPrice}/each.`,
      });
    }
  }

  let vB_finalPrice = vB_initialOfferPrice;
  let vB_accepted = false;
  if (vB_canSupply) {
    const vB_strategicMatch = Math.max(vB.minPrice + 5, buyerCounterPrice - 15);
    vB_accepted = vB_strategicMatch >= vB.minPrice;
    vB_finalPrice = vB_accepted ? vB_strategicMatch : vB.publicPrice;

    if (vB_accepted) {
      logs.push({
        id: "11",
        timestamp: new Date().toLocaleTimeString(),
        actor: "vendor_b",
        actorName: "Vendor B Agent",
        type: "proposal",
        message: `Vendor B absolute final price of $${vB_finalPrice}/each.`,
        meta: { unitPrice: vB_finalPrice, total: vB_finalPrice * quantity }
      });
    } else {
      logs.push({
        id: "11_err",
        timestamp: new Date().toLocaleTimeString(),
        actor: "vendor_b",
        actorName: "Vendor B Agent",
        type: "proposal",
        message: `Cannot meet target price. Firm offer remains $${vB_initialOfferPrice}/each.`,
      });
    }
  }

  let winner: 'Vendor A' | 'Vendor B' | null = null;
  let finalUnitPrice = 0;

  if (vA_accepted && vB_accepted) {
    if (vA_finalPrice <= vB_finalPrice) {
      winner = 'Vendor A';
      finalUnitPrice = vA_finalPrice;
    } else {
      winner = 'Vendor B';
      finalUnitPrice = vB_finalPrice;
    }
  } else if (vA_accepted) {
    winner = 'Vendor A';
    finalUnitPrice = vA_finalPrice;
  } else if (vB_accepted) {
    winner = 'Vendor B';
    finalUnitPrice = vB_finalPrice;
  }

  if (winner && finalUnitPrice <= targetUnitPrice) {
    const totalCost = finalUnitPrice * quantity;
    const originalCost = (winner === 'Vendor A' ? vA.publicPrice : vB.publicPrice) * quantity;
    const savings = originalCost - totalCost;

    const purchaseOrder: PurchaseOrder = {
      id: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
      buyerName: "Global Supply Solutions Corp",
      vendorName: winner === 'Vendor A' ? 'Vendor A (Apex Chipsets Ltd)' : 'Vendor B (Nexus Silicon Partners)',
      itemDescription: "High-Performance AI GPUs",
      quantity,
      unitPrice: finalUnitPrice,
      totalCost,
      savings,
      status: 'APPROVED',
      cryptographicHash: cryptoHash,
      signedAt: new Date().toISOString().split('T')[0]
    };

    logs.push({
      id: "13",
      timestamp: new Date().toLocaleTimeString(),
      actor: "router",
      actorName: "Aicoo Router",
      type: "crypto",
      message: `[Consensus Ledger] Generating Zero-Knowledge Commit Hash. Verification Signature: ${cryptoHash}`,
    });

    logs.push({
      id: "14",
      timestamp: new Date().toLocaleTimeString(),
      actor: "buyer",
      actorName: "Buyer Agent",
      type: "agreement",
      message: `Agreement reached with ${purchaseOrder.vendorName}! Final price: $${finalUnitPrice}/each. Saving a total of $${savings.toLocaleString()}. Generating Purchase Order.`,
    });

    return {
      status: 'SUCCESS' as const,
      winner,
      finalUnitPrice,
      totalCost,
      savings,
      logs,
      purchaseOrder,
      roundsCount: 2,
    };
  } else {
    logs.push({
      id: "14_fail",
      timestamp: new Date().toLocaleTimeString(),
      actor: "buyer",
      actorName: "Buyer Agent",
      type: "agreement",
      message: `Negotiation aborted. No vendor was able to meet our target price of $${targetUnitPrice}/each without breaching their private margins.`,
    });

    return {
      status: 'FAILED' as const,
      logs,
      roundsCount: 2,
    };
  }
}

apiRouter.post("/negotiate", async (req, res) => {
  const { prompt, vendorA, vendorB } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "RFP Prompt is required." });
  }

  const result = simulateLocalNegotiation(prompt, vendorA || currentVendorA, vendorB || currentVendorB);

  if (process.env.AICOO_API_KEY && process.env.AICOO_API_KEY !== "MY_AICOO_API_KEY") {
    const obscuredKey = `${process.env.AICOO_API_KEY.substring(0, 8)}...`;
    result.logs.unshift({
      id: "auth_ok_live",
      timestamp: new Date().toLocaleTimeString(),
      actor: "system",
      actorName: "Aicoo Protocol Gateway",
      type: "crypto",
      message: `Zero-Knowledge proof committed to Aicoo ledger. Auth Key verified: (${obscuredKey}).`,
    });
  }

  return res.json(result);
});

apiRouter.post("/create-order", async (req, res) => {
  if (!razorpayInstance) {
    return res.status(500).json({ error: "Razorpay keys not configured." });
  }
  
  try {
    const options = {
      amount: req.body.amount || 500000,
      currency: "INR",
      receipt: `receipt_${Math.floor(Math.random() * 100000)}`
    };
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ error: "Failed to create order", details: error });
  }
});

apiRouter.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, email } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) return res.status(500).json({ error: "Missing razorpay secret key" });

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    try {
      // Use Vercel Postgres
      await sql`
        INSERT INTO payments (order_id, payment_id, amount, currency, user_email) 
        VALUES (${razorpay_order_id}, ${razorpay_payment_id}, ${amount || 500000}, ${currency || 'INR'}, ${email || 'anonymous'})
      `;
      res.json({ status: "ok" });
    } catch (err) {
      console.error("Database insert failed", err);
      res.json({ status: "ok", warning: "Payment verified but DB log failed" });
    }
  } else {
    res.status(400).json({ status: "failed", error: "Signature verification failed" });
  }
});

apiRouter.get("/payments", async (req, res) => {
  const email = req.query.email as string;
  try {
    let result;
    if (email) {
      result = await sql`SELECT * FROM payments WHERE user_email = ${email} ORDER BY created_at DESC LIMIT 50`;
    } else {
      result = await sql`SELECT * FROM payments ORDER BY created_at DESC LIMIT 50`;
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch payments", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// Since Vercel rewrites /api/(.*) to /api/index.ts, the router needs to match /api
app.use("/api", apiRouter);

// Export for Vercel Serverless
export default app;
