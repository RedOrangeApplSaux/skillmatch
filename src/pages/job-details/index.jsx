import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJob } from '../../hooks/useJobs';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { useApplications } from '../../hooks/useApplications';
import { useAuth } from '../../contexts/AuthContext';
import RoleAdaptiveNavbar from '../../components/ui/RoleAdaptiveNavbar';
import NavigationBreadcrumbs, { JobSearchBreadcrumbs } from '../../components/ui/NavigationBreadcrumbs';
import JobHeader from './components/JobHeader';
import JobDescription from './components/JobDescription';
import JobInfoPanel from './components/JobInfoPanel';
import RelatedJobs from './components/RelatedJobs';
import ApplicationModal from './components/ApplicationModal';
import ShareModal from './components/ShareModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const JobDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const jobId = searchParams?.get('id') || '1';
  
  // Use custom hooks
  const { job, isLoading, error } = useJob(jobId);
  const { jobs: allJobs } = useJobs();
  const { savedJobIds, toggleSaveJob } = useSavedJobs();
  const { createApplication } = useApplications();
  
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Get related jobs (same industry or similar skills)
  const relatedJobs = allJobs?.filter(j => 
    j.id !== jobId && 
    (j.company?.industry === job?.company?.industry || 
     j.skills?.some(skill => job?.requiredSkills?.includes(skill)))
  )?.slice(0, 3) || [];
  
  const isSaved = savedJobIds?.has(jobId);

  const handleApply = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    setIsApplicationModalOpen(true);
  };

  const handleSave = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    toggleSaveJob(jobId);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleApplicationSubmit = (applicationData) => {
    const submitApplication = async () => {
      try {
        const { error } = await createApplication({
          job_id: jobId,
          cover_letter: applicationData.coverLetter,
          resume_url: applicationData.resumeFile ? 'uploaded-resume.pdf' : null, // In real app, upload file first
          portfolio_url: applicationData.portfolioUrl,
          salary_expectation: applicationData.salaryExpectation ? parseInt(applicationData.salaryExpectation.replace(/[^0-9]/g, '')) : null,
          available_start_date: applicationData.availableStartDate || null,
          notes: `Allow contact: ${applicationData.allowContact ? 'Yes' : 'No'}`
        });
        
        if (error) {
          console.error('Application submission failed:', error);
          return;
        }
        
        // Show success and redirect
        setTimeout(() => {
          navigate('/application-tracking');
        }, 1000);
      } catch (error) {
        console.error('Application submission failed:', error);
      }
    };
    
    submitApplication();
  };

  const handleBackToSearch = () => {
    navigate('/job-search-results');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleAdaptiveNavbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-8 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded w-20"></div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="h-6 bg-muted rounded w-1/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                      <div className="space-y-3">
                        {[...Array(6)]?.map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-lg"></div>
                            <div className="flex-1">
                              <div className="h-3 bg-muted rounded w-1/3 mb-1"></div>
                              <div className="h-3 bg-muted rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <RoleAdaptiveNavbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <Icon name="AlertCircle" size={48} className="mx-auto text-text-secondary mb-4" />
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                {error ? 'Error Loading Job' : 'Job Not Found'}
              </h1>
              <p className="text-text-secondary mb-6">
                {error ? error : "The job you're looking for doesn't exist or has been removed."}
              </p>
              <Button
                variant="default"
                onClick={handleBackToSearch}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Job Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleAdaptiveNavbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <JobSearchBreadcrumbs 
              jobTitle={job?.title} 
              companyName={job?.company?.name} 
            />
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToSearch}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-text-secondary hover:text-text-primary"
            >
              Back to Search Results
            </Button>
          </div>

          {/* Job Header */}
          <div className="mb-8">
            <JobHeader
              job={job}
              onApply={handleApply}
              onSave={handleSave}
              onShare={handleShare}
              isSaved={isSaved}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Job Description */}
            <div className="lg:col-span-2 space-y-6">
              <JobDescription job={job} />
            </div>

            {/* Right Column - Job Info & Related Jobs */}
            <div className="space-y-6">
              <JobInfoPanel job={job} />
              <RelatedJobs jobs={relatedJobs} currentJobId={job?.id} />
            </div>
          </div>

          {/* Sticky Apply Button for Mobile */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:hidden z-40">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
                iconName={isSaved ? "Heart" : "Heart"}
                className={isSaved ? "text-error border-error" : ""}
              >
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="default"
                onClick={handleApply}
                iconName="Send"
                iconPosition="right"
                fullWidth
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        job={job}
        onSubmit={handleApplicationSubmit}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        job={job}
      />
      {/* Bottom padding for mobile sticky button */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default JobDetails;