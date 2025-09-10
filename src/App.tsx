import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ShopProvider } from './contexts/ShopContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { SalesListPage } from './pages/SalesListPage';
import { SaleFormPage } from './pages/SaleFormPage';
import { ProductPage } from './pages/ProductPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { UserProfile } from './components/auth/UserProfile';
import { Layout } from './components/ui/Layout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Enhanced QueryClient configuration
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache settings
            staleTime: 5 * 60 * 1000,      // 5 minutes - data considered fresh
            gcTime: 10 * 60 * 1000,        // 10 minutes - cache garbage collection

            // Retry configuration
            retry: (failureCount, error: any) => {
                // Don't retry on client errors (4xx)
                if (error?.status >= 400 && error?.status < 500) {
                    return false;
                }
                // Don't retry on specific error types
                if (error?.message?.includes('not found') ||
                    error?.message?.includes('unauthorized') ||
                    error?.message?.includes('forbidden')) {
                    return false;
                }
                // Retry up to 3 times for other errors
                return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Refetch behavior
            refetchOnWindowFocus: 'always',
            refetchOnReconnect: 'always',
            refetchOnMount: true,

            // Network mode
            networkMode: 'online',
        },
        mutations: {
            // Retry configuration for mutations
            retry: (failureCount, error: any) => {
                // Don't retry client errors or validation errors
                if (error?.status >= 400 && error?.status < 500) {
                    return false;
                }
                // Don't retry on specific business logic errors
                if (error?.message?.includes('already exists') ||
                    error?.message?.includes('not found') ||
                    error?.message?.includes('forbidden')) {
                    return false;
                }
                // Retry once for server errors
                return failureCount < 1;
            },
            retryDelay: 1500,
            networkMode: 'online',
        },
    },
});

// Global error handlers
queryClient.setDefaultOptions({
    queries: {
        onError: (error: any) => {
            console.error('Query error:', error);
            // You can add global query error handling here
            // For example: toast.error('Failed to fetch data');
        },
    },
    mutations: {
        onError: (error: any) => {
            console.error('Mutation error:', error);
            // Global mutation error handling is handled by individual hooks
        },
    },
});

// Query key prefixes for better organization
export const queryKeys = {
    products: ['products'],
    shops: ['shops'],
    sales: ['sales'],
    auth: ['auth'],
    analytics: ['analytics'],
} as const;

// Add global mutation defaults for different entities
queryClient.setMutationDefaults(['products'], {
    networkMode: 'online',
});

queryClient.setMutationDefaults(['shops'], {
    networkMode: 'online',
});

queryClient.setMutationDefaults(['sales'], {
    networkMode: 'online',
});

function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Router>
                        <Routes>
                            {/* Public route */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* Protected routes with nested providers */}
                            <Route path="/*" element={
                                <ProtectedRoute>
                                    <ShopProvider>
                                        <SidebarProvider>
                                            <Layout>
                                                <Routes>
                                                    {/* Root redirect */}
                                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                                                    {/* Main application routes */}
                                                    <Route path="/dashboard" element={<DashboardPage />} />

                                                    {/* Sales routes */}
                                                    <Route path="/sales" element={<SalesListPage />} />
                                                    <Route path="/sales/add" element={<SaleFormPage />} />
                                                    <Route path="/sales/edit/:id" element={<SaleFormPage />} />
                                                    <Route path="/sales/view/:id" element={<SaleFormPage />} />

                                                    {/* Product management */}
                                                    <Route path="/products" element={<ProductPage />} />

                                                    {/* User profile */}
                                                    <Route path="/profile" element={<UserProfile />} />

                                                    {/* Analytics - Manager only */}
                                                    <Route path="/analytics" element={
                                                        <ProtectedRoute requiredRole="manager">
                                                            <AnalyticsPage />
                                                        </ProtectedRoute>
                                                    } />

                                                    {/* Settings - All authenticated users */}
                                                    <Route path="/settings" element={<SettingsPage />} />

                                                    {/* Catch-all route */}
                                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                                </Routes>
                                            </Layout>
                                        </SidebarProvider>
                                    </ShopProvider>
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </Router>
                </AuthProvider>

                {/* Global toast notifications */}
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                        // Default options
                        duration: 4000,
                        style: {
                            background: '#1e293b', // slate-800
                            color: '#f1f5f9',     // slate-100
                            border: '1px solid #334155', // slate-700
                        },
                        // Success toasts
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10b981', // green-500
                                secondary: '#f1f5f9',
                            },
                        },
                        // Error toasts
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#ef4444', // red-500
                                secondary: '#f1f5f9',
                            },
                        },
                        // Loading toasts
                        loading: {
                            duration: Infinity,
                            iconTheme: {
                                primary: '#8b5cf6', // purple-500
                                secondary: '#f1f5f9',
                            },
                        },
                    }}
                />

                {/* React Query DevTools - Development only */}
                {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools
                        initialIsOpen={false}
                        position="bottom-right"
                        toggleButtonProps={{
                            style: {
                                marginLeft: '5px',
                                transform: 'scale(0.85)',
                                zIndex: 99999,
                            },
                        }}
                        panelProps={{
                            style: {
                                zIndex: 99998,
                            },
                        }}
                    />
                )}
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;