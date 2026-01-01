import React, { useState, useEffect } from 'react';
import { List, Plus, Star, Users, Calendar, Lock, Unlock, Trash2, Edit2, ChevronRight, X, Check, Share2, Loader2 } from 'lucide-react';
import { getWatchlists, getPublicWatchlists, createWatchlist, updateWatchlist, deleteWatchlist } from '../lib/database';

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function ListRow({ list, onEdit, onDelete, onTogglePublic }) {
    return (
        <div className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors rounded-lg group">
            <Star className={`w-4 h-4 shrink-0 ${list.is_premium ? 'text-brass fill-brass' : 'text-stone-600'}`} />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm text-ink-primary truncate">{list.name}</h4>
                    {list.is_premium && (
                        <span className="px-1.5 py-0.5 bg-brass/20 text-brass text-[9px] font-bold uppercase rounded">
                            Premium
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[10px] text-stone-500">
                    <span>{list.items || 0} boliger</span>
                    {list.followers > 0 && <span>{list.followers} følgere</span>}
                </div>
            </div>

            <div className="hidden md:block text-xs text-stone-500 w-24 text-center">
                {formatDate(list.created_at)}
            </div>
            <div className="hidden md:block text-xs text-stone-500 w-24 text-center">
                {formatDate(list.updated_at)}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onTogglePublic(list)}
                    className="p-1.5 text-stone-500 hover:text-stone-300 transition-colors"
                    title={list.is_public ? "Gjør privat" : "Gjør offentlig"}
                >
                    {list.is_public ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
                <button
                    onClick={() => onEdit(list)}
                    className="p-1.5 text-stone-500 hover:text-brass transition-colors"
                    title="Rediger"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(list.id)}
                    className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                    title="Slett"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <ChevronRight className="w-4 h-4 text-stone-600" />
        </div>
    );
}

function FollowedListRow({ list }) {
    return (
        <div className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors rounded-lg">
            <Star className={`w-4 h-4 shrink-0 ${list.is_premium ? 'text-brass fill-brass' : 'text-stone-600'}`} />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm text-ink-primary truncate">{list.name}</h4>
                    {list.is_premium && (
                        <span className="px-1.5 py-0.5 bg-brass/20 text-brass text-[9px] font-bold uppercase rounded">
                            Premium
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500">
                    <span>{list.items || 0} boliger</span>
                    <span>•</span>
                    <span>{list.followers || 0} følgere</span>
                </div>
            </div>

            <ChevronRight className="w-4 h-4 text-stone-600" />
        </div>
    );
}

function CreateListModal({ isOpen, onClose, onCreate, isLoading }) {
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onCreate({ name: name.trim(), is_public: isPublic });
            setName('');
            setIsPublic(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-obsidian border border-white/10 rounded-lg w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-lg font-serif text-brass">Opprett ny liste</h3>
                    <button type="button" onClick={onClose} className="text-stone-500 hover:text-stone-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm text-stone-400 mb-2">Navn på liste</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="F.eks. Mine favoritter i Oslo"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-ink-primary placeholder-stone-600 focus:outline-none focus:border-brass/50"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            className={`w-10 h-6 rounded-full transition-colors ${isPublic ? 'bg-brass' : 'bg-white/10'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${isPublic ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-sm text-stone-400">
                            {isPublic ? 'Offentlig liste' : 'Privat liste'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 p-4 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2 px-4 bg-white/5 text-stone-400 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Avbryt
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim() || isLoading}
                        className="flex-1 py-2 px-4 bg-brass/20 text-brass rounded-lg hover:bg-brass/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Opprett
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function WatchlistManager() {
    const [activeTab, setActiveTab] = useState('mine');
    const [lists, setLists] = useState([]);
    const [followedLists, setFollowedLists] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [myLists, publicLists] = await Promise.all([
                getWatchlists(),
                getPublicWatchlists()
            ]);
            setLists(myLists);
            setFollowedLists(publicLists.filter(l => !myLists.find(m => m.id === l.id)));
        } catch (err) {
            console.error('Error loading watchlists:', err);
            setError('Kunne ikke laste lister');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLists = lists.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = async (newList) => {
        setIsCreating(true);
        try {
            const created = await createWatchlist(newList);
            setLists(prev => [{ ...created, items: 0, followers: 0 }, ...prev]);
            setShowCreateModal(false);
        } catch (err) {
            console.error('Error creating watchlist:', err);
            alert('Kunne ikke opprette liste: ' + err.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Er du sikker på at du vil slette denne listen?')) return;

        try {
            await deleteWatchlist(id);
            setLists(prev => prev.filter(l => l.id !== id));
        } catch (err) {
            console.error('Error deleting watchlist:', err);
            alert('Kunne ikke slette liste: ' + err.message);
        }
    };

    const handleTogglePublic = async (list) => {
        try {
            await updateWatchlist(list.id, { is_public: !list.is_public });
            setLists(prev => prev.map(l =>
                l.id === list.id ? { ...l, is_public: !l.is_public } : l
            ));
        } catch (err) {
            console.error('Error updating watchlist:', err);
            alert('Kunne ikke oppdatere liste: ' + err.message);
        }
    };

    return (
        <div className="velvet-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-serif text-brass flex items-center gap-2">
                    <List className="w-5 h-5" />
                    Lister
                </h3>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-3 py-1.5 bg-brass/10 text-brass text-xs uppercase tracking-wider rounded hover:bg-brass/20 transition-colors flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" />
                    Ny liste
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('mine')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'mine'
                        ? 'text-brass border-b-2 border-brass'
                        : 'text-stone-500 hover:text-stone-300'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4" />
                        Mine lister
                        <span className="px-1.5 py-0.5 bg-white/10 text-[10px] rounded">{lists.length}</span>
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('following')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'following'
                        ? 'text-brass border-b-2 border-brass'
                        : 'text-stone-500 hover:text-stone-300'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        Offentlige lister
                        <span className="px-1.5 py-0.5 bg-white/10 text-[10px] rounded">{followedLists.length}</span>
                    </span>
                </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-white/10">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Søk i lister..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-ink-primary placeholder-stone-600 focus:outline-none focus:border-brass/50"
                />
            </div>

            {/* Table header */}
            <div className="hidden md:flex items-center gap-4 px-4 py-2 border-b border-white/10 text-[10px] uppercase tracking-wider text-stone-500">
                <div className="w-4"></div>
                <div className="flex-1">Tittel</div>
                <div className="w-24 text-center">Opprettet</div>
                <div className="w-24 text-center">Oppdatert</div>
                <div className="w-24"></div>
                <div className="w-4"></div>
            </div>

            {/* List content */}
            <div className="max-h-[400px] overflow-y-auto">
                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="w-6 h-6 text-brass animate-spin" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-400">
                        <p>{error}</p>
                        <button onClick={loadData} className="mt-2 text-brass hover:underline text-sm">
                            Prøv igjen
                        </button>
                    </div>
                ) : activeTab === 'mine' ? (
                    filteredLists.length === 0 ? (
                        <div className="p-8 text-center text-stone-500">
                            <List className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Ingen lister funnet</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="mt-3 text-brass hover:underline text-sm"
                            >
                                Opprett din første liste
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {filteredLists.map(list => (
                                <ListRow
                                    key={list.id}
                                    list={list}
                                    onEdit={() => { }}
                                    onDelete={handleDelete}
                                    onTogglePublic={handleTogglePublic}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    followedLists.length === 0 ? (
                        <div className="p-8 text-center text-stone-500">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Ingen offentlige lister</p>
                        </div>
                    ) : (
                        <div className new="divide-y divide-white/5">
                            {followedLists.map(list => (
                                <FollowedListRow key={list.id} list={list} />
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Create modal */}
            <CreateListModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreate}
                isLoading={isCreating}
            />
        </div>
    );
}
