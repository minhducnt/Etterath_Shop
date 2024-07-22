import { ChakraProvider } from '@chakra-ui/react';

import { QueryClient, QueryClientProvider } from 'react-query';

import React, { Suspense } from 'react';

import { Provider } from 'react-redux';

import ReactDOM from 'react-dom/client';

import App from './App';

import './styles/Main.css';
import { store } from './modules/store/Store';
import Loading from './common/components/loaders/SuspenseLoader';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true
    }
  }
});

root.render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </Provider>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
);
