import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { SalesProvider } from './contexts/SalesContext';
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import { Dashboard } from './pages/Dashboard';
import { SalesList } from './pages/SalesList';
import { SaleFormPage } from './pages/SaleFormPage';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { UserProfile } from "./components/auth/UserProfile.tsx";
import { Layout } from "./components/ui/Layout.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public route - Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected routes with Layout */}
                    <Route path="/*" element={
                        <ProtectedRoute>
                            <SalesProvider>
                                <Layout>
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
                                </Layout>
                            </SalesProvider>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;