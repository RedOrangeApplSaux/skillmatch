import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Users
  createUserProfile: async (userId, profileData) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ user_id: userId, ...profileData }])
      .select()
      .single();
    return { data, error };
  },

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Jobs
  getJobs: async (filters = {}) => {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        companies (
          id,
          name,
          logo_url,
          industry,
          size,
          description
        )
      `)
      .eq('status', 'active');

    if (filters.keywords) {
      query = query.or(`title.ilike.%${filters.keywords}%,description.ilike.%${filters.keywords}%`);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.jobTypes?.length > 0) {
      query = query.in('job_type', filters.jobTypes);
    }
    if (filters.experienceLevel) {
      query = query.eq('experience_level', filters.experienceLevel);
    }
    if (filters.remoteOnly) {
      query = query.eq('is_remote', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  getJobById: async (jobId) => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        companies (
          id,
          name,
          logo_url,
          industry,
          size,
          description,
          website,
          founded,
          headquarters
        )
      `)
      .eq('id', jobId)
      .single();
    return { data, error };
  },

  createJob: async (jobData) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();
    return { data, error };
  },

  // Applications
  createApplication: async (applicationData) => {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single();
    return { data, error };
  },

  getUserApplications: async (userId) => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          location,
          job_type,
          companies (
            name,
            logo_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  updateApplicationStatus: async (applicationId, status) => {
    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .select()
      .single();
    return { data, error };
  },

  // Companies
  createCompany: async (companyData) => {
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();
    return { data, error };
  },

  getCompanyJobs: async (companyId) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Saved Jobs
  saveJob: async (userId, jobId) => {
    const { data, error } = await supabase
      .from('saved_jobs')
      .insert([{ user_id: userId, job_id: jobId }])
      .select()
      .single();
    return { data, error };
  },

  unsaveJob: async (userId, jobId) => {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId);
    return { error };
  },

  getSavedJobs: async (userId) => {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select(`
        *,
        jobs (
          *,
          companies (
            name,
            logo_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};