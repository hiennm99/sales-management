import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://liqhtqlxipxdsxnrnnmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcWh0cWx4aXB4ZHN4bnJubm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDIwMjIsImV4cCI6MjA3Mjk3ODAyMn0.g7amy_jdYHHNOcF4l1IrXUDdcYG-6aXfnd76Fww03Y4';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;