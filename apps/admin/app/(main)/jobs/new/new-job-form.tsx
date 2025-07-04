'use client';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { jobSchema, JobFormData } from './schema';
import { createJob, createCompany } from './actions';
import { Popover, PopoverTrigger, PopoverContent } from '@workspace/ui/components/popover';
import { Calendar } from '@workspace/ui/components/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

function NewJobForm({ companies }: { companies: { id: number; name: string }[] }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [addingCompany, setAddingCompany] = useState(false);
  const [companyList, setCompanyList] = useState(companies);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyEmail, setNewCompanyEmail] = useState('');
  const [newCompanyLink, setNewCompanyLink] = useState('');
  const [newCompanyDescription, setNewCompanyDescription] = useState('');
  const [newCompanyImageURL, setNewCompanyImageURL] = useState('');
  const [companyError, setCompanyError] = useState<string | null>(null);
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyId: companies[0]?.id ?? 0,
      title: '',
      link: '',
      description: '',
      location: '',
      imageURL: '',
      salary: '',
      applicationDeadline: new Date(),
      minCGPA: 0,
      minSSC: 0,
      minHSC: 0,
      allowDeadKT: true,
      allowLiveKT: true,
    },
  });

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await createJob(formData);
      if (result?.success) {
        setSuccess(true);
        form.reset(form.formState.defaultValues);
      } else {
        setError(result?.error || 'Failed to create job');
      }
    });
  }

  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault();
    setCompanyError(null);
    if (!newCompanyName.trim() || !newCompanyEmail.trim() || !newCompanyLink.trim() || !newCompanyDescription.trim()) return;
    setAddingCompany(true);
    const formData = new FormData();
    formData.append('name', newCompanyName.trim());
    formData.append('email', newCompanyEmail.trim());
    formData.append('link', newCompanyLink.trim());
    formData.append('description', newCompanyDescription.trim());
    formData.append('imageURL', newCompanyImageURL.trim());
    const result = await createCompany(formData);
    if (result?.success && result.company) {
      setCompanyList((prev) => [...prev, result.company]);
      form.setValue('companyId', result.company.id);
      setNewCompanyName('');
      setNewCompanyEmail('');
      setNewCompanyLink('');
      setNewCompanyDescription('');
      setNewCompanyImageURL('');
      setShowModal(false);
    } else {
      setCompanyError(result?.error || 'Failed to add company');
    }
    setAddingCompany(false);
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create a New Job</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form action={handleSubmit} className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <Select onValueChange={(val) => field.onChange(val)} value={String(field.value || '')}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Link *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://company.com/job" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Job description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary *</FormLabel>
                      <FormControl>
                        <Input placeholder="Salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicationDeadline"
                  render={({ field }) => {
                    const getDisplayDate = (value: string) => {
                      if (!value) return '';
                      try {
                        return format(new Date(value), 'PPP');
                      } catch {
                        return value;
                      }
                    };
                    const selectedDate = field.value ? new Date(field.value) : undefined;
                    // Use a local handler to ensure immediate update
                    const handleSelect = (date: Date | undefined) => {
                      // Use setTimeout to ensure the onChange is processed after popover closes
                      setTimeout(() => {
                        if (date) {
                          field.onChange(date.toISOString().slice(0, 10));
                        } else {
                          field.onChange('');
                        }
                      }, 0);
                    };
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Application Deadline *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                type="button"
                              >
                                {getDisplayDate(typeof field.value === 'string' ? field.value : '') || <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleSelect}
                              captionLayout="dropdown"
                              key={typeof field.value === 'string' ? field.value : 'empty'}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="minCGPA"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min CGPA</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minSSC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min SSC %</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minHSC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min HSC %</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="allowDeadKT"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allow Dead KT</FormLabel>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowLiveKT"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allow Live KT</FormLabel>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {success && <div className="text-green-600">Job created successfully!</div>}
                {error && <div className="text-red-600">{error}</div>}
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Creating...' : 'Create Job'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NewJobForm;
