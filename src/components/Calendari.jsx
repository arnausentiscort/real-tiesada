import React from 'react';
import { useSeason } from '../SeasonContext.jsx';

const MONTH_NAMES = ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'];

// Setmanes sense partit conegudes de la 1a Lliga Velòdrom F7
const FREE_WEEKS = ['2026-10-06', '2026-12-08', '2026-12-15', '2026-12-29', '2027-01-05'];

const getRS = (f, a) => {
  if (f > a) return { label: 'V', color: 'text-emerald-400' };
  if (f < a) return { label: 'D', color: 'text-[#C0392B]' };
  return { label: 'E', color: 'text-yellow-400' };
};

function MatchRow({ match, played }) {
  const [f, a] = played ? played.result.split('-').map(s => parseInt(s.trim())) : [null, null];
  const rs = played ? getRS(f, a) : null;
  return (
    <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl border border-white/5 px-3.5 py-3">
      <div className="flex flex-col items-center justify-center w-14 shrink-0">
        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">{match.jornada.replace('Jornada ', 'J')}</span>
        <span className="text-xs text-gray-400">{match.dateLabel.split(' · ')[0]}</span>
        <span className="text-[10px] text-gray-600">{match.dateLabel.split(' · ')[1]}</span>
      </div>
      <div className="w-px self-stretch bg-white/5"/>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{match.isHome ? '🏠' : '✈️'}</span>
          <span className="text-white font-bold text-sm truncate">{match.opponent}</span>
        </div>
        <p className="text-[10px] text-gray-600 mt-0.5">{match.location}</p>
      </div>
      {played ? (
        <div className={`flex flex-col items-center shrink-0 px-2.5 py-1 rounded-lg bg-black/30`}>
          <span className="font-black font-mono text-sm text-white">{played.result}</span>
          <span className={`text-[9px] font-black ${rs.color}`}>{rs.label}</span>
        </div>
      ) : (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 border ${
          match.isHome
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
            : 'bg-[#C0392B]/10 border-[#C0392B]/25 text-[#C0392B]'}`}>
          {match.isHome ? 'Local' : 'Visitant'}
        </span>
      )}
    </div>
  );
}

function FreeWeekRow({ date }) {
  const dateLabel = date.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' }).replace('.', '');
  return (
    <div className="flex items-center gap-3 bg-transparent rounded-xl border border-dashed border-white/10 px-3.5 py-2.5 opacity-60">
      <div className="flex flex-col items-center justify-center w-14 shrink-0">
        <span className="text-xs text-gray-500">{dateLabel}</span>
      </div>
      <div className="w-px self-stretch bg-white/5"/>
      <span className="text-xs text-gray-500 italic">🛌 Setmana lliure — sense partit</span>
    </div>
  );
}

export default function Calendari() {
  const { db: DATABASE, season } = useSeason();

  const items = [
    ...(DATABASE.calendar || []).map(c => ({ type: 'match', date: new Date(c.date), data: c })),
    ...FREE_WEEKS.map(d => ({ type: 'free', date: new Date(`${d}T12:00:00`), data: null })),
  ].sort((a, b) => a.date - b.date);

  const months = [];
  items.forEach(item => {
    const key = `${item.date.getFullYear()}-${item.date.getMonth()}`;
    let group = months.find(m => m.key === key);
    if (!group) {
      group = { key, label: MONTH_NAMES[item.date.getMonth()], year: item.date.getFullYear(), items: [] };
      months.push(group);
    }
    group.items.push(item);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">📅 Calendari</h2>
        <p className="text-gray-500 text-sm">{DATABASE.leagueLabel || season.period}</p>
      </header>

      {months.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-white font-bold">Encara no hi ha calendari</p>
          <p className="text-gray-700 text-xs mt-2 max-w-xs">Es publicarà quan es confirmi el calendari d'aquesta temporada.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {months.map(month => (
            <div key={month.key} className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-4">
              <h3 className="text-xs font-black text-[#E5C07B] uppercase tracking-widest mb-3 pb-2 border-b border-white/5">
                {month.label} {month.year}
              </h3>
              <div className="space-y-2">
                {month.items.map((item, i) => item.type === 'match' ? (
                  <MatchRow key={i} match={item.data}
                    played={DATABASE.matches.find(m => m.jornada === item.data.jornada)}/>
                ) : (
                  <FreeWeekRow key={i} date={item.date}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
