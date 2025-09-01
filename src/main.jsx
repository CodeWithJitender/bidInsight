import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// Redux imports
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
       <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
      </BrowserRouter>
    </Provider>
);