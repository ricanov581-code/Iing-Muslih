export interface RubricLevel {
  score: 1 | 2 | 3 | 4;
  label: string;
  description: string;
}

export interface Indicator {
  id: string;
  code: string;
  title: string;
  description: string;
  pancaCinta: ('Allah & Rasul' | 'Ilmu' | 'Lingkungan' | 'Diri & Sesama' | 'Tanah Air')[];
  evidenceExamples: string[];
  descriptors: {
    1: string; // Belum
    2: string; // Mulai
    3: string; // Berkembang
    4: string; // Membudaya
  };
}

export type PipelineStage = 'Input' | 'Proses' | 'Output' | 'Dampak';

export interface Dimension {
  id: number;
  code: string;
  name: string;
  stage: PipelineStage;
  evidenceSummary: string;
  description: string;
  indicators: Indicator[];
}

export interface DimensionFinding {
  scoreAverage: number;
  strengths: string;
  weaknesses: string;
  recommendation: string;
  pic: string; // Penanggung Jawab
  timeline: string; // Target Waktu
}

export interface TriangulationMethod {
  name: string;
  description: string;
  items: {
    id: string;
    label: string;
    checked: boolean;
  }[];
  notes: string;
}

export interface EvaluationData {
  id: string;
  schoolName: string;
  academicYear: string;
  semester: 'Semester Ganjil' | 'Semester Genap';
  evaluatorName: string;
  evaluatorRole: string;
  evaluationDate: string;
  scores: Record<string, number>; // indicatorId -> 1..4
  indicatorNotes: Record<string, string>; // indicatorId -> notes
  findings: Record<number, DimensionFinding>; // dimensionId -> DimensionFinding
  triangulation: {
    documentReview: TriangulationMethod;
    observation: TriangulationMethod;
    interview: TriangulationMethod;
    survey: TriangulationMethod;
  };
  pdca: {
    plan: string;
    do: string;
    check: string;
    act: string;
  };
}

export interface ScoreCategory {
  minPercentage: number;
  maxPercentage: number;
  label: string;
  tone: 'emerald' | 'teal' | 'amber' | 'rose';
  description: string;
  recommendedAction: string;
}
