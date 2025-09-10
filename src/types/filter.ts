export interface FilterState {
    searchTerm: string;
    statusFilter: string;
    dateRange: { from: string; to: string };
    amountRange: { min: string; max: string };
    selectedShops: string[];
    overdueOnly: boolean;
}

export interface SaleFilterProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    onExport?: () => void;
    totalCount?: number;
    filteredCount?: number;
    statusCounts?: {
        overdue: number;
        processing: number;
        delivered: number;
        cancelled: number;
    };
}