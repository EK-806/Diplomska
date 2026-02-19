import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider } from './lib/Theme';
import MainRoutes from './services/MainRoutes';
import { Provider } from 'react-redux';
import store from './services/storeConfig';
import { Toaster } from '@/components/ui/Toaster';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <MainRoutes/>
        <Toaster/>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);