import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from './../components/Hero';


import TrendingCollections from './../components/TrendingCollections';
import FeaturedJobs from '.././components/FeaturedJobs';
import CategoryList from './../components/CategoryList';
import NFTCard from './../components/NFTCard';

const dummyTrendingNFTs = [
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
  {
    listingId: 2,
    seller: '0x234567890abcdef1234567890abcdef123456789',
    nftContract: '0xbcdefabcdefabcdefabcdefabcdefabcdefabcde',
    tokenId: 5678,
    price: '68.4 ETH',
    status: 0,
    timestamp: Date.now(),
    metadata: {
      name: 'Bored Ape #5678',
      description: 'Bored Ape Yacht Club NFT',
      image: 'https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs?auto=format&w=1000',
      collection: 'BAYC'
    }
  },
  {
    listingId: 3,
    seller: '0x34567890abcdef1234567890abcdef1234567890',
    nftContract: '0xcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    tokenId: 9012,
    price: '12.4 ETH',
    status: 0,
    timestamp: Date.now(),
    metadata: {
      name: 'CloneX #9012',
      description: 'Clone X NFT',
      image: 'https://i.seadn.io/gae/XN0XuD8Uh3jyRWNtPTFeXJg_ht8m5ofDx6aHklOiy4amhFuWUa0JaR6It49AH8tlnYS386Q0TW_-Lmedn0UET_ko1a3CbJGeu5iHMg?auto=format&w=1000',
      collection: 'Clone X'
    }
  },
  {
    listingId: 4,
    seller: '0x4567890abcdef1234567890abcdef12345678901',
    nftContract: '0xdefabcdefabcdefabcdefabcdefabcdefabcdefa',
    tokenId: 3456,
    price: '8.2 ETH',
    status: 0,
    timestamp: Date.now(),
    metadata: {
      name: 'Doodle #3456',
      description: 'Doodle NFT',
      image: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&w=1000',
      collection: 'Doodles'
    }
  },
  {
    listingId: 5,
    seller: '0x567890abcdef1234567890abcdef123456789012',
    nftContract: '0xefabcdefabcdefabcdefabcdefabcdefabcdefab',
    tokenId: 7890,
    price: '10.1 ETH',
    status: 0,
    timestamp: Date.now(),
    metadata: {
      name: 'Moonbird #7890',
      description: 'Moonbird NFT',
      image: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&w=1000',
      collection: 'Moonbirds'
    }
  },
  {
    listingId: 6,
    seller: '0x67890abcdef1234567890abcdef1234567890123',
    nftContract: '0xfabcdefabcdefabcdefabcdefabcdefabcdefabc',
    tokenId: 1212,
    price: '2.8 ETH',
    status: 0,
    timestamp: Date.now(),
    metadata: {
      name: 'Pudgy Penguin #1212',
      description: 'Pudgy Penguin NFT',
      image: 'https://i.seadn.io/gae/yNi-XdGxsgQCPpqSio4o31ygAV6wURdIdInWRcFIl46UjUQ1eV7BEndGe8L661OoG-clRi7EgInLX4LPu9Jfw4fq0bnVYHqg7RFi?auto=format&w=1000',
      collection: 'Pudgy Penguins'
    }
  }
];

