// src/features/crypto/cryptoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assets: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Helper function to generate random price changes
const getRandomChange = () => {
  return (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2);
};

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    fetchCryptosStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCryptosSuccess: (state, action) => {
      // Map the incoming data to ensure all required fields exist
      state.assets = action.payload.map(coin => ({
        ...coin,
        price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency || 0,
        price_change_percentage_24h_in_currency: coin.price_change_percentage_24h || 0,
        price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency || 0,
      }));
      state.loading = false;
      state.lastUpdated = new Date().toISOString();
    },
    fetchCryptosFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    simulateUpdate: (state) => {
      // Only simulate updates for displayed cryptos to improve performance
      state.assets = state.assets.map(asset => {
        const priceChangePercent = getRandomChange();
        const newPrice = asset.current_price * (1 + priceChangePercent / 100);
        
        return {
          ...asset,
          current_price: newPrice,
          price_change_percentage_1h_in_currency: asset.price_change_percentage_1h_in_currency + getRandomChange() * 0.1,
          price_change_percentage_24h_in_currency: asset.price_change_percentage_24h_in_currency + getRandomChange() * 0.2,
          price_change_percentage_7d_in_currency: asset.price_change_percentage_7d_in_currency + getRandomChange() * 0.3,
          total_volume: asset.total_volume * (1 + (getRandomChange() * 0.5) / 100),
        };
      });
      state.lastUpdated = new Date().toISOString();
    }
  },
});

export const { 
  fetchCryptosStart, 
  fetchCryptosSuccess, 
  fetchCryptosFailed,
  simulateUpdate
} = cryptoSlice.actions;

// Selectors
export const selectAllCryptos = (state) => state.crypto.assets;
export const selectCryptoLoading = (state) => state.crypto.loading;
export const selectCryptoError = (state) => state.crypto.error;
export const selectLastUpdated = (state) => state.crypto.lastUpdated;

export default cryptoSlice.reducer;