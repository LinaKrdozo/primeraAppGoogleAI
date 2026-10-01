import React, { useState } from 'react';
import { Eye, Shield, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const TacticalPitch: React.FC = () => {
  const [pitchMode, setPitchMode] = useState<'compensatory' | 'economical'>('compensatory');
  const [selectedPin, setSelectedPin] = useState<string | null>('restrepo');

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            05. Pizarra Táctica: Corrección del Posicionamiento & Economía de Carrera
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            El kilometraje excesivo (13.2 km) sumado a la baja precisión (62%) denota que el jugador está "corriendo mal".
          </p>
        </div>

        {/* View Mode Segmented Switcher (Functional buttons) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setPitchMode('compensatory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              pitchMode === 'compensatory'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Final Regional (13.2 km Disperso)
          </button>
          <button
            onClick={() => setPitchMode('economical')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              pitchMode === 'economical'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Modelo Recomendado (Bloque Compacto)
          </button>
        </div>
      </div>

      {/* Main Pitch & Tactical Annotations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pitch Container (SVG) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 relative shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-mono text-slate-400">
              {pitchMode === 'compensatory'
                ? 'MAPA DE DISPERSIÓN // CARRERAS DE COMPENSACIÓN IRREGULARES'
                : 'PATRÓN ÓPTIMO // PIVOTE CENTRAL Y LÍNEAS DE PASE A 1-2 TOQUES'}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Haz clic en los puntos tácticos
            </span>
          </div>

          {/* Soccer Pitch Graphic */}
          <div className="relative w-full aspect-[16/10] bg-emerald-950/70 border border-emerald-800/60 rounded-lg overflow-hidden shadow-inner flex items-center justify-center">
            {/* Pitch pattern lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.05)_50%,transparent_50%)] bg-[length:12.5%_100%] pointer-events-none" />

            <svg
              viewBox="0 0 1000 640"
              className="w-full h-full select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer boundary */}
              <rect
                x="30"
                y="30"
                width="940"
                height="580"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeOpacity="0.4"
              />

              {/* Halfway line */}
              <line
                x1="500"
                y1="30"
                x2="500"
                y2="610"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeOpacity="0.4"
              />

              {/* Center Circle */}
              <circle
                cx="500"
                cy="320"
                r="90"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeOpacity="0.4"
              />
              <circle cx="500" cy="320" r="4" fill="#10b981" fillOpacity="0.8" />

              {/* Left Penalty Area */}
              <rect
                x="30"
                y="150"
                width="160"
                height="340"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeOpacity="0.4"
              />
              <rect
                x="30"
                y="230"
                width="60"
                height="180"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeOpacity="0.4"
              />
              <circle cx="140" cy="320" r="3.5" fill="#10b981" fillOpacity="0.8" />

              {/* Right Penalty Area */}
              <rect
                x="810"
                y="150"
                width="160"
                height="340"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeOpacity="0.4"
              />
              <rect
                x="910"
                y="230"
                width="60"
                height="180"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeOpacity="0.4"
              />
              <circle cx="860" cy="320" r="3.5" fill="#10b981" fillOpacity="0.8" />

              {/* MODE 1: COMPENSATORY RUNNING (CHAOS / OVER-RUNNING) */}
              {pitchMode === 'compensatory' && (
                <g>
                  {/* Heatmap Ellipse 1 (Over-extended to Left Wing) */}
                  <ellipse
                    cx="420"
                    cy="140"
                    rx="120"
                    ry="70"
                    fill="#f43f5e"
                    fillOpacity="0.22"
                  />
                  {/* Heatmap Ellipse 2 (Over-extended to Right Flank) */}
                  <ellipse
                    cx="460"
                    cy="500"
                    rx="110"
                    ry="65"
                    fill="#f43f5e"
                    fillOpacity="0.18"
                  />
                  {/* Central zone depleted */}
                  <ellipse
                    cx="480"
                    cy="320"
                    rx="70"
                    ry="50"
                    fill="#fbbf24"
                    fillOpacity="0.15"
                  />

                  {/* Erratic trajectory lines (compensatory chases) */}
                  <path
                    d="M 480 320 Q 380 200 410 130 T 360 90"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    strokeOpacity="0.8"
                  />
                  <path
                    d="M 480 320 Q 420 440 470 510 T 540 550"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    strokeOpacity="0.8"
                  />
                  <path
                    d="M 480 320 L 640 300"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    strokeOpacity="0.7"
                  />

                  {/* Turnover / Loss Points (62% Accuracy fails) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedPin('turnover1')}
                  >
                    <circle cx="410" cy="130" r="16" fill="#881337" fillOpacity="0.9" />
                    <circle cx="410" cy="130" r="9" fill="#f43f5e" />
                    <text
                      x="410"
                      y="134"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      !
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedPin('turnover2')}
                  >
                    <circle cx="560" cy="270" r="16" fill="#881337" fillOpacity="0.9" />
                    <circle cx="560" cy="270" r="9" fill="#f43f5e" />
                    <text
                      x="560"
                      y="274"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      !
                    </text>
                  </g>

                  {/* Carlos Restrepo Marker (Isolated / Exhausted) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedPin('restrepo')}
                  >
                    <circle cx="480" cy="320" r="22" fill="#0f172a" stroke="#f43f5e" strokeWidth="3" />
                    <circle cx="480" cy="320" r="16" fill="#f43f5e" />
                    <text
                      x="480"
                      y="325"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="13"
                      fontWeight="bold"
                    >
                      8
                    </text>
                  </g>

                  {/* Team Center Backs Left Disconnected */}
                  <g onClick={() => setSelectedPin('cb-left')} className="cursor-pointer">
                    <circle cx="280" cy="220" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                    <text x="280" y="224" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">4</text>
                  </g>
                  <g onClick={() => setSelectedPin('cb-right')} className="cursor-pointer">
                    <circle cx="280" cy="420" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                    <text x="280" y="424" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">5</text>
                  </g>
                </g>
              )}

              {/* MODE 2: RECOMMENDED TACTICAL BLUEPRINT (DISCIPLINED) */}
              {pitchMode === 'economical' && (
                <g>
                  {/* Compact central defensive polygon */}
                  <polygon
                    points="320,200 480,240 480,400 320,440"
                    fill="#10b981"
                    fillOpacity="0.2"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Passing triangles (1-2 touch safety distribution) */}
                  <line
                    x1="450"
                    y1="320"
                    x2="300"
                    y2="220"
                    stroke="#34d399"
                    strokeWidth="3"
                  />
                  <line
                    x1="450"
                    y1="320"
                    x2="300"
                    y2="420"
                    stroke="#34d399"
                    strokeWidth="3"
                  />
                  <line
                    x1="450"
                    y1="320"
                    x2="590"
                    y2="240"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />
                  <line
                    x1="450"
                    y1="320"
                    x2="590"
                    y2="400"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />

                  {/* Restrepo in Central Shield Position */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedPin('restrepo')}
                  >
                    <circle cx="450" cy="320" r="24" fill="#0f172a" stroke="#10b981" strokeWidth="3.5" />
                    <circle cx="450" cy="320" r="17" fill="#059669" />
                    <text
                      x="450"
                      y="325"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      8
                    </text>
                  </g>

                  {/* CB 4 & CB 5 Connected */}
                  <g onClick={() => setSelectedPin('cb-left')} className="cursor-pointer">
                    <circle cx="300" cy="220" r="16" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <circle cx="300" cy="220" r="12" fill="#047857" />
                    <text x="300" y="224" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">4</text>
                  </g>

                  <g onClick={() => setSelectedPin('cb-right')} className="cursor-pointer">
                    <circle cx="300" cy="420" r="16" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <circle cx="300" cy="420" r="12" fill="#047857" />
                    <text x="300" y="424" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">5</text>
                  </g>

                  {/* Interiors #10 & #7 facing to receive */}
                  <g onClick={() => setSelectedPin('interior10')} className="cursor-pointer">
                    <circle cx="590" cy="240" r="15" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                    <text x="590" y="244" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">10</text>
                  </g>

                  <g onClick={() => setSelectedPin('interior7')} className="cursor-pointer">
                    <circle cx="590" cy="400" r="15" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                    <text x="590" y="404" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">7</text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Carlos Restrepo (#8 Pivote)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Triangulación Defensiva</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Pase de Seguridad (1-2 toques)</span>
            </span>
          </div>
        </div>

        {/* Tactical Feedback Card (Syncs with selectedPin) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Instrucción Táctica Específica
            </span>
            <span className="text-[11px] font-mono text-slate-400">Pilar 5</span>
          </div>

          {pitchMode === 'compensatory' ? (
            <div className="space-y-3">
              <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-lg text-xs text-rose-200">
                <strong className="block text-rose-300 font-bold mb-1">
                  Diagnóstico: Corriendo Mal por Compensación
                </strong>
                En la Final Regional, Restrepo abandonó su zona central 14 veces para realizar carreras de cobertura a banda de más de 30 metros. Esta desconexión no robó balones y lo dejó exhausto para el juego con balón.
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-white">Consecuencias Observadas:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Pérdidas no forzadas en zona 2 (62% precisión)</li>
                  <li>Desprotección del carril central en transiciones rivales</li>
                  <li>Incapacidad de acelerar en repliegue (techo a 28 km/h)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-lg text-xs text-emerald-200">
                <strong className="block text-emerald-300 font-bold mb-1">
                  1. Economía de Esfuerzo mediante Posicionamiento
                </strong>
                Restrepo debe operar como un escudo fijo en el bloque medio. No perseguir el balón a las bandas; ordenar a los interiores y esperar la línea de pase para interceptar por perfilamiento.
              </div>

              <div className="p-3 bg-sky-950/40 border border-sky-900/60 rounded-lg text-xs text-sky-200">
                <strong className="block text-sky-300 font-bold mb-1">
                  2. Gestión de Riesgo en Distribución (1-2 Toques)
                </strong>
                Bajo fatiga acumulada, prohibido conducir o buscar el pase vertical de alto riesgo. Jugar a 1 o 2 toques hacia los compañeros que vienen de cara (centrales #4 y #5) o apoyo en descarga.
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <strong>Consigna para el DT:</strong> Transmitir en sesión de video previa a su reintegro que "menos metros con mejor posición multiplican la eficacia del equipo".
          </div>
        </div>
      </div>
    </div>
  );
};
