import React, { useState } from 'react';
import { PlayerData } from '../types/tactical';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck, HeartHandshake } from 'lucide-react';

interface PlayerBannerProps {
  player: PlayerData;
  auditNote?: {
    originalRawValue: string;
    correctedValue: string;
    metricName: string;
    baselineValue: string;
    explanation: string;
  };
}

export const PlayerBanner: React.FC<PlayerBannerProps> = ({ player, auditNote }) => {
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getVerdictText = () => {
    switch (player.status) {
      case 'REST_ABSOLUTE':
        return {
          bg: 'bg-rose-950/80 border-rose-800/80 text-rose-200',
          title: 'DESCANSO ABSOLUTO DEL PRÓXIMO PARTIDO COMPETITIVO',
          subtitle: `Zona Roja · ${player.weeklyMinutes} min acumulados · Riesgo isquiotibial crítico`,
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-950/80 border-amber-800/80 text-amber-200',
          title: 'MINUTOS REGULADOS / DISPONIBILIDAD COMO REVULSIVO',
          subtitle: `Zona Ámbar · ${player.weeklyMinutes} min · Cuidado con sobrecarga de aductores (max 30 min)`,
        };
      case 'FIT':
      default:
        return {
          bg: 'bg-emerald-950/80 border-emerald-800/80 text-emerald-200',
          title: 'APTO PARA EL ONCE TITULAR (100% DISPONIBLE)',
          subtitle: `Zona Verde · ${player.weeklyMinutes} min · Parámetros de carga y velocidad óptimos`,
        };
    }
  };

  const verdict = getVerdictText();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Warning Banner: Absolute Rest or Regulated directive */}
      <div className={`${verdict.bg} border-b px-4 py-3 flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center gap-2.5">
          {player.status === 'REST_ABSOLUTE' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : player.status === 'CAUTION' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <div className="text-xs sm:text-sm font-semibold tracking-wide">
            <span className="uppercase font-bold">Dictamen del Cuerpo Médico:</span>{' '}
            {verdict.title} <span className="font-normal text-xs opacity-90 hidden sm:inline">({verdict.subtitle})</span>
          </div>
        </div>

        {auditNote && (
          <button
            onClick={() => setShowAuditModal(!showAuditModal)}
            className="text-xs underline underline-offset-2 transition-colors cursor-pointer hover:text-white flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Auditoría de Calidad (Pases 62%)</span>
          </button>
        )}
      </div>

      {/* Audit Modal / Accordion */}
      {showAuditModal && auditNote && (
        <div className="bg-slate-950 border-b border-slate-800 p-4 text-xs text-slate-300 transition-all">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <div className="font-semibold text-amber-300 mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Auditoría de Telemetría: Normalización de Anomalía Tipográfica
              </div>
              <p className="text-slate-400 leading-relaxed">
                {auditNote.explanation}
              </p>
              <div className="mt-2 text-slate-500 font-mono text-[11px] flex gap-3">
                <span>Valor crudo en acta: <strong className="text-rose-400">{auditNote.originalRawValue}</strong></span>
                <span>·</span>
                <span>Valor normalizado: <strong className="text-emerald-400">{auditNote.correctedValue}</strong></span>
                <span>·</span>
                <span>Promedio habitual: <strong className="text-slate-300">{auditNote.baselineValue}</strong></span>
              </div>
            </div>
            <button
              onClick={() => setShowAuditModal(false)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors shrink-0 cursor-pointer"
            >
              Cerrar nota
            </button>
          </div>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Athlete Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-slate-700/80 bg-slate-800 shrink-0 shadow-lg">
            {!imageError ? (
              <img
                src={player.portraitUrl}
                alt={player.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 font-bold text-xl">
                #{player.number}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-slate-950/90 text-white font-mono text-xs px-1.5 py-0.5 rounded-tl font-bold border-t border-l border-slate-700">
              #{player.number}
            </div>
          </div>

          {/* Player details (Zero-Pill clean typography) */}
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-mono font-medium">
              <span>{player.club}</span>
              <span aria-hidden="true">·</span>
              <span>Dossier Médico-Táctico</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              {player.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-2 font-medium">
              <span className="text-slate-200 font-semibold">{player.position}</span>
              <span aria-hidden="true">·</span>
              <span>{player.age} años</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300/90">Contexto: {player.context}</span>
              <span aria-hidden="true">·</span>
              <span>{player.analysisDate}</span>
            </div>
          </div>
        </div>

        {/* Quick Biological State Indicators */}
        <div className="w-full md:w-auto flex flex-wrap sm:flex-nowrap gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 min-w-[130px] flex-1 sm:flex-initial">
            <div className="text-[11px] font-medium text-slate-400">Carga 7 Días</div>
            <div className={`text-xl font-bold font-mono mt-0.5 tabular-nums ${
              player.status === 'REST_ABSOLUTE' ? 'text-rose-400' : player.status === 'CAUTION' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {player.weeklyMinutes} <span className="text-xs font-normal text-slate-400">min</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                player.status === 'REST_ABSOLUTE' ? 'bg-rose-500' : player.status === 'CAUTION' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              {player.status === 'REST_ABSOLUTE' ? '~3.5 partidos' : player.status === 'CAUTION' ? '~2.7 partidos' : '~2 partidos'}
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 min-w-[130px] flex-1 sm:flex-initial">
            <div className="text-[11px] font-medium text-slate-400">Ratio ACWR</div>
            <div className={`text-xl font-bold font-mono mt-0.5 tabular-nums ${
              player.acwr >= 1.5 ? 'text-rose-400' : player.acwr >= 1.3 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {player.acwr}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                player.acwr >= 1.5 ? 'bg-rose-500' : player.acwr >= 1.3 ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              {player.acwr >= 1.5 ? 'Peligro (>1.50)' : player.acwr >= 1.3 ? 'Zona Alerta' : 'Zona Óptima'}
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 min-w-[130px] flex-1 sm:flex-initial">
            <div className="text-[11px] font-medium text-slate-400">Riesgo Lesional</div>
            <div className={`text-xl font-bold font-mono mt-0.5 ${
              player.injuryRisk === 'CRITICAL' ? 'text-rose-500' : player.injuryRisk === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {player.injuryRisk === 'CRITICAL' ? 'SEVERO' : player.injuryRisk === 'HIGH' ? 'ALTO' : 'BAJO'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {player.status === 'REST_ABSOLUTE' ? 'Isquiotibiales' : player.status === 'CAUTION' ? 'Aductores' : 'Bajo control'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
