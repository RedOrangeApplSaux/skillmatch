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
        
        setJobs(data || []);
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
        
        setJobs(data || []);
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
        
        setJob(data);
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