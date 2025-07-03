"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Play, 
  Puzzle, 
  BookOpen, 
  Eye, 
  Trophy,
  Settings,
  User,
  Crown,
  Share2
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'play', label: 'Play Online', icon: Play },
  { id: 'puzzles', label: 'Puzzles', icon: Puzzle },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'watch', label: 'Watch', icon: Eye },
  { id: 'tournaments', label: 'Tournaments', icon: Trophy },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-card border-r border-border h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              activeSection === item.id && "bg-primary text-primary-foreground"
            )}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
            {item.id === 'tournaments' && (
              <Badge variant="secondary" className="ml-auto text-xs">
                New
              </Badge>
            )}
          </Button>
        ))}
        
        <div className="pt-4 mt-4 border-t border-border space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3"
            onClick={() => onSectionChange('leaderboard')}
          >
            <Crown className="h-5 w-5" />
            Leaderboard
          </Button>
          
          {user && (
            <>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3"
                onClick={() => onSectionChange('profile')}
              >
                <User className="h-5 w-5" />
                My Profile
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3"
                onClick={() => onSectionChange('invites')}
              >
                <Share2 className="h-5 w-5" />
                Invites
                <Badge variant="destructive" className="ml-auto text-xs">
                  2
                </Badge>
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3"
            onClick={() => onSectionChange('settings')}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Button>
        </div>

        {user && (
          <div className="pt-4 mt-4 border-t border-border">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">Your Rating</div>
              <div className="text-2xl font-bold text-blue-600">1650</div>
              <div className="text-xs text-muted-foreground">
                Rank: #1,234 globally
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}