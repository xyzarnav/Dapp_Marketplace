import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { useWallet } from "../hooks/useWallet";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isConnected, address, balance, connect, disconnect, isLoading, networkError } = useWallet();

  const handleConnectWallet = async () => {
    await connect();
  };

  const handleDisconnectWallet = () => {
    disconnect();
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="bg-[#141416] border-b border-gray-800 fixed w-full z-50">
      {/* Network error banner */}
      {networkError && (
        <div className="bg-red-500 text-white text-center py-1 text-sm">
          {networkError}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://cryptoflies.com/wp-content/uploads/2023/08/kraken-nft-marketplace-logo.jpg"
                alt="NFT Marketplace"
              />
              <span className="ml-2 text-xl font-bold text-white">
                Cyrpto<span className="text-blue-500">India</span>
              </span>
            </Link>

            <div className="hidden md:ml-8 md:flex md:items-center md:space-x-4">
              {/* NFT Marketplace links */}
              <div className="relative group">
                <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  Marketplace
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/explore"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Explore NFTs
                    </Link>
                    <Link
                      to="/collections"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Collections
                    </Link>
                    <Link
                      to="/stats"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Stats
                    </Link>
                  </div>
                </div>
              </div>

              {/* Freelancing links */}
              <div className="relative group">
                <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  Freelance
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/freelance"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Browse Services
                    </Link>
                    <Link
                      to="/jobs"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Find Jobs
                    </Link>
                    <Link
                      to="/post-job"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      Post a Job
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                to="/resources"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Resources
              </Link>
              <Link
                to="/create"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Create
              </Link>
            </div>
          </div>

          {/* Search, cart, profile */}
          <div className="flex items-center">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search items, jobs, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>

            {/* Jobs icon */}
            <Link
              to="/jobs"
              className="p-2 ml-2 rounded-full text-gray-400 hover:text-white"
            >
              <BriefcaseIcon className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 ml-2 rounded-full text-gray-400 hover:text-white"
            >
              <ShoppingBagIcon className="h-6 w-6" />
            </Link>

            {/* Connect Wallet / Profile */}
            {isConnected ? (
              <div className="ml-3 relative group">
                <button
                  type="button"
                  className="bg-gray-800 flex items-center text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Account options"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="text-white">{formatAddress(address)}</span>
                  <svg
                    className="ml-2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Fixed dropdown menu - always attached to parent button */}
                <div className="hidden group-hover:block absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  {/* Balance display */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm text-gray-400">Balance</p>
                    <div className="flex items-center mt-1">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/14446/14446252.png"
                        alt="USDT"
                        className="w-5 h-5 mr-2"
                      />
                      <p className="text-white font-medium">
                        {parseFloat(balance || "0").toFixed(2)} USDT
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/nfts"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Your NFTs
                  </Link>
                  <button
                    onClick={handleDisconnectWallet}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isLoading}
                className={`ml-4 px-4 py-2 rounded-lg ${
                  isLoading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                } text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">
                  {isMenuOpen ? "Close menu" : "Open menu"}
                </span>
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Marketplace section in mobile menu */}
          <div className="block px-3 py-2 text-base font-medium text-white border-b border-gray-700">
            Marketplace
          </div>
          <Link
            to="/explore"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore NFTs
          </Link>
          <Link
            to="/collections"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Collections
          </Link>
          <Link
            to="/stats"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Stats
          </Link>

          {/* Freelancing section in mobile menu */}
          <div className="block px-3 py-2 text-base font-medium text-white border-b border-gray-700 mt-4">
            Freelancing
          </div>
          <Link
            to="/freelance"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Browse Services
          </Link>
          <Link
            to="/jobs"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Find Jobs
          </Link>
          <Link
            to="/post-job"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Post a Job
          </Link>

          {/* Other navigation items */}
          <Link
            to="/resources"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Resources
          </Link>
          <Link
            to="/create"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Create
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="px-4">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search items, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>

            {!isConnected && (
              <button
                onClick={() => {
                  handleConnectWallet();
                  setIsMenuOpen(false);
                }}
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-lg ${
                  isLoading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                } text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
