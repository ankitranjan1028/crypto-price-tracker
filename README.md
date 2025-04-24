# 🚀 Crypto Price Tracker

A real-time cryptocurrency tracking web app built using **React**, **Redux Toolkit**, and **Tailwind CSS**, integrated with the **CoinGecko API**. This application displays live market data such as price, market cap, volume, and other metrics for various cryptocurrencies with search, sort, and pagination features.

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your_repo_url>
cd crypto-price-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory of your project and add your **CoinGecko API key**:

```env
VITE_API_KEY=your_coingecko_api_key
```

> **Note:** CoinGecko offers a free public API. If you're using the public version, the API key may not be needed.

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to view the app in your browser.

---

## 🛠️ Tech Stack

- **React** – Frontend UI library
- **Redux Toolkit** – State management
- **Tailwind CSS** – Utility-first styling framework
- **CoinGecko API** – Real-time crypto data source
- **Vite** – Lightning-fast dev server and bundler

---

## 🧱 Application Architecture

The project follows a **standard Redux-based architecture**:

### 🔹 Components
All UI elements like tables, filters, and rows are modularized React components.

### 🔹 Redux Store
Centralized application state using Redux Toolkit’s `configureStore()`.

### 🔹 Slices
Defined in `cryptoSlice.js` with reducers and actions to manage crypto-related state.

### 🔹 Thunks
Asynchronous actions (via `createAsyncThunk`) for API calls and data fetching.

### 🔹 WebSocket Simulator
Simulates real-time data updates to demonstrate dynamic state changes in a production-like environment.

---

## 📊 Features

- Real-time cryptocurrency data (simulated via WebSocket)
- Search and filter by name or symbol
- Sort by market cap, price, volume, etc.
- Paginated view for better performance
- Responsive design with Tailwind CSS

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
