import React, { useState } from 'react';
import { Bell, X, Check, Tag, Home, DollarSign, AlertCircle, Clock, ChevronRight } from 'lucide-react';

// Mock notifications - replace with real data later
const mockNotifications = [
    {
        id: 1,
        type: 'new_listing',
        title: 'Ny salgsannonse registrert!',
        address: 'Tennisveien 10B, 3063 STEINBERG',
        price: 3690000,
        time: '4 timer siden',
        read: false
    },
    {
        id: 2,
        type: 'sold',
        title: 'Annonsen har blitt markert som solgt',
        address: 'Skippergata 20B, 0152 OSLO',
        time: '5 timer siden',
        read: false
    },
    {
        id: 3,
        type: 'inactive',
        title: 'Annonsen er inaktiv',
        address: 'Sørgenfrgate 6B, 0367 OSLO',
        time: '11 timer siden',
        read: true
    },
    {
        id: 4,
        type: 'price_change',
        title: 'Prisendring',
        address: 'Langerekka 12, 5262 ARNATVEIT',
        oldPrice: 4500000,
        price: 4150000,
        time: '24 timer siden',
        read: true
    },
    {
        id: 5,
        type: 'transaction',
        title: 'Markedstransaksjon registrert',
        address: 'Langerekka 12, 5262 ARNATVEIT',
        price: 4150000,
        time: '25 timer siden',
        read: true
    }
];

const formatPrice = (num) => new Intl.NumberFormat('nb-NO').format(num);

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
        <div className={`flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.read ? 'bg-brass/5' : ''
            }`}>
            {/* Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notification.read ? 'bg-brass/20' : 'bg-white/10'
                }`}>
                <NotificationIcon type={notification.type} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm ${!notification.read ? 'text-ink-primary font-medium' : 'text-stone-300'}`}>
                        {notification.title}
                    </h4>
                    <button
                        onClick={() => onDismiss(notification.id)}
                        className="text-stone-600 hover:text-stone-400 transition-colors shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-xs text-stone-500 mt-0.5 truncate">{notification.address}</p>

                {/* Price info */}
                {notification.price && (
                    <div className="flex items-center gap-2 mt-1">
                        {notification.oldPrice && (
                            <span className="text-xs text-stone-600 line-through">
                                NOK {formatPrice(notification.oldPrice)}
                            </span>
                        )}
                        <span className={`text-xs ${notification.type === 'price_change' ? 'text-green-400' : 'text-brass'}`}>
                            NOK {formatPrice(notification.price)}
                        </span>
                    </div>
                )}

                {/* Time */}
                <div className="flex items-center gap-1 mt-2 text-[10px] text-stone-600">
                    <Clock className="w-3 h-3" />
                    {notification.time}
                </div>
            </div>

            {/* Unread indicator */}
            {!notification.read && (
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
    notifications = mockNotifications,
    isOpen = false,
    onClose = () => { },
    showAsDropdown = true
}) {
    const [items, setItems] = useState(notifications);

    const unreadCount = items.filter(n => !n.read).length;

    const markRead = (id) => {
        setItems(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllRead = () => {
        setItems(prev => prev.map(n => ({ ...n, read: true })));
    };

    const dismiss = (id) => {
        setItems(prev => prev.filter(n => n.id !== id));
    };

    if (showAsDropdown && !isOpen) return null;

    const content = (
        <>
            {/* Header */}
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

            {/* Notifications list */}
            <div className="max-h-[400px] overflow-y-auto">
                {items.length === 0 ? (
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

            {/* Footer */}
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

// Bell button with badge for use in header
export function NotificationBell({ count = 0, onClick }) {
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
