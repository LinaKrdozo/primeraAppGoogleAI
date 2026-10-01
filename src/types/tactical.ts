export interface PlayerData {
  id: string;
  name: string;
  number: number;
  position: string;
  age: number;
  club: string;
  analysisDate: string;
  context: string;
  weeklyMinutes: number;
  status: 'REST_ABSOLUTE' | 'CAUTION' | 'FIT';
  injuryRisk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  acwr: number; // Acute:Chronic Workload Ratio
  portraitUrl: string;
  tacticalRole: string;
}

export interface MetricComparison {
  key: string;
  label: string;
  unit: string;
  currentValue: number;
  baselineValue: number;
  deltaPercent: number;
  category: 'PHYSIOLOGICAL' | 'TECHNICAL' | 'COGNITIVE' | 'WORKLOAD';
  interpretation: string;
  status: 'critical_drop' | 'excessive_load' | 'optimal';
}

export interface TacticalClip {
  id: string;
  minute: number;
  title: string;
  category: 'COMPENSATORY_RUN' | 'PRESSING_TURNOVER' | 'DEFENSIVE_RETREAT_LAG';
  distanceMeters: number;
  peakSpeed: number;
  description: string;
  coachingCue: string;
  reviewed: boolean;
}

export interface RecoveryDay {
  dayNumber: number;
  hoursPostMatch: string;
  phase: string;
  focus: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  activities: string[];
  restrictions: string[];
  biomarkers: string[];
}

export interface OpponentProfile {
  id: string;
  name: string;
  style: string;
  tacticalDescription: string;
  restrepoVulnerability: string;
  riskLevel: 'EXTREME' | 'HIGH' | 'MEDIUM' | 'LOW';
  pressingTriggerRisk: number; // percentage
  transitionVulnerability: number; // percentage
  coachingDirective: string;
}

export interface ReportEvidence {
  id: string;
  playerId: string;
  playerName: string;
  playerNumber: number;
  playerPosition: string;
  generatedAt: string;
  context: string;
  verdictTitle: string;
  verdictBadge: 'REST_ABSOLUTE' | 'CAUTION' | 'FIT';
  summary: string;
  physiologicalEvaluation: string;
  tacticalEvaluation: string;
  actionPlan: string;
  metricsSnapshot: MetricComparison[];
  source: 'MANUAL_GENERATION' | 'INITIAL_EVIDENCE' | 'GEMINI_AI';
}

export interface FullPlayerProfile {
  player: PlayerData;
  metrics: MetricComparison[];
  clips: TacticalClip[];
  recovery: RecoveryDay[];
  opponents: OpponentProfile[];
  auditNote?: {
    originalRawValue: string;
    correctedValue: string;
    metricName: string;
    baselineValue: string;
    explanation: string;
  };
  initialEvidence: ReportEvidence;
}
