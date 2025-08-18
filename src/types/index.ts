export interface Tradition {
  id: string;
  name: string;
  category: 'Hindu Philosophy' | 'Islamic Theology' | 'Christian Theology' | 'Jewish Theology' | 'Sikh Theology' | 'Buddhist Philosophy' | 'Eastern Philosophy' | 'Western Philosophy' | 'Japanese Religion' | 'Indian Religion' | 'Abrahamic Religion';
  subSchool?: string;
  
  metaphysics: {
    ultimateReality: string;
    viewOfWorld: string;
    viewOfSelf: string;
    afterlife: string;
  };
  
  epistemology: string[];
  ethics: string[];
  liberation: {
    goal: string;
    path: string[];
  };
  
  critiques: Record<string, string>;
  primaryTexts: (string | { title: string; url?: string; description?: string })[];
  adherents: string;
  originDate: string;
  keyFigures: string[];
  
  // Validation metadata
  confidence: number; // 0-1 score
  lastUpdated: string;
  sources: Citation[];
}

export interface Citation {
  text: string;
  source: string;
  page?: string;
  verse?: string;
  url?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface Comparison {
  id: string;
  traditionA: string;
  traditionB: string;
  aspects: ComparisonAspect[];
  createdBy: string;
  createdAt: string;
}

export interface ComparisonAspect {
  category: 'metaphysics' | 'epistemology' | 'ethics' | 'liberation';
  field: string;
  valueA: string;
  valueB: string;
  citations: Citation[];
  conflicts?: string[];
}

export interface AIDebate {
  id: string;
  participants: string[]; // tradition names
  topic: string;
  messages: DebateMessage[];
  moderator: boolean;
  userParticipating: boolean;
}

export interface DebateMessage {
  tradition: string;
  content: string;
  citations: Citation[];
  timestamp: string;
  confidence: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  category: 'metaphysics' | 'epistemology' | 'ethics' | 'lifestyle';
}

export interface QuizOption {
  text: string;
  weight: Record<string, number>; // tradition_id -> weight
}

export interface UserProfile {
  id: string;
  savedComparisons: string[];
  quizResults: Record<string, number>; // tradition -> alignment score
  preferences: {
    perspective: string; // which tradition's lens to view from
    showCitations: boolean;
    confidenceThreshold: number;
  };
}

export type ViewMode = 'table' | 'mindmap' | 'debate' | 'quiz';
export type FilterCategory = 'all' | 'religion' | 'philosophy' | 'eastern' | 'western';