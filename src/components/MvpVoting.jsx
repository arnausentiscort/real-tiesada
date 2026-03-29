import React, { useState, useEffect, useRef } from 'react';
import { Star, RotateCcw } from 'lucide-react';
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
  subs.forEach(sub => { (sub.onPitch || []).forEach(n => names.add(n)); });
  (match.events?.goals || []).forEach(g => {
    if (g.scorer) names.add(g.scorer);
    if (g.assist) names.add(g.assist);
    (g.onPitch || []).forEach(n => names.add(n));
  });
  (match.events?.retransmissio || []).forEach(r => { (r.players || []).forEach(n => names.add(n)); });
  if (match.savesManual) Object.keys(match.savesManual).forEach(n => names.add(n));
  if (names.size === 0) DATABASE.roster.forEach(p => names.add(p.name));
  return [...names].filter(n => DATABASE.roster.find(r => r.name === n));
}

export default function MvpVoting({ match }) {
  const voterKey = `mvp_voter_${match.id}`;
  const [voterName, setVoterName] = useState(() => localStorage.getItem(voterKey));
  const [voted, setVoted] = useState(null);
  const [votes, setVotes] = useState({});
  const [hovered, setHovered] = useState(null);
  const [message, setMessage] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const players = getMatchPlayers(match);

  async function fetchVotes() {
    const { data, error } = await supabase
      .from('mvp_votes')
      .select('voted_for')
      .eq('match_id', match.id);
    if (error) { console.error('getVotes error', error); return; }
    const tally = {};
    (data || []).forEach(row => { tally[row.voted_for] = (tally[row.voted_for] || 0) + 1; });
    setVotes(tally);
  }

  async function checkIfVoted(name) {
    if (!name) return;
    const { data, error } = await supabase
      .from('mvp_votes')
      .select('voted_for')
      .eq('match_id', match.id)
      .eq('voter_name', name)
      .limit(1);
    if (error) return;
    setVoted(data && data.length > 0 ? data[0].voted_for : null);
  }

  useEffect(() => {
    fetchVotes();
    if (voterName) checkIfVoted(voterName);
  }, [match.id]);

  function flashMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(null), 2200);
  }

  function handleTitleClick() {
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      setShowReset(prev => !prev);
      clickCountRef.current = 0;
    } else {
      clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 800);
    }
  }

  async function handleReset() {
    const { error } = await supabase
      .from('mvp_votes')
      .delete()
      .eq('match_id', match.id);
    if (error) { console.error('reset error', error); return; }
    setVoted(null);
    setShowReset(false);
    await fetchVotes();
    flashMessage('Vots reiniciats');
  }

  async function handleSelectVoter(name) {
    setVoterName(name);
    localStorage.setItem(voterKey, name);
    await checkIfVoted(name);
  }

  async function handleVote(votedFor) {
    if (!voterName) {
      flashMessage('Primer selecciona el teu nom');
      return;
    }
    if (voted) return;

    // Comprovació anti-duplicat a Supabase
    const { data: existing, error: checkErr } = await supabase
      .from('mvp_votes')
      .select('voted_for')
      .eq('match_id', match.id)
      .eq('voter_name', voterName)
      .limit(1);
    if (checkErr) { console.error('check error', checkErr); return; }
    if (existing && existing.length > 0) {
      setVoted(existing[0].voted_for);
      flashMessage('Ja has votat en aquest partit');
      return;
    }

    const { error } = await supabase
      .from('mvp_votes')
      .insert({ match_id: match.id, voter_name: voterName, voted_for: votedFor });
    if (error) { console.error('insert error', error); return; }
    setVoted(votedFor);
    flashMessage('Vot registrat!');
    await fetchVotes();
  }

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const isError = message && message !== 'Vot registrat!' && message !== 'Vots reiniciats';

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-[#E5C07B]/15 overflow-hidden">
      {/* Capçalera */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <Star className="w-5 h-5 text-[#E5C07B]" fill="#E5C07B" />
        <div>
          <h3
            className="font-bold text-white text-sm cursor-default select-none"
            onClick={handleTitleClick}
          >
            Vota el MVP
          </h3>
          <p className="text-xs text-gray-500">{totalVotes} {totalVotes === 1 ? 'vot' : 'vots'}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {voted && (
            <span className="text-xs bg-[#E5C07B]/10 text-[#E5C07B] px-2 py-1 rounded-full border border-[#E5C07B]/20">
              Has votat
            </span>
          )}
          {showReset && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reiniciar vots
            </button>
          )}
        </div>
      </div>

      {/* Selector qui ets tu */}
      {!voterName && (
        <div className="px-4 pt-4 pb-2 border-b border-white/5">
          <p className="text-xs text-gray-400 mb-2 font-medium">Qui ets tu?</p>
          <div className="grid grid-cols-2 gap-2">
            {players.map(name => {
              const pl = DATABASE.roster.find(r => r.name === name);
              const photo = pl?.photoCel || pl?.photo;
              return (
                <button
                  key={name}
                  onClick={() => handleSelectVoter(name)}
                  className="flex items-center gap-2 text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-[#E5C07B]/10 hover:border-[#E5C07B]/20 border border-transparent text-white text-xs font-medium transition-all"
                >
                  {photo
                    ? <img src={`${BASE}${photo}`} alt={name} className="w-6 h-6 rounded-full object-cover object-top border border-white/10 shrink-0"/>
                    : <div className="w-6 h-6 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">{pl?.number || '?'}</div>
                  }
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Indicador votant seleccionat */}
      {voterName && !voted && (
        <div className="px-5 pt-3 pb-0 flex items-center gap-2">
          <span className="text-xs text-gray-500">Votant:</span>
          <span className="text-xs text-[#E5C07B] font-semibold">{voterName}</span>
          <button
            onClick={() => { setVoterName(null); localStorage.removeItem(voterKey); setVoted(null); }}
            className="text-gray-600 hover:text-gray-400 text-xs ml-1 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

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
              onClick={() => handleVote(name)}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
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
                    <img src={`${BASE}${photo}`} alt={name} className="w-9 h-9 rounded-full object-cover object-top border border-white/10"/>
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
                    <span className={`font-semibold text-sm truncate ${isVoted ? 'text-[#E5C07B]' : 'text-white'}`}>{name}</span>
                    {player?.number && <span className="text-xs text-gray-600 flex-shrink-0">#{player.number}</span>}
                  </div>
                  {player?.position && <p className="text-xs text-gray-600">{player.position}</p>}
                </div>
                <div className="relative flex-shrink-0 text-right">
                  {voted ? (
                    <div>
                      <div className={`font-bold text-sm ${isVoted ? 'text-[#E5C07B]' : 'text-gray-500'}`}>{pct}%</div>
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

      {/* Missatge flash */}
      {message && (
        <div className={`mx-4 mb-4 text-center py-2 rounded-lg text-sm font-semibold
          ${isError
            ? 'bg-red-500/10 border border-red-500/20 text-red-400'
            : 'bg-[#E5C07B]/10 border border-[#E5C07B]/20 text-[#E5C07B] animate-pulse'
          }`}>
          {message}
        </div>
      )}
    </div>
  );
}
