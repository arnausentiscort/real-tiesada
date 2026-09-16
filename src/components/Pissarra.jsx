import React, { useState } from 'react';
import TacticalBoard from './TacticalBoard.jsx';
import Entrenaments  from './Entrenaments.jsx';

const TABS = [
  { id: 'jugades',  icon: '🎬', label: 'Jugades'  },
  { id: 'pissarra', icon: '🎯', label: 'Pissarra' },
];

export default function Pissarra() {
  const [tab, setTab] = useState('jugades');

  return (
    <div className="space-y-3">
      <div className="flex bg-[#121212] border border-white/10 rounded-xl p-1 gap-1 w-full sm:w-auto sm:inline-flex">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === t.id ? 'bg-[#E5C07B]/20 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'jugades'  && <Entrenaments />}
      {tab === 'pissarra' && <TacticalBoard />}
    </div>
  );
}
