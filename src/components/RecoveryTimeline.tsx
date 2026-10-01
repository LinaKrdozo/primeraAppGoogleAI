import React, { useState } from 'react';
import { RecoveryDay, PlayerData } from '../types/tactical';
import { Clock, CheckCircle2, ShieldCheck, HeartPulse, Droplets, AlertTriangle } from 'lucide-react';

interface RecoveryTimelineProps {
  recovery: RecoveryDay[];
  player: PlayerData;
}

export const RecoveryTimeline: React.FC<RecoveryTimelineProps> = ({ recovery, player }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [facilityImageError, setFacilityImageError] = useState<boolean>(false);

  const currentProtocol = recovery[selectedDayIndex] || recovery[0];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            04 & 06.1 Protocolo Médico & Microciclo: {player.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {player.status === 'REST_ABSOLUTE'
              ? 'Superar 300 min semanales sitúa al jugador en zona roja de riesgo isquiotibial. Protocolo pasivo e hidroterapia obligatoria durante 72-96h.'
              : player.status === 'CAUTION'
              ? 'Manejo de sobrecarga en aductor mayor con terapia miofascial, Tecar y limitación de minutos competitivos.'
              : 'Microciclo estándar de regeneración y puesta a punto para el once titular.'}
          </p>
        </div>
        <div className={`text-xs font-mono px-3 py-1.5 rounded flex items-center gap-1.5 self-start sm:self-auto font-bold border ${
          player.status === 'REST_ABSOLUTE'
            ? 'text-rose-400 bg-rose-950/60 border-rose-900'
            : player.status === 'CAUTION'
            ? 'text-amber-400 bg-amber-950/60 border-amber-900'
            : 'text-emerald-400 bg-emerald-950/60 border-emerald-900'
        }`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            {player.status === 'REST_ABSOLUTE'
              ? 'BAJA MÉDICA COMPETITIVA'
              : player.status === 'CAUTION'
              ? 'PARTICIPACIÓN REGULADA'
              : 'ALTA MÉDICA CONFIRMADA'}
          </span>
        </div>
      </div>

      {/* 5-Day Microcycle Progress Bar (Interactive tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {recovery.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-900 border-rose-500 shadow-md ring-1 ring-rose-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-mono text-slate-400">DÍA 0{day.dayNumber}</span>
                {day.status === 'completed' && (
                  <span className="text-emerald-400 font-bold">✓ Hecho</span>
                )}
                {day.status === 'in_progress' && (
                  <span className="text-amber-400 font-bold animate-pulse">● En curso</span>
                )}
                {day.status === 'scheduled' && (
                  <span className="text-slate-500">Previsto</span>
                )}
              </div>
              <div className="text-xs font-bold text-white truncate">
                {day.hoursPostMatch}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                {day.focus}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Clinical Protocol Details */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-semibold uppercase">
              <Clock className="w-3.5 h-3.5" />
              <span>Ventana de Recuperación: {currentProtocol.hoursPostMatch}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {currentProtocol.phase}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              <strong>Objetivo Principal:</strong> {currentProtocol.focus}
            </p>
          </div>

          {/* Activities Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Protocolo de Actuación (Cuerpo Médico & Preparador Físico)
            </h4>
            <div className="space-y-2.5">
              {currentProtocol.activities.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Restricciones Clínicas Estrictas
            </h4>
            <div className="space-y-2">
              {currentProtocol.restrictions.map((rest, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{rest}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Biomarkers & Damage Monitoring */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-amber-400" />
              Biomarcadores & Monitoreo de Daño Muscular (CK / HRV / Squeeze Test)
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              {currentProtocol.biomarkers.map((bio, i) => (
                <li key={i} className="leading-relaxed">
                  {bio}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Sports Medicine Facility Showcase & Justification */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="relative aspect-[4/3] bg-slate-800">
              {!facilityImageError ? (
                <img
                  src="/src/assets/images/sports_recovery_facility_1790884657152.jpg"
                  alt="Centro de Hidroterapia y Ciencias del Deporte"
                  referrerPolicy="no-referrer"
                  onError={() => setFacilityImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-800 text-slate-400">
                  <Droplets className="w-8 h-8 text-rose-400 mb-2" />
                  <span className="text-xs font-medium">Unidad de Hidroterapia & Medicina Deportiva</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-medium">
                Unidad de Hidroterapia & Cold Plunge Club Metropolitano
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-300">
              <div className="font-semibold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Justificación Científica del Protocolo
              </div>
              <p className="leading-relaxed text-slate-400">
                {player.status === 'REST_ABSOLUTE'
                  ? 'La caída en la velocidad punta (28 km/h) es el principal biomarcador funcional de fatiga muscular periférica. Someterlo a sprints antes de las 96h multiplica el riesgo de desgarro isquiotibial.'
                  : player.status === 'CAUTION'
                  ? 'La asimetría del 18% en squeeze test exige descarga miofascial para evitar pubalgia o rotura parcial del aductor mayor.'
                  : 'Valores nominales de CK (<300 U/L) permiten autorizar el entrenamiento con carga completa y participación en el XI inicial.'}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <strong>Supervisión Médica:</strong> Dr. J. R. Montoya · Jefe de Fisiología & Medicina del Rendimiento.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
