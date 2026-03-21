import React, { useState, useEffect } from 'react';
import GlobalDashboard  from './components/GlobalDashboard.jsx';
import MatchDetail      from './components/MatchDetail.jsx';
import Squad            from './components/Squad.jsx';
import Split1Dashboard  from './components/Split1Dashboard.jsx';
import Clasificacion    from './components/Clasificacion.jsx';
import GoalHeatmap      from './components/GoalHeatmap.jsx';
import Galeria          from './components/Galeria.jsx';
import LoadingScreen    from './components/LoadingScreen.jsx';
import Confetti         from './components/Confetti.jsx';
import AdminPanel       from './components/AdminPanel.jsx';
import { DATABASE }     from './data.js';

const BASE = import.meta.env.BASE_URL;

function SeasonToggle({ season, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-[#0d0d0d] border border-white/10 rounded-xl p-1">
      <button onClick={() => onChange('current')}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          season === 'current' ? 'bg-[#C0392B] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
        Actual
      </button>
      <button onClick={() => onChange('s1')}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          season === 's1' ? 'bg-[#C0392B] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
        Split 1
      </button>
    </div>
  );
}

export default function App() {
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState('dashboard');
  const [season, setSeason]     = useState('current');
  const [confetti, setConfetti] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Botó ocult: triple clic al logo obre el panel admin
  const [logoClicks, setLogoClicks] = useState(0);
  const handleLogoClick = () => {
    setLogoClicks(c => {
      const next = c + 1;
      if (next >= 3) { setShowAdmin(true); return 0; }
      setTimeout(() => setLogoClicks(0), 1000);
      return next;
    });
    navTo('dashboard');
  };

  const isMatch = view && typeof view === 'object';

  useEffect(() => {
    if (!isMatch) return;
    const [f, a] = view.result.split('-').map(Number);
    if (f > a) {
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [view]);

  const handleSelectMatch = (match) => { setView(match); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleSeasonChange = (s)    => { setSeason(s); setView('dashboard'); setMenuOpen(false); window.scrollTo({ top: 0 }); };
  const navTo = (v)                 => { setView(v); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const navCurrent = [
    { id: 'dashboard',     icon: '📊', label: 'Stats'         },
    { id: 'squad',         icon: '👥', label: 'Plantilla'     },
    { id: 'clasificacion', icon: '🏆', label: 'Classificació' },
    { id: 'heatmap',       icon: '🎯', label: 'Mapa de Gols'  },
    { id: 'galeria',       icon: '📸', label: 'Galeria'       },
  ];

  const activeNavId = isMatch ? 'dashboard' : (typeof view === 'string' ? view : 'dashboard');

  if (loading) return <LoadingScreen onDone={() => setLoading(false)} />;

  return (
    <div className="min-h-screen bg-[#121212] text-[#E2E8F0] font-sans pb-24 md:pb-8">
      <Confetti active={confetti} />

      {/* Admin Panel */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)}/>}

      {/* ── NAVBAR desktop (top) ── */}
      <nav className="bg-[#1A1A1A] border-b border-[#E5C07B]/15 px-4 md:px-6 sticky top-0 z-50 shadow-xl shadow-black/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 gap-3">

          {/* Logo — triple clic obre admin */}
          <button onClick={handleLogoClick}
            className="flex items-center gap-2 group shrink-0">
            <img src={`${BASE}escut.svg`} alt="Real Tiesada"
              className="w-8 h-8 drop-shadow-[0_0_8px_rgba(229,192,123,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(229,192,123,0.6)] transition-all" />
            <div className="hidden sm:block">
              <div className="text-base font-black tracking-widest text-[#E5C07B] uppercase leading-none">
                {DATABASE.teamName}
              </div>
              <div className="text-[10px] text-gray-600 tracking-wider">
                {season === 'current' ? 'Actual' : 'Split 1 · 24/25'}
              </div>
            </div>
          </button>

          {/* Selector temporada */}
          <SeasonToggle season={season} onChange={handleSeasonChange} />

          {/* Nav desktop */}
          {season === 'current' && (
            <div className="hidden md:flex items-center gap-0.5">
              {navCurrent.map(n => (
                <button key={n.id} onClick={() => navTo(n.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeNavId === n.id
                      ? 'bg-[#E5C07B]/15 text-[#E5C07B]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  {n.icon} {n.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Breadcrumb match */}
        {isMatch && season === 'current' && (
          <div className="max-w-6xl mx-auto pb-2 flex items-center gap-2 text-xs text-gray-500 px-1">
            <button onClick={() => setView('dashboard')} className="hover:text-[#E5C07B] transition-colors">
              Estadístiques
            </button>
            <span>/</span>
            <span className="text-[#E5C07B]">{view.jornada} vs {view.opponent}</span>
          </div>
        )}
      </nav>

      {/* ── CONTINGUT ── */}
      <main className="max-w-6xl mx-auto px-3 md:px-6 py-5 md:py-8">
        {season === 'current' && (
          <>
            {view === 'dashboard'     && <GlobalDashboard onSelectMatch={handleSelectMatch} />}
            {view === 'squad'         && <Squad />}
            {view === 'clasificacion' && <Clasificacion />}
            {view === 'heatmap'       && <GoalHeatmap />}
            {view === 'galeria'       && <Galeria />}
            {isMatch                  && <MatchDetail match={view} onBack={() => setView('dashboard')} onNavigate={(m) => setView(m)} />}
          </>
        )}
        {season === 's1' && <Split1Dashboard />}
      </main>

      {/* ── FOOTER desktop ── */}
      <footer className="hidden md:block border-t border-white/5 mt-8 py-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src={`${BASE}escut.svg`} alt="" className="w-5 h-5 opacity-40" />
          <span className="text-gray-600 text-xs font-bold tracking-widest uppercase">{DATABASE.teamName}</span>
        </div>
        <p className="text-gray-700 text-xs">Estadístiques internes · No oficial</p>
        <p className="text-gray-700 text-[10px] mt-1">
          Patrocinat per <span className="text-[#E5C07B]/50 font-bold">Cal Sendra</span>
        </p>
      </footer>

      {/* ── BOTTOM NAV mòbil ── */}
      {season === 'current' && !isMatch && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-t border-white/10">
          <div className="flex items-stretch h-16">
            {navCurrent.map(n => (
              <button key={n.id} onClick={() => navTo(n.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all ${
                  activeNavId === n.id ? 'text-[#E5C07B]' : 'text-gray-600 hover:text-gray-300'}`}>
                <span className="text-lg leading-none">{n.icon}</span>
                <span className="text-[9px] font-semibold leading-none tracking-wide">
                  {n.label.split(' ')[0]}
                </span>
                {activeNavId === n.id && (
                  <div className="absolute bottom-0 w-8 h-0.5 rounded-full bg-[#E5C07B]"
                    style={{ bottom: 0 }}/>
                )}
              </button>
            ))}
          </div>
          {/* safe area iOS */}
          <div className="h-safe-bottom bg-[#1a1a1a]/95" style={{ height: 'env(safe-area-inset-bottom, 0px)' }}/>
        </div>
      )}

      {/* Bottom nav quan hi ha match obert — botó enrere */}
      {season === 'current' && isMatch && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-t border-white/10">
          <button onClick={() => setView('dashboard')}
            className="w-full h-14 flex items-center justify-center gap-2 text-[#E5C07B] text-sm font-bold">
            ← Tornar a Estadístiques
          </button>
        </div>
      )}
    </div>
  );
}
