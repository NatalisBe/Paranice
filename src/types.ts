export type GameStatus = "rules" | "waiting" | "countdown" | "playing" | "finished";

export interface Game {
  id: string;
  status: GameStatus;
  hostId: string;
  startedAt: number | null;
  duration: number;
}

export interface Player {
  id: string;
  name: string;
  characterId: string;
  score: number;
  joinedAt: number;
}

export interface Team {
  id: string;
  name: string;
  totalScore: number;
  playerIds: string[];
}

export type FigureType = "normal" | "powerup" | "bomb" | "dodge";

export interface Figure {
  id: string;
  characterId: string;
  type: FigureType;
  x: number;
  y: number;
  spawnedAt: number;
  caughtBy: string | null;
  caughtAt: number | null;
  animDuration: number;
  animDelay: number;
  spawnDelay?: number;
  lifespan?: number;
}

export const CHARACTERS = {
  normal: ['nugget-bros', 'semillita', 'pez-hojuela', 'paleta-ninja'],
  powerup: ['spreadie', 'mr-tv'],
  bomb: ['nuez-gafas'],
  dodge: ['choco-cool', 'mermaid-cookie', 'granola-dragon']
};
