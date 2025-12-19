
import React, { useState } from 'react';
import { storageService } from '../services/storageService';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error: signUpError } = await storageService.signUp(email, password);
                if (signUpError) throw signUpError;
                alert('Verification email sent! Please check your inbox.');
            } else {
                const { error: signInError } = await storageService.signIn(email, password);
                if (signInError) throw signInError;
                onSuccess();
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-6 z-[150] animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transform animate-in slide-in-from-bottom-12 duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-spice-primary"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-stone-50 text-stone-400 hover:text-stone-800 rounded-full transition-all"
                >
                    <i className="fas fa-times"></i>
                </button>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-spice-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <i className="fas fa-user-shield text-white text-2xl"></i>
                    </div>
                    <h2 className="text-3xl font-black text-stone-900 tracking-tight">
                        {isSignUp ? 'Join DDH Masale' : 'Welcome Back'}
                    </h2>
                    <p className="text-stone-500 mt-2 font-medium">
                        {isSignUp ? 'Create an account to manage your spice business' : 'Sign in to access your dashboard'}
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={() => storageService.signInWithGoogle()}
                        className="w-full flex items-center justify-center space-x-3 py-4 bg-white border-2 border-stone-100 rounded-2xl font-bold text-stone-700 hover:bg-stone-50 hover:border-stone-200 transition-all shadow-sm active:scale-[0.98]"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        <span>Continue with Google</span>
                    </button>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-stone-100"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-black uppercase text-stone-300 tracking-[0.2em]">or continue with email</span>
                        <div className="flex-grow border-t border-stone-100"></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.2em] ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all font-bold text-stone-800 placeholder:text-stone-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.2em] ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all font-bold text-stone-800 placeholder:text-stone-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-spice-primary text-white py-5 rounded-2xl font-black hover:bg-red-900 transition-all shadow-2xl shadow-red-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
                    >
                        {loading ? (
                            <i className="fas fa-circle-notch animate-spin"></i>
                        ) : (
                            isSignUp ? 'Create Account' : 'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-stone-400 hover:text-spice-primary text-sm font-bold transition-colors"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
