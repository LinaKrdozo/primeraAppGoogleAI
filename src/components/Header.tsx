import React from 'react';
import { Sparkles, Printer, Archive } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAI: () => void;
  onPrint: () => void;
  onGenerateReport: () => void;
  evidenceCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAI,
  onPrint,
  onGenerateReport,
  evidenceCount,
}) => {
  const navLinks = [
    { id: 'evaluacion', label: 'Evaluación Fisiológica' },
    { id: 'tactica', label: 'Pizarra & Despliegue' },
    { id: 'oponentes', label: 'Análisis de Oponentes' },
    { id: 'recuperacion', label: 'Protocolo Médico' },
    { id: 'videoanalisis', label: 'Videoanálisis Táctico' },
    { id: 'evidencias', label: `Archivo de Evidencias (${evidenceCount})` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="/" 
          className="text-lg font-bold tracking-tight text-white flex items-center gap-2.5 shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span>KineticTactics Pro</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-400">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'hover:text-slate-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onGenerateReport}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm transition-all whitespace-nowrap cursor-pointer hover:shadow-rose-950/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-200" />
            <span>Generar Reporte</span>
          </button>

          <button
            onClick={onPrint}
            title="Exportar o imprimir informe en formato oficial"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>

          <button
            onClick={onOpenAI}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Consultor AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
