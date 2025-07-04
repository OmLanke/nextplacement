import { db, jobs, companies } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';

export const dynamic = 'force-dynamic';

async function getAllJobsWithCompany() {
  return await db.query.jobs.findMany({
    with: { company: true },
  });
}

export default async function JobsListPage() {
  const jobsWithCompany = await getAllJobsWithCompany();

  return (
    <div className="py-10 space-y-8 bg-[#f8fafc] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">All Jobs</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {jobsWithCompany.length === 0 && (
          <p className="text-gray-400">No jobs found.</p>
        )}
        {jobsWithCompany.map((job) => (
          <Card key={job.id} className="flex flex-col bg-white text-[#1e293b] border-l-8 border-blue-500 border border-gray-200 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{job.title}</span>
                <span className={`ml-auto text-xs px-2 py-1 rounded font-semibold ${job.active ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
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
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div><strong>Location:</strong> {job.location}</div>
                <div><strong>Salary:</strong> {job.salary}</div>
                <div><strong>Deadline:</strong> {job.applicationDeadline.toLocaleDateString()}</div>
                <div><strong>Min CGPA:</strong> {job.minCGPA}</div>
                <div><strong>Min SSC:</strong> {job.minSSC}</div>
                <div><strong>Min HSC:</strong> {job.minHSC}</div>
                <div><strong>Dead KT:</strong> {job.allowDeadKT ? 'Yes' : 'No'}</div>
                <div><strong>Live KT:</strong> {job.allowLiveKT ? 'Yes' : 'No'}</div>
              </div>
              <div className="text-sm mt-2"><strong>Job Link:</strong> <a href={job.link} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-red-600">{job.link}</a></div>
              <div className="text-sm"><strong>Description:</strong> <span className="whitespace-pre-line">{job.description}</span></div>
              <div className="text-xs text-gray-400 mt-2">Created: {job.createdAt.toLocaleDateString()} | Updated: {job.updatedAt.toLocaleDateString()}</div>
            </CardContent>
            <div className="p-4 pt-0 mt-auto flex gap-2">
              <Link href={`/jobs/${job.id}`}>
                <Button variant="outline" className="bg-blue-700 text-white border-blue-700 hover:bg-red-600 hover:border-red-600 transition">View Details</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 