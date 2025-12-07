export interface GameSection {
  id: string;
  title: string;
  icon: string;
  content: string[];
  subsections?: GameSubsection[];
}

export interface GameSubsection {
  title: string;
  content: string[];
  tips?: string[];
}

export interface ClassInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
}

export interface ElementalInfo {
  element: string;
  icon: string;
  strongAgainst: string;
  weakAgainst: string;
  description: string;
}