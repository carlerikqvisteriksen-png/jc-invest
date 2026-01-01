import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Scale, Briefcase, Loader2, Sparkles, Building2 } from 'lucide-react';

const WEBHOOK_URL = "/api/council";

export default function Council() {
    const [messages, setMessages] = useState([
        {
            role: 'system',
            content: 'Velkommen til Rådet. Jeg er Prosessen, din formidler. Still ditt spørsmål, og våre AI-eksperter (Advokat & Megler) vil analysere saken.',
            agents: null
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userQuestion = input.trim();
        setInput('');
        setIsLoading(true);

        // Add user message
        const newMessages = [...messages, { role: 'user', content: userQuestion }];
        setMessages(newMessages);

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: userQuestion }),
            });

            if (!response.ok) throw new Error('Failed to fetch council response');

            const data = await response.json();

            // Expected format: { advokat: "text", megler: "text" }
            // Or sometimes n8n returns an array or different structure depending on the last node.
            // Based on user description: { advokat: ..., megler: ... }

            const agentResponses = {
                advokat: data.advokat || data.Advokat || "Ingen respons mottatt.",
                megler: data.megler || data.Megler || "Ingen respons mottatt."
            };

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: null, // content is split into agents
                agents: agentResponses
            }]);

        } catch (error) {
            console.error("Council Error:", error);
            setMessages(prev => [...prev, {
                role: 'system',
                content: 'Beklager, Rådet er for tiden utilgjengelig. Prøv igjen senere.',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-[70vh] flex flex-col fade-in">

            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-serif text-brass mb-2">Det Høyere Råd</h2>
                <p className="text-stone-light text-sm">Konsulter våre AI-agenter for juridisk og strategisk bistand</p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-6 scrollbar-hide">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

                        {/* User Message */}
                        {msg.role === 'user' && (
                            <div className="max-w-[80%] bg-brass/10 border border-brass/20 text-ink-primary px-4 py-3 rounded-2xl rounded-tr-none backdrop-blur-sm">
                                <p>{msg.content}</p>
                            </div>
                        )}

                        {/* System Message */}
                        {msg.role === 'system' && (
                            <div className={`flex gap-3 max-w-[90%] ${msg.isError ? 'text-red-400' : 'text-stone-light'}`}>
                                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-stone-400" />
                                </div>
                                <div className="py-1 text-sm italic">
                                    {msg.content}
                                </div>
                            </div>
                        )}

                        {/* Council Response (Agents) */}
                        {msg.role === 'assistant' && msg.agents && (
                            <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* Advokat Card */}
                                <div className="velvet-card p-5 border-l-4 border-l-red-900/60">
                                    <div className="flex items-center gap-2 mb-3 text-red-300/80 uppercase tracking-widest text-xs font-semibold">
                                        <Scale className="w-4 h-4" />
                                        <span>Advokatens Vurdering</span>
                                    </div>
                                    <div className="prose prose-invert prose-sm max-w-none text-stone-200/90 leading-relaxed whitespace-pre-wrap">
                                        {msg.agents.advokat}
                                    </div>
                                </div>

                                {/* Megler Card */}
                                <div className="velvet-card p-5 border-l-4 border-l-brass/60">
                                    <div className="flex items-center gap-2 mb-3 text-brass/80 uppercase tracking-widest text-xs font-semibold">
                                        <Briefcase className="w-4 h-4" />
                                        <span>Meglerens Vurdering</span>
                                    </div>
                                    <div className="prose prose-invert prose-sm max-w-none text-stone-200/90 leading-relaxed whitespace-pre-wrap">
                                        {msg.agents.megler}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center justify-center py-4">
                        <div className="flex items-center gap-2 text-stone-500 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs uppercase tracking-widest">Rådet samles...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="relative mt-auto">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brass/20 to-red-900/20 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative flex items-center bg-obsidian border border-white/10 rounded-lg p-2 shadow-2xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Still et spørsmål til Rådet..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-ink-primary px-4 py-2 placeholder-stone-600 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="p-2 bg-brass/10 hover:bg-brass/20 text-brass rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-stone-700 mt-2 uppercase tracking-widest">
                    AI-modeller kan gjøre feil. Bruk informasjonen med forsiktighet.
                </p>
            </form>

        </div>
    );
}
