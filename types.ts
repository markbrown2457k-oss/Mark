export interface LocationData {
  id: number;
  title: string;
  address: string;
  area: number; // in sq meters
  floor: string;
  price: number; // rub/month
  description: string;
  neighbors: string[];
  features: string[];
  imageUrl: string;
  isGood: boolean;
  stopFactorReason?: string; // Reason why it's bad (if isGood is false)
  goodReason?: string; // Reason why it's good
}

export type GameState = 'intro' | 'playing' | 'won' | 'lost';

export interface GameStats {
  score: number;
  correctDecisions: number;
  totalDecisions: number;
}