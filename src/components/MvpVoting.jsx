import React, { useState, useEffect, useRef } from 'react';
import { Star, RotateCcw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { DATABASE } from '../data.js';

const supabase = createClient(
  'https://pibacoitanqebynhvpnc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYmFjb2l0YW5xZWJ5bmh2cG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODkzODEsImV4cCI6MjA5MDI2NTM4MX0.SzhGturICQHYCNOyivySgPo3fG-5Pfk6n6MQYEYAqLg'
);

function getMatchPlayers(match) {
  const names = new Set();
  (match.events?.substitutions || []).forEach(sub => (sub.onPitch || []).forEach(n => names.add(n)));
  (match.events?.goals || []).forEach(g => {
    if (g.scorer) names.add(g.scorer);
    if (g.assist) names.add(g.assist);
    (g.onPitch || []).forEach(n => names.add(n));
  });
  (match.events?.retransmissio || []).forEach(r => (r.players || []).forEach(n => names.add(n)));
  if (match.savesManual) Object.keys(match.savesManual).forEach(n => names.add(n));
  if (names.size === 0) DATABASE.roster.forEach(p => names.add(p.name));
  return [...names].filter(n => DATABASE.roster.find(r => r.name === n));
}

function dorsal(name) {
  const pl = DATABASE.roster.find(r => r.name === name);
  return pl?.shirtName || name.split(' ')[0].toUpperCase();
}

function calcRanking(rows) {
  const pts = {};
  rows.forEach(row => {
    if (row.gold)   pts[row.gold]   = (pts[row.gold]   || 0) + 3;
    if (row.silver) pts[row.silver] = (pts[row.silver] || 0) + 2;
    if (row.bronze) pts[row.bronze] = (pts[row.bronze] || 0) + 1;
  });
  return Object.entries(pts).sort((a, b) => b[1] - a[1]);
}

const MEDAL = ['🥇', '🥈', '🥉'];

export default function MvpVoting({ match }) {
  const voterKey = `mvp_voter_${match.id}`;

  const [voterName, setVoterName] = useState(() => localStorage.getItem(voterKey));
  // step: 0=qui ets, 1=or, 2=plata, 3=coure, 4=votat
  const [step, setStep] = useState(0);
  const [gold, setGold] = useState(null);
  const [silver, setSilver] = useState(null);
  const [bronze, setBronze] = useState(null);
  const [rows, setRows] = useState([]);
  const [alreadyVoted, setAlreadyVoted] = useState(null);
  const [message, setMessage] = useState(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);
  const [showReset, setShowReset] = useState(false);

  const players = getMatchPlayers(match);

  async function fetchRows() {
    const { data, error } = await supabase
      .from('mvp_votes')
      .select('voter_name, gold, silver, bronze')
      .eq('match_id', match.id);
    if (!error) setRows(data || []);
  }

  async function checkVoted(name) {
    if (!name) return;
    const { data, error } = await supabase
      .from('mvp_votes')
      .select('voter_name, gold, silver, bronze')
      .eq('match_id', match.id)
      .eq('voter_name', name)
      .limit(1);
    if (!error && data && data.length > 0) {
      setAlreadyVoted(data[0]);
      setStep(4);
    } else {
      setAlreadyVoted(null);
      setStep(1);
    }
  }

  useEffect(() => {
    fetchRows();
    if (voterName) checkVoted(voterName);
    const interval = setInterval(fetchRows, 15000);
    return () => clearInterval(interval);
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
    setVoterName(null);
    localStorage.removeItem(voterKey);
    setGold(null); setSilver(null); setBronze(null);
    setAlreadyVoted(null);
    setStep(0);
    setShowReset(false);
    await fetchRows();
    flashMessage('Vots reiniciats');
  }

  async function handleSelectVoter(name) {
    setVoterName(name);
    localStorage.setItem(voterKey, name);
    setGold(null); setSilver(null); setBronze(null);
    await checkVoted(name);
  }

  async function handleVote() {
    if (!gold || !silver || !bronze) { flashMessage('Selecciona els 3 jugadors'); return; }

    const { data: existing, error: checkErr } = await supabase
      .from('mvp_votes')
      .select('voter_name')
      .eq('match_id', match.id)
      .eq('voter_name', voterName)
      .limit(1);
    if (checkErr) { console.error(checkErr); return; }
    if (existing && existing.length > 0) {
      flashMessage('Ja has votat');
      await checkVoted(voterName);
      return;
    }

    const { error } = await supabase
      .from('mvp_votes')
      .insert({ match_id: match.id, voter_name: voterName, gold, silver, bronze });
    if (error) { console.error('insert error', error); return; }
    setAlreadyVoted({ voter_name: voterName, gold, silver, bronze });
    setStep(4);
    await fetchRows();
  }

  const ranking = calcRanking(rows);
  const totalVoters = rows.length;

  const availableForSilver = players.filter(n => n !== gold);
  const availableForBronze = players.filter(n => n !== gold && n !== silver);

  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-[#E5C07B]/15 overflow-hidden">
      <div className="flex items-center gap-2 px-3 h-12">

        {/* Estrella triple-click → reset */}
        <button onClick={handleStarClick} className="shrink-0 cursor-default select-none">
          <Star className="w-3.5 h-3.5 text-[#E5C07B]" fill="#E5C07B" />
        </button>

        {/* PAS 0: Qui ets? */}
        {step === 0 && (
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

        {/* PAS 1: Or (3pts) */}
        {step === 1 && (
          <>
            <button
              onClick={() => { setVoterName(null); localStorage.removeItem(voterKey); setStep(0); }}
              className="shrink-0 px-2 py-1 rounded-full bg-[#E5C07B]/10 border border-[#E5C07B]/25 text-[11px] font-bold text-[#E5C07B] hover:bg-[#E5C07B]/20 transition-all whitespace-nowrap"
            >
              {dorsal(voterName)} ✕
            </button>
            <span className="text-xs text-gray-500 shrink-0">🥇 Or</span>
            <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
              {players.map(name => (
                <button
                  key={name}
                  onClick={() => { setGold(name); setStep(2); }}
                  className="shrink-0 px-2 py-1 rounded-full bg-white/5 hover:bg-yellow-500/15 border border-white/10 hover:border-yellow-500/30 text-[11px] font-bold text-gray-400 hover:text-yellow-400 transition-all whitespace-nowrap"
                >
                  {dorsal(name)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* PAS 2: Plata (2pts) */}
        {step === 2 && (
          <>
            <button
              onClick={() => setStep(1)}
              className="shrink-0 px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-[10px] font-bold text-yellow-400 whitespace-nowrap"
            >
              🥇 {dorsal(gold)}
            </button>
            <span className="text-xs text-gray-500 shrink-0">🥈 Plata</span>
            <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
              {availableForSilver.map(name => (
                <button
                  key={name}
                  onClick={() => { setSilver(name); setStep(3); }}
                  className="shrink-0 px-2 py-1 rounded-full bg-white/5 hover:bg-gray-400/15 border border-white/10 hover:border-gray-400/30 text-[11px] font-bold text-gray-400 hover:text-gray-300 transition-all whitespace-nowrap"
                >
                  {dorsal(name)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* PAS 3: Coure (1pt) + botó Votar */}
        {step === 3 && (
          <>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setStep(2)} className="px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-[10px] font-bold text-yellow-400">🥇 {dorsal(gold)}</button>
              <button onClick={() => setStep(2)} className="px-1.5 py-0.5 rounded-full bg-gray-400/10 border border-gray-400/25 text-[10px] font-bold text-gray-400">🥈 {dorsal(silver)}</button>
            </div>
            <span className="text-xs text-gray-500 shrink-0">🥉 Coure</span>
            <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
              {availableForBronze.map(name => (
                <button
                  key={name}
                  onClick={() => setBronze(name)}
                  className={`shrink-0 px-2 py-1 rounded-full border text-[11px] font-bold transition-all whitespace-nowrap
                    ${bronze === name
                      ? 'bg-amber-700/20 border-amber-700/40 text-amber-500'
                      : 'bg-white/5 hover:bg-amber-700/15 border-white/10 hover:border-amber-700/30 text-gray-400 hover:text-amber-500'}`}
                >
                  {dorsal(name)}
                </button>
              ))}
            </div>
            <button
              onClick={handleVote}
              disabled={!bronze}
              className={`shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all whitespace-nowrap
                ${bronze
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-white/3 border-white/8 text-gray-700 cursor-default'}`}
            >
              Votar
            </button>
          </>
        )}

        {/* PAS 4: Votat — mostra selecció + rànquing */}
        {step === 4 && alreadyVoted && (
          <>
            <span className="text-[11px] text-gray-600 shrink-0">{dorsal(voterName)}</span>
            <div className="flex gap-1 shrink-0">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">🥇 {dorsal(alreadyVoted.gold)}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-400/10 border border-gray-400/20 text-gray-300">🥈 {dorsal(alreadyVoted.silver)}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-700/10 border border-amber-700/20 text-amber-500">🥉 {dorsal(alreadyVoted.bronze)}</span>
            </div>
            <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar items-center">
              {ranking.map(([name, pts], i) => (
                <span key={name}
                  className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full border whitespace-nowrap
                    ${i === 0 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    : i === 1 ? 'bg-gray-400/10 border-gray-400/20 text-gray-300'
                    : i === 2 ? 'bg-amber-700/10 border-amber-700/20 text-amber-500'
                    : 'bg-white/3 border-white/8 text-gray-600'}`}>
                  {MEDAL[i] || ''}{dorsal(name)} {pts}p
                </span>
              ))}
            </div>
            <span className="text-[10px] text-gray-700 shrink-0">{totalVoters}v</span>
          </>
        )}

        {/* Reset secret */}
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
