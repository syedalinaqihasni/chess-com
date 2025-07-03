"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  Star, 
  Clock, 
  ChevronRight,
  Trophy,
  Target,
  Zap
} from 'lucide-react';

export function Learn() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses = [
    {
      id: 'beginner',
      title: 'Chess Fundamentals',
      description: 'Learn the basics of chess from piece movement to basic tactics',
      level: 'Beginner',
      lessons: 12,
      duration: '2 hours',
      progress: 75,
      color: 'green'
    },
    {
      id: 'openings',
      title: 'Opening Principles',
      description: 'Master the most important opening principles and popular openings',
      level: 'Intermediate',
      lessons: 18,
      duration: '3 hours',
      progress: 45,
      color: 'blue'
    },
    {
      id: 'tactics',
      title: 'Tactical Patterns',
      description: 'Learn essential tactical motifs like pins, forks, and skewers',
      level: 'Intermediate',
      lessons: 24,
      duration: '4 hours',
      progress: 20,
      color: 'purple'
    },
    {
      id: 'endgame',
      title: 'Endgame Mastery',
      description: 'Study crucial endgame positions and techniques',
      level: 'Advanced',
      lessons: 30,
      duration: '5 hours',
      progress: 0,
      color: 'orange'
    }
  ];

  const lessons = [
    { id: 1, title: 'How Pieces Move', completed: true, duration: '10 min' },
    { id: 2, title: 'Special Moves', completed: true, duration: '15 min' },
    { id: 3, title: 'Check and Checkmate', completed: true, duration: '12 min' },
    { id: 4, title: 'Basic Tactics', completed: false, duration: '18 min' },
    { id: 5, title: 'Opening Principles', completed: false, duration: '20 min' },
  ];

  const achievements = [
    { title: 'First Steps', description: 'Complete your first lesson', earned: true },
    { title: 'Tactical Genius', description: 'Solve 100 tactical puzzles', earned: true },
    { title: 'Opening Expert', description: 'Master 5 different openings', earned: false },
    { title: 'Endgame Wizard', description: 'Complete endgame course', earned: false },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Learn Chess</h1>
        <p className="text-muted-foreground">
          Master chess with structured courses and interactive lessons
        </p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="lessons">My Lessons</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {course.title}
                        <Badge variant="secondary">{course.level}</Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {course.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <Button className="w-full" onClick={() => setSelectedCourse(course.id)}>
                    {course.progress > 0 ? 'Continue' : 'Start Course'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Lessons</CardTitle>
              <CardDescription>
                Continue where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        lesson.completed 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                          : 'bg-muted'
                      }`}>
                        {lesson.completed ? '✓' : lesson.id}
                      </div>
                      <div>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-sm text-muted-foreground">{lesson.duration}</div>
                      </div>
                    </div>
                    <Button variant={lesson.completed ? "outline" : "default"} size="sm">
                      {lesson.completed ? 'Review' : 'Start'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className={achievement.earned ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.earned 
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' 
                        : 'bg-muted'
                    }`}>
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge variant="secondary" className="mt-2">Earned</Badge>
                      )}
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