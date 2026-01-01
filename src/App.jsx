import React, { useState, useEffect } from 'react';
import Council from './components/Council';
import Market from './components/Market';
import Login from './components/Login';
import PropertyList from './components/PropertyList';
import { supabase, signOut, onAuthStateChange } from './lib/supabase';
import { Bot, LineChart, Building2, ChevronRight, Lock, LogOut, ScrollText, Wallet, User } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    // Get current session
    const checkUser = async () => {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      }
      setIsLoading(false);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brass border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-obsidian text-ink-primary font-sans selection:bg-brass selection:text-obsidian relative overflow-x-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="fog-layer"></div>
        <div className="fog-layer-2"></div>
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header / Nave */}
        <header className="flex justify-between items-center mb-16 pt-4">
          <div
            className="flex items-center gap-3 group cursor-pointer animate-breathe"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-full bg-brass/10 border border-brass flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Building2 className="w-5 h-5 text-brass" />
            </div>
            <h1 className="text-2xl font-serif tracking-widest text-brass group-hover:text-brass-glow transition-colors">
              JC INVEST
            </h1>
          </div>

          <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-stone-light">
            <button onClick={() => setActiveTab('portfolio')} className={`hover:text-brass transition-colors ${activeTab === 'portfolio' ? 'text-brass' : ''}`}>Portefølje</button>
            <button onClick={() => setActiveTab('council')} className={`hover:text-brass transition-colors ${activeTab === 'council' ? 'text-brass' : ''}`}>Rådet</button>
            <button onClick={() => setActiveTab('market')} className={`hover:text-brass transition-colors ${activeTab === 'market' ? 'text-brass' : ''}`}>Marked</button>
            <button onClick={() => setActiveTab('settings')} className={`hover:text-brass transition-colors ${activeTab === 'settings' ? 'text-brass' : ''}`}>Innstillinger</button>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-stone-500 text-sm hidden md:inline">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="btn-ghost flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logg ut</span>
            </button>
          </div>
        </header>

        {/* Hero Section / Altar */}
        {activeTab === 'dashboard' && (
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 fade-in">

            {/* Left Column: Welcome & Stats */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="space-y-4 mb-8">
                <h2 className="text-5xl md:text-7xl font-serif text-ink-primary tracking-tight leading-none">
                  Kapitalens <br />
                  <span className="text-brass italic">Katedral</span>
                </h2>
                <p className="text-stone-light text-lg max-w-xl font-light leading-relaxed">
                  Tre inn i rikdommens helligdom. Rådfør deg med AI-rådet, administrer porteføljen din og observer markedene fra høysetet.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stat Card 1 */}
                <div className="card-compact group hover:border-brass/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="label-data">Total Balanse</span>
                    <Wallet className="w-4 h-4 text-brass/60" />
                  </div>
                  <div className="text-2xl font-serif text-ink-primary">kr 2,450,000</div>
                  <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <span>+12.5%</span>
                    <span className="text-stone-light">siste mnd</span>
                  </div>
                </div>

                {/* Stat Card 2 */}
                <div className="card-compact group hover:border-brass/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="label-data">Eiendom</span>
                    <Building2 className="w-4 h-4 text-brass/60" />
                  </div>
                  <div className="text-2xl font-serif text-ink-primary">kr 8,200,000</div>
                  <div className="text-xs text-stone-light mt-1">
                    4 Enheter
                  </div>
                </div>

                {/* Stat Card 3 */}
                <div className="card-compact group hover:border-brass/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="label-data">AI Råd</span>
                    <Bot className="w-4 h-4 text-brass/60" />
                  </div>
                  <div className="text-xl font-serif text-ink-primary">Avventer</div>
                  <div className="text-xs text-stone-light mt-1">
                    Siste: "Kjøp i Oslo Øst"
                  </div>
                </div>
              </div>

              {/* Main Action Area */}
              <div className="velvet-card-elevated mt-8 min-h-[300px] flex flex-col justify-center items-center text-center p-10 group">
                <div className="w-16 h-16 rounded-full bg-brass/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <ScrollText className="w-8 h-8 text-brass" />
                </div>
                <h3 className="text-2xl font-serif text-ink-primary mb-3">Søk Råd hos LLM Rådet</h3>
                <p className="text-stone-light max-w-md mb-8">
                  Våre AI-agenter (Advokat, Megler, Investore) står klare til å analysere din neste investering.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab('council')}
                    className="btn-cathedral flex items-center gap-2"
                  >
                    Start Sesjon <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Recent Activity / Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="gothic-card h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="heading-title text-lg">Siste Hendelser</h3>
                  <div className="badge-neutral">Live</div>
                </div>

                <div className="space-y-0">
                  <div className="ledger-row">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Oslo Børs Åpner</span>
                      <span className="text-xs text-stone-light">For 2 timer siden</span>
                    </div>
                    <span className="badge-neutral">Info</span>
                  </div>

                  <div className="ledger-row">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Leieinntekt: Parkveien</span>
                      <span className="text-xs text-stone-light">I dag, 08:30</span>
                    </div>
                    <span className="text-green-400 text-sm font-mono">+12.5k</span>
                  </div>

                  <div className="ledger-row">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Vedlikehold: Tak</span>
                      <span className="text-xs text-stone-light">I går</span>
                    </div>
                    <span className="text-red-400 text-sm font-mono">-4.2k</span>
                  </div>

                  <div className="ledger-row">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Ny rentesats</span>
                      <span className="text-xs text-stone-light">Norges Bank</span>
                    </div>
                    <span className="badge-high">4.5%</span>
                  </div>

                  <div className="ledger-row border-none">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Rådet Møte</span>
                      <span className="text-xs text-stone-light">For 2 dager siden</span>
                    </div>
                    <span className="badge-low">Fullført</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <button className="w-full btn-ghost text-xs uppercase tracking-widest">
                    Se hele loggen
                  </button>
                </div>
              </div>
            </div>

          </main>
        )}


        {activeTab === 'council' && (
          <main className="min-h-[60vh] flex flex-col items-center justify-center fade-in w-full">
            <Council />
          </main>
        )}

        {activeTab === 'market' && (
          <main className="w-full fade-in">
            <Market />
          </main>
        )}

        {activeTab === 'portfolio' && (
          <main className="w-full fade-in">
            <PropertyList />
          </main>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'dashboard' && activeTab !== 'council' && activeTab !== 'market' && activeTab !== 'portfolio' && (
          <main className="min-h-[60vh] flex flex-col items-center justify-center fade-in">
            <div className="velvet-card p-10 text-center">
              <h2 className="text-3xl font-serif text-brass mb-4 capitalize">{activeTab}</h2>
              <p className="text-stone-light">Denne seksjonen er under konstruksjon.</p>
              <button onClick={() => setActiveTab('dashboard')} className="btn-ghost mt-6">
                Tilbake til Dashbord
              </button>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}

export default App
