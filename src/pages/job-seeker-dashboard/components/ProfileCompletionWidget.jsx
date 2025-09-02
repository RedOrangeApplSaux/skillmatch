import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileCompletionWidget = ({ completionPercentage = 65, missingFields = [] }) => {
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    navigate('/profile');
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-error';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Profile Completion</h3>
        <div className={`text-2xl font-bold ${getCompletionColor(completionPercentage)}`}>
          {completionPercentage}%
        </div>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(completionPercentage)}`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      {/* Missing Fields */}
      {missingFields?.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-2">Complete these sections:</p>
          <div className="space-y-2">
            {missingFields?.slice(0, 3)?.map((field, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Icon name="AlertCircle" size={14} className="text-warning" />
                <span className="text-text-primary">{field}</span>
              </div>
            ))}
            {missingFields?.length > 3 && (
              <p className="text-xs text-text-secondary">
                +{missingFields?.length - 3} more items
              </p>
            )}
          </div>
        </div>
      )}
      <Button
        variant="secondary"
        size="sm"
        fullWidth
        onClick={handleCompleteProfile}
        iconName="User"
        iconPosition="left"
      >
        Complete Profile
      </Button>
    </div>
  );
};

export default ProfileCompletionWidget;