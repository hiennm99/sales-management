import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from "react";
import type { AuthContextType, User, LoginCredentials, AuthState } from '../types/auth';
import {mockUsers} from "../data/mockUsers.tsx";
import { mockCredentials } from "../data/mockCredentials";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    // Session timeout handler
    const handleSessionTimeout = useCallback(() => {
        console.log('Session timed out');

        // Clear localStorage
        localStorage.removeItem('salesflow_user');
        localStorage.removeItem('salesflow_token');
        localStorage.removeItem('salesflow_session_start');
        localStorage.removeItem('salesflow_current_shop_id');

        // Clear all React Query cache on logout
        queryClient.clear();

        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please login again.'
        });
    }, [queryClient]);

    // Check session validity
    const isSessionValid = useCallback(() => {
        const sessionStart = localStorage.getItem('salesflow_session_start');
        if (!sessionStart) return false;

        const sessionAge = Date.now() - parseInt(sessionStart);
        return sessionAge < SESSION_TIMEOUT;
    }, []);

    // Auto logout on session timeout
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const checkSession = () => {
            const sessionStart = localStorage.getItem('salesflow_session_start');
            if (sessionStart && !isSessionValid()) {
                handleSessionTimeout();
                return;
            }

            if (authState.isAuthenticated) {
                const sessionStart = localStorage.getItem('salesflow_session_start');
                if (sessionStart) {
                    const remainingTime = SESSION_TIMEOUT - (Date.now() - parseInt(sessionStart));
                    timeoutId = setTimeout(handleSessionTimeout, remainingTime);
                }
            }
        };

        checkSession();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [authState.isAuthenticated, handleSessionTimeout, isSessionValid]);

    // Check for existing session on mount
    useEffect(() => {
        const checkExistingSession = async () => {
            try {
                const savedUser = localStorage.getItem('salesflow_user');
                const savedToken = localStorage.getItem('salesflow_token');

                if (savedUser && savedToken && isSessionValid()) {
                    const user: User = JSON.parse(savedUser);

                    // Validate user still exists and is active
                    const currentUser = mockUsers.find(u => u.id === user.id);
                    if (currentUser && currentUser.isActive) {
                        setAuthState({
                            user: currentUser,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        });
                    } else {
                        // User no longer exists or is inactive - clear everything
                        localStorage.removeItem('salesflow_user');
                        localStorage.removeItem('salesflow_token');
                        localStorage.removeItem('salesflow_session_start');
                        localStorage.removeItem('salesflow_current_shop_id');
                        queryClient.clear();

                        setAuthState(prev => ({
                            ...prev,
                            isLoading: false,
                            error: 'Your account is no longer active. Please contact support.'
                        }));
                    }
                } else {
                    // Invalid or expired session - clear everything
                    localStorage.removeItem('salesflow_user');
                    localStorage.removeItem('salesflow_token');
                    localStorage.removeItem('salesflow_session_start');
                    localStorage.removeItem('salesflow_current_shop_id');
                    queryClient.clear();

                    setAuthState(prev => ({
                        ...prev,
                        isLoading: false
                    }));
                }
            } catch (error) {
                console.error('Error checking existing session:', error);

                // Clear everything on error
                localStorage.clear();
                queryClient.clear();

                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Session validation failed. Please login again.'
                }));
            }
        };

        checkExistingSession();
    }, [isSessionValid, queryClient]);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Input validation
            if (!credentials.username || !credentials.password) {
                throw new Error('Please provide both username and password');
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

            // Check credentials
            const validCredential = mockCredentials.find(
                cred => cred.username.toLowerCase() === credentials.username.toLowerCase()
                    && cred.password === credentials.password
            );

            if (!validCredential) {
                throw new Error('Invalid username or password. Please check your credentials and try again.');
            }

            // Find user
            const user = mockUsers.find(u => u.username.toLowerCase() === credentials.username.toLowerCase());
            if (!user) {
                throw new Error('User account not found. Please contact support.');
            }

            if (!user.isActive) {
                throw new Error('Your account has been deactivated. Please contact support for assistance.');
            }

            // Update last login time
            const updatedUser = {
                ...user,
                lastLoginAt: new Date().toISOString()
            };

            // Generate token
            const token = `sf_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const sessionStart = Date.now().toString();

            // Save to localStorage
            localStorage.setItem('salesflow_user', JSON.stringify(updatedUser));
            localStorage.setItem('salesflow_token', token);
            localStorage.setItem('salesflow_session_start', sessionStart);

            // Handle remember me
            if (!credentials.rememberMe) {
                sessionStorage.setItem('salesflow_temp_session', 'true');
            }

            // Clear any existing React Query cache and start fresh
            queryClient.clear();

            setAuthState({
                user: updatedUser,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });

            console.log(`User ${updatedUser.fullName} logged in successfully as ${updatedUser.role}`);

        } catch (error) {
            console.error('Login error:', error);
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed. Please try again.'
            }));
            throw error;
        }
    };

    const logout = useCallback(async (): Promise<void> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true }));

            // Simulate logout API call
            await new Promise(resolve => setTimeout(resolve, 300));

            // Clear all storage
            localStorage.removeItem('salesflow_user');
            localStorage.removeItem('salesflow_token');
            localStorage.removeItem('salesflow_session_start');
            localStorage.removeItem('salesflow_current_shop_id');
            sessionStorage.removeItem('salesflow_temp_session');

            // Clear all React Query cache
            queryClient.clear();

            // Reset auth state
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });

            console.log('User logged out successfully');

        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if there's an error
            localStorage.clear();
            sessionStorage.clear();
            queryClient.clear();

            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        }
    }, [queryClient]);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    const refreshUser = async (): Promise<void> => {
        if (!authState.user) return;

        try {
            setAuthState(prev => ({ ...prev, isLoading: true }));

            // In real app, this would fetch updated user data from API
            const updatedUser = mockUsers.find(u => u.id === authState.user?.id);
            if (updatedUser) {
                const userWithUpdatedLogin = {
                    ...updatedUser,
                    lastLoginAt: authState.user.lastLoginAt // Keep original login time
                };

                setAuthState(prev => ({
                    ...prev,
                    user: userWithUpdatedLogin,
                    isLoading: false
                }));

                // Update localStorage if exists
                const savedToken = localStorage.getItem('salesflow_token');
                if (savedToken) {
                    localStorage.setItem('salesflow_user', JSON.stringify(userWithUpdatedLogin));
                }
            } else {
                // User no longer exists, force logout
                await logout();
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to refresh user data'
            }));
        }
    };

    const hasRole = useCallback((requiredRole: 'admin' | 'manager' | 'staff'): boolean => {
        if (!authState.user) return false;

        const roleHierarchy = { admin: 3, manager: 2, staff: 1 };
        const userLevel = roleHierarchy[authState.user.role];
        const requiredLevel = roleHierarchy[requiredRole];

        return userLevel >= requiredLevel;
    }, [authState.user]);

    // Get session info
    const getSessionInfo = useCallback(() => {
        const sessionStart = localStorage.getItem('salesflow_session_start');
        if (!sessionStart || !authState.isAuthenticated) return null;

        const sessionAge = Date.now() - parseInt(sessionStart);
        const remainingTime = SESSION_TIMEOUT - sessionAge;

        return {
            startTime: new Date(parseInt(sessionStart)),
            age: sessionAge,
            remainingTime: Math.max(0, remainingTime),
            isExpiring: remainingTime < 5 * 60 * 1000 // Less than 5 minutes
        };
    }, [authState.isAuthenticated]);

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        clearError,
        refreshUser,
        getSessionInfo,
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Hook for checking specific roles
export function useRole(requiredRole: 'admin' | 'manager' | 'staff') {
    const { user, hasRole } = useAuth();
    return {
        hasRequiredRole: hasRole(requiredRole),
        currentRole: user?.role,
        isLoading: !user
    };
}