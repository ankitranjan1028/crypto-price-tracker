import { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectAllCryptos, 
  selectCryptoLoading, 
  selectCryptoError,
  selectLastUpdated
} from '../features/crypto/cryptoSlice';
import { fetchCryptoData, WebSocketSimulator } from '../features/crypto/cryptoThunks';
import CryptoFilters from './CryptoFilters';

const CryptoTable = () => {
  const dispatch = useDispatch();
  const cryptos = useSelector(selectAllCryptos);
  const loading = useSelector(selectCryptoLoading);
  const error = useSelector(selectCryptoError);
  const lastUpdated = useSelector(selectLastUpdated);
  const webSocketRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ 
    field: 'market_cap_rank', 
    direction: 'asc' 
  });
  const perPage = 100; 
  
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_API_KEY;

    dispatch(fetchCryptoData('usd', API_KEY, 1, perPage));
    
    webSocketRef.current = new WebSocketSimulator(dispatch);
    
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
      }
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (cryptos.length > 0 && webSocketRef.current) {
      webSocketRef.current.connect();
    }
  }, [cryptos.length]);

  const cryptosWithSerialNumbers = useMemo(() => {
    if (!cryptos.length) return [];
    
    return cryptos.map((crypto, index) => ({
      ...crypto,
      serialNumber: index + 1
    }));
  }, [cryptos]);

  const filteredCryptos = useMemo(() => {
    if (!cryptosWithSerialNumbers.length) return [];
    
    let result = [...cryptosWithSerialNumbers];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(crypto => 
        crypto.name.toLowerCase().includes(term) || 
        crypto.symbol.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      if (aValue === null || aValue === undefined) aValue = -Infinity;
      if (bValue === null || bValue === undefined) bValue = -Infinity;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return result;
  }, [cryptosWithSerialNumbers, searchTerm, sortConfig]);

  const handleFilterChange = (term) => {
    setSearchTerm(term);
  };

  const handleSortChange = (config) => {
    setSortConfig(config);
  };

  if (loading && cryptos.length === 0) {
    return <div className="flex justify-center p-8">Loading crypto data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  const displayCount = filteredCryptos.length;
  const rangeText = `Showing ${displayCount} ${displayCount === 1 ? 'cryptocurrency' : 'cryptocurrencies'}`;

  return (
    <div>
      <CryptoFilters 
        onFilterChange={handleFilterChange} 
        onSortChange={handleSortChange} 
      />
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {rangeText}
          </span>
        </div>
      </div>
   
      <div className="hidden md:block">
        <table className="w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-2 text-left">#</th>
              <th className="py-2 px-2 text-left">Name</th>
              <th className="py-2 px-2 text-right">Price</th>
              <th className="py-2 px-2 text-right">1h %</th>
              <th className="py-2 px-2 text-right">24h %</th>
              <th className="py-2 px-2 text-right">7d %</th>
              <th className="py-2 px-2 text-right">Market Cap</th>
              <th className="py-2 px-2 text-right">Volume</th>
              <th className="py-2 px-2 text-center">7D Chart</th>
            </tr>
          </thead>
          <tbody>
            {filteredCryptos.map((crypto) => (
              <CryptoTableRow 
                key={crypto.id} 
                crypto={crypto}
                index={crypto.serialNumber}
              />
            ))}
            {filteredCryptos.length === 0 && (
              <tr>
                <td colSpan="9" className="py-8 text-center text-gray-500">
                  No cryptocurrencies found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {filteredCryptos.length === 0 ? (
          <div className="text-center py-8 bg-white rounded shadow text-gray-500">
            No cryptocurrencies found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredCryptos.map((crypto) => (
              <CryptoCard 
                key={crypto.id} 
                crypto={crypto}
                index={crypto.serialNumber}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CryptoTableRow = ({ crypto, index }) => {
  // Format helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  const getChangeColorClass = (value) => {
    if (!value && value !== 0) return '';
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2 px-2 text-left">{index}</td>
      <td className="py-2 px-2 text-left">
        <div className="flex items-center">
          <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
          <div>
            <div className="font-medium">{crypto.name}</div>
            <div className="text-xs text-gray-500 uppercase">{crypto.symbol}</div>
          </div>
        </div>
      </td>
      <td className="py-2 px-2 text-right">{formatCurrency(crypto.current_price)}</td>
      <td className={`py-2 px-2 text-right ${getChangeColorClass(crypto.price_change_percentage_1h_in_currency)}`}>
        {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
      </td>
      <td className={`py-2 px-2 text-right ${getChangeColorClass(crypto.price_change_percentage_24h_in_currency)}`}>
        {formatPercentage(crypto.price_change_percentage_24h_in_currency)}
      </td>
      <td className={`py-2 px-2 text-right ${getChangeColorClass(crypto.price_change_percentage_7d_in_currency)}`}>
        {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
      </td>
      <td className="py-2 px-2 text-right">{formatCurrency(crypto.market_cap)}</td>
      <td className="py-2 px-2 text-right">{formatCurrency(crypto.total_volume)}</td>
      <td className="py-2 px-2 text-center">
        {crypto.sparkline_in_7d && crypto.sparkline_in_7d.price ? (
          <SparklineChart
            data={crypto.sparkline_in_7d.price}
            color={crypto.price_change_percentage_7d_in_currency >= 0 ? '#10B981' : '#EF4444'}
            width={100}
            height={30}
          />
        ) : (
          <div className="h-8 w-full flex items-center justify-center text-gray-400 text-xs">No data</div>
        )}
      </td>
    </tr>
  );
};

const CryptoCard = ({ crypto, index }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  const getChangeColorClass = (value) => {
    if (!value && value !== 0) return '';
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">#{index}</span>
          <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
          <div>
            <span className="font-medium">{crypto.name}</span>
            <span className="text-xs text-gray-500 uppercase ml-1">({crypto.symbol})</span>
          </div>
        </div>
        <div className="text-right font-medium">
          {formatCurrency(crypto.current_price)}
        </div>
      </div>
      
      <div className="flex justify-between mb-3">
        <div className="flex space-x-2">
          <div className="text-center">
            <div className="text-xs text-gray-500">1h</div>
            <div className={`text-sm ${getChangeColorClass(crypto.price_change_percentage_1h_in_currency)}`}>
              {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">24h</div>
            <div className={`text-sm ${getChangeColorClass(crypto.price_change_percentage_24h_in_currency)}`}>
              {formatPercentage(crypto.price_change_percentage_24h_in_currency)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">7d</div>
            <div className={`text-sm ${getChangeColorClass(crypto.price_change_percentage_7d_in_currency)}`}>
              {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div>
          <div className="text-xs text-gray-500">Market Cap</div>
          <div>{formatCurrency(crypto.market_cap)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Volume (24h)</div>
          <div>{formatCurrency(crypto.total_volume)}</div>
        </div>
      </div>
      
      <div className="mt-3">
        {crypto.sparkline_in_7d && crypto.sparkline_in_7d.price ? (
          <SparklineChart
            data={crypto.sparkline_in_7d.price}
            color={crypto.price_change_percentage_7d_in_currency >= 0 ? '#10B981' : '#EF4444'}
            width={280}
            height={40}
          />
        ) : (
          <div className="h-10 w-full flex items-center justify-center text-gray-400 text-xs">No chart data available</div>
        )}
      </div>
    </div>
  );
};

const SparklineChart = ({ data, color = '#10B981', width, height }) => {
  if (!data || data.length === 0) {
    return <div className="text-xs text-gray-400">No chart data</div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; 

  const scaledData = data.map(value => height - ((value - min) / range * height));

  const points = scaledData.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    return `${x},${point}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default CryptoTable;