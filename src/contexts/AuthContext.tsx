import { createContext, useContext, useState, useEffect } from 'react';
import type {ReactNode} from "react";
import type { AuthContextType, User, LoginCredentials, AuthState } from '../types/auth';
import { mockUsers } from '../types/auth';
import {mockCredentials} from "../data/mockCredentials.ts";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    // Check for existing session on mount
    useEffect(() => {
        const checkExistingSession = () => {
            try {
                const savedUser = localStorage.getItem('salesflow_user');
                const savedToken = localStorage.getItem('salesflow_token');

                if (savedUser && savedToken) {
                    const user: User = JSON.parse(savedUser);
                    setAuthState({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } else {
                    setAuthState(prev => ({
                        ...prev,
                        isLoading: false
                    }));
                }
            } catch (error) {
                console.error('Error checking existing session:', error);
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false
                }));
            }
        };

        checkExistingSession();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check credentials
            const validCredential = mockCredentials.find(
                cred => cred.username === credentials.username && cred.password === credentials.password
            );

            if (!validCredential) {
                throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
            }

            // Find user
            const user = mockUsers.find(u => u.username === credentials.username);
            if (!user) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            if (!user.isActive) {
                throw new Error('Tài khoản đã bị vô hiệu hóa');
            }

            // Update last login time
            const updatedUser = {
                ...user,
                lastLoginAt: new Date().toISOString()
            };

            // Generate mock token
            const token = `mock_token_${user.id}_${Date.now()}`;

            // Save to localStorage if remember me
            if (credentials.rememberMe) {
                localStorage.setItem('salesflow_user', JSON.stringify(updatedUser));
                localStorage.setItem('salesflow_token', token);
            }

            setAuthState({
                user: updatedUser,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });

        } catch (error) {
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập'
            }));
            throw error;
        }
    };

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('salesflow_user');
        localStorage.removeItem('salesflow_token');

        // Reset auth state
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
    };

    const clearError = () => {
        setAuthState(prev => ({ ...prev, error: null }));
    };

    const refreshUser = async (): Promise<void> => {
        if (!authState.user) return;

        try {
            // In real app, this would fetch updated user data from API
            const updatedUser = mockUsers.find(u => u.id === authState.user?.id);
            if (updatedUser) {
                setAuthState(prev => ({ ...prev, user: updatedUser }));

                // Update localStorage if exists
                const savedToken = localStorage.getItem('salesflow_token');
                if (savedToken) {
                    localStorage.setItem('salesflow_user', JSON.stringify(updatedUser));
                }
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        clearError,
        refreshUser
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