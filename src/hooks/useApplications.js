import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setApplications([]);
      setIsLoading(false);
      return;
    }

    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await db.getUserApplications(user.id);
        
        if (fetchError) {
          throw fetchError;
        }
        
        setApplications(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching applications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const createApplication = async (applicationData) => {
    try {
      const { data, error } = await db.createApplication({
        ...applicationData,
        user_id: user.id
      });
      
      if (error) throw error;
      
      // Add to local state
      setApplications(prev => [data, ...prev]);
      
      return { data, error: null };
    } catch (err) {
      console.error('Error creating application:', err);
      return { data: null, error: err };
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const { data, error } = await db.updateApplicationStatus(applicationId, status);
      
      if (error) throw error;
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status, updated_at: data.updated_at } : app
        )
      );
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating application status:', err);
      return { data: null, error: err };
    }
  };

  return {
    applications,
    isLoading,
    error,
    createApplication,
    updateApplicationStatus
  };
};