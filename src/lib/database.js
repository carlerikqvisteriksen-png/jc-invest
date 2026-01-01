import { supabase } from './supabase';

// =====================================================
// PROPERTIES
// =====================================================

export async function getProperties() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getProperty(id) {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createProperty(property) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('properties')
        .insert({ ...property, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateProperty(id, updates) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteProperty(id) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// =====================================================
// WATCHLISTS
// =====================================================

export async function getWatchlists() {
    if (!supabase) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('watchlists')
        .select(`
            *,
            watchlist_items(count),
            watchlist_followers(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform count aggregates
    return (data || []).map(list => ({
        ...list,
        items: list.watchlist_items?.[0]?.count || 0,
        followers: list.watchlist_followers?.[0]?.count || 0
    }));
}

export async function getPublicWatchlists() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('watchlists')
        .select(`
            *,
            watchlist_items(count),
            watchlist_followers(count)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) throw error;

    return (data || []).map(list => ({
        ...list,
        items: list.watchlist_items?.[0]?.count || 0,
        followers: list.watchlist_followers?.[0]?.count || 0
    }));
}

export async function createWatchlist(watchlist) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('watchlists')
        .insert({ ...watchlist, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateWatchlist(id, updates) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('watchlists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteWatchlist(id) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function addToWatchlist(watchlistId, propertyId, notes = '') {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('watchlist_items')
        .insert({ watchlist_id: watchlistId, property_id: propertyId, notes })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function removeFromWatchlist(watchlistId, propertyId) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('watchlist_items')
        .delete()
        .eq('watchlist_id', watchlistId)
        .eq('property_id', propertyId);

    if (error) throw error;
}

// =====================================================
// NOTIFICATIONS
// =====================================================

export async function getNotifications() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) throw error;
    return data || [];
}

export async function getUnreadNotificationCount() {
    if (!supabase) return 0;

    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

    if (error) return 0;
    return count || 0;
}

export async function markNotificationAsRead(id) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

    if (error) throw error;
}

export async function markAllNotificationsAsRead() {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

    if (error) throw error;
}

export async function deleteNotification(id) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// =====================================================
// SAVED CALCULATIONS
// =====================================================

export async function getSavedCalculations() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('saved_calculations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function saveCalculation(calculation) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('saved_calculations')
        .insert({ ...calculation, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteCalculation(id) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('saved_calculations')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
