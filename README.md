# 🛒 Dapp Marketplace & Freelancing Platform

A decentralized marketplace and freelancing platform built on Ethereum, enabling secure peer-to-peer transactions without intermediaries.

## ⚡ Features

- **Decentralized Marketplace** - Buy/sell products with crypto payments
- **Freelancing Platform** - Connect clients with service providers
- **Smart Contract Escrow** - Secure automated payments
- **Reputation System** - User ratings and reviews
- **Multi-wallet Support** - MetaMask, WalletConnect integration

## 🛠️ Tech Stack

**Frontend:** React 18 • TypeScript • Vite • Tailwind CSS • Ethers.js  
**Blockchain:** Solidity • Hardhat • OpenZeppelin • IPFS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet

### Installation
```bash
# Clone repository
git clone https://github.com/xyzarnav/Dapp_Marketplace.git
cd Dapp_Marketplace

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your API keys to .env
```

### Development
```bash
# Start local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Start frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
├── contracts/          # Smart contracts
│   ├── Marketplace.sol
│   ├── Freelance.sol
│   └── Escrow.sol
├── scripts/           # Deploy scripts
├── test/             # Contract tests
├── src/              # Frontend
│   ├── components/
│   ├── pages/
│   └── hooks/
└── hardhat.config.js
```

## 🔧 Smart Contracts

### Core Functions

**Marketplace**
- `createListing()` - List products for sale
- `purchaseProduct()` - Buy listed products
- `completePurchase()` - Finalize transactions

**Freelance**
- `createProject()` - Post freelance jobs
- `submitProposal()` - Submit work proposals
- `acceptProposal()` - Accept freelancer bids

## 🧪 Commands

```bash
# Test contracts
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify contracts
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# Frontend tests
npm test
```

## 🌐 Environment Variables

```env
VITE_INFURA_PROJECT_ID=your_infura_id
VITE_PINATA_API_KEY=your_pinata_key
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## 🚀 Deployment

The platform supports deployment to:
- **Ethereum Mainnet** - Production environment
- **Sepolia Testnet** - Testing environment
- **Polygon** - Layer 2 scaling solution

## 🔐 Security Features

- Reentrancy protection
- Access control mechanisms
- Input validation
- Multi-signature support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

Built with ❤️ using React, TypeScript, Vite & Solidity
