import { ethers } from 'ethers';

// Minimal ERC721 ABI for NFT interactions
const ERC721ABI = [
  'function ownerOf(uint256 tokenId) view returns (address owner)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function setApprovalForAll(address operator, bool approved)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function tokenURI(uint256 tokenId) view returns (string)'
];

/**
 * Get an ERC721 contract instance
 */
export const getNFTContract = (provider: ethers.ContractRunner, contractAddress: string) => {
  return new ethers.Contract(contractAddress, ERC721ABI, provider);
};

/**
 * Check if the marketplace contract is approved to transfer NFTs
 */
export const isMarketplaceApproved = async (
  provider: ethers.ContractRunner, 
  nftContractAddress: string, 
  ownerAddress: string, 
  marketplaceAddress: string
): Promise<boolean> => {
  const nftContract = getNFTContract(provider, nftContractAddress);
  return await nftContract.isApprovedForAll(ownerAddress, marketplaceAddress);
};

/**
 * Approve the marketplace contract to transfer NFTs
 */
export const approveMarketplace = async (
  signer: ethers.Signer,
  nftContractAddress: string,
  marketplaceAddress: string
): Promise<ethers.TransactionResponse> => {
  const nftContract = getNFTContract(signer, nftContractAddress);
  return await nftContract.setApprovalForAll(marketplaceAddress, true);
};

/**
 * Get token URI for an NFT
 */
export const getTokenURI = async (
  provider: ethers.ContractRunner,
  nftContractAddress: string,
  tokenId: number
): Promise<string> => {
  const nftContract = getNFTContract(provider, nftContractAddress);
  return await nftContract.tokenURI(tokenId);
};
