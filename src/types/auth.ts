export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'admin' | 'manager' | 'staff';
    avatar?: string;
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

export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    refreshUser: () => Promise<void>;
}

// Mock users for demo
export const mockUsers: User[] = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@salesflow.com',
        fullName: 'Administrator',
        role: 'admin',
        avatar: '',
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-20T10:30:00Z',
        isActive: true
    },
    {
        id: '2',
        username: 'manager',
        email: 'manager@salesflow.com',
        fullName: 'Sales Manager',
        role: 'manager',
        avatar: '',
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-19T14:20:00Z',
        isActive: true
    },
    {
        id: '3',
        username: 'staff',
        email: 'staff@salesflow.com',
        fullName: 'Sales Staff',
        role: 'staff',
        avatar: '',
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-18T09:15:00Z',
        isActive: true
    }
];