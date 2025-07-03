import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'overall';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  try {
    const { data: leaderboard, error } = await supabase
      .from('leaderboards')
      .select(`
        rank,
        rating,
        games_played,
        user:profiles!leaderboards_user_id_fkey(
          id,
          username,
          full_name,
          avatar_url,
          country
        )
      `)
      .eq('category', category)
      .order('rank', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ leaderboard, category });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const body = await request.json();
    const { category } = body;

    // Refresh leaderboard for specific category
    const { error } = await supabase.rpc('refresh_leaderboards', {
      category_name: category || 'overall'
    });

    if (error) throw error;

    return NextResponse.json({ message: 'Leaderboard refreshed successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to refresh leaderboard' },
      { status: 500 }
    );
  }
}