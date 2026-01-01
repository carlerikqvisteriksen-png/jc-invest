import React, { useState } from 'react';
import { Building2, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '../lib/supabase';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                await signUpWithEmail(email, password);
                setError('');
                // Show success message for sign up
                alert('Sjekk e-posten din for å bekrefte kontoen!');
            } else {
                const data = await signInWithEmail(email, password);
                if (data.user) {
                    onLogin(data.user);
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            if (err.message.includes('Invalid login')) {
                setError('Feil e-post eller passord');
            } else if (err.message.includes('User already registered')) {
                setError('Denne e-posten er allerede registrert');
            } else if (err.message.includes('Password should be')) {
                setError('Passordet må være minst 6 tegn');
            } else {
                setError(err.message || 'Noe gikk galt. Prøv igjen.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="fog-layer"></div>
                <div className="fog-layer-2"></div>
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            {/* Decorative glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brass/5 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">

                {/* Logo & Welcome */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brass/10 border border-brass/30 mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                        <Building2 className="w-8 h-8 text-brass" />
                    </div>
                    <h1 className="text-4xl font-serif text-brass tracking-widest mb-3">
                        JC INVEST
                    </h1>
                    <p className="text-stone-400 text-sm">
                        {isSignUp ? 'Opprett din konto' : 'Velkommen tilbake'}
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="velvet-card p-8">
                    {/* Error message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Email field */}
                    <div className="mb-5">
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                            E-post
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="din@epost.no"
                                required
                                autoComplete="email"
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-ink-primary placeholder-stone-600 focus:outline-none focus:border-brass/50 focus:ring-1 focus:ring-brass/30 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="mb-6">
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                            Passord
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-12 py-3 text-ink-primary placeholder-stone-600 focus:outline-none focus:border-brass/50 focus:ring-1 focus:ring-brass/30 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-brass/80 to-brass text-obsidian font-medium rounded-lg hover:from-brass hover:to-brass-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brass/20"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>{isSignUp ? 'Oppretter konto...' : 'Logger inn...'}</span>
                            </>
                        ) : (
                            <>
                                <span>{isSignUp ? 'Opprett konto' : 'Logg inn'}</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {/* Toggle sign up / sign in */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-stone-500">
                            {isSignUp ? 'Har du allerede en konto?' : 'Ny bruker?'}
                        </span>
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                            className="ml-2 text-brass hover:underline"
                        >
                            {isSignUp ? 'Logg inn' : 'Opprett konto'}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <p className="text-center text-stone-600 text-xs mt-8">
                    Ved å logge inn godtar du våre vilkår og personvernregler.
                </p>
            </div>
        </div>
    );
}
