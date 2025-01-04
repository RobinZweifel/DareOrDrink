export interface Category {
  id: string;
  name: string;
  challenges: string[];
}

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  isSelected?: boolean;
}

export interface GameState {
  selectedCategory: Category | null;
  touchPoints: TouchPoint[];
  selectedPoint: TouchPoint | null;
  currentChallenge: string | null;
  isSelecting: boolean;
}