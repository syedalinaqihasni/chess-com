/*
  # Games, Invites, and Match History Schema

  1. New Tables
    - `games` (updated)
      - `id` (uuid, primary key)
      - `white_player_id` (uuid, references profiles)
      - `black_player_id` (uuid, references profiles)
      - `fen` (text, current position)
      - `pgn` (text, game notation)
      - `status` (text: waiting, active, completed, abandoned)
      - `result` (text: white_wins, black_wins, draw, ongoing)
      - `time_control` (text)
      - `white_time_left` (integer, in seconds)
      - `black_time_left` (integer, in seconds)
      - `invite_code` (text, unique)
      - `is_private` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `completed_at` (timestamp)
    
    - `moves` (updated)
      - `id` (uuid, primary key)
      - `game_id` (uuid, references games)
      - `player_id` (uuid, references profiles)
      - `move_number` (integer)
      - `move_notation` (text)
      - `fen_after` (text)
      - `time_taken` (integer, in milliseconds)
      - `created_at` (timestamp)
    
    - `game_invites`
      - `id` (uuid, primary key)
      - `inviter_id` (uuid, references profiles)
      - `invitee_id` (uuid, references profiles, nullable)
      - `invite_code` (text, unique)
      - `time_control` (text)
      - `color_preference` (text: white, black, random)
      - `status` (text: pending, accepted, declined, expired)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Update games table
DROP TABLE IF EXISTS games CASCADE;
CREATE TABLE games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  white_player_id uuid REFERENCES profiles(id),
  black_player_id uuid REFERENCES profiles(id),
  fen text DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn text DEFAULT '',
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'abandoned')),
  result text DEFAULT 'ongoing' CHECK (result IN ('white_wins', 'black_wins', 'draw', 'ongoing')),
  time_control text NOT NULL,
  white_time_left integer,
  black_time_left integer,
  invite_code text UNIQUE,
  is_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Update moves table
DROP TABLE IF EXISTS moves CASCADE;
CREATE TABLE moves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  player_id uuid REFERENCES profiles(id),
  move_number integer NOT NULL,
  move_notation text NOT NULL,
  fen_after text NOT NULL,
  time_taken integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create game invites table
CREATE TABLE IF NOT EXISTS game_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  invite_code text UNIQUE NOT NULL,
  time_control text NOT NULL,
  color_preference text DEFAULT 'random' CHECK (color_preference IN ('white', 'black', 'random')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_invites ENABLE ROW LEVEL SECURITY;

-- Games policies
CREATE POLICY "Games are viewable by players and public games by everyone"
  ON games
  FOR SELECT
  USING (
    NOT is_private OR 
    white_player_id = auth.uid() OR 
    black_player_id = auth.uid()
  );

CREATE POLICY "Users can create games"
  ON games
  FOR INSERT
  TO authenticated
  WITH CHECK (
    white_player_id = auth.uid() OR 
    black_player_id = auth.uid()
  );

CREATE POLICY "Players can update their games"
  ON games
  FOR UPDATE
  TO authenticated
  USING (
    white_player_id = auth.uid() OR 
    black_player_id = auth.uid()
  );

-- Moves policies
CREATE POLICY "Moves are viewable by game players"
  ON moves
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM games 
      WHERE games.id = moves.game_id 
      AND (
        games.white_player_id = auth.uid() OR 
        games.black_player_id = auth.uid() OR
        NOT games.is_private
      )
    )
  );

CREATE POLICY "Players can insert moves in their games"
  ON moves
  FOR INSERT
  TO authenticated
  WITH CHECK (
    player_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM games 
      WHERE games.id = moves.game_id 
      AND (games.white_player_id = auth.uid() OR games.black_player_id = auth.uid())
    )
  );

-- Game invites policies
CREATE POLICY "Users can view invites they sent or received"
  ON game_invites
  FOR SELECT
  TO authenticated
  USING (
    inviter_id = auth.uid() OR 
    invitee_id = auth.uid() OR
    invitee_id IS NULL
  );

CREATE POLICY "Users can create invites"
  ON game_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (inviter_id = auth.uid());

CREATE POLICY "Users can update invites they received"
  ON game_invites
  FOR UPDATE
  TO authenticated
  USING (invitee_id = auth.uid() OR inviter_id = auth.uid());

-- Function to generate invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS text AS $$
BEGIN
  RETURN upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();