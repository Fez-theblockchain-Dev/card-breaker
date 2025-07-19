/*
  # Initial Database Schema for S&R Sports Analytics

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamp)
    - `breaking_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `package_cost` (decimal)
      - `time_spent` (decimal)
      - `sales_price` (decimal)
      - `buyer` (text)
      - `payment_method` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Allow anonymous contact form submissions
*/

-- Contact submissions table (allows anonymous submissions)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Breaking sessions table (requires authentication)
CREATE TABLE IF NOT EXISTS breaking_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  package_cost decimal(10,2) NOT NULL DEFAULT 0,
  time_spent decimal(5,2) NOT NULL DEFAULT 0,
  sales_price decimal(10,2) NOT NULL DEFAULT 0,
  buyer text NOT NULL,
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE breaking_sessions ENABLE ROW LEVEL SECURITY;

-- Contact submissions policies (allow anonymous inserts, admin read)
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Breaking sessions policies (users can only access their own data)
CREATE POLICY "Users can insert their own sessions"
  ON breaking_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own sessions"
  ON breaking_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON breaking_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON breaking_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);