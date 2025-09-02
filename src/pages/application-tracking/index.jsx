import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../../hooks/useApplications';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import ApplicationMetrics from './components/ApplicationMetrics';
import ApplicationFilters from './components/ApplicationFilters';
import ApplicationTable from './components/ApplicationTable';

const ApplicationTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications: fetchedApplications, isLoading: applicationsLoading, updateApplicationStatus } = useApplications();
  const [filteredApplications, setFilteredApplications] = useState([]);

  // Mock applications data
  const mockApplications = [
    {
      id: 1,
      jobId: 'job-001',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      industry: 'Technology',
      location: 'San Francisco, CA',
      positionType: 'Full-time',
      status: 'interview',
      appliedDate: '2025-08-28T10:30:00Z',
      lastUpdated: '2025-09-01T14:20:00Z',
      salary: '$120,000 - $150,000',
      applicationNotes: 'Applied through company website'
    },
    {
      id: 2,
      jobId: 'job-002',
      jobTitle: 'React Developer',
      company: 'StartupHub Inc',
      industry: 'Technology',
      location: 'Remote',
      positionType: 'Full-time',
      status: 'under-review',
      appliedDate: '2025-08-30T09:15:00Z',
      lastUpdated: '2025-08-31T16:45:00Z',
      salary: '$90,000 - $110,000',
      applicationNotes: 'Referred by John Smith'
    },
    {
      id: 3,
      jobId: 'job-003',
      jobTitle: 'Full Stack Engineer',
      company: 'InnovateLabs',
      industry: 'Software',
      location: 'New York, NY',
      positionType: 'Full-time',
      status: 'offer',
      appliedDate: '2025-08-25T14:20:00Z',
      lastUpdated: '2025-09-02T10:15:00Z',
      salary: '$130,000 - $160,000',
      applicationNotes: 'Applied via LinkedIn'
    },
    {
      id: 4,
      jobId: 'job-004',
      jobTitle: 'JavaScript Developer',
      company: 'WebSolutions Pro',
      industry: 'Web Development',
      location: 'Austin, TX',
      positionType: 'Contract',
      status: 'applied',
      appliedDate: '2025-09-01T11:30:00Z',
      lastUpdated: '2025-09-01T11:30:00Z',
      salary: '$80 - $100/hour',
      applicationNotes: 'Portfolio submitted'
    },
    {
      id: 5,
      jobId: 'job-005',
      jobTitle: 'Frontend Engineer',
      company: 'DesignFirst Agency',
      industry: 'Design',
      location: 'Los Angeles, CA',
      positionType: 'Full-time',
      status: 'rejected',
      appliedDate: '2025-08-20T16:45:00Z',
      lastUpdated: '2025-08-27T09:30:00Z',
      salary: '$95,000 - $115,000',
      applicationNotes: 'Applied through job board'
    },
    {
      id: 6,
      jobId: 'job-006',
      jobTitle: 'UI/UX Developer',
      company: 'CreativeTech Studios',
      industry: 'Technology',
      location: 'Seattle, WA',
      positionType: 'Full-time',
      status: 'hired',
      appliedDate: '2025-08-15T13:20:00Z',
      lastUpdated: '2025-08-30T15:45:00Z',
      salary: '$105,000 - $125,000',
      applicationNotes: 'Previous client referral'
    },
    {
      id: 7,
      jobId: 'job-007',
      jobTitle: 'React Native Developer',
      company: 'MobileFirst Solutions',
      industry: 'Mobile Development',
      location: 'Chicago, IL',
      positionType: 'Full-time',
      status: 'under-review',
      appliedDate: '2025-08-29T08:45:00Z',
      lastUpdated: '2025-09-02T12:30:00Z',
      salary: '$110,000 - $140,000',
      applicationNotes: 'Applied with custom cover letter'
    },
    {
      id: 8,
      jobId: 'job-008',
      jobTitle: 'Frontend Consultant',
      company: 'ConsultingPro LLC',
      industry: 'Consulting',
      location: 'Remote',
      positionType: 'Contract',
      status: 'interview',
      appliedDate: '2025-08-26T15:10:00Z',
      lastUpdated: '2025-09-01T11:20:00Z',
      salary: '$120 - $150/hour',
      applicationNotes: 'Networking contact introduction'
    }
  ];

  useEffect(() => {
    // Use fetched applications if available, otherwise use mock data
    const applicationsToUse = fetchedApplications?.length > 0 ? fetchedApplications : mockApplications;
    setFilteredApplications(applicationsToUse);
  }, [fetchedApplications]);

  const handleFilterChange = (filters) => {
    const applicationsToFilter = fetchedApplications?.length > 0 ? fetchedApplications : mockApplications;
    let filtered = [...applicationsToFilter];

    // Search query filter
    if (filters?.searchQuery) {
      const query = filters?.searchQuery?.toLowerCase();
      filtered = filtered?.filter(app => 
        app?.jobTitle?.toLowerCase()?.includes(query) ||
        app?.company?.toLowerCase()?.includes(query) ||
        app?.industry?.toLowerCase()?.includes(query) ||
        app?.location?.toLowerCase()?.includes(query)
      );
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(app => app?.status === filters?.status);
    }

    // Company filter
    if (filters?.company) {
      filtered = filtered?.filter(app => app?.company === filters?.company);
    }

    // Position type filter
    if (filters?.positionType) {
      filtered = filtered?.filter(app => app?.positionType === filters?.positionType);
    }

    // Date range filter
    if (filters?.dateRange) {
      const days = parseInt(filters?.dateRange);
      const cutoffDate = new Date();
      cutoffDate?.setDate(cutoffDate?.getDate() - days);
      
      filtered = filtered?.filter(app => 
        new Date(app.appliedDate) >= cutoffDate
      );
    }

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = (applicationId, newStatus) => {
    updateApplicationStatus(applicationId, newStatus);
  };

  const handleWithdrawApplication = (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      const updatedApplications = applications?.filter(app => app?.id !== applicationId);
      setApplications(updatedApplications);
      setFilteredApplications(filteredApplications?.filter(app => app?.id !== applicationId));
    }
  };

  const handleMessageEmployer = (applicationId) => {
    // In a real app, this would open a messaging interface
    console.log('Opening message interface for application:', applicationId);
    // For now, just show an alert
    alert('Messaging feature would open here. This would allow direct communication with the employer.');
  };

  if (applicationsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              <p className="text-text-secondary">Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <NavigationBreadcrumbs />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Application Tracking</h1>
              <p className="mt-2 text-text-secondary">
                Monitor and manage all your job applications in one place
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/job-seeker-dashboard')}
                iconName="LayoutDashboard"
              >
                Dashboard
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/job-search-results')}
                iconName="Search"
              >
                Find Jobs
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <ApplicationMetrics applications={filteredApplications} />

        {/* Filters */}
        <ApplicationFilters 
          applications={fetchedApplications?.length > 0 ? fetchedApplications : mockApplications}
          onFilterChange={handleFilterChange}
        />

        {/* Applications Table */}
        <ApplicationTable
          applications={filteredApplications}
          onStatusUpdate={handleStatusUpdate}
          onWithdraw={handleWithdrawApplication}
          onMessage={handleMessageEmployer}
        />

        {/* Quick Actions */}
        <div className="mt-8 bg-card rounded-lg border border-border p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/job-search-results')}
              iconName="Search"
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">Browse More Jobs</div>
                <div className="text-sm text-text-secondary">Find new opportunities</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              iconName="User"
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">Update Profile</div>
                <div className="text-sm text-text-secondary">Improve your chances</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/job-seeker-dashboard')}
              iconName="BarChart3"
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm text-text-secondary">Track your progress</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracking;