"use client";

import { useState } from 'react';
import { ChessGame } from '@/components/game/chess-game';
import { GameLobby } from '@/components/game/game-lobby';

export function PlayOnline() {
  const [gameId, setGameId] = useState<string | null>(null);

  if (gameId) {
    return <ChessGame gameId={gameId} onLeaveGame={() => setGameId(null)} />;
  }

  return <GameLobby onJoinGame={setGameId} />;
}