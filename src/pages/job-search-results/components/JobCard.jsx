import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const JobCard = ({ job, onSaveJob, isSaved = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDetails = () => {
    navigate('/job-details', { state: { jobId: job?.id } });
  };

  const handleSaveJob = async (e) => {
    e?.stopPropagation();
    setIsLoading(true);
    try {
      await onSaveJob(job?.id);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
    if (min) return `From $${min?.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-shadow duration-150 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={job?.company?.logo}
              alt={`${job?.company?.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg font-semibold text-text-primary mb-1 group-hover:text-secondary transition-colors duration-150 cursor-pointer line-clamp-2"
              onClick={handleViewDetails}
            >
              {job?.title}
            </h3>
            <p className="text-text-secondary font-medium mb-2">{job?.company?.name}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{job?.location}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{getTimeAgo(job?.postedDate)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Icon name="Briefcase" size={14} />
                <span className="capitalize">{job?.type}</span>
              </div>
              
              {job?.remote && (
                <div className="flex items-center space-x-1">
                  <Icon name="Wifi" size={14} />
                  <span>Remote</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-text-primary">
                {formatSalary(job?.salary?.min, job?.salary?.max)}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveJob}
                  loading={isLoading}
                  className="text-text-secondary hover:text-secondary"
                >
                  <Icon 
                    name={isSaved ? "Heart" : "Heart"} 
                    size={18}
                    className={isSaved ? "fill-current text-secondary" : ""}
                  />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewDetails}
                  iconName="ExternalLink"
                  iconSize={14}
                  iconPosition="right"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-4">
        <p className="text-text-secondary text-sm line-clamp-2 mb-3">
          {job?.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {job?.skills?.slice(0, 4)?.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
          {job?.skills?.length > 4 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
              +{job?.skills?.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;