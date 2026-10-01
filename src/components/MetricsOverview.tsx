import React, { useState } from 'react';
import { MetricComparison, PlayerData } from '../types/tactical';
import { Activity, Zap, Brain, Scale, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: MetricComparison[];
  player: PlayerData;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, player }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>(metrics[0]?.key || 'distance');

  const getMetricIcon = (key: string) => {
    switch (key) {
      case 'distance':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'top_speed':
        return <Zap className="w-4 h-4 text-rose-400" />;
      case 'pass_accuracy':
      case 'dribbles':
      case 'aerial_duels':
        return <Brain className="w-4 h-4 text-amber-400" />;
      case 'weekly_load':
        return <Scale className="w-4 h-4 text-rose-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            01. Evaluación de Rendimiento Individual & Telemetría GPS: {player.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {player.status === 'REST_ABSOLUTE'
              ? 'Cuadro agudo de fatiga neuromuscular y cognitiva provocado por sobrecarga extrema (310 min acumulados).'
              : player.status === 'CAUTION'
              ? 'Sobrecarga de cadenas cinéticas con asimetría en aductores tras 120 minutos de alta exigencia.'
              : 'Niveles óptimos de distribución de carga y solidez en duelos individuales.'}
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 self-start sm:self-auto bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
          <span>Fuente: Catapult GPS + Wyscout Eventing</span>
        </div>
      </div>

      {/* 4 Core KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const isSelected = selectedMetric === metric.key;
          const isNegative = metric.deltaPercent < 0;
          const isOverload = metric.status === 'excessive_load';

          return (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`p-4 rounded-xl text-left transition-all border cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-900 border-rose-500/80 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700/60">
                    {getMetricIcon(metric.key)}
                  </div>
                  <span className="text-xs font-medium text-slate-300 truncate max-w-[130px]">
                    {metric.label}
                  </span>
                </div>
                <div
                  className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${
                    isOverload
                      ? 'text-rose-400'
                      : isNegative
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {metric.deltaPercent > 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>{Math.abs(metric.deltaPercent).toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                  {metric.currentValue}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {metric.unit}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Promedio habitual:</span>
                <span className="font-mono text-slate-300 font-semibold tabular-nums">
                  {metric.baselineValue} {metric.unit}
                </span>
              </div>

              {/* Mini comparative bar */}
              <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    metric.status === 'excessive_load'
                      ? 'bg-rose-500'
                      : metric.status === 'critical_drop'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (metric.currentValue / (metric.baselineValue * 1.3)) * 100
                    )}%`,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Volumen vs. Intensidad */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400 font-semibold text-sm">
            <Zap className="w-4 h-4" />
            <span>Volumen vs. Intensidad: Agotamiento Fisiológico</span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {player.name} registró{' '}
            <strong className="text-white font-mono">
              {metrics.find((m) => m.key === 'distance')?.currentValue} km
            </strong>{' '}
            con una velocidad punta de{' '}
            <strong className="text-white font-mono">
              {metrics.find((m) => m.key === 'top_speed')?.currentValue} km/h
            </strong>
            .
          </p>

          <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between items-center text-slate-400">
              <span>Velocidad Punta en Último Partido:</span>
              <span className="font-mono font-bold text-rose-400 tabular-nums">
                {metrics.find((m) => m.key === 'top_speed')?.currentValue} km/h
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Velocidad Punta Histórica (Fresco):</span>
              <span className="font-mono font-bold text-slate-200 tabular-nums">
                {metrics.find((m) => m.key === 'top_speed')?.baselineValue} km/h
              </span>
            </div>
            <p className="text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
              {metrics.find((m) => m.key === 'top_speed')?.interpretation}
            </p>
          </div>
        </div>

        {/* Card 2: Impacto Técnico-Táctico */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
            <Brain className="w-4 h-4" />
            <span>Impacto Técnico & Eficacia en el Modelo</span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {metrics[2]?.interpretation || 'Parámetros técnicos ajustados a la posición de juego.'}
          </p>

          <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between items-center text-slate-400">
              <span>{metrics[2]?.label || 'Acción Técnica'}:</span>
              <span className="font-mono font-bold text-slate-200 tabular-nums">
                {metrics[2]?.currentValue} {metrics[2]?.unit} (Histórico: {metrics[2]?.baselineValue} {metrics[2]?.unit})
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Carga Semanal Acumulada:</span>
              <span className="font-mono font-bold text-rose-400 tabular-nums">
                {player.weeklyMinutes} min (ACWR {player.acwr})
              </span>
            </div>
            <p className="text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
              {metrics.find((m) => m.key === 'weekly_load')?.interpretation}
            </p>
          </div>
        </div>
      </div>

      {/* Comparative Section: Desgaste Compensatorio con el Equipo */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Compass className="w-4 h-4 text-sky-400" />
          <span>02. Análisis Comparativo con el Estándar del Equipo</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 leading-relaxed mt-3">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <strong className="text-white block mb-1">Impacto en el Bloque Colectivo:</strong>
            {player.status === 'REST_ABSOLUTE'
              ? 'Un recorrido de 13.2 km está significativamente por encima de la media de los mediocentros. Denota compensación excesiva persiguiendo el balón.'
              : player.status === 'CAUTION'
              ? 'Acumulación de sprints en banda izquierda con 42 aceleraciones máximas. Requiere relevo en el minuto 60 para no descompensar el retroceso del lateral.'
              : 'Posicionamiento disciplinado sin sobrecarreras. Contribuye a la solidez de la línea de 4 y disminuye el estrés del portero.'}
          </div>
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <strong className="text-white block mb-1">Afectación al Modelo de Posesión:</strong>
            {player.status === 'REST_ABSOLUTE'
              ? 'Con un 62% de precisión de Restrepo, el equipo perdió el control de los tiempos del partido y concedió iniciativa territorial en la segunda mitad.'
              : player.status === 'CAUTION'
              ? 'Desequilibrio en los primeros 45 minutos pero pérdida de 1v1 en el tramo final por fatiga estabilizadora.'
              : 'Eficacia en pases largos y duelos aéreos que consolidan la salida limpia del equipo.'}
          </div>
        </div>
      </div>
    </div>
  );
};
