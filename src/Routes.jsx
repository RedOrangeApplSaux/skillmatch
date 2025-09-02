import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import JobSeekerDashboard from './pages/job-seeker-dashboard';
import JobDetails from './pages/job-details';
import EmployerDashboard from './pages/employer-dashboard';
import JobSearchResults from './pages/job-search-results';
import ApplicationTracking from './pages/application-tracking';
import Register from './pages/register';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ApplicationTracking />} />
        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path="/job-details" element={<JobDetails />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/job-search-results" element={<JobSearchResults />} />
        <Route path="/application-tracking" element={<ApplicationTracking />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
