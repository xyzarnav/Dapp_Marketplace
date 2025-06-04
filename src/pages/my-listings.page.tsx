import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getUserListings, cancelNFTListing, updateNFTListing, emergencyWithdraw, checkIsOwner, getContractTokenBalance } from '../utils/marketplaceInteractions';
import { getMarketplaceContract } from '../utils/getContract';
import { formatUSDT } from '../utils/getContract';

interface NFTListing {
  listingId: number;
  seller: string;
  nftContract: string;
  tokenId: number;
  price: string;
  status: number;
  timestamp: number;
  metadata?: {
    name: string;
    description: string;
    image: string;
    collection: string;
  };
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  collection: string;
}

const MyListingsPage = () => {
  const [listings, setListings] = useState<NFTListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [isOwner, setIsOwner] = useState(false);
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  const [emergencyTokenAddress, setEmergencyTokenAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');

  // Updated fetchMetadata function to get real NFT metadata
  const fetchMetadata = async (contractTokenId: string): Promise<NFTMetadata> => {
    try {
      // Extract contract address and token ID from the string
      const parts = contractTokenId.split('/');
      const contractAddress = parts[0];
      const tokenId = parts[1] || '0';
      
      // Try to get real metadata from the NFT contract
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const nftContract = new ethers.Contract(
            contractAddress,
            [
              "function tokenURI(uint256 tokenId) view returns (string)",
              "function name() view returns (string)",
              "function symbol() view returns (string)"
            ],
            provider
          );
          
          // Get token URI
          const tokenURI = await nftContract.tokenURI(tokenId);
          const contractName = await nftContract.name();
          
          // If it's an IPFS URL, try to fetch metadata
          if (tokenURI.startsWith('ipfs://')) {
            const ipfsHash = tokenURI.replace('ipfs://', '');
            const metadataUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
            
            const response = await fetch(metadataUrl);
            if (response.ok) {
              const metadata = await response.json();
              return {
                name: metadata.name || `${contractName} #${tokenId}`,
                description: metadata.description || "NFT Description",
                image: metadata.image?.startsWith('ipfs://') 
                  ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  : metadata.image || "https://via.placeholder.com/400",
                collection: contractName || "Unknown Collection"
              };
            }
          } else if (tokenURI.startsWith('http')) {
            // If it's a direct HTTP URL, try to fetch metadata
            const response = await fetch(tokenURI);
            if (response.ok) {
              const metadata = await response.json();
              return {
                name: metadata.name || `${contractName} #${tokenId}`,
                description: metadata.description || "NFT Description",
                image: metadata.image?.startsWith('ipfs://') 
                  ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  : metadata.image || "https://via.placeholder.com/400",
                collection: contractName || "Unknown Collection"
              };
            }
          }
          
          // Fallback if we can't fetch metadata but have contract info
          return {
            name: `${contractName} #${tokenId}`,
            description: "NFT Description",
            image: "https://via.placeholder.com/400",
            collection: contractName || "Unknown Collection"
          };
          
        } catch (contractError) {
          console.error("Error fetching contract metadata:", contractError);
          // Fallback to basic info
          return {
            name: `NFT #${tokenId}`,
            description: "NFT Description",
            image: "https://via.placeholder.com/400",
            collection: "Unknown Collection"
          };
        }
      }
      
      // Final fallback
      return {
        name: `NFT #${tokenId}`,
        description: "NFT Description", 
        image: "https://via.placeholder.com/400",
        collection: "Unknown Collection"
      };
      
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return {
        name: "Unknown NFT",
        description: "Metadata unavailable",
        image: "https://via.placeholder.com/400",
        collection: "Unknown"
      };
    }
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found. Please install MetaMask.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length === 0) {
          throw new Error("Please connect your wallet");
        }
        
        const userAddress = accounts[0].address;
        
        // Check if user is the contract owner
        const ownerStatus = await checkIsOwner(provider, userAddress);
        setIsOwner(ownerStatus);
        
        // Get user's listing IDs
        const listingIds = await getUserListings(provider, userAddress);
        
        if (listingIds.length === 0) {
          setListings([]);
          setIsLoading(false);
          return;
        }
        
        // Get marketplace contract
        const marketplaceContract = getMarketplaceContract(provider);
        
        // Fetch detailed info for each listing
        const fetchedListings = await Promise.all(
          listingIds.map(async (id) => {
            const listingInfo = await marketplaceContract.getListingInfo(id);
            const listing = await marketplaceContract.listings(id);
            
            // Fetch metadata
            const metadata = await fetchMetadata(`${listingInfo.nftContract}/${listingInfo.tokenId}`);
            
            return {
              listingId: Number(id),
              seller: listingInfo.seller,
              nftContract: listingInfo.nftContract,
              tokenId: Number(listingInfo.tokenId),
              price: formatUSDT(listingInfo.price),
              status: Number(listingInfo.status),
              timestamp: Number(listing.timestamp),
              metadata: metadata || undefined
            };
          })
        );
        
        setListings(fetchedListings);
      } catch (error) {
        console.error("Error fetching user listings:", error);
        setError("Failed to fetch your NFT listings. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserListings();
  }, []);

  const handleCancelListing = async (listingId: number) => {
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found. Please install MetaMask.");
      }
      
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const result = await cancelNFTListing(signer, listingId);
      
      if (result.success) {
        // Update the UI
        setListings(prevListings => 
          prevListings.filter(listing => listing.listingId !== listingId)
        );
        alert("Listing cancelled successfully");
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      console.error("Error cancelling listing:", error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert("Failed to cancel listing: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrice = async (listingId: number) => {
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found. Please install MetaMask.");
      }
      
      if (!newPrice || parseFloat(newPrice) <= 0) {
        throw new Error("Please enter a valid price");
      }
      
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const result = await updateNFTListing(signer, listingId, newPrice);
      
      if (result.success) {
        // Update the UI
        setListings(prevListings => 
          prevListings.map(listing => 
            listing.listingId === listingId 
              ? {...listing, price: newPrice}
              : listing
          )
        );
        setEditingListing(null);
        setNewPrice('');
        alert("Price updated successfully");
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      console.error("Error updating price:", error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert("Failed to update price: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyWithdraw = async () => {
    try {
      if (!emergencyTokenAddress) {
        alert("Please enter a token address");
        return;
      }

      if (!window.ethereum) {
        throw new Error("No Ethereum provider found. Please install MetaMask.");
      }
      
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const result = await emergencyWithdraw(signer, emergencyTokenAddress);
      
      if (result.success) {
        alert("Emergency withdrawal successful!");
        setEmergencyTokenAddress('');
        setShowEmergencyPanel(false);
        // Refresh token balance
        handleCheckTokenBalance();
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      console.error("Error during emergency withdraw:", error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert("Failed to perform emergency withdraw: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckTokenBalance = async () => {
    try {
      if (!emergencyTokenAddress) {
        setTokenBalance('0');
        return;
      }

      if (!window.ethereum) return;
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await getContractTokenBalance(provider, emergencyTokenAddress);
      setTokenBalance(balance);
    } catch (error) {
      console.error("Error checking token balance:", error);
      setTokenBalance('0');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f12] via-[#141419] to-[#171721] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-4">
                My NFT Listings
              </h1>
              <p className="text-gray-400 text-lg">
                Manage your active NFT listings and track their performance
              </p>
            </div>
            
            {/* Owner Emergency Panel Toggle */}
            {isOwner && (
              <button
                onClick={() => setShowEmergencyPanel(!showEmergencyPanel)}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Emergency Panel
              </button>
            )}
          </div>
        </div>

        {/* Emergency Withdraw Panel */}
        {isOwner && showEmergencyPanel && (
          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 mb-8 border border-yellow-500/20 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Emergency Token Withdrawal</h2>
            </div>
            
            <p className="text-yellow-200 mb-6 text-sm">
              ⚠️ This function allows withdrawing stuck tokens from the marketplace contract. Only use in emergencies.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Token Contract Address</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={emergencyTokenAddress}
                    onChange={(e) => {
                      setEmergencyTokenAddress(e.target.value);
                      if (e.target.value) {
                        handleCheckTokenBalance();
                      }
                    }}
                    placeholder="0x..."
                    className="flex-1 bg-[#24242f] text-white px-4 py-3 rounded-xl border border-gray-700/50 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 shadow-inner transition-all"
                  />
                  <button
                    onClick={handleCheckTokenBalance}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all"
                    disabled={!emergencyTokenAddress}
                  >
                    Check Balance
                  </button>
                </div>
              </div>
              
              {tokenBalance !== '0' && (
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <p className="text-gray-300">
                    <span className="font-medium">Contract Balance:</span> {tokenBalance} tokens
                  </p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={handleEmergencyWithdraw}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                  disabled={isLoading || !emergencyTokenAddress || tokenBalance === '0'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {isLoading ? 'Processing...' : 'Emergency Withdraw'}
                </button>
                <button
                  onClick={() => {
                    setShowEmergencyPanel(false);
                    setEmergencyTokenAddress('');
                    setTokenBalance('0');
                  }}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="underline mt-2 hover:text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your listings...</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.listingId}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-transform hover:-translate-y-1"
              >
                {/* NFT Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      listing.metadata?.image ||
                      "https://cdn-icons-png.flaticon.com/512/17631/17631865.png"
                    }
                    alt={listing.metadata?.name || `NFT #${listing.tokenId}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* NFT Info */}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white truncate">
                    {listing.metadata?.name || `NFT #${listing.tokenId}`}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {listing.metadata?.collection || "Unknown Collection"}
                  </p>

                  {editingListing === listing.listingId ? (
                    <div className="flex items-center mt-4">
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="New price"
                        className="flex-1 bg-gray-700 text-white px-2 py-1 rounded-l-md"
                        min="0"
                        step="0.01"
                      />
                      <button
                        onClick={() => handleUpdatePrice(listing.listingId)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-r-md hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-lg font-semibold text-white">
                        ${listing.price} USDT
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingListing(listing.listingId);
                            setNewPrice(listing.price);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCancelListing(listing.listingId)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-xl text-gray-300 font-medium mb-2">
              No Active Listings
            </h3>
            <p className="text-gray-400 mb-6">
              You don't have any active NFT listings.
            </p>
            <a
              href="/create-listing"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Create a Listing
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;
