import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import NFTCard from '../components/NFTCard';
import { getMarketplaceContract, getUSDTContract, formatUSDT, parseUSDT } from '../utils/getContract';
import { buyNFT } from '../utils/marketplaceInteractions';

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

type FilterOptions = {
  sortBy: 'recent' | 'price-high' | 'price-low' | 'oldest';
  minPrice?: number;
  maxPrice?: number;
  collections?: string[];
};

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  collection: string;
}

// Updated function to fetch real NFT metadata
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

const ExplorePage = () => {
  const [nfts, setNfts] = useState<NFTListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'recent'
  });

  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found. Please install MetaMask.");
        }
        
        // Get provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Get the marketplace contract
        const marketplaceContract = getMarketplaceContract(provider);
        
        // Fetch active listing IDs
        const listingIds = await marketplaceContract.getActiveListings();
        
        // Fetch details for each listing
        const listings = await Promise.all(
          listingIds.map(async (id: bigint) => {
            const listingInfo = await marketplaceContract.getListingInfo(id);
            const listing = await marketplaceContract.listings(id);
            
            // Fetch real metadata using contract address and token ID
            const metadata = await fetchMetadata(`${listingInfo.nftContract}/${listingInfo.tokenId}`);
            
            return {
              listingId: Number(id),
              seller: listingInfo.seller,
              nftContract: listingInfo.nftContract,
              tokenId: Number(listingInfo.tokenId),
              price: formatUSDT(listingInfo.price), // Format price from bigint to string
              status: Number(listingInfo.status),
              timestamp: Number(listing.timestamp),
              metadata: metadata || undefined
            };
          })
        );
        
        // Apply sorting based on filters
        let sortedListings = [...listings];
        
        if (filters.sortBy === 'price-high') {
          sortedListings = sortedListings.sort((a, b) => 
            parseFloat(b.price) - parseFloat(a.price)
          );
        } else if (filters.sortBy === 'price-low') {
          sortedListings = sortedListings.sort((a, b) => 
            parseFloat(a.price) - parseFloat(b.price)
          );
        } else if (filters.sortBy === 'oldest') {
          sortedListings = sortedListings.sort((a, b) => 
            a.timestamp - b.timestamp
          );
        } else {
          // Default: recent first
          sortedListings = sortedListings.sort((a, b) => 
            b.timestamp - a.timestamp
          );
        }
        
        setNfts(sortedListings); 
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setError("Failed to fetch NFT listings. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, [filters]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      sortBy: e.target.value as FilterOptions['sortBy']
    });
  };

  const handleBuyNFT = async (listingId: number) => {
    try {
      setIsLoading(true);
      
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found. Please install MetaMask.");
      }
      
      // Get signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // approve USDT allowance for the marketplace
      const usdt = getUSDTContract(signer);
      const marketplace = import.meta.env.REACT_APP_MARKETPLACE_ADDRESS 
        || import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS!;
      const priceAmount = parseUSDT(
        nfts.find(n => n.listingId === listingId)!.price
      );
      const current = await usdt.allowance(await signer.getAddress(), marketplace);
      if (current < priceAmount) {
        const tx = await usdt.approve(marketplace, priceAmount);
        await tx.wait();
      }

      // Buy NFT using utility function
      const result = await buyNFT(signer, listingId);
      
      if (result.success) {
        alert("Successfully purchased NFT!");
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert("Failed to buy NFT. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f12] via-[#141419] to-[#171721] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Discover NFTs
                </h1>
                <p className="text-blue-100/70 max-w-xl text-lg">
                  Explore unique digital collectibles on our next-generation NFT marketplace.
                </p>
              </div>
              <Link
                to="/create-listing"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-blue-900/50 flex items-center gap-2 transform hover:translate-y-[-2px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Listing
              </Link>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-[#1a1a23] rounded-xl p-5 mb-8 border border-gray-800/50 backdrop-blur-md shadow-lg">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-auto mb-4 md:mb-0 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div>
                <p className="text-gray-400 mb-1.5 text-sm font-medium">Sort by</p>
                <div className="relative">
                  <select
                    id="sortByFilter"
                    aria-label="Sort NFTs by"
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    className="appearance-none bg-[#24242f] text-white px-5 py-2.5 pr-10 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-inner w-full md:w-48"
                  >
                    <option value="recent">Recently Listed</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="oldest">Oldest</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="hidden md:block h-10 w-px bg-gray-800/80 mx-2"></div>

              <div>
                <p className="text-gray-400 mb-1.5 text-sm font-medium">Price range</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="bg-[#24242f] text-white px-4 py-2.5 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-inner w-24"
                    min="0"
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="bg-[#24242f] text-white px-4 py-2.5 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-inner w-24"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">
                {isLoading 
                  ? "Loading listings..." 
                  : `${nfts.length} ${nfts.length === 1 ? 'item' : 'items'}`}
              </span>
              
              <button className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-sm text-gray-300 hover:text-white bg-[#24242f] hover:bg-[#2a2a38] border border-gray-700/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 text-red-400 p-6 rounded-xl mb-8 border border-red-500/20 flex items-start">
            <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium mb-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="flex items-center gap-1.5 text-sm hover:text-red-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Retry
              </button>
            </div>
          </div>
        )}

        {/* NFT Grid */}
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-blue-500 animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-400 text-lg">Fetching Available NFTs...</p>
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard 
                key={nft.listingId} 
                nft={nft} 
                onBuy={handleBuyNFT}
                isLoading={isLoading}
              />
            ))}
          </div>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-800 rounded-2xl">
            <div className="bg-gray-800/50 rounded-full p-6 mb-6">
              <div className="text-6xl">🖼️</div>
            </div>
            <h3 className="text-2xl text-gray-300 font-semibold mb-2">No NFTs Listed Yet</h3>
            <p className="text-gray-400 max-w-md text-center mb-8">There are currently no active NFT listings. Be the first to list your NFT!</p>
            <Link 
              to="/create-listing"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-blue-900/50 flex items-center gap-2 transform hover:translate-y-[-2px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
