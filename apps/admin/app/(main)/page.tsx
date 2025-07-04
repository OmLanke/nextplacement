import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@workspace/ui/components/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { db, companies, jobs } from '@workspace/db';
import { Plus, Building2, Briefcase, MapPin, DollarSign, Calendar, ExternalLink } from 'lucide-react';

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
  try {
    // First, let's test a simple query without relations
    const companiesOnly = await db.select().from(companies);
    console.log('Companies query successful:', companiesOnly.length);
    
    // Now try the relation query
    const result = await db.query.companies.findMany({ with: { jobs: true } });
    console.log('Full query successful:', result.length);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    // Fallback to companies only if the relation query fails
    const companiesOnly = await db.select().from(companies);
    return companiesOnly.map(company => ({ ...company, jobs: [] }));
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Companies Dashboard</h1>
              <p className="text-gray-600 text-lg">Manage companies and their job listings</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-5 h-5" />
                  Add New Company
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold">Add a new company</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Fill in the details below to add a new company to your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <form action={createCompany} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company Name *</label>
                    <Input name="name" placeholder="Enter company name" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Contact Email *</label>
                    <Input name="email" placeholder="contact@company.com" type="email" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Website</label>
                    <Input name="link" placeholder="https://company.com" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company Logo URL</label>
                    <Input name="imageURL" placeholder="https://example.com/logo.png" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <Textarea name="description" placeholder="Brief description of the company..." className="min-h-[80px] resize-none" />
                  </div>
                  <Button type="submit" className="w-full h-11 text-base font-medium">
                    Add Company
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Companies</p>
                    <p className="text-3xl font-bold text-gray-800">{data.length}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-3xl font-bold text-gray-800">{data.reduce((acc, company) => acc + company.jobs.length, 0)}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-3xl font-bold text-gray-800">{data.reduce((acc, company) => acc + company.jobs.filter(job => job.active).length, 0)}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Companies Section */}
        <section className="space-y-8">
          {data.length === 0 ? (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No companies yet</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first company</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Company
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-semibold">Add a new company</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Fill in the details below to add a new company to your dashboard.
                      </DialogDescription>
                    </DialogHeader>
                    <form action={createCompany} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Name *</label>
                        <Input name="name" placeholder="Enter company name" required className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Contact Email *</label>
                        <Input name="email" placeholder="contact@company.com" type="email" required className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Website</label>
                        <Input name="link" placeholder="https://company.com" className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Logo URL</label>
                        <Input name="imageURL" placeholder="https://example.com/logo.png" className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <Textarea name="description" placeholder="Brief description of the company..." className="min-h-[80px] resize-none" />
                      </div>
                      <Button type="submit" className="w-full h-11 text-base font-medium">
                        Add Company
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            data.map((company) => (
              <Card key={company.id} className="bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-800">{company.name}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{company.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {company.jobs.length} job{company.jobs.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  {company.description && company.description !== 'N/A' && (
                    <p className="text-sm text-gray-600 mt-3">{company.description}</p>
                  )}
                </CardHeader>
                
                <Separator />
                
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-700">Job Listings</h3>
                    <Link href={`/jobs/new?companyId=${company.id}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Add Job
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {company.jobs.length > 0 ? (
                      company.jobs.map((job) => (
                        <Card key={job.id} className="group hover:shadow-lg transition-all duration-200 border border-gray-200 bg-gray-50 hover:bg-white">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-gray-800 text-sm leading-tight line-clamp-2">{job.title}</h4>
                                <Badge 
                                  variant={job.active ? "default" : "secondary"} 
                                  className={`text-xs ${job.active ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500'}`}
                                >
                                  {job.active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2">
                                {job.location && job.location !== 'N/A' && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{job.location}</span>
                                  </div>
                                )}
                                
                                {job.salary && job.salary !== 'N/A' && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <DollarSign className="w-3 h-3" />
                                    <span className="truncate">{job.salary}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>Deadline: {job.applicationDeadline.toLocaleDateString()}</span>
                                </div>
                              </div>
                              
                              {job.link && (
                                <div className="pt-2">
                                  <a 
                                    href={job.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium group-hover:underline"
                                  >
                                    View Job
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
                          <h4 className="text-lg font-medium text-gray-700 mb-2">No jobs yet</h4>
                          <p className="text-gray-500 mb-4">This company doesn't have any job listings</p>
                          <Link href={`/jobs/new?companyId=${company.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Add First Job
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
