import { Link } from 'react-router-dom';

type Category = {
  id: string;
  name: string;
  icon: string;
  image: string;
  color: string;
};

const categories: Category[] = [
  {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    image: 'https://i.seadn.io/gae/tTf5BzMSJl_8U9QIgbeEJr9B_MJTbMG8lHbHK1xbti-MR9YhOc0oQbePucYPKGrV5jxXM0MzZNUmh4oIyU1GBGiT4nUD7uOnJdF-?auto=format&w=1000',
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: 'collectibles',
    name: 'Collectibles',
    icon: '🧸',
    image: 'https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs?auto=format&w=1000',
    color: 'from-blue-500 to-green-500'
  },
  {
    id: 'domain-names',
    name: 'Domain Names',
    icon: '🌐',
    image: 'https://i.seadn.io/gcs/files/6bf46ff39cfbd8a917587bca36d49926.png?auto=format&w=1000',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    image: 'https://i.seadn.io/gcs/files/41c75920e8c15b73144b48c550aadcbf.jpg?auto=format&w=1000',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: '📸',
    image: 'https://i.seadn.io/gae/4YH3pAJ4-ybTCD6XkIiVGaJ5hiGWNkJ9mN-NNKiXBjTa7yaXFgGj89z_ESC281rYJNNYEBavjibeIPETx2VBYxVrPk21e7QsYflufw?auto=format&w=1000',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    image: 'https://i.seadn.io/gae/l8k2VXZ9Ygrn9THtVvkyt3YI1TFxoSV5LM48um4FrL2ZNZZULYaleZ6J1I9gHNikJp8DXHZGsC5SUZUVYJGYULNKUh0FXbHxN2f6?auto=format&w=1000',
    color: 'from-red-500 to-yellow-500'
  },
  {
    id: 'trading-cards',
    name: 'Trading Cards',
    icon: '🃏',
    image: 'https://i.seadn.io/gcs/files/de8e04d950e5b7aeaf01023623b5fa26.jpg?auto=format&w=1000',
    color: 'from-blue-400 to-indigo-600'
  },
  {
    id: 'virtual-worlds',
    name: 'Virtual Worlds',
    icon: '🌍',
    image: 'https://i.seadn.io/gae/Nt2sUm9YTX6xwIgiIQNJdDfRL7kT5AjnHxiMK-mSCxI_N08a3OTmOkAQ6KfQV2PCXB6MKBNYNssJnwG-8VrmFiAzbPKk5xKGWH9O?auto=format&w=1000',
    color: 'from-green-400 to-blue-500'
  }
];

const CategoryList = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
      {categories.map(category => (
        <Link 
          key={category.id}
          to={`/category/${category.id}`}
          className="relative rounded-xl overflow-hidden aspect-square group"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          {/* Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b ${category.color} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
            <span className="text-4xl mb-2">{category.icon}</span>
            <h3 className="font-bold text-lg text-center">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
