import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Auth features will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Auth helper functions
export async function signInWithEmail(email, password) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signUpWithEmail(email, password) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export function onAuthStateChange(callback) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => { } } } };

    return supabase.auth.onAuthStateChange(callback);
}
