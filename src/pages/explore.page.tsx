import { useState, useEffect } from 'react';
import NFTCard from '../components/NFTCard';

interface NFTListing {
  // Remove old fields and match NFTCard's expected type
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

// Mock data - would be replaced with actual API/contract calls
const mockNFTs: NFTListing[] = [
  {
    listingId: 1,
    seller: '0x1234567890abcdef1234567890abcdef12345678',
    nftContract: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    tokenId: 1234,
    price: '0.5 ETH',
    status: 0,
    timestamp: Date.now(),
    metadata: {
      name: 'Azuki #1234',
      description: 'Azuki NFT',
      image: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1000',
      collection: 'Azuki'
    }
  },
  // ...add more NFTs here as needed, following the same structure...
];

type FilterOptions = {
  sortBy: 'recent' | 'price-high' | 'price-low' | 'oldest';
  minPrice?: number;
  maxPrice?: number;
  collections?: string[];
};

const ExplorePage = () => {
  const [nfts, setNfts] = useState(mockNFTs);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'recent'
  });

  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call with filter params
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        // Apply sorting (this would be handled by the API in a real app)
        let sortedNFTs = [...mockNFTs];
        if (filters.sortBy === 'price-high') {
          sortedNFTs = sortedNFTs.sort((a, b) => 
            parseFloat(b.price) - parseFloat(a.price)
          );
        } else if (filters.sortBy === 'price-low') {
          sortedNFTs = sortedNFTs.sort((a, b) => 
            parseFloat(a.price) - parseFloat(b.price)
          );
        }
        
        setNfts(sortedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
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

  return (
    <div className="min-h-screen bg-[#141416] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Explore NFTs</h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <p className="text-gray-400 mb-1">Sort by</p>
            <label htmlFor="sortByFilter" className="sr-only">
              Sort by:
            </label>{" "}
            {/* Added label */}
            <select
              id="sortByFilter" // Added id to link with label
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Recently Listed</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div className="w-full md:w-auto">
            <span className="text-gray-400">Showing {nfts.length} results</span>
          </div>
        </div>

        {/* NFT Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading NFTs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={nft.listingId} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
