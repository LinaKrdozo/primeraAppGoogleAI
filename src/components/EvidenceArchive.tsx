import React, { useState } from 'react';
import { ReportEvidence } from '../types/tactical';
import { Archive, FileText, CheckCircle2, Clock, Calendar, ArrowRight, ShieldAlert, Award, ExternalLink, Printer } from 'lucide-react';

interface EvidenceArchiveProps {
  evidences: ReportEvidence[];
  onLoadPlayer: (playerId: string) => void;
  onPrintEvidence: (evidence: ReportEvidence) => void;
}

export const EvidenceArchive: React.FC<EvidenceArchiveProps> = ({
  evidences,
  onLoadPlayer,
  onPrintEvidence,
}) => {
  const [filterPlayer, setFilterPlayer] = useState<string>('all');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  const filteredEvidences = evidences.filter((e) => {
    if (filterPlayer === 'all') return true;
    return e.playerId === filterPlayer;
  });

  const activeDetail = evidences.find((e) => e.id === selectedEvidenceId) || filteredEvidences[0];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Archive className="w-5 h-5 text-rose-400" />
            <span>Archivo Oficial de Evidencias & Comparativa de Resultados</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Registro histórico de evaluaciones y reportes generados. Conserva la evidencia biométrica y táctica de los jugadores del plantel.
          </p>
        </div>

        {/* Filter by player */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setFilterPlayer('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterPlayer === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({evidences.length})
          </button>
          <button
            onClick={() => setFilterPlayer('carlos-restrepo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterPlayer === 'carlos-restrepo'
                ? 'bg-rose-950 text-rose-200 border border-rose-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            C. Restrepo (#8)
          </button>
          <button
            onClick={() => setFilterPlayer('mateo-benitez')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterPlayer === 'mateo-benitez'
                ? 'bg-amber-950 text-amber-200 border border-amber-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            M. Benítez (#11)
          </button>
          <button
            onClick={() => setFilterPlayer('santiago-valdes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterPlayer === 'santiago-valdes'
                ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            S. Valdés (#4)
          </button>
        </div>
      </div>

      {/* Evidences Grid & Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: List of Evidence Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider px-1">
            Evidencias Registradas ({filteredEvidences.length})
          </div>

          {filteredEvidences.map((evidence) => {
            const isSelected = (activeDetail && activeDetail.id === evidence.id) || selectedEvidenceId === evidence.id;
            return (
              <div
                key={evidence.id}
                onClick={() => setSelectedEvidenceId(evidence.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      #{evidence.playerNumber} {evidence.playerName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({evidence.playerPosition})
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      evidence.verdictBadge === 'REST_ABSOLUTE'
                        ? 'bg-rose-950 text-rose-300 border border-rose-900'
                        : evidence.verdictBadge === 'CAUTION'
                        ? 'bg-amber-950 text-amber-300 border border-amber-900'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-900'
                    }`}
                  >
                    {evidence.verdictBadge === 'REST_ABSOLUTE'
                      ? 'Descanso'
                      : evidence.verdictBadge === 'CAUTION'
                      ? 'Regulado'
                      : 'Apto'}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium line-clamp-2">
                  {evidence.verdictTitle}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(evidence.generatedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span>ID: {evidence.id}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Full Evidence Record View */}
        {activeDetail && (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="text-[11px] font-mono text-rose-400 uppercase font-semibold">
                  Acta de Evidencia Médica & Táctica // {activeDetail.id}
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeDetail.playerName} (#{activeDetail.playerNumber} · {activeDetail.playerPosition})
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Contexto: {activeDetail.context}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLoadPlayer(activeDetail.playerId)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Cargar Jugador</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Verdict Box */}
            <div
              className={`p-4 rounded-lg border space-y-1.5 ${
                activeDetail.verdictBadge === 'REST_ABSOLUTE'
                  ? 'bg-rose-950/40 border-rose-900 text-rose-200'
                  : activeDetail.verdictBadge === 'CAUTION'
                  ? 'bg-amber-950/40 border-amber-900 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-900 text-emerald-200'
              }`}
            >
              <div className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Dictamen Oficial del Cuerpo Médico:
              </div>
              <div className="text-sm font-bold">
                {activeDetail.verdictTitle}
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                <strong className="text-white block font-semibold">
                  Evaluación Fisiológica & Neuromuscular:
                </strong>
                <p className="leading-relaxed text-slate-300">
                  {activeDetail.physiologicalEvaluation}
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                <strong className="text-white block font-semibold">
                  Implicaciones Tácticas en el Modelo de Juego:
                </strong>
                <p className="leading-relaxed text-slate-300">
                  {activeDetail.tacticalEvaluation}
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                <strong className="text-white block font-semibold">
                  Plan de Acción Inmediato (Cuerpo Técnico):
                </strong>
                <p className="leading-relaxed text-slate-300">
                  {activeDetail.actionPlan}
                </p>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Evidencia Verificada en Servidor
              </span>
              <span>
                Registro: {new Date(activeDetail.generatedAt).toLocaleString('es-ES')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Roster Evidence Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-rose-400" />
          <span>Matriz Comparativa de Evidencias del Plantel</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-2">Jugador</th>
                <th className="pb-2">Puesto</th>
                <th className="pb-2">Carga 7 Días</th>
                <th className="pb-2">Ratio ACWR</th>
                <th className="pb-2">Riesgo Lesional</th>
                <th className="pb-2">Dictamen de Competitividad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-2.5 font-bold text-white">Carlos Restrepo</td>
                <td className="py-2.5 text-slate-400">Pivote / #8</td>
                <td className="py-2.5 text-rose-400 font-bold">310 min</td>
                <td className="py-2.5 text-rose-400 font-bold">1.74 (Peligro)</td>
                <td className="py-2.5 text-rose-500 font-bold">CRÍTICO (Isquios)</td>
                <td className="py-2.5 text-rose-400 font-bold">DESCANSO ABSOLUTO</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Mateo Benítez</td>
                <td className="py-2.5 text-slate-400">Extremo / #11</td>
                <td className="py-2.5 text-amber-400 font-bold">245 min</td>
                <td className="py-2.5 text-amber-400 font-bold">1.48 (Alerta)</td>
                <td className="py-2.5 text-amber-400 font-bold">ALTO (Aductores)</td>
                <td className="py-2.5 text-amber-400 font-bold">REGULADO (Revulsivo)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Santiago Valdés</td>
                <td className="py-2.5 text-slate-400">Central / #4</td>
                <td className="py-2.5 text-emerald-400 font-bold">270 min</td>
                <td className="py-2.5 text-emerald-400 font-bold">1.28 (Óptimo)</td>
                <td className="py-2.5 text-emerald-400 font-bold">BAJO</td>
                <td className="py-2.5 text-emerald-400 font-bold">APTO TITULAR</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
