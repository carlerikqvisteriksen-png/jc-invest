import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Tag, Home, DollarSign, AlertCircle, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../lib/database';

const formatPrice = (num) => num ? new Intl.NumberFormat('nb-NO').format(num) : '';

function formatTimeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Nettopp';
    if (diffHours < 24) return `${diffHours} timer siden`;
    if (diffDays === 1) return '1 dag siden';
    return `${diffDays} dager siden`;
}

const NotificationIcon = ({ type }) => {
    switch (type) {
        case 'new_listing':
            return <Tag className="w-4 h-4 text-green-400" />;
        case 'sold':
            return <Home className="w-4 h-4 text-blue-400" />;
        case 'inactive':
            return <AlertCircle className="w-4 h-4 text-orange-400" />;
        case 'price_change':
            return <DollarSign className="w-4 h-4 text-yellow-400" />;
        case 'transaction':
            return <DollarSign className="w-4 h-4 text-purple-400" />;
        default:
            return <Bell className="w-4 h-4 text-stone-400" />;
    }
};

function NotificationItem({ notification, onMarkRead, onDismiss }) {
    return (
        <div className={`flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.is_read ? 'bg-brass/5' : ''
            }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notification.is_read ? 'bg-brass/20' : 'bg-white/10'
                }`}>
                <NotificationIcon type={notification.type} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm ${!notification.is_read ? 'text-ink-primary font-medium' : 'text-stone-300'}`}>
                        {notification.title}
                    </h4>
                    <button
                        onClick={() => onDismiss(notification.id)}
                        className="text-stone-600 hover:text-stone-400 transition-colors shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {notification.property_address && (
                    <p className="text-xs text-stone-500 mt-0.5 truncate">{notification.property_address}</p>
                )}

                {notification.new_price && (
                    <div className="flex items-center gap-2 mt-1">
                        {notification.old_price && (
                            <span className="text-xs text-stone-600 line-through">
                                NOK {formatPrice(notification.old_price)}
                            </span>
                        )}
                        <span className={`text-xs ${notification.type === 'price_change' ? 'text-green-400' : 'text-brass'}`}>
                            NOK {formatPrice(notification.new_price)}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-1 mt-2 text-[10px] text-stone-600">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(notification.created_at)}
                </div>
            </div>

            {!notification.is_read && (
                <button
                    onClick={() => onMarkRead(notification.id)}
                    className="w-2 h-2 rounded-full bg-brass shrink-0 mt-2"
                    title="Marker som lest"
                />
            )}
        </div>
    );
}

export default function NotificationPanel({
    isOpen = false,
    onClose = () => { },
    showAsDropdown = true
}) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const unreadCount = items.filter(n => !n.is_read).length;

    useEffect(() => {
        if (isOpen || !showAsDropdown) {
            loadNotifications();
        }
    }, [isOpen, showAsDropdown]);

    const loadNotifications = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getNotifications();
            setItems(data);
        } catch (err) {
            console.error('Error loading notifications:', err);
            setError('Kunne ikke laste varslinger');
        } finally {
            setIsLoading(false);
        }
    };

    const markRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setItems(prev => prev.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setItems(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const dismiss = async (id) => {
        try {
            await deleteNotification(id);
            setItems(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    if (showAsDropdown && !isOpen) return null;

    const content = (
        <>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-brass" />
                    <h3 className="font-medium text-ink-primary">Varslinger</h3>
                    {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-brass text-obsidian text-xs font-bold rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs text-brass hover:underline"
                        >
                            Marker alle som lest
                        </button>
                    )}
                    {showAsDropdown && (
                        <button onClick={onClose} className="text-stone-500 hover:text-stone-300">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="w-6 h-6 text-brass animate-spin" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-400">
                        <p>{error}</p>
                        <button onClick={loadNotifications} className="mt-2 text-brass hover:underline text-sm">
                            Prøv igjen
                        </button>
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center text-stone-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Ingen varslinger</p>
                    </div>
                ) : (
                    items.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkRead={markRead}
                            onDismiss={dismiss}
                        />
                    ))
                )}
            </div>

            {items.length > 0 && (
                <div className="p-3 border-t border-white/10">
                    <button className="w-full text-center text-xs text-stone-500 hover:text-brass transition-colors flex items-center justify-center gap-1">
                        Se alle varslinger
                        <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            )}
        </>
    );

    if (showAsDropdown) {
        return (
            <div className="absolute right-0 top-full mt-2 w-96 bg-obsidian border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
                {content}
            </div>
        );
    }

    return (
        <div className="velvet-card overflow-hidden">
            {content}
        </div>
    );
}

export function NotificationBell({ onClick }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        loadCount();
        // Refresh count every 30 seconds
        const interval = setInterval(loadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadCount = async () => {
        const unread = await getUnreadNotificationCount();
        setCount(unread);
    };

    return (
        <button
            onClick={onClick}
            className="relative p-2 text-stone-400 hover:text-brass transition-colors"
        >
            <Bell className="w-5 h-5" />
            {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brass text-obsidian text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </button>
    );
}
