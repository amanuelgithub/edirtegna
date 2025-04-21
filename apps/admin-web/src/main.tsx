import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppInitializerProvider } from './context/app-initializer.context';
import { AppContent } from './context/app.context';
import { AuthProvider } from './context/auth.context';
import './index.css';
import { mainRouter } from './app/app.router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>

  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppInitializerProvider>
          <AppContent router={mainRouter} />
        </AppInitializerProvider>
      </AuthProvider>

      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  </StrictMode>,
);
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
