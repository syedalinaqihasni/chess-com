import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const { data: games, error } = await supabase
      .from('games')
      .select(`
        *,
        white_player:profiles!games_white_player_id_fkey(username, rating),
        black_player:profiles!games_black_player_id_fkey(username, rating)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ games });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const body = await request.json();
    const { white_player_id, black_player_id, time_control, fen } = body;

    const { data: game, error } = await supabase
      .from('games')
      .insert({
        white_player_id,
        black_player_id,
        time_control,
        fen: fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ game });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}