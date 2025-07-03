import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const supabase = createClient();
  
  try {
    const { data: invite, error } = await supabase
      .from('game_invites')
      .select(`
        *,
        inviter:profiles!game_invites_inviter_id_fkey(username, rating, avatar_url, country)
      `)
      .eq('invite_code', params.code)
      .eq('status', 'pending')
      .single();

    if (error || !invite) {
      return NextResponse.json({ error: 'Invite not found or expired' }, { status: 404 });
    }

    // Check if invite is expired
    if (new Date(invite.expires_at) < new Date()) {
      await supabase
        .from('game_invites')
        .update({ status: 'expired' })
        .eq('id', invite.id);
      
      return NextResponse.json({ error: 'Invite has expired' }, { status: 410 });
    }

    return NextResponse.json({ invite });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch invite' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const supabase = createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body; // 'accept' or 'decline'

    // Get the invite
    const { data: invite, error: inviteError } = await supabase
      .from('game_invites')
      .select('*')
      .eq('invite_code', params.code)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    // Check if user is trying to accept their own invite
    if (invite.inviter_id === user.id) {
      return NextResponse.json({ error: 'Cannot accept your own invite' }, { status: 400 });
    }

    if (action === 'accept') {
      // Update invite status
      await supabase
        .from('game_invites')
        .update({ 
          status: 'accepted',
          invitee_id: user.id
        })
        .eq('id', invite.id);

      // Determine player colors
      let whitePlayerId, blackPlayerId;
      
      if (invite.color_preference === 'white') {
        whitePlayerId = invite.inviter_id;
        blackPlayerId = user.id;
      } else if (invite.color_preference === 'black') {
        whitePlayerId = user.id;
        blackPlayerId = invite.inviter_id;
      } else {
        // Random assignment
        const random = Math.random() > 0.5;
        whitePlayerId = random ? invite.inviter_id : user.id;
        blackPlayerId = random ? user.id : invite.inviter_id;
      }

      // Parse time control
      const [initialTime, increment] = invite.time_control.split('+').map(Number);
      const timeInSeconds = initialTime * 60;

      // Create the game
      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert({
          white_player_id: whitePlayerId,
          black_player_id: blackPlayerId,
          time_control: invite.time_control,
          white_time_left: timeInSeconds,
          black_time_left: timeInSeconds,
          status: 'active',
          invite_code: invite.invite_code
        })
        .select()
        .single();

      if (gameError) throw gameError;

      return NextResponse.json({ 
        message: 'Invite accepted',
        game,
        redirect: `/game/${game.id}`
      });
    } else if (action === 'decline') {
      await supabase
        .from('game_invites')
        .update({ 
          status: 'declined',
          invitee_id: user.id
        })
        .eq('id', invite.id);

      return NextResponse.json({ message: 'Invite declined' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process invite' },
      { status: 500 }
    );
  }
}