import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSales } from '../contexts/SalesContext';
import { SaleForm } from '../components/forms/SaleForm';

export const SaleFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addSale, updateSale, getSaleById } = useSales();

    // Determine the mode based on the current path
    const currentPath = window.location.pathname;
    const mode = currentPath.includes('/add') ? 'add' :
        currentPath.includes('/edit') ? 'edit' : 'view';

    const saleData = id ? getSaleById(id) : undefined;

    const handleSubmit = (formData: any) => {
        if (mode === 'add') {
            addSale(formData);
            navigate('/sales');
        } else if (mode === 'edit' && id) {
            updateSale(id, formData);
            navigate('/sales');
        }
    };

    const handleCancel = () => {
        navigate('/sales');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {mode === 'add' ? 'Add New Sale' :
                            mode === 'edit' ? 'Edit Sale' : 'View Sale'}
                    </h1>
                    <p className="text-slate-400">
                        {mode === 'add' ? 'Create a new sales order' :
                            mode === 'edit' ? 'Update sale information' : 'View sale details'}
                    </p>
                </div>
            </div>

            <SaleForm
                mode={mode}
                initialData={saleData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
};