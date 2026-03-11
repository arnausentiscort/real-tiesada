import React, { useState } from 'react';
import GlobalDashboard from './components/GlobalDashboard.jsx';
import MatchDetail from './components/MatchDetail.jsx';
import { DATABASE } from './data.js';

// ==========================================
// COMPONENT PRINCIPAL — Real Tiesada FC
// ==========================================
export default function App() {
  // null = vista global | match object = vista detall
  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <div className="min-h-screen bg-[#121212] text-[#E2E8F0] font-sans pb-16">

      {/* === NAVBAR === */}
      <nav className="bg-[#1E1E1E] border-b border-[#E5C07B]/20 px-4 md:px-6 py-4 sticky top-0 z-50 shadow-lg shadow-black/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo / Nom equip */}
          <button
            onClick={() => setSelectedMatch(null)}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-[#C0392B] rounded-full flex items-center justify-center border-2 border-[#E5C07B] shadow-lg shadow-[#C0392B]/30">
              <span className="text-xl">🦇</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-widest text-[#E5C07B] uppercase leading-none group-hover:text-white transition-colors">
                {DATABASE.teamName}
              </h1>
              <p className="text-xs text-gray-500 tracking-wider">Fútbol Sala Amateur</p>
            </div>
          </button>

          {/* Indicador de vista activa */}
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
            <button
              onClick={() => setSelectedMatch(null)}
              className={`px-3 py-1.5 rounded transition-colors ${
                !selectedMatch ? 'bg-[#E5C07B]/10 text-[#E5C07B]' : 'hover:text-white'
              }`}
            >
              Temporada
            </button>
            {selectedMatch && (
              <>
                <span className="text-gray-700">/</span>
                <span className="px-3 py-1.5 rounded bg-[#E5C07B]/10 text-[#E5C07B]">
                  {selectedMatch.jornada}
                </span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* === CONTINGUT PRINCIPAL === */}
      <main className="max-w-6xl mx-auto mt-8 px-4 md:px-6">
        {selectedMatch ? (
          <MatchDetail
            match={selectedMatch}
            onBack={() => setSelectedMatch(null)}
          />
        ) : (
          <GlobalDashboard onSelectMatch={setSelectedMatch} />
        )}
      </main>

      {/* === FOOTER === */}
      <footer className="max-w-6xl mx-auto mt-16 px-4 md:px-6 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
        {DATABASE.teamName} · Stats Dashboard · Temporada 2023–24
      </footer>
    </div>
  );
}
