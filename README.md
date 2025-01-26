# 🚀 Blockchain-Powered Crowdfunding Platform for Angel Investors

A decentralized crowdfunding platform built on blockchain technology that connects entrepreneurs with angel investors, enabling secure and transparent fundraising through smart contracts and ERC20 tokens.

## Project Demo Vedio 👇
[![Eth Wallet Demo Video](https://img.youtube.com/vi/-zVqw-i94ac/0.jpg)](https://youtu.be/-zVqw-i94ac?si=aYbEvNfsMOHZLS6q)


## ✨ Features

- 🔗 Smart contract-based crowdfunding campaigns
- 💎 ERC20 token creation and management
- 🌐 Web3 integration for blockchain interactions
- 🔒 Secure transaction handling
- 📊 Real-time campaign tracking
- 🎯 Angel investor dashboard
- 💫 User-friendly interface built with Next.js

## 🛠️ Tech Stack

- **Frontend**: Next.js, TailwindCSS, Web3.js
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Hardhat, Ethereum, Solidity
- **Development Tools**: TypeScript, ESLint

## 🚦 Prerequisites

- Node.js (v14.0.0 or later)
- PostgreSQL
- MetaMask wallet
- Git

## 🔧 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Blockchain-Powered-CrowdFunding-Platform-for-angel-investor.git
cd Blockchain-Powered-CrowdFunding-Platform-for-angel-investor/TRY/my-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the TRY/my-app directory:
```
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
NEXT_PUBLIC_RPC_URL="your_ethereum_rpc_url"
PRIVATE_KEY="your_wallet_private_key"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Deploy smart contracts**
```bash
cd ../Hardhat\ Setup
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

6. **Start the development server**
```bash
cd ../TRY/my-app
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
TRY/my-app/
├── components/       # React components
├── pages/           # Next.js pages and API routes
├── prisma/          # Database schema and migrations
├── contracts/       # Smart contracts
├── public/          # Static assets
└── styles/          # TailwindCSS styles
```

## 🔍 Smart Contract Development

The smart contracts are located in the `Hardhat Setup` directory. To work with them:

1. Start a local Hardhat node:
```bash
npx hardhat node
```

2. Deploy contracts to the local network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Run tests:
```bash
npx hardhat test
```

## 🌟 Features in Detail

- **Campaign Creation**: Entrepreneurs can create fundraising campaigns by deploying smart contracts
- **Token Generation**: Automatic ERC20 token creation for each campaign
- **Investment Tracking**: Real-time tracking of investments and token distributions
- **Smart Contract Integration**: Secure and transparent fund management
- **User Dashboard**: Comprehensive dashboard for both investors and entrepreneurs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Thanks to the Ethereum community for providing excellent development tools
- Hardhat team for the amazing development environment
- OpenZeppelin for secure smart contract templates

## 📞 Contact

For any queries or suggestions, please create an issue in the repository or reach out to the maintainers.

---
⭐ Don't forget to star this repository if you found it helpful!
