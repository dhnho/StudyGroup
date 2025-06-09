import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './app/routers/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { store, StoreContext } from './libs/stores/store';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StoreContext.Provider value={store}>
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} position='top' />
            <ToastContainer position='top-right' closeOnClick={true} pauseOnHover={false} theme='light' />
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StoreContext.Provider>
);
