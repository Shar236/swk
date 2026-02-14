import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';

interface ServiceCardProps {
  serviceName: string;
  description: string;
  price: number;
  category: string;
  extraInfo?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ serviceName, description, price, category, extraInfo }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border">
      <h3 className="text-lg font-semibold mb-2">{serviceName}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-sm text-gray-500 mb-2">Category: {category}</p>
      <p className="text-xl font-bold text-green-600">₹{price}</p>
      {extraInfo && <p className="text-sm text-gray-400 mt-2">{extraInfo}</p>}
    </div>
  );
};

const servicesData = [
  {
    serviceName: "Switch Repair",
    description: "Fix or replace faulty switches & sockets",
    price: 99,
    category: "electrician"
  },
  {
    serviceName: "Tap Repair",
    description: "Fix leaking taps and fittings",
    price: 149,
    category: "plumber"
  },
  {
    serviceName: "AC Service",
    description: "Basic AC cleaning and inspection",
    price: 299,
    category: "appliance repair"
  },
  {
    serviceName: "Wall Painting",
    description: "Single room paint service",
    price: 799,
    category: "painter"
  }
];

const ServiceMarketplace = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  // 🔥 Debounce (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // 🚀 Optimized Filtering + Sorting
  const filteredServices = useMemo(() => {
    let result = [...servicesData];

    // Search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((service) =>
        service.serviceName.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
      );
    }

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter(
        (service) => service.category === categoryFilter
      );
    }

    // Price Filter
    if (priceFilter === 'under200') {
      result = result.filter((service) => service.price < 200);
    }
    if (priceFilter === '200to500') {
      result = result.filter(
        (service) => service.price >= 200 && service.price <= 500
      );
    }
    if (priceFilter === 'above500') {
      result = result.filter((service) => service.price > 500);
    }

    // Sorting
    if (sortOption === 'low') {
      result.sort((a, b) => a.price - b.price);
    }
    if (sortOption === 'high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [debouncedSearch, categoryFilter, priceFilter, sortOption]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* 🔎 SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200"
          >
            <option value="all">All Categories</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="painter">Painter</option>
            <option value="appliance repair">Appliance Repair</option>
          </select>

          {/* Price Filter */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200"
          >
            <option value="all">All Prices</option>
            <option value="under200">Under ₹200</option>
            <option value="200to500">₹200 - ₹500</option>
            <option value="above500">Above ₹500</option>
          </select>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200"
          >
            <option value="default">Sort</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        {/* 📦 GRID */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20 text-lg">
            😔 No services found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceMarketplace;

export { ServiceCard };
