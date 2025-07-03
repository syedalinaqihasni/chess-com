"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';

interface Player {
  name: string;
  rating: number;
  timeLeft: number;
}

interface GameInfoProps {
  players: {
    white: Player;
    black: Player;
  };
  currentTurn: 'w' | 'b';
  gameStatus: 'playing' | 'checkmate' | 'stalemate' | 'draw';
}

export function GameInfo({ players, currentTurn, gameStatus }: GameInfoProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = () => {
    switch (gameStatus) {
      case 'checkmate':
        return <Badge variant="destructive">Checkmate</Badge>;
      case 'stalemate':
        return <Badge variant="secondary">Stalemate</Badge>;
      case 'draw':
        return <Badge variant="secondary">Draw</Badge>;
      default:
        return <Badge variant="default">Playing</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Game Info</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Black Player */}
        <div className={`p-3 rounded-lg border ${currentTurn === 'b' ? 'bg-accent' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-semibold">{players.black.name}</div>
                <div className="text-sm text-muted-foreground">
                  {players.black.rating}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">
                {formatTime(players.black.timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* White Player */}
        <div className={`p-3 rounded-lg border ${currentTurn === 'w' ? 'bg-accent' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <div className="font-semibold">{players.white.name}</div>
                <div className="text-sm text-muted-foreground">
                  {players.white.rating}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">
                {formatTime(players.white.timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {gameStatus === 'playing' && (
            <span>
              {currentTurn === 'w' ? 'White' : 'Black'} to move
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}