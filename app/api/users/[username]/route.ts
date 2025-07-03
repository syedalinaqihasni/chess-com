import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const supabase = createClient();
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_stats(*),
        rating_history(
          rating_before,
          rating_after,
          rating_change,
          created_at,
          category
        )
      `)
      .eq('username', params.username)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's recent games
    const { data: recentGames, error: gamesError } = await supabase
      .from('games')
      .select(`
        id,
        result,
        time_control,
        created_at,
        completed_at,
        white_player:profiles!games_white_player_id_fkey(username, rating),
        black_player:profiles!games_black_player_id_fkey(username, rating)
      `)
      .or(`white_player_id.eq.${profile.id},black_player_id.eq.${profile.id}`)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(10);

    // Get user's rank
    const { data: rankData } = await supabase.rpc('get_user_rank', {
      user_uuid: profile.id,
      category_name: 'overall'
    });

    return NextResponse.json({ 
      profile: {
        ...profile,
        rank: rankData || 0,
        recent_games: recentGames || []
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}