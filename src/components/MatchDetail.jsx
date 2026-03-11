import React, { useMemo } from 'react';
import { ChevronLeft, PlayCircle, Clock, Star, XCircle, AlertCircle } from 'lucide-react';
import { DATABASE } from '../data.js';
import { parseTime, formatTime, calcMatchStats } from '../utils.js';

// ==========================================
// VISTA B: DETALL D'UN PARTIT
// ==========================================
export default function MatchDetail({ match, onBack }) {

  const hasSubstitutions = match.events.substitutions.length > 1;

  // Només calculem stats si tenim substitucions
  const matchStats = useMemo(() => {
    if (!hasSubstitutions) return null;
    return calcMatchStats(match);
  }, [match, hasSubstitutions]);

  // Color de la barra de minuts
  const barColor = (deviation) => {
    if (deviation > 120)  return 'bg-[#C0392B]';
    if (deviation < -120) return 'bg-[#4A5568]';
    return 'bg-[#E5C07B]';
  };

  // Qui estava a la pista en un moment donat (si tenim les dades)
  const whoWasOnPitch = (timeSec) => {
    if (!hasSubstitutions) return null;
    const subs = match.events.substitutions;
    let lastSub = subs[0];
    for (const sub of subs) {
      if (parseTime(sub.time) <= timeSec) lastSub = sub;
      else break;
    }
    return lastSub.onPitch;
  };

  // Color del resultat
  const [home, away] = match.result.split('-').map(s => parseInt(s.trim()));
  const resultColor = home > away ? 'text-emerald-400' : home < away ? 'text-[#C0392B]' : 'text-yellow-400';

  // Determina quin reproductor mostrar
  const hasYoutube = !!match.youtubeId;
  const hasVimeo   = !!match.vimeoId;
  const hasVideo   = hasYoutube || hasVimeo;

  // Ordena gols per minut
  const goalsSorted = [...match.events.goals].sort((a, b) => parseTime(a.time) - parseTime(b.time));

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Botó tornar */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#E5C07B] transition-colors text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" /> Tornar al Panel
      </button>

      {/* === CAPÇALERA === */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 md:p-8 border border-[#E5C07B]/20 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="text-[#E5C07B] text-sm font-semibold mb-2">
              {match.jornada} · {match.date}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              <span className="text-[#C0392B]">{DATABASE.teamName}</span>
              <span className="mx-3 text-gray-600 font-light">vs</span>
              <span>{match.opponent}</span>
            </h2>
          </div>
          <div className={`text-5xl md:text-6xl font-black font-mono bg-[#121212] px-6 py-3 rounded-xl border border-white/5 ${resultColor}`}>
            {match.result}
          </div>
        </div>
      </div>

      {/* === VÍDEO (YouTube o Vimeo) === */}
      {hasVideo && (
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl">
          <h3 className="text-lg font-bold text-[#E5C07B] mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            {hasVimeo ? 'Vídeo del Partit (Resum de Gols)' : 'Vídeo del Partit'}
          </h3>
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-white/10">
            {hasYoutube && (
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${match.youtubeId}?rel=0`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {hasVimeo && (
              <iframe
                width="100%" height="100%"
                src={`https://player.vimeo.com/video/${match.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      {/* === BARRES DE MINUTS + LOG DE GOLS === */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Minuts per jugador — només si tenim substitucions */}
        {hasSubstitutions && matchStats ? (
          <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#E5C07B] flex items-center gap-2">
                <Clock className="w-5 h-5" /> Minuts per Jugador
              </h3>
              <span className="text-xs bg-[#121212] px-3 py-1 rounded text-gray-400 border border-white/5">
                Ideal: {match.idealMinutesPerPlayer} min
              </span>
            </div>
            <div className="flex gap-4 mb-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#E5C07B] inline-block"/>Ideal</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#C0392B] inline-block"/>Excés</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#4A5568] inline-block"/>Poc temps</span>
            </div>
            <div className="space-y-3">
              {matchStats.playerStats.map(({ player, totalSec, deviation }) => {
                const width = (totalSec / matchStats.finalTime) * 100;
                const idealWidth = ((match.idealMinutesPerPlayer * 60) / matchStats.finalTime) * 100;
                return (
                  <div key={player} className="group flex items-center gap-3">
                    <span className="w-28 text-xs text-right truncate text-gray-400 group-hover:text-white transition-colors">
                      {player}
                    </span>
                    <div className="flex-1 h-6 bg-[#121212] rounded overflow-hidden border border-white/5 relative">
                      <div
                        className={`h-full ${barColor(deviation)} transition-all duration-700 rounded`}
                        style={{ width: `${Math.max(width, 1)}%` }}
                      />
                      <div className="absolute top-0 bottom-0 w-px bg-white/30" style={{ left: `${idealWidth}%` }} />
                    </div>
                    <div className="w-20 text-right">
                      <div className="text-xs font-mono text-white">{formatTime(totalSec)}</div>
                      <div className={`text-xs font-mono ${deviation > 0 ? 'text-[#C0392B]' : deviation < 0 ? 'text-gray-500' : 'text-[#E5C07B]'}`}>
                        {deviation >= 0 ? '+' : '-'}{formatTime(Math.abs(deviation))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Missatge quan no tenim dades de substitucions
          <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Sense dades de substitucions</p>
              <p className="text-xs mt-1 opacity-60">No es van registrar els canvis d'aquest partit</p>
            </div>
          </div>
        )}

        {/* === LOG DE GOLS === */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-[#E5C07B] mb-5 flex items-center gap-2">
            ⚽ Registre de Gols
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {goalsSorted.map((goal, idx) => {
              const onPitch = goal.onPitch || (hasSubstitutions ? whoWasOnPitch(parseTime(goal.time)) : null);
              const isFavor = goal.type === 'favor';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${
                    isFavor ? 'bg-emerald-500/10 border-emerald-500' : 'bg-[#C0392B]/10 border-[#C0392B]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono bg-[#121212] px-2 py-0.5 rounded text-xs border border-white/10">
                      {goal.time}
                    </span>
                    <span className={`font-bold text-xs ${isFavor ? 'text-emerald-400' : 'text-[#C0392B]'}`}>
                      {isFavor ? '⭐ GOL A FAVOR' : '❌ GOL EN CONTRA'}
                    </span>
                  </div>

                  {isFavor ? (
                    <div className="text-sm text-gray-300">
                      <span className="text-white font-semibold">{goal.scorer}</span>
                      {goal.assist && (
                        <span className="text-gray-400"> · Assist: <span className="text-white">{goal.assist}</span></span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">
                      {goal.notes || 'Sense observacions'}
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-white/5 text-xs text-gray-500 space-y-1">
                    {goal.goalkeeper && (
                      <div>Porter: <span className="text-gray-300">{goal.goalkeeper}</span></div>
                    )}
                    {onPitch && onPitch.length > 0 && (
                      <div>A la pista: <span className="text-gray-300">{onPitch.join(', ')}</span></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* === LÍNIA DE TEMPS — només si tenim substitucions === */}
      {hasSubstitutions && matchStats && (
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl overflow-x-auto">
          <h3 className="text-lg font-bold text-[#E5C07B] mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Línia de Temps
          </h3>
          <div className="min-w-[700px]">
            {/* Eix X */}
            <div className="flex ml-32 mb-2 relative h-5">
              {[0, 5, 10, 15, 20, 25, 30, 35].map(m => {
                const left = (m * 60 / matchStats.finalTime) * 100;
                if (left > 100) return null;
                return (
                  <div key={m} className="absolute text-xs text-gray-500 -translate-x-1/2" style={{ left: `${left}%` }}>
                    {m}'
                  </div>
                );
              })}
            </div>

            {/* Icones de gols */}
            <div className="relative h-8 ml-32 mb-1">
              {goalsSorted.map((goal, idx) => {
                const left = (parseTime(goal.time) / matchStats.finalTime) * 100;
                return (
                  <div key={idx} className="absolute top-0 -translate-x-1/2 flex flex-col items-center group cursor-default" style={{ left: `${left}%` }}>
                    {goal.type === 'favor'
                      ? <Star className="w-5 h-5 text-[#E5C07B] fill-[#E5C07B] drop-shadow-[0_0_4px_rgba(229,192,123,0.9)]" />
                      : <XCircle className="w-5 h-5 text-[#C0392B] drop-shadow-[0_0_4px_rgba(192,57,43,0.9)]" />
                    }
                    <div className="opacity-0 group-hover:opacity-100 absolute top-7 w-28 bg-[#0a0a0a] text-xs p-2 rounded z-50 border border-white/10 transition-opacity text-center pointer-events-none whitespace-nowrap">
                      {goal.time} — {goal.type === 'favor' ? '⭐ Favor' : '❌ Contra'}
                      {goal.scorer && <div className="text-[#E5C07B]">{goal.scorer}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Línies dels jugadors */}
            <div className="space-y-1.5 relative">
              {goalsSorted.map((goal, idx) => {
                const left = (parseTime(goal.time) / matchStats.finalTime) * 100;
                return (
                  <div key={`vline-${idx}`}
                    className={`absolute top-0 bottom-0 w-px z-0 pointer-events-none ${goal.type === 'favor' ? 'bg-[#E5C07B]/15' : 'bg-[#C0392B]/15'}`}
                    style={{ left: `calc(8rem + ${left}%)` }}
                  />
                );
              })}

              {DATABASE.roster.map(player => {
                const playerStints = matchStats.stints.filter(s => s.player === player);
                if (playerStints.length === 0) return null;
                const totalSecs = playerStints.reduce((acc, s) => acc + (s.end - s.start), 0);
                return (
                  <div key={player} className="flex items-center gap-3 h-7 relative z-10 hover:bg-white/5 rounded px-1">
                    <span className="w-28 text-xs text-right truncate text-gray-400">{player}</span>
                    <div className="flex-1 h-full relative">
                      {playerStints.map((stint, idx) => {
                        const left  = (stint.start / matchStats.finalTime) * 100;
                        const width = ((stint.end - stint.start) / matchStats.finalTime) * 100;
                        return (
                          <div key={idx}
                            className="absolute top-1 bottom-1 bg-[#C0392B] rounded-sm border border-[#E5C07B]/30 hover:bg-[#E5C07B] transition-colors cursor-default"
                            style={{ left: `${left}%`, width: `${Math.max(width, 0.5)}%` }}
                            title={`${player}: ${formatTime(stint.start)} → ${formatTime(stint.end)}`}
                          />
                        );
                      })}
                    </div>
                    <span className="w-10 text-xs font-mono text-gray-500 text-right">{formatTime(totalSecs)}</span>
                  </div>
                );
              })}
            </div>

            {/* Llegenda */}
            <div className="flex gap-4 mt-4 text-xs text-gray-500 ml-32">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#E5C07B] fill-[#E5C07B]" /> Gol a favor</span>
              <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-[#C0392B]" /> Gol en contra</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
