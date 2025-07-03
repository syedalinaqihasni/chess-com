import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { Chess } from 'chess.js';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const body = await request.json();
    const { pgn, user_id } = body;

    // Parse PGN
    const game = new Chess();
    const isValid = game.loadPgn(pgn);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid PGN format' },
        { status: 400 }
      );
    }

    // Extract game information
    const header = game.header();
    const moves = game.history();
    const fen = game.fen();

    // Save to database
    const { data: savedGame, error } = await supabase
      .from('imported_games')
      .insert({
        user_id,
        pgn,
        white_player: header.White || 'Unknown',
        black_player: header.Black || 'Unknown',
        result: header.Result || '*',
        date: header.Date || new Date().toISOString().split('T')[0],
        event: header.Event || 'Imported Game',
        moves: moves,
        final_fen: fen
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      game: savedGame,
      message: 'Game imported successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to import game' },
      { status: 500 }
    );
  }
}