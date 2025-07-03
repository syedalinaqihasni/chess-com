import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { result, pgn } = body; // result: 'white_wins', 'black_wins', 'draw'
    const gameId = params.id;

    // Get game details
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // Verify user is part of this game
    if (game.white_player_id !== user.id && game.black_player_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update game status
    const { error: updateError } = await supabase
      .from('games')
      .update({
        status: 'completed',
        result,
        pgn,
        completed_at: new Date().toISOString()
      })
      .eq('id', gameId);

    if (updateError) throw updateError;

    // Calculate rating changes
    let whiteResult, blackResult;
    switch (result) {
      case 'white_wins':
        whiteResult = 1;
        blackResult = 0;
        break;
      case 'black_wins':
        whiteResult = 0;
        blackResult = 1;
        break;
      case 'draw':
        whiteResult = 0.5;
        blackResult = 0.5;
        break;
      default:
        throw new Error('Invalid result');
    }

    // Update ratings using the database function
    const { error: ratingError } = await supabase.rpc('update_ratings_after_game', {
      game_uuid: gameId,
      white_result: whiteResult,
      black_result: blackResult
    });

    if (ratingError) {
      console.error('Rating update error:', ratingError);
      // Don't fail the request if rating update fails
    }

    // Update user stats
    const updateStats = async (playerId: string, won: boolean, drawn: boolean) => {
      const { error } = await supabase.rpc('increment', {
        table_name: 'user_stats',
        column_name: won ? 'games_won' : drawn ? 'games_drawn' : 'games_lost',
        row_id: playerId
      });
      
      await supabase.rpc('increment', {
        table_name: 'user_stats',
        column_name: 'games_played',
        row_id: playerId
      });
    };

    // Update stats for both players
    if (result === 'white_wins') {
      await updateStats(game.white_player_id, true, false);
      await updateStats(game.black_player_id, false, false);
    } else if (result === 'black_wins') {
      await updateStats(game.white_player_id, false, false);
      await updateStats(game.black_player_id, true, false);
    } else {
      await updateStats(game.white_player_id, false, true);
      await updateStats(game.black_player_id, false, true);
    }

    return NextResponse.json({ 
      message: 'Game completed successfully',
      result 
    });
  } catch (error) {
    console.error('Game completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete game' },
      { status: 500 }
    );
  }
}