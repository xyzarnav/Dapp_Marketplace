import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const featuredContent = [
  {
    id: "1",
    name: "NFT Marketplace",
    image:
      "https://cdn.dribbble.com/userupload/12645018/file/original-192efb68812fd10d9c2c4c143fc75e5d.jpg?resize=1600x1200&vertical=center",
    description: "Discover, collect, and sell extraordinary NFTs",
    buttonText: "Explore NFTs",
    buttonLink: "/explore",
  },
  {
    id: "2",
    name: "Freelance Services",
    image:
      "https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&w=1000",
    description: "Find skilled freelancers for your blockchain projects",
    buttonText: "Find Services",
    buttonLink: "/freelance",
  },
  {
    id: "3",
    name: "Blockchain Jobs",
    image:
      "https://images.prismic.io//intuzwebsite/8a4c1dbd-5361-4e2e-b147-d841c27f444c_Own_Cryptocurrency_Main.png?w=1200&q=75&auto=format,compress&fm=png8",
    description: "Get paid in crypto for your skills and expertise",
    buttonText: "Find Jobs",
    buttonLink: "/jobs",
  },
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isAutoPlaying) {
      interval = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % featuredContent.length);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying]);
  
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-playing after some time
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative h-screen max-h-[800px] overflow-hidden bg-[#141416]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-800/20 z-0"></div>

      {/* Featured Images */}
      <div className="absolute inset-0 flex items-center justify-center">
        {featuredContent.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl">
          {activeIndex === 0 ? (
            <>Discover, collect, and sell extraordinary NFTs</>
          ) : activeIndex === 1 ? (
            <>Find expert blockchain freelancers</>
          ) : (
            <>Work on exciting blockchain projects</>
          )}
        </h1>
        <p className="text-xl text-white/90 mb-10 max-w-2xl">
          {featuredContent[activeIndex].description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to={featuredContent[activeIndex].buttonLink}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
          >
            {featuredContent[activeIndex].buttonText}
          </Link>
          {activeIndex === 0 ? (
            <Link
              to="/create"
              className="px-8 py-3 bg-white text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition"
            >
              Create NFT
            </Link>
          ) : activeIndex === 1 ? (
            <Link
              to="/post-job"
              className="px-8 py-3 bg-white text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition"
            >
              Post a Job
            </Link>
          ) : (
            <Link
              to="/create-service"
              className="px-8 py-3 bg-white text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition"
            >
              Offer a Service
            </Link>
          )}
        </div>

        {/* Featured info */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg max-w-md">
            <p className="text-gray-400 text-sm">Featured</p>
            <h2 className="text-xl font-bold text-white mb-1">
              {featuredContent[activeIndex].name}
            </h2>
            <p className="text-white/80">
              {featuredContent[activeIndex].description}
            </p>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
        {featuredContent.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
