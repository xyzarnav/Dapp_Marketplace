import { useState } from 'react';
import { Link } from 'react-router-dom';

type Collection = {
  id: string;
  name: string;
  floorPrice: string;
  volume: string;
  change: number;
  logo: string;
  banner: string;
  items: string[];
};

const trendingCollections: Collection[] = [
  {
    id: '1',
    name: 'Bored Ape Yacht Club',
    floorPrice: '68.4 ETH',
    volume: '7,842 ETH',
    change: 12.4,
    logo: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&w=256',
    banner: 'https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs?auto=format&w=1920',
    items: [
      'https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs?auto=format&w=1000',
      'https://i.seadn.io/gae/392k5RqcVwTwyRGY6iyJr5JQiR_NK7ymJeErcFzAQG9_FT0qNRhNNPtQigBkpJuYpN6ztrCQ6kepPGm5cgBwo4eNyCYNz2F8ulY?auto=format&w=1000',
      'https://i.seadn.io/gae/6X867C6AcFcOA08jkCf7LjmnoY1FpYWFuiG8C8vYEX9XK2hS7fY7JGhzRwV9NGa_inKlYaTjfUZjR6a9JE3HqvuQsK9yoU0uwQ2K?auto=format&w=1000'
    ]
  },
  {
    id: '2',
    name: 'Azuki',
    floorPrice: '10.3 ETH',
    volume: '3,156 ETH',
    change: -5.2,
    logo: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=256',
    banner: 'https://i.seadn.io/gae/O0XkiR_Z2--OPa_RA6FhXrR16yBOgIJqSLdHTGA0-LAhyzjSYcb3WEPaCYZHeh19JIUEAUazofVKXcY2qOylWCdoeBN6KeGg9bX9UQ?auto=format&w=1920',
    items: [
      'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1000',
      'https://i.seadn.io/gae/5KIxEGmnAiL5psnMCS8z-qlSPo8hveyzOUxeuFG_qaEZKOYUBUfTCZtKzHYcNKj9mLNZgmB7tYIKRu3Ayw3e8_oTsXTd8FJ7YKTr7Q?auto=format&w=1000',
      'https://i.seadn.io/gae/NeMen42xORKUBKnUNV7ShBYUPHWRXBGEH_9RQG0mxmL6JnrDQNRVJSPmMIpC0gDE-osXQN-9MlFFkwjHww2gNYgFeJJu_9dqHrZ9?auto=format&w=1000'
    ]
  },
  {
    id: '3',
    name: 'CloneX',
    floorPrice: '5.4 ETH',
    volume: '2,784 ETH',
    change: 8.7,
    logo: 'https://i.seadn.io/gae/XN0XuD8Uh3jyRWNtPTFeXJg_ht8m5ofDx6aHklOiy4amhFuWUa0JaR6It49AH8tlnYS386Q0TW_-Lmedn0UET_ko1a3CbJGeu5iHMg?auto=format&w=256',
    banner: 'https://i.seadn.io/gae/jsfhye5yrhOSusDCKXquMrdPUmSWK5lis4Pfs3q5Td8j-HtQ0IqjgI3JFYnLfGPdAhaSSDgYquAWtXzZGnOUb-ICk3masRwh7nOx?auto=format&w=1920',
    items: [
      'https://i.seadn.io/gae/XN0XuD8Uh3jyRWNtPTFeXJg_ht8m5ofDx6aHklOiy4amhFuWUa0JaR6It49AH8tlnYS386Q0TW_-Lmedn0UET_ko1a3CbJGeu5iHMg?auto=format&w=1000',
      'https://i.seadn.io/gae/UCjm7dHh0V5flJzSdIpidOPTRbJgpZesRuiP9BuN0SupV-5zBmKx92vc2AQUHf-3JEwDIjIDdnm3wnNnwxYW9kVa2SXWXLopCd0gSQ?auto=format&w=1000',
      'https://i.seadn.io/gae/oDRYIxQK0g3LBcCiCwlxGQD6EzN0ch-udzmcMNYZkdgR5AiNpTHEXUWmW0MozwWYSwUYSxfp_tmWjK6RNp3QNBa9Z2iL0cqC8QRuhQ?auto=format&w=1000'
    ]
  }
];

const TrendingCollections = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  
  return (
    <div>
      {/* Timeframe selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeframe === '24h' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setTimeframe('24h')}
          >
            24h
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeframe === '7d' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setTimeframe('7d')}
          >
            7d
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeframe === '30d' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setTimeframe('30d')}
          >
            30d
          </button>
        </div>
        
        <Link to="/rankings" className="text-blue-500 hover:text-blue-400 text-sm">
          View all
        </Link>
      </div>
      
      {/* Collections grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingCollections.map(collection => (
          <Link 
            key={collection.id} 
            to={`/collection/${collection.id}`}
            className="bg-[#1E1E22] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/20 transition-all"
          >
            {/* Banner image */}
            <div className="h-32 relative">
              <img 
                src={collection.banner} 
                alt={collection.name} 
                className="w-full h-full object-cover"
              />
              {/* Logo overlay */}
              <div className="absolute -bottom-10 left-4">
                <div className="rounded-xl overflow-hidden border-4 border-[#1E1E22] shadow-lg">
                  <img 
                    src={collection.logo} 
                    alt={collection.name} 
                    className="w-20 h-20 object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Collection name and details */}
            <div className="pt-12 px-4 pb-4">
              <h3 className="text-white font-bold text-lg mb-1">
                {collection.name}
              </h3>
              
              {/* Stats */}
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-gray-400 text-xs">Floor</p>
                  <p className="text-white font-medium">{collection.floorPrice}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Volume</p>
                  <p className="text-white font-medium">{collection.volume}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Change</p>
                  <p className={`font-medium ${collection.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {collection.change >= 0 ? '+' : ''}{collection.change}%
                  </p>
                </div>
              </div>
              
              {/* Preview images */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {collection.items.map((item, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img src={item} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingCollections;
