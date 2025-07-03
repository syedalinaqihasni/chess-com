"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Dashboard } from '@/components/dashboard/dashboard';
import { PlayOnline } from '@/components/play/play-online';
import { Puzzles } from '@/components/puzzles/puzzles';
import { Learn } from '@/components/learn/learn';
import { Watch } from '@/components/watch/watch';
import { Tournaments } from '@/components/tournaments/tournaments';
import { Leaderboard } from '@/components/leaderboard/leaderboard';
import { UserProfile } from '@/components/profile/user-profile';
import { GameProvider } from '@/components/providers/game-provider';
import { useAuth } from '@/components/providers/auth-provider';

type ActiveSection = 'dashboard' | 'play' | 'puzzles' | 'learn' | 'watch' | 'tournaments' | 'leaderboard' | 'profile' | 'invites' | 'settings';

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'play':
        return <PlayOnline />;
      case 'puzzles':
        return <Puzzles />;
      case 'learn':
        return <Learn />;
      case 'watch':
        return <Watch />;
      case 'tournaments':
        return <Tournaments />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return user ? (
          <UserProfile 
            username={user.user_metadata?.username || user.email?.split('@')[0] || ''} 
            isOwnProfile={true} 
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Please sign in to view your profile</p>
          </div>
        );
      case 'invites':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Game Invites</h1>
            <p className="text-muted-foreground">Invite management coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </GameProvider>
  );
}