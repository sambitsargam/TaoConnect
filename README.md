# TaoConnect

A **stylish**, **responsive** single-page React application that allows users to interact with the **Tao Private Network (TPN)**—a decentralized, blockchain‑incentivized VPN infrastructure powered by WireGuard.  

Users can:
- Select a **validator node** (Axon endpoint) from the network
- Choose a **geographic region** or any available location
- Lease a WireGuard configuration for a specified duration
- Download and connect using standard VPN clients
- Get **expiry alerts** before their lease ends

---

## 📖 Blockchain & Decentralization

TPN is built on a blockchain‑driven incentive model:  

1. **Miners & Validators**  
   - **Miners** operate WireGuard VPN servers (called _nodes_) and advertise them on the TPN blockchain.  
   - Each node is bonded and validated on-chain by a set of **blockchain validators** (the Axons you select in this app).

2. **Subnet Incentives**  
   - Miners earn **TPN tokens** as rewards for providing bandwidth, uptime, and geographic diversity.  
   - Rewards are distributed per‑epoch via smart contracts, governed by network stake and performance.

3. **On‑Chain Config Discovery**  
   - Validator endpoints (e.g. `185.189.44.166:3000`) serve as _front-ends_ to the on-chain registry.  
   - When you fetch `/api/config/countries`, you’re querying a snapshot of the on-chain **node registry** filtered by region.  
   - Leasing a config (`/api/config/new`) creates a short‑lived session entry recorded off‑chain but reconciled on-chain for accountability and billing (once payments are enabled).

4. **Trustless Verification**  
   - All leases, durations, and node‑performance metrics (latency, uptime) are verifiable on the TPN blockchain explorer.  
   - Future versions will support on-chain proofs of service (e.g., **bandwidth merkle proofs**) to prevent fraud.

By connecting through this app, you’re tapping directly into a **decentralized marketplace** for VPN bandwidth, secured by blockchain consensus and token‑based incentives.

---

## 🚀 Features

- **Validator Dropdown**  
  Dynamically lists live Axon endpoints (blockchain validators) hosting VPN nodes.

- **Country/Region Picker**  
  Queries the on-chain node registry for available geographies, ensuring true decentralization.

- **Lease Duration & Format**  
  Configure your WireGuard session’s lifetime and choose between raw text or JSON (with metadata).

- **Expiry Alerts**  
  Browser notifications scheduled _before_ your lease expires—no more unexpected drops.

- **Local Persistence**  
  Remembers your last choices in `localStorage` for instant re‑connection.

- **Dark Mode & Animations**  
  Modern UI with Tailwind CSS, Framer Motion transitions, and a toggle for day/night.

---

## 🛠️ Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/taoconnect.git
   cd taoconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Validators**  
   Update `src/constants.js` with any additional Axon endpoints if desired.

4. **Run in Development**
   ```bash
   npm run dev   
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks (e.g. useNotifier)
│   ├── pages/             # Main App page
│   ├── constants.js       # Validator list & defaults
│   ├── utils/             # API wrappers (fetchCountries, leaseConfig)
│   ├── App.jsx            # Root component
│   └── index.js           # React entrypoint
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS setup
├── package.json
└── README.md
```

---

## 🔗 Useful Links

- **TPN Whitepaper & Tokenomics**: https://docs.tpn.network/whitepaper  
- **API Reference**: https://docs.tpn.network/api-reference  
- **Blockchain Explorer**: https://explorer.tpn.network  
- **Discord (Taufu)**: https://discord.gg/tpn

---

## 📜 License

This project is open‑source under the **MIT License** — see [LICENSE.md](LICENSE.md) for details.

---

*Built with ❤️ by the TaoConnect community*

