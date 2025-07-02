import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { db, companies, jobs } from '@workspace/db';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@workspace/ui/components/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';

// -----------------------
// Server Actions
// -----------------------

async function createCompany(formData: FormData) {
  'use server';
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const link = String(formData.get('link') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || 'N/A';
  const imageURL = String(formData.get('imageURL') ?? '').trim() || 'https://via.placeholder.com/200x200?text=Company';

  if (!name) return;

  await db.insert(companies).values({ name, email, link, description, imageURL });
  revalidatePath('/');
}

async function createJob(formData: FormData) {
  'use server';
  const companyId = Number(formData.get('companyId'));
  const title = String(formData.get('title') ?? '').trim();
  const link = String(formData.get('jobLink') ?? '').trim();
  const description = String(formData.get('jobDescription') ?? '').trim() || 'N/A';
  const location = String(formData.get('location') ?? '').trim() || 'N/A';
  const imageURL = String(formData.get('jobImageURL') ?? '').trim() || 'https://via.placeholder.com/100x100?text=Job';
  const salary = String(formData.get('salary') ?? '').trim() || 'N/A';
  const deadlineRaw = formData.get('deadline');
  const applicationDeadline = deadlineRaw ? new Date(String(deadlineRaw)) : new Date();

  if (!companyId || !title) return;

  await db.insert(jobs).values({
    companyId,
    title,
    link,
    description,
    location,
    imageURL,
    salary,
    applicationDeadline,
    active: true,
  });
  revalidatePath('/');
}

// -----------------------
// Component Helpers
// -----------------------

async function getDashboardData() {
  const comps = await db.select().from(companies);
  const allJobs = await db.select().from(jobs);

  return comps.map((comp) => ({
    ...comp,
    jobs: allJobs.filter((j) => j.companyId === comp.id),
  }));
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-12">
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-0">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-1">Companies Dashboard</h1>
          <p className="text-gray-500 text-lg">Manage companies and their job openings.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600 transition">Add New Company</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new company</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new company to the portal.
              </DialogDescription>
            </DialogHeader>
            <form action={createCompany} className="grid grid-cols-1 gap-4 py-4">
              <Input name="name" placeholder="Company name" required />
              <Input name="email" placeholder="Contact email" type="email" required />
              <Input name="link" placeholder="Website / careers link" />
              <Input name="imageURL" placeholder="Image URL" />
              <Textarea name="description" placeholder="Short description" />
              <Button type="submit" className="w-fit bg-blue-600 text-white hover:bg-blue-700">Add Company</Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-8">
        {data.length === 0 && <Card className="p-10 text-gray-400 text-center shadow-lg border border-gray-200 bg-white">No companies yet. Add your first company to get started!</Card>}

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.map((company) => (
            <Card key={company.id} className="flex flex-col shadow-xl border-l-8 border-blue-400 border border-gray-200 bg-white rounded-2xl overflow-hidden">
              <CardHeader className="p-6 pb-2 flex flex-row items-center gap-4">
                <img src={company.imageURL} alt={company.name} className="w-16 h-16 rounded-xl border-2 border-blue-200 object-cover shadow" />
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-blue-700">{company.name}</h3>
                  <a href={company.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{company.link}</a>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-2 space-y-3">
                <div className="text-gray-500 text-sm mb-2">{company.description}</div>
                <h4 className="font-semibold text-gray-700 mb-1">Open Positions</h4>
                {company.jobs.length === 0 && <p className="text-sm text-gray-400">No jobs yet.</p>}
                <div className="flex flex-col gap-2">
                  {company.jobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`} className="flex justify-between items-center p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
                      <span className="font-medium text-gray-800">{job.title}</span>
                      <Badge variant={job.active ? "secondary" : "outline"} className={job.active ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}>{job.active ? "Active" : "Inactive"}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="add-job">
                    <AccordionTrigger className="px-6 text-blue-700 hover:text-blue-900 font-semibold">
                      Add New Job
                    </AccordionTrigger>
                    <AccordionContent className="p-6 bg-blue-50 border-t border-blue-100">
                      <form action={createJob} className="flex flex-col w-full gap-3">
                        <input type="hidden" name="companyId" value={company.id} />
                        <Input name="title" placeholder="Job title" required />
                        <Input name="jobLink" placeholder="Job link" />
                        <Input name="location" placeholder="Location" />
                        <Input name="salary" placeholder="Salary" />
                        <Input name="deadline" type="date" />
                        <Textarea name="jobDescription" placeholder="Job description" />
                        <Button type="submit" size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition self-start">Add Job</Button>
                      </form>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export const dynamic = 'force-dynamic';
