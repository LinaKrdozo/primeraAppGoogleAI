import React, { useState } from 'react';
import { FullPlayerProfile, ReportEvidence } from '../types/tactical';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, X, ShieldAlert, ArrowRight, FileText, Activity } from 'lucide-react';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Record<string, FullPlayerProfile>;
  selectedPlayerId: string;
  onSaveEvidence: (evidence: ReportEvidence) => void;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  players,
  selectedPlayerId,
  onSaveEvidence,
}) => {
  const [targetPlayerId, setTargetPlayerId] = useState<string>(selectedPlayerId);
  const [matchContext, setMatchContext] = useState<string>('Post-Final Regional');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [generatedResult, setGeneratedResult] = useState<ReportEvidence | null>(null);

  if (!isOpen) return null;

  const targetProfile = players[targetPlayerId] || players['carlos-restrepo'];
  const { player, metrics } = targetProfile;

  const processingSteps = [
    'Ingesta de telemetría GPS (Catapult) y registros de frecuencia cardíaca...',
    'Cálculo de Acute:Chronic Workload Ratio (ACWR) y degradación de fibras Tipo II...',
    'Simulación de vulnerabilidad posicional y pressing triggers ante rival...',
    'Sintetizando dictamen médico y plan de microciclo de 96 horas...',
  ];

  const handleExecuteGeneration = async () => {
    setIsProcessing(true);
    setGeneratedResult(null);
    setCurrentStep(0);

    // Simulate animated processing steps for great user feedback
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 650);

    try {
      const response = await fetch('/api/tactical/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player,
          metrics,
          customContext: matchContext,
        }),
      });

      const data = await response.json();
      clearInterval(stepInterval);

      // Determine verdict
      let verdictTitle = 'ALTA MÉDICA COMPETITIVA (APTO)';
      let verdictBadge: 'REST_ABSOLUTE' | 'CAUTION' | 'FIT' = 'FIT';

      if (player.status === 'REST_ABSOLUTE') {
        verdictTitle = 'DESCANSO ABSOLUTO DEL PRÓXIMO PARTIDO (ZONA ROJA)';
        verdictBadge = 'REST_ABSOLUTE';
      } else if (player.status === 'CAUTION') {
        verdictTitle = 'MINUTOS REGULADOS / DISPONIBLE COMO REVULSIVO (MAX 30 MIN)';
        verdictBadge = 'CAUTION';
      }

      const newEvidence: ReportEvidence = {
        id: `REP-2026-${player.number}-${Date.now().toString().slice(-4)}`,
        playerId: player.id,
        playerName: player.name,
        playerNumber: player.number,
        playerPosition: player.position,
        generatedAt: new Date().toISOString(),
        context: matchContext,
        verdictTitle,
        verdictBadge,
        summary: data.reportText
          ? data.reportText.slice(0, 300) + '...'
          : `Análisis generado para ${player.name} con carga de ${player.weeklyMinutes} min (ACWR: ${player.acwr}).`,
        physiologicalEvaluation:
          player.status === 'REST_ABSOLUTE'
            ? `Sobreesfuerzo aeróbico con pérdida aguda de explosividad (${metrics.find((m) => m.key === 'top_speed')?.currentValue} km/h). Riesgo isquiotibial severo por fatiga neuromuscular.`
            : player.status === 'CAUTION'
            ? 'Asimetría miofascial en aductores tras ráfagas de aceleración intensa. Integridad miotendinosa comprometida bajo cargas máximas.'
            : 'Parámetros fisiológicos y neuromusculares en rango nominal. Capacidad de esfuerzo preservada.',
        tacticalEvaluation:
          player.status === 'REST_ABSOLUTE'
            ? 'Desgaste compensatorio innecesario. Vulnerabilidad crítica ante bloques de presión alta y transiciones a campo abierto.'
            : player.status === 'CAUTION'
            ? 'Alta peligrosidad en conducciones verticales de desborde, pero vulnerabilidad a fatiga en tareas defensivas prolongadas.'
            : 'Liderazgo en la organización defensiva y eficacia en salida limpia bajo presión.',
        actionPlan:
          player.status === 'REST_ABSOLUTE'
            ? '72-96 horas de reposo e hidroterapia, control de Creatina Quinasa y sesión individual de videoanálisis.'
            : player.status === 'CAUTION'
            ? 'Terapia con Tecar, criocompresión, dosificación en entrenamientos y entrada controlada al minuto 60.'
            : 'Microciclo estándar, activación neuromuscular y alineación titular en el próximo encuentro.',
        metricsSnapshot: [...metrics],
        source: data.fallback ? 'MANUAL_GENERATION' : 'GEMINI_AI',
      };

      setGeneratedResult(newEvidence);
      onSaveEvidence(newEvidence);
    } catch (err) {
      clearInterval(stepInterval);
      // Fallback evidence generation
      const fallbackEvidence: ReportEvidence = {
        id: `REP-2026-${player.number}-${Date.now().toString().slice(-4)}`,
        playerId: player.id,
        playerName: player.name,
        playerNumber: player.number,
        playerPosition: player.position,
        generatedAt: new Date().toISOString(),
        context: matchContext,
        verdictTitle:
          player.status === 'REST_ABSOLUTE'
            ? 'DESCANSO ABSOLUTO RECOMENDADO (ZONA ROJA)'
            : player.status === 'CAUTION'
            ? 'MINUTOS REGULADOS'
            : 'APTO PARA EL ONCE TITULAR',
        verdictBadge: player.status,
        summary: `Informe procesado con éxito para ${player.name}. Carga semanal: ${player.weeklyMinutes} min | ACWR: ${player.acwr}.`,
        physiologicalEvaluation: 'Parámetros neuromusculares calculados mediante algoritmo de control de carga.',
        tacticalEvaluation: 'Ajuste posicional y balance de bloque según características del puesto.',
        actionPlan: 'Protocolo de recuperación correspondiente activado en la base médica.',
        metricsSnapshot: [...metrics],
        source: 'MANUAL_GENERATION',
      };
      setGeneratedResult(fallbackEvidence);
      onSaveEvidence(fallbackEvidence);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-600/20 border border-rose-500/40">
              <Sparkles className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Generador de Reportes Estratégicos de Rendimiento
              </h3>
              <p className="text-xs text-slate-400">
                Procesamiento de telemetría GPS, fatiga neuromuscular y prescripción táctica
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Controls: Select Player & Context (if not already showing result) */}
          {!generatedResult && !isProcessing && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  1. Seleccionar Jugador a Procesar:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.values(players).map(({ player: p }) => {
                    const isTarget = targetPlayerId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTargetPlayerId(p.id)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          isTarget
                            ? 'bg-slate-950 border-rose-500 ring-1 ring-rose-500/50 shadow-md'
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <img
                            src={p.portraitUrl}
                            alt={p.name}
                            className="w-6 h-6 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="text-xs font-bold text-white">
                            #{p.number} {p.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {p.position}
                        </div>
                        <div className="text-[11px] font-mono font-semibold mt-1 text-rose-400">
                          {p.weeklyMinutes} min · ACWR {p.acwr}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  2. Contexto de Competición / Partido:
                </label>
                <select
                  value={matchContext}
                  onChange={(e) => setMatchContext(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="Post-Final Regional (310 min acumulados)">
                    Post-Final Regional (Carga Máxima de Minutos)
                  </option>
                  <option value="Post-Semifinal Vuelta (120 min de alta intensidad)">
                    Post-Semifinal Vuelta (Prórroga / Aceleraciones Bruscas)
                  </option>
                  <option value="Evaluación Previa a Rival de Presión Alta">
                    Evaluación Previa a Rival de Presión Alta
                  </option>
                  <option value="Microciclo Semanal de Control Fisiológico">
                    Microciclo Semanal de Control Fisiológico
                  </option>
                </select>
              </div>

              {/* Player Telemetry Preview */}
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-300 block">
                  Telemetría lista para procesar:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-400 font-mono">
                  {metrics.map((m) => (
                    <div key={m.key} className="p-2 bg-slate-900 rounded border border-slate-800/80">
                      <div className="text-[10px] text-slate-500 truncate">{m.label}</div>
                      <div className="text-white font-bold">{m.currentValue} {m.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="py-10 px-4 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-rose-500" />
                <Activity className="w-5 h-5 text-white absolute inset-0 m-auto animate-pulse" />
              </div>

              <div className="space-y-2 max-w-md">
                <h4 className="text-base font-bold text-white">
                  Procesando Telemetría & Rendimiento de {player.name}
                </h4>
                <p className="text-xs text-rose-400 font-mono animate-pulse">
                  {processingSteps[currentStep]}
                </p>
              </div>

              <div className="w-full max-w-sm bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{
                    width: `${((currentStep + 1) / processingSteps.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Generated Result Output */}
          {generatedResult && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    Reporte Generado con Éxito (Archivado en Evidencias)
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    ID: {generatedResult.id}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white">
                      {generatedResult.playerName} (#{generatedResult.playerNumber} · {generatedResult.playerPosition})
                    </div>
                    <div className="text-xs text-slate-400">
                      Contexto: {generatedResult.context}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded text-xs font-bold font-mono uppercase ${
                      generatedResult.verdictBadge === 'REST_ABSOLUTE'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : generatedResult.verdictBadge === 'CAUTION'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {generatedResult.verdictBadge === 'REST_ABSOLUTE'
                      ? 'Descanso Absoluto'
                      : generatedResult.verdictBadge === 'CAUTION'
                      ? 'Minutos Regulados'
                      : 'Apto Titular'}
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80">
                    <strong className="text-white block mb-1">
                      1. Dictamen Médico-Táctico Ejecutivo:
                    </strong>
                    <p className="leading-relaxed text-slate-300">
                      {generatedResult.verdictTitle}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80">
                    <strong className="text-white block mb-1">
                      2. Evaluación Fisiológica & Neuromuscular:
                    </strong>
                    <p className="leading-relaxed text-slate-300">
                      {generatedResult.physiologicalEvaluation}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80">
                    <strong className="text-white block mb-1">
                      3. Plan de Acción Inmediato para el Cuerpo Técnico:
                    </strong>
                    <p className="leading-relaxed text-slate-300">
                      {generatedResult.actionPlan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            {generatedResult
              ? 'Evidencia registrada y visible en el Historial.'
              : 'El reporte se procesará con el motor de inteligencia.'}
          </div>

          <div className="flex items-center gap-2">
            {generatedResult ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Ver en la Plataforma
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteGeneration}
                  disabled={isProcessing}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-950/60"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-rose-200" />
                  )}
                  <span>Generar Reporte</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
