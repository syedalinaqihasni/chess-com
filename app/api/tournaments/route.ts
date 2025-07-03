import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'upcoming';
  
  try {
    const { data: tournaments, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        tournament_participants(count)
      `)
      .eq('status', status)
      .order('start_time', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ tournaments });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      type, 
      time_control, 
      max_participants, 
      entry_fee, 
      prize_pool,
      start_time 
    } = body;

    const { data: tournament, error } = await supabase
      .from('tournaments')
      .insert({
        name,
        description,
        type,
        time_control,
        max_participants,
        entry_fee,
        prize_pool,
        start_time,
        status: 'upcoming'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ tournament });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    );
  }
}