import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  collection: string;
}

interface NFTListing {
  listingId: number;
  seller: string;
  nftContract: string;
  tokenId: number;
  price: string;
  status: number;
  timestamp: number;
  metadata?: NFTMetadata;
}

type NFTCardProps = {
  nft: NFTListing;
  onBuy?: (listingId: number) => void;
  isLoading?: boolean;
};

const NFTCard = ({ nft, onBuy, isLoading = false }: NFTCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuy && !isLoading && nft.status === 0) {
      onBuy(nft.listingId);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div
      className="bg-gradient-to-b from-[#1E1E22] to-[#17171a] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/30 border border-gray-800/60 hover:border-blue-500/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* NFT Image */}
      <Link to={`/nft/${nft.nftContract}/${nft.tokenId}`} className="block relative aspect-square">
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}
          
          {!imageError ? (
            <img 
              src={nft.metadata?.image || `https://via.placeholder.com/400x400?text=NFT+${nft.tokenId}`}
              alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center p-4">
                <div className="text-5xl mb-3 opacity-80">🖼️</div>
                <p className="text-gray-400 text-sm font-medium">Image unavailable</p>
              </div>
            </div>
          )}
          
          {/* Status badge - refined styling */}
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              nft.status === 0 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-gray-700/30 text-gray-300 border border-gray-500/30'
            }`}>
              {nft.status === 0 ? 'Active' : 'Sold'}
            </span>
          </div>
        
          {/* Quick actions overlay - enhanced glass effect */}
          <div 
            className={`absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-sm flex items-center justify-center gap-5 transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button 
              className="bg-white/20 backdrop-blur-lg rounded-full p-3.5 hover:bg-white/30 hover:scale-110 transition-all shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Quick view logic
              }}
              aria-label="Quick view"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            {nft.status === 0 && onBuy && (
              <button 
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-full p-3.5 hover:from-blue-500 hover:to-blue-600 hover:scale-110 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBuyClick}
                disabled={isLoading}
                aria-label="Buy now"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <ShoppingCartIcon className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </div>
        </div>
      </Link>
      
      {/* NFT Info - refined styling */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <Link 
              to={`/collection/${nft.metadata?.collection || 'unknown'}`} 
              className="text-blue-400 text-sm hover:text-blue-300 font-medium block truncate"
            >
              <span className="inline-flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-1.5"></span>
                {nft.metadata?.collection || 'Unknown Collection'}
              </span>
            </Link>
            <Link 
              to={`/nft/${nft.nftContract}/${nft.tokenId}`} 
              className="block text-white font-bold hover:text-blue-400 mt-1.5 truncate text-lg"
              title={nft.metadata?.name || `NFT #${nft.tokenId}`}
            >
              {nft.metadata?.name || `NFT #${nft.tokenId}`}
            </Link>
          </div>
          
          <button
            className="text-gray-400 hover:text-red-500 transition-all hover:scale-110 ml-2 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            {isLiked ? (
              <HeartIconSolid className="h-6 w-6 text-red-500 drop-shadow-md" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Seller info - enhanced styling */}
        <div className="flex items-center mb-4">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs text-white font-bold mr-2 flex-shrink-0 shadow-md">
            {nft.seller.substring(2, 4).toUpperCase()}
          </div>
          <div>
            <span className="text-gray-500 text-xs block">Creator</span>
            <span className="text-gray-300 text-sm truncate font-medium">
              {formatAddress(nft.seller)}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-4 mt-1">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-500 text-xs block">Price</span>
              <p className="text-white font-bold text-lg">{nft.price} <span className="text-xs font-normal text-gray-400">USDT</span></p>
            </div>
            
            {nft.status === 0 && onBuy ? (
              <button
                onClick={handleBuyClick}
                disabled={isLoading}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  isLoading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-900/30'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2"></div>
                    Buying...
                  </div>
                ) : (
                  'Buy Now'
                )}
              </button>
            ) : (
              <Link 
                to={`/nft/${nft.nftContract}/${nft.tokenId}`}
                className="px-5 py-2.5 bg-blue-600/10 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-600/20 transition-colors border border-blue-600/20 hover:border-blue-500/30"
              >
                View Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
