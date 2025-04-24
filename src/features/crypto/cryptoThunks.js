// src/features/crypto/cryptoThunks.js
import { 
    fetchCryptosStart, 
    fetchCryptosSuccess, 
    fetchCryptosFailed,
    simulateUpdate
  } from './cryptoSlice';
  
  // WebSocket simulator
  export class WebSocketSimulator {
    constructor(dispatch) {
      this.dispatch = dispatch;
      this.intervalId = null;
    }
  
    connect() {
      if (this.intervalId) return;
      
      this.intervalId = setInterval(() => {
        this.dispatch(simulateUpdate());
      }, 1500); // Update every 1.5 seconds
    }
  
    disconnect() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }
  
  // Thunk for fetching initial crypto data
  export const fetchCryptoData = (currency = 'usd', apiKey, page = 1, perPage = 100) => async (dispatch) => {
    try {
      dispatch(fetchCryptosStart());
      
      const options = {
        method: 'GET',
        headers: { 
          'accept': 'application/json',
          'x-cg-demo-api-key': apiKey
        }
      };
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`,
        options
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      dispatch(fetchCryptosSuccess(data));
      
      return data;
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      dispatch(fetchCryptosFailed(error.message));
      throw error;
    }
  };