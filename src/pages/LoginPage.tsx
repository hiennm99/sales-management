import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router';
import { Eye, EyeOff, LogIn, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import type { LoginCredentials } from '../types/auth';

export function LoginPage() {
    const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<LoginCredentials>({
        username: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        username?: string;
        password?: string;
    }>({});
    const [loginSuccess, setLoginSuccess] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    // Clear error when component unmounts or form changes
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    // Auto-fill demo credentials function
    const fillDemoCredentials = (role: 'admin' | 'manager' | 'staff') => {
        const credentials = {
            admin: { username: 'admin', password: 'admin123' },
            manager: { username: 'manager', password: 'manager123' },
            staff: { username: 'staff', password: 'staff123' }
        };

        setFormData(prev => ({
            ...prev,
            username: credentials[role].username,
            password: credentials[role].password
        }));

        // Clear any existing errors
        setValidationErrors({});
        if (error) clearError();
    };

    const validateForm = () => {
        const errors: { username?: string; password?: string } = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear errors when user starts typing
        if (error) {
            clearError();
        }
        if (validationErrors[name as keyof typeof validationErrors]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await login(formData);
            setLoginSuccess(true);

            // Success message will show briefly before redirect
            setTimeout(() => {
                const from = (location.state)?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            }, 1000);

        } catch (err) {
            // Error is handled by context
            console.error('LoginPage failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSubmitting) {
            handleSubmit(e);
        }
    };

    // Show success state briefly
    if (loginSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Login Successful!</h2>
                    <p className="text-slate-300 mb-4">Redirecting to dashboard...</p>
                    <div className="w-8 h-8 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2220%22%20height=%2220%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2020%200%20L%200%200%200%2020%22%20fill=%22none%22%20stroke=%22white%22%20stroke-opacity=%220.05%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22%20/%3E%3C/svg%3E')] opacity-20"></div>

            <div className="relative w-full max-w-md">
                {/* Logo & Welcome */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
                        <span className="text-white text-xl font-bold">SF</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
                    <p className="text-slate-400">Sign in to access your SalesFlow dashboard</p>
                </div>

                {/* Demo Credentials Info */}
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mb-6 backdrop-blur-sm">
                    <h3 className="text-blue-300 font-medium mb-3 text-center">Quick Demo Login:</h3>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <button
                            onClick={() => fillDemoCredentials('admin')}
                            className="bg-red-600/20 border border-red-500/30 rounded-lg p-2 text-red-200 hover:bg-red-600/30 transition-colors"
                        >
                            <div className="font-medium">👑 Admin</div>
                            <div className="text-xs opacity-75">Full Access</div>
                        </button>
                        <button
                            onClick={() => fillDemoCredentials('manager')}
                            className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2 text-blue-200 hover:bg-blue-600/30 transition-colors"
                        >
                            <div className="font-medium">🏢 Manager</div>
                            <div className="text-xs opacity-75">Analytics</div>
                        </button>
                        <button
                            onClick={() => fillDemoCredentials('staff')}
                            className="bg-green-600/20 border border-green-500/30 rounded-lg p-2 text-green-200 hover:bg-green-600/30 transition-colors"
                        >
                            <div className="font-medium">👤 Staff</div>
                            <div className="text-xs opacity-75">Basic</div>
                        </button>
                    </div>
                </div>

                {/* LoginPage Form */}
                <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate onKeyDown={handleKeyDown}>
                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-start gap-3 animate-shake" role="alert">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-300 text-sm font-medium">Login Failed</p>
                                    <p className="text-red-200 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                                Username <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full bg-slate-700/50 text-white rounded-lg pl-11 pr-4 py-3 border transition-all duration-200 ${
                                        validationErrors.username
                                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-900/10'
                                            : 'border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                                    } backdrop-blur-sm`}
                                    placeholder="Enter your username"
                                    required
                                    autoComplete="username"
                                    aria-describedby={validationErrors.username ? "username-error" : undefined}
                                    disabled={isSubmitting || isLoading}
                                />
                            </div>
                            {validationErrors.username && (
                                <p id="username-error" className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {validationErrors.username}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full bg-slate-700/50 text-white rounded-lg pl-11 pr-12 py-3 border transition-all duration-200 ${
                                        validationErrors.password
                                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-900/10'
                                            : 'border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                                    } backdrop-blur-sm`}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    aria-describedby={validationErrors.password ? "password-error" : undefined}
                                    disabled={isSubmitting || isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    disabled={isSubmitting || isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p id="password-error" className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    id="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                                    disabled={isSubmitting || isLoading}
                                />
                                <label htmlFor="rememberMe" className="ml-3 text-sm text-slate-300">
                                    Remember me
                                </label>
                            </div>
                            <button
                                type="button"
                                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                disabled={isSubmitting || isLoading}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* LoginPage Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg py-3 font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
                        >
                            {isSubmitting || isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In to SalesFlow
                                </>
                            )}
                        </button>

                        {/* Additional Info */}
                        <div className="text-center pt-4 space-y-2">
                            <p className="text-xs text-slate-400">
                                By signing in, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-slate-400 text-sm">
                        © 2024 SalesFlow. Secure Sales Management System.
                    </p>
                    <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-slate-500">
                        <span>🔒 Secure Login</span>
                        <span>⚡ Fast Performance</span>
                        <span>📱 Mobile Ready</span>
                    </div>
                </div>
            </div>

            {/* Custom Animation Styles */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}