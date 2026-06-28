# DeCo-Supply Network

A fully decentralized, zero-knowledge multi-agent consensus protocol designed for enterprise procurement and supply chain negotiations.

## Architecture

* **Frontend**: React (Vite), Tailwind CSS, Framer Motion
* **Backend**: Node.js, Express, TypeScript
* **Database**: SQLite
* **Payment Gateway**: Razorpay Integration

## Features

- 🔐 **Zero-Knowledge Proofs**: Vendor margins and bid strategies remain cryptographically sealed.
- 🤖 **Multi-Agent Consensus**: Autonomous buyer and vendor agents negotiate independently.
- 💳 **Billing & Subscriptions**: Live Razorpay integration with secure server-side signature verification.
- 📊 **Consensus Ledger**: Signed purchase orders are committed to an immutable ledger.

## Local Development

### Prerequisites
- Node.js (v18+ recommended)
- Razorpay API Keys

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables. Create a `.env` file in the root directory:
```env
AICOO_API_KEY=your_aicoo_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

3. Start the development server:
```bash
npm run dev
```

## Security

This project uses hardware-isolated execution concepts. Never commit your `.env` or `.db` files to public repositories.
