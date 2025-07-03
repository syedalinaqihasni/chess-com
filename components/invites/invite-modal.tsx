"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Copy, Share2, User, Clock, Palette } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [timeControl, setTimeControl] = useState('10+0');
  const [colorPreference, setColorPreference] = useState('random');
  const [inviteeUsername, setInviteeUsername] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const timeControls = [
    { value: '1+0', label: '1 minute' },
    { value: '3+0', label: '3 minutes' },
    { value: '5+0', label: '5 minutes' },
    { value: '10+0', label: '10 minutes' },
    { value: '15+10', label: '15+10' },
    { value: '30+0', label: '30 minutes' },
  ];

  const handleCreateInvite = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time_control: timeControl,
          color_preference: colorPreference,
          invitee_username: inviteeUsername || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInviteLink(data.invite_link);
        toast.success('Invite created successfully!');
      } else {
        throw new Error('Failed to create invite');
      }
    } catch (error) {
      toast.error('Failed to create invite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Chess Game Invite',
        text: 'Join me for a chess game!',
        url: inviteLink,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-md mx-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Create Game Invite
            </CardTitle>
            <CardDescription>
              Invite a friend to play chess with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!inviteLink ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Invite Specific Player (Optional)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="Enter username"
                      className="pl-10"
                      value={inviteeUsername}
                      onChange={(e) => setInviteeUsername(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to create a public invite link
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Control
                  </Label>
                  <Select value={timeControl} onValueChange={setTimeControl}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeControls.map((control) => (
                        <SelectItem key={control.value} value={control.value}>
                          {control.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color Preference
                  </Label>
                  <RadioGroup value={colorPreference} onValueChange={setColorPreference}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="random" id="random" />
                      <Label htmlFor="random">Random</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="white" id="white" />
                      <Label htmlFor="white">Play as White</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="black" id="black" />
                      <Label htmlFor="black">Play as Black</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateInvite} 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Invite'}
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-600 mb-2">
                      Invite Created Successfully!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Share this link with your opponent
                    </p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-mono break-all">{inviteLink}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCopyLink} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button onClick={handleShare} variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <Button variant="outline" onClick={onClose} className="w-full">
                  Close
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}