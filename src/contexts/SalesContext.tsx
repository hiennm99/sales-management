import { createContext, useContext, useState } from 'react';
import type {ReactNode} from "react";
import type { Sale } from '../types/sale.ts';
import { mockSales } from '../data/mockSales';

interface SalesContextType {
    sales: Sale[];
    addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateSale: (id: string, sale: Partial<Sale>) => void;
    deleteSale: (id: string) => void;
    getSaleById: (id: string) => Sale | undefined;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: ReactNode }) {
    const [sales, setSales] = useState<Sale[]>(mockSales);

    const addSale = (newSale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => {
        const sale: Sale = {
            ...newSale,
            id: `ORD-2024-${String(sales.length + 1).padStart(3, '0')}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setSales(prev => [...prev, sale]);
    };

    const updateSale = (id: string, updatedData: Partial<Sale>) => {
        setSales(prev => prev.map(sale =>
            sale.id === id
                ? { ...sale, ...updatedData, updatedAt: new Date().toISOString() }
                : sale
        ));
    };

    const deleteSale = (id: string) => {
        setSales(prev => prev.filter(sale => sale.id !== id));
    };

    const getSaleById = (id: string) => {
        return sales.find(sale => sale.id === id);
    };

    return (
        <SalesContext.Provider value={{
            sales,
            addSale,
            updateSale,
            deleteSale,
            getSaleById
        }}>
            {children}
        </SalesContext.Provider>
    );
}

export function useSales() {
    const context = useContext(SalesContext);
    if (!context) {
        throw new Error('useSales must be used within SalesProvider');
    }
    return context;
}
