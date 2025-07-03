export interface GameState {
  id: string;
  fen: string;
  moves: string[];
  players: {
    white: Player;
    black: Player;
  };
  currentTurn: 'w' | 'b';
  status: 'waiting' | 'playing' | 'finished';
  result?: 'white' | 'black' | 'draw';
  timeControl: {
    initial: number;
    increment: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  rating: number;
  timeLeft: number;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  timeControl: string;
  isPrivate: boolean;
  password?: string;
}