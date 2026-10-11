import { KBC_DIMENSIONS, PANCA_CINTA_LIST, SCORE_CATEGORIES } from '../data/kbcFramework';
import { Dimension, ScoreCategory } from '../types/kbc';

export function calculateTotalScore(scores: Record<string, number>): number {
  let total = 0;
  for (const dim of KBC_DIMENSIONS) {
    for (const ind of dim.indicators) {
      total += scores[ind.id] || 0;
    }
  }
  return total;
}

export function calculateMaxScore(): number {
  let count = 0;
  for (const dim of KBC_DIMENSIONS) {
    count += dim.indicators.length;
  }
  return count * 4;
}

export function calculatePercentage(scores: Record<string, number>): number {
  const total = calculateTotalScore(scores);
  const max = calculateMaxScore();
  if (max === 0) return 0;
  return Number(((total / max) * 100).toFixed(1));
}

export function getScoreCategory(percentage: number): ScoreCategory {
  const cat = SCORE_CATEGORIES.find(
    (c) => percentage >= c.minPercentage && percentage <= c.maxPercentage
  );
  return cat || SCORE_CATEGORIES[SCORE_CATEGORIES.length - 1];
}

export interface DimensionStats {
  id: number;
  code: string;
  name: string;
  stage: 'Input' | 'Proses' | 'Output' | 'Dampak';
  totalScore: number;
  maxScore: number;
  percentage: number;
  averageScore: number;
  indicatorCount: number;
  completedCount: number;
  statusCategory: ScoreCategory;
}

export function calculateDimensionStats(
  dimension: Dimension,
  scores: Record<string, number>
): DimensionStats {
  let total = 0;
  let completed = 0;
  for (const ind of dimension.indicators) {
    const s = scores[ind.id];
    if (s && s > 0) {
      total += s;
      completed += 1;
    }
  }
  const max = dimension.indicators.length * 4;
  const percentage = max > 0 ? Number(((total / max) * 100).toFixed(1)) : 0;
  const averageScore =
    dimension.indicators.length > 0
      ? Number((total / dimension.indicators.length).toFixed(2))
      : 0;

  return {
    id: dimension.id,
    code: dimension.code,
    name: dimension.name,
    stage: dimension.stage,
    totalScore: total,
    maxScore: max,
    percentage,
    averageScore,
    indicatorCount: dimension.indicators.length,
    completedCount: completed,
    statusCategory: getScoreCategory(percentage),
  };
}

export interface PancaCintaStat {
  id: string;
  name: string;
  shortName: string;
  color: string;
  description: string;
  score: number;
  maxScore: number;
  percentage: number;
  indicatorCount: number;
}

export function calculatePancaCintaStats(
  scores: Record<string, number>
): PancaCintaStat[] {
  return PANCA_CINTA_LIST.map((pc) => {
    let total = 0;
    let count = 0;

    for (const dim of KBC_DIMENSIONS) {
      for (const ind of dim.indicators) {
        if (ind.pancaCinta.includes(pc.shortName as any)) {
          total += scores[ind.id] || 0;
          count += 1;
        }
      }
    }

    const max = count * 4;
    const percentage = max > 0 ? Number(((total / max) * 100).toFixed(1)) : 0;

    return {
      id: pc.id,
      name: pc.name,
      shortName: pc.shortName,
      color: pc.color,
      description: pc.description,
      score: total,
      maxScore: max,
      percentage,
      indicatorCount: count,
    };
  });
}

export interface PipelineStageStat {
  stage: 'Input' | 'Proses' | 'Output' | 'Dampak';
  dimensions: string[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  color: string;
}

export function calculatePipelineStats(
  scores: Record<string, number>
): PipelineStageStat[] {
  const stages: ('Input' | 'Proses' | 'Output' | 'Dampak')[] = [
    'Input',
    'Proses',
    'Output',
    'Dampak',
  ];
  const stageColors = {
    Input: '#3b82f6', // blue
    Proses: '#10b981', // emerald
    Output: '#f59e0b', // amber
    Dampak: '#8b5cf6', // purple
  };

  return stages.map((stage) => {
    const dims = KBC_DIMENSIONS.filter((d) => d.stage === stage);
    let total = 0;
    let max = 0;

    dims.forEach((d) => {
      d.indicators.forEach((i) => {
        total += scores[i.id] || 0;
        max += 4;
      });
    });

    const percentage = max > 0 ? Number(((total / max) * 100).toFixed(1)) : 0;

    return {
      stage,
      dimensions: dims.map((d) => d.name),
      totalScore: total,
      maxScore: max,
      percentage,
      color: stageColors[stage],
    };
  });
}

export function generateSuggestedRecommendations(
  dimension: Dimension,
  scores: Record<string, number>
): { strengths: string; weaknesses: string; recommendation: string } {
  const scoredIndicators = dimension.indicators.map((ind) => ({
    indicator: ind,
    score: scores[ind.id] || 0,
  }));

  const strengthsList = scoredIndicators.filter((item) => item.score >= 3);
  const weaknessesList = scoredIndicators.filter((item) => item.score <= 2);

  const strengthsText =
    strengthsList.length > 0
      ? `Kekuatan teramati pada: ${strengthsList
          .map((s) => `${s.indicator.title} (Skor ${s.score})`)
          .join('; ')}.`
      : 'Aspek kekuatan masih memerlukan penguatan mendasar di seluruh indikator.';

  const weaknessesText =
    weaknessesList.length > 0
      ? `Area perlu pembenahan: ${weaknessesList
          .map((w) => `${w.indicator.title} (Skor ${w.score})`)
          .join('; ')}.`
      : 'Tidak ditemukan kelemahan mayor; seluruh indikator berada pada taraf Berkembang atau Membudaya.';

  let recommendationText = '';
  if (weaknessesList.length > 0) {
    const lowest = [...weaknessesList].sort((a, b) => a.score - b.score)[0];
    recommendationText = `Prioritaskan pendampingan pada indikator "${lowest.indicator.title}". Rancang pelatihan berkala, sediakan bukti fisik terpadu, dan lakukan monev per dua pekan.`;
  } else {
    recommendationText = `Pertahankan pencapaian yang sudah membudaya. Jadikan ${dimension.name} sebagai praktik baik rujukan bagi satuan RA lain di lingkungan Kemenag.`;
  }

  return {
    strengths: strengthsText,
    weaknesses: weaknessesText,
    recommendation: recommendationText,
  };
}
