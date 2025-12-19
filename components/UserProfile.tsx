
import React, { useState, useEffect } from 'react';
import { QuoteRequest, User } from '../types';
import { storageService } from '../services/storageService';

interface UserProfileProps {
    user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserQuotes = async () => {
            setIsLoading(true);
            try {
                const userQuotes = await storageService.getUserQuotes(user.id);
                setQuotes(userQuotes);
            } catch (error) {
                console.error("Failed to fetch user quotes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserQuotes();
    }, [user.id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'responded': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'closed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-stone-100 text-stone-700 border-stone-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="mb-12">
                <span className="text-spice-primary font-bold uppercase tracking-widest text-sm">Account</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-2 text-stone-900">Welcome, {user.username}</h2>
                <p className="text-stone-500 mt-4">Manage your quote requests and account settings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm sticky top-24">
                        <div className="w-20 h-20 bg-stone-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <i className="fas fa-user text-white text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-6">Profile Details</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1 tracking-widest">Email Address</label>
                                <p className="text-stone-800 font-bold">{user.username}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1 tracking-widest">Account Type</label>
                                <p className="text-stone-800 font-bold capitalize">{user.role}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1 tracking-widest">User ID</label>
                                <p className="text-stone-400 text-xs font-mono truncate">{user.id}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => storageService.signOut()}
                            className="w-full mt-10 bg-stone-50 hover:bg-red-50 hover:text-red-600 text-stone-600 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2"
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Quote History */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-stone-900">Quote History</h3>
                            <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold">
                                {quotes.length} Requests
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-10 h-10 border-4 border-spice-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : quotes.length > 0 ? (
                            <div className="space-y-4">
                                {quotes.map((quote) => (
                                    <div key={quote.id} className="group p-6 rounded-2xl border border-stone-100 hover:border-spice-primary/20 hover:bg-stone-50/50 transition-all">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h4 className="font-bold text-stone-900">{quote.productName}</h4>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(quote.status)}`}>
                                                        {quote.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-stone-500">
                                                    <span className="flex items-center">
                                                        <i className="far fa-calendar-alt mr-1.5"></i>
                                                        {new Date(quote.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <i className="fas fa-layer-group mr-1.5"></i>
                                                        {quote.quantity} kg
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button className="p-3 bg-white border border-stone-100 rounded-xl text-stone-400 hover:text-spice-primary hover:border-spice-primary/30 transition-all shadow-sm">
                                                    <i className="fas fa-chevron-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-file-invoice text-stone-300 text-2xl"></i>
                                </div>
                                <h4 className="text-lg font-bold text-stone-800 mb-2">No quotes yet</h4>
                                <p className="text-stone-500 max-w-xs mx-auto mb-8">
                                    You haven't requested any quotes yet. Explore our catalog to get started.
                                </p>
                                <button
                                    onClick={() => window.location.href = '/catalog'}
                                    className="bg-spice-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-red-900 transition-all shadow-lg"
                                >
                                    Browse Spices
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
