import React, { useState, useEffect } from 'react';
import { INITIAL_PLAYERS } from './data/reportData';
import { FullPlayerProfile, ReportEvidence } from './types/tactical';
import { Header } from './components/Header';
import { PlayerSelector } from './components/PlayerSelector';
import { PlayerBanner } from './components/PlayerBanner';
import { MetricsOverview } from './components/MetricsOverview';
import { TacticalPitch } from './components/TacticalPitch';
import { OpponentRiskSimulator } from './components/OpponentRiskSimulator';
import { RecoveryTimeline } from './components/RecoveryTimeline';
import { VideoAnalysisQueue } from './components/VideoAnalysisQueue';
import { EvidenceArchive } from './components/EvidenceArchive';
import { GenerateReportModal } from './components/GenerateReportModal';
import { AIConsultantModal } from './components/AIConsultantModal';
import { PrintReportView } from './components/PrintReportView';

export default function App() {
  const [players, setPlayers] = useState<Record<string, FullPlayerProfile>>(INITIAL_PLAYERS);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('carlos-restrepo');
  const [activeTab, setActiveTab] = useState<string>('evaluacion');

  // Evidence state: seeded with initial evidence records of Carlos Restrepo, Mateo Benítez & Santiago Valdés
  const [evidences, setEvidences] = useState<ReportEvidence[]>(() => {
    const saved = localStorage.getItem('kinetic_evidences_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      INITIAL_PLAYERS['carlos-restrepo'].initialEvidence,
      INITIAL_PLAYERS['mateo-benitez'].initialEvidence,
      INITIAL_PLAYERS['santiago-valdes'].initialEvidence,
    ];
  });

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  // Sync evidences to localStorage
  useEffect(() => {
    localStorage.setItem('kinetic_evidences_v1', JSON.stringify(evidences));
  }, [evidences]);

  const handleSaveEvidence = (newEvidence: ReportEvidence) => {
    setEvidences((prev) => [newEvidence, ...prev]);
    // Switch to evidence archive tab to show the saved result
    setActiveTab('evidencias');
  };

  const currentProfile = players[selectedPlayerId] || players['carlos-restrepo'];
  const { player, metrics, clips, recovery, opponents, auditNote } = currentProfile;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAI={() => setIsAIModalOpen(true)}
        onPrint={handlePrint}
        onGenerateReport={() => setIsGenerateModalOpen(true)}
        evidenceCount={evidences.length}
      />

      {/* Main Content Area (1440px max width baseline) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 no-print">
        {/* Multi-Player Switcher & Primary "Generar Reporte" Trigger */}
        <PlayerSelector
          players={players}
          selectedPlayerId={selectedPlayerId}
          onSelectPlayer={(id) => setSelectedPlayerId(id)}
          onGenerateReport={() => setIsGenerateModalOpen(true)}
          evidenceCount={evidences.length}
        />

        {/* Athlete Dossier & Urgent Medical Directive */}
        <PlayerBanner player={player} auditNote={auditNote} />

        {/* Tab Navigation Segmented Bar (Mobile View) */}
        <div className="flex xl:hidden overflow-x-auto pb-2 gap-2 text-xs">
          {[
            { id: 'evaluacion', label: 'Evaluación' },
            { id: 'tactica', label: 'Pizarra Táctica' },
            { id: 'oponentes', label: 'Oponentes' },
            { id: 'recuperacion', label: 'Protocolo Médico' },
            { id: 'videoanalisis', label: 'Videoanálisis' },
            { id: 'evidencias', label: `Evidencias (${evidences.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === t.id
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        {activeTab === 'evaluacion' && (
          <MetricsOverview metrics={metrics} player={player} />
        )}

        {activeTab === 'tactica' && <TacticalPitch />}

        {activeTab === 'oponentes' && (
          <OpponentRiskSimulator opponents={opponents} player={player} />
        )}

        {activeTab === 'recuperacion' && (
          <RecoveryTimeline recovery={recovery} player={player} />
        )}

        {activeTab === 'videoanalisis' && (
          <VideoAnalysisQueue clips={clips} player={player} />
        )}

        {activeTab === 'evidencias' && (
          <EvidenceArchive
            evidences={evidences}
            onLoadPlayer={(pId) => {
              if (players[pId]) {
                setSelectedPlayerId(pId);
                setActiveTab('evaluacion');
              }
            }}
            onPrintEvidence={() => handlePrint()}
          />
        )}
      </main>

      {/* Formal Printable Dossier for PDF Export (Hidden on screen, shown in print) */}
      <PrintReportView player={player} metrics={metrics} auditNote={auditNote} />

      {/* Dedicated "Generar Reporte" Modal Engine */}
      <GenerateReportModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        players={players}
        selectedPlayerId={selectedPlayerId}
        onSaveEvidence={handleSaveEvidence}
      />

      {/* Gemini AI Tactical Consultant Modal */}
      <AIConsultantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 sm:px-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Club Atlético Metropolitano</span>
            <span>·</span>
            <span>Unidad de Rendimiento Deportivo & Fisiología</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Dossier Activo: #{player.number} {player.name}</span>
            <span>·</span>
            <span>{player.analysisDate}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
