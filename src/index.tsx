import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import NyuambaAppProvider from './lib/context/AppContext';
import NyumbaThemeProvider from './lib/context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 3,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NyuambaAppProvider>
        <QueryClientProvider client={queryClient}>
          <NyumbaThemeProvider>
            <App />
          </NyumbaThemeProvider>
        </QueryClientProvider>
      </NyuambaAppProvider>
    </BrowserRouter>
  </React.StrictMode >
);
