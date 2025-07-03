"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Trophy, 
  TrendingUp, 
  Calendar,
  MapPin,
  Star,
  Target,
  Clock,
  Award
} from 'lucide-react';

interface UserProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  rating: number;
  country: string;
  bio: string;
  created_at: string;
  rank: number;
  user_stats: {
    games_played: number;
    games_won: number;
    games_lost: number;
    games_drawn: number;
    puzzle_rating: number;
    puzzles_solved: number;
    current_streak: number;
    best_streak: number;
    time_played: number;
  };
  rating_history: Array<{
    rating_before: number;
    rating_after: number;
    rating_change: number;
    created_at: string;
    category: string;
  }>;
  recent_games: Array<{
    id: string;
    result: string;
    time_control: string;
    created_at: string;
    completed_at: string;
    white_player: { username: string; rating: number };
    black_player: { username: string; rating: number };
  }>;
}

export function UserProfile({ username, isOwnProfile = false }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p className="text-muted-foreground">The user "{username}" does not exist.</p>
      </div>
    );
  }

  const winRate = profile.user_stats.games_played > 0 
    ? Math.round((profile.user_stats.games_won / profile.user_stats.games_played) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url} alt={profile.username} />
              <AvatarFallback className="text-2xl">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.username}</h1>
                  {profile.country && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {profile.country}
                    </Badge>
                  )}
                </div>
                {profile.full_name && (
                  <p className="text-lg text-muted-foreground">{profile.full_name}</p>
                )}
                {profile.bio && (
                  <p className="text-muted-foreground mt-2">{profile.bio}</p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.rating}</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">#{profile.rank || 'Unranked'}</div>
                  <div className="text-sm text-muted-foreground">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{profile.user_stats.games_played}</div>
                  <div className="text-sm text-muted-foreground">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{winRate}%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
              </div>
            </div>
            
            {isOwnProfile && (
              <Button>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="games">Recent Games</TabsTrigger>
          <TabsTrigger value="rating">Rating History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{profile.user_stats.games_won}</div>
                <div className="text-sm text-muted-foreground">Games Won</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{profile.user_stats.puzzle_rating}</div>
                <div className="text-sm text-muted-foreground">Puzzle Rating</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{profile.user_stats.current_streak}</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{Math.round(profile.user_stats.time_played / 60)}h</div>
                <div className="text-sm text-muted-foreground">Time Played</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Game Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Wins</span>
                      <span>{profile.user_stats.games_won}</span>
                    </div>
                    <Progress 
                      value={profile.user_stats.games_played > 0 ? (profile.user_stats.games_won / profile.user_stats.games_played) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Draws</span>
                      <span>{profile.user_stats.games_drawn}</span>
                    </div>
                    <Progress 
                      value={profile.user_stats.games_played > 0 ? (profile.user_stats.games_drawn / profile.user_stats.games_played) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Losses</span>
                      <span>{profile.user_stats.games_lost}</span>
                    </div>
                    <Progress 
                      value={profile.user_stats.games_played > 0 ? (profile.user_stats.games_lost / profile.user_stats.games_played) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Puzzle Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Puzzles Solved</span>
                    <span className="font-semibold">{profile.user_stats.puzzles_solved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Streak</span>
                    <span className="font-semibold">{profile.user_stats.best_streak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak</span>
                    <span className="font-semibold">{profile.user_stats.current_streak}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          {profile.recent_games.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No recent games found</p>
              </CardContent>
            </Card>
          ) : (
            profile.recent_games.map((game) => {
              const isWhite = game.white_player.username === profile.username;
              const opponent = isWhite ? game.black_player : game.white_player;
              const result = game.result;
              
              let resultBadge;
              if (result === 'draw') {
                resultBadge = <Badge variant="secondary">Draw</Badge>;
              } else if (
                (result === 'white_wins' && isWhite) || 
                (result === 'black_wins' && !isWhite)
              ) {
                resultBadge = <Badge variant="default" className="bg-green-600">Win</Badge>;
              } else {
                resultBadge = <Badge variant="destructive">Loss</Badge>;
              }

              return (
                <Card key={game.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-semibold">{opponent.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {opponent.rating} • {game.time_control}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {resultBadge}
                        <div className="text-sm text-muted-foreground">
                          {new Date(game.completed_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="rating" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Rating History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.rating_history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No rating history available
                </p>
              ) : (
                <div className="space-y-2">
                  {profile.rating_history.slice(0, 10).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {entry.rating_before} → {entry.rating_after}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge 
                        variant={entry.rating_change > 0 ? "default" : "destructive"}
                        className={entry.rating_change > 0 ? "bg-green-600" : ""}
                      >
                        {entry.rating_change > 0 ? '+' : ''}{entry.rating_change}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Award className="h-12 w-12 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold">First Victory</h3>
                    <p className="text-sm text-muted-foreground">Win your first game</p>
                    <Badge variant="secondary" className="mt-2">
                      {profile.user_stats.games_won > 0 ? 'Earned' : 'Locked'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Trophy className="h-12 w-12 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Century Club</h3>
                    <p className="text-sm text-muted-foreground">Play 100 games</p>
                    <Badge variant="secondary" className="mt-2">
                      {profile.user_stats.games_played >= 100 ? 'Earned' : `${profile.user_stats.games_played}/100`}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}