# Student Dashboard - NextPlacement

A modern, student-focused dashboard for job discovery and application management.

## 🎨 Design Philosophy

The student dashboard has been completely redesigned with a different UI/UX approach compared to the admin dashboard:

- **Student-Centric**: Focused on job discovery and career opportunities
- **Modern & Engaging**: Gradient backgrounds, interactive cards, and smooth animations
- **Mobile-First**: Responsive design that works perfectly on all devices
- **Intuitive Navigation**: Clear, student-focused navigation structure

## 🚀 Features

### 1. **Hero Section**
- Inspirational messaging focused on career discovery
- Call-to-action buttons for job browsing and saved jobs
- Gradient background with engaging visuals

### 2. **Statistics Dashboard**
- Real-time stats showing active companies, open positions, student count
- Visual indicators with icons and color-coded metrics
- Success rate tracking

### 3. **Featured Companies**
- Showcase of top companies with active job postings
- Company cards with job previews
- Quick access to company-specific job listings

### 4. **Recent Job Opportunities**
- Latest job postings from all companies
- Detailed job cards with company information
- Quick apply functionality with resume selection

### 5. **Job Applications Tracking**
- Comprehensive view of all submitted applications
- Status tracking (Pending, Under Review, Accepted, Rejected)
- Application history with company and job details

### 6. **Student Profile Management**
- Complete profile information management
- Academic details and skills showcase
- Resume upload and management
- Social media links integration

## 🛠 Technical Implementation

### Backend Integration
- **Database Schema**: Uses the existing schema with `students`, `jobs`, `companies`, `applications`, and `resumes` tables
- **Server Actions**: New actions for job applications, profile management, and data fetching
- **Real-time Data**: Dynamic data fetching with proper error handling

### Key Components

#### 1. **Layout (`layout.tsx`)**
- Student-specific navigation with blue color scheme
- Responsive design with mobile menu
- Profile dropdown with student information

#### 2. **Dashboard (`page.tsx`)**
- Hero section with career-focused messaging
- Statistics cards with real data
- Featured companies showcase
- Recent job opportunities grid

#### 3. **Applications (`applications/page.tsx`)**
- Application status tracking
- Detailed application history
- Export functionality
- Status-based filtering

#### 4. **Profile (`profile/page.tsx`)**
- Comprehensive profile management
- Academic information display
- Skills showcase
- Resume management

#### 5. **Jobs (`jobs/page.tsx`)**
- Job browsing with search and filters
- Detailed job cards
- Application modal integration
- Company information display

#### 6. **Job Application Modal (`components/job-application-modal.tsx`)**
- Interactive application form
- Resume selection
- Real-time validation
- Success/error messaging

## 🎯 Key Differences from Admin Dashboard

| Aspect | Admin Dashboard | Student Dashboard |
|--------|----------------|-------------------|
| **Color Scheme** | Red/Pink gradients | Blue/Indigo gradients |
| **Navigation** | Admin-focused (Dashboard, Students, Jobs) | Student-focused (Home, Applications, Profile) |
| **Layout** | Data-heavy, management-focused | Career-focused, opportunity-driven |
| **Interactions** | CRUD operations, data management | Job discovery, applications, profile management |
| **Visual Style** | Professional, corporate | Modern, engaging, student-friendly |

## 🔧 Backend Actions

### New Server Actions Added:

1. **`applyForJob(jobId, studentId, resumeId)`**
   - Handles job application submission
   - Prevents duplicate applications
   - Updates application status

2. **`getStudentApplications(studentId)`**
   - Fetches all applications for a student
   - Includes job and company details
   - Status tracking

3. **`getStudentProfile(studentId)`**
   - Retrieves complete student profile
   - Includes grades, resumes, internships

4. **`updateStudentProfile(studentId, data)`**
   - Updates student profile information
   - Handles validation and error cases

5. **`getAvailableJobs()`**
   - Fetches all active job postings
   - Includes company information

6. **`getFeaturedCompanies()`**
   - Gets top companies with active jobs
   - Sorted by job count

## 🎨 UI Components Used

- **Cards**: For job listings, company showcases, and profile sections
- **Buttons**: Various styles for different actions
- **Badges**: Status indicators and skill tags
- **Dialogs**: Application modals and confirmations
- **Forms**: Profile editing and application submission
- **Icons**: Lucide React icons for visual consistency

## 🚀 Getting Started

1. **Installation**: The dashboard is part of the monorepo structure
2. **Database**: Ensure the database schema is up to date
3. **Authentication**: Student authentication should be configured
4. **Development**: Run the student app with `pnpm dev` in the student directory

## 📱 Responsive Design

The dashboard is fully responsive with:
- Mobile-first approach
- Tablet-optimized layouts
- Desktop-enhanced features
- Touch-friendly interactions

## 🔮 Future Enhancements

- **Real-time Notifications**: WebSocket integration for application updates
- **Advanced Filtering**: More sophisticated job search and filtering
- **Resume Builder**: Integrated resume creation tool
- **Interview Scheduling**: Calendar integration for interviews
- **Analytics Dashboard**: Personal application analytics
- **Social Features**: Student networking and recommendations

## 🎯 User Experience Goals

1. **Easy Job Discovery**: Students can quickly find relevant opportunities
2. **Simple Application Process**: Streamlined job application workflow
3. **Clear Status Tracking**: Transparent application status updates
4. **Profile Management**: Easy profile updates and maintenance
5. **Mobile Accessibility**: Full functionality on mobile devices

This student dashboard provides a modern, engaging experience that helps students discover career opportunities and manage their job applications effectively. 