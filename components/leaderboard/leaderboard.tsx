"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  rating: number;
  games_played: number;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    country: string;
  };
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('overall');

  useEffect(() => {
    fetchLeaderboard();
  }, [category]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?category=${category}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        2: 'bg-gray-100 text-gray-800 border-gray-300',
        3: 'bg-orange-100 text-orange-800 border-orange-300'
      };
      return (
        <Badge className={colors[rank as keyof typeof colors]}>
          #{rank}
        </Badge>
      );
    }
    return <Badge variant="outline">#{rank}</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-600" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Top players ranked by rating
        </p>
      </div>

      <Tabs value={category} onValueChange={setCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="blitz">Blitz</TabsTrigger>
          <TabsTrigger value="rapid">Rapid</TabsTrigger>
          <TabsTrigger value="classical">Classical</TabsTrigger>
        </TabsList>

        <TabsContent value={category} className="space-y-4">
          {leaderboard.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No players found in this category</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* 2nd Place */}
                  <Card className="border-gray-300">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <Avatar className="w-16 h-16 mx-auto mb-2">
                          <AvatarImage src={leaderboard[1].user.avatar_url} />
                          <AvatarFallback>
                            {leaderboard[1].user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Medal className="h-8 w-8 mx-auto text-gray-400" />
                      </div>
                      <h3 className="font-semibold">{leaderboard[1].user.username}</h3>
                      <p className="text-2xl font-bold text-gray-600">{leaderboard[1].rating}</p>
                      <p className="text-sm text-muted-foreground">
                        {leaderboard[1].games_played} games
                      </p>
                    </CardContent>
                  </Card>

                  {/* 1st Place */}
                  <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <Avatar className="w-20 h-20 mx-auto mb-2">
                          <AvatarImage src={leaderboard[0].user.avatar_url} />
                          <AvatarFallback>
                            {leaderboard[0].user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Crown className="h-10 w-10 mx-auto text-yellow-500" />
                      </div>
                      <h3 className="font-semibold text-lg">{leaderboard[0].user.username}</h3>
                      <p className="text-3xl font-bold text-yellow-600">{leaderboard[0].rating}</p>
                      <p className="text-sm text-muted-foreground">
                        {leaderboard[0].games_played} games
                      </p>
                    </CardContent>
                  </Card>

                  {/* 3rd Place */}
                  <Card className="border-orange-300">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <Avatar className="w-16 h-16 mx-auto mb-2">
                          <AvatarImage src={leaderboard[2].user.avatar_url} />
                          <AvatarFallback>
                            {leaderboard[2].user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Award className="h-8 w-8 mx-auto text-orange-500" />
                      </div>
                      <h3 className="font-semibold">{leaderboard[2].user.username}</h3>
                      <p className="text-2xl font-bold text-orange-600">{leaderboard[2].rating}</p>
                      <p className="text-sm text-muted-foreground">
                        {leaderboard[2].games_played} games
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Full Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Full Rankings
                  </CardTitle>
                  <CardDescription>
                    Complete leaderboard for {category} category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 flex justify-center">
                            {getRankIcon(entry.rank)}
                          </div>
                          
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={entry.user.avatar_url} />
                            <AvatarFallback>
                              {entry.user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="font-semibold">{entry.user.username}</div>
                            {entry.user.full_name && (
                              <div className="text-sm text-muted-foreground">
                                {entry.user.full_name}
                              </div>
                            )}
                          </div>
                          
                          {entry.user.country && (
                            <Badge variant="outline" className="text-xs">
                              {entry.user.country}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold">{entry.rating}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.games_played} games
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}