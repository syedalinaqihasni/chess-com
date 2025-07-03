"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChessBoard } from '@/components/game/chess-board';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Star, 
  Clock, 
  TrendingUp, 
  RotateCcw,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { Chess } from 'chess.js';

interface Puzzle {
  id: string;
  fen: string;
  solution: string[];
  rating: number;
  theme: string;
  description: string;
}

export function Puzzles() {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const puzzles: Puzzle[] = [
    {
      id: '1',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4',
      solution: ['Nxe5', 'Nxe5', 'Qh5'],
      rating: 1200,
      theme: 'Fork',
      description: 'Find the knight fork that wins material'
    },
    {
      id: '2',
      fen: 'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
      solution: ['cxd5', 'exd5', 'Qxd5'],
      rating: 1000,
      theme: 'Capture',
      description: 'Capture the pawn and win the center'
    },
    {
      id: '3',
      fen: 'r1bq1rk1/ppp2ppp/2n1bn2/2bpp3/2B1P3/3P1N2/PPP1NPPP/R1BQ1RK1 w - - 0 8',
      solution: ['Bxf7+', 'Kh8', 'Ng5'],
      rating: 1500,
      theme: 'Attack',
      description: 'Launch a devastating attack on the king'
    }
  ];

  useEffect(() => {
    loadRandomPuzzle();
  }, []);

  const loadRandomPuzzle = () => {
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    setCurrentPuzzle(randomPuzzle);
    setGame(new Chess(randomPuzzle.fen));
    setSolutionIndex(0);
    setIsCompleted(false);
    setShowHint(false);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const handleSquareClick = (square: string) => {
    if (isCompleted || !currentPuzzle) return;

    if (selectedSquare) {
      const move = game.move({
        from: selectedSquare,
        to: square,
        promotion: 'q',
      });

      if (move) {
        const expectedMove = currentPuzzle.solution[solutionIndex];
        if (move.san === expectedMove) {
          setGame(new Chess(game.fen()));
          setSolutionIndex(solutionIndex + 1);
          
          if (solutionIndex + 1 >= currentPuzzle.solution.length) {
            setIsCompleted(true);
          }
        } else {
          // Wrong move, reset
          setGame(new Chess(currentPuzzle.fen));
          setSolutionIndex(0);
        }
        
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        handleSquareSelection(square);
      }
    } else {
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

  const stats = {
    rating: 1823,
    solved: 1247,
    streak: 8,
    accuracy: 87
  };

  if (!currentPuzzle) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Chess Puzzles</h1>
        <p className="text-muted-foreground">
          Improve your tactical skills with daily puzzles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{stats.rating}</div>
            <div className="text-sm text-muted-foreground">Puzzle Rating</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{stats.solved}</div>
            <div className="text-sm text-muted-foreground">Puzzles Solved</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Puzzle Board */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">Rating: {currentPuzzle.rating}</Badge>
                    <Badge>{currentPuzzle.theme}</Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {currentPuzzle.description}
                  </CardDescription>
                </div>
                {isCompleted && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Solved!
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ChessBoard
                position={game.fen()}
                onSquareClick={handleSquareClick}
                selectedSquare={selectedSquare}
                possibleMoves={possibleMoves}
                playerColor="white"
              />
            </CardContent>
          </Card>
        </div>

        {/* Puzzle Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Solution Progress</span>
                  <span>{solutionIndex}/{currentPuzzle.solution.length}</span>
                </div>
                <Progress 
                  value={(solutionIndex / currentPuzzle.solution.length) * 100} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Expected Moves:</h4>
                <div className="space-y-1">
                  {currentPuzzle.solution.map((move, index) => (
                    <div 
                      key={index}
                      className={`text-sm p-2 rounded ${
                        index < solutionIndex 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : index === solutionIndex
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-muted'
                      }`}
                    >
                      {index + 1}. {move}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowHint(!showHint)}
                  className="w-full"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>

                {showHint && (
                  <div className="text-sm p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    Look for the move: {currentPuzzle.solution[solutionIndex]}
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={loadRandomPuzzle}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Puzzle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}