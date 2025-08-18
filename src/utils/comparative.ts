import { traditions } from '../data/traditions';
import { Tradition } from '../types';

export interface ComparisonStats {
  rank: number;
  total: number;
  percentile: number;
  comparison: string;
  details: string;
}

export const getAdherentsComparison = (tradition: Tradition): ComparisonStats => {
  // Convert adherent strings to numbers for comparison
  const parseAdherents = (adherentStr: string): number => {
    const str = adherentStr.toLowerCase();
    if (str.includes('b+')) return parseFloat(str) * 1000; // billions to millions
    if (str.includes('m+')) return parseFloat(str); // millions
    if (str.includes('k+')) return parseFloat(str) / 1000; // thousands to millions
    if (str.includes('unknown')) return 0;
    if (str.includes('cultural') || str.includes('revival') || str.includes('academic')) return 1;
    return 1; // default small number
  };

  const allTraditions = traditions.map(t => ({
    name: t.name,
    adherents: parseAdherents(t.adherents)
  })).sort((a, b) => b.adherents - a.adherents);

  const currentAdherents = parseAdherents(tradition.adherents);
  const rank = allTraditions.findIndex(t => t.name === tradition.name) + 1;
  const total = allTraditions.length;
  const percentile = Math.round((1 - rank / total) * 100);

  let comparison = '';
  if (currentAdherents >= 1000) {
    comparison = `${rank}st largest religion globally`;
  } else if (currentAdherents >= 10) {
    comparison = `${rank}th largest tradition by adherents`;
  } else {
    comparison = `Primarily academic/intellectual influence`;
  }

  const details = `Ranks ${rank} of ${total} traditions by adherents. Top 5: ${allTraditions.slice(0, 5).map(t => `${t.name} (${t.adherents >= 1000 ? t.adherents/1000 + 'B+' : t.adherents + 'M+'})`).join(', ')}`;

  return { rank, total, percentile, comparison, details };
};

export const getOriginComparison = (tradition: Tradition): ComparisonStats => {
  // Parse origin dates
  const parseOrigin = (originStr: string): number => {
    const str = originStr.toLowerCase();
    if (str.includes('bce')) {
      const match = str.match(/(\d+)/);
      return match ? -parseInt(match[1]) : 0;
    }
    if (str.includes('ce') || str.includes('century')) {
      const match = str.match(/(\d+)/);
      return match ? parseInt(match[1]) : 2000;
    }
    return 2000; // default modern
  };

  const allTraditions = traditions.map(t => ({
    name: t.name,
    year: parseOrigin(t.originDate),
    display: t.originDate
  })).sort((a, b) => a.year - b.year);

  const currentYear = parseOrigin(tradition.originDate);
  const rank = allTraditions.findIndex(t => t.name === tradition.name) + 1;
  const total = allTraditions.length;
  const age = 2024 - currentYear;

  let comparison = '';
  if (age > 2000) comparison = 'Ancient tradition (over 2000 years old)';
  else if (age > 1000) comparison = 'Medieval tradition (1000-2000 years old)';
  else if (age > 500) comparison = 'Early modern tradition (500-1000 years old)';
  else if (age > 100) comparison = 'Modern tradition (100-500 years old)';
  else comparison = 'Contemporary tradition (less than 100 years old)';

  const details = `${age > 0 ? age + ' years old' : 'Ancient tradition'}. Timeline: ${allTraditions.slice(0, 5).map(t => `${t.name} (${t.display})`).join(', ')}`;

  return { rank, total, percentile: Math.round((rank / total) * 100), comparison, details };
};

export const getConfidenceComparison = (tradition: Tradition): ComparisonStats => {
  const allTraditions = traditions.map(t => ({
    name: t.name,
    confidence: t.confidence
  })).sort((a, b) => b.confidence - a.confidence);

  const rank = allTraditions.findIndex(t => t.name === tradition.name) + 1;
  const total = allTraditions.length;
  const percentile = Math.round((1 - rank / total) * 100);
  const confidence = tradition.confidence;

  let comparison = '';
  if (confidence >= 0.95) comparison = 'Extremely well-documented tradition';
  else if (confidence >= 0.90) comparison = 'Very well-documented tradition';
  else if (confidence >= 0.85) comparison = 'Well-documented tradition';
  else comparison = 'Moderately documented tradition';

  const details = `Information accuracy: ${(confidence * 100).toFixed(0)}%. Based on scholarly consensus, primary source availability, and historical documentation. Highest confidence: ${allTraditions.slice(0, 3).map(t => `${t.name} (${(t.confidence * 100).toFixed(0)}%)`).join(', ')}`;

  return { rank, total, percentile, comparison, details };
};