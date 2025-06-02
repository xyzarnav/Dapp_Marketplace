import { ethers } from "ethers";
import type { Signer, Provider } from "ethers";
import FreelanceABI from "./FreelanceABI.json";
import MarketPlaceABI from "./MarketplaceABI.json";

const USDT_TOKEN = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const FREELANCE_ADDRESS = "0xA605403AF85d75c40314A91Cb6F8D64136A5c4fe";
const MARKETPLACE_ADDRESS = "0x5E45093075f938c49ac111dCfCC1e61670aC029f";

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
export const parseUSDT = (amount: string, decimals: number = 6): bigint => {
  return ethers.parseUnits(amount, decimals);
};
