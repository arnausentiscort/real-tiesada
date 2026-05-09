import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, Clock } from 'lucide-react';
import { DATABASE } from '../data.js';

/**
 * COMPONENTE DE TIMELINE DE SUSTITUCIONS
 * ──────────────────────────────────────
 * Interfície visual mejorada para gestionar sustitucions amb:
 * - Timeline visual del partit
 * - Selector de porter per moment
 * - Selector de 4 jugadors de camp
 * - Gestor de descans/final fàcil
 */

export default function SubstitutionTimeline({ subs = [], onChange }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const roster = DATABASE.roster;
  const porters = roster.filter(p => p.position === 'Porter');
  const campions = roster.filter(p => p.position !== 'Porter');

  const addSub = () => {
    onChange([...subs, { time: '', goalkeeper: '', onPitch: [], _isBreak: false }]);
  };

  const removeSub = (idx) => {
    onChange(subs.filter((_, i) => i !== idx));
  };

  const updateSub = (idx, field, value) => {
    const newSubs = [...subs];
    newSubs[idx][field] = value;
    onChange(newSubs);
  };

  const togglePlayer = (idx, playerName) => {
    const current = subs[idx].onPitch || [];
    const isSelected = current.includes(playerName);
    let newPlayers;
    if (isSelected) {
      newPlayers = current.filter(n => n !== playerName);
    } else if (current.length < 4) {
      newPlayers = [...current, playerName];
    } else {
      return; // màxim 4
    }
    updateSub(idx, 'onPitch', newPlayers);
  };

  const setBreak = (idx) => {
    updateSub(idx, 'onPitch', []);
    updateSub(idx, '_isBreak', true);
  };

  const unsetBreak = (idx) => {
    updateSub(idx, '_isBreak', false);
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const [min, sec] = (timeStr || '').split(':').map(Number);
    return (min || 0) * 60 + (sec || 0);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#E5C07B]" />
          <p className="text-xs font-bold text-[#E5C07B]">⏱️ Timeline de Sustitucions ({subs.length})</p>
        </div>
        <button
          onClick={addSub}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-[#E5C07B] bg-[#E5C07B]/10 border border-[#E5C07B]/25 hover:bg-[#E5C07B]/20 transition-all"
        >
          <Plus className="w-3 h-3" /> Afegir canvi
        </button>
      </div>

      <p className="text-[10px] text-gray-600 px-2">Ordena cronològicament els canvis de jugadors. El porter i 4 de camp a cada moment.</p>

      {subs.length === 0 ? (
        <div className="bg-[#111] rounded-xl border border-white/10 p-4 text-center">
          <p className="text-xs text-gray-600">Cap substitució afegida. Clica "Afegir canvi" per comenzar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {subs.map((sub, idx) => {
            const isExpanded = expandedIdx === idx;
            const isBreak = sub._isBreak === true;
            const timeInSecs = parseTime(sub.time);
            const gkName = sub.goalkeeper ? roster.find(p => p.name === sub.goalkeeper)?.shirtName : '?';
            const campSelected = (sub.onPitch || []).length;

            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all ${
                  isBreak
                    ? 'bg-blue-500/5 border-blue-500/20'
                    : isExpanded
                    ? 'bg-[#1a1a1a] border-white/15'
                    : 'bg-[#0d0d0d] border-white/8 hover:border-white/15'
                }`}
              >
                {/* Header (resumat) */}
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/[0.03] transition-colors"
                >
                  {/* Temps */}
                  <div className="w-16 shrink-0">
                    <input
                      type="text"
                      value={sub.time || ''}
                      onChange={(e) => updateSub(idx, 'time', e.target.value)}
                      placeholder="MM:SS"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none"
                    />
                  </div>

                  {/* Status badge */}
                  {isBreak ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-blue-400 bg-blue-500/15 border border-blue-500/25">
                      ⏸ DESCANS/FINAL
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-[#E5C07B] bg-[#E5C07B]/10 border border-[#E5C07B]/25">
                      ⚽ CANVI
                    </span>
                  )}

                  {/* Porter + jugadors */}
                  <div className="flex-1 flex items-center gap-2 pl-2">
                    {gkName && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-bold">
                        🧤 {gkName}
                      </span>
                    )}
                    {campSelected > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E5C07B]/15 border border-[#E5C07B]/25 text-[#E5C07B] font-bold">
                        ⚽ {campSelected}/4
                      </span>
                    )}
                  </div>

                  {/* Botó expandir */}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Contingut expandit */}
                {isExpanded && (
                  <div className="border-t border-white/8 px-4 py-3 space-y-3">
                    {/* Toggle break/normal */}
                    <div className="flex gap-2">
                      {isBreak ? (
                        <button
                          onClick={() => unsetBreak(idx)}
                          className="flex-1 py-1.5 px-2 text-[10px] font-bold rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/30 transition-all"
                        >
                          ↩ Convertir a canvi normal
                        </button>
                      ) : (
                        <button
                          onClick={() => setBreak(idx)}
                          className="flex-1 py-1.5 px-2 text-[10px] font-bold rounded-lg bg-white/5 border border-white/10 text-gray-600 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                        >
                          ⏸ Marcar com descans/final
                        </button>
                      )}
                      <button
                        onClick={() => removeSub(idx)}
                        className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {!isBreak && (
                      <>
                        {/* Selector porter */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-emerald-400 block">🧤 Porter:</label>
                          <select
                            value={sub.goalkeeper || ''}
                            onChange={(e) => updateSub(idx, 'goalkeeper', e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-emerald-500/25 rounded-lg px-2 py-1.5 text-[10px] text-white focus:border-emerald-500/40 outline-none"
                          >
                            <option value="">— Selecciona porter —</option>
                            {porters.map((p) => (
                              <option key={p.name} value={p.name}>
                                {p.shirtName}
                              </option>
                            ))}
                            {/* Opció per jugadors de camp com a porter improvitzat */}
                            <optgroup label="Jugadors de camp com a porter">
                              {campions.map((p) => (
                                <option key={p.name} value={p.name}>
                                  {p.shirtName} ({p.position})
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>

                        {/* Selector jugadors de camp (4) */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#E5C07B] block">
                            ⚽ Jugadors de camp ({(sub.onPitch || []).length}/4):
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {campions.map((p) => {
                              const isSelected = (sub.onPitch || []).includes(p.name);
                              const isGK = p.name === sub.goalkeeper;
                              const isDisabled = isGK || ((sub.onPitch || []).length >= 4 && !isSelected);

                              return (
                                <button
                                  key={p.name}
                                  onClick={() => !isDisabled && togglePlayer(idx, p.name)}
                                  disabled={isDisabled}
                                  className={`py-1 px-2 rounded-lg text-[9px] font-bold border transition-all ${
                                    isGK
                                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 cursor-not-allowed opacity-50'
                                      : isSelected
                                      ? 'bg-[#E5C07B]/20 border-[#E5C07B]/40 text-[#E5C07B]'
                                      : isDisabled
                                      ? 'bg-white/5 border-white/8 text-gray-600 cursor-not-allowed opacity-40'
                                      : 'bg-white/5 border-white/10 text-gray-500 hover:border-[#E5C07B]/40 hover:text-[#E5C07B]'
                                  }`}
                                >
                                  {p.shirtName}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    {isBreak && (
                      <p className="text-[10px] text-blue-400/60 italic px-2 py-1 rounded bg-blue-500/5 border border-blue-500/15">
                        ⏸ Cap jugador de camp — el cronòmetre s'atura aquí.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Botó afegir al final */}
      {subs.length > 0 && (
        <button
          onClick={addSub}
          className="w-full py-2 px-3 rounded-xl text-[11px] font-bold text-[#E5C07B] bg-[#E5C07B]/10 border border-dashed border-[#E5C07B]/25 hover:bg-[#E5C07B]/15 transition-all"
        >
          + Afegir canvi
        </button>
      )}
    </div>
  );
}
