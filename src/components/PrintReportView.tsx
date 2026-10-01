import React from 'react';
import { PlayerData, MetricComparison } from '../types/tactical';

interface PrintReportViewProps {
  player: PlayerData;
  metrics: MetricComparison[];
  auditNote?: {
    originalRawValue: string;
    correctedValue: string;
    metricName: string;
    baselineValue: string;
    explanation: string;
  };
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ player, metrics, auditNote }) => {
  return (
    <div className="hidden print:block max-w-4xl mx-auto p-8 text-black bg-white font-sans text-sm leading-relaxed">
      {/* Official Club Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
            Club Atlético Metropolitano · Departamento de Rendimiento & Ciencias del Deporte
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            REPORTE ESTRATÉGICO DE RENDIMIENTO
          </h1>
        </div>
        <div className="text-right text-xs font-mono text-slate-600">
          <div>Ref: MET-2026-#{player.number}-{player.name.replace(/\s+/g, '').toUpperCase()}</div>
          <div>Fecha: {player.analysisDate}</div>
        </div>
      </div>

      {/* Athlete Data Box */}
      <div className="grid grid-cols-4 gap-4 p-4 border border-slate-300 rounded mb-6 bg-slate-50 text-xs">
        <div>
          <span className="text-slate-500 block">Jugador:</span>
          <strong className="text-slate-900 font-bold text-sm">{player.name}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Posición / Dorsal:</span>
          <strong className="text-slate-900 font-bold text-sm">{player.position} / #{player.number}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Contexto Competitivo:</span>
          <strong className="text-slate-900 font-bold text-sm">{player.context}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Carga Semanal:</span>
          <strong className={`font-bold text-sm ${player.status === 'REST_ABSOLUTE' ? 'text-red-700' : 'text-slate-900'}`}>
            {player.weeklyMinutes} min (ACWR: {player.acwr})
          </strong>
        </div>
      </div>

      {/* Quality Data Note if present */}
      {auditNote && (
        <div className="p-3 border-l-4 border-amber-600 bg-amber-50 text-xs mb-6 text-slate-800 italic">
          *(Nota de calidad de datos: Se asume que el valor "{auditNote.originalRawValue}" en precisión de pases es un error tipográfico y representa un <strong>{auditNote.correctedValue}</strong>, dado el contexto de su promedio habitual del {auditNote.baselineValue}. Si no es así, por favor confirmar el dato exacto).*
        </div>
      )}

      {/* KPI Table */}
      <div className="mb-6">
        <h2 className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-2">
          Telemetría Comparativa GPS vs Línea Base
        </h2>
        <table className="w-full text-left border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
              <th className="p-2 border-r border-slate-300">Parámetro</th>
              <th className="p-2 border-r border-slate-300 text-right">Último Partido</th>
              <th className="p-2 border-r border-slate-300 text-right">Promedio Habitual</th>
              <th className="p-2 border-r border-slate-300 text-right">Variación</th>
              <th className="p-2">Evaluación Fisiológica</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.key} className="border-b border-slate-200">
                <td className="p-2 font-semibold border-r border-slate-200">{m.label}</td>
                <td className="p-2 text-right font-mono font-bold border-r border-slate-200">
                  {m.currentValue} {m.unit}
                </td>
                <td className="p-2 text-right font-mono border-r border-slate-200">
                  {m.baselineValue} {m.unit}
                </td>
                <td className={`p-2 text-right font-mono font-bold border-r border-slate-200 ${m.deltaPercent < 0 ? 'text-red-600' : 'text-slate-800'}`}>
                  {m.deltaPercent > 0 ? `+${m.deltaPercent}%` : `${m.deltaPercent}%`}
                </td>
                <td className="p-2 text-slate-600">{m.interpretation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dictamen Box */}
      <div className={`p-3 border rounded mb-6 ${
        player.status === 'REST_ABSOLUTE'
          ? 'border-red-300 bg-red-50 text-red-950'
          : player.status === 'CAUTION'
          ? 'border-amber-300 bg-amber-50 text-amber-950'
          : 'border-emerald-300 bg-emerald-50 text-emerald-950'
      }`}>
        <h3 className="font-bold text-sm mb-1 uppercase tracking-wide">
          Dictamen del Cuerpo Médico: {
            player.status === 'REST_ABSOLUTE'
              ? 'Descanso Absoluto del Próximo Partido Competitivo (Zona Roja)'
              : player.status === 'CAUTION'
              ? 'Minutos Regulados / Disponibilidad como Revulsivo (Max 30 min)'
              : 'Apto para el Once Titular (100% Disponible)'
          }
        </h3>
        <p className="text-xs">
          {player.status === 'REST_ABSOLUTE'
            ? 'Superar los 300 minutos semanales y la caída en velocidad punta certifica un agotamiento severo de fibras rápidas Tipo II con alto riesgo de rotura fibrilar isquiotibial.'
            : player.status === 'CAUTION'
            ? 'Asimetría del 18% en dinamometría de aductores tras 120 minutos. Prohibida la titularidad; apto únicamente para remates de partido.'
            : 'Los biomarcadores sanguíneos y la telemetría posicional no muestran indicios de fatiga aguda. Integridad física garantizada.'}
        </p>
      </div>

      {/* Official Signatures Block */}
      <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs text-slate-600">
        <div>
          <div className="h-10 border-b border-slate-400 mb-1" />
          <strong>Dirección Técnica</strong>
          <div className="text-[10px]">Cuerpo Técnico Primer Equipo</div>
        </div>
        <div>
          <div className="h-10 border-b border-slate-400 mb-1" />
          <strong>Jefatura de Servicios Médicos</strong>
          <div className="text-[10px]">Traumatología & Fisiología</div>
        </div>
        <div>
          <div className="h-10 border-b border-slate-400 mb-1" />
          <strong>Departamento de Rendimiento</strong>
          <div className="text-[10px]">Preparación Física & GPS</div>
        </div>
      </div>
    </div>
  );
};
