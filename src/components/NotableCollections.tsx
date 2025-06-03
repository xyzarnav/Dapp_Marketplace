import { useState } from 'react';
import { Link } from 'react-router-dom';

type Collection = {
  id: string;
  name: string;
  creator: string;
  description: string;
  logo: string;
  featuredImage: string;
  itemCount: number;
};

const collections: Collection[] = [
  {
    id: '1',
    name: 'Bored Ape Yacht Club',
    creator: 'YugaLabs',
    description: 'The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain.',
    logo: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&w=256',
    featuredImage: 'https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs?auto=format&w=1000',
    itemCount: 10000
  },
  {
    id: '2',
    name: 'Azuki',
    creator: 'Chiru Labs',
    description: 'A collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.',
    logo: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=256',
    featuredImage: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1000',
    itemCount: 10000
  },
  {
    id: '3',
    name: 'Pudgy Penguins',
    creator: 'Pudgy Penguins',
    description: 'Pudgy Penguins is a collection of 8,888 NFTs, waddling through Web3. Embodying empathy & compassion, Pudgy Penguins are a beacon of positivity in the NFT Space.',
    logo: 'https://i.seadn.io/gae/yNi-XdGxsgQCPpqSio4o31ygAV6wURdIdInWRcFIl46UjUQ1eV7BEndGe8L661OoG-clRi7EgInLX4LPu9Jfw4fq0bnVYHqg7RFi?auto=format&w=256',
    featuredImage: 'https://i.seadn.io/gae/yNi-XdGxsgQCPpqSio4o31ygAV6wURdIdInWRcFIl46UjUQ1eV7BEndGe8L661OoG-clRi7EgInLX4LPu9Jfw4fq0bnVYHqg7RFi?auto=format&w=1000',
    itemCount: 8888
  },
  {
    id: '4',
    name: 'Moonbirds',
    creator: 'Proof Collective',
    description: 'A collection of 10,000 utility-enabled PFPs that feature a richly diverse and unique pool of rarity-powered traits.',
    logo: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&w=256',
    featuredImage: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&w=1000',
    itemCount: 10000
  }
];

const NotableCollections = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {collections.map(collection => (
        <Link 
          key={collection.id}
          to={`/collection/${collection.id}`}
          className="flex bg-[#1E1E22] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/20 transition-transform hover:-translate-y-1"
          onMouseEnter={() => setHoveredId(collection.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Collection image */}
          <div className="relative w-1/3">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 z-10"></div>
            <img 
              src={collection.featuredImage} 
              alt={collection.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Collection details */}
          <div className="w-2/3 p-6 relative">
            <div className="flex items-center mb-2">
              <img 
                src={collection.logo} 
                alt={collection.name} 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="text-white font-bold">{collection.name}</h3>
                <p className="text-gray-400 text-sm">by {collection.creator}</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm line-clamp-2 mb-4">
              {collection.description}
            </p>
            
            <div className="flex justify-between mt-auto">
              <div>
                <p className="text-gray-400 text-xs">Items</p>
                <p className="text-white font-medium">{collection.itemCount.toLocaleString()}</p>
              </div>
              
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  hoveredId === collection.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                View Collection
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NotableCollections;
