"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Flag, RotateCcw, Home, HandHeart } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onResign: () => void;
  onLeaveGame: () => void;
  gameStatus: 'playing' | 'checkmate' | 'stalemate' | 'draw';
}

export function GameControls({ 
  onNewGame, 
  onResign, 
  onLeaveGame, 
  gameStatus 
}: GameControlsProps) {
  const isGameActive = gameStatus === 'playing';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            onClick={onNewGame}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            New Game
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled
          >
            <HandHeart className="h-4 w-4" />
            Draw
          </Button>

          {isGameActive && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Flag className="h-4 w-4" />
                  Resign
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to resign?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. You will lose the game.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onResign}>
                    Resign
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            variant="secondary"
            onClick={onLeaveGame}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Leave Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}