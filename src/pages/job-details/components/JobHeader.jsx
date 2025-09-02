import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const JobHeader = ({ job, onApply, onSave, onShare, isSaved = false }) => {
  const formatSalary = (min, max, currency = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    if (min && max) {
      return `${formatter?.format(min)} - ${formatter?.format(max)}`;
    } else if (min) {
      return `${formatter?.format(min)}+`;
    }
    return 'Competitive';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Job Title and Company Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
              <Image
                src={job?.company?.logo}
                alt={`${job?.company?.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2 leading-tight">
                {job?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-text-secondary">
                <div className="flex items-center gap-2">
                  <Icon name="Building2" size={16} />
                  <span className="font-medium text-text-primary">{job?.company?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  <span>{job?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} />
                  <span>Posted {formatDate(job?.postedDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Attributes */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full">
              <Icon name="Briefcase" size={14} />
              <span className="text-sm font-medium">{job?.type}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
              <Icon name="TrendingUp" size={14} />
              <span className="text-sm font-medium">{job?.experienceLevel}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
              <Icon name="DollarSign" size={14} />
              <span className="text-sm font-medium">
                {formatSalary(job?.salaryRange?.min, job?.salaryRange?.max)}
              </span>
            </div>
          </div>

          {/* Application Deadline */}
          {job?.applicationDeadline && (
            <div className="flex items-center gap-2 text-warning mb-4">
              <Icon name="Calendar" size={16} />
              <span className="text-sm font-medium">
                Application deadline: {new Date(job.applicationDeadline)?.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
          <Button
            variant="default"
            size="lg"
            onClick={onApply}
            iconName="Send"
            iconPosition="right"
            fullWidth
            className="order-1"
          >
            Apply Now
          </Button>
          
          <div className="flex gap-2 order-2">
            <Button
              variant="outline"
              size="default"
              onClick={onSave}
              iconName={isSaved ? "Heart" : "Heart"}
              className={isSaved ? "text-error border-error" : ""}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            
            <Button
              variant="outline"
              size="default"
              onClick={onShare}
              iconName="Share2"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;