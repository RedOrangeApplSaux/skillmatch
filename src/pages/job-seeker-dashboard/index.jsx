import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApplications } from '../../hooks/useApplications';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { useJobs } from '../../hooks/useJobs';
import RoleAdaptiveNavbar from '../../components/ui/RoleAdaptiveNavbar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import ProfileCompletionWidget from './components/ProfileCompletionWidget';
import ApplicationStatusTracker from './components/ApplicationStatusTracker';
import SavedJobsWidget from './components/SavedJobsWidget';
import SalaryInsightsWidget from './components/SalaryInsightsWidget';
import RecentActivityFeed from './components/RecentActivityFeed';
import JobSearchBar from './components/JobSearchBar';
import RecommendedJobsSection from './components/RecommendedJobsSection';
import Icon from '../../components/AppIcon';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { applications } = useApplications();
  const { savedJobs } = useSavedJobs();
  const { jobs: recommendedJobs, isLoading: jobsLoading } = useJobs({ 
    experienceLevel: userProfile?.role === 'job-seeker' ? 'mid' : undefined 
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Redirect if not authenticated or wrong role
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (userProfile && userProfile.role !== 'job-seeker') {
    navigate('/employer-dashboard');
    return null;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!userProfile) return 0;
    
    const fields = [
      'full_name', 'location', 'current_job_title', 'bio', 
      'linkedin_url', 'github_url', 'portfolio_url'
    ];
    
    const completedFields = fields.filter(field => userProfile[field]);
    return Math.round((completedFields.length / fields.length) * 100);
  };
  
  const getMissingFields = () => {
    if (!userProfile) return [];
    
    const fieldLabels = {
      bio: 'Professional Summary',
      linkedin_url: 'LinkedIn URL',
      github_url: 'GitHub URL',
      portfolio_url: 'Portfolio URL',
      current_job_title: 'Current Job Title',
      phone: 'Phone Number'
    };
    
    return Object.entries(fieldLabels)
      .filter(([field]) => !userProfile[field])
      .map(([, label]) => label);
  };
  
  // Transform recommended jobs for component
  const transformedRecommendedJobs = recommendedJobs?.slice(0, 3)?.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company?.name,
    companyLogo: job.company?.logo,
    location: job.location,
    salaryMin: job.salaryRange?.min,
    salaryMax: job.salaryRange?.max,
    type: job.type,
    description: job.description,
    skills: job.skills,
    postedDate: job.postedDate,
    applicants: job.applicantCount,
    matchPercentage: Math.floor(Math.random() * 20) + 80 // Mock match percentage
  })) || [];
  
  // Mock recent activities based on real applications
  const mockActivities = applications?.slice(0, 5)?.map((app, index) => ({
    id: index + 1,
    type: "application",
    message: `You applied for ${app.jobTitle} at ${app.company}`,
    timestamp: app.appliedDate,
    isNew: new Date(app.appliedDate) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  })) || [];

  const getGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleAdaptiveNavbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <NavigationBreadcrumbs className="mb-6" />
          
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  {getGreeting()}, {userProfile?.full_name || user?.email}!
                </h1>
                <p className="text-text-secondary mt-1">
                  Ready to find your next opportunity?
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-text-secondary">
                    {currentTime?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {currentTime?.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Search Bar */}
          <JobSearchBar className="mb-8" />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Recommended Jobs */}
            <div className="lg:col-span-2 space-y-8">
              <RecommendedJobsSection recommendedJobs={transformedRecommendedJobs} />
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              <ProfileCompletionWidget 
                completionPercentage={calculateProfileCompletion()}
                missingFields={getMissingFields()}
              />
              
              <ApplicationStatusTracker applications={applications} />
              
              <SavedJobsWidget 
                savedJobsCount={savedJobs?.length}
                recentSavedJobs={savedJobs?.slice(0, 2)}
              />
              
              <SalaryInsightsWidget 
                userSkills={[]} // Will be populated when skills system is implemented
                userLocation={userProfile?.location}
                salaryData={{
                  average: 85000,
                  min: 65000,
                  max: 110000,
                  premium: 95000
                }}
              />
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <RecentActivityFeed activities={mockActivities} />
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-12 bg-card border border-border rounded-lg p-6 shadow-card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/job-search-results')}
                className="flex items-center space-x-3 p-4 bg-muted rounded-lg hover:bg-accent transition-colors duration-150"
              >
                <Icon name="Search" size={20} className="text-secondary" />
                <div className="text-left">
                  <p className="font-medium text-text-primary">Browse Jobs</p>
                  <p className="text-sm text-text-secondary">Find new opportunities</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/application-tracking')}
                className="flex items-center space-x-3 p-4 bg-muted rounded-lg hover:bg-accent transition-colors duration-150"
              >
                <Icon name="FileText" size={20} className="text-secondary" />
                <div className="text-left">
                  <p className="font-medium text-text-primary">My Applications</p>
                  <p className="text-sm text-text-secondary">Track your progress</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-3 p-4 bg-muted rounded-lg hover:bg-accent transition-colors duration-150"
              >
                <Icon name="User" size={20} className="text-secondary" />
                <div className="text-left">
                  <p className="font-medium text-text-primary">Update Profile</p>
                  <p className="text-sm text-text-secondary">Improve your visibility</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/job-search-results?filter=saved')}
                className="flex items-center space-x-3 p-4 bg-muted rounded-lg hover:bg-accent transition-colors duration-150"
              >
                <Icon name="Bookmark" size={20} className="text-secondary" />
                <div className="text-left">
                  <p className="font-medium text-text-primary">Saved Jobs</p>
                  <p className="text-sm text-text-secondary">Review your favorites</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;