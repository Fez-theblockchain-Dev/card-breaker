import { supabase } from './supabase';

// Types for our database tables
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface BreakingSession {
  id?: string;
  user_id?: string;
  package_cost: number;
  time_spent: number;
  sales_price: number;
  buyer: string;
  payment_method: string;
  created_at?: string;
}

// Contact form functions
export async function submitContactForm(data: Omit<ContactSubmission, 'id' | 'created_at'>) {
  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit contact form: ${error.message}`);
  }

  return result;
}

export async function getContactSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch contact submissions: ${error.message}`);
  }

  return data;
}

// Breaking session functions
export async function createBreakingSession(data: Omit<BreakingSession, 'id' | 'user_id' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create a session');
  }

  const { data: result, error } = await supabase
    .from('breaking_sessions')
    .insert([{ ...data, user_id: user.id }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create breaking session: ${error.message}`);
  }

  return result;
}

export async function getBreakingSessions() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to view sessions');
  }

  const { data, error } = await supabase
    .from('breaking_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch breaking sessions: ${error.message}`);
  }

  return data;
}

export async function updateBreakingSession(id: string, data: Partial<Omit<BreakingSession, 'id' | 'user_id' | 'created_at'>>) {
  const { data: result, error } = await supabase
    .from('breaking_sessions')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update breaking session: ${error.message}`);
  }

  return result;
}

export async function deleteBreakingSession(id: string) {
  const { error } = await supabase
    .from('breaking_sessions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete breaking session: ${error.message}`);
  }
}