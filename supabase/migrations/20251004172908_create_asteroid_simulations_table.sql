/*
  # Asteroid Impact Simulator Database Schema

  1. New Tables
    - `asteroid_simulations`
      - `id` (uuid, primary key): Unique identifier for each simulation
      - `name` (text): Name of the asteroid or simulation scenario
      - `diameter_meters` (numeric): Diameter of the asteroid in meters
      - `velocity_km_s` (numeric): Impact velocity in km/s
      - `angle_degrees` (numeric): Entry angle in degrees
      - `impact_lat` (numeric): Latitude of impact point
      - `impact_lon` (numeric): Longitude of impact point
      - `mass_kg` (numeric): Calculated mass in kilograms
      - `energy_megatons` (numeric): Impact energy in megatons of TNT
      - `crater_diameter_km` (numeric): Estimated crater diameter in kilometers
      - `is_ocean_impact` (boolean): Whether the impact is in ocean
      - `mitigation_applied` (text): Type of mitigation strategy applied (nullable)
      - `created_at` (timestamptz): Timestamp of simulation creation
      - `user_id` (uuid): Reference to user who created simulation (nullable for public access)

  2. Security
    - Enable RLS on `asteroid_simulations` table
    - Add policy for public read access (educational tool)
    - Add policy for authenticated users to create simulations
    - Add policy for users to update their own simulations
*/

CREATE TABLE IF NOT EXISTS asteroid_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Unnamed Simulation',
  diameter_meters numeric NOT NULL,
  velocity_km_s numeric NOT NULL,
  angle_degrees numeric NOT NULL DEFAULT 45,
  impact_lat numeric NOT NULL,
  impact_lon numeric NOT NULL,
  mass_kg numeric,
  energy_megatons numeric,
  crater_diameter_km numeric,
  is_ocean_impact boolean DEFAULT false,
  mitigation_applied text,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

ALTER TABLE asteroid_simulations ENABLE ROW LEVEL SECURITY;

-- Public can view all simulations (educational purpose)
CREATE POLICY "Anyone can view simulations"
  ON asteroid_simulations FOR SELECT
  USING (true);

-- Authenticated users can create simulations
CREATE POLICY "Authenticated users can create simulations"
  ON asteroid_simulations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own simulations
CREATE POLICY "Users can update own simulations"
  ON asteroid_simulations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own simulations
CREATE POLICY "Users can delete own simulations"
  ON asteroid_simulations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_simulations_created_at ON asteroid_simulations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_simulations_user_id ON asteroid_simulations(user_id);