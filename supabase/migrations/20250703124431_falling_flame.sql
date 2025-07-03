/*
  # Rankings and Leaderboards Schema

  1. New Tables
    - `rating_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `rating_before` (integer)
      - `rating_after` (integer)
      - `rating_change` (integer)
      - `game_id` (uuid, references games)
      - `created_at` (timestamp)
    
    - `leaderboards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `category` (text: overall, blitz, rapid, classical, puzzle)
      - `rating` (integer)
      - `rank` (integer)
      - `games_played` (integer)
      - `updated_at` (timestamp)

  2. Functions
    - Calculate ELO rating changes
    - Update leaderboards
    - Get user rankings

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create rating history table
CREATE TABLE IF NOT EXISTS rating_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating_before integer NOT NULL,
  rating_after integer NOT NULL,
  rating_change integer NOT NULL,
  game_id uuid REFERENCES games(id),
  category text DEFAULT 'overall' CHECK (category IN ('overall', 'blitz', 'rapid', 'classical', 'puzzle')),
  created_at timestamptz DEFAULT now()
);

-- Create leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('overall', 'blitz', 'rapid', 'classical', 'puzzle')),
  rating integer NOT NULL,
  rank integer,
  games_played integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Enable RLS
ALTER TABLE rating_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

-- Rating history policies
CREATE POLICY "Rating history is viewable by everyone"
  ON rating_history
  FOR SELECT
  USING (true);

CREATE POLICY "System can insert rating history"
  ON rating_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Leaderboards policies
CREATE POLICY "Leaderboards are viewable by everyone"
  ON leaderboards
  FOR SELECT
  USING (true);

CREATE POLICY "System can manage leaderboards"
  ON leaderboards
  FOR ALL
  TO authenticated
  USING (true);

-- Function to calculate ELO rating change
CREATE OR REPLACE FUNCTION calculate_elo_change(
  player_rating integer,
  opponent_rating integer,
  result numeric, -- 1 for win, 0.5 for draw, 0 for loss
  k_factor integer DEFAULT 32
)
RETURNS integer AS $$
DECLARE
  expected_score numeric;
  rating_change integer;
BEGIN
  -- Calculate expected score using ELO formula
  expected_score := 1.0 / (1.0 + power(10.0, (opponent_rating - player_rating) / 400.0));
  
  -- Calculate rating change
  rating_change := round(k_factor * (result - expected_score));
  
  RETURN rating_change;
END;
$$ LANGUAGE plpgsql;

-- Function to update ratings after a game
CREATE OR REPLACE FUNCTION update_ratings_after_game(
  game_uuid uuid,
  white_result numeric,
  black_result numeric
)
RETURNS void AS $$
DECLARE
  game_record games%ROWTYPE;
  white_profile profiles%ROWTYPE;
  black_profile profiles%ROWTYPE;
  white_rating_change integer;
  black_rating_change integer;
  game_category text;
BEGIN
  -- Get game details
  SELECT * INTO game_record FROM games WHERE id = game_uuid;
  
  -- Get player profiles
  SELECT * INTO white_profile FROM profiles WHERE id = game_record.white_player_id;
  SELECT * INTO black_profile FROM profiles WHERE id = game_record.black_player_id;
  
  -- Determine game category based on time control
  IF game_record.time_control LIKE '%+%' THEN
    IF split_part(game_record.time_control, '+', 1)::integer < 3 THEN
      game_category := 'blitz';
    ELSIF split_part(game_record.time_control, '+', 1)::integer < 15 THEN
      game_category := 'rapid';
    ELSE
      game_category := 'classical';
    END IF;
  ELSE
    game_category := 'overall';
  END IF;
  
  -- Calculate rating changes
  white_rating_change := calculate_elo_change(white_profile.rating, black_profile.rating, white_result);
  black_rating_change := calculate_elo_change(black_profile.rating, white_profile.rating, black_result);
  
  -- Update player ratings
  UPDATE profiles 
  SET rating = rating + white_rating_change 
  WHERE id = game_record.white_player_id;
  
  UPDATE profiles 
  SET rating = rating + black_rating_change 
  WHERE id = game_record.black_player_id;
  
  -- Record rating history
  INSERT INTO rating_history (user_id, rating_before, rating_after, rating_change, game_id, category)
  VALUES 
    (game_record.white_player_id, white_profile.rating, white_profile.rating + white_rating_change, white_rating_change, game_uuid, game_category),
    (game_record.black_player_id, black_profile.rating, black_profile.rating + black_rating_change, black_rating_change, game_uuid, game_category);
  
  -- Update leaderboards
  PERFORM refresh_leaderboards(game_category);
END;
$$ LANGUAGE plpgsql;

-- Function to refresh leaderboards
CREATE OR REPLACE FUNCTION refresh_leaderboards(category_name text DEFAULT 'overall')
RETURNS void AS $$
BEGIN
  -- Delete existing leaderboard entries for this category
  DELETE FROM leaderboards WHERE category = category_name;
  
  -- Insert updated leaderboard
  INSERT INTO leaderboards (user_id, category, rating, rank, games_played)
  SELECT 
    p.id,
    category_name,
    p.rating,
    ROW_NUMBER() OVER (ORDER BY p.rating DESC),
    COALESCE(us.games_played, 0)
  FROM profiles p
  LEFT JOIN user_stats us ON p.id = us.user_id
  WHERE p.rating > 0
  ORDER BY p.rating DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user rank
CREATE OR REPLACE FUNCTION get_user_rank(user_uuid uuid, category_name text DEFAULT 'overall')
RETURNS integer AS $$
DECLARE
  user_rank integer;
BEGIN
  SELECT rank INTO user_rank 
  FROM leaderboards 
  WHERE user_id = user_uuid AND category = category_name;
  
  RETURN COALESCE(user_rank, 0);
END;
$$ LANGUAGE plpgsql;

-- Initialize leaderboards
SELECT refresh_leaderboards('overall');