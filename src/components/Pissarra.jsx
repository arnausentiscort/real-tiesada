import React from 'react';
import TacticalBoard from './TacticalBoard.jsx';
import Entrenaments  from './Entrenaments.jsx';
import { goTo }      from '../router.js';

const TABS = [
  { id: 'jugades',  icon: '🎬', label: 'Jugades',  hash: '/tactica'          },
  { id: 'pissarra', icon: '🎯', label: 'Pissarra', hash: '/tactica/pissarra' },
];

export default function Pissarra({ tab = 'jugades', drillId = null }) {
  return (
    <div className="space-y-3">
      <div className="flex bg-[#121212] border border-white/10 rounded-xl p-1 gap-1 w-full sm:w-auto sm:inline-flex">
        {TABS.map(t => (
          <button key={t.id} onClick={() => goTo(t.hash)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === t.id ? 'bg-[#E5C07B]/20 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'jugades'  && <Entrenaments drillId={drillId} />}
      {tab === 'pissarra' && <TacticalBoard />}
    </div>
  );
}
