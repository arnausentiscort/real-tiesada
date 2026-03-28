import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;

// Obté la llista de jugadors que van participar al partit
function getMatchPlayers(match) {
  const names = new Set();
  const subs = match.events?.substitutions || [];
  subs.forEach(sub => {
    (sub.onPitch || []).forEach(n => names.add(n));
  });
  (match.events?.goals || []).forEach(g => {
    if (g.scorer) names.add(g.scorer);
    if (g.assist) names.add(g.assist);
    (g.onPitch || []).forEach(n => names.add(n));
  });
  (match.events?.retransmissio || []).forEach(r => {
    (r.players || []).forEach(n => names.add(n));
  });
  if (match.savesManual) {
    Object.keys(match.savesManual).forEach(n => names.add(n));
  }
  // Si no hi ha dades de jugadors, mostra tota la plantilla
  if (names.size === 0) {
    DATABASE.roster.forEach(p => names.add(p.name));
  }
  return [...names].filter(n => DATABASE.roster.find(r => r.name === n));
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function getVotes(matchId) {
  console.log('fetching votes', matchId);
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/mvp_votes?match_id=eq.${matchId}`,
    { headers: { 'Accept': 'application/json', 'apikey': SUPABASE_ANON_KEY } }
  );
  console.log('res.status', res.status);
  console.log('res.headers', Object.fromEntries(res.headers.entries()));
  const data = res.ok ? await res.json() : null;
  console.log('votes response', data);
  return data ?? [];
}

export default function MvpVoting({ match }) {
  const storageKey = `mvp_${match.id}`;
  const [voted, setVoted] = useState(() => localStorage.getItem(storageKey));
  const [votes, setVotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`${storageKey}_votes`) || '{}'); }
    catch { return {}; }
  });
  const [hovered, setHovered] = useState(null);
  const [justVoted, setJustVoted] = useState(false);

  useEffect(() => {
    getVotes(match.id);
  }, [match.id]);

  const players = getMatchPlayers(match);

  function handleVote(voterName, votedFor) {
    if (voted) return;
    console.log('inserting vote', match.id, voterName, votedFor);
    const ok = true; // TODO: Supabase insert
    console.log('insert result', ok);
    const newVotes = { ...votes, [votedFor]: (votes[votedFor] || 0) + 1 };
    setVotes(newVotes);
    setVoted(votedFor);
    setJustVoted(true);
    localStorage.setItem(storageKey, votedFor);
    localStorage.setItem(`${storageKey}_votes`, JSON.stringify(newVotes));
    setTimeout(() => setJustVoted(false), 1800);
  }

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const maxVotes = Math.max(...Object.values(votes), 1);

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 overflow-hidden">
      {/* Capçalera */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <Star className="w-5 h-5 text-[#E5C07B]" fill="#E5C07B" />
        <div>
          <h3 className="font-bold text-white text-sm">MVP del Partit</h3>
          <p className="text-xs text-gray-500">{totalVotes} {totalVotes === 1 ? 'vot' : 'vots'}</p>
        </div>
        {voted && (
          <span className="ml-auto text-xs bg-[#E5C07B]/10 text-[#E5C07B] px-2 py-1 rounded-full border border-[#E5C07B]/20">
            Has votat
          </span>
        )}
      </div>

      {/* Llista jugadors */}
      <div className="p-4 space-y-2">
        {players.map(name => {
          const player = DATABASE.roster.find(r => r.name === name);
          const v = votes[name] || 0;
          const pct = totalVotes > 0 ? Math.round((v / totalVotes) * 100) : 0;
          const isVoted = voted === name;
          const isHovered = hovered === name;
          const photo = player?.photoCel || player?.photo;

          return (
            <button
              key={name}
              onClick={() => handleVote('anon', name)}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              disabled={!!voted}
              className={`w-full text-left rounded-xl transition-all duration-200 overflow-hidden
                ${!voted ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}
                ${isVoted ? 'ring-1 ring-[#E5C07B]/40' : ''}
              `}
            >
              <div className="relative flex items-center gap-3 px-3 py-2.5">
                {/* Barra de progrés de fons */}
                {voted && (
                  <div
                    className="absolute inset-0 rounded-xl transition-all duration-700"
                    style={{
                      background: isVoted
                        ? 'rgba(229,192,123,0.08)'
                        : 'rgba(255,255,255,0.02)',
                      width: `${pct}%`,
                    }}
                  />
                )}

                {/* Foto */}
                <div className="relative flex-shrink-0">
                  {photo ? (
                    <img
                      src={`${BASE}${photo}`}
                      alt={name}
                      className="w-9 h-9 rounded-full object-cover object-top border border-white/10"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center text-sm font-bold text-gray-400">
                      {player?.number || '?'}
                    </div>
                  )}
                  {isVoted && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#E5C07B] rounded-full flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-black" fill="black" />
                    </div>
                  )}
                </div>

                {/* Nom i dorsal */}
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold text-sm truncate ${isVoted ? 'text-[#E5C07B]' : 'text-white'}`}>
                      {name}
                    </span>
                    {player?.number && (
                      <span className="text-xs text-gray-600 flex-shrink-0">#{player.number}</span>
                    )}
                  </div>
                  {player?.position && (
                    <p className="text-xs text-gray-600">{player.position}</p>
                  )}
                </div>

                {/* Percentatge / icona votar */}
                <div className="relative flex-shrink-0 text-right">
                  {voted ? (
                    <div>
                      <div className={`font-bold text-sm ${isVoted ? 'text-[#E5C07B]' : 'text-gray-500'}`}>
                        {pct}%
                      </div>
                      <div className="text-xs text-gray-600">{v} {v === 1 ? 'vot' : 'vots'}</div>
                    </div>
                  ) : (
                    <Star
                      className={`w-5 h-5 transition-all duration-150 ${isHovered ? 'text-[#E5C07B] scale-110' : 'text-gray-600'}`}
                      fill={isHovered ? '#E5C07B' : 'transparent'}
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback de vot */}
      {justVoted && (
        <div className="mx-4 mb-4 text-center py-2 rounded-lg bg-[#E5C07B]/10 border border-[#E5C07B]/20 text-[#E5C07B] text-sm font-semibold animate-pulse">
          Vot registrat!
        </div>
      )}
    </div>
  );
}
