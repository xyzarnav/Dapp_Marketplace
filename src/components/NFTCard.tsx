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
      className="bg-[#1E1E22] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20 border border-gray-700/50 hover:border-blue-500/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* NFT Image */}
      <Link to={`/nft/${nft.nftContract}/${nft.tokenId}`} className="block relative aspect-square">
        <div className="w-full h-full bg-gray-900 relative overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {!imageError ? (
            <img 
              src={nft.metadata?.image || `https://via.placeholder.com/400x400?text=NFT+${nft.tokenId}`}
              alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-gray-400 text-sm">Image not available</p>
              </div>
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              nft.status === 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {nft.status === 0 ? 'Active' : 'Sold'}
            </span>
          </div>
        
          {/* Quick actions overlay */}
          <div 
            className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-4 transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button 
              className="bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition"
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
                className="bg-blue-600 rounded-full p-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBuyClick}
                disabled={isLoading}
                aria-label="Buy now"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <ShoppingCartIcon className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </div>
        </div>
      </Link>
      
      {/* NFT Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <Link 
              to={`/collection/${nft.metadata?.collection || 'unknown'}`} 
              className="text-blue-400 text-sm hover:text-blue-300 font-medium block truncate"
            >
              {nft.metadata?.collection || 'Unknown Collection'}
            </Link>
            <Link 
              to={`/nft/${nft.nftContract}/${nft.tokenId}`} 
              className="block text-white font-semibold hover:text-blue-400 mt-1 truncate"
              title={nft.metadata?.name || `NFT #${nft.tokenId}`}
            >
              {nft.metadata?.name || `NFT #${nft.tokenId}`}
            </Link>
          </div>
          
          <button
            className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            {isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Seller info */}
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold mr-2 flex-shrink-0">
            {nft.seller.substring(2, 4).toUpperCase()}
          </div>
          <span className="text-gray-400 text-sm truncate">
            {formatAddress(nft.seller)}
          </span>
        </div>
        
        <div className="border-t border-gray-700 pt-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-400 text-xs">Price</span>
              <p className="text-white font-bold">{nft.price}</p>
            </div>
            
            {nft.status === 0 && onBuy ? (
              <button
                onClick={handleBuyClick}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400 mr-2"></div>
                    Buying...
                  </div>
                ) : (
                  'Buy Now'
                )}
              </button>
            ) : (
              <Link 
                to={`/nft/${nft.nftContract}/${nft.tokenId}`}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition"
              >
                View
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
