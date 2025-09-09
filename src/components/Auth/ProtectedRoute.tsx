import React from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Login } from '../../pages/Login.tsx';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'manager' | 'staff';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requiredRole
                                                              }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        return <Login />;
    }

    // Check role permissions
    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-slate-400 mb-4">
                        You don't have permission to access this page.
                    </p>
                    <p className="text-sm text-slate-500">
                        Required role: <span className="font-medium text-purple-400">{requiredRole}</span> |
                        Your role: <span className="font-medium text-blue-400">{user.role}</span>
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};