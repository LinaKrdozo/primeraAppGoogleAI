import React from 'react';
import { FullPlayerProfile } from '../types/tactical';
import { Sparkles } from 'lucide-react';

interface PlayerSelectorProps {
  players: Record<string, FullPlayerProfile>;
  selectedPlayerId: string;
  onSelectPlayer: (id: string) => void;
  onGenerateReport: () => void;
  evidenceCount: number;
}

export const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  players,
  selectedPlayerId,
  onSelectPlayer,
  onGenerateReport,
  evidenceCount,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Player Roster Pills / Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold shrink-0">
          Plantel Analizado:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {Object.values(players).map((item) => {
            const { player } = item;
            const isSelected = selectedPlayerId === player.id;
            return (
              <button
                key={player.id}
                onClick={() => onSelectPlayer(player.id)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 border-rose-500 text-white shadow-md ring-1 ring-rose-500/50'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                  <img
                    src={player.portraitUrl}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span>#{player.number} {player.name}</span>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    player.status === 'REST_ABSOLUTE'
                      ? 'bg-rose-500 animate-pulse'
                      : player.status === 'CAUTION'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  title={
                    player.status === 'REST_ABSOLUTE'
                      ? 'Zona Roja - Descanso Absoluto'
                      : player.status === 'CAUTION'
                      ? 'Zona Ámbar - Minutos Regulados'
                      : 'Zona Verde - Apto Titular'
                  }
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button: "Generar Reporte" */}
      <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span>Evidencias archivadas:</span>
          <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-bold">
            {evidenceCount}
          </strong>
        </div>

        <button
          onClick={onGenerateReport}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-rose-950/50 hover:shadow-rose-900/50 transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-rose-200" />
          <span>Generar Reporte</span>
        </button>
      </div>
    </div>
  );
};
