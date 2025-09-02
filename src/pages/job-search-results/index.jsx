import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RoleAdaptiveNavbar from '../../components/ui/RoleAdaptiveNavbar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import SearchFilters from './components/SearchFilters';
import SortControls from './components/SortControls';
import JobCard from './components/JobCard';
import JobListSkeleton from './components/JobListSkeleton';
import NoResults from './components/NoResults';
import Pagination from './components/Pagination';

import Button from '../../components/ui/Button';

const JobSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [filters, setFilters] = useState({
    keywords: '',
    location: '',
    jobTypes: [],
    salary: { min: 0, max: 0 },
    experienceLevel: '',
    industry: '',
    companySize: '',
    remoteOnly: false,
    postedToday: false
  });
  
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const resultsPerPage = 20;

  // Mock job data
  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: {
        name: "TechCorp Inc.",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center"
      },
      location: "San Francisco, CA",
      type: "full-time",
      remote: true,
      salary: { min: 120000, max: 160000 },
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      description: "We're looking for a Senior Frontend Developer to join our growing team. You'll work on cutting-edge web applications using React, TypeScript, and modern development tools.",
      skills: ["React", "TypeScript", "JavaScript", "CSS", "Node.js", "GraphQL"],
      industry: "technology",
      experienceLevel: "senior",
      companySize: "medium"
    },
    {
      id: 2,
      title: "Product Manager",
      company: {
        name: "InnovateLabs",
        logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=center"
      },
      location: "New York, NY",
      type: "full-time",
      remote: false,
      salary: { min: 130000, max: 180000 },
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      description: "Join our product team to drive the development of innovative solutions. You'll work closely with engineering, design, and business teams to deliver exceptional user experiences.",
      skills: ["Product Strategy", "Agile", "Analytics", "User Research", "Roadmapping"],
      industry: "technology",
      experienceLevel: "mid",
      companySize: "startup"
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: {
        name: "DesignStudio Pro",
        logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&crop=center"
      },
      location: "Los Angeles, CA",
      type: "contract",
      remote: true,
      salary: { min: 80000, max: 120000 },
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      description: "We're seeking a talented UX/UI Designer to create beautiful and intuitive user interfaces. You'll be responsible for the entire design process from research to final implementation.",
      skills: ["Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research"],
      industry: "media",
      experienceLevel: "mid",
      companySize: "small"
    },
    {
      id: 4,
      title: "Data Scientist",
      company: {
        name: "DataDriven Analytics",
        logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=center"
      },
      location: "Boston, MA",
      type: "full-time",
      remote: true,
      salary: { min: 110000, max: 150000 },
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      description: "Join our data science team to build predictive models and extract insights from large datasets. You\'ll work with cutting-edge ML technologies and collaborate with cross-functional teams.",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Statistics", "R"],
      industry: "technology",
      experienceLevel: "mid",
      companySize: "medium"
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: {
        name: "CloudFirst Solutions",
        logo: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=100&h=100&fit=crop&crop=center"
      },
      location: "Seattle, WA",
      type: "full-time",
      remote: false,
      salary: { min: 125000, max: 165000 },
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      description: "We're looking for a DevOps Engineer to help us scale our infrastructure and improve our deployment processes. You'll work with AWS, Kubernetes, and modern CI/CD tools.",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Python"],
      industry: "technology",
      experienceLevel: "senior",
      companySize: "large"
    },
    {
      id: 6,
      title: "Marketing Specialist",
      company: {
        name: "GrowthHackers Inc.",
        logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center"
      },
      location: "Chicago, IL",
      type: "part-time",
      remote: true,
      salary: { min: 50000, max: 70000 },
      postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      description: "Join our marketing team to drive growth through digital campaigns and content creation. You'll work on SEO, social media, and email marketing initiatives.",
      skills: ["Digital Marketing", "SEO", "Content Creation", "Analytics", "Social Media"],
      industry: "consulting",
      experienceLevel: "entry",
      companySize: "startup"
    }
  ];

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = mockJobs?.filter(job => {
      // Keywords filter
      if (filters?.keywords) {
        const keywords = filters?.keywords?.toLowerCase();
        const searchableText = `${job?.title} ${job?.company?.name} ${job?.description} ${job?.skills?.join(' ')}`?.toLowerCase();
        if (!searchableText?.includes(keywords)) return false;
      }

      // Location filter
      if (filters?.location && !job?.location?.toLowerCase()?.includes(filters?.location?.toLowerCase())) {
        return false;
      }

      // Job types filter
      if (filters?.jobTypes?.length > 0 && !filters?.jobTypes?.includes(job?.type)) {
        return false;
      }

      // Salary filter
      if (filters?.salary?.min > 0 && job?.salary?.max < filters?.salary?.min) return false;
      if (filters?.salary?.max > 0 && job?.salary?.min > filters?.salary?.max) return false;

      // Experience level filter
      if (filters?.experienceLevel && job?.experienceLevel !== filters?.experienceLevel) {
        return false;
      }

      // Industry filter
      if (filters?.industry && job?.industry !== filters?.industry) {
        return false;
      }

      // Company size filter
      if (filters?.companySize && job?.companySize !== filters?.companySize) {
        return false;
      }

      // Remote only filter
      if (filters?.remoteOnly && !job?.remote) return false;

      // Posted today filter
      if (filters?.postedToday) {
        const today = new Date();
        const posted = new Date(job.postedDate);
        const diffInHours = (today - posted) / (1000 * 60 * 60);
        if (diffInHours > 24) return false;
      }

      return true;
    });

    // Sort jobs
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.postedDate) - new Date(a.postedDate);
        case 'salary-high':
          return (b?.salary?.max || 0) - (a?.salary?.max || 0);
        case 'salary-low':
          return (a?.salary?.min || 0) - (b?.salary?.min || 0);
        case 'company':
          return a?.company?.name?.localeCompare(b?.company?.name);
        case 'title':
          return a?.title?.localeCompare(b?.title);
        default: // relevance
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs?.length / resultsPerPage);
  const paginatedJobs = filteredAndSortedJobs?.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // Initialize filters from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const initialFilters = { ...filters };
    
    if (urlParams?.get('q')) initialFilters.keywords = urlParams?.get('q');
    if (urlParams?.get('location')) initialFilters.location = urlParams?.get('location');
    if (urlParams?.get('remote') === 'true') initialFilters.remoteOnly = true;
    
    setFilters(initialFilters);
  }, [location?.search]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters?.keywords) params?.set('q', newFilters?.keywords);
    if (newFilters?.location) params?.set('location', newFilters?.location);
    if (newFilters?.remoteOnly) params?.set('remote', 'true');
    
    navigate(`${location?.pathname}?${params?.toString()}`, { replace: true });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      keywords: '',
      location: '',
      jobTypes: [],
      salary: { min: 0, max: 0 },
      experienceLevel: '',
      industry: '',
      companySize: '',
      remoteOnly: false,
      postedToday: false
    });
    setCurrentPage(1);
    navigate(location?.pathname, { replace: true });
  };

  // Handle save job
  const handleSaveJob = async (jobId) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSavedJobs(prev => {
        const newSaved = new Set(prev);
        if (newSaved?.has(jobId)) {
          newSaved?.delete(jobId);
        } else {
          newSaved?.add(jobId);
        }
        return newSaved;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if filters are applied
  const hasActiveFilters = Object.values(filters)?.some(value => {
    if (Array.isArray(value)) return value?.length > 0;
    if (typeof value === 'object' && value !== null) return value?.min > 0 || value?.max > 0;
    return Boolean(value);
  });

  return (
    <div className="min-h-screen bg-background">
      <RoleAdaptiveNavbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs className="mb-6" />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Find Your Next Opportunity</h1>
            <p className="text-text-secondary">
              Discover jobs that match your skills and career goals
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              iconName="Filter"
              iconSize={16}
              fullWidth
            >
              {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24">
                <SearchFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <SortControls
                sortBy={sortBy}
                onSortChange={setSortBy}
                resultsCount={filteredAndSortedJobs?.length}
                isLoading={isLoading}
              />

              {/* Job Results */}
              {isLoading ? (
                <JobListSkeleton count={6} />
              ) : filteredAndSortedJobs?.length === 0 ? (
                <NoResults
                  onClearFilters={handleClearFilters}
                  hasFilters={hasActiveFilters}
                />
              ) : (
                <>
                  <div className="space-y-6">
                    {paginatedJobs?.map((job) => (
                      <JobCard
                        key={job?.id}
                        job={job}
                        onSaveJob={handleSaveJob}
                        isSaved={savedJobs?.has(job?.id)}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={filteredAndSortedJobs?.length}
                    resultsPerPage={resultsPerPage}
                    isLoading={isLoading}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchResults;