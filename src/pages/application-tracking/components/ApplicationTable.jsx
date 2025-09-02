import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import ApplicationProgressIndicator from './ApplicationProgressIndicator';

const ApplicationTable = ({ applications = [], onStatusUpdate, onWithdraw, onMessage }) => {
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'appliedDate', direction: 'desc' });
  const navigate = useNavigate();

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedApplications = [...applications]?.sort((a, b) => {
    if (sortConfig?.key === 'appliedDate' || sortConfig?.key === 'lastUpdated') {
      const aDate = new Date(a[sortConfig.key]);
      const bDate = new Date(b[sortConfig.key]);
      return sortConfig?.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }
    
    const aValue = a?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    const bValue = b?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    
    if (sortConfig?.direction === 'asc') {
      return aValue?.localeCompare(bValue);
    }
    return bValue?.localeCompare(aValue);
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedApplications(applications?.map(app => app?.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (applicationId, checked) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, applicationId]);
    } else {
      setSelectedApplications(selectedApplications?.filter(id => id !== applicationId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const SortableHeader = ({ label, sortKey, className = '' }) => (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-150 ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <Icon 
          name={sortConfig?.key === sortKey 
            ? (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown')
            : 'ChevronsUpDown'
          } 
          size={14} 
          className={sortConfig?.key === sortKey ? 'text-secondary' : 'text-text-secondary'} 
        />
      </div>
    </th>
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
      {/* Bulk Actions */}
      {selectedApplications?.length > 0 && (
        <div className="bg-accent border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {selectedApplications?.length} application{selectedApplications?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="MessageSquare">
                Message Employers
              </Button>
              <Button variant="destructive" size="sm" iconName="Trash2">
                Withdraw Selected
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-border text-secondary focus:ring-secondary"
                  checked={selectedApplications?.length === applications?.length && applications?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <SortableHeader label="Job Title" sortKey="jobTitle" />
              <SortableHeader label="Company" sortKey="company" />
              <SortableHeader label="Applied Date" sortKey="appliedDate" />
              <SortableHeader label="Status" sortKey="status" />
              <SortableHeader label="Last Updated" sortKey="lastUpdated" />
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {sortedApplications?.map((application) => (
              <tr key={application?.id} className="hover:bg-muted/30 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-border text-secondary focus:ring-secondary"
                    checked={selectedApplications?.includes(application?.id)}
                    onChange={(e) => handleSelectApplication(application?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-text-primary">
                        {application?.jobTitle}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {application?.positionType} • {application?.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-primary">{application?.company}</div>
                  <div className="text-sm text-text-secondary">{application?.industry}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-primary">{formatDate(application?.appliedDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ApplicationStatusBadge status={application?.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">{getTimeAgo(application?.lastUpdated)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/job-details', { state: { jobId: application?.jobId } })}
                      iconName="Eye"
                    >
                      View
                    </Button>
                    {application?.status !== 'rejected' && application?.status !== 'hired' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMessage(application?.id)}
                        iconName="MessageSquare"
                      >
                        Message
                      </Button>
                    )}
                    {application?.status === 'applied' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onWithdraw(application?.id)}
                        iconName="Trash2"
                        className="text-destructive hover:text-destructive"
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden">
        {sortedApplications?.map((application) => (
          <div key={application?.id} className="border-b border-border p-4 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-border text-secondary focus:ring-secondary mt-1"
                  checked={selectedApplications?.includes(application?.id)}
                  onChange={(e) => handleSelectApplication(application?.id, e?.target?.checked)}
                />
                <div>
                  <h3 className="text-sm font-medium text-text-primary">
                    {application?.jobTitle}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {application?.company} • {application?.location}
                  </p>
                </div>
              </div>
              <ApplicationStatusBadge status={application?.status} size="sm" />
            </div>
            
            <div className="mb-3">
              <ApplicationProgressIndicator currentStatus={application?.status} />
            </div>
            
            <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
              <span>Applied: {formatDate(application?.appliedDate)}</span>
              <span>Updated: {getTimeAgo(application?.lastUpdated)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/job-details', { state: { jobId: application?.jobId } })}
                iconName="Eye"
                className="flex-1"
              >
                View Job
              </Button>
              {application?.status !== 'rejected' && application?.status !== 'hired' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMessage(application?.id)}
                  iconName="MessageSquare"
                >
                  Message
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {applications?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Applications Found</h3>
          <p className="text-text-secondary mb-4">
            You haven't submitted any job applications yet.
          </p>
          <Button
            variant="default"
            onClick={() => navigate('/job-search-results')}
            iconName="Search"
          >
            Browse Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApplicationTable;