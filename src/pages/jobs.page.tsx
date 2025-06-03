import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  postedDate: string;
  proposals: number;
};

// Mock data for jobs
const jobListings: Job[] = [
  {
    id: '1',
    title: 'NFT Collection Design - 10 Unique Characters',
    description: 'Looking for a talented digital artist to create a set of 10 unique character NFTs for my upcoming collection. Each character should have distinct traits that can be combined in various ways for rarity. Experience with NFT collections is required.',
    price: '500 USDT',
    category: 'Design',
    deadline: '7 days',
    client: {
      name: 'CryptoCollector',
      rating: 4.8,
      address: '0xf12c...9837'
    },
    skills: ['Illustration', 'Character Design', 'NFT', 'Digital Art'],
    postedDate: '2 days ago',
    proposals: 8
  },
  {
    id: '2',
    title: 'Smart Contract Development for NFT Marketplace',
    description: 'Need an experienced Solidity developer to create and audit smart contracts for an NFT marketplace. The marketplace should support ERC-721 and ERC-1155 tokens, with features for bidding, auctions, and royalties.',
    price: '2000 USDT',
    category: 'Development',
    deadline: '14 days',
    client: {
      name: 'BlockchainVentures',
      rating: 4.9,
      address: '0x23a9...6b42'
    },
    skills: ['Solidity', 'Smart Contracts', 'ERC-721', 'Security'],
    postedDate: '5 days ago',
    proposals: 12
  },
  {
    id: '3',
    title: 'Web3 Frontend Development for Marketplace',
    description: 'Looking for a React developer with Web3 experience to build the frontend for our decentralized marketplace. You should be familiar with connecting to blockchain wallets, displaying NFTs, and handling transactions.',
    price: '1500 USDT',
    category: 'Development',
    deadline: '21 days',
    client: {
      name: 'DeFiBuilder',
      rating: 4.7,
      address: '0x87bf...2e45'
    },
    skills: ['React', 'TypeScript', 'Web3.js', 'ethers.js', 'Tailwind CSS'],
    postedDate: '1 day ago',
    proposals: 5
  },
  {
    id: '4',
    title: 'Create Whitepaper for DeFi Project',
    description: 'We need a comprehensive whitepaper for our new DeFi project. Looking for someone with deep understanding of DeFi concepts and excellent technical writing skills.',
    price: '800 USDT',
    category: 'Writing',
    deadline: '10 days',
    client: {
      name: 'DeFiFinance',
      rating: 4.6,
      address: '0x45bc...78de'
    },
    skills: ['Technical Writing', 'DeFi', 'Blockchain', 'Research'],
    postedDate: '3 days ago',
    proposals: 7
  },
  {
    id: '5',
    title: 'Marketing Campaign for NFT Launch',
    description: 'Planning to launch a new NFT collection and need help with marketing strategy. Looking for someone with experience in crypto marketing and community building.',
    price: '1200 USDT',
    category: 'Marketing',
    deadline: '14 days',
    client: {
      name: 'NFTCreator',
      rating: 4.5,
      address: '0x9ab1...3e7f'
    },
    skills: ['Digital Marketing', 'Social Media', 'Community Management', 'NFT'],
    postedDate: '4 days ago',
    proposals: 10
  }
];

// Category filters for jobs
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'design', name: 'Design' },
  { id: 'development', name: 'Development' },
  { id: 'writing', name: 'Writing' },
  { id: 'marketing', name: 'Marketing' }
];

const JobsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter jobs by search query and category
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || 
      job.category.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#141416] pt-16">
      <div className="w-full bg-gradient-to-r from-green-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Find Blockchain Jobs</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Apply for jobs and get paid securely through smart contracts
          </p>
          
          {/* Search bar */}
          <div className="mt-6 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white bg-opacity-10 backdrop-blur-sm pl-10 pr-4 py-3 w-full rounded-lg text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
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
        
        {/* Jobs list */}
        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div 
                key={job.id} 
                className="bg-[#1E1E22] rounded-xl p-6 hover:shadow-xl hover:shadow-blue-900/10 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-md mb-2">
                      {job.category}
                    </span>
                    <h3 className="text-white font-bold text-xl">
                      {job.title}
                    </h3>
                  </div>
                  <div className="text-green-400 font-medium text-lg">
                    {job.price}
                  </div>
                </div>
                
                <p className="text-gray-400 mb-4">
                  {job.description.length > 200 
                    ? `${job.description.substring(0, 200)}...` 
                    : job.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
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
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-gray-400">
                      Posted: {job.postedDate}
                    </div>
                    <div className="text-gray-400">
                      Proposals: {job.proposals}
                    </div>
                    <div className="text-gray-400">
                      Deadline: {job.deadline}
                    </div>
                    <Link
                      to={`/job/${job.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-white text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
        
        {/* Post job CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-white text-2xl font-bold mb-2">Need work done?</h3>
              <p className="text-gray-300">Post a job and find the perfect freelancer for your project</p>
            </div>
            <Link
              to="/post-job"
              className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
