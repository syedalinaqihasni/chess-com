import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  
  try {
    const body = await request.json();
    const { move, fen, player_id } = body;
    const gameId = params.id;

    // Add move to moves table
    const { error: moveError } = await supabase
      .from('moves')
      .insert({
        game_id: gameId,
        player_id,
        move_notation: move,
        fen_after: fen
      });

    if (moveError) throw moveError;

    // Update game with new FEN
    const { error: gameError } = await supabase
      .from('games')
      .update({ 
        fen,
        updated_at: new Date().toISOString()
      })
      .eq('id', gameId);

    if (gameError) throw gameError;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save move' },
      { status: 500 }
    );
  }
}