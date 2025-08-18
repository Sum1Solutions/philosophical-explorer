import { Tradition } from '../types';

// Import JSON data
import traditionsData from './json/traditions.json';
import sourcesData from './json/sources.json';

// Type definitions for source links
export interface SourceLink {
  name: string;
  url: string;
  description: string;
  source: 'archive.org' | 'wikisource' | 'sacred-texts' | 'perseus' | 'gutenberg' | 'dharmanet' | 'other';
  language?: string;
  translation?: string;
}

// Data loading functions
export const loadTraditions = (): Tradition[] => {
  return traditionsData as unknown as Tradition[];
};

export const loadSources = (): Record<string, SourceLink[]> => {
  return sourcesData as unknown as Record<string, SourceLink[]>;
};

// Helper function to get source links for a specific text
export const getSourceLinks = (textName: string): SourceLink[] => {
  const sources = loadSources();
  
  // Exact match first
  if (sources[textName]) {
    return sources[textName];
  }
  
  // Partial match for flexibility
  const normalizedSearch = textName.toLowerCase().replace(/[^\w\s]/g, '');
  for (const [key, links] of Object.entries(sources)) {
    if (key.toLowerCase().replace(/[^\w\s]/g, '').includes(normalizedSearch) ||
        normalizedSearch.includes(key.toLowerCase().replace(/[^\w\s]/g, ''))) {
      return links;
    }
  }
  
  return [];
};

// Function to get tradition by ID
export const getTraditionById = (id: string): Tradition | undefined => {
  const traditions = loadTraditions();
  return traditions.find(tradition => tradition.id === id);
};

// Function to get traditions by category
export const getTraditionsByCategory = (category: string): Tradition[] => {
  const traditions = loadTraditions();
  return traditions.filter(tradition => tradition.category === category);
};

// Function to search traditions
export const searchTraditions = (searchTerm: string): Tradition[] => {
  const traditions = loadTraditions();
  const normalizedSearch = searchTerm.toLowerCase();
  
  return traditions.filter(tradition =>
    tradition.name.toLowerCase().includes(normalizedSearch) ||
    tradition.category.toLowerCase().includes(normalizedSearch) ||
    tradition.keyFigures.some(figure => figure.toLowerCase().includes(normalizedSearch)) ||
    tradition.primaryTexts.some(text => {
      const textString = typeof text === 'string' ? text : text.title;
      return textString.toLowerCase().includes(normalizedSearch);
    })
  );
};

// Export the loaded data for backward compatibility
export const traditions = loadTraditions();
export const sourceLinks = loadSources();