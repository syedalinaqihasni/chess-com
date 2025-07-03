"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Eye, 
  Users, 
  Clock, 
  Star,
  Calendar,
  Tv
} from 'lucide-react';

export function Watch() {
  const liveGames = [
    {
      id: '1',
      white: { name: 'Magnus Carlsen', rating: 2830, title: 'GM' },
      black: { name: 'Fabiano Caruana', rating: 2804, title: 'GM' },
      timeControl: '90+30',
      viewers: 15420,
      event: 'World Championship',
      status: 'live'
    },
    {
      id: '2',
      white: { name: 'Hikaru Nakamura', rating: 2736, title: 'GM' },
      black: { name: 'Alireza Firouzja', rating: 2759, title: 'GM' },
      timeControl: '15+10',
      viewers: 8930,
      event: 'Speed Chess Championship',
      status: 'live'
    },
    {
      id: '3',
      white: { name: 'Ding Liren', rating: 2788, title: 'GM' },
      black: { name: 'Ian Nepomniachtchi', rating: 2771, title: 'GM' },
      timeControl: '180+0',
      viewers: 12340,
      event: 'Candidates Tournament',
      status: 'live'
    }
  ];

  const streamers = [
    {
      id: '1',
      name: 'GothamChess',
      title: 'IM',
      viewers: 25600,
      category: 'Educational',
      thumbnail: 'https://images.pexels.com/photos/6111616/pexels-photo-6111616.jpeg?auto=compress&cs=tinysrgb&w=400',
      isLive: true
    },
    {
      id: '2',
      name: 'ChessNetwork',
      title: 'NM',
      viewers: 8900,
      category: 'Analysis',
      thumbnail: 'https://images.pexels.com/photos/6111616/pexels-photo-6111616.jpeg?auto=compress&cs=tinysrgb&w=400',
      isLive: true
    },
    {
      id: '3',
      name: 'Saint Louis Chess Club',
      title: 'Official',
      viewers: 15200,
      category: 'Tournament',
      thumbnail: 'https://images.pexels.com/photos/6111616/pexels-photo-6111616.jpeg?auto=compress&cs=tinysrgb&w=400',
      isLive: true
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'World Chess Championship',
      date: '2024-04-15',
      time: '14:00 UTC',
      participants: ['Magnus Carlsen', 'Ding Liren'],
      prize: '$2,000,000'
    },
    {
      id: '2',
      title: 'Candidates Tournament',
      date: '2024-04-20',
      time: '15:00 UTC',
      participants: ['8 Top Players'],
      prize: '$500,000'
    },
    {
      id: '3',
      title: 'Speed Chess Championship',
      date: '2024-04-25',
      time: '18:00 UTC',
      participants: ['Hikaru Nakamura', 'Alireza Firouzja'],
      prize: '$100,000'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Watch Chess</h1>
        <p className="text-muted-foreground">
          Watch live games, streams, and tournaments from top players
        </p>
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">Live Games</TabsTrigger>
          <TabsTrigger value="streams">Streams</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {liveGames.map((game) => (
              <Card key={game.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="destructive" className="animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                          LIVE
                        </Badge>
                        <Badge variant="outline">{game.event}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {game.viewers.toLocaleString()} viewers
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="text-center">
                          <div className="font-semibold text-lg">{game.white.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {game.white.title} • {game.white.rating}
                          </div>
                          <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-full mx-auto mt-2"></div>
                        </div>

                        <div className="text-center">
                          <div className="font-semibold text-lg">{game.black.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {game.black.title} • {game.black.rating}
                          </div>
                          <div className="w-8 h-8 bg-gray-800 rounded-full mx-auto mt-2"></div>
                        </div>
                      </div>

                      <div className="text-center mt-4">
                        <div className="text-sm text-muted-foreground">
                          Time Control: {game.timeControl}
                        </div>
                      </div>
                    </div>

                    <Button size="lg" className="ml-6">
                      <Play className="h-4 w-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="streams" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streamers.map((streamer) => (
              <Card key={streamer.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={streamer.thumbnail} 
                    alt={streamer.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {streamer.isLive && (
                    <Badge variant="destructive" className="absolute top-2 left-2 animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      LIVE
                    </Badge>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    <Users className="h-3 w-3 inline mr-1" />
                    {streamer.viewers.toLocaleString()}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{streamer.name}</h3>
                      <Badge variant="outline">{streamer.title}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{streamer.category}</p>
                    <Button className="w-full">
                      <Tv className="h-4 w-4 mr-2" />
                      Watch Stream
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <Badge variant="secondary">
                          Prize: {event.prize}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">Participants:</div>
                        <div className="text-sm text-muted-foreground">
                          {Array.isArray(event.participants) 
                            ? event.participants.join(' vs ') 
                            : event.participants}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button>
                        <Star className="h-4 w-4 mr-2" />
                        Set Reminder
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}