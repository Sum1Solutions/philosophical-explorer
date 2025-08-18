// This file is deprecated. Use loaders.ts instead.
import { loadSources, getSourceLinks as getSourceLinksFromLoader, type SourceLink } from './loaders';

// Re-export for backward compatibility
export type { SourceLink };
export const sourceLinks = loadSources();
export const getSourceLinks = getSourceLinksFromLoader;