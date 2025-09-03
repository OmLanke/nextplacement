import { db, jobs, companies } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  GraduationCap, 
  Building2, 
  ExternalLink,
  Plus,
  Filter,
  Briefcase
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getAllJobsWithCompany() {
  return await db.query.jobs.findMany({
    with: { company: true },
  });
}

export default async function JobsListPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; status?: string; companyId?: string }>;
}) {
  const jobsWithCompany = await getAllJobsWithCompany();
  const companiesList = await db.query.companies.findMany({ columns: { id: true, name: true } });

  // Await searchParams before accessing its properties
  const params = await searchParams;
  
  const q = (params?.q ?? '').toLowerCase();
  const status = params?.status ?? 'all';
  const companyId = Number(params?.companyId ?? '0');

  const filteredJobs = jobsWithCompany.filter((job) => {
    if (status === 'active' && !job.active) return false;
    if (status === 'inactive' && job.active) return false;
    if (!Number.isNaN(companyId) && companyId > 0 && job.companyId !== companyId) return false;
    if (q) {
      const hay = `${job.title} ${job.company?.name ?? ''} ${job.location}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">Job Listings</h1>
              <p className="text-gray-600">Manage and monitor all job opportunities</p>
            </div>
            <Link href="/jobs/new">
              <Button className="bg-blue-700 hover:bg-red-600 text-white transition-colors duration-200 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Job
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <form className="flex flex-wrap items-end gap-3" method="get">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="q"
                defaultValue={params?.q ?? ''}
                placeholder="Search by title, company, or location"
                className="pl-10 h-11 w-[320px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                name="status"
                defaultValue={status}
                className="h-11 w-[160px] rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <select
                name="companyId"
                defaultValue={params?.companyId ?? ''}
                className="h-11 w-[220px] rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Companies</option>
                {companiesList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="h-11">Apply</Button>
            <Link href="/jobs" className="h-11 inline-flex items-center justify-center rounded-md border px-4 text-sm text-gray-700 border-gray-300">
              Reset
            </Link>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 ml-auto">
              {filteredJobs.length} / {jobsWithCompany.length} Jobs
            </Badge>
          </form>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {jobsWithCompany.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first job listing</p>
            <Link href="/jobs/new">
              <Button className="bg-blue-700 hover:bg-red-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create First Job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Card Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {job.company?.imageURL ? (
                          <img 
                            src={job.company.imageURL} 
                            alt={job.company.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 font-medium">
                          {job.company?.name ?? 'Unknown Company'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={job.active ? "default" : "secondary"}
                      className={`${
                        job.active 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {job.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>

                {/* Card Content */}
                <CardContent className="space-y-4">
                  {/* Key Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Deadline: {job.applicationDeadline.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Academic Requirements */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      Requirements
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>CGPA: {job.minCGPA}</div>
                      <div>SSC: {job.minSSC}%</div>
                      <div>HSC: {job.minHSC}%</div>
                      <div className="col-span-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          job.allowDeadKT ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          Dead KT: {job.allowDeadKT ? 'Allowed' : 'Not Allowed'}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded text-xs ml-1 ${
                          job.allowLiveKT ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          Live KT: {job.allowLiveKT ? 'Allowed' : 'Not Allowed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job Link */}
                  <div className="pt-2">
                    <a 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-red-600 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Job Details
                    </a>
                  </div>

                  {/* Description Preview */}
                  {job.description && (
                    <div className="pt-2">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Created: {job.createdAt.toLocaleDateString()}</span>
                      <span>Updated: {job.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                  <Link href={`/jobs/${job.id}`}>
                    <Button 
                      variant="outline" 
                      className="w-full bg-blue-700 text-white border-blue-700 hover:bg-red-600 hover:border-red-600 transition-colors duration-200"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 