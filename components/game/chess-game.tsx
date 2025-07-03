"use client";

import { useState, useEffect } from 'react';
import { ChessBoard } from './chess-board';
import { GameInfo } from './game-info';
import { MoveHistory } from './move-history';
import { GameControls } from './game-controls';
import { Card } from '@/components/ui/card';
import { Chess } from 'chess.js';

interface ChessGameProps {
  gameId: string;
  onLeaveGame: () => void;
}

export function ChessGame({ gameId, onLeaveGame }: ChessGameProps) {
  const [game, setGame] = useState(() => new Chess());
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [gameStatus, setGameStatus] = useState<'playing' | 'checkmate' | 'stalemate' | 'draw'>('playing');

  useEffect(() => {
    // Initialize game state
    setPlayerColor(Math.random() > 0.5 ? 'white' : 'black');
  }, [gameId]);

  const handleSquareClick = (square: string) => {
    if (selectedSquare) {
      // Try to make a move
      const move = game.move({
        from: selectedSquare,
        to: square,
        promotion: 'q', // Always promote to queen for simplicity
      });

      if (move) {
        // Move was successful
        setGame(new Chess(game.fen()));
        setGameHistory([...gameHistory, move.san]);
        setSelectedSquare(null);
        setPossibleMoves([]);
        
        // Check game status
        if (game.isCheckmate()) {
          setGameStatus('checkmate');
        } else if (game.isStalemate()) {
          setGameStatus('stalemate');
        } else if (game.isDraw()) {
          setGameStatus('draw');
        }
      } else {
        // Invalid move, try selecting the new square
        handleSquareSelection(square);
      }
    } else {
      // Select a square
      handleSquareSelection(square);
    }
  };

  const handleSquareSelection = (square: string) => {
    const piece = game.get(square as any);
    
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square: square as any, verbose: true });
      setPossibleMoves(moves.map(move => move.to));
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const handleNewGame = () => {
    setGame(new Chess());
    setGameHistory([]);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setGameStatus('playing');
  };

  const handleResign = () => {
    setGameStatus('checkmate');
  };

  const players = {
    white: { name: 'You', rating: 1650, timeLeft: 600 },
    black: { name: 'Opponent', rating: 1632, timeLeft: 592 },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <ChessBoard
              position={game.fen()}
              onSquareClick={handleSquareClick}
              selectedSquare={selectedSquare}
              possibleMoves={possibleMoves}
              playerColor={playerColor}
              lastMove={gameHistory[gameHistory.length - 1]}
            />
          </Card>

          <GameControls
            onNewGame={handleNewGame}
            onResign={handleResign}
            onLeaveGame={onLeaveGame}
            gameStatus={gameStatus}
          />
        </div>

        <div className="space-y-6">
          <GameInfo
            players={players}
            currentTurn={game.turn()}
            gameStatus={gameStatus}
          />

          <MoveHistory
            moves={gameHistory}
            currentMoveIndex={gameHistory.length - 1}
          />
        </div>
      </div>
    </div>
  );
}