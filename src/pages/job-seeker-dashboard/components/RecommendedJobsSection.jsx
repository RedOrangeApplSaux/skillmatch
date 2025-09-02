import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecommendedJobsSection = ({ recommendedJobs = [] }) => {
  const navigate = useNavigate();

  const handleJobClick = (jobId) => {
    navigate(`/job-details?id=${jobId}`);
  };

  const handleQuickApply = (e, jobId) => {
    e?.stopPropagation();
    // In a real app, this would trigger a quick apply modal or process
    console.log('Quick apply to job:', jobId);
  };

  const handleSaveJob = (e, jobId) => {
    e?.stopPropagation();
    // In a real app, this would save the job to user's saved jobs
    console.log('Save job:', jobId);
  };

  const formatSalary = (min, max) => {
    const formatAmount = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })?.format(amount);
    };
    
    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}`;
    }
    return 'Competitive';
  };

  const getTimeAgo = (postedDate) => {
    const now = new Date();
    const posted = new Date(postedDate);
    const diffInDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={20} className="text-secondary" />
          <h2 className="text-xl font-semibold text-text-primary">Recommended for You</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/job-search-results')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      {recommendedJobs?.length > 0 ? (
        <div className="space-y-4">
          {recommendedJobs?.map((job) => (
            <div
              key={job?.id}
              className="border border-border rounded-lg p-4 hover:shadow-card hover:border-secondary/20 transition-all duration-150 cursor-pointer"
              onClick={() => handleJobClick(job?.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={job?.companyLogo}
                      alt={`${job?.company} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary hover:text-secondary transition-colors duration-150">
                          {job?.title}
                        </h3>
                        <p className="text-text-secondary font-medium">
                          {job?.company}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleSaveJob(e, job?.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
                      >
                        <Icon name="Bookmark" size={16} className="text-text-secondary hover:text-secondary" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-3">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={14} />
                        <span>{job?.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="DollarSign" size={14} />
                        <span>{formatSalary(job?.salaryMin, job?.salaryMax)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{job?.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{getTimeAgo(job?.postedDate)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-text-primary mb-3 line-clamp-2">
                      {job?.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job?.skills?.slice(0, 4)?.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-secondary"
                        >
                          {skill}
                        </span>
                      ))}
                      {job?.skills?.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-text-secondary">
                          +{job?.skills?.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Icon name="Users" size={14} className="text-text-secondary" />
                          <span className="text-xs text-text-secondary">
                            {job?.applicants || 0} applicants
                          </span>
                        </div>
                        {job?.matchPercentage && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Target" size={14} className="text-success" />
                            <span className="text-xs text-success font-medium">
                              {job?.matchPercentage}% match
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => handleQuickApply(e, job?.id)}
                        iconName="Send"
                        iconPosition="left"
                      >
                        Quick Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="Target" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Recommendations Yet</h3>
          <p className="text-text-secondary mb-6">
            Complete your profile to get personalized job recommendations
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate('/profile')}
            iconName="User"
            iconPosition="left"
          >
            Complete Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendedJobsSection;