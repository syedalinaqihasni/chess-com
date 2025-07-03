import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get('difficulty');
  const theme = searchParams.get('theme');
  
  try {
    let query = supabase
      .from('puzzles')
      .select('*')
      .order('rating', { ascending: true });

    if (difficulty) {
      const ratingRange = {
        'beginner': [800, 1200],
        'intermediate': [1200, 1600],
        'advanced': [1600, 2000],
        'expert': [2000, 2400]
      }[difficulty];
      
      if (ratingRange) {
        query = query.gte('rating', ratingRange[0]).lte('rating', ratingRange[1]);
      }
    }

    if (theme) {
      query = query.eq('theme', theme);
    }

    const { data: puzzles, error } = await query.limit(50);

    if (error) throw error;

    return NextResponse.json({ puzzles });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch puzzles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const body = await request.json();
    const { fen, solution, rating, theme, description } = body;

    const { data: puzzle, error } = await supabase
      .from('puzzles')
      .insert({
        fen,
        solution,
        rating,
        theme,
        description
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ puzzle });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create puzzle' },
      { status: 500 }
    );
  }
}