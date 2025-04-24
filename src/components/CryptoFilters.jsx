// src/components/CryptoFilters.jsx
import { useState } from 'react';

const CryptoFilters = ({ onFilterChange, onSortChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('market_cap_rank');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortField(value);
    onSortChange({ field: value, direction: sortDirection });
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    onSortChange({ field: sortField, direction: newDirection });
  };

  return (
    <div className="mb-6 bg-white p-4 rounded shadow">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="flex-1 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="sort-select" className="mr-2 text-sm text-gray-600">Sort by:</label>
            <select
              id="sort-select"
              value={sortField}
              onChange={handleSortChange}
              className="p-2 border rounded"
            >
              <option value="market_cap_rank">Rank</option>
              <option value="current_price">Price</option>
              <option value="price_change_percentage_24h_in_currency">24h %</option>
              <option value="market_cap">Market Cap</option>
              <option value="total_volume">Volume</option>
            </select>
          </div>
          
          <button
            onClick={toggleSortDirection}
            className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      {/* <div className="mt-4 flex flex-wrap gap-2">
        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">All</button>
        <button className="px-3 py-1 bg-gray-200 rounded text-sm">Top 100</button>
        <button className="px-3 py-1 bg-gray-200 rounded text-sm">Top Gainers</button>
        <button className="px-3 py-1 bg-gray-200 rounded text-sm">Top Losers</button>
        <button className="px-3 py-1 bg-gray-200 rounded text-sm">Recently Added</button>
      </div> */}
    </div>
  );
};

export default CryptoFilters;