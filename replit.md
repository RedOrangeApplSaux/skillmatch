# SkillMatch

## Overview

SkillMatch is a modern job search and matching platform built with React 18 and Vite. The application connects job seekers with opportunities through a comprehensive platform that includes job browsing, application tracking, and saved jobs functionality. The platform leverages Supabase as its backend-as-a-service for authentication, database management, and real-time features, providing a seamless experience for users to discover and apply for positions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18**: Modern React with concurrent features and improved rendering performance
- **Vite**: Lightning-fast build tool providing instant hot module replacement and optimized production builds
- **Redux Toolkit**: Centralized state management with simplified Redux patterns for handling application-wide state
- **React Router v6**: Client-side routing for single-page application navigation
- **Component Structure**: Modular component architecture with reusable UI components stored in `/src/components/` and page-level components in `/src/pages/`

### Styling and UI Framework
- **TailwindCSS**: Utility-first CSS framework with extensive customization through CSS variables
- **Custom Design System**: Comprehensive color palette defined through CSS custom properties for consistent theming
- **Component Styling**: Class Variance Authority (CVA) and clsx for conditional styling and component variants
- **Animations**: Framer Motion integration for smooth UI animations and transitions

### State Management and Data Flow
- **Custom Hooks**: Specialized hooks for data fetching (`useJobs`, `useApplications`, `useSavedJobs`) that encapsulate business logic
- **Authentication Context**: React Context API for managing user authentication state across the application
- **Local State**: Component-level state management with React hooks for UI interactions

### Form Management and User Interaction
- **React Hook Form**: Efficient form handling with built-in validation and performance optimization
- **Date Handling**: date-fns library for consistent date formatting and manipulation
- **User Experience**: Responsive design with mobile-first approach and accessibility considerations

### Development and Testing
- **Testing Suite**: Jest and React Testing Library for comprehensive component and integration testing
- **Development Tools**: Hot reloading, source maps, and development server with Vite
- **Code Quality**: ESLint and Prettier configurations for consistent code formatting

## External Dependencies

### Backend-as-a-Service
- **Supabase**: Primary backend service providing PostgreSQL database, real-time subscriptions, authentication, and API endpoints
- **Supabase Client**: JavaScript SDK for seamless integration with Supabase services

### Data Visualization
- **D3.js**: Powerful library for creating custom data visualizations and interactive charts
- **Recharts**: React-specific charting library built on D3 for easy integration of charts and graphs

### HTTP and API Communication
- **Axios**: HTTP client for making API requests with interceptors and request/response transformation
- **Environment Variables**: Secure configuration management for API keys and service endpoints

### UI and Icon Libraries
- **Lucide React**: Modern icon library providing consistent and scalable SVG icons
- **Radix UI**: Headless UI components for building accessible and customizable interface elements

### Utility Libraries
- **clsx**: Utility for constructing className strings conditionally
- **tailwind-merge**: Intelligent Tailwind CSS class merging to prevent style conflicts

### Development and Build Tools
- **PostCSS**: CSS processing with autoprefixer for cross-browser compatibility
- **TailwindCSS Plugins**: Extended functionality including forms, typography, animations, and container queries

### Third-party Integrations
- **Rocket.new**: External service integration for enhanced functionality (referenced in index.html)
- **DhiWise Component Tagger**: Development tool for component identification and organization