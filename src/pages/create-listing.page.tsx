import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createNFTListing } from '../utils/marketplaceInteractions';
import { getNFTContract } from '../utils/nftInteraction';
import { getUSDTContract, parseUSDT } from '../utils/getContract';
import { useNavigate, Link } from 'react-router-dom';

interface NFTForm {
  contractAddress: string;
  tokenId: string;
  price: string;
}

const CreateListingPage: React.FC = () => {
  const [form, setForm] = useState<NFTForm>({
    contractAddress: '',
    tokenId: '',
    price: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nftDetails, setNftDetails] = useState<{ name: string; image: string } | null>(null);
  
  const navigate = useNavigate();

  // Minimum fee as string (6-decimals USDT)
  const MIN_LISTING_FEE = import.meta.env.VITE_LISTING_FEE || "1";

  // Verify NFT ownership when contract address and token ID are entered
  useEffect(() => {
    const verifyOwnership = async () => {
      if (!form.contractAddress || !form.tokenId) {
        setNftDetails(null);
        return;
      }

      try {
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const nftContract = getNFTContract(provider, form.contractAddress);
        const accounts = await provider.listAccounts();
        const userAddress = accounts[0]?.address;

        // Check if user owns this NFT
        try {
          const owner = await nftContract.ownerOf(form.tokenId);
          if (owner.toLowerCase() !== userAddress.toLowerCase()) {
            setError("You don't own this NFT");
            setNftDetails(null);
            return;
          }
        } catch {
          // Invalid token ID or contract
          setError("Invalid token ID or contract");
          setNftDetails(null);
          return;
        }

        // For this demo, we'll use placeholder data
        // In a real app, you'd fetch this from IPFS or an API
        setNftDetails({
          name: `NFT #${form.tokenId}`,
          image: `https://picsum.photos/seed/${form.tokenId}/400/400`
        });
        setError(null);

      } catch (error) {
        console.error("Error verifying ownership:", error);
        setError("Failed to verify NFT ownership");
        setNftDetails(null);
      }
    };

    verifyOwnership();
  }, [form.contractAddress, form.tokenId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate price >= minimum
      const priceBN = parseUSDT(form.price);
      const minFeeBN = parseUSDT(MIN_LISTING_FEE);
      
      // For ethers v6, compare bigints directly using comparison operators
      if (priceBN < minFeeBN) {
        setError(`Listing price must be at least ${MIN_LISTING_FEE} USDT`);
        setIsLoading(false);
        return;
      }

      try {
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found. Please install MetaMask.");
        }

        // Get provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Validate marketplace address
        const marketplaceAddress =
          import.meta.env.REACT_APP_MARKETPLACE_ADDRESS ||
          import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;
        if (!marketplaceAddress) {
          throw new Error(
            "Marketplace contract address is not defined in environment variables."
          );
        }

        // Approve the marketplace contract to spend the listing fee
        const usdtContract = getUSDTContract(signer);
        const rawAllowance = await usdtContract.allowance(
          await signer.getAddress(),
          marketplaceAddress
        );
        
        // For ethers v6, compare bigints directly
        if (rawAllowance < minFeeBN) {
          const approveTx = await usdtContract.approve(marketplaceAddress, minFeeBN);
          await approveTx.wait();
        }

        // Create listing
        const result = await createNFTListing(
          signer,
          form.contractAddress,
          parseInt(form.tokenId),
          form.price
        );

        if (result.success) {
          alert(`NFT Listed Successfully! Listing ID: ${result.listingId}`);
          navigate('/explore');
        } else {
          throw new Error(result.error);
        }
      } catch (error: unknown) {
        console.error("Error creating listing:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create listing";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f12] via-[#141419] to-[#171721] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header - Improved spacing */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-4">
            List Your NFT for Sale
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            Create a listing to sell your NFT on our marketplace. Fill in the details below to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Side: Form - Takes more space */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <div className="bg-[#1a1a23] rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-800/50 bg-gradient-to-r from-[#1a1a23] to-[#1e1e2a]">
                <h2 className="text-2xl font-bold text-white mb-1">NFT Details</h2>
                <p className="text-gray-400 text-sm">Enter the information for your NFT listing</p>
              </div>

              {error && (
                <div className="mx-8 mt-6 bg-gradient-to-r from-red-500/10 to-red-500/5 p-4 rounded-xl border border-red-500/20">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="px-8 py-8">
                <div className="space-y-8">
                  {/* Contract Address Field */}
                  <div>
                    <label
                      htmlFor="contractAddress"
                      className="block text-sm font-semibold text-gray-300 mb-3 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      NFT Contract Address
                    </label>
                    <input
                      type="text"
                      id="contractAddress"
                      name="contractAddress"
                      value={form.contractAddress}
                      onChange={handleChange}
                      required
                      placeholder="0x..."
                      className="w-full px-5 py-4 rounded-xl bg-[#24242f] border border-gray-700/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-inner transition-all"
                    />
                    <p className="mt-2 text-xs text-gray-500">Enter the contract address of your NFT</p>
                  </div>

                  {/* Token ID and Price Fields - Side by side with better spacing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="tokenId"
                        className="block text-sm font-semibold text-gray-300 mb-3 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Token ID
                      </label>
                      <input
                        type="number"
                        id="tokenId"
                        name="tokenId"
                        value={form.tokenId}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="e.g., 123"
                        className="w-full px-5 py-4 rounded-xl bg-[#24242f] border border-gray-700/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-inner transition-all"
                      />
                      <p className="mt-2 text-xs text-gray-500">The unique identifier for your NFT</p>
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Price (USDT)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          required
                          min={MIN_LISTING_FEE}
                          step="0.01"
                          placeholder={`Min ${MIN_LISTING_FEE}`}
                          className="w-full px-5 py-4 pr-16 rounded-xl bg-[#24242f] border border-gray-700/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-inner transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                          <span className="text-gray-400 font-medium">USDT</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Minimum price is {MIN_LISTING_FEE} USDT</p>
                    </div>
                  </div>

                  {/* NFT Preview - Better spacing and alignment */}
                  {nftDetails && (
                    <div className="bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-2xl p-6 border border-blue-500/20 mt-8">
                      <h3 className="text-xl font-semibold text-white flex items-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        NFT Preview
                      </h3>
                      <div className="flex items-center">
                        <div className="relative flex-shrink-0">
                          <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-xl">
                            <img
                              src={nftDetails.image}
                              alt="NFT Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2 border-3 border-[#1a1a23] shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-8 flex-1">
                          <p className="text-white font-bold text-2xl mb-3">{nftDetails.name}</p>
                          <div className="flex items-center space-x-3 mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                              Verified Owner
                            </span>
                          </div>
                          <p className="text-gray-400 text-base">Ready to list on marketplace</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button - Better spacing */}
                <div className="pt-10 border-t border-gray-800/50 mt-10">
                  <button
                    type="submit"
                    className={`w-full flex justify-center items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl transition-all duration-200 ${
                      isLoading || !nftDetails
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-70'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white transform hover:translate-y-[-2px] hover:shadow-blue-900/50'
                    }`}
                    disabled={isLoading || !nftDetails}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Listing
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6 text-center">
                    <Link to="/explore" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">
                      ← Cancel and return to explore
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side: Info Panel - Cleaner layout */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="sticky top-24 space-y-6">
              {/* Listing Information Card */}
              <div className="bg-[#1a1a23] rounded-2xl border border-gray-800/50 shadow-xl p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-white">Listing Info</h2>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-300 leading-relaxed">Free listing, only pay gas fees</p>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-300 leading-relaxed">Minimum price: {MIN_LISTING_FEE} USDT</p>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-300 leading-relaxed">Marketplace approval required</p>
                  </div>
                </div>
              </div>

              {/* ThirdWeb Guide - Compact version */}
              <div className="bg-gradient-to-br from-purple-800/30 to-indigo-700/30 rounded-2xl p-6 border border-purple-500/20 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-white">Need an NFT?</h2>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Create your NFT using ThirdWeb's no-code platform:
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-xs text-white font-bold flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    <span>Visit ThirdWeb Dashboard</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-xs text-white font-bold flex items-center justify-center mr-3 flex-shrink-0">2</span>
                    <span>Deploy NFT Collection</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-xs text-white font-bold flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    <span>Mint your NFT</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-xs text-white font-bold flex items-center justify-center mr-3 flex-shrink-0">4</span>
                    <span>Copy contract details</span>
                  </div>
                </div>

                <a href="https://thirdweb.com/dashboard" target="_blank" rel="noopener noreferrer" className="block mt-6 bg-purple-600/30 text-purple-300 hover:bg-purple-600/40 px-4 py-3 rounded-xl text-sm text-center font-semibold transition-colors border border-purple-600/20 hover:border-purple-500/30">
                  Open ThirdWeb Dashboard →
                </a>
              </div>

              {/* Quick Tips - Compact */}
              <div className="bg-gradient-to-br from-blue-800/30 to-indigo-700/30 rounded-2xl p-6 border border-blue-500/20 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-white">Quick Tips</h2>
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                  <p>• Use Sepolia testnet</p>
                  <p>• Ensure you own the NFT</p>
                  <p>• Set competitive pricing</p>
                  <p>• Have ETH for gas fees</p>
                </div>

                <a href="https://sepolia.etherscan.io/" target="_blank" rel="noopener noreferrer" className="block mt-6 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-4 py-3 rounded-xl text-sm text-center font-semibold transition-colors border border-blue-600/20 hover:border-blue-500/30">
                  View on Etherscan →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
