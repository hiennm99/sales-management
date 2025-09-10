import type { User } from '../types/auth';

export const mockUsers: User[] = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@salesflow.com',
        fullName: 'System Administrator',
        role: 'admin',
        avatar: '',
        phone: '+1 (555) 123-4567',
        address: '123 Business Ave, Tech City, TC 12345',
        department: 'IT Operations',
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-20T10:30:00Z',
        isActive: true
    },
    {
        id: '2',
        username: 'manager',
        email: 'manager@salesflow.com',
        fullName: 'Sales Manager Pro',
        role: 'manager',
        avatar: '',
        phone: '+1 (555) 234-5678',
        address: '456 Commerce St, Business District, BD 23456',
        department: 'Sales Department',
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-19T14:20:00Z',
        isActive: true
    },
    {
        id: '3',
        username: 'staff',
        email: 'staff@salesflow.com',
        fullName: 'Sales Representative',
        role: 'staff',
        avatar: '',
        phone: '+1 (555) 345-6789',
        address: '789 Sales Blvd, Commerce Center, CC 34567',
        department: 'Sales Department',
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-18T09:15:00Z',
        isActive: true
    }
];

// Role permissions mapping
export const rolePermissions = {
    admin: {
        canViewAnalytics: true,
        canManageUsers: true,
        canAccessSettings: true,
        canEditAllSales: true,
        canDeleteSales: true,
        canExportData: true,
        canViewReports: true
    },
    manager: {
        canViewAnalytics: true,
        canManageUsers: false,
        canAccessSettings: false,
        canEditAllSales: true,
        canDeleteSales: true,
        canExportData: true,
        canViewReports: true
    },
    staff: {
        canViewAnalytics: false,
        canManageUsers: false,
        canAccessSettings: false,
        canEditAllSales: false,
        canDeleteSales: false,
        canExportData: false,
        canViewReports: false
    }
};

export type Permission = keyof typeof rolePermissions.admin;