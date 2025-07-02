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
    <div className="container mx-auto py-10 space-y-10">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Companies Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage companies and their job openings.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Add New Company</Button>
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
              <Button type="submit" className="w-fit">Add Company</Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-6">
        {data.length === 0 && <Card className="p-10 text-muted-foreground text-center shadow-lg border-border bg-card">No companies yet. Add your first company to get started!</Card>}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((company) => (
            <Card key={company.id} className="flex flex-col shadow-xl border border-border bg-card rounded-2xl overflow-hidden">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-4">
                  <img src={company.imageURL} alt={company.name} className="w-14 h-14 rounded-xl border-2 border-border object-cover" />
                  <div>
                    <h3 className="font-bold text-lg">{company.name}</h3>
                    <a href={company.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{company.link}</a>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-2 space-y-3">
                <h4 className="font-semibold text-muted-foreground">Open Positions</h4>
                {company.jobs.length === 0 && <p className="text-sm text-muted-foreground/80">No jobs yet.</p>}
                {company.jobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} className="flex justify-between items-center p-3 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border">
                    <span>{job.title}</span>
                    <Badge variant={job.active ? "secondary" : "outline"}>{job.active ? "Active" : "Inactive"}</Badge>
                  </Link>
                ))}
              </CardContent>
              <CardFooter className="mt-auto p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="add-job">
                    <AccordionTrigger className="px-6 text-primary hover:text-primary/90 font-semibold">
                      Add New Job
                    </AccordionTrigger>
                    <AccordionContent className="p-6 bg-background border-t">
                      <form action={createJob} className="flex flex-col w-full gap-3">
                        <input type="hidden" name="companyId" value={company.id} />
                        <Input name="title" placeholder="Job title" required />
                        <Input name="jobLink" placeholder="Job link" />
                        <Input name="location" placeholder="Location" />
                        <Input name="salary" placeholder="Salary" />
                        <Input name="deadline" type="date" />
                        <Textarea name="jobDescription" placeholder="Job description" />
                        <Button type="submit" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors self-start">Add Job</Button>
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
