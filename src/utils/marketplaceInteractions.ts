import { ethers } from 'ethers';
import { getMarketplaceContract, getUSDTContract } from './getContract';
import { approveMarketplace, isMarketplaceApproved } from './nftInteraction';
import { parseUSDT } from './getContract';

const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;
if (!MARKETPLACE_ADDRESS) {
  throw new Error("Marketplace contract address not configured (VITE_MARKETPLACE_CONTRACT_ADDRESS)");
}

/**
 * List an NFT in the marketplace
 */
export const createNFTListing = async (
  signer: ethers.Signer,
  nftContractAddress: string,
  tokenId: number,
  priceInUSDT: string
): Promise<{ success: boolean; listingId?: number; error?: string }> => {
  try {
    // Get marketplace contract
    const marketplaceContract = getMarketplaceContract(signer);
    const signerAddress = await signer.getAddress();
    
    // Convert price to USDT base units (6 decimals)
    const priceInWei = parseUSDT(priceInUSDT);
    
    // Check if marketplace is approved to transfer NFTs
    const isApproved = await isMarketplaceApproved(
      signer,
      nftContractAddress,
      signerAddress,
      MARKETPLACE_ADDRESS
    );
    
    // If not approved, request approval
    if (!isApproved) {
      const approveTx = await approveMarketplace(signer, nftContractAddress, MARKETPLACE_ADDRESS);
      await approveTx.wait();
    }
    
    // Create listing
    const tx = await marketplaceContract.createListing(
      nftContractAddress,
      tokenId,
      priceInWei
    );
    
    const receipt = await tx.wait();

    // cast logs so that `log` has a known fragment shape
    const typedLogs = receipt.logs as (ethers.Log & { fragment?: { name: string } })[];

    const listingCreatedEvent = typedLogs
      .filter(log => log.fragment?.name === 'ListingCreated')
      .map(log => marketplaceContract.interface.parseLog(log))[0];
    
    const listingId = listingCreatedEvent?.args?.listingId;
    return { success: true, listingId: Number(listingId) };
  } catch (error: unknown) {
    console.error('Error creating NFT listing:', error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
};

/**
 * Cancel an NFT listing
 */
export const cancelNFTListing = async (
  signer: ethers.Signer,
  listingId: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const marketplaceContract = getMarketplaceContract(signer);
    
    const tx = await marketplaceContract.cancelListing(listingId);
    await tx.wait();
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error cancelling listing:', error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
};

/**
 * Update the price of an NFT listing
 */
export const updateNFTListing = async (
  signer: ethers.Signer,
  listingId: number,
  newPriceInUSDT: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const marketplaceContract = getMarketplaceContract(signer);
    
    // Convert price to USDT base units (6 decimals)
    const newPriceInWei = parseUSDT(newPriceInUSDT);
    
    const tx = await marketplaceContract.updateListing(listingId, newPriceInWei);
    await tx.wait();
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error updating listing price:', error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
};

/**
 * Get user's NFT listings
 */
export const getUserListings = async (
  provider: ethers.Provider,
  userAddress: string
): Promise<number[]> => {
  try {
    const marketplaceContract = getMarketplaceContract(provider);
    const listingIds = await marketplaceContract.getListingsByUser(userAddress);
    return listingIds.map((id: bigint) => Number(id));
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return [];
  }
};

/**
 * Buy an NFT listing
 */
export const buyNFT = async (
  signer: ethers.Signer,
  listingId: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const marketplaceContract = getMarketplaceContract(signer);
    const usdtContract = getUSDTContract(signer);
    const signerAddress = await signer.getAddress();

    // fetch listing to get price
    const { price } = await marketplaceContract.listings(listingId);
    // check allowance
    const allowance: bigint = await usdtContract.allowance(
      signerAddress,
      MARKETPLACE_ADDRESS
    );
    if (allowance < price) {
      const approveTx = await usdtContract.approve(MARKETPLACE_ADDRESS, price);
      await approveTx.wait();
    }

    // now buy
    const tx = await marketplaceContract.buyItem(listingId);
    await tx.wait();
    return { success: true };
  } catch (error: unknown) {
    console.error('Error buying NFT:', error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
};

/**
 * Emergency withdraw function
 */
export const emergencyWithdraw = async (
  signer: ethers.Signer,
  tokenAddress: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const marketplaceContract = getMarketplaceContract(signer);
    
    // Call emergencyWithdraw function
    const tx = await marketplaceContract.emergencyWithdraw(tokenAddress);
    await tx.wait();
    
    return { success: true };
  } catch (error) {
    console.error("Emergency withdraw error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during emergency withdraw'
    };
  }
};

// Function to check if user is the contract owner
export const checkIsOwner = async (
  provider: ethers.Provider,
  userAddress: string
): Promise<boolean> => {
  try {
    const marketplaceContract = getMarketplaceContract(provider);
    const owner = await marketplaceContract.owner();
    return owner.toLowerCase() === userAddress.toLowerCase();
  } catch (error) {
    console.error("Error checking owner:", error);
    return false;
  }
};

// Function to get token balance of the marketplace contract
export const getContractTokenBalance = async (
  provider: ethers.Provider,
  tokenAddress: string
): Promise<string> => {
  try {
    const marketplaceAddress = import.meta.env.REACT_APP_MARKETPLACE_ADDRESS || 
                              import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;
    
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
      ],
      provider
    );
    
    const balance = await tokenContract.balanceOf(marketplaceAddress);
    const decimals = await tokenContract.decimals();
    
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error("Error getting token balance:", error);
    return "0";
  }
};
