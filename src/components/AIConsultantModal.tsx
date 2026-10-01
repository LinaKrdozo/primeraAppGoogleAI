import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, Bot, HelpCircle, CheckCircle } from 'lucide-react';

interface AIConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Diseño detallado de los rondos 4v2 y 5v3 a 1-2 toques para el Día 4 de reintegro.',
    '¿Qué perfil de mediocentro sustituto debe alinear el DT para reemplazar a Restrepo?',
    'Protocolo de control de CK e isquiotibiales antes de autorizar el alta competitiva.',
  ];

  const handleSubmit = async (userQuery: string) => {
    if (!userQuery.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/tactical/ai-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          player: 'Carlos Restrepo',
          section: 'Consultoría Táctica y Médica Integral',
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setResponse(data.analysis);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err: any) {
      setError('Error al comunicar con el motor de inteligencia táctica.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-950 border border-rose-800">
              <Sparkles className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Consultor Táctico & Médico AI (Gemini 3.8)
              </h3>
              <p className="text-[11px] text-slate-400">
                Dirección de Metodología y Rendimiento · Club Atlético Metropolitano
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Conversation */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Default State & Quick Prompts */}
          {!response && !loading && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                Formula preguntas sobre la gestión de fatiga neuromuscular de Carlos Restrepo, prescripción de tareas tácticas a 1-2 toques, o ajustes en el modelo de juego para el próximo partido.
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Consultas recomendadas para el cuerpo técnico:
                </span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(prompt);
                      handleSubmit(prompt);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-rose-500/60 text-xs text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <span>{prompt}</span>
                    <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="p-8 flex flex-col items-center justify-center space-y-3 text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
              <span>Analizando biometría GPS y directrices metodológicas con Gemini...</span>
            </div>
          )}

          {/* AI Response Display */}
          {response && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2 text-slate-400">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-rose-400" />
                  Prescripción Metodológica Gemini:
                </span>
                <span className="font-mono text-[10px] text-rose-400">gemini-3.8-flash</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                <button
                  onClick={() => {
                    setResponse(null);
                    setQuery('');
                  }}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Realizar otra consulta
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900 text-xs text-rose-200">
              {error}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(query);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pregunta sobre la carga de Restrepo o diseño de ejercicios..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Consultar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
