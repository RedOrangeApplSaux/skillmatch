import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';

export const useJobs = (filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await db.getJobs(filters);
        
        if (fetchError) {
          throw fetchError;
        }
        
        // Transform data to match component expectations
        const transformedJobs = data?.map(job => ({
          ...job,
          company: {
            name: job.companies?.name,
            logo: job.companies?.logo_url,
            industry: job.companies?.industry,
            size: job.companies?.size,
            description: job.companies?.description
          },
          skills: job.job_skills?.map(js => js.skills?.name) || [],
          salaryRange: {
            min: job.salary_min,
            max: job.salary_max
          },
          type: job.job_type,
          experienceLevel: job.experience_level,
          remote: job.is_remote,
          postedDate: job.created_at,
          applicantCount: job.application_count || 0,
          viewCount: job.view_count || 0
        })) || [];
        
        setJobs(transformedJobs);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await db.getJobs(filters);
        
        if (fetchError) {
          throw fetchError;
        }
        
        const transformedJobs = data?.map(job => ({
          ...job,
          company: {
            name: job.companies?.name,
            logo: job.companies?.logo_url,
            industry: job.companies?.industry,
            size: job.companies?.size,
            description: job.companies?.description
          },
          skills: job.job_skills?.map(js => js.skills?.name) || [],
          salaryRange: {
            min: job.salary_min,
            max: job.salary_max
          },
          type: job.job_type,
          experienceLevel: job.experience_level,
          remote: job.is_remote,
          postedDate: job.created_at,
          applicantCount: job.application_count || 0,
          viewCount: job.view_count || 0
        })) || [];
        
        setJobs(transformedJobs);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  };

  return { jobs, isLoading, error, refetch };
};

export const useJob = (jobId) => {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) {
      setIsLoading(false);
      return;
    }

    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await db.getJobById(jobId);
        
        if (fetchError) {
          throw fetchError;
        }
        
        // Transform data to match component expectations
        const transformedJob = {
          ...data,
          company: {
            name: data.companies?.name,
            logo: data.companies?.logo_url,
            industry: data.companies?.industry,
            size: data.companies?.size,
            description: data.companies?.description,
            website: data.companies?.website,
            founded: data.companies?.founded,
            headquarters: data.companies?.headquarters
          },
          requiredSkills: data.job_skills?.filter(js => js.is_required)?.map(js => js.skills?.name) || [],
          preferredSkills: data.job_skills?.filter(js => !js.is_required)?.map(js => js.skills?.name) || [],
          salaryRange: {
            min: data.salary_min,
            max: data.salary_max
          },
          type: data.job_type,
          experienceLevel: data.experience_level,
          remote: data.is_remote,
          postedDate: data.created_at,
          applicantCount: data.application_count || 0,
          viewCount: data.view_count || 0,
          applicationDeadline: data.application_deadline
        };
        
        setJob(transformedJob);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching job:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  return { job, isLoading, error };
};