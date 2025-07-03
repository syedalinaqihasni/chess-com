"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';

interface MoveHistoryProps {
  moves: string[];
  currentMoveIndex: number;
}

export function MoveHistory({ moves, currentMoveIndex }: MoveHistoryProps) {
  const movePairs = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Move History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {movePairs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No moves yet
            </div>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair, index) => (
                <div key={index} className="flex items-center gap-4 text-sm">
                  <span className="w-6 text-muted-foreground">
                    {pair.number}.
                  </span>
                  <span className="w-16 font-mono">
                    {pair.white}
                  </span>
                  <span className="w-16 font-mono">
                    {pair.black || ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}