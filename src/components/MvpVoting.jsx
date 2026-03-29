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

function dorsal(name) {
  const pl = DATABASE.roster.find(r => r.name === name);
  return pl?.shirtName || name.split(' ')[0].toUpperCase();
}

export default function MvpVoting({ match }) {
  const voterKey = `mvp_voter_${match.id}`;
  const [voterName, setVoterName] = useState(() => localStorage.getItem(voterKey));
  const [voted, setVoted] = useState(null);
  const [votes, setVotes] = useState({});
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

  function handleStarClick() {
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
    setVoterName(null);
    localStorage.removeItem(voterKey);
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
    if (!voterName) { flashMessage('Primer selecciona el teu nom'); return; }
    if (voted) return;

    const { data: existing, error: checkErr } = await supabase
      .from('mvp_votes')
      .select('voted_for')
      .eq('match_id', match.id)
      .eq('voter_name', voterName)
      .limit(1);
    if (checkErr) { console.error('check error', checkErr); return; }
    if (existing && existing.length > 0) {
      setVoted(existing[0].voted_for);
      flashMessage('Ja has votat');
      return;
    }

    const { error } = await supabase
      .from('mvp_votes')
      .insert({ match_id: match.id, voter_name: voterName, voted_for: votedFor });
    if (error) { console.error('insert error', error); return; }
    setVoted(votedFor);
    await fetchVotes();
  }

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const sortedVotes = Object.entries(votes).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-[#E5C07B]/15 overflow-hidden">
      {/* Barra principal compacta */}
      <div className="flex items-center gap-2 px-3 h-12">
        {/* Icona estrella (triple click → reset) */}
        <button
          onClick={handleStarClick}
          className="shrink-0 cursor-default select-none"
        >
          <Star className="w-3.5 h-3.5 text-[#E5C07B]" fill="#E5C07B" />
        </button>

        {/* Fase 1: Qui ets? */}
        {!voterName && (
          <>
            <span className="text-xs text-gray-500 shrink-0 font-medium">Qui ets?</span>
            <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
              {players.map(name => (
                <button
                  key={name}
                  onClick={() => handleSelectVoter(name)}
                  className="shrink-0 px-2 py-1 rounded-full bg-white/5 hover:bg-[#E5C07B]/15 border border-white/10 hover:border-[#E5C07B]/30 text-[11px] font-bold text-gray-400 hover:text-[#E5C07B] transition-all whitespace-nowrap"
                >
                  {dorsal(name)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Fase 2: Vota MVP */}
        {voterName && !voted && (
          <>
            <button
              onClick={() => { setVoterName(null); localStorage.removeItem(voterKey); setVoted(null); }}
              className="shrink-0 px-2 py-1 rounded-full bg-[#E5C07B]/10 border border-[#E5C07B]/25 text-[11px] font-bold text-[#E5C07B] transition-all hover:bg-[#E5C07B]/20 whitespace-nowrap"
            >
              {dorsal(voterName)} ✕
            </button>
            <span className="text-xs text-gray-600 shrink-0">MVP?</span>
            <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
              {players.filter(n => n !== voterName).map(name => (
                <button
                  key={name}
                  onClick={() => handleVote(name)}
                  className="shrink-0 px-2 py-1 rounded-full bg-white/5 hover:bg-[#E5C07B]/15 border border-white/10 hover:border-[#E5C07B]/30 text-[11px] font-bold text-gray-400 hover:text-[#E5C07B] transition-all whitespace-nowrap"
                >
                  {dorsal(name)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Fase 3: Votat */}
        {voted && (
          <>
            <span className="text-[11px] text-gray-600 shrink-0">{dorsal(voterName)}</span>
            <span className="text-[11px] font-bold text-emerald-400 shrink-0">✓ {dorsal(voted)}</span>
            {totalVotes > 0 && (
              <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar items-center">
                {sortedVotes.map(([name, count]) => (
                  <span key={name}
                    className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full border whitespace-nowrap
                      ${name === voted
                        ? 'bg-[#E5C07B]/10 border-[#E5C07B]/25 text-[#E5C07B]'
                        : 'bg-white/3 border-white/8 text-gray-600'}`}>
                    {dorsal(name)} {count}
                  </span>
                ))}
              </div>
            )}
            {totalVotes === 0 && <div className="flex-1" />}
            <span className="text-[10px] text-gray-700 shrink-0">{totalVotes}v</span>
          </>
        )}

        {/* Reset */}
        {showReset && (
          <button
            onClick={handleReset}
            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" /> Reset
          </button>
        )}
      </div>

      {/* Flash missatge */}
      {message && (
        <div className="px-3 pb-2">
          <div className="text-center py-1 rounded-lg text-xs font-semibold bg-[#E5C07B]/8 border border-[#E5C07B]/15 text-[#E5C07B]">
            {message}
          </div>
        </div>
      )}
    </div>
  );
}
