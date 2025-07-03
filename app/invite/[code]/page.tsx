"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers/auth-provider';
import { AuthModal } from '@/components/auth/auth-modal';
import { toast } from 'sonner';
import { Clock, User, Palette, CheckCircle, XCircle } from 'lucide-react';

interface GameInvite {
  id: string;
  invite_code: string;
  time_control: string;
  color_preference: string;
  status: string;
  expires_at: string;
  created_at: string;
  inviter: {
    username: string;
    rating: number;
    avatar_url: string;
    country: string;
  };
}

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [invite, setInvite] = useState<GameInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvite();
  }, [params.code]);

  const fetchInvite = async () => {
    try {
      const response = await fetch(`/api/invites/${params.code}`);
      const data = await response.json();
      
      if (response.ok) {
        setInvite(data.invite);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to load invite');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/invites/${params.code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'accept' }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Invite accepted! Starting game...');
        router.push(data.redirect);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to accept invite');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeclineInvite = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/invites/${params.code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'decline' }),
      });

      if (response.ok) {
        toast.success('Invite declined');
        router.push('/');
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to decline invite');
    } finally {
      setProcessing(false);
    }
  };

  const getColorPreferenceText = (preference: string) => {
    switch (preference) {
      case 'white':
        return 'Inviter plays White';
      case 'black':
        return 'Inviter plays Black';
      default:
        return 'Random colors';
    }
  };

  const isExpired = invite && new Date(invite.expires_at) < new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-64 w-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Invite Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'This invite link is invalid or has expired.'}
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Invite Expired</h2>
            <p className="text-muted-foreground mb-4">
              This invite has expired and is no longer valid.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Chess Game Invite</CardTitle>
          <CardDescription>
            You've been invited to play chess!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inviter Info */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={invite.inviter.avatar_url} />
              <AvatarFallback>
                {invite.inviter.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">{invite.inviter.username}</div>
              <div className="text-sm text-muted-foreground">
                Rating: {invite.inviter.rating}
              </div>
              {invite.inviter.country && (
                <Badge variant="outline" className="text-xs mt-1">
                  {invite.inviter.country}
                </Badge>
              )}
            </div>
          </div>

          {/* Game Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>Time Control: <strong>{invite.time_control}</strong></span>
            </div>
            
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <span>{getColorPreferenceText(invite.color_preference)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>Invited by: <strong>{invite.inviter.username}</strong></span>
            </div>
          </div>

          {/* Expiry Info */}
          <div className="text-sm text-muted-foreground text-center">
            Expires: {new Date(invite.expires_at).toLocaleString()}
          </div>

          {/* Action Buttons */}
          {user ? (
            <div className="flex gap-3">
              <Button 
                onClick={handleAcceptInvite} 
                className="flex-1"
                disabled={processing}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {processing ? 'Accepting...' : 'Accept'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDeclineInvite}
                disabled={processing}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                You need to sign in to accept this invite
              </p>
              <Button onClick={() => setShowAuthModal(true)} className="w-full">
                Sign In to Play
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}