export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'admin' | 'manager' | 'staff';
    avatar?: string;
    phone?: string;
    address?: string;
    department?: string;
    createdAt: string;
    lastLoginAt?: string;
    isActive: boolean;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface SessionInfo {
    startTime: Date;
    age: number;
    remainingTime: number;
    isExpiring: boolean;
}

export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    refreshUser: () => Promise<void>;
    hasRole: (requiredRole: 'admin' | 'manager' | 'staff') => boolean; // Removed optional modifier
    getSessionInfo: () => SessionInfo | null; // Removed optional modifier
}