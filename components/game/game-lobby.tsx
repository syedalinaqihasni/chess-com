"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Zap, Trophy, Play } from 'lucide-react';

interface GameLobbyProps {
  onJoinGame: (gameId: string) => void;
}

export function GameLobby({ onJoinGame }: GameLobbyProps) {
  const [selectedTimeControl, setSelectedTimeControl] = useState('10+0');

  const timeControls = [
    { id: '1+0', label: '1 min', icon: Zap },
    { id: '3+0', label: '3 min', icon: Zap },
    { id: '5+0', label: '5 min', icon: Clock },
    { id: '10+0', label: '10 min', icon: Clock },
    { id: '15+10', label: '15+10', icon: Clock },
    { id: '30+0', label: '30 min', icon: Clock },
  ];

  const onlineGames = [
    {
      id: '1',
      player: 'ChessMaster2024',
      rating: 1847,
      timeControl: '10+0',
      color: 'random',
    },
    {
      id: '2',
      player: 'QueenGambit',
      rating: 1623,
      timeControl: '5+0',
      color: 'white',
    },
    {
      id: '3',
      player: 'RookiePlayer',
      rating: 1456,
      timeControl: '15+10',
      color: 'black',
    },
  ];

  const handleQuickPlay = () => {
    // Generate a mock game ID
    const gameId = `game-${Date.now()}`;
    onJoinGame(gameId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Play Chess Online</h1>
        <p className="text-xl text-muted-foreground">
          Join millions of players worldwide in the ultimate chess experience
        </p>
      </div>

      <Tabs defaultValue="play" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="play">Quick Play</TabsTrigger>
          <TabsTrigger value="lobby">Game Lobby</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        </TabsList>

        <TabsContent value="play" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Quick Play
              </CardTitle>
              <CardDescription>
                Jump into a game instantly with players of similar skill
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Time Control</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {timeControls.map((control) => (
                    <Button
                      key={control.id}
                      variant={selectedTimeControl === control.id ? "default" : "outline"}
                      className="h-16 flex flex-col items-center gap-1"
                      onClick={() => setSelectedTimeControl(control.id)}
                    >
                      <control.icon className="h-4 w-4" />
                      <span className="text-sm">{control.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1" onClick={handleQuickPlay}>
                  Play Now
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  Play vs Computer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lobby" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Available Games
              </CardTitle>
              <CardDescription>
                Join an existing game or create your own
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onlineGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {game.player[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{game.player}</div>
                        <div className="text-sm text-muted-foreground">
                          Rating: {game.rating}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{game.timeControl}</Badge>
                      <Badge variant="outline">{game.color}</Badge>
                      <Button onClick={() => onJoinGame(game.id)}>
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Tournaments
              </CardTitle>
              <CardDescription>
                Compete in official tournaments and climb the leaderboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Tournament features are currently in development
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}