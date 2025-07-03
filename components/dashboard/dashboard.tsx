"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Puzzle, 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Clock,
  Target,
  Award
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = {
    rating: 1650,
    gamesPlayed: 247,
    winRate: 68,
    puzzleRating: 1823,
    streak: 12,
    timeSpent: 45
  };

  const recentGames = [
    { opponent: 'ChessMaster2024', result: 'win', rating: 1647, timeControl: '10+0' },
    { opponent: 'QueenGambit', result: 'loss', rating: 1623, timeControl: '5+0' },
    { opponent: 'RookiePlayer', result: 'win', rating: 1456, timeControl: '15+10' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Ready to improve your chess skills today?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('play')}>
          <CardContent className="p-6 text-center">
            <Play className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold mb-2">Play Online</h3>
            <p className="text-sm text-muted-foreground">Find opponents and play live games</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('puzzles')}>
          <CardContent className="p-6 text-center">
            <Puzzle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Solve Puzzles</h3>
            <p className="text-sm text-muted-foreground">Improve your tactical skills</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('learn')}>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold mb-2">Learn</h3>
            <p className="text-sm text-muted-foreground">Study openings and strategies</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('tournaments')}>
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
            <h3 className="font-semibold mb-2">Tournaments</h3>
            <p className="text-sm text-muted-foreground">Compete with other players</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.rating}</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                <div className="text-sm text-muted-foreground">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.winRate}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.puzzleRating}</div>
                <div className="text-sm text-muted-foreground">Puzzle Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
                <div className="text-sm text-muted-foreground">Win Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.timeSpent}h</div>
                <div className="text-sm text-muted-foreground">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Games */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Games
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentGames.map((game, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{game.opponent}</div>
                  <div className="text-sm text-muted-foreground">
                    {game.rating} • {game.timeControl}
                  </div>
                </div>
                <Badge variant={game.result === 'win' ? 'default' : 'destructive'}>
                  {game.result}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}