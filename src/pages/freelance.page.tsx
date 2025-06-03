import { useState } from 'react';
import { Link } from 'react-router-dom';

type FreelanceService = {
  id: string;
  title: string;
  description: string;
  price: string;
  deliveryTime: string;
  rating: number;
  reviewCount: number;
  image: string;
  seller: {
    name: string;
    level: string;
    avatar: string;
  };
  category: string;
};

// Mock data for freelance services
const services: FreelanceService[] = [
  {
    id: '1',
    title: 'I will design professional NFT collection for your project',
    description: 'Get unique, high-quality NFT designs that stand out in the marketplace.',
    price: '100 USDT',
    deliveryTime: '3 days',
    rating: 4.9,
    reviewCount: 142,
    image: 'https://i.seadn.io/gae/tTf5BzMSJl_8U9QIgbeEJr9B_MJTbMG8lHbHK1xbti-MR9YhOc0oQbePucYPKGrV5jxXM0MzZNUmh4oIyU1GBGiT4nUD7uOnJdF-?auto=format&w=1000',
    seller: {
      name: 'DigitalArtist',
      level: 'Level 2',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    category: 'Design'
  },
  {
    id: '2',
    title: 'I will develop smart contract for your NFT or token project',
    description: 'Professional smart contract development with security audits and tests.',
    price: '500 USDT',
    deliveryTime: '7 days',
    rating: 5.0,
    reviewCount: 89,
    image: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1000',
    seller: {
      name: 'BlockchainDev',
      level: 'Top Rated',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    category: 'Development'
  },
  {
    id: '3',
    title: 'I will create 3D models for metaverse and NFT projects',
    description: '3D models and assets perfect for metaverse environments and NFT collections.',
    price: '200 USDT',
    deliveryTime: '5 days',
    rating: 4.8,
    reviewCount: 76,
    image: 'https://i.seadn.io/gae/yNi-XdGxsgQCPpqSio4o31ygAV6wURdIdInWRcFIl46UjUQ1eV7BEndGe8L661OoG-clRi7EgInLX4LPu9Jfw4fq0bnVYHqg7RFi?auto=format&w=1000',
    seller: {
      name: '3DArtistPro',
      level: 'Level 1',
      avatar: 'https://randomuser.me/api/portraits/women/66.jpg'
    },
    category: '3D Design'
  },
  {
    id: '4',
    title: 'I will create blockchain dApp with React and Web3',
    description: 'Full-stack development for decentralized applications with modern UI.',
    price: '750 USDT',
    deliveryTime: '14 days',
    rating: 4.7,
    reviewCount: 51,
    image: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&w=1000',
    seller: {
      name: 'Web3Expert',
      level: 'Top Rated',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    category: 'Development'
  },
  {
    id: '5',
    title: 'I will write comprehensive whitepaper for your crypto project',
    description: 'Professional whitepapers that explain your project\'s technology and vision.',
    price: '300 USDT',
    deliveryTime: '10 days',
    rating: 4.9,
    reviewCount: 34,
    image: 'https://i.seadn.io/gae/XN0XuD8Uh3jyRWNtPTFeXJg_ht8m5ofDx6aHklOiy4amhFuWUa0JaR6It49AH8tlnYS386Q0TW_-Lmedn0UET_ko1a3CbJGeu5iHMg?auto=format&w=1000',
    seller: {
      name: 'ContentCrypto',
      level: 'Level 2',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    category: 'Writing'
  },
  {
    id: '6',
    title: 'I will promote your NFT project to crypto community',
    description: 'Marketing services to get your NFT or crypto project in front of the right audience.',
    price: '250 USDT',
    deliveryTime: '7 days',
    rating: 4.6,
    reviewCount: 98,
    image: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&w=1000',
    seller: {
      name: 'CryptoPromoter',
      level: 'Level 2',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg'
    },
    category: 'Marketing'
  }
];

// Category filters for freelance services
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'design', name: 'Design' },
  { id: 'development', name: 'Development' },
  { id: '3d-design', name: '3D Design' },
  { id: 'writing', name: 'Writing' },
  { id: 'marketing', name: 'Marketing' }
];

const FreelancePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Filter services by category
  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => 
        service.category.toLowerCase() === activeCategory.replace('-', ' '));

  // Sort services based on selection
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.reviewCount - a.reviewCount; // popular by default
    }
  });

  return (
    <div className="min-h-screen bg-[#141416] pt-16">
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Freelance Services</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Find trusted freelancers with blockchain-secured payments and escrow
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Sort options */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-full md:w-auto mb-4 md:mb-0 relative">
            <p className="text-gray-400 mb-1">Sort by</p>
            <div className="relative inline-block w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block appearance-none w-full bg-gray-800 border border-gray-700 text-white py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:shadow-outline"
				title="Sort by"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Best Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.map(service => (
            <Link
              key={service.id}
              to={`/service/${service.id}`}
              className="bg-[#1E1E22] rounded-xl overflow-hidden hover:shadow-xl transition-transform hover:-translate-y-1"
            >
              {/* Service image */}
              <div className="aspect-video relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Service details */}
              <div className="p-4">
                {/* Seller info */}
                <div className="flex items-center mb-3">
                  <img
                    src={service.seller.avatar}
                    alt={service.seller.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="ml-2">
                    <p className="text-white text-sm font-medium">{service.seller.name}</p>
                    <p className="text-gray-400 text-xs">{service.seller.level}</p>
                  </div>
                </div>
                
                {/* Service title */}
                <h3 className="text-white font-medium mb-3 line-clamp-2">
                  {service.title}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-white">{service.rating}</span>
                  <span className="text-gray-400 text-sm ml-1">({service.reviewCount})</span>
                </div>
                
                {/* Price */}
                <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                  <p className="text-gray-400 text-xs">Starting at</p>
                  <p className="text-white font-bold">{service.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-12 text-center">
          <Link
            to="/post-job"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Post a Custom Job
          </Link>
          <p className="text-gray-400 mt-2">Can't find what you're looking for? Post a job and let freelancers find you!</p>
        </div>
      </div>
    </div>
  );
};

export default FreelancePage;
