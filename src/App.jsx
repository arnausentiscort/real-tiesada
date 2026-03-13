import React, { useState } from 'react';
import GlobalDashboard from './components/GlobalDashboard.jsx';
import MatchDetail from './components/MatchDetail.jsx';
import Squad from './components/Squad.jsx';
import Split1Dashboard from './components/Split1Dashboard.jsx';
import { DATABASE } from './data.js';

const BASE = import.meta.env.BASE_URL;

function NavBtn({ active, onClick, children }) {
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

function SeasonToggle({ season, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-[#0d0d0d] border border-white/10 rounded-xl p-1">
      <button
        onClick={() => onChange('current')}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          season === 'current'
            ? 'bg-[#C0392B] text-white shadow-lg'
            : 'text-gray-500 hover:text-white'
        }`}
      >
        25/26 · Futsal
      </button>
      <button
        onClick={() => onChange('s1')}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          season === 's1'
            ? 'bg-[#C0392B] text-white shadow-lg'
            : 'text-gray-500 hover:text-white'
        }`}
      >
        Split 1
      </button>
    </div>
  );
}

export default function App() {
  const [view, setView]     = useState('dashboard');
  const [season, setSeason] = useState('current'); // 'current' | 's1'

  const handleSelectMatch = (match) => setView(match);
  const isMatch = view && typeof view === 'object';

  const handleSeasonChange = (s) => {
    setSeason(s);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#E2E8F0] font-sans pb-16">

      {/* ── NAVBAR ── */}
      <nav className="bg-[#1A1A1A] border-b border-[#E5C07B]/15 px-4 md:px-6 sticky top-0 z-50 shadow-xl shadow-black/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 gap-3">

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
              <div className="text-xs text-gray-600 tracking-wider">
                {season === 'current' ? 'Temporada Actual' : 'Split 1'}
              </div>
            </div>
          </button>

          {/* Selector temporada */}
          <SeasonToggle season={season} onChange={handleSeasonChange} />

          {/* Navegació */}
          <div className="flex items-center gap-1">
            <NavBtn active={view === 'dashboard' || isMatch} onClick={() => setView('dashboard')}>
              📊 Stats
            </NavBtn>
            {season === 'current' && (
              <NavBtn active={view === 'squad'} onClick={() => setView('squad')}>
                👥 Plantilla
              </NavBtn>
            )}
          </div>
        </div>

        {/* Breadcrumb si estem dins un partit (només temporada actual) */}
        {isMatch && season === 'current' && (
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
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* Temporada actual */}
        {season === 'current' && (
          <>
            {view === 'dashboard' && (
              <GlobalDashboard onSelectMatch={handleSelectMatch} />
            )}
            {view === 'squad' && <Squad />}
            {isMatch && (
              <MatchDetail match={view} onBack={() => setView('dashboard')} />
            )}
          </>
        )}

        {/* Split anterior */}
        {season === 's1' && (
          <Split1Dashboard />
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 mt-16 py-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src={`${BASE}escut.svg`} alt="" className="w-6 h-6 opacity-50" />
          <span className="text-gray-600 text-sm font-bold tracking-widest uppercase">
            {DATABASE.teamName}
          </span>
        </div>
        <p className="text-gray-700 text-xs">Estadístiques internes · No oficial</p>
      </footer>
    </div>
  );
}
