import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, LogIn, User, Lock, AlertCircle } from 'lucide-react';
import type { LoginCredentials } from '../types/auth';

export function Login() {
    const { login, isLoading, error, clearError } = useAuth();
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

    // Clear error when component unmounts or form changes
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const validateForm = () => {
        const errors: { username?: string; password?: string } = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            // Error is handled by context
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2220%22%20height=%2220%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2020%200%20L%200%200%200%2020%22%20fill=%22none%22%20stroke=%22white%22%20stroke-opacity=%220.05%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22%20/%3E%3C/svg%3E')] opacity-20"></div>

            <div className="relative w-full max-w-md">
                {/* Logo & Welcome */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
                        <span className="text-white text-xl font-bold">SF</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to SalesFlow</h1>
                    <p className="text-slate-400">Sign in to your account to continue</p>
                </div>

                {/* Demo Credentials Info */}
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <h3 className="text-blue-300 font-medium mb-2">Demo Accounts:</h3>
                    <div className="text-sm text-blue-200 space-y-1">
                        <div>👑 <strong>admin</strong> / admin123</div>
                        <div>🏢 <strong>manager</strong> / manager123</div>
                        <div>👤 <strong>staff</strong> / staff123</div>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-center gap-3" role="alert">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <span className="text-red-300 text-sm">{error}</span>
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full bg-slate-700 text-white rounded-lg pl-11 pr-4 py-3 border transition-colors ${
                                        validationErrors.username
                                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                            : 'border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                                    }`}
                                    placeholder="Enter your username"
                                    required
                                    autoComplete="username"
                                    aria-describedby={validationErrors.username ? "username-error" : undefined}
                                />
                            </div>
                            {validationErrors.username && (
                                <p id="username-error" className="mt-2 text-sm text-red-400">
                                    {validationErrors.username}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full bg-slate-700 text-white rounded-lg pl-11 pr-12 py-3 border transition-colors ${
                                        validationErrors.password
                                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                            : 'border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                                    }`}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    aria-describedby={validationErrors.password ? "password-error" : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p id="password-error" className="mt-2 text-sm text-red-400">
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                id="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <label htmlFor="rememberMe" className="ml-3 text-sm text-slate-300">
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg py-3 font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting || isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>

                        {/* Footer Links */}
                        <div className="text-center pt-4">
                            <button
                                type="button"
                                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-slate-400 text-sm">
                        © 2024 SalesFlow. Modern Sales Management System.
                    </p>
                </div>
            </div>
        </div>
    );
}