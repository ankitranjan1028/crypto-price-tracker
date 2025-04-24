// src/App.jsx
import { Provider } from 'react-redux';
import { store } from './app/store';
import CryptoTable from './components/CryptoTable';

function App() {
  return (
    <Provider store={store}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Crypto Price Tracker</h1>
          <p className="text-gray-600">Real-time cryptocurrency prices with Redux Toolkit</p>
        </header>
        <main>
          <CryptoTable />
        </main>
      </div>
    </Provider>
  );
}

export default App;