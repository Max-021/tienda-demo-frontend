import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Providers from './Providers.jsx';
import reportWebVitals from './reportWebVitals';

import { ThemeProvider } from '@mui/material';
import theme from './sass/mui/theme';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Providers />
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
console.log('ENTRY: render() called', { time: Date.now(), rootEl: document.getElementById('root') })
reportWebVitals();
