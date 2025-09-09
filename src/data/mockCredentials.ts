// Mock credentials for demo purposes
export const mockCredentials = [
    {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
    },
    {
        username: 'manager',
        password: 'manager123',
        role: 'manager'
    },
    {
        username: 'staff',
        password: 'staff123',
        role: 'staff'
    }
];

// Additional demo accounts for testing
export const demoAccounts = [
    {
        role: 'admin',
        credentials: { username: 'admin', password: 'admin123' },
        description: 'Full system access, can manage users and settings',
        features: ['User Management', 'System Settings', 'Analytics', 'All Sales Operations']
    },
    {
        role: 'manager',
        credentials: { username: 'manager', password: 'manager123' },
        description: 'Sales management and analytics access',
        features: ['Sales Analytics', 'Team Reports', 'Sales Management', 'Data Export']
    },
    {
        role: 'staff',
        credentials: { username: 'staff', password: 'staff123' },
        description: 'Basic sales operations access',
        features: ['View Sales', 'Add Sales', 'Edit Own Sales', 'Basic Dashboard']
    }
];