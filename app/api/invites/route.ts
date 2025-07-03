import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: invites, error } = await supabase
      .from('game_invites')
      .select(`
        *,
        inviter:profiles!game_invites_inviter_id_fkey(username, rating, avatar_url),
        invitee:profiles!game_invites_invitee_id_fkey(username, rating, avatar_url)
      `)
      .or(`inviter_id.eq.${user.id},invitee_id.eq.${user.id},invitee_id.is.null`)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ invites });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch invites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { time_control, color_preference, invitee_username } = body;

    // Generate invite code
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    let inviteeId = null;
    if (invitee_username) {
      const { data: invitee } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', invitee_username)
        .single();
      
      if (invitee) {
        inviteeId = invitee.id;
      }
    }

    const { data: invite, error } = await supabase
      .from('game_invites')
      .insert({
        inviter_id: user.id,
        invitee_id: inviteeId,
        invite_code: inviteCode,
        time_control,
        color_preference: color_preference || 'random'
      })
      .select(`
        *,
        inviter:profiles!game_invites_inviter_id_fkey(username, rating, avatar_url)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      invite,
      invite_link: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteCode}`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create invite' },
      { status: 500 }
    );
  }
}