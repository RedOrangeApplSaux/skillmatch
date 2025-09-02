import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJob } from '../../hooks/useJob';
import { useApplications } from '../../hooks/useApplications';
import { useSavedJobs } from '../../hooks/useSavedJobs';
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
  const { createApplication } = useApplications();
  const { savedJobIds, toggleSaveJob } = useSavedJobs();
  const jobId = searchParams?.get('id') || '1';
  
  const { job: fetchedJob, isLoading: jobLoading, error: jobError } = useJob(jobId);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  // Mock job data
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: {
        name: 'TechCorp Solutions',
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
        description: `TechCorp Solutions is a leading technology company specializing in innovative software solutions for enterprise clients. Founded in 2010, we've grown from a small startup to a global organization with over 500 employees across 15 countries.\n\nOur mission is to transform businesses through cutting-edge technology and exceptional user experiences. We work with Fortune 500 companies to deliver scalable, secure, and user-friendly applications that drive business growth.\n\nAt TechCorp, we believe in fostering a culture of innovation, collaboration, and continuous learning. Our team consists of passionate professionals who are dedicated to pushing the boundaries of what's possible in technology.`,
        industry: 'Software Development',
        size: '500-1000 employees',
        founded: '2010',
        headquarters: 'San Francisco, CA',
        website: 'https://techcorp-solutions.com',
        openPositions: 12
      },
      location: 'San Francisco, CA (Remote)',
      type: 'Full-time',
      experienceLevel: 'Senior Level',
      salaryRange: {
        min: 120000,
        max: 160000
      },
      postedDate: '2025-08-28T10:00:00Z',
      applicationDeadline: '2025-09-15T23:59:59Z',
      description: `We are seeking a talented Senior Frontend Developer to join our dynamic engineering team. In this role, you will be responsible for building and maintaining high-quality web applications using modern JavaScript frameworks and technologies.\n\nYou will work closely with our design and backend teams to create exceptional user experiences that delight our customers. This is an excellent opportunity to work on challenging projects, mentor junior developers, and contribute to the technical direction of our products.\n\nThe ideal candidate will have a strong background in React, TypeScript, and modern frontend development practices. You should be passionate about writing clean, maintainable code and staying up-to-date with the latest industry trends and best practices.`,
      responsibilities: [
        'Develop and maintain responsive web applications using React, TypeScript, and modern CSS',
        'Collaborate with UX/UI designers to implement pixel-perfect designs',
        'Write clean, maintainable, and well-documented code following best practices',
        'Optimize applications for maximum speed and scalability',
        'Mentor junior developers and conduct code reviews',
        'Participate in technical discussions and contribute to architectural decisions',
        'Work with backend teams to integrate APIs and ensure seamless data flow',
        'Stay current with emerging technologies and industry trends'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science, Engineering, or related field',
        '5+ years of experience in frontend development',
        'Expert-level proficiency in React, JavaScript, and TypeScript',
        'Strong understanding of HTML5, CSS3, and responsive design principles',
        'Experience with state management libraries (Redux, Zustand, or similar)',
        'Proficiency with modern build tools (Webpack, Vite, or similar)',
        'Experience with version control systems (Git)',
        'Strong problem-solving skills and attention to detail'
      ],
      requiredSkills: [
        'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'Git', 'Webpack', 'REST APIs', 'Responsive Design'
      ],
      preferredSkills: [
        'Next.js', 'GraphQL', 'Jest', 'Cypress', 'Docker', 'AWS', 'Figma', 'Tailwind CSS'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Comprehensive health, dental, and vision insurance',
        'Flexible work arrangements and remote work options',
        'Professional development budget for courses and conferences',
        'Generous PTO and parental leave policies',
        'State-of-the-art equipment and home office stipend',
        'Team building events and company retreats',
        'Wellness programs and mental health support'
      ],
      education: 'Bachelor\'s degree preferred',
      experience: '5+ years',
      applicantCount: 47,
      viewCount: 234,
      matchScore: 92
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: {
        name: 'InnovateLab',
        logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=center',
        description: 'InnovateLab is a cutting-edge startup focused on AI-powered solutions.',
        industry: 'Artificial Intelligence',
        size: '50-100 employees',
        founded: '2020',
        headquarters: 'Austin, TX',
        openPositions: 8
      },
      location: 'Austin, TX',
      type: 'Full-time',
      experienceLevel: 'Mid Level',
      salaryRange: {
        min: 90000,
        max: 130000
      },
      postedDate: '2025-08-30T14:30:00Z',
      description: 'Join our team to build innovative AI-powered applications.',
      responsibilities: [
        'Develop full-stack applications using modern technologies',
        'Collaborate with AI/ML teams to integrate intelligent features'
      ],
      requirements: [
        '3+ years of full-stack development experience',
        'Proficiency in React and Node.js'
      ],
      requiredSkills: ['React', 'Node.js', 'Python', 'PostgreSQL'],
      preferredSkills: ['TensorFlow', 'AWS', 'Docker'],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Flexible hours'
      ],
      education: 'Bachelor\'s degree',
      experience: '3+ years',
      applicantCount: 23,
      viewCount: 156,
      matchScore: 85
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      company: {
        name: 'DesignStudio Pro',
        logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop&crop=center',
        description: 'DesignStudio Pro creates beautiful and functional digital experiences.',
        industry: 'Design & Creative',
        size: '20-50 employees',
        founded: '2018',
        headquarters: 'New York, NY',
        openPositions: 5
      },
      location: 'New York, NY (Hybrid)',
      type: 'Full-time',
      experienceLevel: 'Mid Level',
      salaryRange: {
        min: 75000,
        max: 105000
      },
      postedDate: '2025-08-29T09:15:00Z',
      description: 'Create stunning user interfaces and experiences for our clients.',
      responsibilities: [
        'Design user interfaces for web and mobile applications',
        'Conduct user research and usability testing'
      ],
      requirements: [
        '3+ years of UI/UX design experience',
        'Proficiency in Figma and Adobe Creative Suite'
      ],
      requiredSkills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      preferredSkills: ['After Effects', 'Principle', 'InVision'],
      benefits: [
        'Creative freedom',
        'Health benefits',
        'Professional development'
      ],
      education: 'Design degree preferred',
      experience: '3+ years',
      applicantCount: 31,
      viewCount: 189,
      matchScore: 78
    }
  ];

  useEffect(() => {
    // Set related jobs from mock data
    setRelatedJobs(mockJobs?.filter(j => j?.id !== jobId));
  }, [jobId]);

  // Use fetched job if available, otherwise fall back to mock data
  const job = fetchedJob || mockJobs?.find(j => j?.id === jobId);
  const isLoading = jobLoading;
  const isSaved = savedJobIds?.has(jobId);
  const handleApply = () => {
    if (!user) {
      navigate('/register?role=job-seeker');
      return;
    }
    setIsApplicationModalOpen(true);
  };

  const handleSave = () => {
    if (!user) {
      navigate('/register?role=job-seeker');
      return;
    }
    toggleSaveJob(jobId);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleApplicationSubmit = async (applicationData) => {
    setIsSubmittingApplication(true);
    
    try {
      const { data, error } = await createApplication({
        job_id: jobId,
        cover_letter: applicationData.coverLetter,
        portfolio_url: applicationData.portfolioUrl,
        salary_expectation: applicationData.salaryExpectation ? parseInt(applicationData.salaryExpectation.replace(/[^0-9]/g, '')) : null,
        available_start_date: applicationData.availableStartDate || null,
        notes: `Applied via SkillMatch platform. Newsletter: ${applicationData.subscribeNewsletter ? 'Yes' : 'No'}`
      });
      
      if (error) {
        throw error;
      }
      
      // Show success and redirect
      setTimeout(() => {
        navigate('/application-tracking');
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmittingApplication(false);
    }
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

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <RoleAdaptiveNavbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <Icon name="AlertCircle" size={48} className="mx-auto text-text-secondary mb-4" />
              <h1 className="text-2xl font-bold text-text-primary mb-2">Job Not Found</h1>
              <p className="text-text-secondary mb-6">
                The job you're looking for doesn't exist or has been removed.
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