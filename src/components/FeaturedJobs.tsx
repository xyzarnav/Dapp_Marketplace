import { Link } from 'react-router-dom';

type Job = {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  deadline: string;
  client: {
    name: string;
    rating: number;
    address: string;
  };
  skills: string[];
};

const featuredJobs: Job[] = [
  {
    id: '1',
    title: 'NFT Collection Design - 10 Unique Characters',
    description: 'Looking for a talented digital artist to create a set of 10 unique character NFTs for my upcoming collection.',
    price: '500 USDT',
    category: 'Design',
    deadline: '7 days',
    client: {
      name: 'CryptoCollector',
      rating: 4.8,
      address: '0xf12c...9837'
    },
    skills: ['Illustration', 'Character Design', 'NFT', 'Digital Art']
  },
  {
    id: '2',
    title: 'Smart Contract Development for NFT Marketplace',
    description: 'Need an experienced Solidity developer to create and audit smart contracts for an NFT marketplace.',
    price: '2000 USDT',
    category: 'Development',
    deadline: '14 days',
    client: {
      name: 'BlockchainVentures',
      rating: 4.9,
      address: '0x23a9...6b42'
    },
    skills: ['Solidity', 'Smart Contracts', 'ERC-721', 'Security']
  },
  {
    id: '3',
    title: 'Web3 Frontend Development for Marketplace',
    description: 'Looking for a React developer with Web3 experience to build the frontend for our decentralized marketplace.',
    price: '1500 USDT',
    category: 'Development',
    deadline: '21 days',
    client: {
      name: 'DeFiBuilder',
      rating: 4.7,
      address: '0x87bf...2e45'
    },
    skills: ['React', 'TypeScript', 'Web3.js', 'ethers.js', 'Tailwind CSS']
  }
];

const FeaturedJobs = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredJobs.map((job) => (
        <Link
          key={job.id}
          to={`/job/${job.id}`}
          className="bg-[#1E1E22] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/20 transition-transform hover:-translate-y-1"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-md">
                  {job.category}
                </span>
              </div>
              <div className="text-green-400 font-medium">
                {job.price}
              </div>
            </div>
            
            <h3 className="text-white font-bold text-lg mb-3 line-clamp-2">
              {job.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {job.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-800 w-8 h-8 flex items-center justify-center text-sm text-white">
                  {job.client.name.charAt(0)}
                </div>
                <div className="ml-2">
                  <div className="text-gray-300 text-sm font-medium">{job.client.name}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span className="text-yellow-400">★</span> {job.client.rating}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Deadline: {job.deadline}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedJobs;
