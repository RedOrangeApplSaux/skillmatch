import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleAdaptiveNavbar from '../../components/ui/RoleAdaptiveNavbar';
import JobPostingCard from './components/JobPostingCard';
import MetricsWidget from './components/MetricsWidget';
import ActivityFeed from './components/ActivityFeed';
import CompanyProfileWidget from './components/CompanyProfileWidget';
import QuickActions from './components/QuickActions';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  
  // Redirect if not authenticated or wrong role
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (userProfile && userProfile.role !== 'employer') {
    navigate('/job-seeker-dashboard');
    return null;
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load company jobs
        const { data: jobsData, error: jobsError } = await db.getCompanyJobs(userProfile?.company_id);
        if (!jobsError && jobsData) {
          setJobs(jobsData);
        }
        
        // Load job statistics
        const { data: statsData, error: statsError } = await db.getJobStats(user.id);
        if (!statsError && statsData) {
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && userProfile) {
      loadDashboardData();
    }
  }, [user, userProfile]);

  // Mock metrics data
  const metricsData = [
    {
      title: "Total Applications",
      value: stats?.totalApplications?.toString() || "0",
      change: "+12%",
      changeType: "increase",
      icon: "FileText",
      color: "secondary"
    },
    {
      title: "Positions Filled",
      value: "8",
      change: "+3",
      changeType: "increase",
      icon: "CheckCircle",
      color: "success"
    },
    {
      title: "Avg. Time to Hire",
      value: "18 days",
      change: "-2 days",
      changeType: "decrease",
      icon: "Clock",
      color: "warning"
    },
    {
      title: "Active Job Posts",
      value: stats?.activeJobs?.toString() || "0",
      change: "+2",
      changeType: "increase",
      icon: "Briefcase",
      color: "secondary"
    }
  ];

  // Mock activity feed data
  const mockActivities = [
    {
      id: 1,
      type: "application",
      candidateName: "Sarah Johnson",
      action: "applied for",
      jobTitle: "Senior Frontend Developer",
      timestamp: new Date(Date.now() - 300000),
      priority: "normal"
    },
    {
      id: 2,
      type: "status_change",
      candidateName: "Michael Chen",
      action: "moved to interview stage for",
      jobTitle: "Product Marketing Manager",
      timestamp: new Date(Date.now() - 900000),
      priority: "high"
    },
    {
      id: 3,
      type: "hire",
      candidateName: "Emily Rodriguez",
      action: "was hired for",
      jobTitle: "UX Designer",
      timestamp: new Date(Date.now() - 1800000),
      priority: "normal"
    },
    {
      id: 4,
      type: "interview",
      candidateName: "David Kim",
      action: "scheduled interview for",
      jobTitle: "Data Scientist",
      timestamp: new Date(Date.now() - 3600000),
      priority: "high"
    },
    {
      id: 5,
      type: "message",
      candidateName: "Lisa Wang",
      action: "sent a message regarding",
      jobTitle: "Senior Frontend Developer",
      timestamp: new Date(Date.now() - 7200000),
      priority: "normal"
    }
  ];

  // Mock company profile data
  const mockCompanyProfile = {
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    description: "Leading technology company focused on innovative solutions",
    industry: "Technology",
    website: "https://company.com",
    location: "San Francisco, CA",
    benefits: ["Health Insurance", "401k", "Remote Work", "Flexible Hours"]
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = jobs?.filter(job => {
    if (selectedFilter === 'all') return true;
    return job?.status === selectedFilter;
  });

  const handlePostNewJob = () => {
    // Navigate to job posting creation
    navigate('/job-details', { state: { mode: 'create' } });
  };

  const handleEditJob = (jobId) => {
    navigate('/job-details', { state: { jobId, mode: 'edit' } });
  };

  const handleViewApplicants = (jobId) => {
    navigate('/application-tracking', { state: { jobId, mode: 'employer' } });
  };

  const handleViewAllJobs = () => {
    navigate('/job-search-results', { state: { mode: 'employer' } });
  };

  const handleManageApplications = () => {
    navigate('/application-tracking', { state: { mode: 'employer' } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RoleAdaptiveNavbar />
        <div className="pt-16 flex items-center justify-center flex-1">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <RoleAdaptiveNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Employer Dashboard</h1>
            <p className="text-text-secondary">
              Welcome back! Here's what's happening with your recruitment activities.
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button
              variant="default"
              onClick={handlePostNewJob}
              iconName="Plus"
              iconPosition="left"
              iconSize={20}
              className="w-full lg:w-auto"
            >
              Post New Job
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions
            onPostJob={handlePostNewJob}
            onViewAllJobs={handleViewAllJobs}
            onManageApplications={handleManageApplications}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsData?.map((metric, index) => (
            <MetricsWidget
              key={index}
              title={metric?.title}
              value={metric?.value}
              change={metric?.change}
              changeType={metric?.changeType}
              icon={metric?.icon}
              color={metric?.color}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Postings Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg shadow-card">
              <div className="p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold text-text-primary mb-4 sm:mb-0">
                    Active Job Postings
                  </h2>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e?.target?.value)}
                      className="px-3 py-2 border border-border rounded-md text-sm bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="all">All Jobs</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {filteredJobs?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredJobs?.map((job) => (
                      <JobPostingCard
                        key={job?.id}
                        job={job}
                        onEdit={() => handleEditJob(job?.id)}
                        onViewApplicants={() => handleViewApplicants(job?.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Briefcase" size={48} className="text-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">No jobs found</h3>
                    <p className="text-text-secondary mb-6">
                      {selectedFilter === 'all' ? "You haven't posted any jobs yet. Create your first job posting to start attracting candidates."
                        : `No ${selectedFilter} jobs found. Try changing the filter or create a new job posting.`
                      }
                    </p>
                    <Button
                      variant="default"
                      onClick={handlePostNewJob}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Profile Widget */}
            <CompanyProfileWidget profileData={mockCompanyProfile} />
            
            {/* Activity Feed */}
            <ActivityFeed activities={mockActivities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;