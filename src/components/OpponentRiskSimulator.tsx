import React, { useState } from 'react';
import { OpponentProfile, PlayerData } from '../types/tactical';
import { AlertOctagon, Flame, FastForward, Sparkles, Loader2 } from 'lucide-react';

interface OpponentRiskSimulatorProps {
  opponents: OpponentProfile[];
  player: PlayerData;
}

export const OpponentRiskSimulator: React.FC<OpponentRiskSimulatorProps> = ({ opponents, player }) => {
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>(opponents[0]?.id || 'high-press');
  const [aiSimulation, setAiSimulation] = useState<string | null>(null);
  const [loadingSimulation, setLoadingSimulation] = useState<boolean>(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  // Sync if opponents change
  React.useEffect(() => {
    if (opponents[0]) setSelectedOpponentId(opponents[0].id);
    setAiSimulation(null);
  }, [opponents]);

  const currentOpponent =
    opponents.find((p) => p.id === selectedOpponentId) ||
    opponents[0] || {
      id: 'default',
      name: 'Rival General',
      style: 'Bloque equilibrado',
      tacticalDescription: 'Evaluación de carga',
      restrepoVulnerability: 'Monitoreo estándar',
      riskLevel: 'MEDIUM' as const,
      pressingTriggerRisk: 40,
      transitionVulnerability: 40,
      coachingDirective: 'Dosificar esfuerzos.',
    };

  const handleSimulateWithAI = async () => {
    setLoadingSimulation(true);
    setSimulationError(null);
    try {
      const res = await fetch('/api/tactical/simulate-matchup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opponentProfile: `${currentOpponent.name} (${currentOpponent.style}) contra ${player.name} (${player.position})`,
        }),
      });
      const data = await res.json();
      if (data.simulation) {
        setAiSimulation(data.simulation);
      } else if (data.error) {
        setSimulationError(data.error);
      }
    } catch (err: any) {
      setSimulationError('No se pudo conectar con el motor de simulación táctica.');
    } finally {
      setLoadingSimulation(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            03. Análisis de Oponentes: Matriz de Emparejamiento ({player.name})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Simulación de vulnerabilidades tácticas según el esquema y estilo del rival si el jugador es alineado.
          </p>
        </div>
      </div>

      {/* Opponent Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {opponents.map((opponent) => {
          const isSelected = selectedOpponentId === opponent.id;
          return (
            <button
              key={opponent.id}
              onClick={() => {
                setSelectedOpponentId(opponent.id);
                setAiSimulation(null);
              }}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-900 border-rose-500 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                  Escenario
                </span>
                <span className="text-xs font-bold font-mono text-rose-400">
                  {opponent.riskLevel}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug">
                {opponent.name}
              </h4>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                {opponent.style}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Riesgo Pressing Trigger:</span>
                <span className="font-mono font-bold text-rose-400 tabular-nums">
                  {opponent.pressingTriggerRisk}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep Matchup Evaluation Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono text-rose-400 font-semibold uppercase">
              Evaluación Técnica de Emparejamiento: {player.name}
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {currentOpponent.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {currentOpponent.tacticalDescription}
            </p>
          </div>

          <button
            onClick={handleSimulateWithAI}
            disabled={loadingSimulation}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-60"
          >
            {loadingSimulation ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-rose-400" />
            )}
            <span>Simular con Gemini AI</span>
          </button>
        </div>

        {/* 2 Risk Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                Vulnerabilidad como "Pressing Trigger"
              </span>
              <span className="font-mono font-bold text-rose-400 text-sm tabular-nums">
                {currentOpponent.pressingTriggerRisk}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${currentOpponent.pressingTriggerRisk}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Riesgo de activación de trampas de presión del rival ante pérdidas.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <FastForward className="w-4 h-4 text-amber-500" />
                Déficit en Retroceso ante Contragolpe
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm tabular-nums">
                {currentOpponent.transitionVulnerability}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${currentOpponent.transitionVulnerability}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Capacidad de repliegue y cobertura de espacios a campo abierto.
            </p>
          </div>
        </div>

        {/* Detailed Vulnerability Analysis */}
        <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-900/50 space-y-2 text-xs sm:text-sm text-slate-300">
          <div className="font-semibold text-rose-300 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            Impacto Directo si {player.name} es Alineado:
          </div>
          <p className="leading-relaxed text-slate-300">
            {currentOpponent.restrepoVulnerability}
          </p>
          <div className="pt-2 text-xs text-rose-200/90 font-medium">
            <strong>Consigna Directa del Cuerpo Técnico:</strong>{' '}
            {currentOpponent.coachingDirective}
          </div>
        </div>

        {/* AI Simulation Result */}
        {aiSimulation && (
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-700 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                Informe Generado por Gemini AI ({player.name}):
              </span>
              <span className="font-mono text-[11px] text-rose-400">gemini-3.8-flash</span>
            </div>
            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {aiSimulation}
            </div>
          </div>
        )}

        {simulationError && (
          <div className="p-3 rounded bg-amber-950/40 border border-amber-800 text-xs text-amber-200">
            {simulationError}
          </div>
        )}
      </div>
    </div>
  );
};
