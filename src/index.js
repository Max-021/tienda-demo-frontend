import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Providers from './Providers';
import reportWebVitals from './reportWebVitals';

import { ThemeProvider } from '@mui/material';
import theme from './sass/mui/theme';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Providers />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
