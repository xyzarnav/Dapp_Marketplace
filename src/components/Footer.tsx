import { Link } from 'react-router-dom';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log(`Subscribing email: ${email}`);
    setEmail('');
    // Show success message in real implementation
  };

  return (
    <footer className="bg-gradient-to-b from-[#141416] to-[#0c0c0e] border-t border-gray-800/30">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-b border-gray-800/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-lg">
            <h3 className="text-2xl font-bold text-white mb-2">
              Stay in the loop
            </h3>
            <p className="text-gray-400">
              Join our mailing list to stay in the loop with our newest feature
              releases, NFT drops, and tips and tricks for navigating the
              marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-10 w-10 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">C</span>
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                Crypto
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  India
                </span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              The world's largest digital marketplace for crypto collectibles
              and non-fungible tokens. Buy, sell, and discover exclusive digital
              items.
            </p>

            {/* Social icons with hover effects */}
            <div className="flex space-x-4">
              <a href="#" className="group">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transform transition-all hover:scale-110 hover:bg-blue-600">
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </div>
              </a>
              <a href="#" className="group">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transform transition-all hover:scale-110 hover:bg-pink-600">
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.878 2.525c.636-.247 1.363-.416 2.427-.465C10.372 2.013 10.72 2 12.155 2h.16z"
                      ></path>
                    <path
                      fillRule="evenodd"
                      d="M12.315 16a3.685 3.685 0 110-7.37 3.685 3.685 0 010 7.37zm0-9.316a5.631 5.631 0 100 11.262 5.631 5.631 0 000-11.262z"
                    ></path>
                    <circle cx="17.25" cy="6.75" r="1.125"></circle>
                  </svg>
                </div>
              </a>
              <a href="#" className="group">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transform transition-all hover:scale-110 hover:bg-indigo-600">
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.042-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"></path>
                  </svg>
                </div>
              </a>
              <a href="#" className="group">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transform transition-all hover:scale-110 hover:bg-red-600">
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Marketplace links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-6 relative after:absolute after:content-[''] after:left-0 after:-bottom-2 after:h-1 after:w-8 after:rounded-full after:bg-blue-500">
              Marketplace
            </h3>
            <ul className="space-y-4">
              {['All NFTs', 'Art', 'Collectibles', 'Music', 'Photography'].map(
                (item, i) => (
                  <li key={i}>
                    <Link
                      to={`/${
                        item === 'All NFTs'
                          ? 'explore'
                          : `category/${item.toLowerCase()}`
                      }`}
                      className="text-gray-400 hover:text-white transition duration-300 flex items-center group"
                    >
                      <span className="h-1 w-0 bg-blue-500 mr-0 rounded-full transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-6 relative after:absolute after:content-[''] after:left-0 after:-bottom-2 after:h-1 after:w-8 after:rounded-full after:bg-blue-500">
              Resources
            </h3>
            <ul className="space-y-4">
              {['Help Center', 'Platform Status', 'Partners', 'Blog', 'Newsletter'].map(
                (item, i) => (
                  <li key={i}>
                    <Link
                      to={`/${item
                        .toLowerCase()
                        .replace(' ', '-')}`}
                      className="text-gray-400 hover:text-white transition duration-300 flex items-center group"
                    >
                      <span className="h-1 w-0 bg-blue-500 mr-0 rounded-full transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-6 relative after:absolute after:content-[''] after:left-0 after:-bottom-2 after:h-1 after:w-8 after:rounded-full after:bg-blue-500">
              Company
            </h3>
            <ul className="space-y-4">
              {['About', 'Careers', 'Privacy Policy', 'Terms of Service'].map(
                (item, i) => (
                  <li key={i}>
                    <Link
                      to={`/${item
                        .toLowerCase()
                        .replace(' ', '-')
                        .replace(' of ', '-')}`}
                      className="text-gray-400 hover:text-white transition duration-300 flex items-center group"
                    >
                      <span className="h-1 w-0 bg-blue-500 mr-0 rounded-full transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-6 relative after:absolute after:content-[''] after:left-0 after:-bottom-2 after:h-1 after:w-8 after:rounded-full after:bg-blue-500">
              Support
            </h3>
            <div className="text-gray-400">
              <p className="mb-4">Have questions or need assistance?</p>
              <a
                href="mailto:support@cryptoindia.com"
                className="py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg inline-flex items-center transition duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800/30 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2023 CryptoIndia. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link to="/sitemap" className="hover:text-white transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
