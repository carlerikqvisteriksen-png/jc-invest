import React, { useState, useRef, useEffect } from 'react';
import { Send, Scale, Briefcase, Loader2, Sparkles, TrendingUp, Calculator, Hammer, Crown, ChevronDown, ChevronUp } from 'lucide-react';

const WEBHOOK_URL = "/api/council";

// Collapsible Card Component
function ExpertCard({ icon: Icon, title, content, color, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (!content || content === "Ingen respons mottatt.") return null;

    return (
        <div className={`velvet-card overflow-hidden transition-all duration-300 border-l-4 ${color}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2 uppercase tracking-widest text-xs font-semibold">
                    <Icon className="w-4 h-4" />
                    <span>{title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 pt-0 prose prose-invert prose-sm max-w-none text-stone-200/90 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-2 duration-200">
                    {content}
                </div>
            )}
        </div>
    );
}

export default function Council() {
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [responses, setResponses] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim() || isLoading) return;

        const userQuestion = question.trim();
        setQuestion('');
        setIsLoading(true);
        setError(null);
        setCurrentQuestion(userQuestion);
        setResponses(null);

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userQuestion }),
            });

            if (!response.ok) throw new Error('Failed to fetch council response');

            const data = await response.json();

            setResponses({
                advokat: data.advokat || data.Advokat || null,
                megler: data.megler || data.Megler || null,
                okonom: data.okonom || data.Økonom || null,
                handverker: data.handverker || data.Håndverker || null,
                investor: data.investor || data.Investor || null,
                styreleder: data.styreleder || data.Styreleder || null
            });

        } catch (err) {
            console.error("Council Error:", err);
            setError('Beklager, Rådet er for tiden utilgjengelig. Prøv igjen senere.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewQuestion = () => {
        setResponses(null);
        setCurrentQuestion(null);
        setError(null);
    };

    // Show results view
    if (responses) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 py-8 fade-in">
                {/* Header with question */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-serif text-brass mb-2">Rådets Konklusjon</h2>
                    <p className="text-stone-400 text-sm mb-4">Ditt spørsmål:</p>
                    <div className="inline-block bg-brass/10 border border-brass/20 rounded-lg px-4 py-2 text-ink-primary">
                        "{currentQuestion}"
                    </div>
                </div>

                {/* Styreleder Summary - Always visible and prominent */}
                {responses.styreleder && (
                    <div className="mb-8 relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brass/30 via-brass/10 to-brass/30 rounded-xl blur-sm"></div>
                        <div className="relative velvet-card p-6 border-2 border-brass/40 bg-gradient-to-b from-brass/5 to-transparent">
                            <div className="flex items-center gap-2 mb-4 text-brass uppercase tracking-widest text-sm font-bold">
                                <Crown className="w-5 h-5" />
                                <span>Styrelederens Oppsummering & Anbefaling</span>
                            </div>
                            <div className="prose prose-invert max-w-none text-ink-primary leading-relaxed whitespace-pre-wrap">
                                {responses.styreleder}
                            </div>
                        </div>
                    </div>
                )}

                {/* Expert Cards Grid */}
                <div className="mb-8">
                    <h3 className="text-lg font-serif text-stone-400 mb-4 text-center">Ekspertenes Vurderinger</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ExpertCard
                            icon={Scale}
                            title="Advokat"
                            content={responses.advokat}
                            color="border-l-red-900/60 text-red-300/80"
                        />
                        <ExpertCard
                            icon={Briefcase}
                            title="Megler"
                            content={responses.megler}
                            color="border-l-brass/60 text-brass/80"
                        />
                        <ExpertCard
                            icon={Calculator}
                            title="Økonom"
                            content={responses.okonom}
                            color="border-l-blue-500/60 text-blue-400/80"
                        />
                        <ExpertCard
                            icon={Hammer}
                            title="Håndverker"
                            content={responses.handverker}
                            color="border-l-orange-500/60 text-orange-400/80"
                        />
                        <ExpertCard
                            icon={TrendingUp}
                            title="Investor"
                            content={responses.investor}
                            color="border-l-green-600/60 text-green-400/80"
                        />
                    </div>
                </div>

                {/* New Question Button */}
                <div className="text-center">
                    <button
                        onClick={handleNewQuestion}
                        className="btn-cathedral"
                    >
                        Still et nytt spørsmål
                    </button>
                </div>
            </div>
        );
    }

    // Show input view
    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] fade-in">

            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-serif text-brass mb-2">Det Høyere Råd</h2>
                <p className="text-stone-light text-sm max-w-md mx-auto">
                    Still ditt spørsmål, og våre 5 eksperter vil analysere saken.
                    Deretter oppsummerer Styrelederen og gir deg en anbefaling.
                </p>
            </div>

            {/* Expert Icons */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                        <Scale className="w-5 h-5 text-red-400/70" />
                    </div>
                    <span className="text-[10px] text-stone-500 uppercase">Advokat</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-brass/10 border border-brass/20 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-brass/70" />
                    </div>
                    <span className="text-[10px] text-stone-500 uppercase">Megler</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-blue-400/70" />
                    </div>
                    <span className="text-[10px] text-stone-500 uppercase">Økonom</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-orange-900/20 border border-orange-500/30 flex items-center justify-center">
                        <Hammer className="w-5 h-5 text-orange-400/70" />
                    </div>
                    <span className="text-[10px] text-stone-500 uppercase">Håndverker</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-green-900/20 border border-green-600/30 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-400/70" />
                    </div>
                    <span className="text-[10px] text-stone-500 uppercase">Investor</span>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-3 bg-brass/10 border border-brass/20 rounded-lg px-6 py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-brass" />
                        <div>
                            <p className="text-brass font-medium">Rådet samles...</p>
                            <p className="text-xs text-stone-500">Dette kan ta opptil 60 sekunder</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-3 bg-red-900/20 border border-red-500/30 rounded-lg px-6 py-4 text-red-400">
                        <Sparkles className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brass/20 to-red-900/20 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative flex items-center bg-obsidian border border-white/10 rounded-lg p-2 shadow-2xl">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Bør jeg kjøpe leilighet i Hønefoss?"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-ink-primary px-4 py-3 placeholder-stone-600 focus:outline-none text-lg"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !question.trim()}
                            className="p-3 bg-brass/10 hover:bg-brass/20 text-brass rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-stone-700 mt-3 uppercase tracking-widest">
                    AI-modeller kan gjøre feil. Bruk informasjonen med forsiktighet.
                </p>
            </form>
        </div>
    );
}
