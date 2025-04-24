import { memo } from 'react';
import SparklineChart from './SparklineChart';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);
};

const formatNumber = (value) => {
  if (!value && value !== 0) return 'N/A';
  
  // Format with appropriate suffixes for large numbers
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  
  return value.toLocaleString();
};

const formatPercentage = (value) => {
  if (!value && value !== 0) return 'N/A';
  return `${value.toFixed(2)}%`;
};

const CryptoRow = ({ crypto, index }) => {
  // Determine color classes based on price changes
  const getChangeColorClass = (value) => {
    if (!value && value !== 0) return '';
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2 px-4">{index}</td>
      <td className="py-2 px-4">
        <img 
          src={crypto.image}
          alt={crypto.name}
          className="w-6 h-6"
        />
      </td>
      <td className="py-2 px-4 font-medium">{crypto.name}</td>
      <td className="py-2 px-4 text-gray-500 uppercase">{crypto.symbol}</td>
      <td className="py-2 px-4 text-right">{formatCurrency(crypto.current_price)}</td>
      
      <td className={`py-2 px-4 text-right ${getChangeColorClass(crypto.price_change_percentage_1h_in_currency)}`}>
        {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
      </td>
      
      <td className={`py-2 px-4 text-right ${getChangeColorClass(crypto.price_change_percentage_24h_in_currency)}`}>
        {formatPercentage(crypto.price_change_percentage_24h_in_currency)}
      </td>
      
      <td className={`py-2 px-4 text-right ${getChangeColorClass(crypto.price_change_percentage_7d_in_currency)}`}>
        {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
      </td>
      
      <td className="py-2 px-4 text-right">{formatCurrency(crypto.market_cap)}</td>
      <td className="py-2 px-4 text-right">{formatCurrency(crypto.total_volume)}</td>
      <td className="py-2 px-4 text-right">{formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}</td>
      <td className="py-2 px-4 text-right">{crypto.max_supply ? formatNumber(crypto.max_supply) : 'N/A'}</td>
      
      <td className="py-2 px-4">
        {crypto.sparkline_in_7d && crypto.sparkline_in_7d.price ? (
          <SparklineChart
            data={crypto.sparkline_in_7d.price}
            color={crypto.price_change_percentage_7d_in_currency >= 0 ? '#10B981' : '#EF4444'}
          />
        ) : (
          <div className="h-10 w-full flex items-center justify-center text-gray-400">No data</div>
        )}
      </td>
    </tr>
  );
};

export default memo(CryptoRow);