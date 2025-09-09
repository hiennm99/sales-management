import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { SalesProvider } from './contexts/SalesContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { SalesList } from './pages/SalesList';
import { SaleFormPage } from './pages/SaleFormPage';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { UserProfile } from './components/Auth/UserProfile';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public route - Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected routes with Navbar + Sidebar layout */}
                    <Route path="/*" element={
                        <ProtectedRoute>
                            <SalesProvider>
                                <div className="min-h-screen bg-gray-50">
                                    {/* Top Navbar - Always visible */}
                                    <Navbar />

                                    {/* Main layout with sidebar */}
                                    <div className="flex">
                                        {/* Left Sidebar */}
                                        <Sidebar />

                                        {/* Main Content Area */}
                                        <main className="flex-1 overflow-auto">
                                            <div className="p-6 max-w-7xl mx-auto">
                                                <Routes>
                                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                                    <Route path="/dashboard" element={<Dashboard />} />
                                                    <Route path="/sales" element={<SalesList />} />
                                                    <Route path="/sales/add" element={<SaleFormPage />} />
                                                    <Route path="/sales/edit/:id" element={<SaleFormPage />} />
                                                    <Route path="/sales/view/:id" element={<SaleFormPage />} />
                                                    <Route path="/profile" element={<UserProfile />} />
                                                    <Route path="/analytics" element={
                                                        <ProtectedRoute requiredRole="manager">
                                                            <Analytics />
                                                        </ProtectedRoute>
                                                    } />
                                                    <Route path="/settings" element={
                                                        <ProtectedRoute requiredRole="admin">
                                                            <Settings />
                                                        </ProtectedRoute>
                                                    } />
                                                </Routes>
                                            </div>
                                        </main>
                                    </div>
                                </div>
                            </SalesProvider>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;