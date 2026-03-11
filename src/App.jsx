import React, { useState } from 'react';
import GlobalDashboard from './components/GlobalDashboard.jsx';
import MatchDetail from './components/MatchDetail.jsx';
import Squad from './components/Squad.jsx';
import { DATABASE } from './data.js';

// Determina el base URL per a les imatges (funciona tant en local com a GitHub Pages)
const BASE = import.meta.env.BASE_URL;

export default function App() {
  // 'dashboard' | 'squad' | match object
  const [view, setView] = useState('dashboard');

  const handleSelectMatch = (match) => setView(match);
  const isMatch = view && typeof view === 'object';

  return (
    <div className="min-h-screen bg-[#121212] text-[#E2E8F0] font-sans pb-16">

      {/* ── NAVBAR ── */}
      <nav className="bg-[#1A1A1A] border-b border-[#E5C07B]/15 px-4 md:px-6 sticky top-0 z-50 shadow-xl shadow-black/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">

          {/* Logo + Nom */}
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-3 group shrink-0"
          >
            <img
              src={`${BASE}escut.svg`}
              alt="Real Tiesada"
              className="w-10 h-10 drop-shadow-[0_0_8px_rgba(229,192,123,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(229,192,123,0.6)] transition-all"
            />
            <div className="hidden sm:block">
              <div className="text-lg font-black tracking-widest text-[#E5C07B] uppercase leading-none group-hover:text-white transition-colors">
                {DATABASE.teamName}
              </div>
              <div className="text-xs text-gray-600 tracking-wider">Fútbol Sala · Temporada 25/26</div>
            </div>
          </button>

          {/* Navegació */}
          <div className="flex items-center gap-1">
            <NavBtn active={view === 'dashboard' || isMatch} onClick={() => setView('dashboard')}>
              📊 Estadístiques
            </NavBtn>
            <NavBtn active={view === 'squad'} onClick={() => setView('squad')}>
              👥 Plantilla
            </NavBtn>
          </div>
        </div>

        {/* Breadcrumb si estem dins un partit */}
        {isMatch && (
          <div className="max-w-6xl mx-auto pb-2 flex items-center gap-2 text-xs text-gray-500">
            <button onClick={() => setView('dashboard')} className="hover:text-[#E5C07B] transition-colors">
              Estadístiques
            </button>
            <span>/</span>
            <span className="text-[#E5C07B]">{view.jornada} vs {view.opponent}</span>
          </div>
        )}
      </nav>

      {/* ── CONTINGUT ── */}
      <main className="max-w-6xl mx-auto mt-8 px-4 md:px-6">
        {isMatch ? (
          <MatchDetail match={view} onBack={() => setView('dashboard')} />
        ) : view === 'squad' ? (
          <Squad />
        ) : (
          <GlobalDashboard onSelectMatch={handleSelectMatch} />
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="max-w-6xl mx-auto mt-16 px-4 md:px-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <img src={`${BASE}escut.svg`} alt="Escut" className="w-8 h-8 opacity-50" />
            <span className="text-xs text-gray-600">
              {DATABASE.teamName} · Stats Dashboard · Temporada 2025–26
            </span>
          </div>
          <span className="text-xs text-gray-700">Patrocinat per Cal Sendra</span>
        </div>
      </footer>
    </div>
  );
}

// ── Component petit per als botons de navegació ──
function NavBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-[#E5C07B]/15 text-[#E5C07B]'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}
