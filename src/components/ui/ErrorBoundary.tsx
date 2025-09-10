// components/ui/ErrorBoundary.tsx
import { Component } from 'react';
import type { ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to console and error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // You can also log the error to an error reporting service here
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-3 bg-red-500/10 rounded-full">
                                <AlertTriangle className="w-12 h-12 text-red-500" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-4">
                            Something went wrong
                        </h1>

                        <p className="text-slate-400 mb-6">
                            We encountered an unexpected error. Don't worry, we've logged the issue and our team will look into it.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left mb-6 p-4 bg-slate-700 rounded-lg">
                                <summary className="text-slate-300 cursor-pointer mb-2">
                                    Error Details (Dev Mode)
                                </summary>
                                <div className="text-xs text-red-400 font-mono">
                                    <p className="mb-2">{this.state.error.toString()}</p>
                                    {this.state.errorInfo && (
                                        <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleReload}
                                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reload Page
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Go to Dashboard
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 mt-6">
                            If this problem persists, please contact support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}