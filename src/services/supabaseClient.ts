/**
 * Supabase Client Configuration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Database types
 */
export interface SimulationRecord {
  id?: string;
  name: string;
  diameter_meters: number;
  velocity_km_s: number;
  angle_degrees: number;
  impact_lat: number;
  impact_lon: number;
  mass_kg?: number;
  energy_megatons?: number;
  crater_diameter_km?: number;
  is_ocean_impact?: boolean;
  mitigation_applied?: string;
  created_at?: string;
  user_id?: string;
}

/**
 * Save simulation to database
 */
export async function saveSimulation(data: SimulationRecord) {
  const { data: result, error } = await supabase
    .from('asteroid_simulations')
    .insert([data])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }

  return result;
}

/**
 * Load recent simulations
 */
export async function loadRecentSimulations(limit: number = 10) {
  const { data, error } = await supabase
    .from('asteroid_simulations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error loading simulations:', error);
    return [];
  }

  return data;
}

/**
 * Load simulation by ID
 */
export async function loadSimulationById(id: string) {
  const { data, error } = await supabase
    .from('asteroid_simulations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error loading simulation:', error);
    return null;
  }

  return data;
}
