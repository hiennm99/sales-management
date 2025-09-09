import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { SalesProvider } from './contexts/SalesContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { SalesList } from './pages/SalesList';
import { AddSale } from './pages/AddSale';
import { EditSale } from './pages/EditSale';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

function App() {
    return (
        <SalesProvider>
            <Router>
                <div className="min-h-screen bg-slate-900 flex">
                    <Sidebar />
                    <main className="flex-1 p-8">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/sales" element={<SalesList />} />
                            <Route path="/sales/add" element={<SaleFormPage />} />
                            <Route path="/sales/edit/:id" element={<SaleFormPage />} />
                            <Route path="/sales/view/:id" element={<SaleFormPage />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </SalesProvider>
    );
}

export default App;