"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, Menu, Moon, Sun, User, LogOut, Settings, Share2, Trophy } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/components/providers/auth-provider';
import { AuthModal } from '@/components/auth/auth-modal';
import { InviteModal } from '@/components/invites/invite-modal';
import { toast } from 'sonner';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      <header className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                ChessHub
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost">Play Online</Button>
              <Button variant="ghost">Puzzles</Button>
              <Button variant="ghost">Learn</Button>
              <Button variant="ghost">Watch</Button>
              <Button variant="ghost">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </nav>

            <div className="flex items-center gap-2">
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInviteModal(true)}
                  className="hidden sm:flex"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Invite Friend
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium">
                          {user.user_metadata?.username || user.email?.split('@')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Rating: 1650
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <div className="font-medium">
                        {user.user_metadata?.username || user.email?.split('@')[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">Rating: 1650</Badge>
                        <Badge variant="outline">Rank: #1,234</Badge>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowInviteModal(true)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Invite Friend
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>
                  Sign In
                </Button>
              )}

              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <InviteModal 
        isOpen={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
      />
    </>
  );
}