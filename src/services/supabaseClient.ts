// services/supabaseClient.ts - Simplified version
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = 'https://liqhtqlxipxdsxnrnnmo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcWh0cWx4aXB4ZHN4bnJubm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDIwMjIsImV4cCI6MjA3Mjk3ODAyMn0.g7amy_jdYHHNOcF4l1IrXUDdcYG-6aXfnd76Fww03Y4';


if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
    realtime: {
        params: { eventsPerSecond: 10 }
    }
});

// Auth utilities
export const auth = {
    signUp: (email: string, password: string, userData?: any) =>
        supabase.auth.signUp({ email, password, options: { data: userData } }),

    signIn: (email: string, password: string) =>
        supabase.auth.signInWithPassword({ email, password }),

    signOut: () => supabase.auth.signOut(),

    getUser: () => supabase.auth.getUser(),

    getSession: () => supabase.auth.getSession(),

    resetPassword: (email: string) => supabase.auth.resetPasswordForEmail(email),

    updatePassword: (password: string) => supabase.auth.updateUser({ password }),

    updateProfile: (data: any) => supabase.auth.updateUser({ data }),

    onAuthChange: (callback: (event: string, session: any) => void) =>
        supabase.auth.onAuthStateChange(callback)
};

// Real-time utilities
export const realtime = {
    subscribeToTable: (table: string, callback: (payload: any) => void) =>
        supabase
            .channel(`public:${table}`)
            .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
            .subscribe(),

    subscribeToRow: (table: string, id: string, callback: (payload: any) => void) =>
        supabase
            .channel(`public:${table}:id=eq.${id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table,
                filter: `id=eq.${id}`
            }, callback)
            .subscribe(),

    unsubscribe: (channel: any) => supabase.removeChannel(channel)
};

// Error handler
export const handleError = (error: any, operation = 'operation') => {
    console.error(`Supabase ${operation} error:`, error);

    const errorMessages: Record<string, string> = {
        'PGRST116': 'No records found',
        '23505': 'A record with this information already exists',
        '23503': 'Cannot delete - this record is referenced by other data',
        '42501': "You don't have permission to perform this action",
        'auth/user-not-found': 'User account not found',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'An account with this email already exists'
    };

    return errorMessages[error?.code] || error?.message || `Failed to complete ${operation}`;
};