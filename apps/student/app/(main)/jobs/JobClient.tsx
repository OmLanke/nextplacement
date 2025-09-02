'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Search,
  Filter,
  Bookmark,
  Share2,
  Eye,
  ArrowRight,
  Briefcase,
  Users,
  Star,
  CheckCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import JobApplicationModal from '@/components/job-application-modal';
import { type InferSelectModel } from '@workspace/db/drizzle';
import { jobs, companies, resumes } from '@workspace/db/schema';

export type Job = InferSelectModel<typeof jobs> & {
  company: typeof companies.$inferSelect;
};

export type Resume = typeof resumes.$inferSelect;

export default function JobsPage({
  eligibleJobs,
  ineligibleJobs,
  resumes,
  studentId,
  appliedJobIds = [],
}: {
  eligibleJobs: Job[];
  ineligibleJobs: Job[];
  resumes: Resume[];
  studentId: number;
  appliedJobIds?: number[];
}) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'eligible' | 'ineligible'>('eligible');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [showLoadMore, setShowLoadMore] = useState(false);
  const allJobs = [...eligibleJobs, ...ineligibleJobs];

  useEffect(() => {
    filterJobs();
  }, [eligibleJobs, ineligibleJobs, activeTab, searchTerm, locationFilter, jobTypeFilter]);

  const filterJobs = () => {
    let base = activeTab === 'eligible' ? eligibleJobs : ineligibleJobs;
    let filtered = [...base];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Location filter
    if (locationFilter && locationFilter !== 'all') {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase()),
      );
    }

    // Job type filter (simplified - could be enhanced with job type field)
    if (jobTypeFilter && jobTypeFilter !== 'all') {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(jobTypeFilter.toLowerCase()),
      );
    }

    setFilteredJobs(filtered);
    setShowLoadMore(filtered.length > 6);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleLocationFilter = (value: string) => {
    setLocationFilter(value);
  };

  const handleJobTypeFilter = (value: string) => {
    setJobTypeFilter(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('all');
    setJobTypeFilter('all');
  };

  const displayedJobs = filteredJobs.slice(0, showLoadMore ? 6 : filteredJobs.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-xl text-gray-600">
            Find the perfect opportunity that matches your skills and aspirations
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="bg-white shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search jobs by title, company, or skills..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={locationFilter} onValueChange={handleLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="san francisco">On Site</SelectItem>
                    <SelectItem value="new york">Mumbai</SelectItem>
                    <SelectItem value="seattle">Delhi</SelectItem>
                    <SelectItem value="austin">Banglore</SelectItem>
                    <SelectItem value="los angeles">Gurgaon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={jobTypeFilter} onValueChange={handleJobTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="intern">Internship</SelectItem>
                    <SelectItem value="engineer">Engineering</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="designer">Design</SelectItem>
                    <SelectItem value="manager">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(searchTerm ||
              (locationFilter && locationFilter !== 'all') ||
              (jobTypeFilter && jobTypeFilter !== 'all')) && (
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <span className="text-sm text-gray-500">
                  {filteredJobs.length} of {allJobs.length} jobs
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-800">{allJobs.length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Companies</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {new Set(allJobs.map((job) => job.company.name)).size}
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remote Jobs</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {allJobs.filter((job) => job.location.toLowerCase().includes('remote')).length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                  <p className="text-3xl font-bold text-gray-800">$28/hr</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Select a category to view jobs</h2>
              <p className="text-sm text-gray-500">Switch between eligible and not eligible jobs based on your profile</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1">
                <Button
                  variant={activeTab === 'eligible' ? 'default' : 'ghost'}
                  size="sm"
                  className={`rounded-full px-5 ${activeTab === 'eligible' ? '' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('eligible')}
                >
                  Eligible
                  <span className={`ml-2 inline-flex items-center justify-center rounded-full text-xs px-2 py-0.5 ${activeTab === 'eligible' ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-700'}`}>
                    {eligibleJobs.length}
                  </span>
                </Button>
                <Button
                  variant={activeTab === 'ineligible' ? 'default' : 'ghost'}
                  size="sm"
                  className={`rounded-full px-5 ${activeTab === 'ineligible' ? '' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('ineligible')}
                >
                  Not Eligible
                  <span className={`ml-2 inline-flex items-center justify-center rounded-full text-xs px-2 py-0.5 ${activeTab === 'ineligible' ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-700'}`}>
                    {ineligibleJobs.length}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayedJobs.map((job) => (
            <Card
              key={job.id}
              className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-medium">{job.company.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Deadline: {job.applicationDeadline.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>Min CGPA: {job.minCGPA}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {activeTab === 'eligible' ? (
                      <JobApplicationModal
                        job={{ ...job, minCGPA: Number(job.minCGPA) }}
                        studentId={studentId}
                        resumes={resumes}
                        isApplied={appliedJobIds.includes(job.id)}
                      />
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Not Eligible
                      </Button>
                    )}
                    {job.link && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(job.link as string, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {showLoadMore && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8 py-3">
              Load More Jobs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search criteria or check back later for new opportunities
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
