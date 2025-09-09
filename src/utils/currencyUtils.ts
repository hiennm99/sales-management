// Utility functions for handling currency conversion and formatting

/**
 * Parse number from string with different decimal separators and thousands separators
 * Supports formats like: 1,234.56 | 1.234,56 | 1234.56 | 1234,56 | 1 234.56
 */
export const parseVndInput = (input: string | number): number => {
    if (typeof input === 'number') return input;
    if (!input || input === '') return 0;

    // Remove all spaces first
    let cleaned = input.toString().replace(/\s/g, '');

    // Check if it's a European format (comma as decimal separator)
    // European format: 1.234,56 or 1234,56
    const europeanFormatMatch = cleaned.match(/^[\d.]*,\d{1,2}$/);
    if (europeanFormatMatch) {
        // Replace dots (thousands separator) and comma (decimal separator)
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
        // US format: 1,234.56 or 1234.56
        // Remove commas (thousands separator)
        cleaned = cleaned.replace(/,/g, '');
    }

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format VND amount with Vietnamese locale
 */
export const formatVnd = (amount: number): string => {
    return amount.toLocaleString('vi-VN');
};

/**
 * Format USD amount
 */
export const formatUsd = (amount: number): string => {
    return amount.toFixed(2);
};

/**
 * Convert USD to VND using exchange rate
 */
export const convertUsdToVnd = (usdAmount: number, exchangeRate: number): number => {
    return Math.round(usdAmount * exchangeRate);
};

/**
 * Convert VND to USD using exchange rate
 */
export const convertVndToUsd = (vndAmount: number, exchangeRate: number): number => {
    return parseFloat((vndAmount / exchangeRate).toFixed(2));
};

/**
 * Smart format VND input while typing (adds commas)
 */
export const formatVndInput = (value: string): string => {
    // Remove all non-numeric characters except comma and dot
    const numericValue = value.replace(/[^\d.,]/g, '');

    // Parse the numeric value
    const parsed = parseVndInput(numericValue);

    // Return formatted version
    return parsed > 0 ? formatVnd(parsed) : '';
};

/**
 * Validate exchange rate (should be reasonable range for USD/VND)
 */
export const validateExchangeRate = (rate: number): boolean => {
    return rate >= 20000 && rate <= 30000; // Reasonable range for USD to VND
};

/**
 * Get current exchange rate suggestion (could be fetched from API in real app)
 */
export const getCurrentExchangeRate = (): number => {
    return 24500; // Default rate, in real app this would come from API
};

/**
 * Calculate totals for a sale
 */
export const calculateSaleTotals = (
    subtotal: number,
    discount: number,
    tax: number,
    exchangeRate: number,
    shippingFee: number,
    shippingExchangeRate: number
) => {
    const total = subtotal - discount + tax;
    const totalVnd = convertUsdToVnd(total, exchangeRate);
    const shippingFeeVnd = convertUsdToVnd(shippingFee, shippingExchangeRate);
    const grandTotal = total + shippingFee;
    const grandTotalVnd = totalVnd + shippingFeeVnd;

    return {
        total,
        totalVnd,
        shippingFeeVnd,
        grandTotal,
        grandTotalVnd
    };
};

/**
 * Clean and parse numeric input for forms
 */
export const parseNumericInput = (value: string | number): number => {
    if (typeof value === 'number') return value;
    if (!value) return 0;

    // Handle different decimal separators
    const cleanValue = value.toString()
        .replace(/\s/g, '') // Remove spaces
        .replace(/,/g, '.'); // Replace comma with dot for decimal

    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format currency display with symbol
 */
export const formatCurrencyDisplay = (amount: number, currency: 'USD' | 'VND'): string => {
    if (currency === 'VND') {
        return `₫${formatVnd(amount)}`;
    }
    return `${formatUsd(amount)}`;
};

/**
 * Debounce function for real-time calculations
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};