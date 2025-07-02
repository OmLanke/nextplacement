import { db, jobs, companies } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';

export const dynamic = 'force-dynamic';

async function getAllJobsWithCompany() {
  const allJobs = await db.select().from(jobs);
  const allCompanies = await db.select().from(companies);
  return allJobs.map(job => ({
    ...job,
    company: allCompanies.find(c => c.id === job.companyId) || null,
  }));
}

export default async function JobsListPage() {
  const jobsWithCompany = await getAllJobsWithCompany();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold mb-6">All Jobs</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobsWithCompany.length === 0 && (
          <p className="text-muted-foreground">No jobs found.</p>
        )}
        {jobsWithCompany.map((job) => (
          <Card key={job.id} className="flex flex-col bg-white text-black border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{job.title}</span>
                <span className="ml-auto text-xs px-2 py-1 rounded bg-gray-100 border text-gray-600">
                  {job.active ? 'Active' : 'Inactive'}
                </span>
              </CardTitle>
              <CardDescription>
                <span>Company: {job.company?.name ?? 'Unknown'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <img src={job.company?.imageURL} alt={job.company?.name} className="w-10 h-10 rounded object-cover border" />
                <div>
                  <div className="font-semibold">{job.company?.name}</div>
                  <div className="text-xs text-gray-500">{job.company?.email}</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm"><strong>Location:</strong> {job.location}</div>
                <div className="text-sm"><strong>Salary:</strong> {job.salary}</div>
                <div className="text-sm"><strong>Deadline:</strong> {job.applicationDeadline.toLocaleDateString()}</div>
                <div className="text-sm"><strong>Min CGPA:</strong> {job.minCGPA}</div>
                <div className="text-sm"><strong>Min SSC:</strong> {job.minSSC}</div>
                <div className="text-sm"><strong>Min HSC:</strong> {job.minHSC}</div>
                <div className="text-sm"><strong>Allow Dead KT:</strong> {job.allowDeadKT ? 'Yes' : 'No'}</div>
                <div className="text-sm"><strong>Allow Live KT:</strong> {job.allowLiveKT ? 'Yes' : 'No'}</div>
                <div className="text-sm"><strong>Job Link:</strong> <a href={job.link} target="_blank" rel="noopener noreferrer" className="underline text-primary">{job.link}</a></div>
                <div className="text-sm"><strong>Description:</strong> <span className="whitespace-pre-line">{job.description}</span></div>
                <div className="text-xs text-gray-400 mt-2">Created: {job.createdAt.toLocaleDateString()} | Updated: {job.updatedAt.toLocaleDateString()}</div>
              </div>
            </CardContent>
            <div className="p-4 pt-0 mt-auto flex gap-2">
              <Link href={`/jobs/${job.id}`}>
                <Button variant="outline" className="bg-white text-primary border-primary">View Details</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 