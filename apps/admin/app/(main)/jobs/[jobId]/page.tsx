import { db, jobs, companies, applications, students } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@workspace/ui/components/table';

interface JobPageProps {
  params: { jobId: string };
}

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({ params }: JobPageProps) {
  const jobId = Number(params.jobId);
  if (isNaN(jobId)) notFound();

  const jobRes = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  if (jobRes.length === 0 || !jobRes[0]) notFound();
  const job = jobRes[0];

  const companyRes = await db.select().from(companies).where(eq(companies.id, job.companyId)).limit(1);
  const company = companyRes[0];

  const applicants = await db
    .select({
      applicationId: applications.id,
      status: applications.status,
      firstName: students.firstName,
      lastName: students.lastName,
      email: students.email,
    })
    .from(applications)
    .leftJoin(students, eq(applications.studentId, students.id))
    .where(eq(applications.jobId, jobId));

  return (
    <div className="container mx-auto py-10 space-y-10">
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>Company: {company?.name ?? 'Unknown'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm"><strong>Location:</strong> {job.location}</p>
          <p className="text-sm"><strong>Salary:</strong> {job.salary}</p>
          <p className="text-sm"><strong>Deadline:</strong> {job.applicationDeadline.toLocaleDateString()}</p>
          <p className="whitespace-pre-line mt-4">{job.description}</p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Students Applied</h2>
        {applicants.length === 0 ? (
          <p className="text-muted-foreground text-sm">No applications yet.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((a) => (
                  <TableRow key={a.applicationId}>
                    <TableCell>{`${a.firstName ?? ''} ${a.lastName ?? ''}`.trim()}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell className="capitalize">{a.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
} 