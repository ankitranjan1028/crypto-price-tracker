// // // src/components/CryptoTable.jsx
// // import { useEffect, useRef, useState, useMemo } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { 
// //   selectAllCryptos, 
// //   selectCryptoLoading, 
// //   selectCryptoError,
// //   selectLastUpdated
// // } from '../features/crypto/cryptoSlice';
// // import { fetchCryptoData, WebSocketSimulator } from '../features/crypto/cryptoThunks';
// // import CryptoRow from './CryptoRow';
// // import CryptoFilters from './CryptoFilters';

// // const CryptoTable = () => {
// //   const dispatch = useDispatch();
// //   const cryptos = useSelector(selectAllCryptos);
// //   const loading = useSelector(selectCryptoLoading);
// //   const error = useSelector(selectCryptoError);
// //   const lastUpdated = useSelector(selectLastUpdated);
// //   const webSocketRef = useRef(null);
  
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [sortConfig, setSortConfig] = useState({ 
// //     field: 'market_cap_rank', 
// //     direction: 'asc' 
// //   });
// //   const perPage = 100; // Show all 100 cryptocurrencies
  
// //   useEffect(() => {
// //     const API_KEY = import.meta.env.VITE_API_KEY;
    
// //     // Fetch all 100 cryptocurrencies at once
// //     dispatch(fetchCryptoData('usd', API_KEY, 1, perPage));
    
// //     // Setup WebSocket simulator
// //     webSocketRef.current = new WebSocketSimulator(dispatch);
    
// //     return () => {
// //       // Cleanup on unmount
// //       if (webSocketRef.current) {
// //         webSocketRef.current.disconnect();
// //       }
// //     };
// //   }, [dispatch]);
  
// //   useEffect(() => {
// //     // Start WebSocket simulation once we have data
// //     if (cryptos.length > 0 && webSocketRef.current) {
// //       webSocketRef.current.connect();
// //     }
// //   }, [cryptos.length]);

// //   // Assign serial numbers to each crypto before any filtering or sorting
// //   const cryptosWithSerialNumbers = useMemo(() => {
// //     if (!cryptos.length) return [];
    
// //     // Create a copy of the cryptocurrencies with fixed serial numbers based on their position
// //     return cryptos.map((crypto, index) => ({
// //       ...crypto,
// //       // Store the serial number that won't change with sorting/filtering
// //       serialNumber: index + 1
// //     }));
// //   }, [cryptos]);

// //   // Filter and sort the cryptocurrencies
// //   const filteredCryptos = useMemo(() => {
// //     if (!cryptosWithSerialNumbers.length) return [];
    
// //     let result = [...cryptosWithSerialNumbers];
    
// //     // Apply search filter
// //     if (searchTerm) {
// //       const term = searchTerm.toLowerCase();
// //       result = result.filter(crypto => 
// //         crypto.name.toLowerCase().includes(term) || 
// //         crypto.symbol.toLowerCase().includes(term)
// //       );
// //     }
    
// //     // Apply sorting
// //     result.sort((a, b) => {
// //       let aValue = a[sortConfig.field];
// //       let bValue = b[sortConfig.field];
      
// //       // Handle null or undefined values
// //       if (aValue === null || aValue === undefined) aValue = -Infinity;
// //       if (bValue === null || bValue === undefined) bValue = -Infinity;
      
// //       // For string values
// //       if (typeof aValue === 'string' && typeof bValue === 'string') {
// //         return sortConfig.direction === 'asc' 
// //           ? aValue.localeCompare(bValue) 
// //           : bValue.localeCompare(aValue);
// //       }
      
// //       // For numeric values
// //       return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
// //     });
    
// //     return result;
// //   }, [cryptosWithSerialNumbers, searchTerm, sortConfig]);

// //   const handleFilterChange = (term) => {
// //     setSearchTerm(term);
// //   };

// //   const handleSortChange = (config) => {
// //     setSortConfig(config);
// //   };

// //   if (loading && cryptos.length === 0) {
// //     return <div className="flex justify-center p-8">Loading crypto data...</div>;
// //   }

// //   if (error) {
// //     return <div className="text-red-500 p-4">Error: {error}</div>;
// //   }

// //   // Text showing how many cryptocurrencies are displayed
// //   const displayCount = filteredCryptos.length;
// //   const rangeText = `Showing ${displayCount} ${displayCount === 1 ? 'cryptocurrency' : 'cryptocurrencies'}`;

// //   return (
// //     <div>
// //       <CryptoFilters 
// //         onFilterChange={handleFilterChange} 
// //         onSortChange={handleSortChange} 
// //       />
      
// //       <div className="flex justify-between items-center mb-4">
// //         <div className="text-sm text-gray-500">
// //           Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
// //         </div>
// //         <div className="flex items-center space-x-4">
// //           <span className="text-sm text-gray-600">
// //             {rangeText}
// //           </span>
// //         </div>
// //       </div>
      
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full bg-white">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="py-2 px-4 text-left">#</th>
// //               <th className="py-2 px-4 text-left">Logo</th>
// //               <th className="py-2 px-4 text-left">Name</th>
// //               <th className="py-2 px-4 text-left">Symbol</th>
// //               <th className="py-2 px-4 text-right">Price</th>
// //               <th className="py-2 px-4 text-right">1h %</th>
// //               <th className="py-2 px-4 text-right">24h %</th>
// //               <th className="py-2 px-4 text-right">7d %</th>
// //               <th className="py-2 px-4 text-right">Market Cap</th>
// //               <th className="py-2 px-4 text-right">24h Volume</th>
// //               <th className="py-2 px-4 text-right">Circulating Supply</th>
// //               <th className="py-2 px-4 text-right">Max Supply</th>
// //               <th className="py-2 px-4 text-center">7D Chart</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredCryptos.map((crypto) => (
// //               <CryptoRow 
// //                 key={crypto.id} 
// //                 crypto={crypto}
// //                 // Use the pre-assigned serialNumber that doesn't change with sorting
// //                 index={crypto.serialNumber}
// //               />
// //             ))}
// //             {filteredCryptos.length === 0 && (
// //               <tr>
// //                 <td colSpan="13" className="py-8 text-center text-gray-500">
// //                   No cryptocurrencies found matching your search criteria.
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CryptoTable;

// // src/components/CryptoTable.jsx
// import { useEffect, useRef, useState, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   selectAllCryptos, 
//   selectCryptoLoading, 
//   selectCryptoError,
//   selectLastUpdated
// } from '../features/crypto/cryptoSlice';
// import { fetchCryptoData, WebSocketSimulator } from '../features/crypto/cryptoThunks';
// import CryptoRow from './CryptoRow';
// import CryptoFilters from './CryptoFilters';

// const CryptoTable = () => {
//   const dispatch = useDispatch();
//   const cryptos = useSelector(selectAllCryptos);
//   const loading = useSelector(selectCryptoLoading);
//   const error = useSelector(selectCryptoError);
//   const lastUpdated = useSelector(selectLastUpdated);
//   const webSocketRef = useRef(null);
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState({ 
//     field: 'market_cap_rank', 
//     direction: 'asc' 
//   });
//   const perPage = 100; // Show all 100 cryptocurrencies
  
//   useEffect(() => {
//     const API_KEY = import.meta.env.VITE_API_KEY;
    
//     // Fetch all 100 cryptocurrencies at once
//     dispatch(fetchCryptoData('usd', API_KEY, 1, perPage));
    
//     // Setup WebSocket simulator
//     webSocketRef.current = new WebSocketSimulator(dispatch);
    
//     return () => {
//       // Cleanup on unmount
//       if (webSocketRef.current) {
//         webSocketRef.current.disconnect();
//       }
//     };
//   }, [dispatch]);
  
//   useEffect(() => {
//     // Start WebSocket simulation once we have data
//     if (cryptos.length > 0 && webSocketRef.current) {
//       webSocketRef.current.connect();
//     }
//   }, [cryptos.length]);

//   // Assign serial numbers to each crypto before any filtering or sorting
//   const cryptosWithSerialNumbers = useMemo(() => {
//     if (!cryptos.length) return [];
    
//     // Create a copy of the cryptocurrencies with fixed serial numbers based on their position
//     return cryptos.map((crypto, index) => ({
//       ...crypto,
//       // Store the serial number that won't change with sorting/filtering
//       serialNumber: index + 1
//     }));
//   }, [cryptos]);

//   // Filter and sort the cryptocurrencies
//   const filteredCryptos = useMemo(() => {
//     if (!cryptosWithSerialNumbers.length) return [];
    
//     let result = [...cryptosWithSerialNumbers];
    
//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(crypto => 
//         crypto.name.toLowerCase().includes(term) || 
//         crypto.symbol.toLowerCase().includes(term)
//       );
//     }
    
//     // Apply sorting
//     result.sort((a, b) => {
//       let aValue = a[sortConfig.field];
//       let bValue = b[sortConfig.field];
      
//       // Handle null or undefined values
//       if (aValue === null || aValue === undefined) aValue = -Infinity;
//       if (bValue === null || bValue === undefined) bValue = -Infinity;
      
//       // For string values
//       if (typeof aValue === 'string' && typeof bValue === 'string') {
//         return sortConfig.direction === 'asc' 
//           ? aValue.localeCompare(bValue) 
//           : bValue.localeCompare(aValue);
//       }
      
//       // For numeric values
//       return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
//     });
    
//     return result;
//   }, [cryptosWithSerialNumbers, searchTerm, sortConfig]);

//   const handleFilterChange = (term) => {
//     setSearchTerm(term);
//   };

//   const handleSortChange = (config) => {
//     setSortConfig(config);
//   };

//   if (loading && cryptos.length === 0) {
//     return <div className="flex justify-center p-8">Loading crypto data...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500 p-4">Error: {error}</div>;
//   }

//   // Text showing how many cryptocurrencies are displayed
//   const displayCount = filteredCryptos.length;
//   const rangeText = `Showing ${displayCount} ${displayCount === 1 ? 'cryptocurrency' : 'cryptocurrencies'}`;

//   return (
//     <div>
//       <CryptoFilters 
//         onFilterChange={handleFilterChange} 
//         onSortChange={handleSortChange} 
//       />
      
//       <div className="flex justify-between items-center mb-4">
//         <div className="text-sm text-gray-500">
//           Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-gray-600">
//             {rangeText}
//           </span>
//         </div>
//       </div>
      
//       <div className="w-full">
//         <table className="w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-2 px-2 text-left">#</th>
//               <th className="py-2 px-2 text-left">Name</th>
//               <th className="py-2 px-2 text-right">Price</th>
//               <th className="py-2 px-2 text-right">1h %</th>
//               <th className="py-2 px-2 text-right">24h %</th>
//               <th className="py-2 px-2 text-right">7d %</th>
//               <th className="py-2 px-2 text-right">Market Cap</th>
//               <th className="py-2 px-2 text-right">24h Volume</th>
//               <th className="py-2 px-2 text-right">Supply</th>
//               <th className="py-2 px-2 text-center">7D Chart</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredCryptos.map((crypto) => (
//               <CompactCryptoRow 
//                 key={crypto.id} 
//                 crypto={crypto}
//                 index={crypto.serialNumber}
//               />
//             ))}
//             {filteredCryptos.length === 0 && (
//               <tr>
//                 <td colSpan="10" className="py-8 text-center text-gray-500">
//                   No cryptocurrencies found matching your search criteria.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // New compact row component that combines logo, name, and symbol
// const CompactCryptoRow = ({ crypto, index }) => {
//   // Determine color classes based on price changes
//   const getChangeColorClass = (value) => {
//     if (!value && value !== 0) return '';
//     return value > 0 ? 'text-green-500' : 'text-red-500';
//   };

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 8,
//     }).format(value);
//   };

//   const formatNumber = (value) => {
//     if (!value && value !== 0) return 'N/A';
    
//     // Format with appropriate suffixes for large numbers
//     if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
//     if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
//     if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    
//     return value.toLocaleString();
//   };

//   const formatPercentage = (value) => {
//     if (!value && value !== 0) return 'N/A';
//     return `${value.toFixed(2)}%`;
//   };

//   return (
//     <tr className="border-b hover:bg-gray-50">
//       <td className="py-2 px-2">{index}</td>
      
//       {/* Combined name column with logo, name, and symbol */}
//       <td className="py-2 px-2">
//         <div className="flex items-center">
//           <img 
//             src={crypto.image} 
//             alt={crypto.name} 
//             className="w-6 h-6 mr-2" 
//           />
//           <div>
//             <div className="font-medium">{crypto.name}</div>
//             <div className="text-xs text-gray-500 uppercase">{crypto.symbol}</div>
//           </div>
//         </div>
//       </td>
      
//       <td className="py-2 px-2 text-right">{formatCurrency(crypto.current_price)}</td>
      
//       <td className={`py-2 px-2 text-right ${getChangeColorClass(crypto.price_change_percentage_1h_in_currency)}`}>
//         {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
//       </td>
      
//       <td className={`py-2 px-2 text-right ${getChangeColorClass(crypto.price_change_percentage_24h_in_currency)}`}>
//         {formatPercentage(crypto.price_change_percentage_24h_in_currency)}
//       </td>
      
//       <td className={`py-2 px-2 text-right ${getChangeColorClass(crypto.price_change_percentage_7d_in_currency)}`}>
//         {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
//       </td>
      
//       <td className="py-2 px-2 text-right">{formatCurrency(crypto.market_cap)}</td>
//       <td className="py-2 px-2 text-right">{formatCurrency(crypto.total_volume)}</td>
//       <td className="py-2 px-2 text-right">{formatNumber(crypto.circulating_supply)}</td>
      
//       <td className="py-2 px-2">
//         {crypto.sparkline_in_7d && crypto.sparkline_in_7d.price ? (
//           <SparklineChart
//             data={crypto.sparkline_in_7d.price}
//             color={crypto.price_change_percentage_7d_in_currency >= 0 ? '#10B981' : '#EF4444'}
//             width={100}
//             height={30}
//           />
//         ) : (
//           <div className="h-8 w-full flex items-center justify-center text-gray-400 text-xs">No data</div>
//         )}
//       </td>
//     </tr>
//   );
// };

// // SparklineChart component included inline for completeness
// const SparklineChart = ({ data, color = '#10B981', width = 100, height = 30 }) => {
//   if (!data || data.length === 0) {
//     return <div className="text-xs text-gray-400">No chart data</div>;
//   }

//   // Find min and max for scaling
//   const min = Math.min(...data);
//   const max = Math.max(...data);
//   const range = max - min || 1; // Prevent division by zero

//   // Scale the data points to fit the height
//   const scaledData = data.map(value => height - ((value - min) / range * height));
  
//   // Calculate points for the SVG path
//   const points = scaledData.map((point, index) => {
//     const x = (index / (data.length - 1)) * width;
//     return `${x},${point}`;
//   }).join(' ');

//   return (
//     <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
//       <polyline
//         points={points}
//         fill="none"
//         stroke={color}
//         strokeWidth="1.5"
//       />
//     </svg>
//   );
// };

// export default CryptoTable;






// src/components/CryptoTable.jsx
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
  const perPage = 100; // Show all 100 cryptocurrencies
  
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    
    // Fetch all 100 cryptocurrencies at once
    dispatch(fetchCryptoData('usd', API_KEY, 1, perPage));
    
    // Setup WebSocket simulator
    webSocketRef.current = new WebSocketSimulator(dispatch);
    
    return () => {
      // Cleanup on unmount
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
      }
    };
  }, [dispatch]);
  
  useEffect(() => {
    // Start WebSocket simulation once we have data
    if (cryptos.length > 0 && webSocketRef.current) {
      webSocketRef.current.connect();
    }
  }, [cryptos.length]);

  // Assign serial numbers to each crypto before any filtering or sorting
  const cryptosWithSerialNumbers = useMemo(() => {
    if (!cryptos.length) return [];
    
    // Create a copy of the cryptocurrencies with fixed serial numbers based on their position
    return cryptos.map((crypto, index) => ({
      ...crypto,
      // Store the serial number that won't change with sorting/filtering
      serialNumber: index + 1
    }));
  }, [cryptos]);

  // Filter and sort the cryptocurrencies
  const filteredCryptos = useMemo(() => {
    if (!cryptosWithSerialNumbers.length) return [];
    
    let result = [...cryptosWithSerialNumbers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(crypto => 
        crypto.name.toLowerCase().includes(term) || 
        crypto.symbol.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      // Handle null or undefined values
      if (aValue === null || aValue === undefined) aValue = -Infinity;
      if (bValue === null || bValue === undefined) bValue = -Infinity;
      
      // For string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // For numeric values
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

  // Text showing how many cryptocurrencies are displayed
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
      
      {/* Table for medium and large screens */}
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
      
      {/* Card grid for small screens */}
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

// Table row component for medium and large screens
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

//   const formatNumber = (value) => {
//     if (!value && value !== 0) return 'N/A';
//     if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
//     if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
//     if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
//     return value.toLocaleString();
//   };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  // Determine color classes based on price changes
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

// Card component for small screens
const CryptoCard = ({ crypto, index }) => {
  // Format helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

//   const formatNumber = (value) => {
//     if (!value && value !== 0) return 'N/A';
//     if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
//     if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
//     if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
//     return value.toLocaleString();
//   };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  // Determine color classes based on price changes
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

// SparklineChart component
const SparklineChart = ({ data, color = '#10B981', width, height }) => {
  if (!data || data.length === 0) {
    return <div className="text-xs text-gray-400">No chart data</div>;
  }

  // Find min and max for scaling
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Prevent division by zero

  // Scale the data points to fit the height
  const scaledData = data.map(value => height - ((value - min) / range * height));
  
  // Calculate points for the SVG path
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