import React, { useState } from 'react';
import { TacticalClip, PlayerData } from '../types/tactical';
import { Film, CheckCircle, Circle, Play } from 'lucide-react';

interface VideoAnalysisQueueProps {
  clips: TacticalClip[];
  player: PlayerData;
}

export const VideoAnalysisQueue: React.FC<VideoAnalysisQueueProps> = ({ clips, player }) => {
  const [activeClipId, setActiveClipId] = useState<string>(clips[0]?.id || 'clip-01');
  const [localClips, setLocalClips] = useState<TacticalClip[]>(clips);

  // Sync if clips prop changes
  React.useEffect(() => {
    setLocalClips(clips);
    if (clips[0]) setActiveClipId(clips[0].id);
  }, [clips]);

  const toggleReviewed = (id: string) => {
    setLocalClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, reviewed: !c.reviewed } : c))
    );
  };

  const activeClip = localClips.find((c) => c.id === activeClipId) || localClips[0];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            06.2 Videoanálisis Táctico: Sesión Individual ({player.name})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {player.status === 'REST_ABSOLUTE'
              ? 'Aprovechar la baja competitiva de Carlos Restrepo para corregir en sala de video las carreras de compensación y la lectura posicional.'
              : player.status === 'CAUTION'
              ? 'Revisión de tomas de decisión en banda izquierda y dosificación de carreras de alta intensidad.'
              : 'Revisión de alturas de la zaga y salida limpia de balón ante presión rival.'}
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded self-start sm:self-auto">
          <span>Duración planificada: 35-45 minutos</span>
        </div>
      </div>

      {/* Clips Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Clip List Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider px-1">
            Cola de Clips Analizados ({localClips.length})
          </div>

          {localClips.map((clip) => {
            const isActive = clip.id === activeClipId;
            return (
              <div
                key={clip.id}
                onClick={() => setActiveClipId(clip.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-slate-900 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-900/60">
                      MIN {clip.minute}'
                    </span>
                    <span className="text-xs text-slate-400 font-medium truncate max-w-[150px]">
                      {clip.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReviewed(clip.id);
                    }}
                    title={clip.reviewed ? 'Marcado como visto' : 'Marcar como visto con el jugador'}
                    className="cursor-pointer text-slate-400 hover:text-white transition-colors"
                  >
                    {clip.reviewed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>
                </div>

                <h4 className="text-sm font-semibold text-white mt-2 leading-snug">
                  {clip.title}
                </h4>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Distancia: {clip.distanceMeters}m</span>
                  <span>Velocidad Pico: {clip.peakSpeed} km/h</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Clip Coaching Viewer */}
        {activeClip && (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5 shadow-xl">
            {/* Simulated Video Player Screen */}
            <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,41,59,0.5)_0%,rgba(2,6,23,0.95)_100%)]" />
              
              <div className="absolute top-3 left-3 text-xs font-mono text-rose-400 bg-slate-950/80 px-2 py-1 rounded border border-rose-900/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{player.context.toUpperCase()} // MINUTO {activeClip.minute}:00</span>
              </div>

              <div className="text-center relative z-10 p-6 space-y-2">
                <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 transition-transform cursor-pointer">
                  <Play className="w-6 h-6 ml-1 fill-white" />
                </div>
                <div className="text-sm font-semibold text-white">
                  Reproducir Fragmento Táctico #{activeClip.minute}'
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Telemetría GPS vinculada al jugador #{player.number}
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
                <span>Distancia sprint: <strong className="text-white font-mono">{activeClip.distanceMeters} m</strong></span>
                <span>Velocidad pico: <strong className="text-rose-400 font-mono">{activeClip.peakSpeed} km/h</strong></span>
              </div>
            </div>

            {/* Description & Tactical Analysis */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">
                {activeClip.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeClip.description}
              </p>
            </div>

            {/* Coaching Cue Box */}
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-900/60 space-y-2">
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Consigna Metodológica para la Sesión con {player.name}:
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                "{activeClip.coachingCue}"
              </p>
            </div>

            {/* Review Status Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Estado de la revisión con {player.name}:
              </span>
              <button
                onClick={() => toggleReviewed(activeClip.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  activeClip.reviewed
                    ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {activeClip.reviewed
                  ? '✓ Sesión completada'
                  : 'Marcar como visto'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
