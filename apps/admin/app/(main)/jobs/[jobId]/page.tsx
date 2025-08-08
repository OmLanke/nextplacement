import { db, jobs, companies, applications, students } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@workspace/ui/components/table';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Calendar, 
  GraduationCap, 
  Building2, 
  ExternalLink,
  Users,
  FileText,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import StatusSelect from './StatusSelect';

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId: jobIdParam } = await params;
  const jobId = Number(jobIdParam);
  if (isNaN(jobId)) notFound();

  const jobRes = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  if (jobRes.length === 0 || !jobRes[0]) notFound();
  const job = jobRes[0];

  const companyRes = await db
    .select()
    .from(companies)
    .where(eq(companies.id, job.companyId))
    .limit(1);
  const company = companyRes[0];

  const applicants = await db
    .select({
      applicationId: applications.id,
      status: applications.status,
      firstName: students.firstName,
      lastName: students.lastName,
      email: students.email,
      studentId: students.id,
    })
    .from(applications)
    .leftJoin(students, eq(applications.studentId, students.id))
    .where(eq(applications.jobId, jobId));

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/jobs">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
              <p className="text-sm text-gray-600">View and manage job information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Job Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                      {company?.imageURL ? (
                        <img
                          src={company.imageURL}
                          alt={company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-gray-600">
                        {company?.name ?? 'Unknown Company'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={job.active ? 'default' : 'secondary'}
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
              <CardContent className="space-y-6">
                {/* Key Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Salary</p>
                      <p className="text-sm text-gray-600">{job.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Application Deadline</p>
                      <p className="text-sm text-gray-600">
                        {job.applicationDeadline.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Applications</p>
                      <p className="text-sm text-gray-600">{applicants.length} students</p>
                    </div>
                  </div>
                </div>

                {/* Job Link */}
                <div className="pt-4 border-t border-gray-100">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-red-600 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Job on Company Website
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Academic Requirements */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-600" />
                  Academic Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">{job.minCGPA}</p>
                    <p className="text-sm text-gray-600">Minimum CGPA</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{job.minSSC}%</p>
                    <p className="text-sm text-gray-600">Minimum SSC</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-700">{job.minHSC}%</p>
                    <p className="text-sm text-gray-600">Minimum HSC</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      job.allowDeadKT ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        job.allowDeadKT ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm font-medium">
                      Dead KT: {job.allowDeadKT ? 'Allowed' : 'Not Allowed'}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      job.allowLiveKT ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        job.allowLiveKT ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm font-medium">
                      Live KT: {job.allowLiveKT ? 'Allowed' : 'Not Allowed'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Information */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-600" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {company?.imageURL ? (
                      <img
                        src={company.imageURL}
                        alt={company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{company?.name}</p>
                    <p className="text-sm text-gray-600">{company?.email}</p>
                  </div>
                </div>
                {company?.description && (
                  <p className="text-sm text-gray-600">{company.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Job Timeline */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{job.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{job.updatedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Application Deadline</span>
                  <span className="font-medium">
                    {job.applicationDeadline.toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Applications Section */}
        <div className="mt-12">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                Student Applications ({applicants.length})
              </CardTitle>
              <CardDescription>
                View all students who have applied for this position
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applicants.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600">
                    Students will appear here once they apply for this job.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-medium text-gray-700">Name</TableHead>
                        <TableHead className="font-medium text-gray-700">Email</TableHead>
                        <TableHead className="font-medium text-gray-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicants.map((applicant) => (
                        <TableRow key={applicant.applicationId} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {`${applicant.firstName ?? ''} ${applicant.lastName ?? ''}`.trim() ||
                              'Unknown'}
                          </TableCell>
                          <TableCell className="text-gray-600">{applicant.email}</TableCell>
                          <TableCell>
                            <StatusSelect
                              applicationId={applicant.applicationId}
                              initialStatus={applicant.status}
                              studentId={applicant.studentId ?? 0}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 