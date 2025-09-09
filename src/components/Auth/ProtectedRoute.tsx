import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router';
import { Login } from '../../pages/Login';
import {
    Shield,
    AlertTriangle,
    Clock,
    ArrowLeft
} from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'manager' | 'staff';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requiredRole
                                                              }) => {
    const { isAuthenticated, isLoading, user, hasRole, getSessionInfo } = useAuth();
    const navigate = useNavigate();
    useLocation();
// Check session expiration
    const sessionInfo = getSessionInfo?.();
    const isSessionExpiring = sessionInfo?.isExpiring ?? false;

    useEffect(() => {
        // Show session warning if expiring
        if (isSessionExpiring) {
            console.warn('Session expiring soon');
            // You could show a toast notification here
        }
    }, [isSessionExpiring]);

    // Loading state with better UX
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        {/* Animated loader */}
                        <div className="w-20 h-20 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-600 rounded-full animate-spin animate-reverse" style={{animationDelay: '0.1s'}}></div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Checking Authentication</h3>
                    <p className="text-slate-400">Please wait while we verify your session...</p>

                    {/* Session info if available */}
                    {sessionInfo && (
                        <div className="mt-4 text-sm text-slate-500">
                            <p>Session active for {Math.floor(sessionInfo.age / 60000)} minutes</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login with return path
    if (!isAuthenticated || !user) {
        return <Login />;
    }

    // Role-based access control
    if (requiredRole && !hasRole?.(requiredRole)) {
        const getRoleInfo = (role: string) => {
            switch (role) {
                case 'admin':
                    return {
                        name: 'Administrator',
                        color: 'text-red-400',
                        bgColor: 'bg-red-500/10',
                        borderColor: 'border-red-500/20',
                        icon: Shield
                    };
                case 'manager':
                    return {
                        name: 'Manager',
                        color: 'text-blue-400',
                        bgColor: 'bg-blue-500/10',
                        borderColor: 'border-blue-500/20',
                        icon: Shield
                    };
                case 'staff':
                    return {
                        name: 'Staff',
                        color: 'text-green-400',
                        bgColor: 'bg-green-500/10',
                        borderColor: 'border-green-500/20',
                        icon: Shield
                    };
                default:
                    return {
                        name: role,
                        color: 'text-gray-400',
                        bgColor: 'bg-gray-500/10',
                        borderColor: 'border-gray-500/20',
                        icon: Shield
                    };
            }
        };

        const requiredRoleInfo = getRoleInfo(requiredRole);
        const userRoleInfo = getRoleInfo(user.role);
        const RequiredIcon = requiredRoleInfo.icon;
        const UserIcon = userRoleInfo.icon;

        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="text-center">
                        {/* Warning Icon */}
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                            <AlertTriangle className="w-12 h-12 text-red-400" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4">Access Restricted</h2>
                        <p className="text-slate-300 mb-6 text-lg">
                            You don't have the required permissions to access this page.
                        </p>

                        {/* Role Comparison */}
                        <div className="bg-slate-800/50 rounded-lg p-6 mb-6 border border-slate-700/50">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Required Role */}
                                <div className={`p-4 rounded-lg border ${requiredRoleInfo.bgColor} ${requiredRoleInfo.borderColor}`}>
                                    <div className="flex items-center justify-center mb-2">
                                        <RequiredIcon className={`w-5 h-5 ${requiredRoleInfo.color} mr-2`} />
                                        <span className="text-sm font-medium text-slate-300">Required Role</span>
                                    </div>
                                    <p className={`text-lg font-bold ${requiredRoleInfo.color}`}>
                                        {requiredRoleInfo.name}
                                    </p>
                                </div>

                                {/* Current Role */}
                                <div className={`p-4 rounded-lg border ${userRoleInfo.bgColor} ${userRoleInfo.borderColor}`}>
                                    <div className="flex items-center justify-center mb-2">
                                        <UserIcon className={`w-5 h-5 ${userRoleInfo.color} mr-2`} />
                                        <span className="text-sm font-medium text-slate-300">Your Role</span>
                                    </div>
                                    <p className={`text-lg font-bold ${userRoleInfo.color}`}>
                                        {userRoleInfo.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full flex items-center justify-center px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </button>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Return to Dashboard
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                            <div className="flex items-center justify-center mb-2">
                                <Clock className="w-4 h-4 text-blue-400 mr-2" />
                                <span className="text-sm font-medium text-blue-300">Need Access?</span>
                            </div>
                            <p className="text-sm text-blue-200">
                                Contact your administrator to request role elevation or access permissions.
                            </p>
                        </div>

                        {/* User Info Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                            <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
                                <span>Logged in as: <strong className="text-slate-300">{user.fullName}</strong></span>
                                {sessionInfo && (
                                    <span>Session: {Math.floor(sessionInfo.remainingTime / 60000)}m left</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Session expiring warning overlay
    const SessionWarning = () => {
        if (!isSessionExpiring || !sessionInfo) return null;

        const minutesLeft = Math.floor(sessionInfo.remainingTime / 60000);

        return (
            <div className="fixed top-4 right-4 z-50 max-w-sm">
                <div className="bg-yellow-900/90 border border-yellow-500/50 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-start">
                        <Clock className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-yellow-100 mb-1">
                                Session Expiring Soon
                            </h4>
                            <p className="text-xs text-yellow-200 mb-2">
                                Your session will expire in {minutesLeft} minute{minutesLeft !== 1 ? 's' : ''}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded transition-colors"
                            >
                                Extend Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render protected content with session warning
    return (
        <>
            {children}
            <SessionWarning />
        </>
    );
};