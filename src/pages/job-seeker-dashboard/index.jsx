import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Mock user data
  const userData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    location: "San Francisco, CA",
    skills: ["React", "JavaScript", "Node.js", "Python", "UI/UX Design"],
    profileCompletion: 75,
    missingFields: ["Portfolio URL", "Professional Summary", "Certifications"]
  };

  // Mock applications data
  const mockApplications = [
    {
      id: 1,
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      status: "interview",
      appliedDate: "2025-01-28T10:00:00Z"
    },
    {
      id: 2,
      jobTitle: "React Developer",
      company: "StartupXYZ",
      status: "under-review",
      appliedDate: "2025-01-25T14:30:00Z"
    },
    {
      id: 3,
      jobTitle: "Full Stack Engineer",
      company: "Innovation Labs",
      status: "applied",
      appliedDate: "2025-01-22T09:15:00Z"
    },
    {
      id: 4,
      jobTitle: "UI/UX Developer",
      company: "Design Studio",
      status: "offer",
      appliedDate: "2025-01-20T16:45:00Z"
    },
    {
      id: 5,
      jobTitle: "JavaScript Developer",
      company: "WebSolutions",
      status: "rejected",
      appliedDate: "2025-01-18T11:20:00Z"
    }
  ];

  // Mock saved jobs data
  const mockSavedJobs = [
    {
      id: 101,
      title: "Product Manager",
      company: "Google",
      salary: "$120K - $160K",
      location: "Mountain View, CA"
    },
    {
      id: 102,
      title: "Data Scientist",
      company: "Meta",
      salary: "$130K - $180K",
      location: "Menlo Park, CA"
    }
  ];

  // Mock salary insights data
  const mockSalaryData = {
    average: 85000,
    min: 65000,
    max: 110000,
    premium: 95000
  };

  // Mock recent activities
  const mockActivities = [
    {
      id: 1,
      type: "status_update",
      message: "Your application for Senior Frontend Developer at TechCorp Inc. moved to Interview stage",
      timestamp: "2025-01-30T09:30:00Z",
      isNew: true
    },
    {
      id: 2,
      type: "job_match",
      message: "New job match: React Developer at StartupXYZ (95% match)",
      timestamp: "2025-01-29T15:45:00Z",
      isNew: true
    },
    {
      id: 3,
      type: "application",
      message: "You applied for Full Stack Engineer at Innovation Labs",
      timestamp: "2025-01-28T11:20:00Z",
      isNew: false
    },
    {
      id: 4,
      type: "offer",
      message: "Congratulations! You received an offer from Design Studio",
      timestamp: "2025-01-27T14:10:00Z",
      isNew: false
    },
    {
      id: 5,
      type: "profile_update",
      message: "You updated your skills section",
      timestamp: "2025-01-26T10:05:00Z",
      isNew: false
    }
  ];

  // Mock recommended jobs
  const mockRecommendedJobs = [
    {
      id: 201,
      title: "Senior React Developer",
      company: "Airbnb",
      companyLogo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center",
      location: "San Francisco, CA",
      salaryMin: 120000,
      salaryMax: 160000,
      type: "Full-time",
      description: "Join our frontend team to build amazing user experiences with React, TypeScript, and modern web technologies. We're looking for someone passionate about creating scalable, maintainable code.",
      skills: ["React", "TypeScript", "JavaScript", "CSS", "Node.js", "GraphQL"],
      postedDate: "2025-01-29T08:00:00Z",
      applicants: 23,
      matchPercentage: 95
    },
    {
      id: 202,
      title: "Frontend Engineer",
      company: "Stripe",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      location: "Remote",
      salaryMin: 110000,
      salaryMax: 150000,
      type: "Full-time",
      description: "Help us build the future of online payments. Work with cutting-edge technologies and contribute to products used by millions of businesses worldwide.",
      skills: ["React", "JavaScript", "Python", "API Integration", "Testing"],
      postedDate: "2025-01-28T12:30:00Z",
      applicants: 45,
      matchPercentage: 88
    },
    {
      id: 203,
      title: "UI/UX Developer",
      company: "Figma",
      companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&crop=center",
      location: "San Francisco, CA",
      salaryMin: 100000,
      salaryMax: 140000,
      type: "Full-time",
      description: "Bridge the gap between design and development. Create beautiful, functional interfaces that delight users and help teams collaborate better.",
      skills: ["React", "UI/UX Design", "Figma", "CSS", "JavaScript", "Design Systems"],
      postedDate: "2025-01-27T16:15:00Z",
      applicants: 67,
      matchPercentage: 82
    }
  ];

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
                  {getGreeting()}, {userData?.name}!
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
              <RecommendedJobsSection recommendedJobs={mockRecommendedJobs} />
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              <ProfileCompletionWidget 
                completionPercentage={userData?.profileCompletion}
                missingFields={userData?.missingFields}
              />
              
              <ApplicationStatusTracker applications={mockApplications} />
              
              <SavedJobsWidget 
                savedJobsCount={mockSavedJobs?.length}
                recentSavedJobs={mockSavedJobs}
              />
              
              <SalaryInsightsWidget 
                userSkills={userData?.skills}
                userLocation={userData?.location}
                salaryData={mockSalaryData}
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