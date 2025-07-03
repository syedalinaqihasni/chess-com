"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Users, 
  Clock, 
  Calendar,
  Star,
  Medal,
  Target,
  Plus
} from 'lucide-react';

export function Tournaments() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);

  const activeTournaments = [
    {
      id: '1',
      name: 'Weekly Blitz Championship',
      type: 'Swiss',
      timeControl: '3+2',
      players: 156,
      maxPlayers: 200,
      prize: '$500',
      startTime: '2024-01-20T18:00:00Z',
      status: 'open',
      entryFee: '$5',
      rounds: 7
    },
    {
      id: '2',
      name: 'Rapid Arena',
      type: 'Arena',
      timeControl: '10+0',
      players: 89,
      maxPlayers: 100,
      prize: '$300',
      startTime: '2024-01-21T14:00:00Z',
      status: 'open',
      entryFee: 'Free',
      rounds: 'Unlimited'
    },
    {
      id: '3',
      name: 'Classical Masters',
      type: 'Round Robin',
      timeControl: '90+30',
      players: 8,
      maxPlayers: 8,
      prize: '$1000',
      startTime: '2024-01-22T16:00:00Z',
      status: 'full',
      entryFee: '$25',
      rounds: 7
    }
  ];

  const myTournaments = [
    {
      id: '1',
      name: 'Daily Puzzle Rush',
      position: 12,
      totalPlayers: 245,
      score: 1850,
      status: 'ongoing',
      timeLeft: '2h 15m'
    },
    {
      id: '2',
      name: 'Weekend Warrior',
      position: 3,
      totalPlayers: 128,
      score: 2100,
      status: 'completed',
      prize: '$50'
    },
    {
      id: '3',
      name: 'Blitz Battle',
      position: 45,
      totalPlayers: 200,
      score: 1650,
      status: 'completed',
      prize: null
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'ChessGrandmaster', rating: 2847, points: 2500, prize: '$200' },
    { rank: 2, name: 'TacticalGenius', rating: 2756, points: 2350, prize: '$100' },
    { rank: 3, name: 'EndgameExpert', rating: 2698, points: 2200, prize: '$50' },
    { rank: 4, name: 'OpeningMaster', rating: 2634, points: 2100, prize: null },
    { rank: 5, name: 'BlitzKing', rating: 2589, points: 2050, prize: null },
  ];

  const formatTimeUntilStart = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tournaments</h1>
        <p className="text-muted-foreground">
          Compete in tournaments and climb the leaderboards
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="my">My Tournaments</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeTournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {tournament.name}
                        <Badge variant={tournament.status === 'open' ? 'default' : 'secondary'}>
                          {tournament.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {tournament.type} • {tournament.timeControl} • {tournament.rounds} rounds
                      </CardDescription>
                    </div>
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Prize Pool</div>
                      <div className="font-semibold text-green-600">{tournament.prize}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Entry Fee</div>
                      <div className="font-semibold">{tournament.entryFee}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Players</div>
                      <div className="font-semibold">
                        {tournament.players}/{tournament.maxPlayers}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Starts In</div>
                      <div className="font-semibold">
                        {formatTimeUntilStart(tournament.startTime)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Registration</span>
                      <span>{tournament.players}/{tournament.maxPlayers}</span>
                    </div>
                    <Progress 
                      value={(tournament.players / tournament.maxPlayers) * 100} 
                      className="h-2"
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={tournament.status === 'full'}
                    onClick={() => setSelectedTournament(tournament.id)}
                  >
                    {tournament.status === 'full' ? 'Tournament Full' : 'Join Tournament'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {myTournaments.map((tournament) => (
              <Card key={tournament.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{tournament.name}</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Position</div>
                          <div className="font-semibold text-lg">
                            #{tournament.position}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Score</div>
                          <div className="font-semibold text-lg">
                            {tournament.score}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Players</div>
                          <div className="font-semibold text-lg">
                            {tournament.totalPlayers}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge 
                        variant={tournament.status === 'ongoing' ? 'default' : 'secondary'}
                        className="mb-2"
                      >
                        {tournament.status}
                      </Badge>
                      {tournament.status === 'ongoing' && (
                        <div className="text-sm text-muted-foreground">
                          {tournament.timeLeft} left
                        </div>
                      )}
                      {tournament.prize && (
                        <div className="text-sm font-semibold text-green-600">
                          Won: {tournament.prize}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5" />
                Monthly Leaderboard
              </CardTitle>
              <CardDescription>
                Top performers this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((player) => (
                  <div 
                    key={player.rank}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        player.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        player.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        player.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-muted'
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Rating: {player.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{player.points} pts</div>
                      {player.prize && (
                        <div className="text-sm text-green-600">{player.prize}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Tournament
              </CardTitle>
              <CardDescription>
                Organize your own chess tournament
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Tournament Creation</h3>
                <p className="text-muted-foreground mb-6">
                  Create custom tournaments with your own rules and settings
                </p>
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Tournament
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}