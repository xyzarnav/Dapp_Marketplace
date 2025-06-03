import { ethers } from 'ethers';
import MarketplaceABI from './MarketplaceABI.json';
import FreelanceABI from './FreelanceABI.json';

// Contract addresses (would come from environment variables in a real app)
const MARKETPLACE_ADDRESS = '0x123...'; // Replace with your actual contract address
const FREELANCE_ADDRESS = '0x456...'; // Replace with your actual contract address

// Initialize providers and contracts
export const getWeb3Provider = async () => {
  // Check if MetaMask is installed
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Using ethers v6 syntax for creating a provider
      return new ethers.BrowserProvider(window.ethereum);
    } catch (error) {
      console.log(error);
      
      throw new Error('User denied account access');
    }
  } else {
    throw new Error('Please install MetaMask');
  }
};

export const getMarketplaceContract = async (withSigner = false) => {
  const provider = await getWeb3Provider();
  const contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    MarketplaceABI,
    withSigner ? await provider.getSigner() : provider
  );
  return contract;
};

export const getFreelanceContract = async (withSigner = false) => {
  const provider = await getWeb3Provider();
  const contract = new ethers.Contract(
    FREELANCE_ADDRESS,
    FreelanceABI,
    withSigner ? await provider.getSigner() : provider
  );
  return contract;
};

// Helper functions for interacting with contracts
export const connectWallet = async () => {
  try {
    const provider = await getWeb3Provider();
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return { address, provider };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
