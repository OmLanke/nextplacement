import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@workspace/ui/components/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { db, companies, jobs } from '@workspace/db';

async function createCompany(formData: FormData) {
  'use server';
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const link = String(formData.get('link') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || 'N/A';
  const imageURL =
    String(formData.get('imageURL') ?? '').trim() ||
    'https://via.placeholder.com/200x200?text=Company';

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
  const imageURL =
    String(formData.get('jobImageURL') ?? '').trim() ||
    'https://via.placeholder.com/100x100?text=Job';
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

async function getDashboardData() {
  return await db.query.companies.findMany({ with: { jobs: true } });
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-16 px-4 md:px-16 py-8 bg-white min-h-screen">
      <section className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Companies Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Company</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new company</DialogTitle>
              <DialogDescription>Fill in the details below to add a new company.</DialogDescription>
            </DialogHeader>
            <form action={createCompany} className="grid gap-4 py-4">
              <Input name="name" placeholder="Company name" required />
              <Input name="email" placeholder="Contact email" type="email" required />
              <Input name="link" placeholder="Website / careers link" />
              <Input name="imageURL" placeholder="Image URL" />
              <Textarea name="description" placeholder="Short description" />
              <Button type="submit">Add Company</Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-12">
        {data.map((company) => (
          <div key={company.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">{company.name}</h2>
            <div className="flex flex-wrap gap-4">
              {company.jobs.length > 0 ? (
                company.jobs.map((job) => (
                  <Card key={job.id} className="w-48 p-4 border border-gray-200 bg-gray-50">
                    <CardContent className="space-y-1">
                      <div className="text-md font-medium text-gray-800 truncate">{job.title}</div>
                      <div className="text-sm text-gray-500 truncate">{job.location}</div>
                      <div className="text-sm text-gray-400 truncate">{job.salary}</div>
                      <div className={`text-xs mt-2 px-2 py-1 rounded ${job.active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{job.active ? 'Active' : 'Inactive'}</div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="w-48 h-24 flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-300">
                  No jobs
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export const dynamic = 'force-dynamic';
