import { ethers } from "ethers";
import type { Signer, Provider } from "ethers";
import FreelanceABI from "./FreelanceABI.json";
import MarketPlaceABI from "./MarketplaceABI.json";

const USDT_TOKEN = import.meta.env.REACT_APP_USDT_ADDRESS || import.meta.env.VITE_USDT_ADDRESS;
const FREELANCE_ADDRESS = import.meta.env.REACT_APP_FREELANCE_ADDRESS || import.meta.env.VITE_FREELANCE_ADDRESS;
const MARKETPLACE_ADDRESS = import.meta.env.REACT_APP_MARKETPLACE_ADDRESS || import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;

// Validate contract addresses
if (!USDT_TOKEN) throw new Error("USDT contract address is not defined in environment variables.");
if (!FREELANCE_ADDRESS) throw new Error("Freelance contract address is not defined in environment variables.");
if (!MARKETPLACE_ADDRESS) throw new Error("Marketplace contract address is not defined in environment variables.");

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)",
  "function symbol() public view returns (string)",
  "function name() public view returns (string)",
];

export const getFreelanceContract = (
  signerOrProvider: Signer | Provider
): ethers.Contract => {
  return new ethers.Contract(
    FREELANCE_ADDRESS,
    FreelanceABI as ethers.InterfaceAbi,
    signerOrProvider
  );
};

export const getMarketplaceContract = (
  signerOrProvider: Signer | Provider
): ethers.Contract => {
  return new ethers.Contract(
    MARKETPLACE_ADDRESS,
    MarketPlaceABI as ethers.InterfaceAbi,
    signerOrProvider
  );
};

export const getUSDTContract = (
  signerOrProvider: Signer | Provider
): ethers.Contract => {
  return new ethers.Contract(USDT_TOKEN, ERC20_ABI, signerOrProvider);
};

// Helper function to format USDT amounts
export const formatUSDT = (amount: bigint, decimals: number = 6): string => {
  return ethers.formatUnits(amount, decimals);
};

// Helper function to parse USDT amounts
export function parseUSDT(amount: string): bigint {
  // USDT has 6 decimals
  return ethers.parseUnits(amount, 6);
}
