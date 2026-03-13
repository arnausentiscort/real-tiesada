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
import { DATABASE }     from './data.js';

const BASE = import.meta.env.BASE_URL;

function NavBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        active ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      {children}
    </button>
  );
}

function SeasonToggle({ season, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-[#0d0d0d] border border-white/10 rounded-xl p-1">
      <button onClick={() => onChange('current')}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          season === 'current' ? 'bg-[#C0392B] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
        25/26 · Split 2
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

  const isMatch = view && typeof view === 'object';

  // Dispara confeti quan s'obre un resultat de victòria
  useEffect(() => {
    if (!isMatch) return;
    const [f, a] = view.result.split('-').map(Number);
    if (f > a) {
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [view]);

  const handleSelectMatch = (match) => {
    setView(match);
    setMenuOpen(false);
  };

  const handleSeasonChange = (s) => {
    setSeason(s);
    setView('dashboard');
    setMenuOpen(false);
  };

  const navTo = (v) => {
    setView(v);
    setMenuOpen(false);
  };

  // Nav items per temporada actual
  const navCurrent = [
    { id: 'dashboard',     label: '📊 Stats'         },
    { id: 'squad',         label: '👥 Plantilla'      },
    { id: 'clasificacion', label: '🏆 Classificació'  },
    { id: 'heatmap',       label: '🎯 Mapa de Gols'   },
    { id: 'galeria',       label: '📸 Galeria'        },
  ];

  const activeNavId = isMatch ? 'dashboard' : (typeof view === 'string' ? view : 'dashboard');

  if (loading) return <LoadingScreen onDone={() => setLoading(false)} />;

  return (
    <div className="min-h-screen bg-[#121212] text-[#E2E8F0] font-sans pb-16">
      <Confetti active={confetti} />

      {/* ── NAVBAR ── */}
      <nav className="bg-[#1A1A1A] border-b border-[#E5C07B]/15 px-4 md:px-6 sticky top-0 z-50 shadow-xl shadow-black/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <button onClick={() => navTo('dashboard')}
            className="flex items-center gap-3 group shrink-0">
            <img src={`${BASE}escut.svg`} alt="Real Tiesada"
              className="w-10 h-10 drop-shadow-[0_0_8px_rgba(229,192,123,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(229,192,123,0.6)] transition-all" />
            <div className="hidden sm:block">
              <div className="text-lg font-black tracking-widest text-[#E5C07B] uppercase leading-none group-hover:text-white transition-colors">
                {DATABASE.teamName}
              </div>
              <div className="text-xs text-gray-600 tracking-wider">
                {season === 'current' ? 'Split 2 · 25/26' : 'Split 1 · 24/25'}
              </div>
            </div>
          </button>

          {/* Selector temporada */}
          <SeasonToggle season={season} onChange={handleSeasonChange} />

          {/* Nav desktop */}
          {season === 'current' && (
            <div className="hidden md:flex items-center gap-1">
              {navCurrent.map(n => (
                <NavBtn key={n.id} active={activeNavId === n.id} onClick={() => navTo(n.id)}>
                  {n.label}
                </NavBtn>
              ))}
            </div>
          )}

          {/* Hamburger mòbil */}
          {season === 'current' && (
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="space-y-1.5">
                <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          )}
        </div>

        {/* Menú mòbil desplegable */}
        {menuOpen && season === 'current' && (
          <div className="md:hidden border-t border-white/5 py-2 px-2">
            {navCurrent.map(n => (
              <button key={n.id}
                onClick={() => navTo(n.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                  activeNavId === n.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {n.label}
              </button>
            ))}
          </div>
        )}

        {/* Breadcrumb */}
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
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {season === 'current' && (
          <>
            {view === 'dashboard'     && <GlobalDashboard onSelectMatch={handleSelectMatch} />}
            {view === 'squad'         && <Squad />}
            {view === 'clasificacion' && <Clasificacion />}
            {view === 'heatmap'       && <GoalHeatmap />}
            {view === 'galeria'       && <Galeria />}
            {isMatch                  && <MatchDetail match={view} onBack={() => setView('dashboard')} />}
          </>
        )}
        {season === 's1' && <Split1Dashboard />}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 mt-16 py-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src={`${BASE}escut.svg`} alt="" className="w-6 h-6 opacity-50" />
          <span className="text-gray-600 text-sm font-bold tracking-widest uppercase">{DATABASE.teamName}</span>
        </div>
        <p className="text-gray-700 text-xs">Estadístiques internes · No oficial</p>
      </footer>
    </div>
  );
}
