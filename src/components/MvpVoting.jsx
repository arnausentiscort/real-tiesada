import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;

const supabase = createClient(
  'https://pibacoitanqebynhvpnc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYmFjb2l0YW5xZWJ5bmh2cG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODkzODEsImV4cCI6MjA5MDI2NTM4MX0.SzhGturICQHYCNOyivySgPo3fG-5Pfk6n6MQYEYAqLg'
);

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
  if (names.size === 0) {
    DATABASE.roster.forEach(p => names.add(p.name));
  }
  return [...names].filter(n => DATABASE.roster.find(r => r.name === n));
}

export default function MvpVoting({ match }) {
  const storageKey = `mvp_${match.id}`;
  const [voted, setVoted] = useState(() => localStorage.getItem(storageKey));
  const [votes, setVotes] = useState({});
  const [hovered, setHovered] = useState(null);
  const [justVoted, setJustVoted] = useState(false);

  useEffect(() => {
    async function fetchVotes() {
      const { data, error } = await supabase
        .from('mvp_votes')
        .select('voted_for')
        .eq('match_id', match.id);
      if (error) { console.error('getVotes error', error); return; }
      const tally = {};
      (data || []).forEach(row => {
        tally[row.voted_for] = (tally[row.voted_for] || 0) + 1;
      });
      setVotes(tally);
    }
    fetchVotes();
  }, [match.id]);

  const players = getMatchPlayers(match);

  async function handleVote(votedFor) {
    if (voted) return;
    const { error } = await supabase
      .from('mvp_votes')
      .insert({ match_id: match.id, voter_name: 'anon', voted_for: votedFor });
    if (error) { console.error('insert error', error); return; }
    const newVotes = { ...votes, [votedFor]: (votes[votedFor] || 0) + 1 };
    setVotes(newVotes);
    setVoted(votedFor);
    setJustVoted(true);
    localStorage.setItem(storageKey, votedFor);
    setTimeout(() => setJustVoted(false), 1800);
  }

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 overflow-hidden">
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
              onClick={() => handleVote(name)}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              disabled={!!voted}
              className={`w-full text-left rounded-xl transition-all duration-200 overflow-hidden
                ${!voted ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}
                ${isVoted ? 'ring-1 ring-[#E5C07B]/40' : ''}
              `}
            >
              <div className="relative flex items-center gap-3 px-3 py-2.5">
                {voted && (
                  <div
                    className="absolute inset-0 rounded-xl transition-all duration-700"
                    style={{
                      background: isVoted ? 'rgba(229,192,123,0.08)' : 'rgba(255,255,255,0.02)',
                      width: `${pct}%`,
                    }}
                  />
                )}
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

      {justVoted && (
        <div className="mx-4 mb-4 text-center py-2 rounded-lg bg-[#E5C07B]/10 border border-[#E5C07B]/20 text-[#E5C07B] text-sm font-semibold animate-pulse">
          Vot registrat!
        </div>
      )}
    </div>
  );
}