const HomePage = () => {
  const [trendingNFTs] = useState(dummyTrendingNFTs);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, you'd fetch actual NFTs from your API/blockchain
  useEffect(() => {
    const fetchTrendingNFTs = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In a real app, fetch actual NFTs from your API/blockchain
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching trending NFTs:', error);
        setIsLoading(false);
      }
    };

    fetchTrendingNFTs();
  }, []);

  return (
    <div className="min-h-screen bg-[#141416]">
      {/* Bitcoin Animation Section */}
      <div className="pt-20 pb-8">
        
        {/* <HomepageAnimation /> */}
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Main options */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        <h2 className="text-4xl font-extrabold text-white mb-12 text-center drop-shadow-lg">
          Discover Your Web3 Journey
        </h2>{" "}
        {/* Enhanced heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {" "}
          {/* Adjusted gap and added lg column */}
          {/* NFT Marketplace Card */}
          <Link
            to="/explore"
            className="relative block rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-purple-800 opacity-90 group-hover:opacity-95 transition-opacity duration-300"></div>{" "}
            {/* Darker gradient overlay */}
            <img
              src="https://cdn-ialap.nitrocdn.com/bSxMvRMJjpvESeBpWPWSavCeSWXQHFjk/assets/images/optimized/rev-fea5cf8/www.zucisystems.com/wp-content/uploads/2022/12/NFT.png" // Placeholder for NFT image
              alt="NFT Marketplace background - abstract digital art"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
            />
            <div className="relative p-10 z-10 flex flex-col justify-between h-full">
              <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-md">
                NFT Marketplace
              </h3>
              <p className="text-white text-lg mb-8 opacity-90 leading-relaxed">
                Explore, buy, and sell unique digital collectibles. Dive into
                the world of authenticated art, gaming assets, and more, all
                secured on the blockchain.
              </p>
              <div className="flex justify-between items-end">
                <span className="text-5xl" role="img" aria-label="NFT icon">
                  🎨
                </span>{" "}
                {/* Icon for NFT */}
                <div className="space-x-2">
                  <button className="bg-white text-blue-800 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-100 transition-colors duration-300 text-lg">
                    Start Exploring
                  </button>
                  <Link
                    to="/create-listing"                        // ← add this link
                    className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition text-lg"
                  >
                    Create NFT
                  </Link>
                </div>
              </div>
            </div>
          </Link>
          {/* Freelance Services Card */}
          <Link
            to="/freelance"
            className="relative block rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-teal-800 opacity-90 group-hover:opacity-95 transition-opacity duration-300"></div>{" "}
            {/* Darker gradient overlay */}
            <img
              src="https://www.mindinventory.com/blog/wp-content/uploads/2023/06/web3-in-real-estate-1.webp" // Placeholder for Freelance image
              alt="Freelance Services background - creative collaboration"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
            />
            <div className="relative p-10 z-10 flex flex-col justify-between h-full">
              <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-md">
                Freelance Services
              </h3>
              <p className="text-white text-lg mb-8 opacity-90 leading-relaxed">
                Connect with talent globally. Offer your skills or find experts
                for your projects with secure, transparent, and decentralized
                payments.
              </p>
              <div className="flex justify-between items-end">
                <span
                  className="text-5xl"
                  role="img"
                  aria-label="Freelance icon"
                >
                  🤝
                </span>{" "}
                {/* Icon for Freelance */}
                <button className="bg-white text-green-800 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-green-100 transition-colors duration-300 text-lg">
                  Find Opportunities
                </button>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-white mb-8">Trending NFTs</h2>
        <TrendingCollections />
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Jobs</h2>
          <Link to="/jobs" className="text-blue-500 hover:text-blue-400">
            View all jobs
          </Link>
        </div>

        <FeaturedJobs />
      </section>

      {/* Top NFTs Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Top NFTs</h2>
          <Link to="/explore" className="text-blue-500 hover:text-blue-400">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading top NFTs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingNFTs.map((nft) => (
              <NFTCard key={nft.listingId} nft={nft} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-white mb-8">
          Browse by category
        </h2>
        <CategoryList />
      </section>

      {/* Resources Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Resources for getting started
          </h2>
          <p className="mb-6 text-lg max-w-2xl">
            Everything you need to know about creating, buying, and selling NFTs
            or freelancing on our platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-black/20 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
              <p className="text-gray-200">
                Learn how to create an account, set up your wallet, and what you
                can do on our platform
              </p>
            </div>
            <div className="bg-black/20 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Create and Sell</h3>
              <p className="text-gray-200">
                Learn how to create NFTs or offer freelance services and start
                earning
              </p>
            </div>
            <div className="bg-black/20 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">FAQs</h3>
              <p className="text-gray-200">
                Get answers to the most commonly asked questions about our
                marketplace and freelance platform
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;
